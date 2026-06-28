"use client";

import { useEffect, useRef } from "react";
import { pcssProjects } from "@/lib/pcssProjects";

// Egypt outline on a 940×820 viewBox (reused from the network map). Cairo anchor.
const EGYPT =
  "M40 27 L190 43 L382 55 L418 35 L520 30 L554 49 L662 60 L695 45 L742 188 L698 316 L583 180 L572 148 L558 193 L663 362 L697 452 L742 533 L886 772 L29 772 L29 226 Z";
const CAIRO = { x: 478, y: 144 };
const VW = 940, VH = 820;

export default function ProjectsMap() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="pm-sec" ref={root} aria-label="PCSS projects across Egypt">
      <div className="container pm-grid">
        <div className="pm-head">
          <span className="eyebrow">Projects</span>
          <h2 className="section-title pm-title">Deployed across Egypt</h2>
          <p className="pm-lead">
            A selection of PCSS compact-substation projects delivered nationwide.
            Hover a node to see the project.
          </p>
          <p className="pm-count"><b>+{pcssProjects.length}</b> PCSS projects and counting.</p>
        </div>

        <div className="pm-map">
          <svg viewBox={`0 0 ${VW} ${VH}`} className="pm-svg" aria-hidden="true">
            <defs>
              <pattern id="pmGrid" width="46" height="46" patternUnits="userSpaceOnUse">
                <path d="M46 0H0V46" fill="none" stroke="rgba(232,114,42,0.08)" strokeWidth="1" />
              </pattern>
              <radialGradient id="pmGlow" cx="51%" cy="20%" r="60%">
                <stop offset="0%" stopColor="rgba(232,114,42,0.16)" />
                <stop offset="100%" stopColor="rgba(232,114,42,0)" />
              </radialGradient>
            </defs>
            <rect width={VW} height={VH} fill="url(#pmGrid)" />
            <rect width={VW} height={VH} fill="url(#pmGlow)" />
            <path className="pm-land" d={EGYPT} pathLength="1" />
          </svg>

          <div className="pm-nodes">
            <span
              className="pm-cairo"
              style={{ left: `${(CAIRO.x / VW) * 100}%`, top: `${(CAIRO.y / VH) * 100}%` }}
              aria-hidden="true"
            >
              Cairo
            </span>
            {pcssProjects.map((p, i) => (
              <button
                key={i}
                type="button"
                className="pm-node"
                style={{ left: `${(p.x / VW) * 100}%`, top: `${(p.y / VH) * 100}%`, "--i": i }}
              >
                <span className="pm-label" dir="auto">{p.name}</span>
                <span className="pm-dot" aria-hidden="true" />
                <span className="pm-sr">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .pm-sec { padding: clamp(4rem, 11vh, 7rem) 0; background: linear-gradient(180deg, var(--bg), #060607); border-top: 1px solid var(--line); }
        .pm-grid { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: clamp(2rem, 5vw, 4.5rem); align-items: center; }
        .pm-head { text-align: left; max-width: 46ch; }
        .pm-head :global(.eyebrow) { justify-content: flex-start; }
        .pm-title { margin: 1rem 0 1rem; }
        .pm-lead { color: var(--text-dim); font-size: clamp(0.98rem, 1.3vw, 1.1rem); line-height: 1.6; }

        .pm-map {
          position: relative;
          width: 100%;
          margin: 0;
          aspect-ratio: ${VW} / ${VH};
          overflow: visible;
        }
        .pm-svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
        .pm-land {
          fill: rgba(232, 114, 42, 0.04);
          stroke: var(--orange);
          stroke-width: 2;
          stroke-opacity: 0.65;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
        }
        .pm-sec.in .pm-land { stroke-dashoffset: 0; transition: stroke-dashoffset 1.8s ease; }

        .pm-nodes { position: absolute; inset: 0; opacity: 0; transition: opacity 0.8s ease 0.4s; }
        .pm-sec.in .pm-nodes { opacity: 1; }

        .pm-cairo {
          position: absolute; transform: translate(-50%, -210%);
          font-family: var(--font-body); font-size: 0.66rem; letter-spacing: 0.14em;
          color: var(--text-dim); white-space: nowrap; pointer-events: none;
        }

        .pm-node {
          position: absolute; transform: translate(-50%, -50%);
          width: 22px; height: 22px; display: grid; place-items: center;
          background: none; border: 0; padding: 0; cursor: pointer; color: inherit;
        }
        .pm-node:focus-visible { outline: none; }
        .pm-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--orange); box-shadow: 0 0 7px rgba(232, 114, 42, 0.85);
          transition: transform 0.22s var(--ease), box-shadow 0.22s ease;
        }
        .pm-node:hover .pm-dot, .pm-node:focus-visible .pm-dot {
          transform: scale(1.85);
          box-shadow: 0 0 14px rgba(232, 114, 42, 1), 0 0 0 5px rgba(232, 114, 42, 0.18);
        }
        .pm-node:hover, .pm-node:focus-visible { z-index: 20; }

        .pm-label {
          position: absolute; bottom: calc(100% - 2px); left: 50%;
          transform: translateX(-50%) translateY(5px) scale(0.96);
          transform-origin: bottom center;
          background: rgba(10, 10, 13, 0.95); border: 1px solid rgba(232, 114, 42, 0.55);
          color: #fff; padding: 0.35rem 0.6rem; border-radius: 8px;
          font-family: var(--font-body); font-size: 0.72rem; line-height: 1.25;
          max-width: 220px; white-space: normal; text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
          opacity: 0; pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s var(--ease);
        }
        .pm-node:hover .pm-label, .pm-node:focus-visible .pm-label {
          opacity: 1; transform: translateX(-50%) translateY(0) scale(1);
        }
        .pm-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }

        .pm-count { text-align: left; color: var(--text-dim); margin: clamp(1.4rem, 3.5vh, 2rem) 0 0; font-size: 0.95rem; }
        .pm-count b { color: var(--orange); font-family: var(--font-head); font-weight: 800; font-size: 1.1rem; }

        @media (max-width: 860px) {
          .pm-grid { grid-template-columns: 1fr; gap: clamp(1.8rem, 5vw, 2.6rem); }
          .pm-head { text-align: center; max-width: 60ch; margin: 0 auto; }
          .pm-head :global(.eyebrow) { justify-content: center; }
          .pm-count { text-align: center; }
          .pm-map { max-width: 560px; margin: 0 auto; }
        }
        @media (max-width: 640px) {
          .pm-label { font-size: 0.68rem; max-width: 150px; }
          .pm-node { width: 26px; height: 26px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pm-land, .pm-nodes { transition: none; }
        }
      `}</style>
    </section>
  );
}
