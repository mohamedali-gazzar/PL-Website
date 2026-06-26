"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { values } from "@/lib/content";

// stroke icons — one per value station (consistent line set, no emoji)
const ICONS = {
  shield: (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.2-2.9 7.4-7 8.8C7.9 18.4 5 15.2 5 11V6l7-3z" /><path d="M9 11.5l2 2 4-4" />
    </svg>
  ),
  bulb: (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.5.4.8.9.9 1.5l.2 1h5l.2-1c.1-.6.4-1.1.9-1.5A6 6 0 0 0 12 3z" />
    </svg>
  ),
  summit: (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 20l6.5-13 4 7.5 2.2-3.5L21 20z" /><path d="M3 20h18" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="12" r="5" /><circle cx="15" cy="12" r="5" />
    </svg>
  ),
  flag: (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 21V4" /><path d="M6 4h11l-2.2 4L17 12H6" />
    </svg>
  ),
};

/**
 * Core Values — a scroll-driven electrical grid. One glowing conduit threads
 * five value "stations". As you scroll, an energy pulse travels down the
 * conduit; each station powers on in turn (node lights → connector draws →
 * icon → title → description), stays lit, and the energy continues to the next,
 * then flows out the bottom into the following section. Pure transform/opacity;
 * falls back to a fully-lit static grid for reduced motion.
 */
