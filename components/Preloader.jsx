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
export default function Preloader({ onReveal, onComplete }) {
  const root = useRef(null);
  const [hidden, setHidden] = useState(false);
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;
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
      onRevealRef.current?.();
      finish();
      return;
    }

    // Hold while the network powers up. Then: the conductors + nodes recede
    // (fade) while the BRIGHT P dollies toward the viewer (comes closer); the
    // site cross-fades in behind it; finally the bright P hands off to the now
    // revealed site. The P never dims-and-restarts.
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(
      [".en-net", ".en-word-wrap"],
      { opacity: 0, duration: 0.7, ease: "power2.out" },
      3.3
    );
    tl.to(
      ".en-svg",
      { scale: 2.3, transformOrigin: "49% 48%", duration: 1.6, ease: "power2.inOut" },
      3.3
    );
    tl.call(() => onRevealRef.current?.(), null, 3.6);
    tl.to(
      root.current,
      { autoAlpha: 0, duration: 0.9, ease: "power2.out" },
      4.1
    );

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
