"use client";

import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import ProductGrid from "@/components/ProductGrid";
import { Reveal } from "@/components/Primitives";

export default function CollectionView({ data, eyebrow, img, highlight }) {
  return (
    <PageShell>
      <PageHero eyebrow={eyebrow} title={data.title} lead={data.intro} img={img} />

      <section className="coll">
        <div className="container">
          {highlight && (
            <Reveal>
              <div className="highlights">
                {highlight.map((h) => (
                  <div className="hl" key={h}>
                    <span className="dot" />
                    {h}
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          <ProductGrid items={data.products} />
        </div>
      </section>

      <style jsx>{`
        .coll {
          padding: clamp(3.5rem, 9vh, 6rem) 0 clamp(5rem, 12vh, 8rem);
        }
        .highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem 2.5rem;
          padding: 1.6rem 1.8rem;
          margin-bottom: 3rem;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: var(--bg-2);
        }
        .hl {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          color: var(--text);
          font-size: 0.95rem;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--orange);
          box-shadow: 0 0 10px var(--orange);
        }
      `}</style>
    </PageShell>
  );
}
