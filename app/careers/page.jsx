"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { Reveal } from "@/components/Primitives";
import { values, brand, formEmail } from "@/lib/content";

const culture = [
  { t: "Engineer real impact", d: "Your work energises hospitals, communities and industries across the region — not slideware." },
  { t: "Learn from global leaders", d: "Work alongside ABB, Schneider Electric and Lucy Electric technology and standards every day." },
  { t: "Grow with us", d: "From two advanced facilities and a fast-growing portfolio, there's room to build a long career." },
];

// Decorative circuit-board schematic that bleeds into the application card
// from the right: a vertical bus feeding orthogonal taps (with 45° chamfers)
// into junction vias and two components, with travelling current and radar
// ring-pulses. Purely ornamental (aria-hidden), masked to fade under the form.
const AP_BUS = "M556 30 V486";
const AP_TAPS = [
  "M556 96 H452",
  "M556 170 H432 L404 198 V252",
  "M556 256 H488",
  "M556 338 H440",
  "M556 412 H452 L428 388 V346",
  "M556 132 H664",
  "M556 300 H664",
];
const AP_VIAS = [
  { x: 452, y: 96 },
  { x: 404, y: 252 },
  { x: 488, y: 256 },
  { x: 440, y: 338 },
  { x: 428, y: 346 },
  { x: 556, y: 30, ring: true },
  { x: 556, y: 486 },
  { x: 556, y: 256, ring: true },
];
const AP_CHIPS = [
  { x: 482, y: 85, w: 44, h: 22 },
  { x: 470, y: 327, w: 42, h: 24 },
];

