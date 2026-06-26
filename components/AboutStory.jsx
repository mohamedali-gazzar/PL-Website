"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * About Powerline — the opening scene. Not a banner with a title over an image:
 * the management-approved paragraph IS the hero, rendered as large editorial
 * type where the connective words recede and the five key phrases ignite. It
 * plays as a choreographed cold-open over a living factory backdrop (slow
 * Ken-Burns push-in, a drifting key light, film grain, vignette) and bleeds
 * seamlessly into the next section. The paragraph is preserved EXACTLY — only
 * the experience is designed. Reduced motion / no-JS shows everything.
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

// film-grain texture as a data URI — kept OUT of the styled-jsx CSS (its parser
// chokes on the SVG data URI and drops the rest of the block); applied inline.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function AboutStory() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("play");
      return;
    }
    // it's the opening scene (above the fold) — start the choreography on the
    // next frame so the initial hidden state paints first; back it with an
    // IntersectionObserver in case the frame is deferred
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("play");
          io.disconnect();
        }
      },
      { threshold: 0.01 }
    );
    io.observe(el);
    const r = requestAnimationFrame(() => el.classList.add("play"));
    return () => {
      io.disconnect();
      cancelAnimationFrame(r);
    };
  }, []);

  return (
    <section className="hero" ref={root} aria-label="About Powerline">
      {/* ── living cinematic stage ── */}
      <div className="hero-stage" aria-hidden="true">
        <div className="hero-img" />
        <div className="hero-key" />
        <div className="hero-grain" style={{ backgroundImage: GRAIN }} />
        <div className="hero-veil" />
        <div className="hero-vignette" />
        <div className="hero-fade" />
      </div>

      <span className="hero-side" aria-hidden="true">Est. 2012 — Cairo, Egypt</span>

      <div className="container hero-inner">
        <div className="hero-chapter">
          <span className="hero-rule" />
          <span className="hero-eyebrow">About Powerline · Our Story</span>
        </div>

        <p className="hero-script">
          {SEGMENTS.map(([txt, em], i) => (
            <span className={`seg ${em ? "em" : ""}`} style={{ "--i": i }} key={i}>
              {txt}
            </span>
          ))}
        </p>

        <Link href="/our-products" className="hero-cta">
          Explore our solutions
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      <span className="hero-cue" aria-hidden="true">
        Scroll
        <span className="hero-cue-line" />
      </span>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: clamp(8rem, 18vh, 12rem) 0 clamp(5rem, 11vh, 8rem);
        }

        /* ── stage: layered depth + cinematic lighting ── */
        .hero-stage { position: absolute; inset: 0; z-index: 0; }
        .hero-img {
          position: absolute;
          inset: -3%;
          background: url("/img/facility-1.webp") center / cover no-repeat;
          opacity: 0.46;
          transform-origin: 64% 38%;
          transform: scale(1.12);
          animation: heroZoom 30s ease-in-out infinite alternate;
        }
        @keyframes heroZoom {
          from { transform: scale(1.12) translate3d(0, 0, 0); }
          to { transform: scale(1.26) translate3d(-2.5%, -2%, 0); }
        }
        .hero-key {
          position: absolute; inset: 0;
          background: radial-gradient(58% 50% at 70% 30%, rgba(232, 114, 42, 0.2), transparent 60%);
          mix-blend-mode: screen;
          animation: heroKey 17s ease-in-out infinite alternate;
        }
        @keyframes heroKey {
          from { transform: translate3d(0, 0, 0); opacity: 0.85; }
          to { transform: translate3d(-4%, 3%, 0); opacity: 1; }
        }
        .hero-grain {
          position: absolute; inset: 0;
          opacity: 0.05;
          mix-blend-mode: overlay;
          pointer-events: none;
        }
        .hero-veil {
          position: absolute; inset: 0;
          background:
            linear-gradient(95deg, rgba(5,5,6,0.95) 0%, rgba(5,5,6,0.72) 38%, rgba(5,5,6,0.3) 70%, rgba(5,5,6,0.5) 100%),
            linear-gradient(180deg, rgba(5,5,6,0.72) 0%, transparent 18%),
            linear-gradient(0deg, var(--bg) 0%, transparent 42%);
        }
        .hero-vignette {
          position: absolute; inset: 0;
          box-shadow: inset 0 0 240px 60px rgba(0, 0, 0, 0.72);
          pointer-events: none;
        }
        .hero-fade {
          position: absolute; left: 0; right: 0; bottom: 0; height: 26%;
          background: linear-gradient(0deg, var(--bg), transparent);
          pointer-events: none;
        }

        /* ── editorial side marker ── */
        .hero-side {
          position: absolute; right: clamp(0.5rem, 1.6vw, 1.6rem); top: 50%;
          z-index: 2;
          transform: translateY(-50%) rotate(90deg);
          transform-origin: right center;
          font-family: var(--font-head); font-weight: 700;
          font-size: 0.72rem; letter-spacing: 0.4em;
          color: var(--text-faint); white-space: nowrap;
          opacity: 0; transition: opacity 1.2s ease 1.2s;
        }
        .hero.play .hero-side { opacity: 0.6; }

        /* ── content ── */
        .hero-inner { position: relative; z-index: 2; width: 100%; }

        .hero-chapter { display: flex; align-items: center; gap: 1rem; }
        .hero-rule {
          width: 0; height: 1px;
          background: linear-gradient(90deg, var(--orange), transparent);
          transition: width 1s ease 0.3s;
        }
        .hero.play .hero-rule { width: clamp(36px, 6vw, 92px); }
        .hero-eyebrow {
          font-family: var(--font-body); font-weight: 600;
          font-size: 0.76rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--orange);
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.8s var(--ease) 0.4s, transform 0.8s var(--ease) 0.4s;
        }
        .hero.play .hero-eyebrow { opacity: 1; transform: none; }

        /* the paragraph IS the hero — large editorial type, mixed emphasis */
        .hero-script {
          margin: clamp(1.6rem, 4vh, 2.8rem) 0 0;
          max-width: min(66vw, 940px);
          font-family: var(--font-head);
          font-weight: 400;
          font-size: clamp(1.35rem, 2.5vw, 2.35rem);
          line-height: 1.5;
          letter-spacing: -0.005em;
          color: rgba(255, 255, 255, 0.6);
        }
        @media (max-width: 900px) { .hero-script { max-width: 94vw; } }

        /* each chunk settles out of a soft blur, staggered like narration */
        .seg {
          opacity: 0;
          filter: blur(8px);
          transition: opacity 0.8s var(--ease), filter 0.8s var(--ease);
          transition-delay: calc(var(--i) * 110ms + 0.55s);
        }
        .hero.play .seg { opacity: 1; filter: blur(0); }
        .seg:not(.em) { color: rgba(255, 255, 255, 0.55); }
        /* the five phrases ignite — brighter, heavier, glowing */
        .seg.em {
          color: var(--orange);
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        .hero.play .seg.em { text-shadow: 0 0 30px rgba(232, 114, 42, 0.3); }

        .hero-cta {
          display: inline-flex; align-items: center; gap: 0.6rem;
          margin-top: clamp(1.8rem, 4.5vh, 2.8rem);
          font-family: var(--font-body); font-weight: 600;
          font-size: 0.95rem; letter-spacing: 0.01em;
          color: #fff; text-decoration: none;
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.8s var(--ease) 1.45s, transform 0.8s var(--ease) 1.45s, color 0.3s ease, gap 0.3s ease;
        }
        .hero.play .hero-cta { opacity: 1; transform: translateY(0); }
        .hero-cta:hover { color: var(--orange); gap: 1rem; }
        .hero-cta svg { transition: transform 0.3s ease; }
        .hero-cta:hover svg { transform: translateX(4px); }

        /* ── cinematic scroll cue ── */
        .hero-cue {
          position: absolute; left: 50%; bottom: clamp(1.4rem, 3.5vh, 2.4rem);
          z-index: 2; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 0.7rem;
          font-family: var(--font-body); font-size: 0.62rem;
          letter-spacing: 0.32em; text-transform: uppercase; color: var(--text-faint);
          opacity: 0; transition: opacity 1s ease 1.9s;
        }
        .hero.play .hero-cue { opacity: 0.8; }
        .hero-cue-line {
          width: 1px; height: 46px; position: relative; overflow: hidden;
          background: linear-gradient(180deg, var(--orange), transparent);
        }
        .hero-cue-line::after {
          content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 14px;
          background: var(--orange); box-shadow: 0 0 8px var(--orange);
          animation: heroCue 2s ease-in-out infinite;
        }
        @keyframes heroCue {
          0% { transform: translateY(-16px); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateY(46px); opacity: 0; }
        }

        @media (max-width: 600px) {
          .hero-side { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-img, .hero-key, .hero-cue-line::after { animation: none; }
          .hero-rule, .hero-eyebrow, .seg, .hero-side, .hero-cta, .hero-cue { transition: none; }
          .seg { opacity: 1; filter: none; }
          .hero.play .hero-rule { width: clamp(36px, 6vw, 92px); }
        }
      `}</style>
    </section>
  );
}
