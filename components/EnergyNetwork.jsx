"use client";

import { memo } from "react";

/**
 * Opening scene — a living power network powered by the Powerline "P".
 * Scattered nodes (organic, not on a grid) are connected by curved wires that
 * bend like real cables. Energy radiates outward in a wave; each lit node
 * powers the next through its wires. Wires sit BEHIND the logo so the P
 * visually IS the source. A pulse continuously flows along every wire.
 */

const P_PATH =
  "M 45.955 44.083 C 44.205 47.355, 45.082 70.813, 47 72.023 C 47.839 72.553, 59.637 72.976, 73.782 72.985 C 100.907 73.001, 104.131 73.494, 107.369 78.117 C 109.205 80.737, 109.527 87.146, 107.970 90.055 C 106.135 93.484, 101.609 95, 93.205 95 C 82.182 95, 82 95.263, 82 111.174 C 82 127.156, 81.872 127.007, 95.579 126.983 C 123.215 126.934, 141.900 115.285, 146.640 95.147 C 151.347 75.148, 142.535 55.952, 124.593 47.121 C 115.027 42.412, 111.742 42.051, 78.285 42.024 C 47.665 42, 47.049 42.040, 45.955 44.083 M 54.202 57.250 L 54.500 63.500 79 64 C 106.298 64.557, 108.105 64.939, 113.724 71.338 C 119.421 77.827, 120.180 85.807, 115.897 94.202 C 112.907 100.062, 107.221 103.276, 98.660 103.942 L 91.500 104.500 91.500 111 L 91.500 117.500 95.846 117.812 C 98.236 117.984, 103.398 117.627, 107.318 117.019 C 127.223 113.930, 138.470 102.190, 138.470 84.500 C 138.470 74.861, 136.060 68.723, 129.702 62.167 C 120.156 52.325, 114.454 51.027, 80.702 51.012 L 53.905 51 54.202 57.250 M 46.035 78.934 C 44.626 81.568, 44.626 146.432, 46.035 149.066 C 46.980 150.830, 48.246 151, 60.464 151 C 71.306 151, 74.156 150.701, 75.429 149.429 C 76.786 148.071, 77 143.848, 77 118.429 L 77 89 88.800 89 C 101.191 89, 103 88.427, 103 84.500 C 103 80.421, 101.350 80, 85.371 80 C 72.861 80, 69.862 80.280, 68.571 81.571 C 67.214 82.929, 67 87.156, 67 112.619 L 67 142.095 60.750 141.798 L 54.500 141.500 54.235 110.585 C 54.057 89.810, 53.607 79.232, 52.863 78.335 C 51.226 76.362, 47.224 76.713, 46.035 78.934";

// ── Layout (deterministic — same every load) ───────────────────────────────
const W = 1440, H = 900, CX = 720, CY = 430;
// Smaller P (scale 2.15 → 1.5) — cuts the glow/blur rasterisation area
// significantly, which is the heaviest filter on the loading page.
// Natural P centre ≈ (96, 96); to keep it on (CX, CY):
//   translate_x = 720 - 96 * 1.5 = 576
//   translate_y = 430 - 96 * 1.5 = 286
const P_TF = "translate(576 286) scale(1.5)";

// Seeded PRNG so the scatter is the same on every render/build.
function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

// Clear zones: don't drop nodes under the P or the wordmark.
const CLEAR_P = { x: CX, y: CY, rx: 150, ry: 165 };
const CLEAR_WORD = { x: CX, y: 618, rx: 250, ry: 30 };
const inClear = (x, y) =>
  Math.pow((x - CLEAR_P.x) / CLEAR_P.rx, 2) + Math.pow((y - CLEAR_P.y) / CLEAR_P.ry, 2) < 1 ||
  Math.pow((x - CLEAR_WORD.x) / CLEAR_WORD.rx, 2) + Math.pow((y - CLEAR_WORD.y) / CLEAR_WORD.ry, 2) < 1;

// Poisson-ish scatter: random points with a minimum spacing.
function scatter(n, minDist) {
  const r = rng(20260622);
  const pts = [];
  let guard = 0;
  while (pts.length < n && guard < n * 60) {
    guard++;
    const x = 60 + r() * (W - 120);
    const y = 50 + r() * (H - 100);
    if (inClear(x, y)) continue;
    let ok = true;
    for (const p of pts) {
      if (Math.hypot(p.x - x, p.y - y) < minDist) { ok = false; break; }
    }
    if (ok) pts.push({ x, y, d: Math.hypot(x - CX, y - CY) });
  }
  return pts;
}

// Five INNER dots forming a pentagon around the P — they are the first to
// power on (after the P fires), then they distribute energy out to the rest.
const INNER = [
  { x: 720, y: 200, inner: true },
  { x: 940, y: 330, inner: true },
  { x: 870, y: 600, inner: true },
  { x: 570, y: 600, inner: true },
  { x: 500, y: 330, inner: true },
];

