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
        .to(".h-stat", { opacity: 1, y: 0, stagger: 0.08, duration: 0.6 }, "-=0.35");
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
          <span className="h-line"><span>— partnered with the world</span></span>
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
          {heroStats.map((s) => (
            <div className="h-stat" key={s.label}>
              <div className="num">
                <CountUp value={s.value} suffix={s.suffix} group={!s.plain} />
              </div>
              <div className="lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-media {
          position: absolute;
          inset: 0;
          z-index: 0;
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
              rgba(241, 103, 34, 0.06) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, rgba(241, 103, 34, 0.06) 1px, transparent 1px);
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
          padding-top: 6rem;
        }
        .hero-title {
          font-size: clamp(1.5rem, 4vw, 3.4rem);
          text-transform: uppercase;
          margin: 1.3rem 0 1.6rem;
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
          margin: 0 0 2.2rem;
        }
        .h-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 3.5rem;
        }
        .h-stats {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(1.5rem, 5vw, 4rem);
        }
        .h-stat .num {
          font-family: var(--font-head);
          font-weight: 800;
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          color: #fff;
          line-height: 1;
        }
        .h-stat .lbl {
          font-size: 0.78rem;
          letter-spacing: 0.04em;
          color: var(--text-faint);
          text-transform: uppercase;
          margin-top: 0.4rem;
        }
        .h-scroll {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--text-faint);
        }
        .h-scroll i {
          width: 1px;
          height: 46px;
          background: linear-gradient(var(--orange), transparent);
          animation: flow 1.8s var(--ease) infinite;
        }
        @keyframes flow {
          0% { transform: scaleY(0); transform-origin: top; }
          40% { transform: scaleY(1); transform-origin: top; }
          60% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @media (max-width: 600px) {
          .h-scroll { display: none; }
        }
      `}</style>
    </section>
  );
}
