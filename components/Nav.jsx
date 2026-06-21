"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { nav, brand } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => (document.documentElement.style.overflow = "");
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="nav-inner">
          <Link href="/" className="brand" aria-label="Powerline home">
            <img src="/img/logo-white.webp" alt="Powerline" className="brand-logo" />
          </Link>

          <nav className="links" aria-label="Primary">
            {nav.map((item) => (
              <div key={item.label} className="link-wrap">
                <Link href={item.href} className="link">
                  {item.label}
                </Link>
                {item.children && (
                  <div className="dropdown">
                    {item.children.map((c) => (
                      <div key={c.href} className="drop-item">
                        <Link href={c.href} className="drop-link">
                          {c.label}
                          {c.children && <span className="drop-arrow">›</span>}
                        </Link>
                        {c.children && (
                          <div className="sub-dropdown">
                            {c.children.map((g) => (
                              <Link key={g.href} href={g.href} className="drop-link">
                                {g.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="actions">
            <a href={`tel:${brand.phone}`} className="btn btn-ghost call hide-mobile" aria-label={`Call Powerline on ${brand.phoneDisplay}`}>
              Call Us
            </a>
            <Link href="/contact" className="btn btn-primary cta hide-mobile">
              Request Quotation
            </Link>
            <button
              className={`burger ${open ? "open" : ""}`}
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / overlay menu */}
      <div className={`overlay ${open ? "show" : ""}`} role="dialog" aria-modal="true">
        <div className="overlay-inner">
          {nav.map((item) => (
            <div key={item.label} className="ov-group">
              <Link href={item.href} className="ov-link" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
              {item.children && (
                <div className="ov-children">
                  {item.children.map((c) => (
                    <div key={c.href} className="ov-sub">
                      <Link href={c.href} className="ov-child" onClick={() => setOpen(false)}>
                        {c.label}
                      </Link>
                      {c.children && (
                        <div className="ov-grand">
                          {c.children.map((g) => (
                            <Link key={g.href} href={g.href} className="ov-gchild" onClick={() => setOpen(false)}>
                              {g.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a href={`tel:${brand.phone}`} className="ov-phone">
            {brand.phoneDisplay}
          </a>
        </div>
      </div>

      <style jsx>{`
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: var(--z-nav);
          transition: background 0.4s var(--ease), backdrop-filter 0.4s,
            border-color 0.4s, padding 0.4s var(--ease);
          border-bottom: 1px solid transparent;
          padding: 0.6rem 0;
        }
        .nav.is-scrolled {
          background: rgba(5, 5, 6, 0.72);
          backdrop-filter: blur(14px);
          border-bottom-color: var(--line);
        }
        .nav-inner {
          max-width: var(--container);
          margin: 0 auto;
          padding: 0 var(--pad);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .brand img {
          height: 34px;
          width: auto;
          transition: height 0.4s var(--ease);
        }
        .is-scrolled .brand img {
          height: 30px;
        }
        .links {
          display: flex;
          align-items: center;
          gap: clamp(0.6rem, 1.4vw, 1.8rem);
        }
        .link-wrap {
          position: relative;
        }
        .link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 0.4rem;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: var(--text-dim);
          transition: color 0.25s;
        }
        .link:hover {
          color: #fff;
        }
        .dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 230px;
          padding: 0.5rem;
          background: rgba(12, 12, 14, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid var(--line);
          border-radius: 14px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(8px);
          transition: all 0.28s var(--ease);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
        }
        .link-wrap:hover .dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateY(6px);
        }
        /* second-level (products) flyout */
        .drop-item {
          position: relative;
        }
        .drop-item :global(.drop-link) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .drop-arrow {
          color: var(--text-faint);
          font-size: 1.1rem;
          line-height: 1;
        }
        .sub-dropdown {
          position: absolute;
          top: -0.5rem;
          left: 100%;
          margin-left: 0.4rem;
          min-width: 215px;
          padding: 0.5rem;
          background: rgba(12, 12, 14, 0.97);
          backdrop-filter: blur(16px);
          border: 1px solid var(--line);
          border-radius: 14px;
          opacity: 0;
          visibility: hidden;
          transform: translateX(8px);
          transition: all 0.25s var(--ease);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
        }
        .drop-item:hover .sub-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }
        .drop-item:hover > :global(.drop-link),
        .drop-item:hover > :global(.drop-link) .drop-arrow {
          color: var(--orange);
          background: rgba(241, 103, 34, 0.12);
        }
        .actions {
          display: flex;
          align-items: center;
          gap: 1.1rem;
        }
        .call {
          padding: 0.7rem 1.2rem;
          font-size: 0.82rem;
        }
        .cta {
          padding: 0.7rem 1.3rem;
          font-size: 0.82rem;
        }
        .burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          width: 30px;
          height: 30px;
          justify-content: center;
          align-items: center;
          background: none;
          border: none;
          padding: 0;
        }
        .burger span {
          width: 24px;
          height: 2px;
          background: #fff;
          transition: transform 0.3s var(--ease), opacity 0.3s;
        }
        .burger.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .burger.open span:nth-child(2) {
          opacity: 0;
        }
        .burger.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .overlay {
          position: fixed;
          inset: 0;
          z-index: 90;
          background: rgba(5, 5, 6, 0.98);
          backdrop-filter: blur(20px);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.4s var(--ease), visibility 0.4s;
        }
        .overlay.show {
          opacity: 1;
          visibility: visible;
        }
        .overlay-inner {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.4rem;
          padding: 6rem clamp(1.5rem, 8vw, 5rem) 3rem;
          overflow-y: auto;
        }
        .ov-link {
          font-family: var(--font-head);
          font-weight: 800;
          font-size: clamp(1.8rem, 7vw, 3rem);
          text-transform: uppercase;
          color: #fff;
          letter-spacing: -0.01em;
        }
        .ov-children {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin: 0.5rem 0 0.9rem;
        }
        .ov-child {
          font-size: 1.02rem;
          font-weight: 600;
          color: var(--text);
        }
        .ov-child:hover {
          color: var(--orange);
        }
        .ov-grand {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem 1.1rem;
          margin: 0.4rem 0 0.2rem 1rem;
        }
        .ov-gchild {
          font-size: 0.85rem;
          color: var(--text-dim);
        }
        .ov-gchild:hover {
          color: var(--orange);
        }
        .ov-phone {
          margin-top: 1.5rem;
          color: var(--orange);
          font-weight: 600;
          font-size: 1.1rem;
        }

        @media (max-width: 1024px) {
          .links,
          .call,
          .cta {
            display: none;
          }
          .burger {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