// Outer scatter, kept far from the inner ring so the cascade reads clearly.
function scatterAround(n, minDist) {
  const r = rng(20260622);
  const pts = [];
  let guard = 0;
  while (pts.length < n && guard < n * 60) {
    guard++;
    const x = 60 + r() * (W - 120);
    const y = 50 + r() * (H - 100);
    if (inClear(x, y)) continue;
    let ok = true;
    for (const p of [...INNER, ...pts]) {
      if (Math.hypot(p.x - x, p.y - y) < minDist) { ok = false; break; }
    }
    if (ok) pts.push({ x, y });
  }
  return pts;
}

const OUTER = scatterAround(38, 120)
  .map((p) => ({ ...p, x: +p.x.toFixed(1), y: +p.y.toFixed(1) }));

// Cascade timing: P fires → feeders draw → 5 inner dots light → wave outward.
const P_END = 0.45;
const FEEDER_T = 0.55;
const INNER_T = 0.95;
const OUTER_T0 = 1.2;

INNER.forEach((p) => { p.d = 0; p.delay = INNER_T; });
const distToInner = (p) =>
  Math.min(...INNER.map((i) => Math.hypot(p.x - i.x, p.y - i.y)));
OUTER.forEach((p) => { p.d = distToInner(p); });
const MAXD = Math.max(1, ...OUTER.map((p) => p.d));
OUTER.forEach((p) => { p.delay = +(OUTER_T0 + (p.d / MAXD) * 1.45).toFixed(3); });

const NODES = [...INNER, ...OUTER];

