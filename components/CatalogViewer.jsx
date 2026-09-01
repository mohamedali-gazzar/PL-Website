"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

const meta = (c) => ({
  product_name: c.productName,
  product_slug: c.slug,
  catalog_name: c.title,
  page_path: typeof location !== "undefined" ? location.pathname : "",
});

/**
 * One page of the catalogue. Sized by CSS to fill the viewport height (see the
 * width rule below — width follows from the available height × the page aspect,
 * capped to the screen width on mobile), so a whole page fills the reader. Its
 * gated image lazy-loads with a spinner and error/retry; the slot's aspect-ratio
 * reserves height before the image loads (no layout shift / correct scrollbar).
 */
function CatalogPage({ slug, n, title }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const url = `/api/catalog/page/${slug}/${n}${attempt ? `?r=${attempt}` : ""}`;

  return (
    <div className="cv-page" data-page={n}>
      {!loaded && !error && <span className="cv-load" aria-hidden="true" />}
      {error ? (
        <div className="cv-perr">
          <p>Couldn&rsquo;t load page {n}.</p>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setError(false);
              setLoaded(false);
              setAttempt((a) => a + 1);
            }}
          >
            Retry
          </button>
        </div>
      ) : (
        <img
          className={`cv-img ${loaded ? "in" : ""}`}
          src={url}
          alt={`${title} — page ${n}`}
          loading="lazy"
          decoding="async"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
      <style jsx>{`
        .cv-page {
          position: relative;
          flex: 0 0 auto;
          /* Fill the reader height: the page is as tall as the scroll area
             (--cv-page-h, measured from the actual container; the svh value is
             a pre-JS fallback), and its width follows from the page aspect. On
             narrow screens the screen width wins instead (fit-to-width). */
          height: min(
            var(--cv-page-h, calc(100svh - var(--cv-chrome))),
            calc(94vw / var(--cv-aspect))
          );
          aspect-ratio: var(--cv-aspect);
          scroll-snap-align: center;
          background: #fff;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55);
        }
        .cv-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          opacity: 0;
          transition: opacity 0.35s var(--ease);
          user-select: none;
          -webkit-user-drag: none;
        }
        .cv-img.in {
          opacity: 1;
        }
        .cv-load {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 40px;
          height: 40px;
          margin: -20px 0 0 -20px;
          border-radius: 50%;
          border: 3px solid rgba(0, 0, 0, 0.12);
          border-top-color: var(--orange);
          animation: cvSpin 0.8s linear infinite;
        }
        @keyframes cvSpin {
          to { transform: rotate(360deg); }
        }
        .cv-perr {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.9rem;
          color: #333;
          text-align: center;
          padding: 1rem;
        }
        @media (prefers-reduced-motion: reduce) {
          .cv-img { transition: none; }
          .cv-load { animation-duration: 1.6s; }
        }
      `}</style>
    </div>
  );
}

/**
 * In-site catalogue reader — a full-screen overlay that stays inside the
 * Powerline site. Each page fills the viewport height (no more narrow centred
 * strip), and the catalogue reads page-by-page: scroll or use the ‹ / › toolbar
 * (or the arrow keys) to move between pages, which snap into view. Pages are
 * gated images (no raw PDF URL, no browser PDF chrome, no external redirect),
 * lazy-loaded, with a live page indicator and an OPTIONAL gated "Download PDF".
 * Opening it never downloads anything automatically.
 */
