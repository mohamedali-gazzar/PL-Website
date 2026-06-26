"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { values } from "@/lib/content";

// stroke icons — one per value station (consistent line set, no emoji)
const ICONS = {
  shield: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.2-2.9 7.4-7 8.8C7.9 18.4 5 15.2 5 11V6l7-3z" /><path d="M9 11.5l2 2 4-4" />
    </svg>
  ),
  bulb: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.5.4.8.9.9 1.5l.2 1h5l.2-1c.1-.6.4-1.1.9-1.5A6 6 0 0 0 12 3z" />
    </svg>
  ),
  summit: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 20l6.5-13 4 7.5 2.2-3.5L21 20z" /><path d="M3 20h18" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="12" r="5" /><circle cx="15" cy="12" r="5" />
    </svg>
  ),
  flag: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 21V4" /><path d="M6 4h11l-2.2 4L17 12H6" />
    </svg>
  ),
};

/**
 * Core Values — ONE full-screen section. The whole electrical network (entry
 * from above, a conduit branching to five nodes, exit below) is visible at once
 * on a pinned screen. Scrolling does NOT move the user past separate cards: the
 * stage stays put while scroll PROGRESS drives an energy pulse down the conduit,
 * powering on one node at a time (node → branch → icon → title → line) and
 * leaving each lit. By the end all five are active; the energy then flows out
 * the bottom into the next section. Pure transform/opacity; reduced motion gets
 * the full lit network statically.
 */
