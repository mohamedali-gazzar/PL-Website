"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient background — a living chain.
 *
 * One "head" dot is alive at any moment. Every ~1.2s a NEW random dot spawns
 * somewhere on screen and a wire grows from the current head out to it; once
 * the wire arrives, the new dot lights up and BECOMES the head. Old dots and
 * old wires linger a few hops then fade out. The network is never the same
 * twice — the energy is always travelling to a fresh destination.
 *
 * JS-driven via one rAF loop, GPU-cheap (opacity + path drawing only). The
 * loop pauses while the tab is hidden so it costs nothing in the background.
 */

const MAX_DOTS = 10;     // ceiling — old ones fade out as new ones spawn
const HOP_S    = 1.2;    // delay between successive hops
const DRAW_S   = 0.55;   // how long a wire takes to deliver energy
const LIFE_S   = HOP_S * 6; // how long a dot stays visible before fading
const FADE_S   = 1.2;    // fade-out duration

const NS = "http://www.w3.org/2000/svg";

export default function EnergyField() {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    const onResize = () => { W = window.innerWidth; H = window.innerHeight; };
    window.addEventListener("resize", onResize);

    /** @type {Array<{x:number,y:number,el:SVGCircleElement,born:number}>} */
    const dots = [];
    /** @type {Array<{el:SVGPathElement,born:number}>} */
    const wires = [];

    const rand = (min, max) => min + Math.random() * (max - min);

    // Spawn a dot at a random spot (kept away from the screen edges).
    const spawnDot = () => {
      const x = rand(80, Math.max(80, W - 80));
      const y = rand(80, Math.max(80, H - 80));
      const el = document.createElementNS(NS, "circle");
      el.setAttribute("cx", x);
      el.setAttribute("cy", y);
      el.setAttribute("r", "5");
      el.setAttribute("class", "ef-dot");
      svg.appendChild(el);
      const d = { x, y, el, born: performance.now() };
      dots.push(d);
      return d;
    };

    // Wire from one dot to another — a curved path that draws on over DRAW_S.
    const spawnWire = (a, b) => {
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
      const w = { el, born: performance.now() };
      wires.push(w);
    };

    // Seed: one starter dot.
    let head = spawnDot();

    let lastHop = performance.now();
    let raf;
    const tick = (now) => {
      // age each dot / wire and fade it out near end of life
      for (const d of dots) {
        const age = (now - d.born) / 1000;
        const fade = age > LIFE_S - FADE_S ? Math.max(0, 1 - (age - (LIFE_S - FADE_S)) / FADE_S) : 1;
        d.el.style.opacity = fade.toString();
      }
      for (const w of wires) {
        const age = (now - w.born) / 1000;
        // draw on
        const draw = Math.min(1, age / DRAW_S);
        w.el.style.strokeDashoffset = (1 - draw).toString();
        // fade out near end of life (wires die slightly before their endpoints)
        const wireLife = LIFE_S - FADE_S * 0.6;
        const fade = age > wireLife - FADE_S ? Math.max(0, 1 - (age - (wireLife - FADE_S)) / FADE_S) : 1;
        w.el.style.opacity = fade.toString();
      }
      // remove fully-faded elements
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

      // every HOP_S seconds, spawn a new dot and connect it to the current head
      if ((now - lastHop) / 1000 >= HOP_S) {
        lastHop = now;
        // if the head was retired, pick the most recent surviving dot as head
        if (!dots.includes(head)) head = dots[dots.length - 1] || spawnDot();
        // cap population — let the oldest die off when full
        if (dots.length >= MAX_DOTS && dots[0] !== head) {
          dots[0].born = now - LIFE_S; // mark for retirement on next tick
        }
        const next = spawnDot();
        spawnWire(head, next);
        head = next;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      // tear down any nodes we left behind
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
          filter: drop-shadow(0 0 4px rgba(241, 103, 34, 0.7));
        }
        :global(.ef-dot) {
          fill: #f16722;
          filter: drop-shadow(0 0 6px rgba(241, 103, 34, 0.85));
        }
      `}</style>
    </svg>
  );
}
