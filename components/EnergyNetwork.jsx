"use client";

/**
 * Opening-sequence network, modelled on a real power-distribution map.
 * The Powerline "P" (rendered above this by the Preloader) sits at the
 * BOTTOM CENTRE and is the energy source; glowing orange branches route
 * upward and outward to strategic nodes, and pulses travel continuously
 * from the source to each node. Glow lives on the network only.
 */

const HUB = { x: 600, y: 720 };

const NODES = [
  { x: 200, y: 470, label: "Alexandria", sub: "Coastal Hub" },
  { x: 400, y: 248, label: "North Coast", sub: "Resorts" },
  { x: 600, y: 165, label: "New Capital", sub: "Smart City" },
  { x: 800, y: 248, label: "6th of October", sub: "Industry" },
  { x: 1000, y: 470, label: "New Cairo", sub: "Developments" },
];

// Smooth, elegant routing: rise from the source, then bend toward the node.
function pathFor({ x, y }) {
  const cp1x = HUB.x + (x - HUB.x) * 0.18;
  const cp1y = HUB.y - 160;
  const cp2x = x;
  const cp2y = y + 130;
  return `M ${HUB.x} ${HUB.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
}

export default function EnergyNetwork() {
  return (
    <div className="en" aria-hidden="true">
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="en-svg">
        {NODES.map((n, i) => {
          const d = pathFor(n);
          const delay = `${0.2 + i * 0.18}s`;
          const pillW = Math.max(n.label.length, n.sub.length) * 9 + 28;
          return (
            <g key={n.label} style={{ "--d": delay }}>
              <path className="en-path" d={d} pathLength="1" />
              <path className="en-flow" d={d} pathLength="1" />
              {/* node */}
              <circle className="en-ring" cx={n.x} cy={n.y} r="11" pathLength="1" />
              <circle className="en-node" cx={n.x} cy={n.y} r="5.5" />
              {/* label pill above the node */}
              <g className="en-lab">
                <line x1={n.x} y1={n.y - 12} x2={n.x} y2={n.y - 30} className="en-stem" />
                <rect
                  x={n.x - pillW / 2}
                  y={n.y - 76}
                  width={pillW}
                  height="46"
                  rx="10"
                  className="en-pill"
                />
                <text x={n.x} y={n.y - 52} textAnchor="middle" className="en-title">
                  {n.label}
                </text>
                <text x={n.x} y={n.y - 38} textAnchor="middle" className="en-sub">
                  {n.sub}
                </text>
              </g>
            </g>
          );
        })}
        {/* the source seat under the logo */}
        <circle className="en-hub-ring" cx={HUB.x} cy={HUB.y} r="46" />
        <circle className="en-hub" cx={HUB.x} cy={HUB.y} r="8" />
      </svg>

      <style jsx>{`
        .en {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .en-svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        /* conductors */
        .en-path {
          fill: none;
          stroke: rgba(241, 103, 34, 0.28);
          stroke-width: 2;
          stroke-linecap: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          filter: drop-shadow(0 0 3px rgba(241, 103, 34, 0.5));
          animation: enDraw 1.4s ease forwards;
          animation-delay: var(--d);
        }
        @keyframes enDraw {
          to { stroke-dashoffset: 0; }
        }
        /* energy pulses travelling from the source out to the node */
        .en-flow {
          fill: none;
          stroke: #ffb069;
          stroke-width: 2.6;
          stroke-linecap: round;
          stroke-dasharray: 0.04 0.4;
          stroke-dashoffset: 1;
          opacity: 0;
          filter: drop-shadow(0 0 5px rgba(241, 103, 34, 0.95))
            drop-shadow(0 0 11px rgba(241, 103, 34, 0.6));
          animation: enReveal 0.4s ease forwards, enFlow 2.4s linear infinite;
          animation-delay: var(--d), calc(var(--d) + 0.7s);
        }
        @keyframes enReveal {
          to { opacity: 1; }
        }
        @keyframes enFlow {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }
        /* nodes */
        .en-node {
          fill: #f16722;
          filter: drop-shadow(0 0 6px rgba(241, 103, 34, 0.95));
          opacity: 0;
          animation: enPop 0.5s ease forwards;
          animation-delay: calc(var(--d) + 1.05s);
        }
        .en-ring {
          fill: none;
          stroke: rgba(241, 103, 34, 0.7);
          stroke-width: 1.4;
          transform-box: fill-box;
          transform-origin: center;
          opacity: 0;
          animation: enPing 2.6s ease-out infinite;
          animation-delay: calc(var(--d) + 1.1s);
        }
        @keyframes enPop {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes enPing {
          0% { opacity: 0.8; transform: scale(0.4); }
          100% { opacity: 0; transform: scale(2.4); }
        }
        /* source seat */
        .en-hub {
          fill: #f16722;
          filter: drop-shadow(0 0 10px rgba(241, 103, 34, 0.95));
          opacity: 0;
          animation: enReveal 0.6s ease forwards 0.1s;
        }
        .en-hub-ring {
          fill: none;
          stroke: rgba(241, 103, 34, 0.4);
          stroke-width: 1.4;
          transform-box: fill-box;
          transform-origin: center;
          animation: enPing 3s ease-out infinite 0.3s;
        }
        /* labels */
        .en-lab {
          opacity: 0;
          animation: enReveal 0.6s ease forwards;
          animation-delay: calc(var(--d) + 1.25s);
        }
        .en-stem {
          stroke: rgba(241, 103, 34, 0.6);
          stroke-width: 1.4;
        }
        .en-pill {
          fill: rgba(8, 8, 10, 0.82);
          stroke: rgba(241, 103, 34, 0.45);
          stroke-width: 1;
        }
        .en-title {
          fill: #fff;
          font-family: var(--font-head), sans-serif;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.02em;
        }
        .en-sub {
          fill: rgba(241, 103, 34, 0.95);
          font-family: var(--font-body), sans-serif;
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        @media (prefers-reduced-motion: reduce) {
          .en-path, .en-flow, .en-node, .en-ring, .en-hub, .en-hub-ring,
          .en-lab { animation: none; }
        }
      `}</style>
    </div>
  );
}
