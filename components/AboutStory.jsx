"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CountUp } from "@/components/Primitives";
import { heroStats } from "@/lib/content";

/**
 * About Powerline · Our Story — "IGNITION GRID".
 * A cold electric-blue engineering drawing of Egypt that ignites in Cairo and
 * floods warm gold (the brand) as the story is told, ending on the climactic
 * "delivered on our word." The approved paragraph is preserved VERBATIM — only
 * split into animated phrases. Blue is the matte blueprint substrate; gold is
 * the only thing that glows. Reduced motion / no-JS shows the full lit poster.
 */

// Egypt outline + Cairo anchor reused from the network map (viewBox 940×820).
const EGYPT =
  "M40 27 L190 43 L382 55 L418 35 L520 30 L554 49 L662 60 L695 45 L742 188 L698 316 L583 180 L572 148 L558 193 L663 362 L697 452 L742 533 L886 772 L29 772 L29 226 Z";
const NILE = "M 472 54 Q 484 104 478 144 Q 470 250 452 412 Q 440 560 430 742";
const CAIRO = { x: 478, y: 144 };
// process nodes fan around Cairo (the Delta / 10th-of-Ramadan industrial corridor)
const PROC = [
  { id: "eng", x: 466, y: 96 },
  { id: "fab", x: 542, y: 118 },
  { id: "int", x: 548, y: 176 },
  { id: "svc", x: 496, y: 208 },
];
// global-partner nodes run off the right / top edge — the world beyond Egypt
const GP = [
  { id: "gp1", x: 902, y: 78 },
  { id: "gp2", x: 912, y: 252 },
  { id: "gp3", x: 712, y: 20 },
];

// a gently bowed branch from Cairo out to a node
function branch(a, b, bow = 0.12) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len, k = len * bow;
  return `M ${a.x} ${a.y} Q ${(mx + nx * k).toFixed(1)} ${(my + ny * k).toFixed(1)} ${b.x} ${b.y}`;
}
const BRANCHES = [
  ...PROC.map((n) => ({ ...n, kind: "proc", d: branch(CAIRO, n) })),
  ...GP.map((n) => ({ ...n, kind: "gp", d: branch(CAIRO, n, 0.16) })),
];

// floating technical labels — decorative (their words already live in the copy);
// they orbit the energised region on desktop, and collapse to a chip row on mobile.
const LABELS = [
  { id: "eng", t: "Engineering", x: 67, y: 33 },
  { id: "fab", t: "Fabrication", x: 76, y: 21 },
  { id: "int", t: "Integration", x: 85, y: 43 },
  { id: "svc", t: "Service", x: 72, y: 57 },
  { id: "gp", t: "Global Partners", x: 89, y: 14 },
];

// approved paragraph, verbatim — split for the staged reveal (em = gold key
// phrase; finale = the climax). Concatenated, identical to the source.
const SEGMENTS = [
  { t: "Powerline was " },
  { t: "born in Egypt", em: true },
  { t: " to prove that " },
  { t: "world-class power solutions", em: true },
  { t: " can be built here, not just imported. We build where we add real value — " },
  { t: "engineering, fabrication, integration, and service", em: true },
  { t: " — and " },
  { t: "partner with the world's best", em: true },
  { t: " for the rest. The result: high-quality power solutions, " },
  { t: "delivered on our word", em: true, finale: true },
  { t: ", at a price you can build on." },
];

