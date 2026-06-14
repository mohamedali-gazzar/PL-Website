"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ElectricBackground from "./ElectricBackground";

// Vectorized from the favicon (the brand P mark) so the opener matches the
// favicon exactly, while keeping the original draw-on + pulse behaviour.
const P_PATH =
  "M 45.955 44.083 C 44.205 47.355, 45.082 70.813, 47 72.023 C 47.839 72.553, 59.637 72.976, 73.782 72.985 C 100.907 73.001, 104.131 73.494, 107.369 78.117 C 109.205 80.737, 109.527 87.146, 107.970 90.055 C 106.135 93.484, 101.609 95, 93.205 95 C 82.182 95, 82 95.263, 82 111.174 C 82 127.156, 81.872 127.007, 95.579 126.983 C 123.215 126.934, 141.900 115.285, 146.640 95.147 C 151.347 75.148, 142.535 55.952, 124.593 47.121 C 115.027 42.412, 111.742 42.051, 78.285 42.024 C 47.665 42, 47.049 42.040, 45.955 44.083 M 54.202 57.250 L 54.500 63.500 79 64 C 106.298 64.557, 108.105 64.939, 113.724 71.338 C 119.421 77.827, 120.180 85.807, 115.897 94.202 C 112.907 100.062, 107.221 103.276, 98.660 103.942 L 91.500 104.500 91.500 111 L 91.500 117.500 95.846 117.812 C 98.236 117.984, 103.398 117.627, 107.318 117.019 C 127.223 113.930, 138.470 102.190, 138.470 84.500 C 138.470 74.861, 136.060 68.723, 129.702 62.167 C 120.156 52.325, 114.454 51.027, 80.702 51.012 L 53.905 51 54.202 57.250 M 46.035 78.934 C 44.626 81.568, 44.626 146.432, 46.035 149.066 C 46.980 150.830, 48.246 151, 60.464 151 C 71.306 151, 74.156 150.701, 75.429 149.429 C 76.786 148.071, 77 143.848, 77 118.429 L 77 89 88.800 89 C 101.191 89, 103 88.427, 103 84.500 C 103 80.421, 101.350 80, 85.371 80 C 72.861 80, 69.862 80.280, 68.571 81.571 C 67.214 82.929, 67 87.156, 67 112.619 L 67 142.095 60.750 141.798 L 54.500 141.500 54.235 110.585 C 54.057 89.810, 53.607 79.232, 52.863 78.335 C 51.226 76.362, 47.224 76.713, 46.035 78.934";

/**
 * SECTION 00 — Opening experience.
 * Black → faint orange pulse → the P (favicon mark) draws itself line by line →
 * energy travels the pathway → the mark glows → the camera zooms into the
 * interior of the P and the world of Powerline is revealed.
 */
export default function Preloader({ onComplete }) {
  const root = useRef(null);
  const outline = useRef(null);
  const fillRef = useRef(null);
  const pulse = useRef(null);
  const stage = useRef(null);
  const wordRef = useRef(null);
  const ringRef = useRef(null);
  const [hidden, setHidden] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!outline.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      strokeDasharray: `${len * 0.1} ${len}`,
      strokeDashoffset: len,
      opacity: 0,
    });
    gsap.set(fillRef.current, { opacity: 0 });
    gsap.set(wordRef.current, { opacity: 0, y: 14 });
    gsap.set(ringRef.current, { scale: 0.2, opacity: 0 });

    const tl = gsap.timeline({ onComplete: finish });

    // 1 — silence, then a faint pulse breathes in
    tl.to(ringRef.current, { scale: 1, opacity: 0.8, duration: 0.9, ease: "power2.out" })
      .to(ringRef.current, { opacity: 0, scale: 1.6, duration: 0.7, ease: "power1.in" }, "+=0.1")
      // 2 — the P draws itself, line by line
      .to(outline.current, { strokeDashoffset: 0, duration: 2.0, ease: "power2.inOut" }, "-=0.3")
      // the mark fills in as the line completes
      .to(fillRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.6")
      // 3 — energy travels through the pathway
      .to(pulse.current, { opacity: 1, duration: 0.2 }, "-=0.7")
      .fromTo(
        pulse.current,
        { strokeDashoffset: len },
        { strokeDashoffset: -len * 0.1, duration: 1.1, ease: "power1.inOut", repeat: 1 },
        "-=0.6"
      )
      // 4 — the mark glows
      .to(stage.current, { filter: "drop-shadow(0 0 26px rgba(241,103,34,0.85))", duration: 0.6 }, "-=0.9")
      .to(wordRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.5")
      .to({}, { duration: 0.5 })
      // 5 — the camera zooms into the interior of the P
      .to(pulse.current, { opacity: 0, duration: 0.3 }, "zoom")
      .to(wordRef.current, { opacity: 0, y: -10, duration: 0.4 }, "zoom")
      .to(stage.current, { scale: 16, duration: 1.3, ease: "power3.in" }, "zoom+=0.1")
      .to(root.current, { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" }, "zoom+=0.95");

    return () => tl.kill();
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
        <svg viewBox="0 0 192 192" width="210" height="210" fill="none" className="pre-svg">
          <defs>
            <linearGradient id="preGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff8a4c" />
              <stop offset="100%" stopColor="#f16722" />
            </linearGradient>
          </defs>
          {/* faint underlay */}
          <path d={P_PATH} fill="rgba(241,103,34,0.10)" fillRule="evenodd" />
          {/* orange fill that comes up as the line completes */}
          <path ref={fillRef} d={P_PATH} fill="url(#preGrad)" fillRule="evenodd" />
          {/* the line that draws itself */}
          <path
            ref={outline}
            d={P_PATH}
            fill="none"
            stroke="url(#preGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* the energy pulse travelling the pathway */}
          <path
            ref={pulse}
            d={P_PATH}
            fill="none"
            stroke="#ffe2cd"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
          /* zoom origin = the interior (counter) of the P */
          transform-origin: 55% 42%;
          will-change: transform, filter;
        }
        .pre-svg {
          overflow: visible;
        }
        .pre-ring {
          position: absolute;
          top: 42%;
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
