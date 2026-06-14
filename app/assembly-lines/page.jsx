import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import ProductGrid from "@/components/ProductGrid";
import { Reveal } from "@/components/Primitives";
import { lowVoltage, mediumVoltage } from "@/lib/content";

export const metadata = {
  title: "Assembly Lines — Powerline",
  description:
    "Powerline's assembly lines: certified low voltage panels and medium voltage switchgear, built to international standards.",
};

const groups = [
  { data: lowVoltage, href: "/low-voltage", img: "/img/line-lv.jpg" },
  { data: mediumVoltage, href: "/medium-voltage", img: "/img/line-mv.jpg" },
];

export default function AssemblyLinesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="What We Build"
        title="Assembly"
        accent="Lines"
        lead="From certified low voltage panels to medium voltage switchgear — engineered, type-tested and assembled at our facilities to international standards."
        img="/img/line-lv.jpg"
      />

      <section className="al">
        <div className="container">
          {groups.map(({ data, href, img }) => (
            <div className="al-group" key={data.title}>
              <Reveal>
                <div className="al-head sec-head">
                  <div className="al-head-text">
                    <span className="eyebrow">Assembly Lines</span>
                    <h2 className="section-title">{data.title}</h2>
                    <p>{data.intro}</p>
                  </div>
                  <Link href={href} className="btn btn-ghost al-cta">
                    View {data.title} →
                  </Link>
                </div>
              </Reveal>
              <ProductGrid items={data.products} />
            </div>
          ))}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .al { padding: clamp(3.5rem,9vh,6rem) 0 clamp(5rem,12vh,8rem); }
        .al-group + .al-group { margin-top: clamp(4rem,10vh,7rem); }
        .al-head { display:flex; justify-content:space-between; align-items:flex-end; gap:2rem; flex-wrap:wrap; }
        .al-head-text { max-width: 70ch; }
        .al-head h2 { margin:1rem 0 0.8rem; }
        .al-head p { color: var(--text-dim); font-size:1rem; max-width:60ch; }
        .al-cta { flex:0 0 auto; }
        @media (max-width:700px){ .al-cta{ width:100%; justify-content:center; } }
      ` }} />
    </PageShell>
  );
}
