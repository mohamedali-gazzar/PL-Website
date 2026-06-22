"use client";

import Link from "next/link";
import { Reveal } from "@/components/Primitives";
import { products } from "@/lib/content";

const detailFor = (href) => products[href.replace("/products/", "")] || {};
const imgFor = (href) => detailFor(href).img;
const badgeFor = (href) => detailFor(href).badge;
const hoverFor = (href) => {
  const g = detailFor(href).gallery;
  return g && g.length > 1 ? g[1] : null;
};

export default function ProductGrid({ items }) {
  return (
    <div className="grid">
      {items.map((p, i) => {
        const hover = hoverFor(p.href);
        return (
        <Reveal as="div" key={p.name} delay={i * 70}>
          <Link href={p.href} className="prod">
            <div className={`prod-thumb ${hover ? "has-hover" : ""}`}>
              {imgFor(p.href) && (
                <img className="img-base" src={imgFor(p.href)} alt={p.name} loading="lazy" />
              )}
              {hover && (
                <img className="img-hover" src={hover} alt={`${p.name} — interior`} loading="lazy" />
              )}
              {badgeFor(p.href) && (
                <img className="card-badge" src={badgeFor(p.href)} alt="Type Tested by Powerline" loading="lazy" />
              )}
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="prod-body">
              <div className="prod-head">
                <h3>{p.name}</h3>
                <span className="arrow">→</span>
              </div>
              {p.desc && <p>{p.desc}</p>}
            </div>
          </Link>
        </Reveal>
        );
      })}

      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.3rem;
        }
        .prod {
          display: flex;
          flex-direction: column;
          height: 100%;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: var(--bg-2);
          overflow: hidden;
          transition: transform 0.35s var(--ease), border-color 0.35s,
            box-shadow 0.35s;
        }
        .prod:hover {
          transform: translateY(-5px);
          border-color: rgba(241, 103, 34, 0.5);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
        }
        .prod-thumb {
          position: relative;
          aspect-ratio: 4 / 3;
          background: var(--bg-3);
          overflow: hidden;
        }
        .prod-thumb img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.55s var(--ease), transform 0.6s var(--ease);
        }
        .img-hover {
          opacity: 0;
        }
        /* crossfade to the interior image when one exists */
        .prod:hover .prod-thumb.has-hover .img-base {
          opacity: 0;
        }
        .prod:hover .prod-thumb.has-hover .img-hover {
          opacity: 1;
        }
        /* single-image cards just zoom */
        .prod:hover .prod-thumb:not(.has-hover) .img-base {
          transform: scale(1.05);
        }
        .prod-thumb::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 55%, rgba(5, 5, 6, 0.55));
        }
        /* type-tested seal on the card */
        .prod-thumb .card-badge {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 88px;
          height: 88px;
          object-fit: contain;
          filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.5))
            drop-shadow(0 3px 9px rgba(0, 0, 0, 0.4));
          z-index: 3;
        }
        .num {
          position: absolute;
          top: 0.9rem;
          left: 0.9rem;
          font-family: var(--font-head);
          font-weight: 800;
          font-size: 0.85rem;
          color: #fff;
          background: var(--orange);
          padding: 0.25rem 0.6rem;
          border-radius: 7px;
        }
        .prod-body {
          padding: 1.4rem 1.5rem 1.6rem;
          flex: 1;
        }
        .prod-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.6rem;
        }
        .arrow {
          color: var(--orange);
          font-family: var(--font-head);
          font-weight: 700;
          transition: transform 0.3s var(--ease);
        }
        .prod:hover .arrow {
          transform: translateX(6px);
        }
        h3 {
          font-size: 1.35rem;
          text-transform: uppercase;
          margin: 0 0 0.6rem;
        }
        .prod p {
          color: var(--text-dim);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
