"use client";

import { useState } from "react";

export default function ProductGallery({ images, alt }) {
  const list = images && images.length ? images : [];
  const [active, setActive] = useState(0);
  if (!list.length) return null;

  return (
    <div className="gallery">
      <div className="main">
        <img src={list[active]} alt={alt} />
        <span className="frame" />
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
