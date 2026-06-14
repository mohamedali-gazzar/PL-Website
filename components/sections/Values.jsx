"use client";

import { values } from "@/lib/content";
import { Reveal } from "@/components/Primitives";

export default function Values() {
  return (
    <section className="values">
      <div className="container">
        <Reveal>
          <div className="head sec-head">
            <span className="eyebrow">Powerline Values</span>
            <h2 className="section-title">
              What we <span>stand on</span>
            </h2>
          </div>
        </Reveal>

        <div className="row-grid">
          {values.map((v, i) => (
            <Reveal as="div" className="vcard" key={v.title} delay={i * 90}>
              <div className="vtop">
                <span className="n">{v.n}</span>
                <span className="node" />
              </div>
              <h3>{v.title}</h3>
              <span className="bar" />
            </Reveal>
          ))}
        </div>
      </div>
      <style jsx>{`
        .values {
          padding: clamp(5rem, 12vh, 9rem) 0;
          background: transparent;
        }
        .head {
          margin-bottom: 3rem;
        }
        .head h2 {
          margin-top: 1rem;
        }
        .head span {
          color: var(--orange);
        }
        .row-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }
        .vcard {
          position: relative;
          padding: 1.6rem 1.4rem 1.8rem;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: var(--bg-2);
          overflow: hidden;
          transition: transform 0.4s var(--ease), border-color 0.4s,
            background 0.4s;
        }
        .vcard:hover {
          transform: translateY(-6px);
          border-color: rgba(241, 103, 34, 0.5);
          background: var(--bg-3);
        }
        .vtop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2.2rem;
        }
        .n {
          font-family: var(--font-head);
          font-weight: 700;
          color: var(--orange);
          font-size: 1rem;
        }
        .node {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1px solid var(--text-faint);
          transition: all 0.4s var(--ease);
        }
        .vcard:hover .node {
          background: var(--orange);
          border-color: var(--orange);
          box-shadow: 0 0 16px var(--orange);
        }
        .vcard h3 {
          font-size: clamp(1.05rem, 1.4vw, 1.35rem);
          text-transform: uppercase;
          line-height: 1.1;
          color: #fff;
        }
        .bar {
          position: absolute;
          left: 0;
          bottom: 0;
          height: 3px;
          width: 0;
          background: var(--orange);
          box-shadow: 0 0 12px var(--orange);
          transition: width 0.5s var(--ease);
        }
        .vcard:hover .bar {
          width: 100%;
        }
        @media (max-width: 1024px) {
          .row-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 620px) {
          .row-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
}
