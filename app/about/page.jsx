import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { Reveal, CountUp } from "@/components/Primitives";
import { aboutCopy, heroStats, locations, brand } from "@/lib/content";
import CoreValues from "@/components/CoreValues";
import AboutStory from "@/components/AboutStory";

export const metadata = {
  title: "Who We Are — Powerline",
  description: aboutCopy.lead,
};

// Egypt outline (reused from the network map) for the Footprint blueprint.
const EGYPT =
  "M40 27 L190 43 L382 55 L418 35 L520 30 L554 49 L662 60 L695 45 L742 188 L698 316 L583 180 L572 148 L558 193 L663 362 L697 452 L742 533 L886 772 L29 772 L29 226 Z";
// facility pins on the 940×820 viewBox — geographically true to each site.
// Cairo HQ sits at (478,144) on this projection (matches the Our Network map).
//  1 Sales Office — Cairo, Heliopolis (NE of central Cairo)
//  2 MV Factory — 10th of Ramadan City (Al-Sharqia, ~NE of Cairo toward Suez)
//  3 LV & CSS Factory — 10th of Ramadan City (same cluster, Area A5)
const PINS = [
  { x: 486, y: 142 },
  { x: 513, y: 126 },
  { x: 528, y: 138 },
];

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero eyebrow="About Powerline" title="Who We" accent="Are" img="/img/facility-1.webp" />

      {/* ════ THE POWERLINE STORY — cinematic editorial opening ════ */}
      <AboutStory />

      {/* ════ BY THE NUMBERS — instrument strip ════ */}
      <section className="abn">
        <div className="container">
          <div className="abn-stats">
            {heroStats.map((s, i) => (
              <Reveal as="div" className="abn-stat" key={s.label} delay={i * 80}>
                <div className="abn-stat-v">
                  <CountUp value={s.value} suffix={s.suffix} group={!s.plain} />
                </div>
                <div className="abn-stat-l">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ MISSION & VISION — two forces, one seam ════ */}
      <section className="mv2">
        <div className="container">
          <div className="mv2-grid">
            <Reveal as="div" className="mv2-col mission">
              <span className="mv2-ghost" aria-hidden="true">01</span>
              <span className="mv2-tag">Our Mission</span>
              <span className="mv2-now">What drives us today</span>
              <p>{brand.mission}</p>
              <svg className="mv2-icon" viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 21h18" /><path d="M5 21V9l7-5 7 5v12" /><path d="M9 21v-6h6v6" />
              </svg>
            </Reveal>

            <div className="mv2-seam" aria-hidden="true">
              <span className="mv2-seam-line" />
              <span className="mv2-seam-node" />
            </div>

            <Reveal as="div" className="mv2-col vision" delay={160}>
              <span className="mv2-ghost" aria-hidden="true">02</span>
              <span className="mv2-tag">Our Vision</span>
              <span className="mv2-now">Where we are headed</span>
              <p>{brand.vision}</p>
              <svg className="mv2-icon" viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /><path d="M12 8l2.2 4.2L12 16l-2.2-3.8L12 8z" />
              </svg>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════ CORE VALUES — radial hub network (its own component) ════ */}
      <CoreValues />

      {/* ════ TRUSTED PARTNERS — global alliance ════ */}
      <section className="tp">
        <div className="container">
          <Reveal>
            <div className="tp-head">
              <span className="eyebrow">Trusted Partners</span>
              <h2>
                We are the <span className="kw">trusted partners</span> to{" "}
                <span className="kw">global leaders</span> — offering{" "}
                <span className="kw">technical expertise</span>,{" "}
                <span className="kw">product support</span>, and{" "}
                <span className="kw">performance optimization</span> to keep power
                systems running smoothly.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="tp-alliance">
              <span className="tp-wire left" aria-hidden="true" />
              <div className="tp-plate">
                <span className="tp-sheen" aria-hidden="true" />
                <img src="/img/abb-schneider.webp" alt="ABB and Schneider Electric" loading="lazy" decoding="async" />
              </div>
              <span className="tp-wire right" aria-hidden="true" />
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p className="tp-caption">
              World-class technology partners — integrated and supported on the ground.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════ OUR FOOTPRINT — facilities blueprint ════ */}
      <section className="fp">
        <div className="container">
          <div className="fp-grid">
            <Reveal as="div" className="fp-map">
              <svg viewBox="0 0 940 820" className="fp-svg" aria-label="Powerline facilities across Egypt">
                <defs>
                  <pattern id="fpGrid" width="46" height="46" patternUnits="userSpaceOnUse">
                    <path d="M46 0H0V46" fill="none" stroke="rgba(232,114,42,0.10)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="940" height="820" fill="url(#fpGrid)" />
                <path className="fp-land" d={EGYPT} fill="rgba(232,114,42,0.04)" stroke="rgba(232,114,42,0.55)" strokeWidth="2" />
                {/* connectors from the cluster */}
                {PINS.map((p, i) =>
                  i === 0 ? null : (
                    <line key={`l${i}`} className="fp-conn" x1={PINS[0].x} y1={PINS[0].y} x2={p.x} y2={p.y} stroke="rgba(232,114,42,0.5)" strokeWidth="1.5" strokeDasharray="4 5" />
                  )
                )}
                {PINS.map((p, i) => (
                  <g key={`p${i}`} className="fp-pin" transform={`translate(${p.x} ${p.y})`}>
                    <circle className="fp-ping" r="16" />
                    <circle r="6" fill="var(--orange)" />
                    <text x="0" y="-14" textAnchor="middle" className="fp-pin-n">{i + 1}</text>
                  </g>
                ))}
              </svg>
            </Reveal>

            <div className="fp-side">
              <Reveal>
                <span className="eyebrow">Our Footprint</span>
                <h2 className="section-title fp-title">Built from two advanced facilities</h2>
              </Reveal>
              <Reveal as="div" className="fp-list">
                {locations.map((l, i) => (
                  <a key={l.name} className="fp-item" href={l.maps} target="_blank" rel="noreferrer">
                    <span className="fp-item-n">{String(i + 1).padStart(2, "0")}</span>
                    <span className="fp-item-text">
                      <strong>{l.name}</strong>
                      <span>{l.address}</span>
                    </span>
                  </a>
                ))}
              </Reveal>
              <Reveal delay={120}>
                <p className="fp-note">Engineering, manufacturing and service across Egypt.</p>
                <Link href="/locations" className="btn btn-ghost">Find us →</Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        /* ───────── BY THE NUMBERS (instrument strip) ───────── */
        .abn { padding: clamp(3rem,8vh,5rem) 0; background: var(--bg); border-bottom:1px solid var(--line); }
        .abn-stats { display:flex; flex-wrap:wrap; gap:0; }
        .abn-stat { flex:1 1 160px; padding:0 1.6rem; border-right:1px solid var(--line); }
        .abn-stat:first-child{ padding-left:0; }
        .abn-stat:last-child{ border-right:none; }
        .abn-stat-v { font-family:var(--font-head); font-weight:800; font-size:clamp(1.9rem,3.6vw,3rem); color:#fff; line-height:1; }
        .abn-stat-l { color:var(--text-faint); text-transform:uppercase; font-size:.72rem; letter-spacing:.08em; margin-top:.6rem; }

        /* ───────── MISSION & VISION ───────── */
        .mv2 { padding: clamp(4rem,11vh,8rem) 0; background: var(--bg-2); }
        .mv2-grid { display:grid; grid-template-columns: 1fr 2px 1fr; gap: clamp(1.5rem,5vw,4.5rem); align-items:stretch; }
        .mv2-col { position:relative; display:flex; flex-direction:column; padding: clamp(1.5rem,3vw,2.5rem) 0; min-height: 340px; }
        .mv2-col.mission { justify-content:flex-end; }       /* grounded — today */
        .mv2-col.vision { justify-content:flex-start; text-align:right; align-items:flex-end; } /* reaching — future */
        .mv2-ghost { font-family:var(--font-head); font-weight:800; font-size:clamp(3.5rem,8vw,6.5rem); line-height:.8; color:transparent; -webkit-text-stroke:1px rgba(232,114,42,.16); margin-bottom:.6rem; }
        .mv2-tag { font-family:var(--font-body); font-weight:600; font-size:.76rem; letter-spacing:.2em; text-transform:uppercase; color:var(--orange); }
        .mv2-now { font-family:var(--font-head); font-weight:700; text-transform:uppercase; font-size:clamp(1.3rem,2.4vw,2rem); color:#fff; margin:.5rem 0 1rem; line-height:1.05; }
        .mv2-col p { color:var(--text-dim); font-size:clamp(1rem,1.4vw,1.15rem); line-height:1.6; max-width:42ch; }
        .mv2-col.vision p { margin-left:auto; }
        .mv2-icon { margin-top:1.4rem; color:var(--orange); }
        .mv2-col.mission .mv2-icon { opacity:.9; }
        .mv2-col.vision .mv2-icon { margin-left:auto; }
        .mv2-seam { position:relative; }
        .mv2-seam-line { position:absolute; left:50%; top:0; bottom:0; width:2px; transform:translateX(-50%); background:linear-gradient(180deg, transparent, var(--orange) 20%, var(--orange) 80%, transparent); box-shadow:0 0 14px rgba(232,114,42,.5); }
        .mv2-seam-node { position:absolute; left:50%; top:50%; width:14px; height:14px; border-radius:50%; transform:translate(-50%,-50%); background:radial-gradient(circle,#fff,var(--orange) 60%); box-shadow:0 0 18px 4px rgba(232,114,42,.7); animation: mvPulse 2.4s ease-in-out infinite; }
        @keyframes mvPulse { 0%,100%{ box-shadow:0 0 14px 2px rgba(232,114,42,.55);} 50%{ box-shadow:0 0 24px 7px rgba(232,114,42,.85);} }

        /* ───────── TRUSTED PARTNERS ───────── */
        .tp { padding: clamp(4.5rem,12vh,8rem) 0; }
        .tp-head { text-align:center; }
        .tp-head :global(.eyebrow){ justify-content:center; }
        .tp-head h2 { font-size:clamp(1.5rem,3vw,2.6rem); text-transform:uppercase; color:#fff; line-height:1.28; margin-top:1rem; }
        .tp-head h2 .kw { color:var(--orange); }
        .tp-alliance { display:flex; align-items:center; justify-content:center; gap:0; margin: clamp(2.5rem,7vh,4.5rem) auto 0; max-width:920px; }
        .tp-wire { flex:1; height:2px; background:linear-gradient(90deg, transparent, rgba(232,114,42,.6)); position:relative; }
        .tp-wire.right { background:linear-gradient(90deg, rgba(232,114,42,.6), transparent); }
        .tp-wire::after { content:""; position:absolute; top:50%; width:7px; height:7px; border-radius:50%; background:var(--orange); transform:translateY(-50%); box-shadow:0 0 10px var(--orange); animation: tpFlow 3s linear infinite; }
        .tp-wire.left::after { left:0; animation-name:tpFlowR; }
        .tp-wire.right::after { right:0; animation-name:tpFlowL; }
        @keyframes tpFlowR { from{ left:0; opacity:0;} 10%{opacity:1;} 90%{opacity:1;} to{ left:100%; opacity:0;} }
        @keyframes tpFlowL { from{ right:0; opacity:0;} 10%{opacity:1;} 90%{opacity:1;} to{ right:100%; opacity:0;} }
        .tp-plate { position:relative; flex:0 0 auto; width:min(46vw,360px); aspect-ratio:16/8; border-radius:16px; overflow:hidden; background:#fff; border:1px solid rgba(232,114,42,.4); box-shadow:0 24px 60px rgba(0,0,0,.5), 0 0 0 4px rgba(232,114,42,.08); display:grid; place-items:center; transition:transform .4s var(--ease), box-shadow .4s; }
        .tp-plate:hover { transform:translateY(-5px); box-shadow:0 30px 70px rgba(0,0,0,.6), 0 0 0 4px rgba(232,114,42,.18); }
        .tp-plate img { width:84%; height:auto; object-fit:contain; }
        .tp-sheen { position:absolute; inset:0; z-index:2; background:linear-gradient(115deg, transparent 42%, rgba(255,255,255,.75) 50%, transparent 58%); background-size:280% 100%; background-position:160% 0; pointer-events:none; animation: tpSheen 5.5s ease-in-out infinite; }
        @keyframes tpSheen { 0%,72%{ background-position:160% 0;} 88%,100%{ background-position:-60% 0;} }
        .tp-caption { text-align:center; color:var(--text-dim); margin:1.8rem auto 0; max-width:46ch; font-size:.98rem; }

        /* ───────── OUR FOOTPRINT ───────── */
        .fp { padding: clamp(4rem,11vh,7.5rem) 0 clamp(5rem,12vh,8rem); background: linear-gradient(180deg, var(--bg), #060607); }
        .fp-grid { display:grid; grid-template-columns: 1.15fr 1fr; gap: clamp(2rem,5vw,4.5rem); align-items:center; }
        .fp-map { position:relative; border:1px solid var(--line); border-radius:20px; padding: clamp(1rem,3vw,2rem); background: radial-gradient(120% 120% at 30% 20%, rgba(232,114,42,.06), transparent 60%), var(--bg-2); }
        .fp-map::before { content:"EGYPT · ENGINEERING NETWORK"; position:absolute; top:.9rem; left:1.1rem; font-size:.62rem; letter-spacing:.22em; color:var(--text-faint); font-family:var(--font-body); }
        .fp-svg { width:100%; height:auto; display:block; overflow:visible; }
        .fp-pin-n { fill:#fff; font-family:var(--font-head); font-weight:700; font-size:20px; }
        .fp-ping { fill:rgba(232,114,42,.22); transform-box:fill-box; transform-origin:center; animation: fpPing 2.8s ease-out infinite; }
        .fp-pin:nth-child(3) .fp-ping{ animation-delay:.6s; } .fp-pin:nth-child(4) .fp-ping{ animation-delay:1.2s; }
        @keyframes fpPing { 0%{ transform:scale(.4); opacity:.7;} 80%,100%{ transform:scale(1.5); opacity:0;} }
        .fp-title { margin:1rem 0 1.8rem; }
        .fp-list { display:flex; flex-direction:column; gap:.6rem; }
        .fp-item { display:flex; align-items:center; gap:1.1rem; padding:1rem 1.1rem; border:1px solid var(--line); border-radius:12px; background:var(--bg-2); transition: border-color .3s, transform .3s var(--ease), background .3s; }
        .fp-item:hover { border-color:rgba(232,114,42,.5); transform:translateX(5px); background: rgba(232,114,42,.04); }
        .fp-item-n { font-family:var(--font-head); font-weight:800; font-size:1.05rem; color:var(--orange); flex:0 0 auto; }
        .fp-item-text strong { display:block; color:#fff; font-size:1rem; }
        .fp-item-text span { display:block; color:var(--text-faint); font-size:.82rem; margin-top:.15rem; }
        .fp-note { color:var(--text-dim); margin:1.6rem 0 1.4rem; }

        @media (max-width:860px){
          .mv2-grid { grid-template-columns:1fr; gap:0; }
          .mv2-seam { height:60px; }
          .mv2-seam-line { left:50%; width:2px; }
          .mv2-col.vision { text-align:left; align-items:flex-start; }
          .mv2-col.vision p { margin-left:0; } .mv2-col.vision .mv2-icon { margin-left:0; }
          .mv2-col { min-height:0; }
          .tp-alliance { gap:.6rem; }
          .tp-plate { width:min(70vw,340px); }
          .fp-grid { grid-template-columns:1fr; }
          .fp-map { order:-1; }
        }
        @media (max-width:560px){
          .ab-stat { flex-basis:46%; border-right:none; }
        }
      ` }} />
    </PageShell>
  );
}
