"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient background — a growing spider-web of energy.
 *
 * Every SPAWN_S seconds a BATCH of new random dots appears across the screen.
 * Each new dot wires itself to its 2 nearest existing dots, so the network
 * grows as a mesh / spider web rather than a single chain. Old dots and their
 * wires fade out after a few batches so the web is always evolving — never
 * the same twice. JS-driven via one rAF loop; ~SVG nodes are pooled in/out
 * as they live and die.
 */

const SPAWN_S        = 2.6;   // seconds between spawn batches
const SPAWN_COUNT    = 4;     // dots per batch
const CONNECTIONS    = 2;     // wires from each new dot to nearest existing dots
const MAX_DOTS       = 22;    // population cap — denser web across the page
const DRAW_S         = 0.85;  // wire draw duration — quick energy delivery
const LIFE_S         = 15;
const FADE_S         = 2.0;
const MIN_DOT_DIST   = 150;   // spacing so the web spreads instead of clustering
const UPDATE_MS      = 50;    // ~20fps — smooth enough for the faster draw

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
    const measure = () => {
      const r = svg.getBoundingClientRect();
      W = Math.round(r.width) || window.innerWidth;
      H = Math.round(r.height) || window.innerHeight;
    };
    let W, H;
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    /** @type {Array<{x:number,y:number,el:SVGCircleElement,born:number}>} */
    const dots = [];
    /** @type {Array<{el:SVGPathElement,born:number}>} */
    const wires = [];

    const rand = (min, max) => min + Math.random() * (max - min);

    const addDot = (x, y) => {
      const el = document.createElementNS(NS, "circle");
      el.setAttribute("cx", x);
      el.setAttribute("cy", y);
      el.setAttribute("r", "5");
      el.setAttribute("class", "ef-dot");
      svg.appendChild(el);
      const d = { x, y, el, born: performance.now(), lastOp: -1 };
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
      el.setAttribute("class", "ef-wire");
      el.setAttribute("pathLength", "1");
      el.style.strokeDasharray = "1";
      el.style.strokeDashoffset = "1";
      svg.appendChild(el);
      wires.push({ el, born: performance.now(), lastOp: -1, lastDash: -1 });
    };

    // Pick a random spot that isn't too close to any existing or pending dot.
    const pickSpot = (pending) => {
      for (let attempts = 0; attempts < 30; attempts++) {
        const x = rand(80, Math.max(80, W - 80));
        const y = rand(80, Math.max(80, H - 80));
        const tooClose = [...dots, ...pending].some(
          (d) => Math.hypot(d.x - x, d.y - y) < MIN_DOT_DIST
        );
        if (!tooClose) return { x, y };
      }
      return { x: rand(80, W - 80), y: rand(80, H - 80) };
    };

    // One spawn batch: SPAWN_COUNT new dots, each wired to nearest neighbours.
    const spawnBatch = (now) => {
      const newOnes = [];
      for (let i = 0; i < SPAWN_COUNT; i++) {
        const { x, y } = pickSpot(newOnes);
        newOnes.push(addDot(x, y));
      }
      // wire each new dot to its 2 nearest existing dots — the spider web
      for (const nd of newOnes) {
        const existing = dots.filter((d) => d !== nd);
        if (!existing.length) continue;
        const closest = existing
          .map((d) => ({ d, dist: Math.hypot(d.x - nd.x, d.y - nd.y) }))
          .sort((a, b) => a.dist - b.dist)
          .slice(0, CONNECTIONS);
        for (const { d } of closest) addWire(d, nd);
      }
      // retire the oldest if we overflow the cap
      const overflow = dots.length - MAX_DOTS;
      for (let i = 0; i < overflow; i++) dots[i].born = now - LIFE_S;
    };

    // Seed with one immediate batch so the page never sits empty.
    spawnBatch(performance.now());
    let lastSpawn = performance.now();

    let raf;
    let lastUpdate = 0;
    const tick = (now) => {
      // throttle the per-frame DOM work to ~8fps — dots/wires fade slowly
      // enough that this is imperceptible, and it cuts GPU/CPU dramatically
      if (now - lastUpdate < UPDATE_MS) {
        raf = requestAnimationFrame(tick);
        return;
      }
      lastUpdate = now;
      // age + fade dots — only write when the value actually changed (an
      // 8-bit alpha step is ~0.0039, so 0.004 epsilon = byte-identical)
      for (const d of dots) {
        const age = (now - d.born) / 1000;
        const fade = age > LIFE_S - FADE_S
          ? Math.max(0, 1 - (age - (LIFE_S - FADE_S)) / FADE_S)
          : 1;
        if (Math.abs(fade - d.lastOp) > 0.004) {
          d.el.style.opacity = fade.toString();
          d.lastOp = fade;
        }
      }
      // age + draw + fade wires
      for (const w of wires) {
        const age = (now - w.born) / 1000;
        const t = Math.min(1, age / DRAW_S);
        // ease-out cubic — fast start, gentle settle as the energy arrives
        const eased = 1 - Math.pow(1 - t, 3);
        const dash = 1 - eased;
        if (Math.abs(dash - w.lastDash) > 0.004) {
          w.el.style.strokeDashoffset = dash.toString();
          w.lastDash = dash;
        }
        const wireLife = LIFE_S - FADE_S * 0.6;
        const fade = age > wireLife - FADE_S
          ? Math.max(0, 1 - (age - (wireLife - FADE_S)) / FADE_S)
          : 1;
        if (Math.abs(fade - w.lastOp) > 0.004) {
          w.el.style.opacity = fade.toString();
          w.lastOp = fade;
        }
      }
      // garbage-collect fully faded
      for (let i = dots.length - 1; i >= 0; i--) {
        if ((now - dots[i].born) / 1000 > LIFE_S) {
          svg.removeChild(dots[i].el);
          dots.splice(i, 1);
        }
      }
      for (let i = wires.length - 1; i >= 0; i--) {
        if ((now - wires[i].born) / 1000 > LIFE_S - FADE_S * 0.6) {
          svg.removeChild(wires[i].el);
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

    // Pause the whole loop while the tab is hidden (no point animating an
    // ambient decoration nobody can see), and shift every born timestamp
    // forward by the hidden duration on return so nothing mass-expires/pops.
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
        lastUpdate = 0; // force an immediate redraw
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
        :global(.ef-wire) {
          fill: none;
          stroke: #f16722;
          stroke-width: 1.6;
          stroke-linecap: round;
          /* no drop-shadow on wires — re-rasterising a blur for ~10 wires
             every frame was the heavy GPU cost. The dot glow + bright
             stroke alone keep the network clearly visible. */
        }
        :global(.ef-dot) {
          fill: #f16722;
          filter: drop-shadow(0 0 3px rgba(241, 103, 34, 0.9));
        }
      `}</style>
    </svg>
  );
}
