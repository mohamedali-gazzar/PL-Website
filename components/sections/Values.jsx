"use client";

import { values } from "@/lib/content";
import { Reveal } from "@/components/Primitives";

// One line icon per value (stroke uses currentColor).
const ICONS = [
  // Customer Focus — target
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </>,
  // Continuous Innovation — spark / idea
  <>
    <path d="M12 3v2M5 6l1.5 1.5M19 6l-1.5 1.5M4 12H2M22 12h-2" />
    <path d="M9 17a5 5 0 1 1 6 0c-.7.5-1 1.2-1 2H10c0-.8-.3-1.5-1-2z" />
    <path d="M10 21h4" />
  </>,
  // Collaboration — linked nodes
  <>
    <circle cx="6" cy="7" r="2.5" />
    <circle cx="18" cy="7" r="2.5" />
    <circle cx="12" cy="17" r="2.5" />
    <path d="M8 8.5l3 6M16 8.5l-3 6M8.5 7h7" />
  </>,
  // Excellence — star
  <>
    <path d="M12 3l2.6 5.6 6 .7-4.4 4.1 1.2 6L12 16.8 6.6 19.4l1.2-6L3.4 9.3l6-.7L12 3z" />
  </>,
  // Ownership — shield check
  <>
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </>,
];

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
              <span className="vicon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {ICONS[i]}
                </svg>
              </span>
              <div className="vtop">
                <span className="n">{v.n}</span>
              </div>
              <h3>{v.title}</h3>
              {v.desc && <p className="vdesc">{v.desc}</p>}
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
          gap: clamp(1rem, 1.4vw, 1.5rem);
        }
        .vcard {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 280px;
          padding: 2rem 1.7rem 2.2rem;
          border: 1px solid var(--line);
          border-radius: 18px;
          background: var(--bg-2);
          overflow: hidden;
          transition: transform 0.4s var(--ease), border-color 0.4s,
            background 0.4s;
        }
        .vcard:hover {
          transform: translateY(-6px);
          border-color: rgba(232, 114, 42, 0.5);
          background: var(--bg-3);
        }
        .vicon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 13px;
          border: 1px solid var(--line);
          background: rgba(232, 114, 42, 0.08);
          color: var(--orange);
          margin-bottom: 1.4rem;
          transition: background 0.4s var(--ease), transform 0.4s var(--ease);
        }
        .vicon svg {
          width: 26px;
          height: 26px;
        }
        .vcard:hover .vicon {
          background: rgba(232, 114, 42, 0.16);
          transform: translateY(-2px);
        }
        .vtop {
          display: flex;
          align-items: center;
          margin-bottom: 0.7rem;
        }
        .n {
          font-family: var(--font-head);
          font-weight: 700;
          color: var(--orange);
          font-size: 1.05rem;
          letter-spacing: 0.04em;
        }
        .vcard h3 {
          font-size: clamp(1.2rem, 1.5vw, 1.5rem);
          text-transform: uppercase;
          line-height: 1.12;
          color: #fff;
        }
        .vdesc {
          margin-top: 0.7rem;
          color: var(--text-dim);
          font-size: 0.9rem;
          line-height: 1.55;
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
        @media (max-width: 1100px) {
          .row-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 720px) {
          .row-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .vcard {
            min-height: 0;
            padding: 1.5rem 1.3rem 1.7rem;
          }
        }
        @media (max-width: 420px) {
          .row-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
