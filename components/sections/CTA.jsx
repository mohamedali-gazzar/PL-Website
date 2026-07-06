"use client";

import Link from "next/link";
import { Reveal } from "@/components/Primitives";

export default function CTA() {
  return (
    <section className="cta-band">
      <div className="container">
        <Reveal className="inner">
          <h2>
            Let&apos;s power your
            <br />
            <span>next project.</span>
          </h2>
          <p>
            Tell us what you&apos;re building. Our engineers will scope the right
            low or medium voltage solution and prepare a tailored quote.
          </p>
          <div className="actions">
            <Link href="/contact" className="btn btn-primary">Sales Request</Link>
            <Link href="/locations" className="btn btn-ghost">Visit Our Facilities</Link>
          </div>
        </Reveal>
      </div>
      <style jsx>{`
        .cta-band {
          position: relative;
          padding: clamp(5rem, 14vh, 10rem) 0;
          background: radial-gradient(
              120% 120% at 50% 0%,
              rgba(232, 114, 42, 0.16),
              transparent 55%
            ),
            var(--bg);
          text-align: center;
          overflow: hidden;
        }
        .inner {
          max-width: 760px;
          margin: 0 auto;
        }
        h2 {
          font-size: clamp(2rem, 5.5vw, 4.2rem);
          text-transform: uppercase;
        }
        h2 span {
          color: var(--orange);
        }
        p {
          color: var(--text-dim);
          max-width: 52ch;
          margin: 1.4rem auto 2.2rem;
          font-size: 1.05rem;
        }
        .actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
      `}</style>
    </section>
  );
}