export default function CoreValues() {
  const root = useRef(null);
  const grid = useRef(null);
  const fill = useRef(null);
  const pulse = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stations = [...grid.current.querySelectorAll(".cv-station")];

    if (reduce) {
      stations.forEach((s) => s.classList.add("is-on"));
      if (fill.current) fill.current.style.transform = "scaleY(1)";
      if (pulse.current) pulse.current.style.opacity = "0";
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    let fractions = stations.map((_, i) => (i + 0.5) / stations.length);
    const measure = () => {
      const gr = grid.current.getBoundingClientRect();
      if (!gr.height) return;
      fractions = stations.map((s) => {
        const r = s.querySelector(".cv-node").getBoundingClientRect();
        return (r.top + r.height / 2 - gr.top) / gr.height;
      });
    };

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: grid.current,
        start: "top 80%",
        end: "bottom 60%",
        scrub: 0.4,
        onRefresh: measure,
        onUpdate: (self) => {
          const p = self.progress;
          if (fill.current) fill.current.style.transform = `scaleY(${p})`;
          if (pulse.current) {
            pulse.current.style.transform = `translate(-50%, ${p * grid.current.offsetHeight}px)`;
            pulse.current.style.opacity = p > 0.012 && p < 0.99 ? "1" : "0";
          }
          for (let i = 0; i < stations.length; i++) {
            stations[i].classList.toggle("is-on", p >= fractions[i]);
          }
        },
      });
      measure();
      return () => st.kill();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="cv" ref={root} aria-label="Our values">
      <div className="container cv-head">
        <span className="eyebrow">Our Values</span>
        <h2 className="cv-title">
          Five values. <span>One grid.</span>
        </h2>
        <p className="cv-lead">
          The energy that powers everything Powerline builds — wired into one
          living network.
        </p>
      </div>

      <div className="container">
        <div className="cv-grid" ref={grid}>
          <span className="cv-spine" aria-hidden="true" />
          <span className="cv-fill" ref={fill} aria-hidden="true" />
          <span className="cv-pulse" ref={pulse} aria-hidden="true" />

          {values.map((v, i) => (
            <div className={`cv-station ${i % 2 ? "right" : "left"}`} key={v.title}>
              <div className="cv-node" aria-hidden="true">
                <span className="cv-core" />
              </div>
              <article className="cv-card">
                <span className="cv-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="cv-icon">{ICONS[v.icon]}</span>
                <h3>{v.title}</h3>
                <p>{v.line}</p>
              </article>
            </div>
          ))}
        </div>
        <span className="cv-tail" aria-hidden="true" />
      </div>

      <style jsx>{`
        .cv {
          position: relative;
          padding: clamp(4rem, 11vh, 8rem) 0 clamp(3rem, 7vh, 5rem);
          overflow: hidden;
        }
        /* soft energy glow where the grid begins — the network entering */
        .cv::before {
          content: "";
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: min(620px, 90%);
          height: 320px;
          background: radial-gradient(circle, rgba(232, 114, 42, 0.1), transparent 70%);
          pointer-events: none;
        }
        .cv-head {
          text-align: center;
          position: relative;
        }
        .cv-head :global(.eyebrow) {
          justify-content: center;
        }
        .cv-title {
          font-family: var(--font-head);
          font-weight: 800;
          text-transform: uppercase;
          font-size: clamp(1.9rem, 4.5vw, 3.4rem);
          line-height: 1;
          margin-top: 1rem;
        }
        .cv-title span {
          color: var(--orange);
        }
        .cv-lead {
          color: var(--text-dim);
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          line-height: 1.6;
          max-width: 46ch;
          margin: 1.1rem auto 0;
        }

        /* ── the grid ── */
        .cv-grid {
          position: relative;
          max-width: 860px;
          margin: clamp(2.5rem, 6vh, 4rem) auto 0;
        }
        /* the conduit: dim base + bright scroll-filled energy + leading pulse */
        .cv-spine,
        .cv-fill {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 2px;
          margin-left: -1px;
          border-radius: 2px;
        }
        .cv-spine {
          background: rgba(232, 114, 42, 0.16);
        }
        .cv-fill {
          height: 100%;
          transform-origin: top center;
          transform: scaleY(0);
          background: linear-gradient(
            180deg,
            var(--orange-deep),
            var(--orange) 45%,
            var(--orange-bright)
          );
          box-shadow: 0 0 12px rgba(232, 114, 42, 0.75),
            0 0 4px rgba(232, 114, 42, 1);
          will-change: transform;
        }
        .cv-pulse {
          position: absolute;
          top: 0;
          left: 50%;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: radial-gradient(circle, #fff 10%, var(--orange) 55%, transparent 72%);
          box-shadow: 0 0 22px 5px rgba(232, 114, 42, 0.9);
          transform: translate(-50%, 0);
          opacity: 0;
          pointer-events: none;
          will-change: transform, opacity;
          z-index: 3;
        }

        .cv-station {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 56px 1fr;
          align-items: center;
          min-height: clamp(170px, 25vh, 230px);
        }
        /* node on the conduit */
        .cv-node {
          grid-column: 2;
          justify-self: center;
          position: relative;
          z-index: 2;
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
        }
        .cv-node::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(232, 114, 42, 0.35);
          background: var(--bg);
          transition: border-color 0.4s var(--ease), box-shadow 0.4s var(--ease);
        }
        /* connector that draws out toward the station card */
        .cv-node::after {
          content: "";
          position: absolute;
          top: 50%;
          height: 2px;
          width: clamp(20px, 4vw, 48px);
          transform: translateY(-50%) scaleX(0);
          transition: transform 0.5s var(--ease);
        }
        .cv-station.left .cv-node::after {
          right: 100%;
          transform-origin: right center;
          background: linear-gradient(270deg, var(--orange), transparent);
        }
        .cv-station.right .cv-node::after {
          left: 100%;
          transform-origin: left center;
          background: linear-gradient(90deg, var(--orange), transparent);
        }
        .cv-core {
          position: relative;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--orange);
          transform: scale(0);
          transition: transform 0.45s var(--spring, cubic-bezier(0.34, 1.4, 0.5, 1));
        }
        .cv-station.is-on .cv-node::before {
          border-color: var(--orange);
          box-shadow: 0 0 16px rgba(232, 114, 42, 0.55);
        }
        .cv-station.is-on .cv-node::after {
          transform: translateY(-50%) scaleX(1);
        }
        .cv-station.is-on .cv-core {
          transform: scale(1);
          box-shadow: 0 0 14px 2px rgba(232, 114, 42, 0.9);
        }

        /* station card — reveals as the energy arrives */
        .cv-card {
          grid-column: 1;
          justify-self: end;
          text-align: right;
          max-width: 340px;
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 0.6s var(--ease), transform 0.6s var(--ease);
        }
        .cv-station.right .cv-card {
          grid-column: 3;
          justify-self: start;
          text-align: left;
        }
        .cv-station.is-on .cv-card {
          opacity: 1;
          transform: none;
        }
        /* internal stagger: number → icon → title → description */
        .cv-num,
        .cv-icon,
        .cv-card h3,
        .cv-card p {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
        }
        .cv-station.is-on .cv-num { opacity: 1; transform: none; transition-delay: 0.02s; }
        .cv-station.is-on .cv-icon { opacity: 1; transform: none; transition-delay: 0.1s; }
        .cv-station.is-on .cv-card h3 { opacity: 1; transform: none; transition-delay: 0.18s; }
        .cv-station.is-on .cv-card p { opacity: 1; transform: none; transition-delay: 0.26s; }

        .cv-num {
          display: inline-block;
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.22em;
          color: var(--orange);
        }
        .cv-icon {
          display: grid;
          place-items: center;
          width: 56px;
          height: 56px;
          border-radius: 14px;
          margin: 0.75rem 0 0.2rem;
          color: var(--orange);
          background: rgba(232, 114, 42, 0.08);
          border: 1px solid rgba(232, 114, 42, 0.22);
        }
        .cv-station.left .cv-icon {
          margin-left: auto;
        }
        .cv-card h3 {
          font-family: var(--font-head);
          font-weight: 800;
          text-transform: uppercase;
          font-size: clamp(1.5rem, 2.6vw, 2.1rem);
          color: #fff;
          margin: 0.5rem 0 0.45rem;
          line-height: 1;
        }
        .cv-card p {
          color: var(--text-dim);
          font-size: clamp(0.98rem, 1.3vw, 1.1rem);
          line-height: 1.55;
          max-width: 32ch;
        }
        .cv-station.left .cv-card p {
          margin-left: auto;
        }

        /* the energy continues out the bottom into the next section */
        .cv-tail {
          display: block;
          width: 2px;
          height: clamp(48px, 8vh, 90px);
          margin: 0 auto;
          background: linear-gradient(180deg, rgba(232, 114, 42, 0.5), transparent);
        }

        @media (max-width: 760px) {
          .cv-grid {
            max-width: 520px;
          }
          .cv-spine,
          .cv-fill,
          .cv-pulse {
            left: 22px;
          }
          .cv-station {
            grid-template-columns: 44px 1fr;
            min-height: 0;
            padding: 1.3rem 0;
            gap: 0 0.6rem;
          }
          .cv-node {
            grid-column: 1;
          }
          .cv-card,
          .cv-station.right .cv-card {
            grid-column: 2;
            justify-self: start;
            text-align: left;
            max-width: none;
          }
          .cv-station.left .cv-icon,
          .cv-station.left .cv-card p {
            margin-left: 0;
          }
          .cv-station.left .cv-node::after {
            right: auto;
            left: 100%;
            transform-origin: left center;
            background: linear-gradient(90deg, var(--orange), transparent);
          }
          .cv-tail {
            margin: 0 0 0 22px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cv-card,
          .cv-num,
          .cv-icon,
          .cv-card h3,
          .cv-card p,
          .cv-core,
          .cv-node::after {
            transition: none;
          }
          .cv-pulse {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
