"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient background — sparse RANDOM electrical pulses.
 *
 * Instead of a connected, growing network (which pulled the eye around the
 * page), this just fires the occasional short energy spark at a random spot:
 * a hot dash that races along a faint, gently-curved track and fades. There's
 * no persistent web to read, so it stays quietly in the background and never
 * competes with the content.
 *
 * Smoothness: the pulse travel + draw + fade are pure CSS animations (run on
 * the compositor at native 60fps). The JS rAF loop is throttled and only does
 * lifecycle (spawn, remove) — it never writes per-frame values. Pauses while
 * the tab is hidden.
 */

const SPAWN_S   = 1.15;  // seconds between sparks
const MAX_LIVE  = 5;     // concurrent sparks cap
const TRAVEL_S  = 1.6;   // pulse travel duration (CSS)
const LIFE_S    = 2.2;   // total life before removal (travel + fade tail)
const UPDATE_MS = 140;   // lifecycle tick — coarse is fine, CSS does the motion

const NS = "http://www.w3.org/2000/svg";

export default function EnergyField() {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Measure the SVG's real painted size (it fills the fixed full-page wrapper)
    // so sparks spread across the whole page.
    let W, H;
    const measure = () => {
      const r = svg.getBoundingClientRect();
      W = Math.round(r.width) || window.innerWidth;
      H = Math.round(r.height) || window.innerHeight;
    };
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    const sparks = [];
    const rand = (min, max) => min + Math.random() * (max - min);

    // One spark = a faint track + a hot pulse dash travelling along it.
    const spawn = () => {
      const x1 = rand(40, Math.max(40, W - 40));
      const y1 = rand(40, Math.max(40, H - 40));
      const ang = rand(0, Math.PI * 2);
      const len = rand(120, 260);
      const x2 = x1 + Math.cos(ang) * len;
      const y2 = y1 + Math.sin(ang) * len;
      // gentle perpendicular bow so the track reads like a real cable
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const nx = -Math.sin(ang), ny = Math.cos(ang);
      const bow = rand(-26, 26);
      const cx = mx + nx * bow, cy = my + ny * bow;
      const d = `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;

      const g = document.createElementNS(NS, "g");
      const track = document.createElementNS(NS, "path");
      track.setAttribute("d", d);
      track.setAttribute("class", "ef-track");
      const pulse = document.createElementNS(NS, "path");
      pulse.setAttribute("d", d);
      pulse.setAttribute("pathLength", "1");
      pulse.setAttribute("class", "ef-pulse");
      g.appendChild(track);
      g.appendChild(pulse);
      svg.appendChild(g);

      sparks.push({ el: g, born: performance.now() });
    };

    spawn();
    let lastSpawn = performance.now();

    let raf;
    let lastUpdate = 0;
    const tick = (now) => {
      if (now - lastUpdate < UPDATE_MS) {
        raf = requestAnimationFrame(tick);
        return;
      }
      lastUpdate = now;
      // lifecycle ONLY — remove finished sparks, spawn new ones. No per-frame
      // value writes; the CSS animations handle all motion.
      for (let i = sparks.length - 1; i >= 0; i--) {
        if ((now - sparks[i].born) / 1000 > LIFE_S) {
          svg.removeChild(sparks[i].el);
          sparks.splice(i, 1);
        }
      }
      if ((now - lastSpawn) / 1000 >= SPAWN_S && sparks.length < MAX_LIVE) {
        lastSpawn = now;
        spawn();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Pause while the tab is hidden; shift timestamps on return so nothing
    // mass-expires/pops.
    let hiddenAt = 0;
    const onVisibility = () => {
      if (document.hidden) {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        hiddenAt = performance.now();
      } else if (!raf) {
        const elapsed = performance.now() - hiddenAt;
        for (const s of sparks) s.born += elapsed;
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
        /* faint track the pulse rides along — quietly fades in then out so it's
           barely there when no pulse is on it */
        :global(.ef-track) {
          fill: none;
          stroke: rgba(241, 103, 34, 0.16);
          stroke-width: 1;
          stroke-linecap: round;
          opacity: 0;
          animation: efTrack ${LIFE_S}s ease forwards;
        }
        @keyframes efTrack {
          0%   { opacity: 0; }
          20%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0; }
        }
        /* the hot pulse: a short bright dash that races along the track once
           (CSS — compositor, native 60fps) then the parent is removed */
        :global(.ef-pulse) {
          fill: none;
          stroke: #ff8a3d;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-dasharray: 0.12 1;
          stroke-dashoffset: 1;
          filter: drop-shadow(0 0 3px rgba(241, 103, 34, 0.8));
          animation: efPulse ${TRAVEL_S}s cubic-bezier(0.4, 0, 0.4, 1) forwards;
        }
        @keyframes efPulse {
          to { stroke-dashoffset: -0.12; }
        }
      `}</style>
    </svg>
  );
}
