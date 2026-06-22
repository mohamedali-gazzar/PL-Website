"use client";

import { memo } from "react";

/**
 * Opening scene — a living POWER GRID, powered by the logo.
 * The Powerline "P" sits at the centre as the source. A dense grid of nodes
 * surrounds it; energy radiates outward in a wave — each node powers the next
 * through the connecting lines, so the whole grid lights up from the logo. The
 * lit grid then dollies toward the viewer and hands off to the site.
 */

const P_PATH =
  "M 45.955 44.083 C 44.205 47.355, 45.082 70.813, 47 72.023 C 47.839 72.553, 59.637 72.976, 73.782 72.985 C 100.907 73.001, 104.131 73.494, 107.369 78.117 C 109.205 80.737, 109.527 87.146, 107.970 90.055 C 106.135 93.484, 101.609 95, 93.205 95 C 82.182 95, 82 95.263, 82 111.174 C 82 127.156, 81.872 127.007, 95.579 126.983 C 123.215 126.934, 141.900 115.285, 146.640 95.147 C 151.347 75.148, 142.535 55.952, 124.593 47.121 C 115.027 42.412, 111.742 42.051, 78.285 42.024 C 47.665 42, 47.049 42.040, 45.955 44.083 M 54.202 57.250 L 54.500 63.500 79 64 C 106.298 64.557, 108.105 64.939, 113.724 71.338 C 119.421 77.827, 120.180 85.807, 115.897 94.202 C 112.907 100.062, 107.221 103.276, 98.660 103.942 L 91.500 104.500 91.500 111 L 91.500 117.500 95.846 117.812 C 98.236 117.984, 103.398 117.627, 107.318 117.019 C 127.223 113.930, 138.470 102.190, 138.470 84.500 C 138.470 74.861, 136.060 68.723, 129.702 62.167 C 120.156 52.325, 114.454 51.027, 80.702 51.012 L 53.905 51 54.202 57.250 M 46.035 78.934 C 44.626 81.568, 44.626 146.432, 46.035 149.066 C 46.980 150.830, 48.246 151, 60.464 151 C 71.306 151, 74.156 150.701, 75.429 149.429 C 76.786 148.071, 77 143.848, 77 118.429 L 77 89 88.800 89 C 101.191 89, 103 88.427, 103 84.500 C 103 80.421, 101.350 80, 85.371 80 C 72.861 80, 69.862 80.280, 68.571 81.571 C 67.214 82.929, 67 87.156, 67 112.619 L 67 142.095 60.750 141.798 L 54.500 141.500 54.235 110.585 C 54.057 89.810, 53.607 79.232, 52.863 78.335 C 51.226 76.362, 47.224 76.713, 46.035 78.934";

// ── Build the grid once (deterministic — no random) ────────────────────────
const W = 1440, H = 900, CX = 720, CY = 430; // P = source
const P_TF = "translate(510 213) scale(2.15)";
const COLS = 11, ROWS = 7, MX = 100, MY = 95;
const SX = (W - 2 * MX) / (COLS - 1);
const SY = (H - 2 * MY) / (ROWS - 1);

// hide nodes that would sit under the logo / wordmark
const underLogo = (x, y) =>
  (Math.abs(x - CX) < 180 && y > 300 && y < 560) ||
  (Math.abs(x - CX) < 268 && y >= 560 && y < 672);

const grid = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const x = MX + c * SX;
    const y = MY + r * SY;
    grid.push({ c, r, x, y, dist: Math.hypot(x - CX, y - CY), on: !underLogo(x, y) });
  }
}
const at = (c, r) => grid.find((g) => g.c === c && g.r === r);
const DOTS = grid.filter((g) => g.on);
const MAXD = Math.max(...DOTS.map((d) => d.dist));
const tDot = (dist) => +(0.5 + (dist / MAXD) * 1.8).toFixed(3); // wave timing

DOTS.forEach((d) => (d.delay = tDot(d.dist)));

// links between adjacent live nodes (the energy hops node → node)
const LINKS = [];
for (const g of DOTS) {
  for (const [dc, dr] of [[1, 0], [0, 1]]) {
    const nb = at(g.c + dc, g.r + dr);
    if (nb && nb.on) {
      const near = g.dist <= nb.dist ? g : nb;
      const far = near === g ? nb : g;
      LINKS.push({
        d: `M ${near.x.toFixed(1)} ${near.y.toFixed(1)} L ${far.x.toFixed(1)} ${far.y.toFixed(1)}`,
        delay: +(tDot(near.dist) + 0.04).toFixed(3),
      });
    }
  }
}
// feeders: energy leaving the P into the innermost ring
const FEEDERS = [...DOTS]
  .sort((a, b) => a.dist - b.dist)
  .slice(0, 8)
  .map((d) => ({ d: `M ${CX} ${CY} L ${d.x.toFixed(1)} ${d.y.toFixed(1)}`, delay: 0.45 }));

