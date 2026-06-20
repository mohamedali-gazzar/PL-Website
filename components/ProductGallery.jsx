"use client";

import { useState } from "react";

export default function ProductGallery({ images, alt, badge }) {
  const list = images && images.length ? images : [];
  const [active, setActive] = useState(0);
  if (!list.length) return null;

  return (
    <div className="gallery">
      <div className="main">
        <img src={list[active]} alt={alt} />
        <span className="frame" />
        {badge && (
          <span className="pg-cert" style={{ "--seal": `url(${badge})` }} aria-hidden="false">
            {/* one continuous event: streak → charged core → ignition → ring */}
            <span className="pg-fx" aria-hidden="true">
              <span className="pg-bolt" />
              <span className="pg-core" />
              <span className="pg-flash" />
              <span className="pg-shock" />
            </span>
            {/* the stamp forms outward from the energy core */}
            <span className="pg-stamp">
              <span className="pg-seal">
                <img className="pg-badge" src={badge} alt="Designed & Type Tested by Powerline" />
                <span className="pg-sheen" aria-hidden="true" />
              </span>
            </span>
          </span>
        )}
      </div>

      {list.length > 1 && (
        <div className="thumbs">
          {list.map((src, i) => (
            <button
              key={src}
              className={`thumb ${i === active ? "on" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`${alt} image ${i + 1}`}
              aria-current={i === active}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .gallery {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .main {
          position: relative;
          aspect-ratio: 1 / 1;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--line);
          background: var(--bg-3);
        }
        .main img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .frame {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 20px;
          box-shadow: inset 0 0 0 1px rgba(241, 103, 34, 0.25);
        }
        /* ===== Unified certification reveal =====
           One continuous electrical event, all sharing the centre point,
           one colour system and one easing language:
             0.15s  pulse converges in from the side
             0.75s  energy condenses into a charged core
             1.00s  core ignites (flash + ring)
             1.00s  stamp FORMS outward from the core (circular reveal + glow)
             1.95s  metallic sheen sweep → steady engraved glow */
        .pg-cert {
          /* shared tokens — keeps every layer on the same palette + rhythm */
          --pl: 241, 103, 34;      /* brand orange   */
          --hot: 255, 226, 188;    /* charged white  */
          --energy: cubic-bezier(0.4, 0, 0.2, 1);
          --spring: cubic-bezier(0.34, 1.4, 0.5, 1);
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }

        .pg-fx { position: absolute; inset: 0; overflow: hidden; }

        /* energy pulse, motion-blurred, streaking in and converging on centre */
        .pg-bolt {
          position: absolute;
          top: 50%;
          left: 0;
          width: 30%;
          height: 2px;
          transform: translate(-170%, -50%) scaleX(1.2);
          border-radius: 99px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(var(--hot), 0) 20%,
            rgba(var(--pl), 0.85) 72%,
            rgba(var(--hot), 1) 100%
          );
          opacity: 0;
          filter: blur(0.7px) drop-shadow(0 0 6px rgba(var(--pl), 0.9))
            drop-shadow(0 0 14px rgba(var(--hot), 0.5));
          animation: boltIn 0.9s var(--energy) 0.15s both;
        }
        @keyframes boltIn {
          0% { opacity: 0; transform: translate(-170%, -50%) scaleX(1.1); }
          28% { opacity: 1; }
          /* accelerate to the centre, then collapse the head into a point */
          80% { opacity: 1; transform: translate(44%, -50%) scaleX(0.9); }
          100% { opacity: 0; transform: translate(58%, -50%) scaleX(0.05); }
        }

        /* the pulse condenses here: a charged core that swells, then flares out */
        .pg-core {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 9%;
          aspect-ratio: 1;
          transform: translate(-50%, -50%) scale(0);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(var(--hot), 1) 0%,
            rgba(var(--pl), 0.9) 45%,
            transparent 70%
          );
          opacity: 0;
          filter: blur(1px) drop-shadow(0 0 12px rgba(var(--pl), 0.9));
          mix-blend-mode: screen;
          animation: coreCharge 0.55s var(--energy) 0.7s both;
        }
        @keyframes coreCharge {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
          45% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          72% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2.8); }
        }

        /* ignition flash — the core blooming into the stamp's birth */
        .pg-flash {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 64%;
          aspect-ratio: 1;
          transform: translate(-50%, -50%) scale(0.2);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(var(--hot), 0.95) 0%,
            rgba(var(--pl), 0.5) 34%,
            transparent 66%
          );
          opacity: 0;
          mix-blend-mode: screen;
          animation: flashPop 0.6s var(--energy) 1.0s both;
        }
        @keyframes flashPop {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.2); }
          22% { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
        }

        /* the same energy snapping outward as the seal's forming ring */
        .pg-shock {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 40%;
          aspect-ratio: 1;
          transform: translate(-50%, -50%) scale(0.15);
          border: 2px solid rgba(var(--pl), 0.85);
          border-radius: 50%;
          opacity: 0;
          filter: drop-shadow(0 0 8px rgba(var(--pl), 0.6));
          animation: shockExpand 0.85s var(--energy) 1.0s both;
        }
        @keyframes shockExpand {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.15); border-width: 2px; }
          24% { opacity: 0.55; }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.95); border-width: 0.5px; }
        }

        /* --- the stamp: born at the core, springs into its resting tilt --- */
        .pg-stamp {
          position: absolute;
          top: 50%;
          left: 50%;
          width: clamp(150px, 46%, 340px);
          transform: translate(-50%, -50%) rotate(-7deg);
          opacity: 0;
          animation: stampRise 0.85s var(--spring) 1.0s both;
        }
        @keyframes stampRise {
          0% { opacity: 0; transform: translate(-50%, -50%) rotate(-7deg) scale(0.72); }
          30% { opacity: 1; }
          62% { transform: translate(-50%, -50%) rotate(-7deg) scale(1.05); }
          100% { opacity: 1; transform: translate(-50%, -50%) rotate(-7deg) scale(1); }
        }

        /* seal materialises from the centre outward, in time with the ignition */
        .pg-seal {
          position: relative;
          display: block;
          clip-path: circle(0% at 50% 50%);
          animation: sealForm 0.8s var(--energy) 1.0s both;
        }
        @keyframes sealForm {
          0% { clip-path: circle(0% at 50% 50%); }
          100% { clip-path: circle(75% at 50% 50%); }
        }

        .pg-stamp .pg-badge {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 0 12px rgba(var(--pl), 0.55))
            drop-shadow(0 6px 18px rgba(0, 0, 0, 0.5));
          /* ignite white-hot at birth, then cool to the steady engraved glow */
          animation: ignite 0.95s var(--energy) 1.05s both;
        }
        @keyframes ignite {
          0% {
            filter: drop-shadow(0 0 0 rgba(var(--hot), 0))
              drop-shadow(0 0 0 rgba(0, 0, 0, 0)) brightness(2.4);
          }
          22% {
            filter: drop-shadow(0 0 26px rgba(var(--hot), 0.95))
              drop-shadow(0 6px 18px rgba(0, 0, 0, 0.35)) brightness(1.7);
          }
          55% {
            filter: drop-shadow(0 0 18px rgba(var(--pl), 0.8))
              drop-shadow(0 6px 18px rgba(0, 0, 0, 0.5)) brightness(1.12);
          }
          100% {
            filter: drop-shadow(0 0 12px rgba(var(--pl), 0.55))
              drop-shadow(0 6px 18px rgba(0, 0, 0, 0.5)) brightness(1);
          }
        }

        /* metallic highlight sweeping across the engraved seal */
        .pg-sheen {
          position: absolute;
          inset: 0;
          -webkit-mask: var(--seal) center / contain no-repeat;
          mask: var(--seal) center / contain no-repeat;
          background: linear-gradient(
            115deg,
            transparent 40%,
            rgba(var(--hot), 0.35) 47%,
            rgba(255, 255, 255, 1) 50%,
            rgba(var(--hot), 0.35) 53%,
            transparent 60%
          );
          background-size: 300% 100%;
          background-position: 135% 0;
          opacity: 0;
          filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.6));
          animation: sheenSweep 1.1s var(--energy) 1.95s both;
        }
        @keyframes sheenSweep {
          0% { opacity: 0; background-position: 135% 0; }
          16% { opacity: 1; }
          84% { opacity: 1; }
          100% { opacity: 0; background-position: -35% 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pg-fx { display: none; }
          .pg-stamp { animation: none; opacity: 1; transform: translate(-50%, -50%) rotate(-7deg); }
          .pg-seal { animation: none; clip-path: none; }
          .pg-stamp .pg-badge { animation: none; }
          .pg-sheen { animation: none; opacity: 0; }
        }
        .thumbs {
          display: flex;
          gap: 0.7rem;
          flex-wrap: wrap;
        }
        .thumb {
          width: 84px;
          height: 84px;
          padding: 0;
          border-radius: 12px;
          border: 1px solid var(--line);
          background: var(--bg-3);
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.25s, transform 0.25s var(--ease);
        }
        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .thumb:hover {
          transform: translateY(-3px);
        }
        .thumb.on {
          border-color: var(--orange);
          box-shadow: 0 0 0 2px rgba(241, 103, 34, 0.4);
        }
      `}</style>
    </div>
  );
}