export default function CoreValues() {
  const root = useRef(null);
  const net = useRef(null);
  const fill = useRef(null);
  const pulse = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stations = [...net.current.querySelectorAll(".cv-station")];

    if (reduce) {
      stations.forEach((s) => s.classList.add("is-on"));
      if (fill.current) fill.current.style.transform = "scaleY(1)";
      if (pulse.current) pulse.current.style.opacity = "0";
      return;
    }

    root.current.classList.add("is-live"); // enables the tall scroll track + pin
    gsap.registerPlugin(ScrollTrigger);

    let fractions = stations.map((_, i) => (i + 0.5) / stations.length);
    const measure = () => {
      const nr = net.current.getBoundingClientRect();
      if (!nr.height) return;
      fractions = stations.map((s) => {
        const r = s.querySelector(".cv-node").getBoundingClientRect();
        return (r.top + r.height / 2 - nr.top) / nr.height;
      });
    };

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onRefresh: measure,
        onUpdate: (self) => {
          const p = self.progress;
          if (fill.current) fill.current.style.transform = `scaleY(${p})`;
          if (pulse.current) {
            pulse.current.style.transform = `translate(-50%, ${p * net.current.offsetHeight}px)`;
            pulse.current.style.opacity = p > 0.01 && p < 0.995 ? "1" : "0";
          }
          for (let i = 0; i < stations.length; i++) {
            stations[i].classList.toggle("is-on", p >= fractions[i]);
          }
        },
      });
      measure();
      ScrollTrigger.refresh();
      return () => st.kill();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="cv" ref={root} aria-label="Our values">
      <div className="cv-sticky">
        <div className="container cv-inner">
          <header className="cv-head">
            <span className="eyebrow">Our Values</span>
            <h2 className="cv-title">
              Five values. <span>One grid.</span>
            </h2>
            <p className="cv-lead">The current that powers everything we build.</p>
          </header>

          <div className="cv-net" ref={net}>
            <span className="cv-entry" aria-hidden="true" />
            <span className="cv-spine" aria-hidden="true" />
            <span className="cv-fill" ref={fill} aria-hidden="true" />
            <span className="cv-pulse" ref={pulse} aria-hidden="true" />

            <div className="cv-stations">
              {values.map((v, i) => (
                <div className={`cv-station ${i % 2 ? "right" : "left"}`} key={v.title}>
                  <div className="cv-node" aria-hidden="true">
                    <span className="cv-core" />
                  </div>
                  <article className="cv-card">
                    <span className="cv-icon">{ICONS[v.icon]}</span>
                    <div className="cv-text">
                      <span className="cv-num">{String(i + 1).padStart(2, "0")}</span>
                      <h3>{v.title}</h3>
                      <p>{v.line}</p>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            <span className="cv-exit" aria-hidden="true" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .cv {
          position: relative;
        }
        /* live (motion ok): a tall track so the pinned stage can scrub */
        .cv.is-live {
          height: 300vh;
        }
        .cv-sticky {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: stretch;
          overflow: hidden;
          padding: clamp(1.5rem, 4vh, 3rem) 0;
        }
        .cv.is-live .cv-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100dvh;
          min-height: 0;
        }
        /* soft glow at the top where the network enters */
        .cv-sticky::before {
          content: "";
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: min(640px, 92%);
          height: 340px;
          background: radial-gradient(circle, rgba(232, 114, 42, 0.09), transparent 70%);
          pointer-events: none;
        }
        .cv-inner {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .cv-head {
          flex: 0 0 auto;
          text-align: center;
        }
        .cv-head :global(.eyebrow) {
          justify-content: center;
        }
        .cv-title {
          font-family: var(--font-head);
          font-weight: 800;
          text-transform: uppercase;
          font-size: clamp(1.7rem, 4vw, 3rem);
          line-height: 1;
          margin-top: 0.7rem;
        }
        .cv-title span {
          color: var(--orange);
        }
        .cv-lead {
          color: var(--text-dim);
          font-size: clamp(0.95rem, 1.4vw, 1.08rem);
          margin-top: 0.7rem;
        }

        /* ── the network: full conduit + 5 branched nodes, all on screen ── */
        .cv-net {
          position: relative;
          flex: 1 1 auto;
          min-height: 0;
          width: 100%;
          max-width: 860px;
          margin: clamp(1rem, 3vh, 2rem) auto 0;
        }
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
          background: linear-gradient(180deg, var(--orange-deep), var(--orange) 45%, var(--orange-bright));
          box-shadow: 0 0 12px rgba(232, 114, 42, 0.75), 0 0 4px rgba(232, 114, 42, 1);
          will-change: transform;
        }
        /* entry from the previous scene / exit into the next one */
        .cv-entry,
        .cv-exit {
          position: absolute;
          left: 50%;
          width: 2px;
          margin-left: -1px;
          height: clamp(28px, 5vh, 56px);
          pointer-events: none;
        }
        .cv-entry {
          bottom: 100%;
          background: linear-gradient(180deg, transparent, rgba(232, 114, 42, 0.45));
        }
        .cv-exit {
          top: 100%;
          background: linear-gradient(180deg, rgba(232, 114, 42, 0.45), transparent);
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

        .cv-stations {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
        }
        .cv-station {
          display: grid;
          grid-template-columns: 1fr 56px 1fr;
          align-items: center;
        }
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
          transition: transform 0.45s cubic-bezier(0.34, 1.4, 0.5, 1);
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

        /* compact horizontal station — icon beside the text, so all five fit
           on one pinned screen */
        .cv-card {
          display: flex;
          align-items: center;
          gap: clamp(0.7rem, 1.6vw, 1.1rem);
          max-width: 360px;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.55s var(--ease), transform 0.55s var(--ease);
        }
        .cv-station.left .cv-card {
          grid-column: 1;
          justify-self: end;
          flex-direction: row-reverse;
          text-align: right;
        }
        .cv-station.right .cv-card {
          grid-column: 3;
          justify-self: start;
          flex-direction: row;
          text-align: left;
        }
        .cv-station.is-on .cv-card {
          opacity: 1;
          transform: none;
        }
        .cv-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .cv-num,
        .cv-icon,
        .cv-card h3,
        .cv-card p {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.45s var(--ease), transform 0.45s var(--ease);
        }
        .cv-station.is-on .cv-icon { opacity: 1; transform: none; transition-delay: 0.02s; }
        .cv-station.is-on .cv-num { opacity: 1; transform: none; transition-delay: 0.08s; }
        .cv-station.is-on .cv-card h3 { opacity: 1; transform: none; transition-delay: 0.14s; }
        .cv-station.is-on .cv-card p { opacity: 1; transform: none; transition-delay: 0.2s; }

        .cv-num {
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 0.68rem;
          letter-spacing: 0.22em;
          color: var(--orange);
        }
        .cv-icon {
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          width: clamp(44px, 4vw, 54px);
          height: clamp(44px, 4vw, 54px);
          border-radius: 13px;
          color: var(--orange);
          background: rgba(232, 114, 42, 0.08);
          border: 1px solid rgba(232, 114, 42, 0.22);
        }
        .cv-card h3 {
          font-family: var(--font-head);
          font-weight: 800;
          text-transform: uppercase;
          font-size: clamp(1.25rem, 2.1vw, 1.8rem);
          color: #fff;
          margin: 0.12rem 0 0.22rem;
          line-height: 1;
        }
        .cv-card p {
          color: var(--text-dim);
          font-size: clamp(0.9rem, 1.15vw, 1rem);
          line-height: 1.4;
          max-width: 30ch;
        }

        @media (max-width: 760px) {
          .cv.is-live {
            height: 280vh;
          }
          .cv-net {
            max-width: 460px;
          }
          .cv-spine,
          .cv-fill,
          .cv-pulse,
          .cv-entry,
          .cv-exit {
            left: 26px;
          }
          .cv-station {
            grid-template-columns: 52px 1fr;
            column-gap: 0.7rem;
          }
          .cv-node {
            grid-column: 1;
          }
          .cv-station.left .cv-card,
          .cv-station.right .cv-card {
            grid-column: 2;
            justify-self: start;
            flex-direction: row;
            text-align: left;
            max-width: none;
          }
          .cv-station.left .cv-node::after {
            right: auto;
            left: 100%;
            transform-origin: left center;
            background: linear-gradient(90deg, var(--orange), transparent);
          }
          .cv-icon { width: 42px; height: 42px; }
          .cv-card h3 { font-size: 1.25rem; }
          .cv-card p { font-size: 0.9rem; }
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
