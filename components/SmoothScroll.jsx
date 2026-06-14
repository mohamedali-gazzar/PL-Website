"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Global smooth-scroll provider.
 * - Boots Lenis and exposes it on window.__lenis (the Preloader stops/starts it).
 * - Drives GSAP's ScrollTrigger off the same RAF loop so pinned/scrubbed
 *   sections stay perfectly in sync with the smoothed scroll position.
 * - Fully disabled when the user prefers reduced motion.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Always begin a page at the top — the cinematic intro/heroes depend on it.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    gsap.registerPlugin(ScrollTrigger);

    if (reduce) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onRaf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    // Let layout settle, then recalc trigger positions.
    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 300);
    window.addEventListener("load", refresh);

    return () => {
      clearTimeout(t);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return children;
}
