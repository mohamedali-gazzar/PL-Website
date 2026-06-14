"use client";

import Link from "next/link";
import { productLines } from "@/lib/content";
import { Reveal, CountUp } from "@/components/Primitives";

const OFFSETS = ["0rem", "3.5rem", "0rem"]; // gentle wave for a "flowing" feel

export default function ProductLines() {
  return (
    <section className="lines" id="solutions">
      <div className="container">
        <Reveal>
          <div className="head sec-head">
            <span className="eyebrow">Product Lines</span>
            <h2 className="section-title">
              Three lines.
              <br />
              <span>One flow of power.</span>
            </h2>
          </div>
        </Reveal>

        <div className="flow">
          {/* energy line flowing through the cards */}
          <span className="flow-line">
            <span className="flow-pulse" />
          </span>

          {productLines.map((l, i) => (
            <Reveal key={l.key} delay={i * 140}>
              <article className="fcard" style={{ marginTop: OFFSETS[i] }}>
                <Link href={l.href} className="fcard-link" aria-label={l.title}>
                  <div className="fcard-media">
                    <img src={l.img} alt={l.title} loading="lazy" />
                    <span className="fcard-veil" />
                    <span className="fcard-idx">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="fcard-node" />
                  </div>

                  <div className="fcard-body">
                    <h3>{l.title}</h3>
                    <p>{l.blurb}</p>

                    <div className="fspecs">
                      {l.specs.map((s) => (
                        <div className="fspec" key={s.label}>
                          <span className="fv">
                            <CountUp value={s.value} suffix={s.suffix} />
                          </span>
                          <span className="fl">{s.label}</span>
                        </div>
                      ))}
                    </div>

                    <span className="more">
                      Explore line <i>→</i>
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
          background: transparent;
        }
        .flow {
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1.2rem, 2vw, 2rem);
          align-items: start;
        }
        /* flowing energy line behind the cards */
        .flow-line {
          position: absolute;
          left: 4%;
          right: 4%;
          top: 38%;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(241, 103, 34, 0.25),
            transparent
          );
          overflow: hidden;
          z-index: 0;
        }
        .flow-pulse {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 16%;
          background: linear-gradient(90deg, transparent, var(--orange), transparent);
          box-shadow: 0 0 18px var(--orange);
          animation: flowmove 3.6s linear infinite;
        }
        @keyframes flowmove {
          from {
            transform: translateX(-120%);
          }
          to {
            transform: translateX(700%);
          }
        }

        .fcard {
          position: relative;
          z-index: 1;
          border: 1px solid var(--line);
          border-radius: 20px;
          overflow: hidden;
          background: rgba(12, 12, 14, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: transform 0.45s var(--ease), border-color 0.45s,
            box-shadow 0.45s;
        }
        .fcard:hover {
          transform: translateY(-10px);
          border-color: rgba(241, 103, 34, 0.55);
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6),
            0 0 40px rgba(241, 103, 34, 0.15);
        }
        .fcard-link {
          display: block;
        }
        .fcard-media {
          position: relative;
          aspect-ratio: 5 / 4;
          overflow: hidden;
        }
        .fcard-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s var(--ease);
        }
        .fcard:hover .fcard-media img {
          transform: scale(1.08);
        }
        .fcard-veil {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 45%, rgba(12, 12, 14, 0.9));
        }
        .fcard-idx {
          position: absolute;
          top: 1.1rem;
          left: 1.1rem;
          font-family: var(--font-head);
          font-weight: 800;
          font-size: 0.85rem;
          color: #fff;
          background: rgba(241, 103, 34, 0.9);
          padding: 0.3rem 0.65rem;
          border-radius: 8px;
        }
        .fcard-node {
          position: absolute;
          bottom: -6px;
          left: 50%;
          width: 12px;
          height: 12px;
          margin-left: -6px;
          border-radius: 50%;
          background: var(--orange);
          box-shadow: 0 0 16px var(--orange);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .fcard:hover .fcard-node {
          opacity: 1;
        }
        .fcard-body {
          padding: 1.6rem 1.6rem 1.9rem;
        }
        .fcard-body h3 {
          font-size: clamp(1.5rem, 2.2vw, 2rem);
          text-transform: uppercase;
        }
        .fcard-body p {
          color: var(--text-dim);
          font-size: 0.92rem;
          line-height: 1.55;
          margin: 0.7rem 0 1.3rem;
          min-height: 6.2em;
        }
        .fspecs {
          display: flex;
          gap: 1.8rem;
          padding-top: 1.1rem;
          border-top: 1px solid var(--line);
        }
        .fv {
          display: block;
          font-family: var(--font-head);
          font-weight: 800;
          font-size: 1.5rem;
          color: var(--orange);
          line-height: 1;
        }
        .fl {
          font-size: 0.7rem;
          color: var(--text-faint);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .more {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.2rem;
          font-weight: 600;
          font-size: 0.85rem;
          color: #fff;
        }
        .more i {
          transition: transform 0.3s var(--ease);
        }
        .fcard:hover .more i {
          transform: translateX(6px);
          color: var(--orange);
        }

        @media (max-width: 900px) {
          .flow {
            grid-template-columns: 1fr;
            max-width: 460px;
            margin: 0 auto;
            gap: 1.5rem;
          }
          .fcard {
            margin-top: 0 !important;
          }
          .flow-line {
            display: none;
          }
          .fcard-body p {
            min-height: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .flow-pulse {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
