import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { Reveal, CountUp } from "@/components/Primitives";
import { aboutCopy, heroStats, values, locations } from "@/lib/content";

export const metadata = {
  title: "Who We Are — Powerline",
  description: aboutCopy.lead,
};

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Who We Are"
        title="Powerline"
        accent="is"
        lead={aboutCopy.lead}
        img="/img/facility-1.webp"
      />

      <section className="about">
        <div className="container">
          {/* Intro — text + facility image */}
          <div className="intro">
            <Reveal>
              <div className="intro-text">
                <p className="lead">{aboutCopy.body}</p>
                <Link href="/assembly-lines" className="btn btn-primary intro-cta">
                  Explore our solutions
                </Link>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="intro-media">
                <img src="/img/facility-2.webp" alt="Powerline manufacturing facility" />
                <span className="im-frame" />
              </div>
            </Reveal>
          </div>

          {/* Stats */}
          <div className="stats">
            {heroStats.map((s, i) => (
              <Reveal as="div" key={s.label} delay={i * 90}>
                <div className="stat">
                  <div className="sv"><CountUp value={s.value} suffix={s.suffix} group={!s.plain} /></div>
                  <div className="sl">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Partner statement */}
          <Reveal>
            <div className="partner">
              <div className="partner-text">
                <span className="eyebrow">Trusted Partners</span>
                <h2>
                  We are the <span className="kw">trusted partners</span> to{" "}
                  <span className="kw">global leaders</span> — offering{" "}
                  <span className="kw">technical expertise</span>,{" "}
                  <span className="kw">product support</span>, and{" "}
                  <span className="kw">performance optimization</span> to keep
                  power systems running smoothly.
                </h2>
              </div>
              <img src="/img/abb-schneider.webp" alt="ABB and Schneider Electric" className="ps-logos" />
            </div>
          </Reveal>

          {/* Values */}
          <Reveal>
            <div className="vhead sec-head">
              <span className="eyebrow">Powerline Values</span>
              <h2 className="section-title">The principles behind every panel</h2>
            </div>
          </Reveal>
          <div className="vgrid">
            {values.map((v, i) => (
              <Reveal as="div" className="vcell" key={v.title} delay={i * 70}>
                <div className="vcard">
                  <span className="vn">{v.n}</span>
                  <h3>{v.title}</h3>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Footprint */}
          <Reveal>
            <div className="foot">
              <div className="foot-text">
                <span className="eyebrow">Our Footprint</span>
                <h2 className="section-title">Built from two advanced facilities</h2>
                <p>{locations.map((l) => l.name).join(" · ")} — engineering, manufacturing and service across Egypt.</p>
                <Link href="/locations" className="btn btn-ghost">Find us →</Link>
              </div>
              <div className="foot-media">
                <img src="/img/facility-1.webp" alt="Powerline facility" />
                <span className="im-frame" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .about { padding: clamp(3.5rem,9vh,6rem) 0 clamp(5rem,12vh,8rem); }

        .intro { display:grid; grid-template-columns: 1.1fr 1fr; gap: clamp(2rem,5vw,4.5rem); align-items:center; }
        .lead { font-size: clamp(1.3rem,2.4vw,1.9rem); line-height:1.45; color:#fff; font-family:var(--font-head); font-weight:400; }
        .intro-cta { margin-top: 1.8rem; }
        .intro-media, .foot-media { position:relative; border-radius:20px; overflow:hidden; border:1px solid var(--line); aspect-ratio:4/3; }
        .intro-media img, .foot-media img { width:100%; height:100%; object-fit:cover; }
        .im-frame { position:absolute; inset:0; pointer-events:none; border-radius:20px; box-shadow: inset 0 0 0 1px rgba(241,103,34,.25); }

        .stats { display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem; margin: clamp(3rem,8vh,5rem) 0; padding: clamp(2rem,5vh,3rem) 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line); text-align:center; }
        .stat { text-align:center; }
        .stat .sv { font-family:var(--font-head); font-weight:800; font-size: clamp(1.9rem,3.6vw,3rem); color:var(--orange); line-height:1; }
        .stat .sl { color:var(--text-faint); text-transform:uppercase; font-size:0.76rem; letter-spacing:0.05em; margin-top:0.5rem; }

        .partner { display:flex; justify-content:space-between; align-items:center; gap:2.5rem; flex-wrap:wrap; margin-bottom: clamp(3rem,8vh,5rem); padding: clamp(2rem,4vw,3rem); border:1px solid var(--line); border-radius:20px; background: radial-gradient(120% 140% at 0% 0%, rgba(241,103,34,.14), transparent 55%), var(--bg-2); }
        .partner-text { flex:1 1 420px; }
        .partner h2 { font-size: clamp(1.3rem,2.6vw,2rem); text-transform:uppercase; color:#fff; max-width:none; margin-top:0.8rem; line-height:1.3; }
        .partner h2 .kw { color:var(--orange); }
        .ps-logos { max-height: clamp(78px, 11vw, 124px); width:auto; flex:0 0 auto; }

        .vhead h2 { margin-top:1rem; }
        .vgrid { display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:1.2rem; margin-bottom: clamp(3rem,8vh,5rem); }
        .vcard { height:100%; padding:1.6rem; border:1px solid var(--line); border-radius:14px; background:var(--bg-2); transition: all .35s var(--ease); }
        .vcell:hover .vcard { border-color: rgba(241,103,34,.5); transform: translateY(-4px); }
        .vn { color:var(--orange); font-family:var(--font-head); font-weight:700; }
        .vcard h3 { font-size:1.1rem; text-transform:uppercase; margin-top:0.8rem; }

        .foot { display:grid; grid-template-columns:1fr 1fr; gap:clamp(2rem,5vw,4.5rem); align-items:center; }
        .foot-text h2 { margin:1rem 0 1rem; }
        .foot-text p { color:var(--text-dim); margin-bottom:1.6rem; max-width:48ch; }

        @media (max-width:850px){
          .intro, .foot { grid-template-columns:1fr; }
          .stats { grid-template-columns:repeat(2,1fr); }
        }
      ` }} />
    </PageShell>
  );
}
