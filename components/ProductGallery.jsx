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
          <span className="pg-stamp">
            <img className="pg-badge" src={badge} alt="Designed & Type Tested by Powerline" />
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
        /* certification seal — slides in from the side, lands dead-centre on
           the product image, then flickers on like an electric sign */
        .pg-stamp {
          position: absolute;
          top: 50%;
          left: 50%;
          width: clamp(150px, 46%, 340px);
          transform: translate(-50%, -50%);
          z-index: 3;
          pointer-events: none;
          animation: stampSlide 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
        }
        .pg-stamp .pg-badge {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
          animation: stampFlicker 2.4s steps(1, end) 1.15s both;
        }
        @keyframes stampSlide {
          0% { opacity: 0; transform: translate(460%, -50%) rotate(7deg); }
          100% { opacity: 1; transform: translate(-50%, -50%) rotate(0deg); }
        }
        /* power-on: a few hard flickers, then settle into a steady orange glow */
        @keyframes stampFlicker {
          0%, 7% { opacity: 0.18; filter: none; }
          9% { opacity: 1; filter: drop-shadow(0 0 22px rgba(241, 103, 34, 0.95)); }
          12% { opacity: 0.25; filter: none; }
          16% { opacity: 1; filter: drop-shadow(0 0 28px rgba(241, 103, 34, 1)); }
          21% { opacity: 0.45; filter: drop-shadow(0 0 6px rgba(241, 103, 34, 0.4)); }
          26% { opacity: 1; filter: drop-shadow(0 0 26px rgba(241, 103, 34, 0.95)); }
          33% { opacity: 0.7; }
          40% { opacity: 1; filter: drop-shadow(0 0 24px rgba(241, 103, 34, 0.9)); }
          100% {
            opacity: 1;
            filter: drop-shadow(0 0 12px rgba(241, 103, 34, 0.6))
              drop-shadow(0 6px 18px rgba(0, 0, 0, 0.5));
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .pg-stamp { animation: none; opacity: 1; }
          .pg-stamp .pg-badge {
            animation: none; opacity: 1;
            filter: drop-shadow(0 0 12px rgba(241, 103, 34, 0.6))
              drop-shadow(0 6px 18px rgba(0, 0, 0, 0.5));
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
