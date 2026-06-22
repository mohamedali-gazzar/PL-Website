"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient background — a growing spider-web of energy across the whole page.
 *
 * Every SPAWN_S seconds a batch of new RANDOM dots appears; each wires to its
 * nearest existing dots, so the network grows as a mesh. Old dots/wires fade
 * out so the web keeps evolving.
 *
 * Smoothness: the wire DRAW and all fades are pure CSS animations/transitions
 * (run on the compositor at native 60fps). The JS rAF loop is throttled and
 * only handles lifecycle (spawn, trigger fade-out, remove) via class toggles —
 * it never writes per-frame values, so the draw is buttery even though the
 * loop ticks slowly. Pauses entirely while the tab is hidden.
 */

const SPAWN_S      = 2.6;   // seconds between spawn batches
const SPAWN_COUNT  = 4;     // dots per batch
const CONNECTIONS  = 2;     // wires from each new dot to nearest existing dots
const MAX_DOTS     = 22;    // population cap
const DRAW_S       = 0.9;   // wire draw duration (CSS)
const LIFE_S       = 15;
const FADE_S       = 2.0;
const MIN_DOT_DIST = 150;
const UPDATE_MS    = 120;   // lifecycle tick — coarse is fine, CSS does the motion

const NS = "http://www.w3.org/2000/svg";

export default function EnergyField() {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Measure the SVG's real painted size (it fills the fixed full-page
    // wrapper) so dots spread across the whole page, not just the centre.
    let W, H;
    const measure = () => {
      const r = svg.getBoundingClientRect();
      W = Math.round(r.width) || window.innerWidth;
      H = Math.round(r.height) || window.innerHeight;
    };
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    const dots = [];
    const wires = [];
    const rand = (min, max) => min + Math.random() * (max - min);

    const addDot = (x, y) => {
      const el = document.createElementNS(NS, "circle");
      el.setAttribute("cx", x);
      el.setAttribute("cy", y);
      el.setAttribute("r", "5");
      el.setAttribute("class", "ef-dot"); // CSS fades it in on mount
      svg.appendChild(el);
      const d = { x, y, el, born: performance.now(), fading: false };
      dots.push(d);
      return d;
    };

    const addWire = (a, b) => {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const bow = Math.min(28, len * 0.16) * (Math.random() < 0.5 ? 1 : -1);
      const cx = mx + (-dy / len) * bow;
      const cy = my + (dx / len) * bow;
      const el = document.createElementNS(NS, "path");
      el.setAttribute(
        "d",
        `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
      );
      el.setAttribute("class", "ef-wire"); // CSS draws it on mount (dashoffset 1→0)
      el.setAttribute("pathLength", "1");
      svg.appendChild(el);
      wires.push({ el, born: performance.now(), fading: false });
    };

    // Pick a random spot, full-page, kept clear of existing/pending dots.
    const pickSpot = (pending) => {
      for (let attempts = 0; attempts < 30; attempts++) {
        const x = rand(70, Math.max(70, W - 70));
        const y = rand(70, Math.max(70, H - 70));
        const tooClose = [...dots, ...pending].some(
          (d) => Math.hypot(d.x - x, d.y - y) < MIN_DOT_DIST
        );
        if (!tooClose) return { x, y };
      }
      return { x: rand(70, W - 70), y: rand(70, H - 70) };
    };

    const spawnBatch = (now) => {
      const newOnes = [];
      for (let i = 0; i < SPAWN_COUNT; i++) {
        const { x, y } = pickSpot(newOnes);
        newOnes.push(addDot(x, y));
      }
      for (const nd of newOnes) {
        const existing = dots.filter((d) => d !== nd);
        if (!existing.length) continue;
        const closest = existing
          .map((d) => ({ d, dist: Math.hypot(d.x - nd.x, d.y - nd.y) }))
          .sort((a, b) => a.dist - b.dist)
          .slice(0, CONNECTIONS);
        for (const { d } of closest) addWire(d, nd);
      }
      const overflow = dots.length - MAX_DOTS;
      for (let i = 0; i < overflow; i++) dots[i].born = now - LIFE_S;
    };

    spawnBatch(performance.now());
    let lastSpawn = performance.now();

    let raf;
    let lastUpdate = 0;
    const wireLife = LIFE_S - FADE_S * 0.6;
    const tick = (now) => {
      if (now - lastUpdate < UPDATE_MS) {
        raf = requestAnimationFrame(tick);
        return;
      }
      lastUpdate = now;
      // lifecycle ONLY — toggle the CSS fade-out class at the boundary, then
      // remove once fully faded. No per-frame value writes.
      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        const age = (now - d.born) / 1000;
        if (!d.fading && age > LIFE_S - FADE_S) {
          d.fading = true;
          d.el.classList.add("out");
        }
        if (age > LIFE_S) {
          svg.removeChild(d.el);
          dots.splice(i, 1);
        }
      }
      for (let i = wires.length - 1; i >= 0; i--) {
        const w = wires[i];
        const age = (now - w.born) / 1000;
        if (!w.fading && age > wireLife - FADE_S) {
          w.fading = true;
          w.el.classList.add("out");
        }
        if (age > wireLife) {
          svg.removeChild(w.el);
          wires.splice(i, 1);
        }
      }
      if ((now - lastSpawn) / 1000 >= SPAWN_S) {
        lastSpawn = now;
        spawnBatch(now);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Pause everything while the tab is hidden; shift timestamps on return so
    // nothing mass-expires/pops.
    let hiddenAt = 0;
    const onVisibility = () => {
      if (document.hidden) {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        hiddenAt = performance.now();
      } else if (!raf) {
        const elapsed = performance.now() - hiddenAt;
        for (const d of dots) d.born += elapsed;
        for (const w of wires) w.born += elapsed;
        lastSpawn += elapsed;
        lastUpdate = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="ef"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <style jsx>{`
        .ef {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: visible;
        }
        /* wires: the draw is a CSS animation that runs on mount (compositor,
           native 60fps — smooth regardless of the throttled JS lifecycle loop).
           stroke-dashoffset is the only animated prop, so opacity stays free
           for the fade-out transition. */
        :global(.ef-wire) {
          fill: none;
          stroke: #f16722;
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          opacity: 0.9;
          transition: opacity ${FADE_S}s ease;
          animation: efDraw ${DRAW_S}s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        @keyframes efDraw {
          to { stroke-dashoffset: 0; }
        }
        :global(.ef-wire.out) {
          opacity: 0;
        }
        /* dots: fade in on mount, fade out when retired — both CSS animations */
        :global(.ef-dot) {
          fill: #f16722;
          filter: drop-shadow(0 0 3px rgba(241, 103, 34, 0.9));
          opacity: 0;
          animation: efDotIn 0.6s ease forwards;
        }
        @keyframes efDotIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        :global(.ef-dot.out) {
          animation: efDotOut ${FADE_S}s ease forwards;
        }
        @keyframes efDotOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </svg>
  );
}
