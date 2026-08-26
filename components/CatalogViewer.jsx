"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

const meta = (c) => ({
  product_name: c.productName,
  product_slug: c.slug,
  catalog_name: c.title,
  page_path: typeof location !== "undefined" ? location.pathname : "",
});

/**
 * One page of the catalogue — a readable-width sheet that lazy-loads its gated
 * image (native loading="lazy") with its own loading spinner and error/retry.
 * The slot reserves the page's aspect ratio so the scrollbar is correct before
 * images load (no layout shift).
 */
function CatalogPage({ slug, n, title, aspect }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const url = `/api/catalog/page/${slug}/${n}${attempt ? `?r=${attempt}` : ""}`;

  return (
    <div className="cv-page" data-page={n} style={{ aspectRatio: String(aspect) }}>
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
          width: 100%;
          background: #fff;
          border-radius: 5px;
          overflow: hidden;
          box-shadow: 0 14px 44px rgba(0, 0, 0, 0.5);
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
 * In-site catalogue viewer — a full-screen overlay that stays inside the
 * Powerline site. The catalogue reads as a scrollable document: readable-width
 * pages stacked vertically, each a gated image (no raw PDF URL, no browser PDF
 * chrome, no external redirect), lazy-loaded, with a live "Page X of N"
 * indicator and an OPTIONAL "Download PDF" button (also gated). Opening it
 * never downloads anything automatically.
 */
export default function CatalogViewer({ catalog, onClose }) {
  const { slug, productName, title, totalPages, pageAspect } = catalog;
  const [current, setCurrent] = useState(1);
  const scrollRef = useRef(null);
  const backRef = useRef(null);
  const raf = useRef(0);

  useEffect(() => {
    track("catalog_view", meta(catalog));
    // Pause the site's Lenis smooth-scroll while the viewer is open — otherwise
    // it hijacks wheel/touch events and the viewer's own scroll area barely
    // moves. (The scroll container is also marked data-lenis-prevent below.)
    const lenis = typeof window !== "undefined" ? window.__lenis : null;
    lenis?.stop();
    document.documentElement.classList.add("lenis-stopped");
    document.documentElement.style.overflow = "hidden";
    backRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
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
    <div className="cv" role="dialog" aria-modal="true" aria-label={`${productName} technical catalogue`}>
      <header className="cv-head">
        <div className="cv-titles">
          <span className="eyebrow">Technical Catalogue</span>
          <h2>{title}</h2>
        </div>
        <button className="cv-back" ref={backRef} onClick={onClose}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          Back to Product
        </button>
      </header>

      <div className="cv-scroll" ref={scrollRef} onScroll={onScroll} data-lenis-prevent>
        <div className="cv-doc">
          {Array.from({ length: totalPages }, (_, i) => (
            <CatalogPage key={i + 1} slug={slug} n={i + 1} title={title} aspect={pageAspect} />
          ))}
        </div>
      </div>

      <footer className="cv-foot">
        <span className="cv-count" aria-live="polite">Page {current} of {totalPages}</span>
        <button className="btn btn-primary cv-dl" onClick={download}>
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v11m0 0l-4-4m4 4l4-4" />
            <path d="M5 19h14" />
          </svg>
          Download PDF
        </button>
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
        .cv-head {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: clamp(0.8rem, 2.4vw, 1.3rem) clamp(1rem, 4vw, 2.5rem);
          border-bottom: 1px solid var(--line);
          background: var(--bg-2);
          z-index: 2;
        }
        .cv-titles :global(.eyebrow) {
          font-size: 0.66rem;
        }
        .cv-titles h2 {
          font-family: var(--font-head);
          font-weight: 800;
          text-transform: uppercase;
          font-size: clamp(1.05rem, 2.4vw, 1.55rem);
          line-height: 1;
          color: #fff;
          margin: 0.35rem 0 0;
        }
        .cv-back {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.6rem 1.1rem;
          border: 1px solid var(--line);
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.04);
          color: var(--text);
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.85rem;
          white-space: nowrap;
          transition: color 0.25s, border-color 0.25s, background 0.25s;
        }
        .cv-back:hover {
          color: var(--orange);
          border-color: rgba(232, 114, 42, 0.5);
        }
        .cv-scroll {
          flex: 1 1 auto;
          overflow-y: auto;
          overflow-x: hidden;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          background: radial-gradient(70% 40% at 50% 0%, rgba(232, 114, 42, 0.05), transparent 70%), var(--bg);
        }
        .cv-doc {
          width: min(920px, 94vw);
          margin: 0 auto;
          padding: clamp(1rem, 3vw, 2.2rem) 0 clamp(2rem, 5vw, 3.5rem);
          display: flex;
          flex-direction: column;
          gap: clamp(0.8rem, 2vw, 1.4rem);
        }
        .cv-foot {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          padding: clamp(0.8rem, 2vw, 1.1rem) clamp(1rem, 4vw, 2.5rem);
          border-top: 1px solid var(--line);
          background: var(--bg-2);
        }
        .cv-count {
          font-size: 0.88rem;
          color: var(--text-dim);
          font-variant-numeric: tabular-nums;
        }
        .cv-dl {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
        }
        @media (max-width: 600px) {
          .cv-foot {
            justify-content: center;
          }
          .cv-dl {
            width: 100%;
            justify-content: center;
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
