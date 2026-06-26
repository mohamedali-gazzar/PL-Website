"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { values } from "@/lib/content";

// The Powerline "P" — reused logo geometry; it is the central power hub.
const P_PATH =
  "M 45.955 44.083 C 44.205 47.355, 45.082 70.813, 47 72.023 C 47.839 72.553, 59.637 72.976, 73.782 72.985 C 100.907 73.001, 104.131 73.494, 107.369 78.117 C 109.205 80.737, 109.527 87.146, 107.970 90.055 C 106.135 93.484, 101.609 95, 93.205 95 C 82.182 95, 82 95.263, 82 111.174 C 82 127.156, 81.872 127.007, 95.579 126.983 C 123.215 126.934, 141.900 115.285, 146.640 95.147 C 151.347 75.148, 142.535 55.952, 124.593 47.121 C 115.027 42.412, 111.742 42.051, 78.285 42.024 C 47.665 42, 47.049 42.040, 45.955 44.083 M 54.202 57.250 L 54.500 63.500 79 64 C 106.298 64.557, 108.105 64.939, 113.724 71.338 C 119.421 77.827, 120.180 85.807, 115.897 94.202 C 112.907 100.062, 107.221 103.276, 98.660 103.942 L 91.500 104.500 91.500 111 L 91.500 117.500 95.846 117.812 C 98.236 117.984, 103.398 117.627, 107.318 117.019 C 127.223 113.930, 138.470 102.190, 138.470 84.500 C 138.470 74.861, 136.060 68.723, 129.702 62.167 C 120.156 52.325, 114.454 51.027, 80.702 51.012 L 53.905 51 54.202 57.250 M 46.035 78.934 C 44.626 81.568, 44.626 146.432, 46.035 149.066 C 46.980 150.830, 48.246 151, 60.464 151 C 71.306 151, 74.156 150.701, 75.429 149.429 C 76.786 148.071, 77 143.848, 77 118.429 L 77 89 88.800 89 C 101.191 89, 103 88.427, 103 84.500 C 103 80.421, 101.350 80, 85.371 80 C 72.861 80, 69.862 80.280, 68.571 81.571 C 67.214 82.929, 67 87.156, 67 112.619 L 67 142.095 60.750 141.798 L 54.500 141.500 54.235 110.585 C 54.057 89.810, 53.607 79.232, 52.863 78.335 C 51.226 76.362, 47.224 76.713, 46.035 78.934";

const ICONS = {
  shield: <><path d="M12 3l7 3v5c0 4.2-2.9 7.4-7 8.8C7.9 18.4 5 15.2 5 11V6l7-3z" /><path d="M9 11.5l2 2 4-4" /></>,
  bulb: <><path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.5.4.8.9.9 1.5l.2 1h5l.2-1c.1-.6.4-1.1.9-1.5A6 6 0 0 0 12 3z" /></>,
  summit: <><path d="M3 20l6.5-13 4 7.5 2.2-3.5L21 20z" /><path d="M3 20h18" /></>,
  link: <><circle cx="9" cy="12" r="5" /><circle cx="15" cy="12" r="5" /></>,
  flag: <><path d="M6 21V4" /><path d="M6 4h11l-2.2 4L17 12H6" /></>,
};
const Icon = ({ name }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[name]}</svg>
);

// hub + the five surrounding nodes (viewBox 1000×720). Order = activation order.
const HUB = { x: 500, y: 362 };
const POS = [
  { x: 500, y: 150, anchor: "up" },    // 1 Integrity   — top (lowered for card headroom)
  { x: 244, y: 300, anchor: "left" },  // 2 Realism     — upper-left
  { x: 348, y: 566, anchor: "left" },  // 3 Grit        — lower-left
  { x: 756, y: 300, anchor: "right" }, // 4 Partnership — upper-right
  { x: 652, y: 566, anchor: "right" }, // 5 Ownership   — lower-right
];
const NODES = values.map((v, i) => ({ ...v, ...POS[i] }));

