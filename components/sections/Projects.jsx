"use client";

import { projects } from "@/lib/content";
import { Reveal } from "@/components/Primitives";

/**
 * Powerline Projects — an auto-looping marquee (like Powerline Customers).
 * The strip drifts horizontally on its own, independent of scroll, and pauses
 * on hover. No pinning, no scrub, no ScrollTrigger.
 */
export default function Projects() {
  // Duplicate the set once so the loop is seamless: the track translates by
  // exactly one base set (-50%) and snaps back invisibly. Each card owns its
  // trailing gap via margin so the seam has no half-gap jump.
  const loop = [...projects, ...projects];

  return (
    <section id="projects" className="pj">
      <div className="container">
        <Reveal>
          <div className="pj-head">
            <span className="eyebrow">Powerline Projects</span>
            <h2 className="pj-title">
              Power that built <span className="text-orange">landmarks.</span>
            </h2>
            <p className="pj-lead">
              From hospitals to mega-developments, our boards energise the
              places that shape Egypt.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="pj-marquee">
            <div className="pj-track">
              {loop.map((p, i) => (
                <article className="pj-card" key={i}>
                  <img
                    className="pj-card-img"
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                  />
                  <span className="pj-card-veil" />
                  <span className="pj-dot" />
                  <span className="pj-type">{p.type}</span>
                  <h3 className="pj-name">{p.name}</h3>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <style jsx>{`
        .pj {
          padding: clamp(4rem, 10vh, 7rem) 0;
          background: transparent;
        }
        .pj-head {
          text-align: center;
          margin-bottom: clamp(2rem, 5vh, 3rem);
        }
        .pj-head :global(.eyebrow) {
          justify-content: center;
        }
        .pj-title {
          font-family: var(--font-head);
          font-weight: 800;
          text-transform: uppercase;
          line-height: 1.04;
          font-size: clamp(1.8rem, 4vw, 3rem);
          margin-top: 1rem;
          color: #fff;
        }
        .text-orange {
          color: var(--orange);
        }
        .pj-lead {
          color: var(--text-dim);
          font-size: 1.02rem;
          max-width: 52ch;
          margin: 1.1rem auto 0;
        }

        /* ── the looping strip ── */
        .pj-marquee {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent,
            #000 6%,
            #000 94%,
            transparent
          );
          mask-image: linear-gradient(
            90deg,
            transparent,
            #000 6%,
            #000 94%,
            transparent
          );
        }
        .pj-track {
          display: flex;
          width: max-content;
          animation: pjScroll 45s linear infinite;
          will-change: transform;
        }
        .pj-marquee:hover .pj-track {
          animation-play-state: paused;
        }
        @keyframes pjScroll {
          to {
            transform: translateX(-50%);
          }
        }

        .pj-card {
          flex: 0 0 auto;
          margin-right: clamp(1.5rem, 3vw, 3rem);
          width: clamp(280px, 30vw, 400px);
          height: clamp(300px, 42vh, 430px);
          position: relative;
          border: 1px solid var(--line);
          border-radius: 18px;
          overflow: hidden;
          background: linear-gradient(160deg, #0d0d0f 0%, #090909 100%);
          padding: clamp(1.6rem, 2.6vw, 2.4rem);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          transition: border-color 0.4s ease, transform 0.5s var(--ease);
        }
        .pj-card:hover {
          border-color: rgba(241, 103, 34, 0.45);
          transform: translateY(-6px);
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
            rgba(5, 5, 6, 0.2) 0%,
            rgba(5, 5, 6, 0.5) 45%,
            rgba(5, 5, 6, 0.93) 100%
          );
        }
        .pj-dot,
        .pj-type,
        .pj-name {
          position: relative;
          z-index: 2;
        }
        .pj-dot {
          position: absolute;
          top: clamp(1.4rem, 2.4vw, 2.2rem);
          left: clamp(1.4rem, 2.4vw, 2.2rem);
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--orange);
          box-shadow: 0 0 14px var(--orange), 0 0 28px rgba(241, 103, 34, 0.5);
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
          font-size: clamp(1.4rem, 2.4vw, 2.1rem);
          line-height: 1.04;
          text-transform: uppercase;
          color: #fff;
        }

        @media (max-width: 900px) {
          .pj-card {
            width: 78vw;
            max-width: 340px;
            height: 86vw;
            max-height: 380px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .pj-marquee {
            overflow: visible;
            -webkit-mask-image: none;
            mask-image: none;
          }
          .pj-track {
            animation: none;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1.5rem;
            width: auto;
          }
        }
      `}</style>
    </section>
  );
}
