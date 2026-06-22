"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The connective tissue of the site — a thin orange "current" pinned to the
 * left edge that fills as the user scrolls, with a glowing node at its head.
 * This is the visual through-line for "the flow of power".
 */
export default function EnergyRail() {
  const fill = useRef(null);
  const node = useRef(null);

  useEffect(() => {
    let raf;
    // Cache the scrollable height — reading scrollHeight every frame forces a
    // layout/reflow, especially nasty while the GSAP pins are scrubbing on the
    // same scroll. Recompute it only on resize and on ScrollTrigger refresh
    // (pinned sections change the document height).
    let max = 0;
    const measure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight;
    };
    const update = () => {
      const p = max > 0 ? window.scrollY / max : 0;
      if (fill.current) fill.current.style.transform = `scaleY(${p})`;
      if (node.current) node.current.style.top = `${p * 100}%`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    ScrollTrigger.addEventListener("refresh", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ScrollTrigger.removeEventListener("refresh", measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="rail" aria-hidden="true">
      <span className="rail-fill" ref={fill} />
      <span className="rail-node" ref={node} />
      <style jsx>{`
        .rail {
          position: fixed;
          left: max(14px, 1.6vw);
          top: 0;
          bottom: 0;
          width: 2px;
          z-index: var(--z-rail);
          background: rgba(255, 255, 255, 0.06);
          pointer-events: none;
        }
        .rail-fill {
          position: absolute;
          inset: 0;
          transform-origin: top;
          transform: scaleY(0);
          background: linear-gradient(var(--orange-bright), var(--orange));
          box-shadow: 0 0 10px var(--orange);
        }
        .rail-node {
          position: absolute;
          left: 50%;
          width: 9px;
          height: 9px;
          margin-left: -4.5px;
          margin-top: -4.5px;
          border-radius: 50%;
          background: var(--orange);
          box-shadow: 0 0 14px var(--orange), 0 0 28px rgba(241, 103, 34, 0.5);
        }
        @media (max-width: 768px) {
          .rail {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
