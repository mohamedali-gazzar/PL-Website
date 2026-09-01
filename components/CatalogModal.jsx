"use client";

import { useEffect, useRef, useState } from "react";
import { Field } from "@/components/Primitives";
import { isValidEmail, formEmail } from "@/lib/content";
import { track } from "@/lib/analytics";

const meta = (c) => ({
  product_name: c.productName,
  product_slug: c.slug,
  catalog_name: c.title,
  page_path: typeof location !== "undefined" ? location.pathname : "",
});

function readUtm() {
  const u = {};
  try {
    const q = new URLSearchParams(location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
      const v = q.get(k);
      if (v) u[k] = v;
    });
  } catch {
    /* no-op */
  }
  return u;
}

/**
 * Short lead form shown only after the visitor clicks "Unlock Full Catalogue".
 * On success it saves the lead to the CRM's dedicated catalogue store (source
 * "product_catalog") — no email is sent — grants the access cookie, and calls
 * onSuccess() so the catalogue unlocks in place — no reload. Product context is
 * captured automatically (never asked).
 */
export default function CatalogModal({ open, onClose, onSuccess, catalog }) {
  const [status, setStatus] = useState("idle"); // idle | invalid | submitting | failed
  const [errors, setErrors] = useState({});
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => dialogRef.current?.querySelector("input")?.focus(), 80);
    track("catalog_form_start", meta(catalog));
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return; // guard against double-submit
    const data = Object.fromEntries(new FormData(e.currentTarget));

    const err = {};
    if (!data.name?.trim()) err.name = "Please enter your name";
    if (!data.company?.trim()) err.company = "Enter your company";
    if (!isValidEmail(data.email)) err.email = "Enter a valid work email";
    if (!data.phone?.trim()) err.phone = "Enter your phone number";
    if (!data.country?.trim()) err.country = "Enter your country";
    setErrors(err);
    if (Object.keys(err).length) {
      setStatus("invalid");
      return;
    }

    setStatus("submitting");
    track("catalog_form_submit", meta(catalog));
    const engineer = data.engineer === "on";
    const payload = {
      slug: catalog.slug,
      productName: catalog.productName,
      catalogName: catalog.title,
      name: data.name.trim(),
      company: data.company.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      country: data.country.trim(),
      engineerContact: engineer,
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
      utm: readUtm(),
    };

    // Save the lead to the CRM catalogue store + grant access. This persistent
    // record is the only destination — catalogue submissions send no email.
    // Unlock only if this succeeds.
    try {
      const res = await fetch("/api/catalog/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) {
        if (out.errors) {
          setErrors(out.errors);
          setStatus("invalid");
        } else {
          setStatus("failed");
        }
        return;
      }
      track("catalog_access", meta(catalog));
      if (engineer) track("engineer_contact_requested", meta(catalog));
      onSuccess();
    } catch {
      setStatus("failed");
    }
  };

  return (
    <div className="ov" role="presentation" onMouseDown={onClose}>
      <div
        className="dlg"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cat-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="x" type="button" aria-label="Close" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <span className="eyebrow">Technical Catalogue</span>
        <h3 id="cat-modal-title">
          View the <em>{catalog.productName}</em> catalogue
        </h3>
        <p className="sub">
          Enter your details to view the full technical catalogue and detailed specifications.
        </p>

        <form onSubmit={onSubmit} noValidate>
          <div className="row2">
            <Field name="name" label="Full name *" autoComplete="name" error={errors.name} />
            <Field name="company" label="Company name *" autoComplete="organization" error={errors.company} />
          </div>
          <div className="row2">
            <Field name="email" label="Work email *" type="email" error={errors.email} />
            <Field name="phone" label="Phone number *" type="tel" autoComplete="tel" error={errors.phone} />
          </div>
          <Field name="country" label="Country *" autoComplete="country-name" error={errors.country} />

          <label className="check">
            <input type="checkbox" name="engineer" defaultChecked />
            <span>I consent to receive offers and updates on products, service and events from Powerline.</span>
          </label>

          <button type="submit" className="btn btn-primary submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Opening…" : "View Catalogue"}
          </button>

          {status === "invalid" && (
            <p className="form-err" role="alert">Please fix the highlighted fields.</p>
          )}
          {status === "failed" && (
            <p className="form-err" role="alert">
              Sorry, we couldn&rsquo;t open the catalogue just now. Please try again, or email{" "}
              <a href={`mailto:${formEmail}`}>{formEmail}</a>.
            </p>
          )}
          <p className="tiny">
            Your details are used only to share the catalogue and follow up on your enquiry.
          </p>
        </form>
      </div>

      <style jsx>{`
        .ov {
          position: fixed;
          inset: 0;
          z-index: var(--z-overlay);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(0.9rem, 3vw, 2rem);
          background: rgba(3, 3, 4, 0.62);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          animation: ovIn 0.3s var(--ease);
        }
        @keyframes ovIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .dlg {
          position: relative;
          width: min(38rem, 100%);
          max-height: min(92vh, 100%);
          overflow-y: auto;
          background: radial-gradient(130% 130% at 100% 0%, rgba(232, 114, 42, 0.14), transparent 55%),
            var(--bg-3);
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: clamp(1.4rem, 4vw, 2.4rem);
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.7);
          animation: dlgIn 0.4s var(--ease);
        }
        @keyframes dlgIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: none; }
        }
        .x {
          position: absolute;
          top: 0.9rem;
          right: 0.9rem;
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--line);
          color: #fff;
          transition: color 0.25s, border-color 0.25s, transform 0.35s var(--ease);
        }
        .x:hover {
          color: var(--orange);
          border-color: rgba(232, 114, 42, 0.5);
          transform: rotate(90deg);
        }
        h3 {
          font-family: var(--font-head);
          font-weight: 800;
          text-transform: uppercase;
          font-size: clamp(1.3rem, 3.4vw, 1.8rem);
          line-height: 1.05;
          color: #fff;
          margin: 0.8rem 0 0.6rem;
          max-width: 22ch;
        }
        h3 em {
          font-style: normal;
          color: var(--orange);
        }
        .sub {
          color: var(--text-dim);
          font-size: 0.95rem;
          line-height: 1.55;
          margin: 0 0 1.5rem;
          max-width: 46ch;
        }
        .row2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 1rem;
        }
        .check {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          margin: 0.3rem 0 1.3rem;
          color: var(--text-dim);
          font-size: 0.9rem;
          line-height: 1.45;
          cursor: pointer;
        }
        .check input {
          margin-top: 0.15rem;
          width: 1.05rem;
          height: 1.05rem;
          accent-color: var(--orange);
          flex: 0 0 auto;
        }
        .submit {
          width: 100%;
          justify-content: center;
        }
        .tiny {
          margin: 0.9rem 0 0;
          font-size: 0.74rem;
          color: var(--text-faint);
          line-height: 1.5;
        }
        @media (max-width: 560px) {
          .row2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
