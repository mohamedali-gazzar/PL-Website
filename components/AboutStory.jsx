"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * The Powerline story — a cinematic editorial opening. The approved paragraph
 * is preserved exactly; only the *experience* is designed: it reveals clause by
 * clause as the scene enters view, key phrases glowing in brand orange, over a
 * slow-drifting factory backdrop with cinematic lighting. Asymmetric, lots of
 * negative space. Reduced motion / no-JS shows the full paragraph immediately.
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
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("lit");
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="story" ref={root} aria-label="The Powerline story">
      <div className="story-bg" aria-hidden="true">
        <img src="/img/facility-2.webp" alt="" loading="lazy" decoding="async" />
        <span className="story-veil" />
        <span className="story-grid" />
        <span className="story-vignette" />
      </div>

      <span className="story-marker" aria-hidden="true">EST · 2012</span>

      <div className="container story-inner">
        <span className="eyebrow story-eyebrow">The Powerline story</span>

        <p className="story-text">
          {SEGMENTS.map(([txt, em], i) => (
            <span
              className={`seg ${em ? "em" : ""}`}
              style={{ "--i": i }}
              key={i}
            >
              {txt}
            </span>
          ))}
        </p>

        <div className="story-foot">
          <Link href="/our-products" className="btn btn-primary">
            Explore our solutions
          </Link>
          <span className="story-cue" aria-hidden="true">
            <span className="story-cue-label">The story continues</span>
            <span className="story-cue-line" />
          </span>
        </div>
      </div>

      <style jsx>{`
        .story {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: clamp(6rem, 14vh, 10rem) 0 clamp(4rem, 10vh, 7rem);
        }

        /* ── living backdrop: slow drift + cinematic lighting ── */
        .story-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .story-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.42;
          transform-origin: 60% 40%;
          animation: storyDrift 26s ease-in-out infinite alternate;
        }
        @keyframes storyDrift {
          from { transform: scale(1.08) translate3d(0, 0, 0); }
          to { transform: scale(1.2) translate3d(-2.5%, -2%, 0); }
        }
        .story-veil {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(95deg, rgba(5, 5, 6, 0.97) 0%, rgba(5, 5, 6, 0.82) 40%, rgba(5, 5, 6, 0.4) 78%, rgba(5, 5, 6, 0.6) 100%),
            linear-gradient(0deg, var(--bg) 2%, transparent 38%),
            linear-gradient(180deg, rgba(5, 5, 6, 0.7) 0%, transparent 22%);
        }
        .story-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(232, 114, 42, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232, 114, 42, 0.05) 1px, transparent 1px);
          background-size: 74px 74px;
          mask-image: radial-gradient(circle at 22% 50%, #000, transparent 70%);
          -webkit-mask-image: radial-gradient(circle at 22% 50%, #000, transparent 70%);
        }
        .story-vignette {
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 220px 40px rgba(0, 0, 0, 0.7);
          pointer-events: none;
        }

        /* ── editorial side marker ── */
        .story-marker {
          position: absolute;
          right: clamp(0.6rem, 2vw, 2rem);
          top: 50%;
          z-index: 2;
          transform: translateY(-50%) rotate(90deg);
          transform-origin: right center;
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 0.74rem;
          letter-spacing: 0.42em;
          color: var(--text-faint);
          opacity: 0;
          transition: opacity 1s ease 0.4s;
        }
        .story.lit .story-marker { opacity: 0.7; }

        /* ── content ── */
        .story-inner {
          position: relative;
          z-index: 2;
        }
        .story-eyebrow {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
        }
        .story.lit .story-eyebrow { opacity: 1; transform: none; }

        .story-text {
          margin: clamp(1.4rem, 4vh, 2.6rem) 0 0;
          max-width: 17ch;
          font-family: var(--font-head);
          font-weight: 400;
          color: #fff;
          font-size: clamp(1.5rem, 3.1vw, 2.7rem);
          line-height: 1.42;
          letter-spacing: -0.01em;
        }
        @media (min-width: 768px) { .story-text { max-width: 26ch; } }
        @media (min-width: 1100px) { .story-text { max-width: 30ch; } }

        /* each clause: starts dim, low, softly blurred → settles, staggered */
        .seg {
          opacity: 0;
          filter: blur(6px);
          transition: opacity 0.7s var(--ease), filter 0.7s var(--ease);
          transition-delay: calc(var(--i) * 95ms);
        }
        .story.lit .seg { opacity: 0.72; filter: blur(0); }
        .seg.em {
          color: var(--orange);
          font-weight: 500;
        }
        .story.lit .seg.em {
          opacity: 1;
          text-shadow: 0 0 26px rgba(232, 114, 42, 0.35);
        }

        .story-foot {
          display: flex;
          align-items: center;
          gap: clamp(1.5rem, 4vw, 3rem);
          flex-wrap: wrap;
          margin-top: clamp(2rem, 5vh, 3.2rem);
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s var(--ease) 0.9s, transform 0.8s var(--ease) 0.9s;
        }
        .story.lit .story-foot { opacity: 1; transform: none; }
        .story-cue {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          color: var(--text-faint);
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .story-cue-line {
          width: 64px;
          height: 1px;
          background: linear-gradient(90deg, var(--orange), transparent);
          position: relative;
          overflow: hidden;
        }
        .story-cue-line::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 22px;
          height: 100%;
          background: var(--orange);
          box-shadow: 0 0 8px var(--orange);
          animation: storyCue 2.4s ease-in-out infinite;
        }
        @keyframes storyCue {
          0% { transform: translateX(-24px); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateX(64px); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .story-bg img { animation: none; }
          .story-cue-line::after { animation: none; }
          .seg, .story-eyebrow, .story-foot, .story-marker { transition: none; }
        }
      `}</style>
    </section>
  );
}
