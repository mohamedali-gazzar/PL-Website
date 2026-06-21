"use client";

/**
 * Opening scene — ONE continuous narrative, not separate beats.
 * The whole power-network (the Powerline "P" at its heart + the conductors)
 * grows outward from the centre as a single motion. As it grows, the P charges
 * with energy inside its own pathways and that energy flows straight out along
 * the branches to the nodes. The same growth then carries through into the
 * closing zoom that dives into the logo and reveals the site. "POWERLINE" sits
 * under the mark.
 */

const P_PATH =
  "M 45.955 44.083 C 44.205 47.355, 45.082 70.813, 47 72.023 C 47.839 72.553, 59.637 72.976, 73.782 72.985 C 100.907 73.001, 104.131 73.494, 107.369 78.117 C 109.205 80.737, 109.527 87.146, 107.970 90.055 C 106.135 93.484, 101.609 95, 93.205 95 C 82.182 95, 82 95.263, 82 111.174 C 82 127.156, 81.872 127.007, 95.579 126.983 C 123.215 126.934, 141.900 115.285, 146.640 95.147 C 151.347 75.148, 142.535 55.952, 124.593 47.121 C 115.027 42.412, 111.742 42.051, 78.285 42.024 C 47.665 42, 47.049 42.040, 45.955 44.083 M 54.202 57.250 L 54.500 63.500 79 64 C 106.298 64.557, 108.105 64.939, 113.724 71.338 C 119.421 77.827, 120.180 85.807, 115.897 94.202 C 112.907 100.062, 107.221 103.276, 98.660 103.942 L 91.500 104.500 91.500 111 L 91.500 117.500 95.846 117.812 C 98.236 117.984, 103.398 117.627, 107.318 117.019 C 127.223 113.930, 138.470 102.190, 138.470 84.500 C 138.470 74.861, 136.060 68.723, 129.702 62.167 C 120.156 52.325, 114.454 51.027, 80.702 51.012 L 53.905 51 54.202 57.250 M 46.035 78.934 C 44.626 81.568, 44.626 146.432, 46.035 149.066 C 46.980 150.830, 48.246 151, 60.464 151 C 71.306 151, 74.156 150.701, 75.429 149.429 C 76.786 148.071, 77 143.848, 77 118.429 L 77 89 88.800 89 C 101.191 89, 103 88.427, 103 84.500 C 103 80.421, 101.350 80, 85.371 80 C 72.861 80, 69.862 80.280, 68.571 81.571 C 67.214 82.929, 67 87.156, 67 112.619 L 67 142.095 60.750 141.798 L 54.500 141.500 54.235 110.585 C 54.057 89.810, 53.607 79.232, 52.863 78.335 C 51.226 76.362, 47.224 76.713, 46.035 78.934";

// P centred at (720, 430) on a 1440×900 stage.
const P_TF = "translate(510 223) scale(2.15)";

const EDGES = [
  "M 645 330 C 580 280 500 230 430 180", // NW
  "M 720 315 C 730 250 712 200 720 150", // N
  "M 795 330 C 860 280 940 230 1010 180", // NE
  "M 608 425 C 530 418 430 430 350 425", // W
  "M 833 420 C 920 420 1010 414 1090 420", // E
  "M 625 520 C 560 565 460 610 380 650", // WSW
  "M 815 520 C 880 565 980 610 1060 650", // ESE
  "M 655 545 C 600 615 530 695 470 760", // SW
  "M 785 545 C 840 615 910 695 970 760", // SE
];

const NODES = [
  { x: 430, y: 180 }, { x: 720, y: 150 }, { x: 1010, y: 180 },
  { x: 350, y: 425 }, { x: 1090, y: 420 },
  { x: 380, y: 650 }, { x: 1060, y: 650 },
  { x: 470, y: 760 }, { x: 970, y: 760 },
];