export default function CareersPage() {
  const [status, setStatus] = useState("idle"); // idle | error | submitting | sent
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const err = {};
    if (!data.get("name")?.trim()) err.name = "Please enter your name";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.get("email") || "")) err.email = "Enter a valid email";
    const cv = data.get("cv");
    if (!cv || !cv.name) err.cv = "Please attach your CV";
    setErrors(err);
    if (Object.keys(err).length) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      // FormSubmit's AJAX endpoint can't carry file attachments, so we post the
      // multipart form to the standard endpoint straight from the browser (a
      // real Referer is required — server-side fetch strips it). The response is
      // opaque under no-cors, so we treat a completed request as success.
      data.append("_subject", `New job application — ${data.get("name")}`);
      data.append("_template", "table");
      data.append("_captcha", "false");
      await fetch(`https://formsubmit.co/${formEmail}`, {
        method: "POST",
        mode: "no-cors",
        body: data,
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <PageShell>
      <PageHero
        eyebrow="Careers"
        title="Power your"
        accent="career"
        lead="We're a team of engineers and makers building reliable electrical solutions to international standards. If precision and progress drive you, you'll fit right in."
        img="/img/facility-1.webp"
      />

      <section className="careers">
        <div className="container">
          <div className="culture">
            {culture.map((c, i) => (
              <Reveal as="div" key={c.t} delay={i * 90}>
                <div className="cc">
                  <span className="cn">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="values sec-head">
              <span className="eyebrow">How we work</span>
              <div className="vlist">
                {values.map((v) => (
                  <span className="vchip" key={v.title}>{v.title}</span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Application form */}
          <Reveal>
            <div className="apply">
              <div className="apply-main">
              <div className="apply-head">
                <span className="eyebrow">Join the team</span>
                <h2 className="section-title">Apply now</h2>
                <p>Send us your details and CV. When a role that fits opens up, you&apos;ll be first to hear from us.</p>
              </div>

              {status === "sent" ? (
                <div className="sent">
                  <div className="check">✓</div>
                  <h3>Application received</h3>
                  <p>Thank you{fileName ? `, we've got "${fileName}"` : ""}. Our team will review it and get back to you. For anything urgent, call <a href={`tel:${brand.phone}`}>{brand.phoneDisplay}</a>.</p>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <div className="row2">
                    <label className="field">
                      <span>Full name *</span>
                      <input type="text" name="name" autoComplete="name" />
                      {errors.name && <em className="err">{errors.name}</em>}
                    </label>
                    <label className="field">
                      <span>Email *</span>
                      <input type="email" name="email" autoComplete="email" />
                      {errors.email && <em className="err">{errors.email}</em>}
                    </label>
                  </div>
                  <div className="row2">
                    <label className="field">
                      <span>Phone</span>
                      <input type="tel" name="phone" autoComplete="tel" />
                    </label>
                    <label className="field">
                      <span>Position of interest</span>
                      <input type="text" name="position" placeholder="e.g. Panel Engineer" />
                    </label>
                  </div>
                  <label className="field">
                    <span>Message</span>
                    <textarea name="message" rows={4} placeholder="Tell us about yourself…" />
                  </label>

                  <label className="field">
                    <span>Upload CV * (PDF, DOC)</span>
                    <div className="file">
                      <input
                        type="file"
                        name="cv"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                      />
                      <span className="file-btn">Choose file</span>
                      <span className="file-name">{fileName || "No file chosen"}</span>
                    </div>
                    {errors.cv && <em className="err">{errors.cv}</em>}
                  </label>

                  <button type="submit" className="btn btn-primary submit" disabled={status === "submitting"}>
                    {status === "submitting" ? "Sending…" : "Submit Application"}
                  </button>
                  {status === "error" && <p className="form-err" role="alert">Please fix the highlighted fields.</p>}
                </form>
              )}
              </div>

              <div className="apply-fx" aria-hidden="true">
                <span className="ap-glow" />
                <svg className="ap-svg" viewBox="0 0 640 520" fill="none" preserveAspectRatio="xMaxYMid slice">
                  <path className="ap-trace" d={AP_BUS} />
                  {AP_TAPS.map((d, i) => (
                    <path className="ap-trace" d={d} key={`t${i}`} />
                  ))}
                  {AP_CHIPS.map((c, i) => (
                    <rect className="ap-chip" x={c.x} y={c.y} width={c.w} height={c.h} rx="4" key={`c${i}`} />
                  ))}
                  <path className="ap-spark" d={AP_BUS} pathLength="1" style={{ "--d": "5s" }} />
                  {[1, 3, 5].map((i) => (
                    <path className="ap-spark" d={AP_TAPS[i]} pathLength="1" key={`s${i}`} style={{ "--d": `${3.2 + i * 0.4}s` }} />
                  ))}
                  {AP_VIAS.map((n, i) => (
                    <g transform={`translate(${n.x} ${n.y})`} key={`v${i}`}>
                      {n.ring && <circle className="ap-ring" r="9" style={{ "--rd": `${3 + i * 0.35}s` }} />}
                      <circle className="ap-pad" r="4.6" />
                      <circle className="ap-via" r="2.2" />
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <style jsx>{`
        .careers { padding: clamp(3.5rem, 9vh, 6rem) 0 clamp(5rem, 12vh, 8rem); }
        .culture { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.3rem; }
        .cc { height: 100%; padding: 2rem 1.8rem; border: 1px solid var(--line); border-radius: 16px; background: var(--bg-2); transition: all 0.35s var(--ease); }
        .cc:hover { border-color: rgba(232, 114, 42, 0.5); transform: translateY(-5px); }
        .cn { color: var(--orange); font-family: var(--font-head); font-weight: 700; }
        .cc h3 { font-size: 1.3rem; text-transform: uppercase; margin: 0.9rem 0 0.6rem; }
        .cc p { color: var(--text-dim); font-size: 0.92rem; }
        .values { margin: 3rem 0; }
        .vlist { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 1rem; }
        .vchip { padding: 0.6rem 1.1rem; border: 1px solid var(--line); border-radius: 999px; font-size: 0.85rem; color: var(--text); background: var(--bg-2); }
        .apply {
          position: relative; overflow: hidden;
          padding: clamp(2rem, 5vw, 3.5rem);
          border: 1px solid var(--line); border-radius: 20px;
          background: radial-gradient(130% 140% at 100% 0%, rgba(232,114,42,.14), transparent 55%), var(--bg-2);
        }
        .apply-main { position: relative; z-index: 2; max-width: 640px; }
        /* decorative energy filaments — bleeds into the card, no separate box */
        .apply-fx {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 48%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 48%);
        }
        .ap-glow { position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(48% 62% at 86% 16%, rgba(232,114,42,.18), transparent 70%); }
        .ap-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
        .ap-trace { stroke: rgba(232,114,42,.3); stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
        .ap-chip { fill: rgba(232,114,42,.05); stroke: rgba(232,114,42,.32); stroke-width: 1.2; }
        .ap-pad { fill: none; stroke: rgba(232,114,42,.5); stroke-width: 1.3; }
        .ap-via { fill: var(--orange); filter: drop-shadow(0 0 4px rgba(232,114,42,.9)); }
        .ap-spark { stroke: #ffcf9e; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
          stroke-dasharray: 0.12 0.88; stroke-dashoffset: 1; animation: apFlow var(--d, 3s) linear infinite;
          filter: drop-shadow(0 0 4px rgba(232,114,42,.7)); }
        .ap-ring { fill: none; stroke: rgba(232,114,42,.65); stroke-width: 1.4;
          transform-box: fill-box; transform-origin: center; animation: apRing var(--rd, 3s) ease-out infinite; }
        @keyframes apFlow { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes apRing { 0% { transform: scale(.3); opacity: .85; } 100% { transform: scale(2.8); opacity: 0; } }
        @media (max-width: 920px) {
          .apply-main { max-width: none; }
          .apply-fx { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ap-spark, .ap-ring { animation: none; opacity: 0; }
        }
        .apply-head { margin-bottom: 2rem; }
        .apply-head h2 { margin: 0.8rem 0 0.7rem; }
        .apply-head p { color: var(--text-dim); max-width: 56ch; }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .field { display: block; margin-bottom: 1.1rem; }
        .field span { display: block; font-size: 0.8rem; color: var(--text-dim); margin-bottom: 0.5rem; }
        .field input,
        .field textarea {
          width: 100%; background: var(--bg); border: 1px solid var(--line); border-radius: 11px;
          padding: 0.85rem 1rem; color: #fff; font-family: var(--font-body); font-size: 0.95rem;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .field input:focus,
        .field textarea:focus { outline: none; border-color: var(--orange); box-shadow: 0 0 0 3px rgba(232,114,42,.18); }
        .field textarea { resize: vertical; }
        .err { display: block; color: #ff6b5e; font-size: 0.78rem; font-style: normal; margin-top: 0.4rem; }
        /* file input */
        .file { position: relative; display: flex; align-items: center; gap: 0.9rem; border: 1px dashed var(--line); border-radius: 11px; padding: 0.7rem 0.9rem; background: var(--bg); }
        .file input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }
        .file-btn { background: rgba(232,114,42,.15); color: var(--orange); border: 1px solid rgba(232,114,42,.4); padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; white-space: nowrap; }
        .file-name { color: var(--text-faint); font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .submit { margin-top: 0.6rem; }
        .form-err { color: #ff6b5e; font-size: 0.85rem; margin-top: 0.8rem; }
        .sent { text-align: center; padding: 2.5rem 1rem; }
        .check { width: 60px; height: 60px; border-radius: 50%; background: var(--orange); color: #fff; display: grid; place-items: center; font-size: 1.6rem; margin: 0 auto 1.2rem; box-shadow: 0 0 30px rgba(232,114,42,.5); }
        .sent h3 { font-size: 1.6rem; text-transform: uppercase; }
        .sent p { color: var(--text-dim); margin-top: 0.7rem; }
        .sent a { color: var(--orange); }
        @media (max-width: 850px) {
          .culture { grid-template-columns: 1fr; }
          .row2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </PageShell>
  );
}