// film grain — INLINE only (styled-jsx's parser drops the whole block on a data URI)
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function AboutStory() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.classList.add("play", "lit");
      return;
    }

    const cleanups = [];
    let raf3 = 0;
    let played = false;
    const start = () => {
      if (played) return;
      played = true;
      el.classList.add("play");
    };

    try {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ paused: true });
        tl.to(".bp-grid", { opacity: 1, duration: 0.6, ease: "power2.out" }, 0)
          .to(".dim-line", { opacity: 1, duration: 0.5, stagger: 0.06 }, 0.1)
          .fromTo(".egypt-idle", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.95, ease: "power2.out" }, 0)
          .to(".nile", { opacity: 1, duration: 0.7 }, 0.4)
          .to(".silo", { opacity: 1, duration: 0.6, stagger: 0.08 }, 0.5)
          .to(".branch-dormant", { opacity: 1, duration: 0.5, stagger: 0.04 }, 0.4)
          // — ignition in Cairo —
          .fromTo(".cairo-core", { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.5, ease: "back.out(1.6)" }, 0.9)
          .fromTo(".cairo-ring", { scale: 0, opacity: 0.9, transformOrigin: "center" }, { scale: 3.4, opacity: 0, duration: 0.85, ease: "power2.out" }, 0.95)
          .to(".stage-bloom", { opacity: 0.6, duration: 0.8, ease: "power2.out" }, 0.9)
          // — the country comes online (gold trace) —
          .fromTo(".egypt-trace", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.95, ease: "power3.inOut" }, 0.95)
          // — four process branches fire (engineering→fabrication→integration→service) —
          .fromTo(".branch-proc", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, stagger: 0.12, ease: "power3.inOut" }, 1.5)
          .fromTo(".node-proc .node-core", { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.4, stagger: 0.12, ease: "back.out(1.7)" }, 1.62)
          // — out to the world's best —
          .fromTo(".branch-gp", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, stagger: 0.1, ease: "power2.out" }, 2.2)
          .fromTo(".node-gp .node-core", { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.4, stagger: 0.1, ease: "back.out(1.4)" }, 2.35)
          .add(() => el.classList.add("nodes-lit"), 1.7)
          .add(() => el.classList.add("finale-lit"), 3.3);

        const play = () => {
          start();
          try { tl.play(); } catch (_) { el.classList.add("lit", "nodes-lit", "finale-lit"); }
        };

        // play once when it scrolls into view; keep observing to pause loops off-screen
        const io = new IntersectionObserver(
          ([e]) => {
            if (e.isIntersecting) { el.classList.remove("paused"); if (!played) play(); }
            else if (played) { el.classList.add("paused"); }
          },
          { threshold: 0.25 }
        );
        io.observe(el);
        cleanups.push(() => io.disconnect());
        // safety net: if the observer never delivers, start anyway (deferred, not pre-emptive)
        const fb = setTimeout(play, 1400);
        cleanups.push(() => clearTimeout(fb));
      }, el);
      cleanups.push(() => ctx.revert());
    } catch (_) {
      el.classList.add("play", "lit", "nodes-lit", "finale-lit");
    }

    // scroll parallax only — mouse-move parallax + cursor torch disabled per preference
    let sy = 0;
    const applyS = () => { raf3 = 0; el.style.setProperty("--sy", sy.toFixed(3)); };
    const onScroll = () => {
      const r = el.getBoundingClientRect(), vh = window.innerHeight || 1;
      sy = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
      if (!raf3) raf3 = requestAnimationFrame(applyS);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    return () => {
      cleanups.forEach((f) => f());
      if (raf3) cancelAnimationFrame(raf3);
      el.classList.remove("play", "lit", "nodes-lit", "finale-lit", "paused");
      el.style.removeProperty("--sy");
    };
  }, []);

  return (
    <section className="story" ref={root} aria-label="About Powerline — Our Story">
      {/* ───── cinematic blueprint stage ───── */}
      <div className="story-stage" aria-hidden="true">
        <div className="stage-photo" />
        <div className="stage-grain" style={{ backgroundImage: GRAIN }} />

        <svg className="stage-svg" viewBox="0 0 940 820" preserveAspectRatio="xMidYMin slice">
          <defs>
            <pattern id="bp-grid" width="46" height="46" patternUnits="userSpaceOnUse">
              <path d="M46 0H0V46" fill="none" stroke="rgba(56,189,248,0.09)" strokeWidth="1" />
            </pattern>
            <radialGradient id="grid-fade" cx="52%" cy="32%" r="62%">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="grid-mask"><rect width="940" height="820" fill="url(#grid-fade)" /></mask>
            <filter id="gold-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <rect className="bp-grid" width="940" height="820" fill="url(#bp-grid)" mask="url(#grid-mask)" />
          <g className="dim-lines">
            <line className="dim-line" x1="120" y1="300" x2="360" y2="300" />
            <line className="dim-line" x1="640" y1="470" x2="640" y2="700" />
            <line className="dim-line" x1="300" y1="600" x2="520" y2="600" />
          </g>

          <path className="egypt-idle" d={EGYPT} pathLength="1" />
          <path className="egypt-trace" d={EGYPT} pathLength="1" />
          <path className="nile" d={NILE} />

          <g className="silhouettes">
            <path className="silo" d="M 612 392 V 360 l 16 -12 v 12 l 16 -12 v 12 l 16 -12 v 12 l 16 -12 v 44 Z" />
            <rect className="silo" x="704" y="356" width="13" height="48" />
            <rect className="silo" x="724" y="364" width="13" height="40" />
          </g>

          {/* dormant blue wiring + live gold current + travelling spark */}
          {BRANCHES.map((b) => (
            <g key={b.id}>
              <path className="branch branch-dormant" d={b.d} />
              <path className={`branch branch-live branch-${b.kind}`} d={b.d} pathLength="1" />
              <path className="branch branch-spark" d={b.d} pathLength="1" style={{ "--sd": b.kind === "gp" ? "3.1s" : "2.5s" }} />
            </g>
          ))}

          {/* nodes */}
          {BRANCHES.map((b) => (
            <g key={`n-${b.id}`} className={`node node-${b.kind}`} transform={`translate(${b.x} ${b.y})`}>
              <circle className="node-ping" r="11" />
              <circle className="node-ring" r="7.5" />
              <circle className="node-core" r="4.2" />
            </g>
          ))}

          {/* Cairo — origin hub */}
          <g className="cairo-hub" transform={`translate(${CAIRO.x} ${CAIRO.y})`}>
            <circle className="cairo-halo" r="30" />
            <circle className="cairo-ring" r="9" />
            <circle className="cairo-core" r="7.5" />
          </g>
        </svg>

        <div className="stage-bloom" />
        <div className="stage-veil" />
        <div className="stage-vignette" />
        <div className="stage-fade" />
      </div>

      {/* ───── content ───── */}
      <div className="container story-inner">
        <div className="story-kicker">
          <span className="kicker-rule" />
          <span className="kicker-text">Est. 2012 · Cairo, Egypt</span>
        </div>

        <header className="story-head">
          <h1 className="story-title">About Powerline</h1>
          <p className="story-subtitle">Our Story</p>
        </header>

        <p className="story-copy">
          {SEGMENTS.map((s, i) => (
            <span
              key={i}
              className={`seg ${s.em ? "em" : ""} ${s.finale ? "finale" : ""}`}
              style={{ "--i": i }}
            >
              {s.t}
            </span>
          ))}
        </p>

        {/* floating technical labels (decorative — words duplicated in the copy) */}
        <ul className="story-labels" aria-hidden="true">
          {LABELS.map((l, i) => (
            <li key={l.id} className="lbl" style={{ left: `${l.x}%`, top: `${l.y}%`, "--ph": i, "--li": i }}>
              <span className="lbl-dot" />
              {l.t}
            </li>
          ))}
        </ul>

        {/* ───── credentials tapped off the southern grid trunk ───── */}
        <div className="story-credits">
          <div className="bus">
            <span className="bus-line" />
            <span className="bus-pulse" />
          </div>
          <ul className="credits-row">
            {heroStats.map((s, i) => (
              <li className="credit" style={{ "--si": i }} key={s.label}>
                <span className="tap" />
                <span className="credit-v">
                  <CountUp value={s.value} suffix={s.suffix} group={!s.plain} />
                </span>
                <span className="credit-l">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <span className="story-sidemark" aria-hidden="true">SHEET 01 · SCALE 1:1</span>

      <style jsx>{`
        .story {
          --blue: #3da9fc;
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          overflow: hidden;
          padding: clamp(8rem, 16vh, 10.5rem) 0 clamp(3.5rem, 8vh, 6rem);
          isolation: isolate;
        }
        @media (min-height: 760px) { .story { justify-content: center; } }

        /* ── stage layers ── */
        .story-stage { position: absolute; inset: 0; z-index: 0; }
        .stage-photo {
          position: absolute; inset: -3%;
          background: url("/img/facility-1.webp") center / cover no-repeat;
          opacity: 0.12; filter: grayscale(0.45) contrast(1.05);
          transform: translate3d(0, calc(var(--sy, 0) * -18px), 0);
        }
        .stage-grain { position: absolute; inset: 0; opacity: 0.045; mix-blend-mode: overlay; pointer-events: none; }
        .stage-svg {
          position: absolute; inset: 0; width: 100%; height: 100%;
          transform: translate3d(0, calc(var(--sy, 0) * -34px), 0);
        }
        .stage-bloom {
          position: absolute; inset: 0; opacity: 0;
          background: radial-gradient(38% 36% at 58% 22%, rgba(232, 114, 42, 0.5), transparent 62%);
          mix-blend-mode: screen;
        }
        .stage-veil {
          position: absolute; inset: 0;
          background:
            linear-gradient(95deg, rgba(5,5,6,0.95) 0%, rgba(5,5,6,0.82) 36%, rgba(5,5,6,0.4) 70%, rgba(5,5,6,0.6) 100%),
            linear-gradient(180deg, rgba(5,5,6,0.82) 0%, transparent 22%),
            linear-gradient(0deg, var(--bg) 0%, transparent 52%);
        }
        .stage-vignette { position: absolute; inset: 0; box-shadow: inset 0 0 240px 60px rgba(0,0,0,0.7); pointer-events: none; }
        .stage-fade { position: absolute; left: 0; right: 0; bottom: 0; height: 24%; background: linear-gradient(0deg, var(--bg), transparent); pointer-events: none; }

        /* ── SVG: blueprint (matte blue) vs current (gold glows) ── */
        .bp-grid { opacity: 0; }
        .story.lit .bp-grid { opacity: 1; }
        .dim-line { stroke: var(--blue); stroke-width: 1; stroke-opacity: 0.22; opacity: 0; }
        .story.lit .dim-line { opacity: 1; }

        .egypt-idle { fill: rgba(56,189,248,0.035); stroke: var(--blue); stroke-width: 1.4; stroke-opacity: 0.5; stroke-dasharray: 1; stroke-dashoffset: 1; }
        .story.lit .egypt-idle { stroke-dashoffset: 0; }
        .egypt-trace { fill: none; stroke: var(--orange); stroke-width: 1.7; stroke-opacity: 0.9; filter: url(#gold-glow); stroke-dasharray: 1; stroke-dashoffset: 1; }
        .story.lit .egypt-trace { stroke-dashoffset: 0; }
        .nile { fill: none; stroke: var(--blue); stroke-width: 1; stroke-opacity: 0.32; opacity: 0; }
        .story.lit .nile { opacity: 1; }
        .silo { fill: none; stroke: var(--blue); stroke-width: 1.2; stroke-opacity: 0.3; opacity: 0; }
        .story.lit .silo { opacity: 1; }

        .branch { fill: none; }
        .branch-dormant { stroke: var(--blue); stroke-opacity: 0.32; stroke-width: 1; stroke-dasharray: 3 5; opacity: 0; }
        .story.lit .branch-dormant { opacity: 1; }
        .branch-live { stroke: var(--orange); stroke-width: 1.7; stroke-opacity: 0.88; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; }
        .story.lit .branch-live { stroke-dashoffset: 0; }
        .branch-spark { stroke: #fff2e6; stroke-width: 2; stroke-linecap: round; stroke-dasharray: 0.04 0.96; stroke-dashoffset: 1; opacity: 0; }
        .story.nodes-lit .branch-spark { opacity: 0.9; animation: flow var(--sd, 2.6s) linear infinite; }
        @keyframes flow { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }

        .node-ring { fill: var(--bg); stroke: var(--blue); stroke-width: 2; stroke-opacity: 0.55; }
        .node-core { fill: var(--orange); transform: scale(0); transform-box: fill-box; transform-origin: center; filter: drop-shadow(0 0 5px rgba(232,114,42,0.85)); }
        .story.lit .node-core { transform: scale(1); }
        .story.lit .node-ring { stroke: var(--orange); stroke-opacity: 0.9; }
        .node-ping { fill: rgba(232,114,42,0.22); transform-box: fill-box; transform-origin: center; transform: scale(0.4); opacity: 0; }
        .story.nodes-lit .node-ping { animation: ping 2.8s ease-out infinite; }
        .story.nodes-lit .node-gp .node-ping { animation-delay: 0.7s; }
        @keyframes ping { 0% { transform: scale(0.4); opacity: 0.7; } 80%, 100% { transform: scale(1.5); opacity: 0; } }

        .cairo-halo { fill: rgba(232,114,42,0.16); }
        .cairo-core { fill: #fff2e6; transform: scale(0); transform-box: fill-box; transform-origin: center; }
        .story.lit .cairo-core { transform: scale(1); fill: var(--orange); }
        .story.play .cairo-core { animation: breathe 2.6s ease-in-out 3s infinite; }
        .cairo-ring { fill: none; stroke: var(--orange); stroke-width: 2; transform: scale(0); transform-box: fill-box; transform-origin: center; opacity: 0; }
        @keyframes breathe { 0%, 100% { filter: drop-shadow(0 0 6px rgba(232,114,42,0.7)); } 50% { filter: drop-shadow(0 0 16px rgba(232,114,42,1)); } }

        /* ── content ── */
        .story-inner { position: relative; z-index: 3; width: 100%; flex: 1 1 auto; display: flex; flex-direction: column; }
        .story-kicker { display: flex; align-items: center; gap: 1rem; }
        .kicker-rule { width: 0; height: 1px; background: linear-gradient(90deg, var(--orange), transparent); transition: width 1s ease 0.2s; }
        .story.play .kicker-rule { width: clamp(34px, 6vw, 90px); }
        .kicker-text { font-family: var(--font-body); font-weight: 600; font-size: 0.74rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--orange);
          opacity: 0; transform: translateY(8px); transition: opacity 0.7s var(--ease) 0.35s, transform 0.7s var(--ease) 0.35s; }
        .story.play .kicker-text { opacity: 1; transform: none; }

        .story-head { margin-top: clamp(0.9rem, 2.4vh, 1.5rem); }
        .story-title {
          font-family: var(--font-head); font-weight: 800; text-transform: uppercase; color: #fff;
          font-size: clamp(2.6rem, 5.2vw, 5rem); line-height: 0.96; letter-spacing: -0.02em;
          opacity: 0; transform: translateY(16px); filter: blur(8px);
          transition: opacity 0.9s var(--ease) 0.45s, transform 0.9s var(--ease) 0.45s, filter 0.9s var(--ease) 0.45s;
        }
        .story.play .story-title { opacity: 1; transform: none; filter: blur(0); }
        .story-subtitle {
          margin-top: 0.5rem; font-family: var(--font-head); font-weight: 700; text-transform: uppercase;
          font-size: clamp(0.95rem, 1.7vw, 1.35rem); letter-spacing: 0.4em; color: var(--orange);
          opacity: 0; transform: translateY(10px); transition: opacity 0.8s var(--ease) 0.65s, transform 0.8s var(--ease) 0.65s;
        }
        .story.play .story-subtitle { opacity: 1; transform: none; }

        .story-copy {
          margin: clamp(1.5rem, 4vh, 2.6rem) 0 clamp(1.6rem, 5vh, 3rem);
          max-width: min(52ch, 760px);
          font-family: var(--font-head); font-weight: 400;
          font-size: clamp(1.2rem, 2vw, 1.95rem); line-height: 1.5; letter-spacing: -0.005em;
          color: rgba(255, 255, 255, 0.72);
        }
        @media (max-width: 900px) { .story-copy { max-width: 94vw; } }
        .seg { opacity: 0; filter: blur(8px); transition: opacity 0.8s var(--ease), filter 0.8s var(--ease); transition-delay: calc(var(--i) * 0.12s + 0.7s); }
        .story.play .seg { opacity: 1; filter: blur(0); }
        .seg:not(.em) { color: rgba(255, 255, 255, 0.72); }
        .seg.em { color: var(--orange); font-weight: 600; letter-spacing: -0.01em; }
        .story.play .seg.em { text-shadow: 0 0 28px rgba(232,114,42,0.3); }
        .seg.em:hover { text-shadow: 0 0 36px rgba(232,114,42,0.6); }

        /* finale — "delivered on our word." */
        .seg.finale { position: relative; display: inline-block; font-weight: 700; }
        .seg.finale::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: -0.12em; height: 2px;
          background: linear-gradient(90deg, var(--orange), rgba(232,114,42,0)); transform: scaleX(0); transform-origin: left;
          transition: transform 0.9s var(--ease);
        }
        .story.finale-lit .seg.finale { text-shadow: 0 0 40px rgba(232,114,42,0.55); animation: finalePop 0.9s var(--ease) both; }
        .story.finale-lit .seg.finale::after { transform: scaleX(1); }
        @keyframes finalePop { 0% { transform: scale(0.97); } 55% { transform: scale(1.035); } 100% { transform: scale(1); } }

        /* ── floating technical labels (desktop: absolute over the content plane) ── */
        .story-labels { position: absolute; inset: 0; z-index: 2; margin: 0; padding: 0; list-style: none; pointer-events: none; }
        .lbl {
          position: absolute; transform: translate(-50%, -50%);
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.42rem 0.8rem; border-radius: 100px;
          font-family: var(--font-head); font-weight: 700; font-size: 0.72rem;
          letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap;
          color: var(--text-dim);
          background: rgba(10, 10, 14, 0.74); border: 1px solid rgba(56,189,248,0.28);
          opacity: 0; pointer-events: auto; cursor: default;
          transition: opacity 0.6s var(--ease), transform 0.3s var(--ease), border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
        }
        .story.play .lbl { opacity: 1; animation: float calc(7s + var(--ph) * 0.8s) ease-in-out calc(2.6s + var(--li) * 0.12s) infinite; }
        .lbl-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--orange); box-shadow: 0 0 8px var(--orange); flex: 0 0 auto; }
        .lbl:hover, .lbl:focus-visible {
          color: #fff; border-color: var(--orange); transform: translate(-50%, calc(-50% - 2px)) scale(1.05);
          box-shadow: 0 0 0 1px rgba(232,114,42,0.4), 0 10px 30px rgba(0,0,0,0.5); outline: none;
        }
        .lbl:hover .lbl-dot, .lbl:focus-visible .lbl-dot { animation: ping 1.4s ease-out 2; }
        @keyframes float { 0%, 100% { transform: translate(-50%, calc(-50% - 5px)); } 50% { transform: translate(-50%, calc(-50% + 5px)); } }

        /* ── credentials ── */
        .story-credits { position: relative; z-index: 3; margin-top: auto; padding-top: clamp(1.6rem, 4vh, 3rem); }
        .bus { position: relative; height: 3px; border-radius: 3px; overflow: hidden; }
        .bus-line {
          position: absolute; inset: 0; transform: scaleX(0); transform-origin: center;
          background: linear-gradient(90deg, rgba(232,114,42,0) 0%, rgba(232,114,42,0.78) 12%, rgba(232,114,42,0.85) 50%, rgba(232,114,42,0.78) 88%, rgba(232,114,42,0) 100%);
          box-shadow: 0 0 18px rgba(232,114,42,0.42); transition: transform 1.1s var(--ease) 1.6s;
        }
        .story.play .bus-line { transform: scaleX(1); }
        .bus-pulse { position: absolute; top: 0; left: 0; height: 100%; width: 140px; opacity: 0;
          background: linear-gradient(90deg, transparent, rgba(255,242,230,0.95), transparent); }
        .story.play .bus-pulse { animation: busFlow 3.6s ease-in-out 2.9s infinite; }
        @keyframes busFlow { 0% { transform: translateX(-140px); opacity: 0; } 12% { opacity: 1; } 82% { opacity: 1; } 100% { transform: translateX(100vw); opacity: 0; } }

        .credits-row { list-style: none; margin: clamp(1.2rem, 3vh, 2rem) 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); }
        .credit { position: relative; padding: clamp(1rem, 2.2vh, 1.5rem) clamp(0.9rem, 2vw, 1.6rem) 0;
          opacity: 0; transform: translateY(16px); transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
          transition-delay: calc(2.1s + var(--si) * 0.09s); }
        .story.play .credit { opacity: 1; transform: none; }
        .credit + .credit { border-left: 1px solid var(--line); }
        .tap { position: absolute; top: 0; left: clamp(0.9rem, 2vw, 1.6rem); width: 7px; height: 7px; border-radius: 50%;
          background: var(--orange); box-shadow: 0 0 10px rgba(232,114,42,0.9); transform: translateY(-50%); }
        .credit-v { display: block; font-family: var(--font-head); font-weight: 800; font-size: clamp(1.7rem, 3.2vw, 2.8rem); line-height: 1; color: #fff; }
        .credit-l { display: block; margin-top: 0.55rem; color: var(--text-faint); text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.08em; }

        .story-sidemark {
          position: absolute; right: clamp(0.5rem, 1.6vw, 1.6rem); top: 50%; z-index: 2;
          transform: translateY(-50%) rotate(90deg); transform-origin: right center;
          font-family: var(--font-head); font-weight: 700; font-size: 0.68rem; letter-spacing: 0.36em;
          color: var(--text-faint); white-space: nowrap; opacity: 0; transition: opacity 1.2s ease 1.4s;
        }
        .story.play .story-sidemark { opacity: 0.55; }

        /* pause every loop while the section is off-screen */
        .story.paused .branch-spark, .story.paused .node-ping, .story.paused .cairo-core,
        .story.paused .lbl, .story.paused .bus-pulse { animation-play-state: paused !important; }

        /* ── responsive ── */
        @media (max-width: 1024px) {
          .stage-veil { background:
            linear-gradient(180deg, rgba(5,5,6,0.5) 0%, rgba(5,5,6,0.8) 46%, rgba(5,5,6,0.92) 100%),
            linear-gradient(0deg, var(--bg) 0%, transparent 60%); }
          .story-sidemark { display: none; }
          /* labels become a static chip row in the content flow */
          .story-labels { position: static; transform: none; display: flex; flex-wrap: wrap; gap: 0.5rem;
            margin: clamp(1.4rem, 4vh, 2.2rem) 0 0; }
          .lbl { position: static; transform: none !important; opacity: 1 !important; animation: none !important; }
          .lbl:hover, .lbl:focus-visible { transform: scale(1.04) !important; }
        }
        @media (max-width: 640px) {
          .stage-svg { transform: translate3d(0, calc(var(--sy, 0) * -16px), 0); opacity: 0.65; }
          .story-title { font-size: clamp(2.3rem, 11vw, 3.2rem); }
          .credits-row { grid-template-columns: repeat(2, 1fr); gap: 1.4rem 0; }
          .credit:nth-child(odd) { border-left: none; }
          .credit:nth-child(n + 3) { border-top: 1px solid var(--line); padding-top: clamp(1.1rem, 3vh, 1.6rem); }
          .credit:nth-child(n + 3) .tap { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .story *, .story *::before, .story *::after { animation: none !important; transition: none !important; }
          .seg { opacity: 1; filter: none; }
          .story-title, .story-subtitle, .kicker-text, .credit, .story-sidemark, .lbl { opacity: 1; transform: none; }
          .story-title { filter: none; }
          .kicker-rule { width: clamp(34px, 6vw, 90px); }
          .bus-line { transform: scaleX(1); }
          .seg.finale { text-shadow: 0 0 40px rgba(232,114,42,0.55); }
          .seg.finale::after { transform: scaleX(1); }
          .stage-bloom { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}
