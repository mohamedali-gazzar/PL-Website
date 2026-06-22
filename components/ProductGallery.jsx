"use client";

import { useState } from "react";

export default function ProductGallery({ images, alt, badge }) {
  const list = images && images.length ? images : [];
  const [active, setActive] = useState(0);
  if (!list.length) return null;

  return (
    <div className="gallery">
      {/* main-wrap is NOT clipped, so the stamp can straddle the image edge and
          spill onto the page; .main itself still clips the photo. */}
      <div className="main-wrap">
        <div className="main">
          <img src={list[active]} alt={alt} />
          <span className="frame" />
        </div>

        {badge && (
          /* a real stamp impression pressed across the edge of the image —
             ~half on the photo, ~half on the page behind it */
          <span className="pg-cert" aria-hidden="false">
            <span className="pg-press" aria-hidden="true" />
            <span className="pg-impact" aria-hidden="true" />
            <img
              className="pg-badge"
              src={badge}
              alt="Designed & Type Tested by Powerline"
            />
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
        .main-wrap {
          position: relative;
          /* visible so the stamp can cross the edge onto the page */
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

        /* ============================================================
           PHYSICAL CERTIFICATION STAMP
           A real stamp impression pressed across the LEFT edge of the
           image — ~50% sits on the photo, ~50% spills onto the page
           behind it, so it reads as applied AFTER the page, crossing
           layers. On load it is physically stamped:
             1. the stamp tool slams down from above (fast, accelerating)
             2. hard impact + compression
             3. the ink impression appears INSTANTLY at the moment of impact
             4. a quick vibration
             5. it settles
           No fade-in, no scale-up, no floating.
           ============================================================ */
        .pg-cert {
          --pl: 241, 103, 34;
          position: absolute;
          left: 56%;
          bottom: 0;
          width: clamp(120px, 31%, 190px);
          aspect-ratio: 1;
          /* centre on the BOTTOM edge → ~50% sits on the image, ~50% spills
             below onto the page/layout. (Bottom edge, not a side, so the
             off-image half is always within the viewport and never collides
             with the detail text on the right; pointer-events:none keeps any
             thumbnails underneath clickable.) */
          transform: translate(-50%, 48%) rotate(-7deg);
          z-index: 6;
          pointer-events: none;
          /* a real cast shadow so the stamp sits physically above the page */
          filter: drop-shadow(0 16px 26px rgba(0, 0, 0, 0.62));
        }

        /* the stamp TOOL (a dark inked head) that slams down and lifts away */
        .pg-press {
          position: absolute;
          inset: 3%;
          border-radius: 50%;
          background: radial-gradient(
            circle at 36% 30%,
            #46464b 0%,
            #1d1d20 60%,
            #0d0d0f 100%
          );
          border: 2px solid rgba(var(--pl), 0.65);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7),
            inset 0 3px 9px rgba(255, 255, 255, 0.14),
            inset 0 -7px 14px rgba(0, 0, 0, 0.55);
          opacity: 0;
          transform: translateY(-320px);
          animation: pgDrop 0.4s cubic-bezier(0.6, 0, 0.95, 0.35) 0.35s both,
            pgLift 0.3s cubic-bezier(0.3, 0, 0.2, 1) 0.75s forwards;
        }
        @keyframes pgDrop {
          0% { opacity: 0; transform: translateY(-320px); }
          30% { opacity: 1; }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pgLift {
          0% { opacity: 1; transform: translateY(3px) scale(0.985); }
          100% { opacity: 0; transform: translateY(-150px) scale(1.03); }
        }

        /* shockwave that snaps out at the instant of impact */
        .pg-impact {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 64%;
          aspect-ratio: 1;
          border-radius: 50%;
          border: 2px solid rgba(var(--pl), 0.7);
          opacity: 0;
          transform: scale(0.5);
          animation: pgShock 0.55s ease-out 0.75s forwards;
        }
        @keyframes pgShock {
          0% { opacity: 0.7; transform: scale(0.5); }
          100% { opacity: 0; transform: scale(1.65); }
        }

        /* the INK impression — invisible until impact, then it appears
           INSTANTLY (no fade), compresses, vibrates, and settles */
        .pg-badge {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          opacity: 0;
          transform-origin: center;
          filter: drop-shadow(0 0 10px rgba(var(--pl), 0.35))
            drop-shadow(0 5px 12px rgba(0, 0, 0, 0.5));
          animation: pgInk 0.62s cubic-bezier(0.34, 1.3, 0.5, 1) 0.75s forwards;
        }
        @keyframes pgInk {
          /* impact frame — ink lands instantly, squashed from the press
             (tilt is on .pg-cert, so these only add squash + vibration) */
          0% { opacity: 1; transform: scale(1.16, 0.8); }
          16% { opacity: 1; transform: scale(0.95, 1.06); }
          /* quick vibration */
          30% { transform: translateX(-3px) rotate(-1deg) scale(1); }
          44% { transform: translateX(3px) rotate(1deg); }
          58% { transform: translateX(-2px) rotate(-0.6deg); }
          72% { transform: translateX(1px) rotate(0.4deg); }
          /* settle */
          100% { opacity: 1; transform: translateX(0) rotate(0deg) scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .pg-press,
          .pg-impact {
            display: none;
          }
          .pg-badge {
            animation: none;
            opacity: 1;
          }
        }

        /* mobile: straddle the BOTTOM-RIGHT corner instead, so the off-image
           half never clips against the viewport edge */
        @media (max-width: 680px) {
          .pg-cert {
            top: auto;
            bottom: 0;
            left: auto;
            right: 8%;
            width: clamp(108px, 36%, 160px);
            transform: translate(0, 42%);
          }
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
