"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { brand, heroStats } from "@/lib/content";
import { CountUp } from "@/components/Primitives";

export default function Hero({ ready }) {
  const root = useRef(null);
  const video = useRef(null);

  // Defer the ~62MB hero video fetch until AFTER the preloader finishes, so it
  // never competes with the opening animation's rAF/paint work or the first
  // paint. The poster (facility-1.webp) is the LCP element and shows the whole
  // time, so the look is unchanged until the (now-cheap) video swaps in.
  useEffect(() => {
    if (!ready || !video.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // poster alone is fine for reduced-motion users
    const v = video.current;
    v.src = "/video/hero.mp4";
    v.load();
    const onReady = () => v.play().catch(() => {});
    v.addEventListener("canplay", onReady, { once: true });
    return () => v.removeEventListener("canplay", onReady);
  }, [ready]);

  // Hide the hero text up-front so nothing flashes while the preloader plays.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.set(".h-line span", { yPercent: 120 });
      gsap.set(".h-eyebrow", { opacity: 0, y: 20 });
      gsap.set(".h-sub", { opacity: 0, y: 24 });
      gsap.set(".h-actions > *", { opacity: 0, y: 20 });
      gsap.set(".h-bus-line", { scaleX: 0 });
      gsap.set(".h-stat", { opacity: 0, y: 30 });
    }, root);
    return () => ctx.revert();
  }, []);

  // The reveal runs the instant the hero appears — no leading delay.
  useEffect(() => {
    if (!ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".h-line span", { yPercent: 0, duration: 0.9, stagger: 0.1 }, 0)
        .to(".h-eyebrow", { opacity: 1, y: 0, duration: 0.6 }, 0)
        .to(".h-sub", { opacity: 1, y: 0, duration: 0.7 }, "-=0.45")
        .to(".h-actions > *", { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 }, "-=0.4")
        .to(".h-bus-line", { scaleX: 1, duration: 1.0, ease: "power2.out" }, "-=0.25")
        .to(".h-stat", { opacity: 1, y: 0, stagger: 0.09, duration: 0.6 }, "-=0.7");
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section className="hero" ref={root}>
      <div className="hero-media">
        <video
          ref={video}
          className="hero-video"
          poster="/img/facility-1.webp"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
        <div className="grad" />
        <div className="grid-overlay" />
      </div>

      <div className="container hero-content">
        <div className="h-copy">
        <span className="eyebrow h-eyebrow">Electrical solutions since 2012</span>

        <h1 className="hero-title">
          <span className="h-line"><span>Built by <em>Powerline</em></span></span>
          <span className="h-line"><span>where it counts</span></span>
          <span className="h-line"><span>partnered with the world</span></span>
          <span className="h-line"><span>for the rest.</span></span>
        </h1>

        <p className="h-sub">
          A leading provider of low &amp; medium voltage electrical panels —
          designed, manufactured and serviced from two advanced facilities built
          to international standards.
        </p>

        <div className="h-actions">
          <Link href="/about" className="btn btn-primary">
            Discover Powerline
          </Link>
          <Link href="/low-voltage" className="btn btn-ghost">
            Explore Solutions
          </Link>
        </div>
        </div>

        <div className="h-stats">
          <div className="h-bus" aria-hidden="true">
            <span className="h-bus-line" />
            <span className="h-bus-pulse" />
          </div>
          <ul className="h-credits">
            {heroStats.map((s) => (
              <li className="h-stat" key={s.label}>
                <span className="h-tap" aria-hidden="true" />
                <div className="num">
                  <CountUp value={s.value} suffix={s.suffix} group={!s.plain} />
                </div>
                <div className="lbl">{s.label}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          /* min-height (not a fixed height) so tall content is never clipped. */
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          /* Clear the fixed navbar. The copy sits in the upper area and the stats
             are pinned to the bottom (below), so the hero fills the screen
             top-to-bottom and feels spacious instead of centered/squeezed. */
          padding-top: clamp(7rem, 10vh, 8.5rem);
          padding-bottom: clamp(2rem, 4vh, 3.25rem);
        }
        .hero-media {
          position: absolute;
          inset: 0;
          z-index: 0;
          /* clip the slight video/poster over-scale here instead of on .hero,
             so hero content can never be clipped */
          overflow: hidden;
        }
        .hero-media img,
        .hero-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.5;
          transform: scale(1.05);
        }
        .grad {
          position: absolute;
          inset: 0;
          background: linear-gradient(
              90deg,
              rgba(5, 5, 6, 0.96) 0%,
              rgba(5, 5, 6, 0.7) 45%,
              rgba(5, 5, 6, 0.35) 100%
            ),
            linear-gradient(0deg, var(--bg) 2%, transparent 40%);
        }
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(
              rgba(232, 114, 42, 0.06) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, rgba(232, 114, 42, 0.06) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(circle at 30% 50%, #000 0%, transparent 70%);
          -webkit-mask-image: radial-gradient(
            circle at 30% 50%,
            #000 0%,
            transparent 70%
          );
        }
        .hero-content {
          position: relative;
          z-index: 2;
          /* fill the hero height and distribute: copy at the top, stats pinned
             to the bottom (via .h-stats margin-top:auto below). */
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          /* Centered and capped at 120rem (=1920px at base). Below 1920 this is
             full-width and unchanged; above 1920 the root scales so it grows and
             stays centered — no more 1920px block pinned to the left. */
          max-width: 120rem;
          margin-inline: auto;
        }
        .hero-title {
          font-size: clamp(1.5rem, 3.6vw, 3.4rem);
          text-transform: uppercase;
          margin: 1.1rem 0 1.5rem;
          line-height: 1.06;
        }
        .h-line {
          display: block;
          overflow: hidden;
        }
        .h-line > span {
          display: block;
        }
        .hero-title em {
          font-style: normal;
          color: var(--orange);
        }
        .h-sub {
          max-width: 56ch;
          font-size: clamp(1rem, 1.5vw, 1.2rem);
          color: var(--text-dim);
          margin: 0 0 2rem;
        }
        .h-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 0;
        }
        /* Centre the copy in the space above the stats — the free space is split
           equally above and below it. The stats stay the last item at the bottom. */
        .h-copy {
          margin: auto 0;
          width: 100%;
        }
        .h-stats {
          margin-top: 0;
        }
        .h-bus {
          position: relative;
          height: 3px;
          border-radius: 3px;
          overflow: hidden;
        }
        .h-bus-pulse {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 140px;
          opacity: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 242, 230, 0.95),
            transparent
          );
          animation: hBusFlow 3.6s ease-in-out 1.2s infinite;
        }
        @keyframes hBusFlow {
          0% { transform: translateX(-140px); opacity: 0; }
          12% { opacity: 1; }
          82% { opacity: 1; }
          100% { transform: translateX(100vw); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .h-bus-pulse { animation: none; opacity: 0; }
        }
        .h-bus-line {
          position: absolute;
          inset: 0;
          transform-origin: center;
          transform: scaleX(1);
          background: linear-gradient(
            90deg,
            rgba(232, 114, 42, 0) 0%,
            rgba(232, 114, 42, 0.78) 12%,
            rgba(232, 114, 42, 0.85) 50%,
            rgba(232, 114, 42, 0.78) 88%,
            rgba(232, 114, 42, 0) 100%
          );
          box-shadow: 0 0 18px rgba(232, 114, 42, 0.42);
        }
        .h-credits {
          list-style: none;
          margin: clamp(1.2rem, 3vh, 2rem) 0 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .h-stat {
          position: relative;
          padding: clamp(1rem, 2.2vh, 1.5rem) clamp(0.9rem, 2vw, 1.6rem) 0;
        }
        .h-stat + .h-stat {
          border-left: 1px solid var(--line);
        }
        .h-tap {
          position: absolute;
          top: 0;
          left: clamp(0.9rem, 2vw, 1.6rem);
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--orange);
          box-shadow: 0 0 10px rgba(232, 114, 42, 0.9);
          transform: translateY(-50%);
        }
        .h-stat .num {
          font-family: var(--font-head);
          font-weight: 800;
          font-size: clamp(1.7rem, 3.2vw, 2.8rem);
          color: #fff;
          line-height: 1;
        }
        .h-stat .lbl {
          display: block;
          margin-top: 0.55rem;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          color: var(--text-faint);
          text-transform: uppercase;
        }
        /* Short/zoomed viewports: tighten only the copy's internal SPACING (the
           navbar-clearing top padding and the big title stay) so everything still
           fits the first screen. */
        @media (max-height: 760px) {
          .hero { padding-bottom: clamp(1.5rem, 3vh, 2.25rem); }
          .hero-title { margin: 0.7rem 0 1rem; }
          .h-sub { margin-bottom: 1.4rem; }
        }
        /* Cramped / zoomed viewports: ease the title + spacing down a touch so the
           copy can never collide with the stats line. Kicks in below 730px height —
           genuinely large screens (taller) keep the full-scale title. */
        @media (max-height: 730px) {
          .hero-title { font-size: clamp(1.3rem, 3.1vw, 2.6rem); margin: 0.5rem 0 0.8rem; }
          .h-sub { margin-bottom: 1.1rem; }
          .h-credits { margin-top: clamp(0.9rem, 2vh, 1.3rem); }
        }
        /* very large screens: let the background fill a touch more; the content
           stays capped at 1920 (above) so it never stretches with the frame */
        @media (min-width: 1921px) {
          .hero-media img,
          .hero-video { transform: scale(1.1); }
        }
        @media (max-width: 640px) {
          .hero { padding-top: clamp(5.5rem, 16vw, 7rem); }
          /* on phones centre the whole group (copy + stats) with a normal gap,
             rather than splitting the space around the copy */
          .hero-content { justify-content: center; }
          .h-copy { margin: 0; }
          .h-stats { margin-top: clamp(1.5rem, 5vh, 2.5rem); }
          .hero-title { margin: 0.6rem 0 0.9rem; }
          .h-sub { margin-bottom: 1.3rem; }
          .h-credits {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.1rem 0;
            margin-top: 0.7rem;
          }
          .h-stat:nth-child(odd) {
            border-left: none;
          }
          .h-stat:nth-child(n + 3) {
            border-top: 1px solid var(--line);
            padding-top: clamp(1.1rem, 3vh, 1.6rem);
          }
          .h-stat:nth-child(n + 3) .h-tap {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
