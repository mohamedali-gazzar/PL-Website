"use client";

import { memo } from "react";

/**
 * Ambient page background — a calm, organized energy field.
 *
 * Replaces the previous random lightning crackle with a chain reaction: a
 * sparse network of dots, connected by faint wires, where a single pulse
 * travels dot → wire → next dot → wire → next dot in sequence, lighting each
 * one up briefly as it arrives. Slow rhythm, ambient presence — not chaos.
 *
 * Pure CSS (precomputed delays); a fresh-loop cycle plays continuously.
 */

const W = 1440, H = 900;
const PULSE_S = 1.6;   // how long a pulse takes to travel one wire
const FLASH_S = 0.7;   // how long a dot stays lit after it's powered
const TAIL_S  = 2.0;   // breathing gap before the loop restarts

function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

// Scatter dots across the field with a minimum spacing.
function scatter(n, minDist) {
  const r = rng(913);
  const pts = [];
  let guard = 0;
  while (pts.length < n && guard < n * 80) {
    guard++;
    const x = 90 + r() * (W - 180);
    const y = 90 + r() * (H - 180);
    let ok = true;
    for (const p of pts) {
      if (Math.hypot(p.x - x, p.y - y) < minDist) { ok = false; break; }
    }
    if (ok) pts.push({ x: +x.toFixed(1), y: +y.toFixed(1) });
  }
  return pts;
}

const DOTS = scatter(20, 240);

// Greedy walk: start at the left-most dot, hop to its nearest unvisited
// neighbour. This produces ONE continuous chain so the pulse can travel
// dot-to-dot-to-dot in a sensible order.
function buildChain(dots) {
  const visited = new Set();
  const chain = [];
  let curr = [...dots].sort((a, b) => a.x - b.x)[0];
  visited.add(curr);
  chain.push(curr);
  while (visited.size < dots.length) {
    const next = dots
      .filter((d) => !visited.has(d))
      .map((d) => ({ d, dist: Math.hypot(d.x - curr.x, d.y - curr.y) }))
      .sort((a, b) => a.dist - b.dist)[0];
    if (!next || next.dist > 520) break;
    visited.add(next.d);
    chain.push(next.d);
    curr = next.d;
  }
  return chain;
}

const CHAIN = buildChain(DOTS);

// Curve each wire between consecutive chain dots so it looks like a cable.
function wire(a, b) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const bow = Math.min(22, len * 0.14);
  const cx = mx + (-dy / len) * bow;
  const cy = my + (dx / len) * bow;
  return `M ${a.x} ${a.y} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x} ${b.y}`;
}

// Edges fire in chain order, each starting when the previous arrives.
const EDGES = [];
for (let i = 0; i < CHAIN.length - 1; i++) {
  EDGES.push({ d: wire(CHAIN[i], CHAIN[i + 1]), delay: +(i * PULSE_S).toFixed(2) });
}

// Each dot lights up as the pulse arrives at it (i = its index in the chain).
const LIT_DOTS = CHAIN.map((p, i) => ({ ...p, delay: +(i * PULSE_S).toFixed(2) }));

// Total loop duration — long, calm.
const TOTAL = +(CHAIN.length * PULSE_S + TAIL_S).toFixed(2);

function EnergyField() {
  return (
    <svg
      className="ef"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* faint static wires (the network skeleton) */}
      {EDGES.map((e, i) => (
        <path key={`w${i}`} className="ef-wire" d={e.d} />
      ))}

      {/* traveling pulse — one pulse per wire, sequenced by chain order */}
      {EDGES.map((e, i) => (
        <path
          key={`p${i}`}
          className="ef-pulse"
          d={e.d}
          pathLength="1"
          style={{ "--d": `${e.delay}s`, "--total": `${TOTAL}s` }}
        />
      ))}

      {/* dots — dim by default, flash bright as the pulse arrives */}
      {DOTS.map((p, i) => (
        <circle key={`bg${i}`} className="ef-dot-bg" cx={p.x} cy={p.y} r="5" />
      ))}
      {LIT_DOTS.map((p, i) => (
        <circle
          key={`fg${i}`}
          className="ef-dot-on"
          cx={p.x}
          cy={p.y}
          r="5"
          style={{ "--d": `${p.delay}s`, "--total": `${TOTAL}s` }}
        />
      ))}

      <style jsx>{`
        .ef {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .ef-wire {
          fill: none;
          stroke: rgba(241, 103, 34, 0.32);
          stroke-width: 1.4;
          filter: drop-shadow(0 0 2px rgba(241, 103, 34, 0.35));
        }
        /* dots: clearly visible baseline (always on, just dim) */
        .ef-dot-bg {
          fill: rgba(241, 103, 34, 0.7);
          filter: drop-shadow(0 0 4px rgba(241, 103, 34, 0.5));
        }
        /* dots: bright flash when the pulse arrives */
        .ef-dot-on {
          fill: #ffb069;
          transform-box: fill-box;
          transform-origin: center;
          opacity: 0;
          filter: drop-shadow(0 0 12px rgba(255, 200, 140, 1));
          animation: efDotOn var(--total) linear infinite;
          animation-delay: var(--d);
        }
        @keyframes efDotOn {
          0%   { opacity: 0; transform: scale(0.8); }
          /* the flash window: visible briefly, then fades */
          ${Math.round((FLASH_S / TOTAL) * 50) / 5}% { opacity: 1; transform: scale(2); }
          ${Math.round((FLASH_S / TOTAL) * 250) / 5}% { opacity: 0; transform: scale(1.1); }
          100% { opacity: 0; }
        }

        /* travelling pulse — fires in a small window of its loop, dark the rest */
        .ef-pulse {
          fill: none;
          stroke: #ffe2cd;
          stroke-width: 2.6;
          stroke-linecap: round;
          stroke-dasharray: 0.045 0.955;
          stroke-dashoffset: 1;
          opacity: 0;
          filter: drop-shadow(0 0 6px rgba(255, 200, 140, 1))
            drop-shadow(0 0 12px rgba(241, 103, 34, 0.8));
          animation:
            efPulseShow var(--total) linear infinite,
            efPulseFlow var(--total) linear infinite;
          animation-delay: var(--d), var(--d);
        }
        @keyframes efPulseShow {
          0%, ${Math.round((PULSE_S / TOTAL) * 1000) / 10}% { opacity: 1; }
          ${Math.round((PULSE_S / TOTAL) * 1000) / 10 + 0.01}%, 100% { opacity: 0; }
        }
        @keyframes efPulseFlow {
          from { stroke-dashoffset: 1; }
          ${Math.round((PULSE_S / TOTAL) * 1000) / 10}% { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ef-pulse, .ef-dot-on { animation: none; opacity: 0; }
        }
      `}</style>
    </svg>
  );
}

export default memo(EnergyField);
