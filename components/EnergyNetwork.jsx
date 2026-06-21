"use client";

/**
 * Opening scene — a real power-distribution network powered by the logo.
 * The Powerline "P" sits at the BOTTOM CENTRE and is the source: energy
 * charges inside its internal pathways (the strokes light up and a pulse
 * loops through them), then branches emerge from the top of the P and route
 * outward to glowing destination nodes, with pulses continuously flowing from
 * the logo out along every branch. Glow lives on the network + logo strokes.
 */

// The brand P mark (same vector as the favicon), drawn at bottom centre.
const P_PATH =
  "M 45.955 44.083 C 44.205 47.355, 45.082 70.813, 47 72.023 C 47.839 72.553, 59.637 72.976, 73.782 72.985 C 100.907 73.001, 104.131 73.494, 107.369 78.117 C 109.205 80.737, 109.527 87.146, 107.970 90.055 C 106.135 93.484, 101.609 95, 93.205 95 C 82.182 95, 82 95.263, 82 111.174 C 82 127.156, 81.872 127.007, 95.579 126.983 C 123.215 126.934, 141.900 115.285, 146.640 95.147 C 151.347 75.148, 142.535 55.952, 124.593 47.121 C 115.027 42.412, 111.742 42.051, 78.285 42.024 C 47.665 42, 47.049 42.040, 45.955 44.083 M 54.202 57.250 L 54.500 63.500 79 64 C 106.298 64.557, 108.105 64.939, 113.724 71.338 C 119.421 77.827, 120.180 85.807, 115.897 94.202 C 112.907 100.062, 107.221 103.276, 98.660 103.942 L 91.500 104.500 91.500 111 L 91.500 117.500 95.846 117.812 C 98.236 117.984, 103.398 117.627, 107.318 117.019 C 127.223 113.930, 138.470 102.190, 138.470 84.500 C 138.470 74.861, 136.060 68.723, 129.702 62.167 C 120.156 52.325, 114.454 51.027, 80.702 51.012 L 53.905 51 54.202 57.250 M 46.035 78.934 C 44.626 81.568, 44.626 146.432, 46.035 149.066 C 46.980 150.830, 48.246 151, 60.464 151 C 71.306 151, 74.156 150.701, 75.429 149.429 C 76.786 148.071, 77 143.848, 77 118.429 L 77 89 88.800 89 C 101.191 89, 103 88.427, 103 84.500 C 103 80.421, 101.350 80, 85.371 80 C 72.861 80, 69.862 80.280, 68.571 81.571 C 67.214 82.929, 67 87.156, 67 112.619 L 67 142.095 60.750 141.798 L 54.500 141.500 54.235 110.585 C 54.057 89.810, 53.607 79.232, 52.863 78.335 C 51.226 76.362, 47.224 76.713, 46.035 78.934";

// place the 192-unit P so its top sits at the source, centred at x=600.
const P_TF = "translate(468 561) scale(1.35)";

// Conductors, routed to match the reference map: two lower legs splay out to
// Alexandria / New Cairo, two curves bow up to North Coast / 6th of October,
// and a top path links them through New Capital. All emerge from the P top.
const EDGES = [
  { d: "M600 620 C 500 602 370 585 300 560 C 220 530 165 455 130 382", delay: 1.0 },
  { d: "M600 620 C 700 602 830 585 900 560 C 980 530 1035 455 1070 382", delay: 1.05 },
  { d: "M600 620 C 470 560 340 470 340 332 C 338 280 318 218 300 178", delay: 1.2 },
  { d: "M600 620 C 730 560 860 470 860 332 C 862 280 882 218 900 178", delay: 1.25 },
  { d: "M300 178 C 410 124 500 124 600 122", delay: 1.9 }, // North Coast → arch peak
  { d: "M600 122 C 700 124 790 124 900 178", delay: 1.95 }, // arch peak → 6th of October
  { d: "M600 235 L600 126", delay: 2.1 }, // New Capital stem up to the arch
];

// Glowing nodes — destinations + the junction stars from the reference.
const NODES = [
  { x: 600, y: 235 }, // New Capital
  { x: 300, y: 178 }, // North Coast
  { x: 900, y: 178 }, // 6th of October
  { x: 130, y: 382 }, // Alexandria
  { x: 1070, y: 382 }, // New Cairo
  { x: 340, y: 332 }, // mid-left junction
  { x: 860, y: 332 }, // mid-right junction
  { x: 300, y: 560 }, // lower-left junction
  { x: 900, y: 560 }, // lower-right junction
];

