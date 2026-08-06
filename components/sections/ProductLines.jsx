"use client";

import Link from "next/link";
import { productLines } from "@/lib/content";
import { Reveal, CountUp } from "@/components/Primitives";

// Premium "Feature-Rich Showcase" of the product lines: a glass-card grid where
// each line leads with its baked-title cover, its two headline specs (count-up),
// a short blurb and a CTA. A glowing orange "current" edge ties into the
// "one flow of power" idea and lights up on hover.
export default function ProductLines() {
  return (
    <section className="lines" id="solutions">
      <span className="glow" aria-hidden="true" />
      <div className="container">
        <Reveal>
          <div className="head sec-head">
            <span className="eyebrow">Product Lines</span>
            <h2 className="section-title">
              Six lines.
              <br />
              <span>One flow of power.</span>
            </h2>
            <p className="head-sub">
              From low-voltage distribution to medium-voltage switchgear and compact
              substations — every line engineered, type-tested and assembled in-house.
            </p>
          </div>
        </Reveal>

        <div className="grid">
          {productLines.map((l, i) => (
            <Reveal key={l.key} delay={i * 80}>
              <article className="fcard">
                <Link href={l.href} className="fcard-link" aria-label={l.title}>
                  <span className="edge" aria-hidden="true" />
                  <div className="media">
                    <img src={l.img} alt={l.title} loading="lazy" />
                    <span className="veil" aria-hidden="true" />
                    <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                    <span className="tint" aria-hidden="true" />
                  </div>

                  <div className="body">
                    <h3 className="sr-only">{l.title}</h3>

                    <div className="specs">
                      {l.specs.map((s) => (
                        <div className="spec" key={s.label}>
                          <span className="v">
                            <CountUp value={s.value} suffix={s.suffix} />
                          </span>
                          <span className="l">{s.label}</span>
                        </div>
                      ))}
                    </div>

                    <p className="blurb">{l.blurb}</p>

                    <span className="more">
                      Explore line <i aria-hidden="true">→</i>
                    </span>
                  </div>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <style jsx>{`
        .lines {
          position: relative;
          padding: clamp(5rem, 12vh, 9rem) 0;
          overflow: hidden;
        }
        /* ambient orange glow behind the grid */
        .glow {
          position: absolute;
          top: 8%;
          left: 50%;
          width: min(1100px, 90vw);
          height: 520px;
          transform: translateX(-50%);
          background: radial-gradient(
            60% 60% at 50% 40%,
            rgba(232, 114, 42, 0.16),
            transparent 70%
          );
          filter: blur(20px);
          pointer-events: none;
          z-index: 0;
        }
        .container {
          position: relative;
          z-index: 1;
        }

        .head {
          text-align: center;
          max-width: 60ch;
          margin-inline: auto;
        }
        .head :global(.eyebrow) {
          justify-content: center;
        }
        .section-title {
          margin: 1rem 0 0;
          color: #fff;
        }
        .section-title span {
          color: var(--orange);
          text-shadow: 0 0 34px rgba(232, 114, 42, 0.45);
        }
        .head-sub {
          margin: 1.2rem auto 0;
          max-width: 56ch;
          color: var(--text-dim);
          font-size: clamp(0.95rem, 1.2vw, 1.05rem);
          line-height: 1.6;
        }

        .grid {
          margin-top: clamp(2.4rem, 5vw, 3.6rem);
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1rem, 1.6vw, 1.5rem);
        }
        .grid :global(.reveal) {
          display: flex;
        }

        /* ── glass card ── */
        .fcard {
          position: relative;
          flex: 1;
          border: 1px solid var(--line);
          border-radius: 20px;
          overflow: hidden;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.045),
            rgba(255, 255, 255, 0.012)
          );
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: transform 0.45s var(--ease), border-color 0.45s ease,
            box-shadow 0.45s ease;
        }
        .fcard::before {
          /* soft top highlight, glass edge */
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.25),
            transparent
          );
          opacity: 0.6;
          z-index: 3;
        }
        .fcard:hover {
          transform: translateY(-10px);
          border-color: rgba(232, 114, 42, 0.55);
          box-shadow: 0 40px 90px -30px rgba(0, 0, 0, 0.85),
            0 0 50px -12px rgba(232, 114, 42, 0.4);
        }
        .fcard-link {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        /* the orange "current" edge — a hairline that runs across the top of the
           image and lights up on hover (the flow of power) */
        .edge {
          position: absolute;
          top: 0;
          left: 8%;
          right: 8%;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--orange),
            var(--orange-bright, #ff8a4c),
            var(--orange),
            transparent
          );
          opacity: 0;
          box-shadow: 0 0 16px rgba(232, 114, 42, 0.7);
          transition: opacity 0.45s ease;
          z-index: 4;
        }
        .fcard:hover .edge {
          opacity: 1;
        }

        .media {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
        }
        .media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s var(--ease);
        }
        .fcard:hover .media img {
          transform: scale(1.07);
        }
        .veil {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 52%,
            rgba(10, 10, 12, 0.85) 100%
          );
        }
        /* subtle orange wash that fades in on hover */
        .tint {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            120% 90% at 50% 0%,
            rgba(232, 114, 42, 0.16),
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.45s ease;
        }
        .fcard:hover .tint {
          opacity: 1;
        }
        .idx {
          position: absolute;
          top: 1rem;
          left: 1rem;
          font-family: var(--font-head);
          font-weight: 800;
          font-size: 0.8rem;
          letter-spacing: 0.02em;
          color: #fff;
          background: rgba(232, 114, 42, 0.92);
          padding: 0.28rem 0.62rem;
          border-radius: 8px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
          z-index: 3;
        }

        .body {
          position: relative;
          padding: 1.5rem 1.6rem 1.7rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        /* headline specs — the premium data moment */
        .specs {
          display: flex;
          gap: 1.4rem;
        }
        .spec {
          position: relative;
          flex: 1;
        }
        .spec + .spec::before {
          content: "";
          position: absolute;
          left: -0.7rem;
          top: 0.15rem;
          bottom: 0.15rem;
          width: 1px;
          background: var(--line);
        }
        .v {
          display: block;
          font-family: var(--font-head);
          font-weight: 800;
          font-size: clamp(1.5rem, 2.4vw, 1.9rem);
          line-height: 1;
          color: var(--orange);
          font-variant-numeric: tabular-nums;
          text-shadow: 0 0 22px rgba(232, 114, 42, 0.28);
        }
        .l {
          display: block;
          margin-top: 0.35rem;
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-faint);
        }
        .blurb {
          margin: 1.1rem 0 1.3rem;
          color: var(--text-dim);
          font-size: 0.9rem;
          line-height: 1.55;
          flex: 1;
        }
        .more {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 0.85rem;
          color: #fff;
          transition: color 0.3s ease;
        }
        .more i {
          font-style: normal;
          transition: transform 0.3s var(--ease);
        }
        .fcard:hover .more {
          color: var(--orange);
        }
        .fcard:hover .more i {
          transform: translateX(6px);
        }

        .fcard-link:focus-visible {
          outline: 2px solid var(--orange);
          outline-offset: 3px;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
            max-width: 760px;
            margin-inline: auto;
          }
        }
        @media (max-width: 600px) {
          .grid {
            grid-template-columns: 1fr;
            max-width: 440px;
          }
          .blurb {
            flex: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .fcard,
          .media img,
          .edge,
          .tint,
          .more,
          .more i {
            transition: none;
          }
          .fcard:hover {
            transform: none;
          }
          .fcard:hover .media img {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
