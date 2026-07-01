"use client";

import { useEffect, useRef, useState } from "react";

// A position-free way to show the sheer scale of a product's portfolio:
// a count-up headline + an infinite marquee "roll-call" of every project name.
// Reused across products (PCSS / PRAL / PSEC) via props.
const ROWS = 4;
const BASE_DUR = 130; // seconds for the longest row; rows vary for an organic feel
const MIN_PER_HALF = 12; // repeat short rows so each marquee half always fills the viewport

// Repeat items until there are at least `min`, so a small project list still
// produces a track wide enough for a seamless, gap-free loop.
function repeatToMin(items, min) {
  if (items.length === 0) return [];
  const out = [];
  while (out.length < min) out.push(...items);
  return out;
}

export default function ProjectsScale({
  projects = [],
  total,
  title,
  lead,
  eyebrow = "Track record",
  ariaLabel = "Project track record",
}) {
  const root = useRef(null);
  // Headline count: an explicit `total` (e.g. PCSS shows the full delivered
  // count over a curated subset) or, by default, the number of listed projects.
  const target = typeof total === "number" ? total : projects.length;
  const [count, setCount] = useState(0);

  // Interleave the projects across the marquee rows so each row is varied.
  const rows = Array.from({ length: ROWS }, () => []);
  projects.forEach((p, i) => rows[i % ROWS].push(p));

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const run = () => {
      el.classList.add("in");
      if (reduce) {
        setCount(target);
        return;
      }
      const dur = 1500;
      let start = null;
      const tick = (ts) => {
        if (start === null) start = ts;
        const t = Math.min(1, (ts - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        setCount(Math.round(eased * target));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <section className="sc-sec" ref={root} aria-label={ariaLabel}>
      <div className="container sc-head">
        <span className="eyebrow">{eyebrow}</span>
        <div className="sc-num" aria-hidden="true">+{count}</div>
        <h2 className="section-title sc-title">
          {title} — <span className="kw">and counting</span>
        </h2>
        <p className="sc-lead">{lead}</p>
      </div>

      <div className="sc-rows" aria-hidden="true">
        {rows.map((row, r) => {
          const half = repeatToMin(row, MIN_PER_HALF);
          const track = [...half, ...half];
          return (
            <div className="sc-row" key={r}>
              <div
                className={`sc-track ${r % 2 ? "rtl" : "ltr"}`}
                style={{ "--dur": `${BASE_DUR - (ROWS - 1 - r) * 4}s` }}
              >
                {track.map((p, i) => (
                  <span className="sc-chip" key={i} dir="auto" data-dup={i >= row.length ? "1" : undefined}>
                    <span className="sc-dot" />
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="sc-foot">Hover any project to pause the roll</p>

      <style jsx>{`
        .sc-sec {
          padding: clamp(4rem, 11vh, 7rem) 0 clamp(4.5rem, 12vh, 7.5rem);
          background: linear-gradient(180deg, #060607, var(--bg));
          border-top: 1px solid var(--line);
          overflow: hidden;
        }
        .sc-head { text-align: center; max-width: min(1080px, 92vw); margin: 0 auto clamp(2.6rem, 6vh, 4rem); }
        .sc-head :global(.eyebrow) { justify-content: center; }

        .sc-num {
          font-family: var(--font-head);
          font-weight: 800;
          line-height: 0.9;
          font-size: clamp(4.5rem, 15vw, 10rem);
          margin: 0.6rem 0 0.4rem;
          background: linear-gradient(180deg, #ffffff 30%, var(--orange));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }
        .sc-title { margin: 0.4rem 0 1rem; }
        .sc-title :global(.kw) { display: block; color: var(--orange); }
        .sc-lead { max-width: 58ch; margin: 0 auto; color: var(--text-dim); font-size: clamp(0.98rem, 1.3vw, 1.1rem); line-height: 1.6; }

        .sc-rows {
          display: flex;
          flex-direction: column;
          gap: clamp(0.7rem, 1.6vw, 1.05rem);
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
          opacity: 0;
        }
        .sc-sec.in .sc-rows { opacity: 1; transition: opacity 0.9s ease 0.2s; }

        /* Vertical padding gives the hover lift clip-safe room (overflow:hidden
           clips to the padding box); negative margin keeps the row rhythm. */
        .sc-row { overflow: hidden; padding: 6px 0; margin: -6px 0; }
        .sc-track { display: flex; gap: clamp(0.55rem, 1.3vw, 0.85rem); width: max-content; will-change: transform; }
        .sc-track.ltr { animation: sc-ltr var(--dur) linear infinite; }
        .sc-track.rtl { animation: sc-rtl var(--dur) linear infinite; }
        .sc-row:hover .sc-track { animation-play-state: paused; }

        @keyframes sc-ltr {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes sc-rtl {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }

        .sc-chip {
          display: inline-flex; align-items: center; gap: 0.55rem; white-space: nowrap;
          padding: 0.6rem 1.1rem; border-radius: 999px;
          border: 1px solid var(--line); background: var(--bg-2);
          color: var(--text-dim);
          font-family: var(--font-body); font-size: clamp(0.82rem, 1.05vw, 0.95rem);
          transition: border-color 0.25s ease, color 0.25s ease, background 0.25s ease, transform 0.25s var(--ease);
        }
        .sc-chip:hover {
          border-color: rgba(232, 114, 42, 0.6);
          color: #fff;
          background: rgba(232, 114, 42, 0.08);
          transform: translateY(-2px);
        }
        .sc-dot {
          width: 6px; height: 6px; border-radius: 50%; flex: none;
          background: var(--orange); box-shadow: 0 0 8px rgba(232, 114, 42, 0.8);
        }

        .sc-foot {
          text-align: center; color: var(--text-faint);
          font-size: 0.78rem; letter-spacing: 0.06em;
          margin: clamp(1.8rem, 4vh, 2.6rem) auto 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .sc-sec.in .sc-head, .sc-sec.in .sc-rows { transition: none; }
          .sc-rows {
            -webkit-mask-image: none; mask-image: none;
            max-width: var(--maxw, 1200px); padding: 0 clamp(1.2rem, 5vw, 2rem);
            margin-left: auto; margin-right: auto;
          }
          .sc-row { overflow: visible; }
          .sc-track { animation: none; flex-wrap: wrap; width: auto; justify-content: center; }
          .sc-chip[data-dup="1"] { display: none; }
        }
      `}</style>
    </section>
  );
}
