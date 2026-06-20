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
            {/* high-voltage streak + impact flash + shockwave */}
            <span className="pg-fx" aria-hidden="true">
              <span className="pg-bolt" />
              <span className="pg-flash" />
              <span className="pg-shock" />
            </span>
            {/* the stamp itself, slammed into the centre of the frame */}
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
        /* ===== Premium certification reveal =====
           timeline: 0.15s electric streak in from the left → 0.6s stamping
           impact (flash + shockwave + slam) → settle bounce → 1.45s metallic
           sheen sweep → steady engraved glow. */
        .pg-cert { position: absolute; inset: 0; z-index: 3; pointer-events: none; }

        /* --- full-frame effects layer (streak / flash / shockwave) --- */
        .pg-fx { position: absolute; inset: 0; overflow: hidden; }

        /* high-voltage energy streak, motion-blurred, entering from the left */
        .pg-bolt {
          position: absolute;
          top: 50%;
          left: 0;
          width: 26%;
          height: 2px;
          transform: translate(-160%, -50%) scaleX(1.3);
          border-radius: 99px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 170, 80, 0) 22%,
            rgba(255, 196, 120, 0.8) 76%,
            #fff 100%
          );
          opacity: 0;
          filter: blur(0.8px) drop-shadow(0 0 5px rgba(241, 103, 34, 0.9))
            drop-shadow(0 0 12px rgba(255, 170, 80, 0.6));
          animation: boltDash 1.15s cubic-bezier(0.38, 0, 0.4, 1) 0.2s both;
        }
        /* a small, slow energy pulse drifting in from the side to the centre */
        @keyframes boltDash {
          0% { opacity: 0; transform: translate(-160%, -50%) scaleX(1.4); }
          30% { opacity: 1; }
          82% { opacity: 1; transform: translate(48%, -50%) scaleX(1.2); }
          100% { opacity: 0; transform: translate(64%, -50%) scaleX(0.5); }
        }

        /* light flash at the moment of impact */
        .pg-flash {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 62%;
          aspect-ratio: 1;
          transform: translate(-50%, -50%) scale(0.2);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 196, 130, 0.55) 32%,
            transparent 66%
          );
          opacity: 0;
          mix-blend-mode: screen;
          animation: flashPop 0.8s ease-out 1.0s both;
        }
        @keyframes flashPop {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.15); }
          25% { opacity: 0.7; transform: translate(-50%, -50%) scale(0.85); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.4); }
        }

        /* shockwave ring radiating from the strike point */
        .pg-shock {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 38%;
          aspect-ratio: 1;
          transform: translate(-50%, -50%) scale(0.2);
          border: 2px solid rgba(241, 103, 34, 0.85);
          border-radius: 50%;
          opacity: 0;
          filter: drop-shadow(0 0 8px rgba(241, 103, 34, 0.6));
          animation: shockExpand 0.9s cubic-bezier(0.2, 0.7, 0.3, 1) 1.05s both;
        }
        @keyframes shockExpand {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.15); border-width: 2px; }
          25% { opacity: 0.5; }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2); border-width: 0.5px; }
        }

        /* --- the stamp, slammed onto the centre with a tilt + bounce --- */
        .pg-stamp {
          position: absolute;
          top: 50%;
          left: 50%;
          width: clamp(150px, 46%, 340px);
          transform: translate(-50%, -50%) rotate(-7deg);
          opacity: 0;
          animation: stampGrow 0.95s cubic-bezier(0.22, 1, 0.36, 1) 1.05s both;
        }
        /* the stamp materialises in the centre out of nothing and grows */
        @keyframes stampGrow {
          0% { opacity: 0; transform: translate(-50%, -50%) rotate(-7deg) scale(0.04); }
          35% { opacity: 1; }
          62% { transform: translate(-50%, -50%) rotate(-7deg) scale(1.06); }
          82% { transform: translate(-50%, -50%) rotate(-7deg) scale(0.98); }
          100% { opacity: 1; transform: translate(-50%, -50%) rotate(-7deg) scale(1); }
        }

        .pg-seal { position: relative; display: block; }
        .pg-stamp .pg-badge {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 0 12px rgba(241, 103, 34, 0.55))
            drop-shadow(0 6px 18px rgba(0, 0, 0, 0.5));
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
            rgba(255, 240, 220, 0.35) 47%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 240, 220, 0.35) 53%,
            transparent 60%
          );
          background-size: 300% 100%;
          background-position: 135% 0;
          opacity: 0;
          filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.6));
          animation: sheenSweep 1.15s cubic-bezier(0.4, 0, 0.2, 1) 2.1s both;
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
