"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import EnergyNetwork from "./EnergyNetwork";

/**
 * SECTION 00 — Opening experience.
 * Black → the Powerline "P" charges with energy inside its own pathways →
 * branches emerge from the logo and power a distribution network of nodes →
 * the scene holds, then fades to reveal the site.
 */
export default function Preloader({ onComplete }) {
  const root = useRef(null);
  const [hidden, setHidden] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
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

    // hold while the network powers up, then fade out to reveal the site
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(root.current, {
      autoAlpha: 0,
      duration: 0.8,
      ease: "power2.inOut",
      delay: 4.6,
    });

    return () => tl.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hidden) return null;

  return (
    <div className="pre" ref={root}>
      <EnergyNetwork />

      <style jsx>{`
        .pre {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #000;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
