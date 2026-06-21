"use client";

/**
 * Opening-sequence backdrop: a real "power distribution network".
 * The Powerline logo (rendered above this in the Preloader) is the hub at the
 * centre; glowing orange paths fan out to meaningful destinations — locations,
 * facilities, product lines and industries — and energy pulses travel outward
 * along each path. Glow lives on the paths only; the logo is never touched.
 */

const HUB = { x: 600, y: 336 };

// Each node is a real destination so every path has a purpose.
const NODES = [
  { x: 232, y: 150, label: "Alexandria", sub: "Coastal Hub", bend: 70 },
  { x: 968, y: 140, label: "New Capital", sub: "Smart Projects", bend: -80 },
  { x: 226, y: 408, label: "Low Voltage", sub: "Up to 6300A", bend: 60 },
  { x: 978, y: 388, label: "Medium Voltage", sub: "Up to 24kV", bend: -60 },
  { x: 330, y: 660, label: "Healthcare", sub: "Hospitals", bend: -70 },
  { x: 880, y: 658, label: "Transformers", sub: "Dry & Oil", bend: 70 },
];

// Quadratic path from the hub to a node, bent for an organic, engineered feel.
function pathFor({ x, y, bend }) {
  const mx = (HUB.x + x) / 2;
  const my = (HUB.y + y) / 2;
  const dx = x - HUB.x;
  const dy = y - HUB.y;
  const len = Math.hypot(dx, dy) || 1;
  // unit perpendicular, scaled by the node's bend
  const cx = mx + (-dy / len) * bend;
  const cy = my + (dx / len) * bend;
  return `M ${HUB.x} ${HUB.y} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x} ${y}`;
}

export default function EnergyNetwork() {
  return (
    <div className="en" aria-hidden="true">
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="en-svg">
        {NODES.map((n, i) => {
          const d = pathFor(n);
          const delay = `${0.2 + i * 0.16}s`;
          const inward = n.x < HUB.x;
          const lx = inward ? n.x + 14 : n.x - 14;
          const anchor = inward ? "start" : "end";
          return (
            <g key={n.label} style={{ "--d": delay }}>
              {/* faint conductor that draws itself on */}
              <path className="en-path" d={d} pathLength="1" />
              {/* bright energy pulse travelling outward */}
              <path className="en-flow" d={d} pathLength="1" />
              {/* destination node */}
              <circle className="en-ring" cx={n.x} cy={n.y} r="9" pathLength="1" />
              <circle className="en-node" cx={n.x} cy={n.y} r="4.5" />
              {/* label */}
              <text className="en-lab" x={lx} y={n.y - 2} textAnchor={anchor}>
                {n.label}
              </text>
              <text className="en-sub" x={lx} y={n.y + 16} textAnchor={anchor}>
                {n.sub}
              </text>
            </g>
          );
        })}
        {/* the hub seat under the logo */}
        <circle className="en-hub-ring" cx={HUB.x} cy={HUB.y} r="30" />
        <circle className="en-hub" cx={HUB.x} cy={HUB.y} r="6" />
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
          stroke: rgba(241, 103, 34, 0.22);
          stroke-width: 1.4;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: enDraw 1.2s ease forwards;
          animation-delay: var(--d);
        }
        @keyframes enDraw {
          to { stroke-dashoffset: 0; }
        }
        /* travelling energy pulses */
        .en-flow {
          fill: none;
          stroke: #ffb069;
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-dasharray: 0.035 0.32;
          stroke-dashoffset: 1;
          opacity: 0;
          filter: drop-shadow(0 0 4px rgba(241, 103, 34, 0.95))
            drop-shadow(0 0 9px rgba(241, 103, 34, 0.6));
          animation: enReveal 0.4s ease forwards, enFlow 2.3s linear infinite;
          animation-delay: var(--d), calc(var(--d) + 0.6s);
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
          filter: drop-shadow(0 0 5px rgba(241, 103, 34, 0.95));
          opacity: 0;
          animation: enPop 0.5s ease forwards;
          animation-delay: calc(var(--d) + 0.9s);
        }
        .en-ring {
          fill: none;
          stroke: rgba(241, 103, 34, 0.7);
          stroke-width: 1.2;
          transform-box: fill-box;
          transform-origin: center;
          opacity: 0;
          animation: enPing 2.6s ease-out infinite;
          animation-delay: calc(var(--d) + 1s);
        }
        @keyframes enPop {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes enPing {
          0% { opacity: 0.8; transform: scale(0.5); }
          100% { opacity: 0; transform: scale(2.6); }
        }
        /* hub seat (sits behind the logo) */
        .en-hub {
          fill: #f16722;
          filter: drop-shadow(0 0 8px rgba(241, 103, 34, 0.9));
          opacity: 0;
          animation: enReveal 0.6s ease forwards 0.1s;
        }
        .en-hub-ring {
          fill: none;
          stroke: rgba(241, 103, 34, 0.35);
          stroke-width: 1.2;
          transform-box: fill-box;
          transform-origin: center;
          animation: enPing 3s ease-out infinite 0.3s;
        }
        /* labels */
        .en-lab {
          fill: #e9e9ea;
          font-family: var(--font-head), sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          opacity: 0;
          animation: enReveal 0.6s ease forwards;
          animation-delay: calc(var(--d) + 1.1s);
        }
        .en-sub {
          fill: rgba(241, 103, 34, 0.85);
          font-family: var(--font-body), sans-serif;
          font-size: 10.5px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          opacity: 0;
          animation: enReveal 0.6s ease forwards;
          animation-delay: calc(var(--d) + 1.25s);
        }
        @media (prefers-reduced-motion: reduce) {
          .en-path, .en-flow, .en-node, .en-ring, .en-hub, .en-hub-ring,
          .en-lab, .en-sub { animation: none; }
        }
        @media (max-width: 600px) {
          .en-lab { font-size: 19px; }
          .en-sub { font-size: 13px; }
        }
      `}</style>
    </div>
  );
}