export default function CatalogViewer({ catalog, onClose }) {
  const { slug, productName, title, totalPages, pageAspect } = catalog;
  const [current, setCurrent] = useState(1);
  const rootRef = useRef(null);
  const scrollRef = useRef(null);
  const closeRef = useRef(null);
  const raf = useRef(0);

  // Pin the page height to the reader's real available height so exactly one
  // page fills the screen (a fixed overlay's height doesn't always equal svh —
  // mobile URL bars, emulation). Re-measure on resize.
  useEffect(() => {
    const setPageH = () => {
      const s = scrollRef.current;
      const root = rootRef.current;
      if (s && root) root.style.setProperty("--cv-page-h", `${s.clientHeight}px`);
    };
    setPageH();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(setPageH) : null;
    if (ro && scrollRef.current) ro.observe(scrollRef.current);
    window.addEventListener("resize", setPageH);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", setPageH);
    };
  }, []);

  // Move one page in the given direction (±1) — one viewport height per step.
  const go = useCallback((dir) => {
    const c = scrollRef.current;
    if (!c) return;
    c.scrollBy({ top: dir * c.clientHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    track("catalog_view", meta(catalog));
    // Pause the site's Lenis smooth-scroll while the reader is open — otherwise
    // it hijacks wheel/touch events and the reader's own scroll area barely
    // moves. (The scroll container is also marked data-lenis-prevent below.)
    const lenis = typeof window !== "undefined" ? window.__lenis : null;
    lenis?.stop();
    document.documentElement.classList.add("lenis-stopped");
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
      lenis?.start();
      window.removeEventListener("keydown", onKey);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live "current page" from scroll position — the page crossing the vertical
  // centre of the scroll viewport.
  const onScroll = () => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const cont = scrollRef.current;
      if (!cont) return;
      const r = cont.getBoundingClientRect();
      const centerY = r.top + r.height / 2;
      const slots = cont.querySelectorAll(".cv-page");
      let cur = 1;
      for (let i = 0; i < slots.length; i++) {
        const b = slots[i].getBoundingClientRect();
        if (b.top <= centerY && b.bottom >= centerY) {
          cur = i + 1;
          break;
        }
        if (b.top > centerY) {
          cur = Math.max(1, i);
          break;
        }
        cur = i + 1;
      }
      setCurrent(cur);
    });
  };

  const download = () => {
    track("catalog_download_click", meta(catalog));
    const a = document.createElement("a");
    a.href = `/api/catalog/download/${slug}`;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    track("catalog_download", meta(catalog));
  };

  return (
    <div
      className="cv"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${productName} technical catalogue`}
      style={{ "--cv-aspect": pageAspect, "--cv-chrome": "6.75rem" }}
    >
      <header className="cv-head">
        <div className="cv-brand">
          <span className="cv-dot" aria-hidden="true" />
          <div className="cv-titles">
            <span className="cv-eyebrow">Technical Catalogue</span>
            <h2>{title}</h2>
          </div>
        </div>
        <button className="cv-close" ref={closeRef} onClick={onClose} aria-label="Back to product">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          <span>Back to Product</span>
        </button>
      </header>

      <div className="cv-scroll" ref={scrollRef} onScroll={onScroll} data-lenis-prevent>
        <div className="cv-doc">
          {Array.from({ length: totalPages }, (_, i) => (
            <CatalogPage key={i + 1} slug={slug} n={i + 1} title={title} />
          ))}
        </div>
      </div>

      <footer className="cv-foot">
        <div className="cv-bar">
          <div className="cv-pager">
            <button className="cv-nav" onClick={() => go(-1)} disabled={current <= 1} aria-label="Previous page">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </button>
            <span className="cv-count" aria-live="polite">
              <strong>{current}</strong> / {totalPages}
            </span>
            <button className="cv-nav" onClick={() => go(1)} disabled={current >= totalPages} aria-label="Next page">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
          <span className="cv-div" aria-hidden="true" />
          <button className="btn btn-primary cv-dl" onClick={download}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v11m0 0l-4-4m4 4l4-4" />
              <path d="M5 19h14" />
            </svg>
            Download PDF
          </button>
        </div>
      </footer>

      <style jsx>{`
        .cv {
          position: fixed;
          inset: 0;
          z-index: var(--z-overlay);
          background: var(--bg);
          display: flex;
          flex-direction: column;
          animation: cvIn 0.3s var(--ease);
        }
        @keyframes cvIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ── Header — slim, translucent, one line ───────────────────────── */
        .cv-head {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          height: 3.25rem;
          padding: 0 clamp(0.9rem, 3vw, 2rem);
          background: rgba(8, 8, 10, 0.72);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--line);
          z-index: 3;
        }
        .cv-brand {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          min-width: 0;
        }
        .cv-dot {
          flex: 0 0 auto;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--orange);
          box-shadow: 0 0 0 4px rgba(232, 114, 42, 0.16);
        }
        .cv-titles {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          min-width: 0;
        }
        .cv-eyebrow {
          font-family: var(--font-body);
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--orange);
          white-space: nowrap;
        }
        .cv-titles h2 {
          font-family: var(--font-head);
          font-weight: 800;
          text-transform: uppercase;
          font-size: clamp(0.85rem, 1.7vw, 1.05rem);
          letter-spacing: 0.01em;
          line-height: 1;
          color: #fff;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cv-close {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          height: 2.2rem;
          padding: 0 0.95rem;
          border: 1px solid var(--line);
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.8rem;
          white-space: nowrap;
          transition: color 0.25s, border-color 0.25s, background 0.25s;
        }
        .cv-close:hover {
          color: var(--orange);
          border-color: rgba(232, 114, 42, 0.5);
          background: rgba(232, 114, 42, 0.08);
        }
        .cv-close svg {
          transition: transform 0.25s var(--ease);
        }
        .cv-close:hover svg {
          transform: translateX(-2px);
        }

        /* ── Scroll area — one page per screen, snapping ────────────────── */
        .cv-scroll {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: y proximity;
          background: radial-gradient(60% 50% at 50% 0%, rgba(232, 114, 42, 0.06), transparent 70%), var(--bg);
        }
        .cv-doc {
          min-height: 100%;
          padding: clamp(0.7rem, 1.6vh, 1.2rem) 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(0.7rem, 1.6vh, 1.2rem);
        }

        /* ── Footer — reader toolbar ────────────────────────────────────── */
        .cv-foot {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 clamp(0.9rem, 3vw, 2rem);
          height: 3.5rem;
          background: rgba(8, 8, 10, 0.72);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid var(--line);
          z-index: 3;
        }
        .cv-bar {
          display: flex;
          align-items: center;
          gap: clamp(0.6rem, 2vw, 1.25rem);
        }
        .cv-pager {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .cv-nav {
          display: inline-grid;
          place-items: center;
          width: 2.15rem;
          height: 2.15rem;
          border-radius: 50%;
          border: 1px solid var(--line);
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          transition: color 0.2s, border-color 0.2s, background 0.2s, opacity 0.2s;
        }
        .cv-nav:hover:not(:disabled) {
          color: var(--orange);
          border-color: rgba(232, 114, 42, 0.5);
          background: rgba(232, 114, 42, 0.08);
        }
        .cv-nav:disabled {
          opacity: 0.32;
          cursor: default;
        }
        .cv-count {
          min-width: 3.6rem;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-dim);
          font-variant-numeric: tabular-nums;
        }
        .cv-count strong {
          color: #fff;
          font-weight: 700;
        }
        .cv-div {
          width: 1px;
          height: 1.6rem;
          background: var(--line);
        }
        .cv-dl {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          height: 2.4rem;
          padding: 0 1.15rem;
          font-size: 0.85rem;
        }

        @media (max-width: 600px) {
          .cv-close span {
            display: none;
          }
          .cv-close {
            width: 2.2rem;
            padding: 0;
            justify-content: center;
          }
          .cv-dl :global(svg) {
            margin: 0;
          }
          .cv-dl {
            padding: 0 0.9rem;
          }
          .cv-eyebrow {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cv {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
