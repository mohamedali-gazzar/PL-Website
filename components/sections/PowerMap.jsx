"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { powerLocations as LOCATIONS } from "@/lib/content";

// Egypt outline (real geography, simplified) on a 940×820 viewBox — traces the
// Mediterranean coast, the Sinai peninsula + Gulf of Suez/Aqaba, the Red Sea
// coast, and the straight southern/western borders.
const EGYPT =
  "M40 27 L190 43 L382 55 L418 35 L520 30 L554 49 L662 60 L695 45 L742 188 L698 316 L583 180 L572 148 L558 193 L663 362 L697 452 L742 533 L886 772 L29 772 L29 226 Z";

export default function PowerMap() {
  const root = useRef(null);
  const [hover, setHover] = useState(null);
  const hq = LOCATIONS.find((l) => l.hq) || LOCATIONS[0];

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".pm-map", {
        opacity: 0,
        scale: 0.94,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pm-map", start: "top 80%" },
      });
      gsap.from(".pm-head > *", {
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pm-head", start: "top 80%" },
      });
      // draw landmass outline on enter
      const outline = root.current.querySelector(".pm-outline");
      const len = outline.getTotalLength();
      gsap.set(outline, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(outline, {
        strokeDashoffset: 0,
        duration: 2.4,
        ease: "power2.inOut",
        scrollTrigger: { trigger: ".pm-map", start: "top 75%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="map" className="pm" ref={root}>
      <div className="container pm-inner">
        <div className="pm-head">
          <span className="eyebrow">Our Network</span>
          <h2 className="pm-title">
            Power across
            <br />
            <span className="text-orange">Egypt</span>
          </h2>
          <p className="pm-lead">
            A connected network of offices, facilities and projects — energy
            flowing from our Cairo headquarters to every corner of the country.
          </p>

          <ul className="pm-list">
            {LOCATIONS.map((l) => (
              <li
                key={l.city}
                className={`pm-list-item ${hover === l.city ? "on" : ""} ${
                  l.hq ? "hq" : ""
                }`}
                onMouseEnter={() => setHover(l.city)}
                onMouseLeave={() => setHover(null)}
              >
                <span className="pm-dot" />
                <span className="pm-city">{l.city}</span>
                <span className="pm-role">{l.role}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pm-map">
          <svg viewBox="0 0 940 820" className="pm-svg">
            <defs>
              <radialGradient id="pmLand" cx="50%" cy="40%" r="70%">
                <stop offset="0%" stopColor="#1a1207" />
                <stop offset="100%" stopColor="#0a0a0b" />
              </radialGradient>
              <filter id="pmGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path d={EGYPT} fill="url(#pmLand)" />
            <path
              className="pm-outline"
              d={EGYPT}
              fill="none"
              stroke="rgba(241,103,34,0.55)"
              strokeWidth="1.6"
            />

            {/* animated energy connections from HQ to every location */}
            {LOCATIONS.filter((l) => !l.hq).map((l) => {
              const active =
                hover === l.city || hover === hq.city || hover === null;
              return (
                <line
                  key={`c-${l.city}`}
                  className={`pm-link ${hover === l.city ? "hot" : ""}`}
                  x1={hq.x}
                  y1={hq.y}
                  x2={l.x}
                  y2={l.y}
                  stroke="var(--orange)"
                  strokeWidth={hover === l.city ? 2 : 1}
                  opacity={active ? (hover === l.city ? 0.95 : 0.4) : 0.15}
                />
              );
            })}

            {/* location nodes with pulsing "ping" rings */}
            {LOCATIONS.map((l) => (
              <g
                key={l.city}
                className={`pm-node ${l.hq ? "is-hq" : ""} ${
                  hover === l.city ? "on" : ""
                }`}
                transform={`translate(${l.x},${l.y})`}
                onMouseEnter={() => setHover(l.city)}
                onMouseLeave={() => setHover(null)}
              >
                <circle className="pm-ping" r="20" />
                <circle
                  r={l.hq ? 8 : 5}
                  fill={l.hq ? "var(--orange)" : "#ffae7d"}
                  filter="url(#pmGlow)"
                />
                <text className="pm-label" x="0" y={l.hq ? -18 : -14}>
                  {l.city}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      <style jsx>{`
        .pm {
          background: linear-gradient(180deg, #050505, #000);
          padding: clamp(5rem, 12vh, 11rem) 0;
        }
        .pm-inner {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: clamp(2rem, 5vw, 5rem);
          align-items: center;
        }
        .pm-head :global(.eyebrow) {
          margin-bottom: 1rem;
        }
        .pm-title {
          font-family: var(--font-head);
          font-weight: 800;
          font-size: clamp(2rem, 4.5vw, 3.6rem);
          line-height: 1;
          text-transform: uppercase;
        }
        .text-orange {
          color: var(--orange);
        }
        .pm-lead {
          margin-top: 1.2rem;
          color: var(--text-dim);
          font-size: 1.05rem;
          max-width: 46ch;
          line-height: 1.6;
        }
        .pm-list {
          list-style: none;
          margin-top: 2.2rem;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .pm-list-item {
          display: grid;
          grid-template-columns: 18px 1fr auto;
          align-items: center;
          gap: 0.9rem;
          padding: 0.7rem 0.9rem;
          border-radius: 10px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .pm-list-item.on {
          border-color: rgba(241, 103, 34, 0.4);
          background: rgba(241, 103, 34, 0.06);
        }
        .pm-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--text-faint);
          transition: all 0.3s ease;
        }
        .pm-list-item.on .pm-dot,
        .pm-list-item.hq .pm-dot {
          background: var(--orange);
          box-shadow: var(--glow);
        }
        .pm-city {
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 1.05rem;
        }
        .pm-role {
          font-size: 0.78rem;
          color: var(--text-dim);
          letter-spacing: 0.05em;
        }
        .pm-list-item.hq .pm-city {
          color: var(--orange);
        }

        .pm-svg {
          width: 100%;
          max-width: 66%;
          margin: 0 auto;
          height: auto;
          overflow: visible;
        }
        .pm-link {
          stroke-dasharray: 6 8;
          animation: pmFlow 1.4s linear infinite;
          transition: opacity 0.3s ease;
        }
        .pm-link.hot {
          filter: drop-shadow(0 0 6px rgba(241, 103, 34, 0.8));
        }
        @keyframes pmFlow {
          to {
            stroke-dashoffset: -28;
          }
        }
        .pm-ping {
          fill: rgba(241, 103, 34, 0.25);
          transform-origin: center;
          transform-box: fill-box;
          animation: pmPing 2.6s ease-out infinite;
        }
        .pm-node.is-hq .pm-ping {
          animation-duration: 2s;
        }
        @keyframes pmPing {
          0% {
            transform: scale(0.3);
            opacity: 0.7;
          }
          80%,
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        .pm-label {
          fill: rgba(255, 255, 255, 0.75);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          text-anchor: middle;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .pm-node.is-hq .pm-label,
        .pm-node.on .pm-label {
          opacity: 1;
          fill: var(--orange);
        }
        .pm-node {
          cursor: pointer;
        }

        @media (max-width: 880px) {
          .pm-inner {
            grid-template-columns: 1fr;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .pm-link,
          .pm-ping {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
