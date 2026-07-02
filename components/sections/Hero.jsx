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
          /* min-height (not a fixed height) so tall content is never clipped;
             the content is sized fluidly below to fit within the first screen. */
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          align-items: center;
          /* Clear the fixed navbar; both paddings shrink on short/zoomed
             viewports so the stats always fit inside the first screen. */
          padding-top: clamp(5.25rem, 9vh, 7.5rem);
          padding-bottom: clamp(1.5rem, 4vh, 2.75rem);
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
          padding-top: 0;
          /* On ultra-wide screens keep the content anchored to the left at its
             ~1920 width (video fills the rest) so the stats don't spread apart.
             Unchanged at <=1920 (content is narrower than the cap anyway). */
          max-width: 1920px;
          margin-left: 0;
          margin-right: auto;
        }
        .hero-title {
          font-size: clamp(1.4rem, 3.4vw, 2.9rem);
          text-transform: uppercase;
          margin: clamp(0.55rem, 1.4vh, 1rem) 0 clamp(0.8rem, 1.8vh, 1.3rem);
          line-height: 1.07;
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
          margin: 0 0 clamp(1rem, 2.2vh, 1.6rem);
        }
        .h-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: clamp(1.1rem, 2.6vh, 2rem);
        }
        .h-stats {
          margin-top: clamp(1rem, 2vh, 1.5rem);
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
        /* very large screens: let the background fill a touch more; the content
           stays capped at 1920 (above) so it never stretches with the frame */
        @media (min-width: 1921px) {
          .hero-media img,
          .hero-video { transform: scale(1.1); }
        }
        @media (max-width: 640px) {
          .hero { padding-top: clamp(5.5rem, 16vw, 7rem); }
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