function nearest(of, all, k) {
  return all
    .filter((n) => n !== of)
    .map((n) => ({ n, d: Math.hypot(n.x - of.x, n.y - of.y) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
    .map((x) => x.n);
}

// Quadratic Bezier point at t.
const qp = (a, c, b, t) => {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
           y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
};

// Curve a wire between two nodes. The control point is offset perpendicular
// to the line so wires bow like real cables — and the bow always faces AWAY
// from the P. Wires whose curve passes through the logo clear zone are
// dropped so the network never crosses the P.
function wire(a, b) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const sign = ((mx - CX) * nx + (my - CY) * ny) >= 0 ? 1 : -1;
  const bow = Math.min(40, len * 0.24) * sign;
  const c = { x: mx + nx * bow, y: my + ny * bow };
  // sample along the curve — drop wires whose path touches the P clear zone
  for (let t = 0; t <= 1.0001; t += 0.1) {
    const p = qp(a, c, b, t);
    if (inClear(p.x, p.y)) return null;
  }
  return `M ${a.x} ${a.y} Q ${c.x.toFixed(1)} ${c.y.toFixed(1)} ${b.x} ${b.y}`;
}

// Mesh links — each outer node hooks to its nearest neighbours (inner OR
// outer). The link inherits the timing of whichever endpoint lights first, so
// the wave clearly propagates outward FROM the inner ring.
const seen = new Set();
const LINKS = [];
for (const n of OUTER) {
  for (const m of nearest(n, NODES, 2)) {
    const a = n.delay <= m.delay ? n : m;
    const b = a === n ? m : n;
    const key = `${a.x},${a.y}|${b.x},${b.y}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const d = wire(a, b);
    if (!d) continue;
    LINKS.push({ d, delay: +(a.delay + 0.02).toFixed(3) });
  }
}

// Feeders: a wire from the P out to each of the 5 inner dots. These are the
// first wires to draw, and they originate inside the P (the P is rendered
// on top so they emerge from underneath it).
const FEEDERS = INNER.map((i) => {
  const mx = (CX + i.x) / 2, my = (CY + i.y) / 2;
  const dx = i.x - CX, dy = i.y - CY;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const sign = ((mx - CX) * nx + (my - CY) * ny) >= 0 ? 1 : -1;
  const bow = 18 * sign;
  return {
    d: `M ${CX} ${CY} Q ${(mx + nx * bow).toFixed(1)} ${(my + ny * bow).toFixed(1)} ${i.x} ${i.y}`,
    delay: FEEDER_T,
  };
});

function EnergyNetwork() {
  return (
    <div className="en" aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="en-svg">
        {/* 1 — wires (drawn first → sit BEHIND the logo) + travelling pulses
            on every wire. The pulses keep looping during the cascade/hold and
            are killed the moment the close dolly starts (.en-closing rule
            below) so they don't fight the GPU during the zoom. */}
        <g className="en-net">
          {FEEDERS.map((f, i) => (
            <path key={`f${i}`} className="en-wire" d={f.d} pathLength="1" style={{ "--d": `${f.delay}s` }} />
          ))}
          {LINKS.map((l, i) => (
            <path key={`l${i}`} className="en-wire" d={l.d} pathLength="1" style={{ "--d": `${l.delay}s` }} />
          ))}
          {FEEDERS.map((f, i) => (
            <path key={`fp${i}`} className="en-pulse" d={f.d} pathLength="1" style={{ "--d": `${f.delay}s` }} />
          ))}
          {LINKS.map((l, i) => (
            <path key={`lp${i}`} className="en-pulse" d={l.d} pathLength="1" style={{ "--d": `${l.delay}s` }} />
          ))}
        </g>

        {/* 2 — dim grid that lights up node-by-node in a wave */}
        <g className="en-net">
          {NODES.map((n, i) => (
            <g key={`d${i}`} style={{ "--d": `${n.delay}s` }}>
              <circle className="en-dot-off" cx={n.x} cy={n.y} r="5" />
              <circle className="en-dot" cx={n.x} cy={n.y} r="5" />
            </g>
          ))}
        </g>

        {/* 3 — soft dark backing so any nearby wires fade out under the P */}
        <defs>
          <radialGradient id="enPlate" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#000" stopOpacity="1" />
            <stop offset="55%" stopColor="#000" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse className="en-plate" cx={CX} cy={CY} rx="200" ry="200" fill="url(#enPlate)" />

        {/* 4 — THE P sits on top. It is the source. */}
        <g className="en-p">
          <g transform={P_TF}>
            <path className="en-p-glow" d={P_PATH} pathLength="1" />
            <path className="en-p-fill" d={P_PATH} fillRule="evenodd" />
            <path className="en-p-stroke" d={P_PATH} pathLength="1" />
            <path className="en-p-pulse" d={P_PATH} pathLength="1" />
          </g>
        </g>

        {/* 4 — wordmark */}
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
        .en-svg {
          width: 100%;
          height: 100%;
          display: block;
          /* promote the whole scene to its own layer so the closing dolly
             stays smooth even with many stroke animations running */
          will-change: transform, opacity;
          transform: translateZ(0);
        }
        /* on close-start the Preloader adds .en-closing to .en — that stops
           every infinite animation (breathing wires, travelling pulses, P
           pulse) so the GPU can render the dolly zoom at 60fps. */
        .en.en-closing .en-wire,
        .en.en-closing .en-pulse,
        .en.en-closing .en-p-pulse,
        .en.en-closing .en-dot,
        .en.en-closing .en-dot-off,
        .en.en-closing .en-word {
          animation: none !important;
          opacity: 1;
        }
        /* hide the pulses entirely during the close — they're "frozen" mid-wire
           otherwise and look like dashes. The wires themselves stay solid. */
        .en.en-closing .en-pulse { opacity: 0; }
        .en.en-closing .en-wire { stroke-dashoffset: 0; }

        /* ── wires (real-cable look, breathing pulse) ── */
        /* ── wires: draw on (one-shot) then stay solid bright. No infinite
           breathing loop on the wires (that was 53 keyframe loops on
           stroke-color before). Wires below get a travelling pulse layer. */
        .en-wire {
          fill: none;
          stroke: #f16722;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          filter: drop-shadow(0 0 4px rgba(var(--pl), 0.75));
          animation: enDraw 0.55s ease forwards;
          animation-delay: var(--d);
        }
        @keyframes enDraw { to { stroke-dashoffset: 0; } }
        @keyframes enReveal { to { opacity: 1; } }

        /* bright pulse travelling along each wire — visual interest during
           the cascade + hold. Killed instantly on close-start (.en-closing
           rule above) so the dolly stays smooth. */
        .en-pulse {
          fill: none;
          stroke: #ffe2cd;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-dasharray: 0.05 0.95;
          stroke-dashoffset: 1;
          opacity: 0;
          filter: drop-shadow(0 0 5px rgba(var(--hot), 1));
          animation: enReveal 0.4s ease forwards, enFlow 2.2s linear infinite;
          animation-delay: calc(var(--d) + 0.6s), calc(var(--d) + 0.6s);
        }
        @keyframes enFlow { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }

        /* ── nodes ── */
        .en-dot-off {
          fill: rgba(var(--pl), 0.16);
          stroke: rgba(var(--pl), 0.35);
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
          0%   { opacity: 0; transform: scale(2); filter: drop-shadow(0 0 0 rgba(var(--hot), 0)); }
          40%  { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 12px rgba(var(--hot), 1)); }
          100% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 6px rgba(var(--pl), 0.95)); }
        }

        /* dark plate behind the P so wires fade out as they near the logo */
        .en-plate {
          opacity: 0;
          animation: enReveal 0.6s ease forwards 0.05s;
        }

        /* ── the P (the source, sits on top) ── */
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
          animation: enReveal 0.3s ease forwards 0.5s, enPPulse 1.6s linear infinite 0.5s;
        }
        @keyframes enPPulse { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }

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
          .en-p, .en-wire, .en-pulse, .en-dot, .en-dot-off, .en-p-pulse, .en-word {
            animation: none; opacity: 1;
          }
          .en-wire { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

export default memo(EnergyNetwork);