function EnergyNetwork() {
  return (
    <div className="en" aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="en-svg">
        <g className="en-net">
          {/* feeders + grid links draw on as the wave passes */}
          {FEEDERS.map((f, i) => (
            <path key={`f${i}`} className="en-link" d={f.d} pathLength="1" style={{ "--d": `${f.delay}s` }} />
          ))}
          {LINKS.map((l, i) => (
            <path key={`l${i}`} className="en-link" d={l.d} pathLength="1" style={{ "--d": `${l.delay}s` }} />
          ))}
          {/* nodes: dim grid, then each powers ON as energy reaches it */}
          {DOTS.map((d, i) => (
            <g key={`d${i}`} style={{ "--d": `${d.delay}s` }}>
              <circle className="en-dot-off" cx={d.x} cy={d.y} r="5.5" />
              <circle className="en-dot" cx={d.x} cy={d.y} r="5.5" />
            </g>
          ))}
        </g>

        {/* THE P — the source at the centre of the grid */}
        <g className="en-p">
          <g transform={P_TF}>
            <path className="en-p-glow" d={P_PATH} pathLength="1" />
            <path className="en-p-fill" d={P_PATH} fillRule="evenodd" />
            <path className="en-p-stroke" d={P_PATH} pathLength="1" />
            <path className="en-p-pulse" d={P_PATH} pathLength="1" />
          </g>
        </g>

        <g className="en-word-wrap">
          <text className="en-word" x="720" y="618" textAnchor="middle">
            POWER<tspan className="en-word-accent">LINE</tspan>
          </text>
        </g>
      </svg>

      <style jsx>{`
        .en {
          --pl: 241, 103, 34;
          --hot: 255, 226, 188;
          --energy: cubic-bezier(0.4, 0, 0.2, 1);
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .en-svg { width: 100%; height: 100%; display: block; }

        /* ── the P settles in at its size, charges, never restarts ── */
        .en-p {
          transform-box: fill-box;
          transform-origin: center;
          animation: enGrow 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }
        @keyframes enGrow {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .en-p-fill { fill: rgba(var(--pl), 0.1); }
        .en-p-glow {
          fill: none; stroke: rgba(var(--pl), 0.5); stroke-width: 7; filter: blur(5px);
        }
        .en-p-stroke {
          fill: none; stroke: #f16722; stroke-width: 3;
          stroke-linecap: round; stroke-linejoin: round;
          filter: drop-shadow(0 0 4px rgba(var(--pl), 0.8));
        }
        .en-p-pulse {
          fill: none; stroke: #ffe2cd; stroke-width: 3.4; stroke-linecap: round;
          stroke-dasharray: 0.08 0.92; stroke-dashoffset: 1; opacity: 0;
          filter: drop-shadow(0 0 5px rgba(255, 200, 140, 0.95));
          animation: enReveal 0.3s ease forwards 0.5s, enPulse 1.6s linear infinite 0.5s;
        }
        @keyframes enPulse { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }

        /* ── grid links: energy hopping node → node ── */
        .en-link {
          fill: none;
          stroke: #ff9a52;
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          filter: drop-shadow(0 0 4px rgba(var(--pl), 0.85));
          animation: enDraw 0.4s ease forwards;
          animation-delay: var(--d);
        }
        @keyframes enDraw { to { stroke-dashoffset: 0; } }

        /* ── nodes: a dim grid that powers on in a wave ── */
        .en-dot-off {
          fill: rgba(var(--pl), 0.14);
          stroke: rgba(var(--pl), 0.32);
          stroke-width: 1;
          opacity: 0;
          animation: enReveal 0.4s ease forwards 0.3s;
        }
        .en-dot {
          fill: #f16722;
          transform-box: fill-box;
          transform-origin: center;
          opacity: 0;
          animation: enPowerOn 0.5s var(--energy) both;
          animation-delay: var(--d);
        }
        @keyframes enPowerOn {
          0% { opacity: 0; transform: scale(2); filter: drop-shadow(0 0 0 rgba(var(--hot), 0)); }
          40% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 12px rgba(var(--hot), 1)); }
          100% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 6px rgba(var(--pl), 0.95)); }
        }
        @keyframes enReveal { to { opacity: 1; } }

        /* ── wordmark ── */
        .en-word {
          fill: #fff;
          font-family: var(--font-head), sans-serif;
          font-weight: 800;
          font-size: 44px;
          letter-spacing: 11px;
          opacity: 0;
          animation: enReveal 0.7s ease forwards 1s;
        }
        .en-word-accent { fill: #f16722; }

        @media (prefers-reduced-motion: reduce) {
          .en-p, .en-link, .en-dot, .en-dot-off, .en-p-pulse, .en-word {
            animation: none; opacity: 1;
          }
          .en-link { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

// Render once and never again — no parent re-render can restart the animation.
export default memo(EnergyNetwork);
