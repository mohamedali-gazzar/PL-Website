"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/content";

export default function Projects() {
  const root = useRef(null);
  const track = useRef(null);
  const stRef = useRef(null);

  // Jump past the pinned section so users aren't forced to scroll the whole
  // horizontal track.
  const skip = () => {
    const st = stRef.current;
    const y = st
      ? st.end + 4
      : window.scrollY + root.current.getBoundingClientRect().bottom;
    const lenis = window.__lenis;
    if (lenis?.scrollTo) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    if (reduce || mobile) return; // vertical/native fallback (see CSS)

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const inner = track.current;
      const distance = () => inner.scrollWidth - window.innerWidth;

      // pin the section and translate the track horizontally as you scroll
      const tween = gsap.to(inner, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      stRef.current = tween.scrollTrigger;

      // energy rail fills as you advance
      gsap.fromTo(
        ".pj-rail-fill",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
          },
        }
      );

      return () => tween.kill();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" className="pj" ref={root}>
      <div className="pj-vp">
        <div className="grid-overlay" />

        <div className="pj-track" ref={track}>
          {/* intro card */}
          <div className="pj-card pj-intro">
            <span className="eyebrow">Powerline Projects</span>
            <h2 className="pj-display">
              Power that
              <br />
              built <span className="text-orange">landmarks.</span>
            </h2>
            <p className="pj-lead">
              From hospitals to mega-developments, our boards energise the places
              that shape Egypt — presented as one continuous line of power.
            </p>
            <span className="pj-hint">Scroll →</span>
          </div>

          {projects.map((p, i) => (
            <article className="pj-card" key={p.name}>
              <img className="pj-card-img" src={p.img} alt={p.name} loading="lazy" />
              <span className="pj-card-veil" />
              <span className="pj-dot" />
              <span className="pj-index">
                {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>
              <span className="pj-type">{p.type}</span>
              <h3 className="pj-name">{p.name}</h3>
            </article>
          ))}

          {/* outro card */}
          <div className="pj-card pj-outro">
            <h2 className="pj-display">
              The line
              <br />
              continues.
            </h2>
            <p className="pj-lead">Every project, a new connection in the network.</p>
          </div>
        </div>

        {/* energy rail under the cards */}
        <div className="pj-rail">
          <span className="pj-rail-base" />
          <span className="pj-rail-fill" />
        </div>

        <button type="button" className="pj-skip" onClick={skip} aria-label="Skip projects section">
          Skip <span aria-hidden="true">↓</span>
        </button>
      </div>

      <style jsx>{`
        .pj {
          background: transparent;
        }
        .pj-vp {
          position: relative;
          height: 100svh;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(
              rgba(241, 103, 34, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, rgba(241, 103, 34, 0.05) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(circle at 50% 50%, #000 0%, transparent 75%);
          -webkit-mask-image: radial-gradient(
            circle at 50% 50%,
            #000 0%,
            transparent 75%
          );
          pointer-events: none;
        }
        .pj-track {
          display: flex;
          align-items: center;
          gap: clamp(1.5rem, 3vw, 3rem);
          padding-inline: var(--pad);
          will-change: transform;
        }
        .pj-card {
          flex: 0 0 auto;
          width: clamp(300px, 34vw, 460px);
          height: clamp(360px, 56vh, 540px);
          position: relative;
          border: 1px solid var(--line);
          border-radius: 18px;
          background: linear-gradient(160deg, #0d0d0f 0%, #090909 100%);
          padding: clamp(1.8rem, 3vw, 2.8rem);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
          transition: border-color 0.4s ease;
        }
        .pj-card:hover {
          border-color: rgba(241, 103, 34, 0.4);
        }
        .pj-card-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          transform: scale(1.04);
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pj-card:hover .pj-card-img {
          transform: scale(1.1);
        }
        .pj-card-veil {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            180deg,
            rgba(5, 5, 6, 0.25) 0%,
            rgba(5, 5, 6, 0.5) 45%,
            rgba(5, 5, 6, 0.93) 100%
          );
        }
        .pj-dot,
        .pj-type,
        .pj-name,
        .pj-index {
          position: relative;
          z-index: 2;
        }
        .pj-dot {
          position: absolute;
          top: clamp(1.8rem, 3vw, 2.8rem);
          left: clamp(1.8rem, 3vw, 2.8rem);
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--orange);
          box-shadow: 0 0 14px var(--orange), 0 0 28px rgba(241, 103, 34, 0.5);
        }
        .pj-index {
          position: absolute;
          top: clamp(1.8rem, 3vw, 2.8rem);
          right: clamp(1.8rem, 3vw, 2.8rem);
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
        }
        .pj-type {
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 0.5rem;
        }
        .pj-name {
          font-family: var(--font-head);
          font-weight: 800;
          font-size: clamp(1.5rem, 2.6vw, 2.4rem);
          line-height: 1.02;
          text-transform: uppercase;
          color: #fff;
        }
        /* intro / outro text cards */
        .pj-intro,
        .pj-outro {
          justify-content: center;
          border: none;
          background: none;
          overflow: visible;
          width: clamp(320px, 40vw, 560px);
        }
        .pj-display {
          font-family: var(--font-head);
          font-weight: 800;
          text-transform: uppercase;
          line-height: 1;
          font-size: clamp(2rem, 4.2vw, 3.6rem);
          margin: 1rem 0 0;
        }
        .text-orange {
          color: var(--orange);
        }
        .pj-lead {
          color: var(--text-dim);
          font-size: 1.02rem;
          max-width: 42ch;
          margin-top: 1.3rem;
        }
        .pj-hint {
          margin-top: 2rem;
          font-size: 0.78rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--orange);
        }
        /* energy rail */
        .pj-rail {
          position: absolute;
          left: var(--pad);
          right: var(--pad);
          bottom: clamp(2.5rem, 8vh, 5rem);
          height: 2px;
          z-index: 3;
        }
        .pj-rail-base {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.08);
        }
        .pj-rail-fill {
          position: absolute;
          inset: 0;
          transform: scaleX(0);
          transform-origin: left center;
          background: linear-gradient(90deg, var(--orange-deep), var(--orange-bright));
          box-shadow: 0 0 18px rgba(241, 103, 34, 0.6);
        }

        /* skip control — sits inside the pinned viewport */
        .pj-skip {
          position: absolute;
          right: var(--pad);
          top: clamp(5.5rem, 12vh, 7rem);
          z-index: 5;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.1rem;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-dim);
          background: rgba(12, 12, 14, 0.6);
          border: 1px solid var(--line);
          border-radius: 999px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          cursor: pointer;
          transition: color 0.25s, border-color 0.25s, transform 0.25s;
        }
        .pj-skip:hover {
          color: #fff;
          border-color: rgba(241, 103, 34, 0.6);
          transform: translateY(-2px);
        }

        /* ── mobile / reduced-motion: vertical stack, no pin ── */
        @media (max-width: 900px) {
          .pj-vp {
            height: auto;
            overflow: visible;
            padding: 5rem 0;
          }
          .pj-track {
            flex-direction: column;
            align-items: stretch;
            gap: 1.5rem;
            padding-inline: var(--pad);
            transform: none !important;
          }
          .pj-card {
            width: 100%;
            height: 70vw;
            min-height: 340px;
          }
          .pj-intro,
          .pj-outro {
            width: 100%;
            height: auto;
            min-height: 0;
            padding: 1rem 0;
          }
          .pj-rail {
            display: none;
          }
          .pj-skip {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