export default function EnergyNetwork() {
  return (
    <div className="en" aria-hidden="true">
      <svg viewBox="0 0 1200 870" preserveAspectRatio="xMidYMid meet" className="en-svg">
        {/* conductors emerge from the logo and route across the network */}
        {EDGES.map((e, i) => (
          <g key={`e${i}`} style={{ "--d": `${e.delay}s` }}>
            <path className="en-path" d={e.d} pathLength="1" />
            <path className="en-flow" d={e.d} pathLength="1" />
          </g>
        ))}
        {/* glowing nodes */}
        {NODES.map((n, i) => (
          <g key={`n${i}`} style={{ "--d": `${1.4 + i * 0.05}s` }}>
            <circle className="en-ring" cx={n.x} cy={n.y} r="11" pathLength="1" />
            <circle className="en-node" cx={n.x} cy={n.y} r="5.5" />
          </g>
        ))}

        {/* the logo = the power source */}
        <g transform={P_TF}>
          <path className="en-p-glow" d={P_PATH} pathLength="1" />
          <path className="en-p-fill" d={P_PATH} fillRule="evenodd" />
          <path className="en-p-stroke" d={P_PATH} pathLength="1" />
          <path className="en-p-pulse" d={P_PATH} pathLength="1" />
        </g>

        {/* wordmark under the logo */}
        <text className="en-word" x="600" y="828" textAnchor="middle">
          POWER<tspan className="en-word-accent">LINE</tspan>
        </text>
      </svg>

      <style jsx>{`
        .en { position: absolute; inset: 0; overflow: hidden; }
        .en-svg { width: 100%; height: 100%; display: block; }

        /* ── the logo (energy generated inside) ── */
        .en-p-fill {
          fill: rgba(241, 103, 34, 0.10);
          opacity: 0;
          animation: enReveal 0.8s ease forwards 0.7s;
        }
        .en-p-glow {
          fill: none;
          stroke: rgba(241, 103, 34, 0.5);
          stroke-width: 7;
          filter: blur(5px);
          opacity: 0;
          animation: enReveal 0.8s ease forwards 0.8s;
        }
        .en-p-stroke {
          fill: none;
          stroke: #f16722;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          filter: drop-shadow(0 0 4px rgba(241, 103, 34, 0.8));
          animation: enDraw 1.1s ease forwards 0.1s;
        }
        /* bright pulse looping through the P's internal pathways */
        .en-p-pulse {
          fill: none;
          stroke: #ffe2cd;
          stroke-width: 3.4;
          stroke-linecap: round;
          stroke-dasharray: 0.08 0.92;
          stroke-dashoffset: 1;
          opacity: 0;
          filter: drop-shadow(0 0 5px rgba(255, 200, 140, 0.95));
          animation: enReveal 0.3s ease forwards 0.9s,
            enPulse 1.6s linear infinite 0.9s;
        }
        @keyframes enPulse {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }

        /* ── branches ── */
        .en-path {
          fill: none;
          stroke: rgba(241, 103, 34, 0.28);
          stroke-width: 2;
          stroke-linecap: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          filter: drop-shadow(0 0 3px rgba(241, 103, 34, 0.5));
          animation: enDraw 1.3s ease forwards;
          animation-delay: var(--d);
        }
        @keyframes enDraw { to { stroke-dashoffset: 0; } }

        /* energy travelling from the logo out to each node */
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
        @keyframes enReveal { to { opacity: 1; } }
        @keyframes enFlow {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }

        /* ── nodes (no labels) ── */
        .en-node {
          fill: #f16722;
          filter: drop-shadow(0 0 6px rgba(241, 103, 34, 0.95));
          opacity: 0;
          animation: enPop 0.5s ease forwards;
          animation-delay: calc(var(--d) + 1s);
        }
        .en-ring {
          fill: none;
          stroke: rgba(241, 103, 34, 0.7);
          stroke-width: 1.4;
          transform-box: fill-box;
          transform-origin: center;
          opacity: 0;
          animation: enPing 2.6s ease-out infinite;
          animation-delay: calc(var(--d) + 1.05s);
        }
        @keyframes enPop {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes enPing {
          0% { opacity: 0.8; transform: scale(0.4); }
          100% { opacity: 0; transform: scale(2.4); }
        }

        /* wordmark */
        .en-word {
          fill: #fff;
          font-family: var(--font-head), sans-serif;
          font-weight: 800;
          font-size: 30px;
          letter-spacing: 7px;
          opacity: 0;
          animation: enReveal 0.7s ease forwards 1.3s;
        }
        .en-word-accent {
          fill: #f16722;
        }

        @media (prefers-reduced-motion: reduce) {
          .en-path, .en-flow, .en-node, .en-ring,
          .en-p-fill, .en-p-glow, .en-p-stroke, .en-p-pulse,
          .en-word { animation: none; opacity: 1; }
          .en-p-stroke { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
