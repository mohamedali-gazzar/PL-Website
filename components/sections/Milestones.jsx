"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { milestones } from "@/lib/content";

export default function Milestones() {
  const root = useRef(null);
  const fill = useRef(null);
  const dir = useRef(1); // 1 = scrolling down, -1 = up
  const [active, setActive] = useState(0);

  // Click anywhere on the section to skip it in the scroll direction —
  // down jumps past it, up jumps back above it. (desktop only)
  const skipOnClick = () => {
    if (window.matchMedia("(max-width: 900px)").matches) return;
    const r = root.current.getBoundingClientRect();
    const topDoc = window.scrollY + r.top;
    const bottomDoc = window.scrollY + r.bottom;
    const y = dir.current >= 0 ? bottomDoc : Math.max(0, topDoc - window.innerHeight);
    const lenis = window.__lenis;
    if (lenis?.scrollTo) lenis.scrollTo(y, { duration: 0.9 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  // track scroll direction for click-to-skip
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) > 1) {
        dir.current = y > last ? 1 : -1;
        last = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);
    const n = milestones.length;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        scrub: reduce ? false : true,
        onUpdate: (self) => {
          if (fill.current)
            fill.current.style.transform = `scaleX(${self.progress})`;
          const idx = Math.min(n - 1, Math.floor(self.progress * n + 0.0001));
          setActive((prev) => (prev === idx ? prev : idx));
        },
      });
      return () => st.kill();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      className="ms"
      ref={root}
      style={{ height: `${milestones.length * 75}vh` }}
      id="milestones"
    >
      <div className="ms-stage" onClick={skipOnClick}>
        <span className="ms-skip-hint" aria-hidden="true">Click anywhere to skip</span>
        <div className="container ms-inner">
          {/* top: horizontal year timeline */}
          <div className="ms-top">
            <span className="eyebrow">Our Milestones</span>
            <div className="ms-years">
              <div className="ms-line">
                <span className="ms-line-fill" ref={fill} />
              </div>
              <ul>
                {milestones.map((m, i) => (
                  <li
                    key={m.year}
                    className={i === active ? "on" : i < active ? "past" : ""}
                  >
                    <span className="yr-dot" />
                    <span className="yr-label">{m.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* main: text + image */}
          <div className="ms-main">
            <div className="ms-text">
              {milestones.map((m, i) => (
                <div className={`panel ${i === active ? "is-active" : ""}`} key={m.year}>
                  <span className="big-year">{m.year}</span>
                  <h3>{m.title}</h3>
                  <p>{m.body}</p>
                </div>
              ))}
            </div>

            <div className="ms-media">
              {milestones.map((m, i) => (
                <img
                  src={m.img}
                  alt={`${m.year} — ${m.title}`}
                  key={m.year}
                  className={i === active ? "is-active" : ""}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ))}
              <span className="ms-frame" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ms {
          position: relative;
          background: var(--bg-2);
        }
        .ms-stage {
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100dvh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .ms-stage {
          cursor: pointer;
        }
        .ms-skip-hint {
          position: absolute;
          right: clamp(1.2rem, 4vw, 3rem);
          top: clamp(5.5rem, 12vh, 7rem);
          z-index: 5;
          pointer-events: none;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-faint);
          opacity: 0.7;
        }
        .ms-inner {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: clamp(1.5rem, 4vh, 3rem);
        }

        /* ── top year timeline ── */
        .ms-top {
          width: 100%;
        }
        .ms-years {
          position: relative;
          margin-top: 1.4rem;
        }
        .ms-line {
          position: absolute;
          left: 0;
          right: 0;
          top: 5px;
          height: 2px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          overflow: hidden;
        }
        .ms-line-fill {
          position: absolute;
          inset: 0;
          transform-origin: left center;
          transform: scaleX(0);
          background: linear-gradient(90deg, var(--orange-deep), var(--orange-bright));
          box-shadow: 0 0 14px var(--orange);
        }
        .ms-years ul {
          position: relative;
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: space-between;
        }
        .ms-years li {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.7rem;
          font-family: var(--font-head);
          font-weight: 700;
        }
        .yr-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #1a1a1d;
          border: 2px solid rgba(255, 255, 255, 0.18);
          transition: all 0.35s var(--ease);
        }
        .yr-label {
          font-size: 0.85rem;
          color: var(--text-faint);
          transition: color 0.35s, transform 0.35s;
        }
        .ms-years li.past .yr-dot {
          border-color: var(--orange);
          background: var(--orange);
        }
        .ms-years li.on .yr-dot {
          border-color: var(--orange);
          background: var(--orange);
          box-shadow: 0 0 16px var(--orange);
          transform: scale(1.3);
        }
        .ms-years li.on .yr-label {
          color: var(--orange);
          transform: translateY(-2px);
        }

        /* ── main content ── */
        .ms-main {
          display: grid;
          grid-template-columns: 1fr 1.05fr;
          gap: clamp(2rem, 5vw, 5rem);
          align-items: stretch;
        }
        .ms-text {
          position: relative;
          min-height: 62vh;
        }
        .panel {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.55s var(--ease), transform 0.55s var(--ease);
          pointer-events: none;
        }
        .panel.is-active {
          opacity: 1;
          transform: none;
        }
        .big-year {
          font-family: var(--font-head);
          font-weight: 800;
          font-size: clamp(4rem, 12vw, 11rem);
          line-height: 0.82;
          letter-spacing: -0.03em;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.16),
            rgba(255, 255, 255, 0.03)
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .panel h3 {
          font-size: clamp(1.6rem, 3.2vw, 2.8rem);
          text-transform: uppercase;
          color: #fff;
          margin: 0.6rem 0 1.2rem;
          line-height: 1.02;
        }
        .panel p {
          color: var(--text-dim);
          font-size: clamp(1rem, 1.4vw, 1.2rem);
          max-width: 46ch;
          line-height: 1.6;
        }
        .ms-media {
          position: relative;
          height: 62vh;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--line);
        }
        .ms-media img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transform: scale(1.08);
          transition: opacity 0.7s var(--ease), transform 1.2s var(--ease);
        }
        .ms-media img.is-active {
          opacity: 1;
          transform: scale(1);
        }
        .ms-frame {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 20px;
          box-shadow: inset 0 0 0 1px rgba(241, 103, 34, 0.25);
        }

        @media (max-width: 900px) {
          .ms-main {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .ms-media {
            order: -1;
            height: 40vh;
          }
          .ms-text {
            min-height: 0;
            height: 40vh;
          }
          .yr-label {
            font-size: 0.72rem;
          }
          .ms-skip-hint {
            display: none;
          }
          .ms-stage {
            cursor: auto;
          }
        }
      `}</style>
    </section>
  );
}
