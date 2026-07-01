import Link from "next/link";
import PageShell from "@/components/PageShell";
import { Reveal } from "@/components/Primitives";
import { aboutCopy, locations, brand } from "@/lib/content";
import CoreValues from "@/components/CoreValues";
import AboutStory from "@/components/AboutStory";

export const metadata = {
  title: "Who We Are — Powerline",
  description: aboutCopy.lead,
};

export default function AboutPage() {
  return (
    <PageShell>
      {/* ════ ABOUT POWERLINE — unified cinematic hero (story + credentials) ════ */}
      <AboutStory />

      {/* ════ MISSION & VISION — two forces, one seam ════ */}
      <section className="mv2">
        <div className="container">
          <div className="mv2-grid">
            <Reveal as="div" className="mv2-col mission">
              <span className="mv2-ghost" aria-hidden="true">01</span>
              <span className="mv2-tag">Our Mission</span>
              <span className="mv2-now">What drives us today</span>
              <p>{brand.mission}</p>
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
              <span className="eyebrow">Technology Partners</span>
              <h2>
                We build where we <span className="kw">add value</span> — and{" "}
                <span className="kw">partner with the world&rsquo;s best</span> for the rest.
              </h2>
              <p className="tp-sub">
                Engineering, fabrication, integration, and service, built by
                Powerline &mdash; powered by world-class technology from ABB and
                Schneider Electric.
              </p>
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
              &ldquo;World-class technology, integrated and backed by Powerline on the ground.&rdquo;
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════ OUR FOOTPRINT — facilities ════ */}
      <section className="fp">
        <div className="container">
          <Reveal as="div" className="fp-head">
            <span className="eyebrow">Our Footprint</span>
            <h2 className="section-title fp-title">Built from two advanced facilities</h2>
            <p className="fp-note">Engineering, manufacturing and service across Egypt — a sales office in Cairo and two production facilities in 10th of Ramadan City.</p>
          </Reveal>

          <Reveal as="div" className="fp-cards">
            {locations.map((l, i) => (
              <a key={l.name} className="fp-card" href={l.maps} target="_blank" rel="noreferrer">
                <span className="fp-card-top">
                  <span className="fp-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>
                  <span className="fp-card-n">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <h3>{l.name}</h3>
                <span className="fp-card-addr">{l.address}</span>
                <span className="fp-card-link">View on map →</span>
              </a>
            ))}
          </Reveal>

          <Reveal delay={120}>
            <div className="fp-cta">
              <Link href="/locations" className="btn btn-ghost">Find all locations →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        /* ───────── MISSION & VISION ───────── */
        .mv2 { padding: clamp(4rem,11vh,8rem) 0; background: var(--bg-2); }
        .mv2-grid { display:grid; grid-template-columns: 1fr 2px 1fr; gap: clamp(1.5rem,5vw,4.5rem); align-items:stretch; }
        .mv2-col { position:relative; display:flex; flex-direction:column; padding: clamp(1.5rem,3vw,2.5rem) 0; min-height: 340px; }
        .mv2-col.mission { justify-content:flex-end; }       /* grounded — today */
        .mv2-col.vision { justify-content:flex-start; text-align:left; align-items:flex-start; } /* reaching — future (left-aligned) */
        .mv2-ghost { font-family:var(--font-head); font-weight:800; font-size:clamp(3.5rem,8vw,6.5rem); line-height:.8; color:transparent; -webkit-text-stroke:1px rgba(232,114,42,.16); margin-bottom:.6rem; }
        .mv2-tag { font-family:var(--font-body); font-weight:600; font-size:.76rem; letter-spacing:.2em; text-transform:uppercase; color:var(--orange); }
        .mv2-now { font-family:var(--font-head); font-weight:700; text-transform:uppercase; font-size:clamp(1.3rem,2.4vw,2rem); color:#fff; margin:.5rem 0 1rem; line-height:1.05; }
        .mv2-col p { color:var(--text-dim); font-size:clamp(1rem,1.4vw,1.15rem); line-height:1.6; max-width:42ch; }
        .mv2-seam { position:relative; }
        .mv2-seam-line { position:absolute; left:50%; top:0; bottom:0; width:2px; transform:translateX(-50%); background:linear-gradient(180deg, transparent, var(--orange) 20%, var(--orange) 80%, transparent); box-shadow:0 0 14px rgba(232,114,42,.5); }
        .mv2-seam-node { position:absolute; left:50%; top:50%; width:14px; height:14px; border-radius:50%; transform:translate(-50%,-50%); background:radial-gradient(circle,#fff,var(--orange) 60%); box-shadow:0 0 18px 4px rgba(232,114,42,.7); animation: mvPulse 2.4s ease-in-out infinite; }
        @keyframes mvPulse { 0%,100%{ box-shadow:0 0 14px 2px rgba(232,114,42,.55);} 50%{ box-shadow:0 0 24px 7px rgba(232,114,42,.85);} }

        /* ───────── TRUSTED PARTNERS ───────── */
        .tp { padding: clamp(4.5rem,12vh,8rem) 0; }
        .tp-head { max-width:76%; margin:0 auto; text-align:center; }
        .tp-head :global(.eyebrow){ justify-content:center; }
        .tp-head h2 { font-size:clamp(1.45rem,2.8vw,2.25rem); text-transform:uppercase; color:#fff; line-height:1.25; margin-top:1rem; }
        .tp-head h2 .kw { color:var(--orange); }
        .tp-sub { margin:1.1rem auto 0; max-width:58ch; color:var(--text-dim); font-size:clamp(1rem,1.4vw,1.18rem); line-height:1.6; }
        .tp-alliance { display:flex; align-items:center; justify-content:center; gap:0; margin: clamp(2.5rem,7vh,4.5rem) auto 0; max-width:1040px; }
        .tp-wire { flex:1; height:2px; background:linear-gradient(90deg, transparent, rgba(232,114,42,.6)); position:relative; }
        .tp-wire.right { background:linear-gradient(90deg, rgba(232,114,42,.6), transparent); }
        .tp-wire::after { content:""; position:absolute; top:50%; width:7px; height:7px; border-radius:50%; background:var(--orange); transform:translateY(-50%); box-shadow:0 0 10px var(--orange); animation: tpFlow 3s linear infinite; }
        .tp-wire.left::after { left:0; animation-name:tpFlowR; }
        .tp-wire.right::after { right:0; animation-name:tpFlowL; }
        @keyframes tpFlowR { from{ left:0; opacity:0;} 10%{opacity:1;} 90%{opacity:1;} to{ left:100%; opacity:0;} }
        @keyframes tpFlowL { from{ right:0; opacity:0;} 10%{opacity:1;} 90%{opacity:1;} to{ right:100%; opacity:0;} }
        .tp-plate { position:relative; flex:0 0 auto; width:min(48vw,460px); aspect-ratio:3.2/1; border-radius:14px; overflow:hidden; background:#fff; border:1px solid rgba(232,114,42,.4); box-shadow:0 24px 60px rgba(0,0,0,.5), 0 0 0 4px rgba(232,114,42,.08); display:grid; place-items:center; transition:transform .4s var(--ease), box-shadow .4s; }
        .tp-plate:hover { transform:translateY(-5px); box-shadow:0 30px 70px rgba(0,0,0,.6), 0 0 0 4px rgba(232,114,42,.18); }
        .tp-plate img { width:78%; height:auto; object-fit:contain; }
        .tp-sheen { position:absolute; inset:0; z-index:2; background:linear-gradient(115deg, transparent 42%, rgba(255,255,255,.75) 50%, transparent 58%); background-size:280% 100%; background-position:160% 0; pointer-events:none; animation: tpSheen 5.5s ease-in-out infinite; }
        @keyframes tpSheen { 0%,72%{ background-position:160% 0;} 88%,100%{ background-position:-60% 0;} }
        .tp-caption { text-align:center; color:var(--text-dim); margin:1.8rem auto 0; max-width:46ch; font-size:.98rem; }

        /* ───────── OUR FOOTPRINT ───────── */
        .fp { padding: clamp(4rem,11vh,7.5rem) 0 clamp(5rem,12vh,8rem); background: linear-gradient(180deg, var(--bg), #060607); }
        .fp-head { text-align:center; max-width:860px; margin:0 auto clamp(2.5rem,6vh,4rem); }
        .fp-head .eyebrow{ justify-content:center; }
        .fp-title { margin:1rem auto; text-wrap:balance; }
        .fp-note { color:var(--text-dim); font-size:clamp(.98rem,1.3vw,1.1rem); line-height:1.6; max-width:56ch; margin:0 auto; }
        .fp-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(1rem,2vw,1.6rem); }
        .fp-card { position:relative; display:flex; flex-direction:column; padding:clamp(1.5rem,2.6vw,2.3rem); border:1px solid var(--line); border-radius:18px; background:var(--bg-2); overflow:hidden; transition:border-color .35s, transform .35s var(--ease), background .35s; }
        .fp-card::before { content:""; position:absolute; left:0; top:0; height:3px; width:0; background:linear-gradient(90deg,var(--orange),transparent); transition:width .45s var(--ease); }
        .fp-card:hover { border-color:rgba(232,114,42,.5); transform:translateY(-6px); background:rgba(232,114,42,.04); }
        .fp-card:hover::before { width:100%; }
        .fp-card-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.1rem; }
        .fp-card-icon { display:inline-grid; place-items:center; width:46px; height:46px; border-radius:12px; color:var(--orange); background:rgba(232,114,42,.08); border:1px solid rgba(232,114,42,.22); }
        .fp-card-n { font-family:var(--font-head); font-weight:800; font-size:1.5rem; color:rgba(232,114,42,.45); }
        .fp-card h3 { font-family:var(--font-head); font-weight:800; text-transform:uppercase; font-size:clamp(1.1rem,1.6vw,1.4rem); color:#fff; margin:0 0 .6rem; line-height:1.1; }
        .fp-card-addr { color:var(--text-dim); font-size:.92rem; line-height:1.55; flex:1 1 auto; }
        .fp-card-link { margin-top:1.3rem; color:var(--orange); font-family:var(--font-body); font-weight:600; font-size:.85rem; letter-spacing:.04em; transition:letter-spacing .3s ease; }
        .fp-card:hover .fp-card-link { letter-spacing:.1em; }
        .fp-cta { text-align:center; margin-top:clamp(2rem,5vh,3.2rem); }

        @media (max-width:860px){
          .mv2-grid { grid-template-columns:1fr; gap:0; }
          .mv2-seam { height:auto; padding:clamp(1.2rem,5vw,2rem) 0; }
          .mv2-seam-line { left:0; right:0; top:50%; bottom:auto; width:auto; height:2px; transform:translateY(-50%); background:linear-gradient(90deg, transparent, var(--orange) 20%, var(--orange) 80%, transparent); }
          .mv2-col, .mv2-col.mission, .mv2-col.vision { min-height:0; text-align:center; align-items:center; justify-content:flex-start; }
          .mv2-col p, .mv2-col.vision p { margin-left:auto; margin-right:auto; }
          .tp-head { max-width:100%; }
          .tp-alliance { gap:.7rem; }
          .tp-plate { width:min(54vw,240px); }
          .fp-cards { grid-template-columns:1fr; }
        }
        @media (max-width:760px){
          .mv2, .tp, .fp { padding-top: clamp(2.4rem,8vw,3.4rem); padding-bottom: clamp(2.4rem,8vw,3.4rem); }
        }
      ` }} />
    </PageShell>
  );
}
