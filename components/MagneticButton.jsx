"use client";

import { useRef } from "react";
import Link from "next/link";

/**
 * A button that gently floats in place and is magnetically attracted to the
 * cursor on hover (eases back to centre on leave).
 *
 * Structure keeps concerns on separate elements so nothing fights for the
 * `transform`:
 *   .mb-root  → reveal/layout target (GSAP can animate this freely)
 *   .mb-mag   → magnetic offset (transform, JS) + idle float (translate, CSS)
 */
export default function MagneticButton({
  href,
  className = "",
  children,
  floatDelay = 0,
  strength = 0.35,
  float = true,
}) {
  const mag = useRef(null);

  const onMove = (e) => {
    const el = mag.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  };

  const reset = () => {
    const el = mag.current;
    if (!el) return;
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  };

  return (
    <span className="mb-root">
      <span
        className={`mb-mag ${float ? "is-float" : ""}`}
        ref={mag}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ "--fd": `${floatDelay}s` }}
      >
        <Link href={href} className={className}>
          {children}
        </Link>
      </span>

      <style jsx>{`
        .mb-root {
          display: inline-block;
        }
        .mb-mag {
          display: inline-block;
          /* magnetic offset toward the cursor */
          transform: translate(var(--mx, 0px), var(--my, 0px));
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, translate;
        }
        /* idle float — uses the standalone translate property so it
           composes with the transform above instead of overriding it.
           Opt-in: omitted on buttons that should stay perfectly still. */
        .mb-mag.is-float {
          animation: mb-float 4.5s ease-in-out infinite;
          animation-delay: var(--fd, 0s);
        }
        @keyframes mb-float {
          0%,
          100% {
            translate: 0 0;
          }
          50% {
            translate: 0 -9px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .mb-mag {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </span>
  );
}
