import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { Reveal } from "@/components/Primitives";
import { locations, brand } from "@/lib/content";

export const metadata = {
  title: "Where to Find Us — Powerline",
  description: "Powerline headquarters in Heliopolis, Cairo and two factories in 10th of Ramadan City.",
};

export default function LocationsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Where to Find Us"
        title="Our"
        accent="locations"
        lead="A headquarters in the heart of Cairo and two advanced manufacturing facilities in 10th of Ramadan City."
        img="/img/facility-2.jpg"
      />

      <section className="locs">
        <div className="container">
          <div className="grid">
            {locations.map((l, i) => (
              <Reveal as="div" className="loc" key={l.name} delay={i * 90}>
                <span className="badge">{String(i + 1).padStart(2, "0")}</span>
                <h3>{l.name}</h3>
                <p>{l.address}</p>
                <a href={l.maps} target="_blank" rel="noreferrer" className="dir">
                  Get directions →
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal className="contact-strip">
            <div>
              <span className="eyebrow">Call us</span>
              <a href={`tel:${brand.phone}`} className="big-phone">{brand.phoneDisplay}</a>
            </div>
            <div className="socials">
              <a href={brand.facebook} target="_blank" rel="noreferrer">Facebook</a>
              <a href={brand.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </Reveal>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .locs { padding: clamp(3.5rem,9vh,6rem) 0 clamp(5rem,12vh,8rem); }
        .locs .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.3rem; }
        .loc { position:relative; padding:2.2rem 1.8rem; border:1px solid var(--line); border-radius:16px; background:var(--bg-2); transition: all .35s var(--ease); }
        .loc:hover { border-color: rgba(241,103,34,.5); transform:translateY(-5px); }
        .badge { font-family:var(--font-head); font-weight:700; color:var(--orange); }
        .loc h3 { font-size:1.5rem; text-transform:uppercase; margin:1rem 0 0.7rem; }
        .loc p { color:var(--text-dim); font-size:0.95rem; min-height:3em; }
        .dir { display:inline-block; margin-top:1.2rem; color:#fff; font-weight:600; font-size:0.9rem; }
        .loc:hover .dir { color:var(--orange); }
        .contact-strip { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.5rem; margin-top:3rem; padding:2.5rem; border:1px solid var(--line); border-radius:18px; background: radial-gradient(120% 140% at 0% 0%, rgba(241,103,34,.14), transparent 55%), var(--bg-2); }
        .big-phone { display:block; font-family:var(--font-head); font-weight:800; font-size:clamp(1.6rem,4vw,2.6rem); margin-top:0.6rem; }
        .big-phone:hover { color:var(--orange); }
        .socials { display:flex; gap:1.2rem; }
        .socials a { color:var(--text-dim); font-weight:500; }
        .socials a:hover { color:var(--orange); }
        @media (max-width:850px){ .locs .grid{ grid-template-columns:1fr; } }
      ` }} />
    </PageShell>
  );
}
