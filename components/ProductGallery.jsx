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
          <img className="pg-badge" src={badge} alt="Type Tested by Powerline" />
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
        /* certification seal overlaid on the product image */
        .main .pg-badge {
          position: absolute;
          top: clamp(0.8rem, 3.5%, 1.5rem);
          right: clamp(0.8rem, 3.5%, 1.5rem);
          width: clamp(92px, 28%, 165px);
          height: auto;
          object-fit: contain;
          /* no plate — drop-shadow keeps the seal legible on the photo */
          filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.55))
            drop-shadow(0 6px 16px rgba(0, 0, 0, 0.45));
          z-index: 3;
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
