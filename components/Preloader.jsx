"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ElectricBackground from "./ElectricBackground";

const P_PATH =
  "M50 218 L50 30 L132 30 Q170 30 170 72 L170 86 Q170 128 132 128 L50 128";

/**
 * SECTION 00 — Opening experience.
 * Black → faint orange pulse → the P draws itself line by line →
 * energy travels the pathway → the mark glows → the camera zooms
 * into the interior of the P and the world of Powerline is revealed.
 */
export default function Preloader({ onComplete }) {
  const root = useRef(null);
  const outline = useRef(null);
  const pulse = useRef(null);
  const pulseGroup = useRef(null);
  const stage = useRef(null);
  const wordRef = useRef(null);
  const ringRef = useRef(null);
  const [hidden, setHidden] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!outline.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // lock scroll while the intro plays
    const lenis = window.__lenis;
    lenis?.stop();
    document.documentElement.classList.add("lenis-stopped");

    const finish = () => {
      document.documentElement.classList.remove("lenis-stopped");
      lenis?.start();
      setHidden(true);
      onCompleteRef.current?.();
    };

    if (reduce) {
      finish();
      return;
    }

    const len = outline.current.getTotalLength();
    gsap.set(outline.current, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(pulse.current, {
      strokeDasharray: `${len * 0.12} ${len}`,
      strokeDashoffset: len,
      opacity: 0,
    });
    gsap.set([wordRef.current], { opacity: 0, y: 14 });
    gsap.set(ringRef.current, { scale: 0.2, opacity: 0 });

    const tl = gsap.timeline({ onComplete: finish });

    // 1 — silence, then a faint pulse breathes in
    tl.to(ringRef.current, {
      scale: 1,
      opacity: 0.8,
      duration: 0.9,
      ease: "power2.out",
    })
      .to(
        ringRef.current,
        { opacity: 0, scale: 1.6, duration: 0.7, ease: "power1.in" },
        "+=0.1"
      )
      // 2 — the P draws itself, line by line
      .to(
        outline.current,
        { strokeDashoffset: 0, duration: 2.0, ease: "power2.inOut" },
        "-=0.3"
      )
      // 3 — energy travels through the pathway
      .to(pulse.current, { opacity: 1, duration: 0.2 }, "-=0.7")
      .fromTo(
        pulse.current,
        { strokeDashoffset: len },
        {
          strokeDashoffset: -len * 0.12,
          duration: 1.1,
          ease: "power1.inOut",
          repeat: 1,
        },
        "-=0.6"
      )
      // 4 — the mark glows
      .to(
        stage.current,
        {
          filter: "drop-shadow(0 0 26px rgba(241,103,34,0.85))",
          duration: 0.6,
        },
        "-=0.9"
      )
      .to(
        wordRef.current,
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.5"
      )
      .to({}, { duration: 0.5 })
      // 5 — the camera zooms into the interior of the P
      .to(pulse.current, { opacity: 0, duration: 0.3 }, "zoom")
      .to(wordRef.current, { opacity: 0, y: -10, duration: 0.4 }, "zoom")
      .to(
        stage.current,
        { scale: 16, x: -120, y: 30, duration: 1.3, ease: "power3.in" },
        "zoom+=0.1"
      )
      .to(
        root.current,
        { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" },
        "zoom+=0.95"
      );

    return () => tl.kill();
    // run the intro exactly once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hidden) return null;

  return (
    <div className="pre" ref={root}>
      <div className="pre-bg">
        <ElectricBackground opacity={0.7} />
      </div>

      <div className="pre-stage" ref={stage}>
        <span className="pre-ring" ref={ringRef} />
        <svg
          viewBox="0 0 220 248"
          width="220"
          height="248"
          fill="none"
          className="pre-svg"
        >
          <defs>
            <linearGradient id="preGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff8a4c" />
              <stop offset="100%" stopColor="#f16722" />
            </linearGradient>
          </defs>
          <path
            d={P_PATH}
            stroke="rgba(241,103,34,0.10)"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            ref={outline}
            d={P_PATH}
            stroke="url(#preGrad)"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g ref={pulseGroup}>
            <path
              ref={pulse}
              d={P_PATH}
              stroke="#ffe2cd"
              strokeWidth="22"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      <div className="pre-word" ref={wordRef}>
        POWER<span>LINE</span>
      </div>

      <style jsx>{`
        .pre {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2.2rem;
          overflow: hidden;
        }
        .pre-bg {
          position: absolute;
          inset: 0;
          opacity: 0.85;
        }
        .pre-stage {
          position: relative;
          transform-origin: 50% 42%;
          will-change: transform, filter;
        }
        .pre-svg {
          overflow: visible;
        }
        .pre-ring {
          position: absolute;
          top: 38%;
          left: 50%;
          width: 220px;
          height: 220px;
          margin: -110px 0 0 -110px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(241, 103, 34, 0.5) 0%,
            transparent 65%
          );
          will-change: transform, opacity;
        }
        .pre-word {
          position: relative;
          font-family: var(--font-head);
          font-weight: 800;
          letter-spacing: 0.5em;
          font-size: clamp(1rem, 2vw, 1.4rem);
          padding-left: 0.5em;
          color: #fff;
        }
        .pre-word span {
          color: var(--orange);
        }
      `}</style>
    </div>
  );
}
