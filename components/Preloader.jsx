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

    // Hold while the network powers up. Then the WHOLE lit network (bright P +
    // lit lines + lit dots + POWERLINE) dollies toward the viewer together —
    // nothing fades out early, nothing restarts — then the lit scene fades to
    // reveal the site. No React state changes happen until finish(), so the
    // animation can never re-render and restart.
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(
      ".en-svg",
      { scale: 2.5, transformOrigin: "49% 48%", duration: 1.7, ease: "power2.inOut" },
      3.4
    );
    tl.to(
      root.current,
      { autoAlpha: 0, duration: 1.0, ease: "power2.out" },
      4.4
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
