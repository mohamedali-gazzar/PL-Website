"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CountUp } from "@/components/Primitives";
import { heroStats } from "@/lib/content";

/**
 * About Powerline — the opening scene. The management-approved paragraph IS the
 * hero (not a banner): large editorial type where the connective words recede
 * and the five key phrases ignite, played as a choreographed cold-open over a
 * living factory backdrop. A glowing "bus bar" line then divides the narration
 * from the credentials — the four headline stats tap off it like instruments
 * and count up. All copy is preserved verbatim; only the experience is designed.
 * Reduced motion / no-JS shows everything.
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

        {/* ── the big line: a glowing bus bar dividing story from credentials ── */}
        <div className="hero-bus" aria-hidden="true">
          <span className="hero-bus-line" />
          <span className="hero-bus-pulse" />
        </div>

        {/* ── credentials tapped off the bus bar ── */}
        <div className="hero-stats">
          {heroStats.map((s, i) => (
            <div className="hero-stat" style={{ "--si": i }} key={s.label}>
              <span className="hero-stat-tap" aria-hidden="true" />
              <div className="hero-stat-v">
                <CountUp value={s.value} suffix={s.suffix} group={!s.plain} />
              </div>
              <div className="hero-stat-l">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: clamp(7.5rem, 15vh, 10.5rem) 0 clamp(3.5rem, 8vh, 6rem);
        }

        /* ── stage: layered depth + cinematic lighting ── */
        .hero-stage { position: absolute; inset: 0; z-index: 0; }
        .hero-img {
          position: absolute;
          inset: -3%;
          background: url("/img/facility-1.webp") center / cover no-repeat;
          opacity: 0.44;
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
          background: radial-gradient(58% 50% at 70% 28%, rgba(232, 114, 42, 0.2), transparent 60%);
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
            linear-gradient(95deg, rgba(5,5,6,0.95) 0%, rgba(5,5,6,0.74) 38%, rgba(5,5,6,0.34) 70%, rgba(5,5,6,0.54) 100%),
            linear-gradient(180deg, rgba(5,5,6,0.72) 0%, transparent 18%),
            linear-gradient(0deg, var(--bg) 0%, transparent 46%);
        }
        .hero-vignette {
          position: absolute; inset: 0;
          box-shadow: inset 0 0 240px 60px rgba(0, 0, 0, 0.72);
          pointer-events: none;
        }
        .hero-fade {
          position: absolute; left: 0; right: 0; bottom: 0; height: 24%;
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

        /* the paragraph — large editorial type, mixed emphasis */
        .hero-script {
          margin: clamp(1.4rem, 3.5vh, 2.4rem) 0 0;
          max-width: min(66vw, 940px);
          font-family: var(--font-head);
          font-weight: 400;
          font-size: clamp(1.3rem, 2.3vw, 2.15rem);
          line-height: 1.5;
          letter-spacing: -0.005em;
          color: rgba(255, 255, 255, 0.6);
        }
        @media (max-width: 900px) { .hero-script { max-width: 94vw; } }

        .seg {
          opacity: 0;
          filter: blur(8px);
          transition: opacity 0.8s var(--ease), filter 0.8s var(--ease);
          transition-delay: calc(var(--i) * 100ms + 0.55s);
        }
        .hero.play .seg { opacity: 1; filter: blur(0); }
        .seg:not(.em) { color: rgba(255, 255, 255, 0.55); }
        .seg.em {
          color: var(--orange);
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        .hero.play .seg.em { text-shadow: 0 0 30px rgba(232, 114, 42, 0.3); }

        .hero-cta {
          display: inline-flex; align-items: center; gap: 0.6rem;
          margin-top: clamp(1.6rem, 4vh, 2.4rem);
          font-family: var(--font-body); font-weight: 600;
          font-size: 0.95rem; letter-spacing: 0.01em;
          color: #fff; text-decoration: none;
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.8s var(--ease) 1.35s, transform 0.8s var(--ease) 1.35s, color 0.3s ease, gap 0.3s ease;
        }
        .hero.play .hero-cta { opacity: 1; transform: translateY(0); }
        .hero-cta:hover { color: var(--orange); gap: 1rem; }
        .hero-cta svg { transition: transform 0.3s ease; }
        .hero-cta:hover svg { transform: translateX(4px); }

        /* ── the big line (bus bar) ── */
        .hero-bus {
          position: relative;
          height: 3px;
          margin: clamp(2.4rem, 6vh, 4rem) 0 0;
          border-radius: 3px;
          overflow: hidden;
        }
        .hero-bus-line {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(232,114,42,0) 0%, rgba(232,114,42,0.75) 10%, rgba(232,114,42,0.85) 50%, rgba(232,114,42,0.75) 90%, rgba(232,114,42,0) 100%);
          box-shadow: 0 0 18px rgba(232, 114, 42, 0.45);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) 1.45s;
        }
        .hero.play .hero-bus-line { transform: scaleX(1); }
        .hero-bus-pulse {
          position: absolute; top: 0; left: 0; width: 140px; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 242, 230, 0.95), transparent);
          opacity: 0;
        }
        .hero.play .hero-bus-pulse { animation: heroBus 3.6s ease-in-out 2.7s infinite; }
        @keyframes heroBus {
          0% { transform: translateX(-140px); opacity: 0; }
          12% { opacity: 1; }
          82% { opacity: 1; }
          100% { transform: translateX(100vw); opacity: 0; }
        }

        /* ── stats tapped off the bus bar ── */
        .hero-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          margin-top: clamp(1.4rem, 3vh, 2.1rem);
        }
        .hero-stat {
          position: relative;
          padding: clamp(1.1rem, 2.4vh, 1.6rem) clamp(0.9rem, 2vw, 1.6rem) 0;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
          transition-delay: calc(2s + var(--si) * 90ms);
        }
        .hero.play .hero-stat { opacity: 1; transform: none; }
        .hero-stat + .hero-stat { border-left: 1px solid var(--line); }
        .hero-stat-tap {
          position: absolute; top: 0; left: clamp(0.9rem, 2vw, 1.6rem);
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--orange);
          box-shadow: 0 0 10px rgba(232, 114, 42, 0.9);
          transform: translateY(-50%);
        }
        .hero-stat-v {
          font-family: var(--font-head); font-weight: 800;
          font-size: clamp(1.7rem, 3.2vw, 2.8rem); line-height: 1;
          color: #fff;
        }
        .hero-stat-l {
          margin-top: 0.55rem;
          color: var(--text-faint); text-transform: uppercase;
          font-size: 0.72rem; letter-spacing: 0.08em;
        }

        @media (max-width: 600px) {
          .hero-side { display: none; }
          .hero-stats { grid-template-columns: repeat(2, 1fr); gap: 0.5rem 0; }
          .hero-stat:nth-child(3) { border-left: none; }
          .hero-stat:nth-child(odd) { border-left: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-img, .hero-key, .hero-bus-pulse { animation: none; }
          .hero-rule, .hero-eyebrow, .seg, .hero-side, .hero-cta, .hero-bus-line, .hero-stat { transition: none; }
          .seg { opacity: 1; filter: none; }
          .hero-bus-line { transform: scaleX(1); }
          .hero.play .hero-rule { width: clamp(36px, 6vw, 92px); }
        }
      `}</style>
    </section>
  );
}