// a gently bowed branch from the hub out to a node
function branch(n) {
  const mx = (HUB.x + n.x) / 2, my = (HUB.y + n.y) / 2;
  const dx = n.x - HUB.x, dy = n.y - HUB.y, len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const bow = 22 * (n.x >= HUB.x ? 1 : -1);
  return `M ${HUB.x} ${HUB.y} Q ${(mx + nx * bow).toFixed(1)} ${(my + ny * bow).toFixed(1)} ${n.x} ${n.y}`;
}

/**
 * Core Values — one full-screen intelligent network. The Powerline "P" is the
 * central hub; five branches reach out to the five values (pure star topology —
 * every node wires straight back to the P, never to each other). On a pinned
 * screen, scroll PROGRESS energises it: the P lights and its inner current
 * flows, then one branch at a time grows out of the P, reaches a value, lights
 * its node, reveals the value, and a return shimmer runs back to the hub —
 * until all five are live. Pure transform/opacity + SVG stroke draw; reduced
 * motion shows the whole network lit.
 */
export default function CoreValues() {
  const root = useRef(null);
  const diagram = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const d = diagram.current;
    const pGroup = d.querySelector(".cv-p");
    const pStroke = d.querySelector(".cv-p-stroke");
    const branches = [...d.querySelectorAll(".cv-branch")];
    const returns = [...d.querySelectorAll(".cv-return")];
    const snodes = [...d.querySelectorAll(".cv-snode")];
    const cards = [...d.querySelectorAll(".cv-vcard")];

    if (reduce) {
      pGroup.classList.add("on");
      if (pStroke) pStroke.style.strokeDashoffset = "0";
      branches.forEach((b) => (b.style.strokeDashoffset = "0"));
      snodes.forEach((s) => s.classList.add("on"));
      cards.forEach((c) => c.classList.add("show"));
      return;
    }

    // One continuous cinematic timeline — built paused, then played ONCE the
    // moment the section scrolls into view. Scroll only TRIGGERS it; it is not
    // scrubbed. It ends on the full illuminated network and stays there.
    const tl = gsap.timeline({ paused: true });

    // 1 — the central P energises (its inner current loop starts via CSS)
    tl.call(() => pGroup.classList.add("on"), null, 0);
    tl.fromTo(pStroke, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.75, ease: "power2.out" }, 0);

    // 2 — branches grow out one after another; each lights its node, reveals
    //     the value, then a shimmer returns to the hub
    let t = 0.85;
    branches.forEach((b, i) => {
      tl.fromTo(b, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut" }, t);
      tl.call(() => { snodes[i].classList.add("on"); cards[i].classList.add("show"); }, null, t + 0.42);
      tl.fromTo(returns[i], { opacity: 0.95, strokeDashoffset: -0.86 }, { strokeDashoffset: 0, opacity: 0, duration: 0.45, ease: "power1.in" }, t + 0.5);
      t += 0.62;
    });

    // play once when the section enters the viewport — IntersectionObserver is
    // independent of the smooth-scroll wiring, so it fires reliably
    let played = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !played) {
          played = true;
          tl.play(0);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(root.current);

    return () => {
      io.disconnect();
      tl.kill();
    };
  }, []);

  return (
    <section className="cv" ref={root} aria-label="Our values">
      <div className="cv-sticky">
        <div className="container cv-head">
          <span className="eyebrow">Our Values</span>
          <h2 className="cv-title">
            Powered by the <span>P.</span>
          </h2>
          <p className="cv-lead">Five values, energised by one source.</p>
        </div>

        <div className="cv-diagram" ref={diagram}>
          <svg className="cv-svg" viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              <radialGradient id="cvPlate" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#000" stopOpacity="0.92" />
                <stop offset="60%" stopColor="#000" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#000" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* branches (drawn behind the P so they emerge from it) */}
            {NODES.map((n, i) => (
              <path key={`b${i}`} className="cv-branch" d={branch(n)} pathLength="1" />
            ))}
            {/* return shimmer along each branch */}
            {NODES.map((n, i) => (
              <path key={`r${i}`} className="cv-return" d={branch(n)} pathLength="1" />
            ))}
            {/* value nodes */}
            {NODES.map((n, i) => (
              <g key={`n${i}`} className="cv-snode" transform={`translate(${n.x} ${n.y})`}>
                <circle className="cv-snode-ring" r="13" />
                <circle className="cv-snode-core" r="6" />
              </g>
            ))}

            {/* dark plate + the central P hub on top */}
            <ellipse className="cv-plate" cx={HUB.x} cy={HUB.y} rx="150" ry="150" fill="url(#cvPlate)" />
            <g className="cv-p" transform="translate(404 264) scale(1.02)">
              <path className="cv-p-glow" d={P_PATH} pathLength="1" />
              <path className="cv-p-fill" d={P_PATH} fillRule="evenodd" />
              <path className="cv-p-stroke" d={P_PATH} pathLength="1" />
              <path className="cv-p-pulse" d={P_PATH} pathLength="1" />
            </g>
          </svg>

          {/* value content overlaid at each node */}
          {NODES.map((n, i) => (
            <div
              key={`c${i}`}
              className={`cv-vcard ${n.anchor}`}
              style={{ left: `${(n.x / 1000) * 100}%`, top: `${(n.y / 720) * 100}%` }}
            >
              <span className="cv-vc-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="cv-vc-icon"><Icon name={n.icon} /></span>
              <h3>{n.title}</h3>
              <p>{n.line}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .cv { position: relative; }
        /* a normal full-screen scene: it plays once on enter, then stays.
           No tall scroll track, no pin — the user just scrolls past it. */
        .cv-sticky {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(2rem, 6vh, 4.5rem);
          overflow: hidden;
          padding: clamp(2rem, 6vh, 4rem) 0;
        }
        .cv-head {
          flex: 0 0 auto;
          text-align: center;
        }
        .cv-head :global(.eyebrow) { justify-content: center; }
        .cv-title {
          font-family: var(--font-head);
          font-weight: 800;
          text-transform: uppercase;
          font-size: clamp(1.7rem, 4vw, 3rem);
          line-height: 1;
          margin-top: 0.6rem;
        }
        .cv-title span { color: var(--orange); }
        .cv-lead {
          color: var(--text-dim);
          font-size: clamp(0.95rem, 1.4vw, 1.08rem);
          margin-top: 0.6rem;
        }

        /* the network canvas — fixed aspect so SVG nodes & HTML cards align.
           A generous top margin + larger height reservation keep the top
           value card well clear of the header above it. */
        .cv-diagram {
          position: relative;
          flex: 0 1 auto;
          width: min(90vw, calc((100dvh - 380px) * (1000 / 720)));
          aspect-ratio: 1000 / 720;
          margin: clamp(2.5rem, 7vh, 5rem) auto 0;
        }
        .cv-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        /* branches */
        :global(.cv-branch) {
          fill: none;
          stroke: var(--orange);
          stroke-width: 3;
          stroke-linecap: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          filter: drop-shadow(0 0 4px rgba(232, 114, 42, 0.7));
        }
        :global(.cv-return) {
          fill: none;
          stroke: #fff2e6;
          stroke-width: 3.2;
          stroke-linecap: round;
          stroke-dasharray: 0.14 1;
          stroke-dashoffset: 0;
          opacity: 0;
          filter: drop-shadow(0 0 5px rgba(255, 200, 150, 0.9));
        }

        /* value nodes */
        :global(.cv-snode-ring) {
          fill: var(--bg);
          stroke: rgba(232, 114, 42, 0.4);
          stroke-width: 2;
          transition: stroke 0.4s ease;
        }
        :global(.cv-snode-core) {
          fill: var(--orange);
          transform: scale(0);
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 0.45s cubic-bezier(0.34, 1.4, 0.5, 1);
        }
        :global(.cv-snode.on .cv-snode-ring) {
          stroke: var(--orange);
          filter: drop-shadow(0 0 9px rgba(232, 114, 42, 0.8));
        }
        :global(.cv-snode.on .cv-snode-core) { transform: scale(1); }

        /* central P hub */
        :global(.cv-plate) {
          opacity: 1;
        }
        :global(.cv-p-glow) {
          fill: none;
          stroke: rgba(232, 114, 42, 0.5);
          stroke-width: 7;
          filter: blur(5px);
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        :global(.cv-p-fill) { fill: rgba(232, 114, 42, 0.1); opacity: 0; transition: opacity 0.6s ease; }
        :global(.cv-p-stroke) {
          fill: none;
          stroke: var(--orange);
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          filter: drop-shadow(0 0 5px rgba(232, 114, 42, 0.85));
        }
        :global(.cv-p-pulse) {
          fill: none;
          stroke: #fff2e6;
          stroke-width: 3.4;
          stroke-linecap: round;
          stroke-dasharray: 0.08 0.92;
          stroke-dashoffset: 1;
          opacity: 0;
        }
        :global(.cv-p.on .cv-p-glow) { opacity: 1; }
        :global(.cv-p.on .cv-p-fill) { opacity: 1; }
        :global(.cv-p.on .cv-p-pulse) {
          opacity: 1;
          animation: cvFlow 1.9s linear infinite;
        }
        @keyframes cvFlow { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }

        /* value cards overlaid at node positions */
        .cv-vcard {
          position: absolute;
          width: max-content;
          max-width: 230px;
          opacity: 0;
          transition: opacity 0.55s var(--ease);
          pointer-events: none;
        }
        .cv-vcard.show { opacity: 1; }
        .cv-vcard.up { transform: translate(-50%, calc(-100% - 16px)); text-align: center; }
        .cv-vcard.left { transform: translate(calc(-100% - 24px), -50%); text-align: right; }
        .cv-vcard.right { transform: translate(24px, -50%); text-align: left; }
        .cv-vc-num {
          display: block;
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 0.66rem;
          letter-spacing: 0.22em;
          color: var(--orange);
        }
        .cv-vc-icon {
          display: inline-grid;
          place-items: center;
          width: 46px;
          height: 46px;
          border-radius: 12px;
          margin: 0.35rem 0 0.1rem;
          color: var(--orange);
          background: rgba(232, 114, 42, 0.08);
          border: 1px solid rgba(232, 114, 42, 0.22);
          transform: translateY(8px);
          opacity: 0;
          transition: opacity 0.45s var(--ease) 0.05s, transform 0.45s var(--ease) 0.05s;
        }
        .cv-vcard.left .cv-vc-icon { margin-left: auto; }
        .cv-vcard h3 {
          font-family: var(--font-head);
          font-weight: 800;
          text-transform: uppercase;
          font-size: clamp(1.2rem, 1.9vw, 1.7rem);
          color: #fff;
          margin: 0.3rem 0 0.25rem;
          line-height: 1;
          transform: translateY(8px);
          opacity: 0;
          transition: opacity 0.45s var(--ease) 0.12s, transform 0.45s var(--ease) 0.12s;
        }
        .cv-vcard p {
          color: var(--text-dim);
          font-size: clamp(0.86rem, 1.1vw, 0.98rem);
          line-height: 1.4;
          transform: translateY(8px);
          opacity: 0;
          transition: opacity 0.45s var(--ease) 0.18s, transform 0.45s var(--ease) 0.18s;
        }
        .cv-vcard.show .cv-vc-icon,
        .cv-vcard.show h3,
        .cv-vcard.show p { opacity: 1; transform: none; }

        @media (max-width: 820px) {
          .cv-diagram { width: min(96vw, calc((100dvh - 260px) * (1000 / 720))); }
          .cv-vcard { max-width: 40vw; }
          .cv-vcard.up { transform: translate(-50%, calc(-100% - 14px)); }
          .cv-vcard.left { transform: translate(calc(-100% - 14px), -50%); }
          .cv-vcard.right { transform: translate(14px, -50%); }
          .cv-vc-icon { width: 38px; height: 38px; }
          .cv-vcard h3 { font-size: clamp(1rem, 3.4vw, 1.3rem); }
          .cv-vcard p { font-size: clamp(0.72rem, 2.6vw, 0.86rem); }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.cv-p.on .cv-p-pulse) { animation: none; opacity: 0; }
          .cv-vcard,
          .cv-vc-icon,
          .cv-vcard h3,
          .cv-vcard p { transition: none; }
        }
      `}</style>
    </section>
  );
}
