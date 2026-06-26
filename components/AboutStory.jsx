"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * About Powerline — the unified hero. "About Powerline" and "The Powerline
 * story" are merged into a single cinematic, full-height opening: a bold,
 * mask-revealed identity title on the left and the management-approved opening
 * paragraph revealing clause-by-clause on the right, over a slow-drifting
 * factory backdrop with cinematic lighting. The paragraph is preserved EXACTLY;
 * only the experience is designed. Reduced motion / no-JS shows everything.
 *
 * Each tuple = [text, emphasized?]. Concatenated, it is the approved copy
 * verbatim — do not alter the strings.
 */
const SEGMENTS = [
  ["Powerline was ", false],
  ["born in Egypt", true],
  [" to prove that ", false],
  ["world-class power solutions", true],
  [" can be built here, not just imported. We build where we add real value — ", false],
  ["engineering, fabrication, integration, and service", true],
  [" — and ", false],
  ["partner with the world's best", true],
  [" for the rest. The result: high-quality power solutions, ", false],
  ["delivered on our word", true],
  [", at a price you can build on.", false],
];

export default function AboutStory() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("lit");
      return;
    }
    // it's the hero (already in view) — kick the reveal on the next frame so
    // the CSS transitions actually run
    const r = requestAnimationFrame(() => el.classList.add("lit"));
    return () => cancelAnimationFrame(r);
  }, []);

  return (
    <section className="ah" ref={root} aria-label="About Powerline — the Powerline story">
      <div className="ah-bg" aria-hidden="true">
        <img src="/img/facility-1.webp" alt="" decoding="async" />
        <span className="ah-veil" />
        <span className="ah-grid" />
        <span className="ah-vignette" />
      </div>

      <span className="ah-watermark" aria-hidden="true">EST. 2012</span>

      <div className="container ah-inner">
        {/* identity */}
        <div className="ah-lead">
          <span className="eyebrow ah-eyebrow">About Powerline</span>
          <h1 className="ah-title">
            <span className="ah-mask"><span className="ah-word">The</span></span>
            <span className="ah-mask"><span className="ah-word">Powerline</span></span>
            <span className="ah-mask"><span className="ah-word"><span className="o">Story</span></span></span>
          </h1>
          <span className="ah-meta">Est. 2012 · Cairo, Egypt</span>
          <Link href="/our-products" className="btn btn-primary ah-cta">
            Explore our solutions
          </Link>
        </div>

        {/* story */}
        <div className="ah-story">
          <p className="ah-text">
            {SEGMENTS.map(([txt, em], i) => (
              <span className={`seg ${em ? "em" : ""}`} style={{ "--i": i }} key={i}>
                {txt}
              </span>
            ))}
          </p>
          <span className="ah-cue" aria-hidden="true">
            <span className="ah-cue-label">The story continues</span>
            <span className="ah-cue-line" />
          </span>
        </div>
      </div>

      <style jsx>{`
        .ah {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: clamp(8rem, 18vh, 12rem) 0 clamp(4rem, 9vh, 7rem);
        }

        /* ── living backdrop ── */
        .ah-bg { position: absolute; inset: 0; z-index: 0; }
        .ah-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.4;
          transform-origin: 62% 40%;
          animation: ahDrift 28s ease-in-out infinite alternate;
        }
        @keyframes ahDrift {
          from { transform: scale(1.08) translate3d(0, 0, 0); }
          to { transform: scale(1.2) translate3d(-2%, -2%, 0); }
        }
        .ah-veil {
          position: absolute; inset: 0;
          background:
            linear-gradient(100deg, rgba(5,5,6,0.96) 0%, rgba(5,5,6,0.8) 40%, rgba(5,5,6,0.42) 72%, rgba(5,5,6,0.66) 100%),
            linear-gradient(0deg, var(--bg) 2%, transparent 42%),
            linear-gradient(180deg, rgba(5,5,6,0.72) 0%, transparent 22%);
        }
        .ah-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(232,114,42,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,114,42,0.05) 1px, transparent 1px);
          background-size: 74px 74px;
          mask-image: radial-gradient(circle at 20% 46%, #000, transparent 72%);
          -webkit-mask-image: radial-gradient(circle at 20% 46%, #000, transparent 72%);
        }
        .ah-vignette {
          position: absolute; inset: 0;
          box-shadow: inset 0 0 220px 50px rgba(0,0,0,0.7);
          pointer-events: none;
        }
        .ah-watermark {
          position: absolute; right: -1.5vw; bottom: -2.5vh; z-index: 1;
          font-family: var(--font-head); font-weight: 800;
          font-size: clamp(5rem, 17vw, 15rem); letter-spacing: -0.04em;
          color: transparent; -webkit-text-stroke: 1px rgba(232,114,42,0.1);
          pointer-events: none; user-select: none;
        }

        /* ── layout ── */
        .ah-inner {
          position: relative; z-index: 2; width: 100%;
          display: grid;
          grid-template-columns: 1.02fr 0.98fr;
          gap: clamp(2rem, 5vw, 5.5rem);
          align-items: center;
        }

        /* ── identity column ── */
        .ah-eyebrow {
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
        }
        .ah.lit .ah-eyebrow { opacity: 1; transform: none; }

        .ah-title {
          font-family: var(--font-head); font-weight: 800;
          text-transform: uppercase; line-height: 1.0; letter-spacing: -0.02em;
          font-size: clamp(2.7rem, 6.6vw, 5.8rem);
          margin: 1.2rem 0 0; color: #fff;
        }
        .ah-mask { display: block; overflow: hidden; padding-bottom: 0.08em; }
        .ah-word {
          display: block; transform: translateY(112%);
          transition: transform 0.95s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ah-mask:nth-child(2) .ah-word { transition-delay: 0.1s; }
        .ah-mask:nth-child(3) .ah-word { transition-delay: 0.2s; }
        .ah.lit .ah-word { transform: none; }
        .ah-title .o { color: var(--orange); }

        .ah-meta {
          display: block; margin-top: 1.4rem;
          font-family: var(--font-body); font-size: 0.78rem;
          letter-spacing: 0.22em; text-transform: uppercase; color: var(--text-faint);
          opacity: 0; transition: opacity 0.8s var(--ease) 0.55s;
        }
        .ah.lit .ah-meta { opacity: 1; }
        .ah-cta {
          margin-top: 2rem; opacity: 0; transform: translateY(14px);
          transition: opacity 0.8s var(--ease) 0.65s, transform 0.8s var(--ease) 0.65s;
        }
        .ah.lit .ah-cta { opacity: 1; transform: none; }

        /* ── story column ── */
        .ah-story { position: relative; }
        .ah-text {
          font-family: var(--font-head); font-weight: 400; color: #fff;
          font-size: clamp(1.2rem, 1.95vw, 1.72rem); line-height: 1.5;
          letter-spacing: -0.005em; max-width: 42ch;
        }
        .seg {
          opacity: 0; filter: blur(6px);
          transition: opacity 0.7s var(--ease), filter 0.7s var(--ease);
          transition-delay: calc(var(--i) * 88ms + 0.45s);
        }
        .ah.lit .seg { opacity: 0.72; filter: blur(0); }
        .seg.em { color: var(--orange); font-weight: 500; }
        .ah.lit .seg.em { opacity: 1; text-shadow: 0 0 26px rgba(232,114,42,0.3); }

        .ah-cue {
          display: inline-flex; align-items: center; gap: 0.8rem;
          margin-top: clamp(1.8rem, 4vh, 2.6rem);
          color: var(--text-faint); font-size: 0.7rem;
          letter-spacing: 0.22em; text-transform: uppercase;
          opacity: 0; transition: opacity 0.8s var(--ease) 1.5s;
        }
        .ah.lit .ah-cue { opacity: 1; }
        .ah-cue-line {
          width: 60px; height: 1px; position: relative; overflow: hidden;
          background: linear-gradient(90deg, var(--orange), transparent);
        }
        .ah-cue-line::after {
          content: ""; position: absolute; top: 0; left: 0; height: 100%; width: 20px;
          background: var(--orange); box-shadow: 0 0 8px var(--orange);
          animation: ahCue 2.4s ease-in-out infinite;
        }
        @keyframes ahCue {
          0% { transform: translateX(-22px); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateX(60px); opacity: 0; }
        }

        @media (min-width: 901px) {
          .ah-story { padding-left: clamp(2rem, 4vw, 4rem); border-left: 1px solid var(--line); }
        }
        @media (max-width: 900px) {
          .ah-inner { grid-template-columns: 1fr; gap: clamp(2rem, 6vh, 3rem); }
          .ah-text { max-width: 48ch; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ah-bg img, .ah-cue-line::after { animation: none; }
          .ah-word, .seg, .ah-eyebrow, .ah-meta, .ah-cta, .ah-cue {
            transition: none; transform: none; opacity: 1; filter: none;
          }
        }
      `}</style>
    </section>
  );
}
