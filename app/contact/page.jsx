"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { Reveal } from "@/components/Primitives";
import { brand, locations, productLines, formEmail } from "@/lib/content";

export default function ContactPage() {
  const [status, setStatus] = useState("idle"); // idle | error | submitting | sent
  const [errors, setErrors] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const err = {};
    if (!data.name?.trim()) err.name = "Please enter your name";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email || "")) err.email = "Enter a valid email";
    if (!data.message?.trim()) err.message = "Tell us about your project";
    setErrors(err);
    if (Object.keys(err).length) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      // Post straight to FormSubmit from the browser so a real Referer is
      // present — server-side fetch (Vercel/undici) strips it and FormSubmit
      // then rejects the request.
      const res = await fetch(`https://formsubmit.co/ajax/${formEmail}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New quotation request — ${data.name}`,
          _template: "table",
          Name: data.name,
          Company: data.company || "-",
          Email: data.email,
          Phone: data.phone || "-",
          "Area of interest": data.interest || "-",
          Message: data.message,
        }),
      });
      const out = await res.json().catch(() => ({}));
      setStatus(out.success === "true" || out.success === true ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <PageShell>
      <PageHero
        eyebrow="Contact"
        title="Let's talk"
        accent="power"
        lead="Send us your project details and our engineers will scope the right low or medium voltage solution and prepare a tailored quotation."
      />

      <section className="contact">
        <div className="container grid">
          {/* Form */}
          <Reveal as="div" className="form-col">
            {status === "sent" ? (
              <div className="sent">
                <div className="check">✓</div>
                <h3>Thank you</h3>
                <p>
                  Your request has been received. Our team will get back to you
                  shortly. For anything urgent, call us at{" "}
                  <a href={`tel:${brand.phone}`}>{brand.phoneDisplay}</a>.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <div className="row2">
                  <Field name="name" label="Full name *" error={errors.name} />
                  <Field name="company" label="Company" />
                </div>
                <div className="row2">
                  <Field name="email" label="Email *" type="email" error={errors.email} />
                  <Field name="phone" label="Phone" type="tel" />
                </div>
                <label className="field">
                  <span>Area of interest</span>
                  <select name="interest" defaultValue="">
                    <option value="" disabled>Select a line…</option>
                    {productLines.map((l) => (
                      <option key={l.key} value={l.title}>{l.title}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label className="field">
                  <span>Project details *</span>
                  <textarea name="message" rows={5} placeholder="Tell us what you're building…" />
                  {errors.message && <em className="err">{errors.message}</em>}
                </label>
                <button type="submit" className="btn btn-primary submit" disabled={status === "submitting"}>
                  {status === "submitting" ? "Sending…" : "Send Quotation Request"}
                </button>
                {status === "error" && (
                  <p className="form-err" role="alert">Please fix the highlighted fields.</p>
                )}
              </form>
            )}
          </Reveal>

          {/* Info */}
          <Reveal as="aside" className="info-col" delay={120}>
            <div className="info-block">
              <span className="eyebrow">Call us</span>
              <a href={`tel:${brand.phone}`} className="phone">{brand.phoneDisplay}</a>
            </div>
            <div className="info-block">
              <span className="eyebrow">Visit us</span>
              {locations.map((l) => (
                <a key={l.name} href={l.maps} target="_blank" rel="noreferrer" className="loc">
                  <strong>{l.name}</strong>
                  <span>{l.address}</span>
                </a>
              ))}
            </div>
            <div className="info-block">
              <span className="eyebrow">Follow</span>
              <div className="socials">
                <a href={brand.facebook} target="_blank" rel="noreferrer">Facebook</a>
                <a href={brand.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <style jsx>{`
        .contact { padding: clamp(3.5rem, 9vh, 6rem) 0 clamp(5rem, 12vh, 8rem); }
        .grid { display: grid; grid-template-columns: 1.4fr 0.9fr; gap: clamp(2rem, 5vw, 4rem); }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        :global(.field) { display: block; margin-bottom: 1.1rem; }
        :global(.field span) { display: block; font-size: 0.8rem; color: var(--text-dim); margin-bottom: 0.5rem; letter-spacing: 0.02em; }
        :global(.field input),
        :global(.field select),
        :global(.field textarea) {
          width: 100%;
          background: var(--bg-2);
          border: 1px solid var(--line);
          border-radius: 11px;
          padding: 0.85rem 1rem;
          color: #fff;
          font-family: var(--font-body);
          font-size: 0.95rem;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        :global(.field input:focus),
        :global(.field select:focus),
        :global(.field textarea:focus) {
          outline: none;
          border-color: var(--orange);
          box-shadow: 0 0 0 3px rgba(241, 103, 34, 0.18);
        }
        :global(.field textarea) { resize: vertical; }
        :global(.field select option) { background: var(--bg-2); color: #fff; }
        :global(.err) { display: block; color: #ff6b5e; font-size: 0.78rem; font-style: normal; margin-top: 0.4rem; }
        .submit { margin-top: 0.6rem; width: 100%; justify-content: center; }
        .form-err { color: #ff6b5e; font-size: 0.85rem; margin-top: 0.8rem; }
        .sent { text-align: center; padding: 3rem 1rem; border: 1px solid var(--line); border-radius: 18px; background: var(--bg-2); }
        .check { width: 60px; height: 60px; border-radius: 50%; background: var(--orange); color: #fff; display: grid; place-items: center; font-size: 1.6rem; margin: 0 auto 1.2rem; box-shadow: 0 0 30px rgba(241,103,34,.5); }
        .sent h3 { font-size: 1.8rem; text-transform: uppercase; }
        .sent p { color: var(--text-dim); margin-top: 0.8rem; }
        .sent a { color: var(--orange); }
        .info-block { padding-bottom: 1.8rem; margin-bottom: 1.8rem; border-bottom: 1px solid var(--line); }
        .phone { display: block; font-family: var(--font-head); font-weight: 800; font-size: clamp(1.5rem, 3.5vw, 2.2rem); margin-top: 0.7rem; }
        .phone:hover { color: var(--orange); }
        .loc { display: block; margin-top: 1rem; }
        .loc strong { display: block; color: #fff; font-size: 0.95rem; }
        .loc span { font-size: 0.85rem; color: var(--text-faint); }
        .loc:hover strong { color: var(--orange); }
        .socials { display: flex; gap: 1.2rem; margin-top: 0.7rem; }
        .socials a { color: var(--text-dim); }
        .socials a:hover { color: var(--orange); }
        @media (max-width: 860px) {
          .grid { grid-template-columns: 1fr; }
          .row2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </PageShell>
  );
}

function Field({ name, label, type = "text", error }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} name={name} autoComplete={name} />
      {error && <em className="err">{error}</em>}
    </label>
  );
}