export default function EnergyNetwork() {
  return (
    <div className="en" aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="en-svg">
        {/* conductors flow out of the P as it finishes growing */}
        {EDGES.map((d, i) => (
          <g key={`e${i}`} style={{ "--d": `${0.75 + i * 0.06}s` }}>
            <path className="en-path" d={d} pathLength="1" />
            <path className="en-flow" d={d} pathLength="1" />
          </g>
        ))}
        {NODES.map((n, i) => (
          <g key={`n${i}`} style={{ "--d": `${1.25 + i * 0.05}s` }}>
            <circle className="en-ring" cx={n.x} cy={n.y} r="14" pathLength="1" />
            <circle className="en-node" cx={n.x} cy={n.y} r="7" />
          </g>
        ))}
        {/* THE P — grows up at the centre and is the hub of the whole network.
           The same element carries through to the closing zoom. */}
        <g className="en-p">
          <g transform={P_TF}>
            <path className="en-p-glow" d={P_PATH} pathLength="1" />
            <path className="en-p-fill" d={P_PATH} fillRule="evenodd" />
            <path className="en-p-stroke" d={P_PATH} pathLength="1" />
            <path className="en-p-pulse" d={P_PATH} pathLength="1" />
          </g>
        </g>

        {/* wordmark under the logo */}
        <text className="en-word" x="720" y="610" textAnchor="middle">
          POWER<tspan className="en-word-accent">LINE</tspan>
        </text>
      </svg>

      <style jsx>{`
        .en { position: absolute; inset: 0; overflow: hidden; }
        .en-svg { width: 100%; height: 100%; display: block; }

        /* the P settles in at its network size (not ballooning from zero);
           the conductors emerge from it, and the closing zoom is what grows
           the P up — starting from this same network size. */
        .en-p {
          transform-box: fill-box;
          transform-origin: center;
          animation: enGrow 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }
        @keyframes enGrow {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* ── the logo (energy charges inside its pathways) ── */
        .en-p-fill { fill: rgba(241, 103, 34, 0.10); }
        .en-p-glow {
          fill: none;
          stroke: rgba(241, 103, 34, 0.5);
          stroke-width: 7;
          filter: blur(5px);
        }
        .en-p-stroke {
          fill: none;
          stroke: #f16722;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          filter: drop-shadow(0 0 4px rgba(241, 103, 34, 0.8));
        }
        .en-p-pulse {
          fill: none;
          stroke: #ffe2cd;
          stroke-width: 3.4;
          stroke-linecap: round;
          stroke-dasharray: 0.08 0.92;
          stroke-dashoffset: 1;
          opacity: 0;
          filter: drop-shadow(0 0 5px rgba(255, 200, 140, 0.95));
          animation: enReveal 0.3s ease forwards 0.5s,
            enPulse 1.6s linear infinite 0.5s;
        }
        @keyframes enPulse {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }

        /* ── conductors: energy flows straight out of the growing P ── */
        .en-path {
          fill: none;
          stroke: rgba(241, 103, 34, 0.3);
          stroke-width: 2.4;
          stroke-linecap: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          filter: drop-shadow(0 0 3px rgba(241, 103, 34, 0.5));
          animation: enDraw 1s ease forwards;
          animation-delay: var(--d);
        }
        @keyframes enDraw { to { stroke-dashoffset: 0; } }
        .en-flow {
          fill: none;
          stroke: #ffb069;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-dasharray: 0.05 0.45;
          stroke-dashoffset: 1;
          opacity: 0;
          filter: drop-shadow(0 0 5px rgba(241, 103, 34, 0.95))
            drop-shadow(0 0 11px rgba(241, 103, 34, 0.6));
          animation: enReveal 0.4s ease forwards, enFlow 2.3s linear infinite;
          animation-delay: var(--d), calc(var(--d) + 0.5s);
        }
        @keyframes enReveal { to { opacity: 1; } }
        @keyframes enFlow {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }

        /* ── nodes light up as the energy reaches them ── */
        .en-node {
          fill: #f16722;
          filter: drop-shadow(0 0 6px rgba(241, 103, 34, 0.95));
          opacity: 0;
          animation: enPop 0.5s ease forwards;
          animation-delay: var(--d);
        }
        .en-ring {
          fill: none;
          stroke: rgba(241, 103, 34, 0.7);
          stroke-width: 1.5;
          transform-box: fill-box;
          transform-origin: center;
          opacity: 0;
          animation: enPing 2.6s ease-out infinite;
          animation-delay: calc(var(--d) + 0.1s);
        }
        @keyframes enPop {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes enPing {
          0% { opacity: 0.8; transform: scale(0.4); }
          100% { opacity: 0; transform: scale(2.4); }
        }

        /* ── wordmark ── */
        .en-word {
          fill: #fff;
          font-family: var(--font-head), sans-serif;
          font-weight: 800;
          font-size: 44px;
          letter-spacing: 11px;
          opacity: 0;
          animation: enReveal 0.7s ease forwards 1.1s;
        }
        .en-word-accent { fill: #f16722; }

        @media (prefers-reduced-motion: reduce) {
          .en-stage, .en-path, .en-flow, .en-node, .en-ring,
          .en-p-pulse, .en-word { animation: none; opacity: 1; }
          .en-path { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
