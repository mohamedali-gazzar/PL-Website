"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { milestones } from "@/lib/content";

export default function Milestones() {
  const root = useRef(null);
  const fill = useRef(null);
  const [active, setActive] = useState(0);
  // correct value on the client's first paint (matchMedia is unavailable in SSR)
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches
  );

  // Click anywhere on the section to skip it in the scroll direction —
  // down jumps past it, up jumps back above it. (desktop only). Direction is
  // read lazily from Lenis, so no dedicated scroll listener is needed.
  const skipOnClick = () => {
    if (mobile) return;
    const r = root.current.getBoundingClientRect();
    const topDoc = window.scrollY + r.top;
    const bottomDoc = window.scrollY + r.bottom;
    const down = (window.__lenis?.direction ?? 1) >= 0;
    const y = down ? bottomDoc : Math.max(0, topDoc - window.innerHeight);
    const lenis = window.__lenis;
    if (lenis?.scrollTo) lenis.scrollTo(y, { duration: 0.9 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  // track the breakpoint so the layout + image strategy switch correctly
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    // On mobile the section flows vertically (see CSS) — no pin, no scrub, no
    // per-frame onUpdate. This avoids a 6×-viewport pinned scrub on the
    // weakest devices.
    if (mobile) return;
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
  }, [mobile]);

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

          {/* main: each milestone is a self-contained text+image block, so it
              can crossfade in place on desktop and flow vertically on mobile */}
          <div className="ms-main">
            {milestones.map((m, i) => {
              // desktop: only load the active image and its neighbours (all
              // share one in-view stage, so native lazy can't help). mobile:
              // load all (native lazy works because they're in normal flow).
              const near = Math.abs(i - active) <= 1;
              return (
                <div className={`ms-item ${i === active ? "is-active" : ""}`} key={m.year}>
                  <div className="ms-text">
                    <span className="big-year">{m.year}</span>
                    <h3>{m.title}</h3>
                    <p>{m.body}</p>
                  </div>
                  <div className="ms-media">
                    <img
                      src={mobile ? m.img : near ? m.img : undefined}
                      alt={`${m.year} — ${m.title}`}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                    <span className="ms-frame" />
                  </div>
                </div>
              );
            })}
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

        /* ── main content: stacked crossfading items (desktop) ── */
        .ms-main {
          position: relative;
          min-height: 62vh;
        }
        .ms-item {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 1fr 1.05fr;
          gap: clamp(2rem, 5vw, 5rem);
          align-items: stretch;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.55s var(--ease), transform 0.55s var(--ease);
          pointer-events: none;
        }
        .ms-item.is-active {
          opacity: 1;
          transform: none;
          pointer-events: auto;
        }
        .ms-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
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
        .ms-text h3 {
          font-size: clamp(1.6rem, 3.2vw, 2.8rem);
          text-transform: uppercase;
          color: #fff;
          margin: 0.6rem 0 1.2rem;
          line-height: 1.02;
        }
        .ms-text p {
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
        }
        .ms-frame {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 20px;
          box-shadow: inset 0 0 0 1px rgba(241, 103, 34, 0.25);
        }

        @media (max-width: 900px) {
          /* no pin/scrub on phones — the whole timeline flows vertically */
          .ms {
            height: auto !important;
          }
          .ms-stage {
            position: static;
            height: auto;
            display: block;
            overflow: visible;
            padding: 4rem 0;
            cursor: auto;
          }
          .ms-top {
            display: none;
          }
          .ms-main {
            position: static;
            min-height: 0;
            display: block;
          }
          .ms-item {
            position: static;
            inset: auto;
            display: flex;
            flex-direction: column;
            opacity: 1;
            transform: none;
            pointer-events: auto;
            margin-bottom: 3rem;
          }
          .ms-media {
            order: -1;
            height: 52vw;
            min-height: 220px;
            margin-bottom: 1.2rem;
          }
          .ms-skip-hint {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
