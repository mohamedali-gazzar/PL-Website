"use client";

import { useMemo, useState } from "react";

// Catalogue leads are captured automatically from the website's catalogue
// unlock — this board is read-only (view + search + export). Their internal
// source is always "product_catalog", shown here as "Product Catalog".
const SOURCE_LABEL = "Product Catalog";

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function CatalogLeadsBoard({ initialLeads, configured, dbError }) {
  const [leads] = useState(initialLeads || []);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return leads;
    return leads.filter((l) =>
      [l.name, l.email, l.company, l.country, l.product]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(t))
    );
  }, [leads, q]);

  const qs = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
  const canExport = configured && leads.length > 0;
  const exportXlsxHref = "/api/crm/catalog/export-xlsx" + qs;

  return (
    <div className="cat">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="head">
        <div>
          <p className="eyebrow">Powerline · Admin</p>
          <h1>Catalogue Leads</h1>
          <p className="sub">Product-catalogue downloads · source <b>Product Catalog</b></p>
        </div>
        <div className="top-actions">
          <a className="ghost" href="/admin/crm">CRM ↗</a>
          <a className="ghost" href="/admin/analytics">Analytics ↗</a>
          <a className="ghost" href="/api/admin/login">Sign out</a>
          <a
            className={"primary" + (canExport ? "" : " disabled")}
            href={canExport ? exportXlsxHref : undefined}
            aria-disabled={!canExport}
            title="Download as Excel (.xlsx)"
          >
            ↓ Export Excel
          </a>
        </div>
      </header>

      {!configured ? (
        <div className="notice">
          <h3>Connect a database to activate catalogue leads</h3>
          <p>
            Catalogue leads are stored in Vercel Postgres. In the Vercel dashboard, add a Postgres store to
            this project (Storage → Create → Postgres) and connect it — that injects <code>POSTGRES_URL</code>.
            Also set <code>CRM_INGEST_SECRET</code> so the website catalogue unlock can auto-capture. Then redeploy.
          </p>
        </div>
      ) : dbError ? (
        <div className="notice err">
          <h3>Catalogue leads database error</h3>
          <p>{dbError}</p>
        </div>
      ) : (
        <>
          <div className="toolbar">
            <input
              className="search"
              placeholder="Search name, email, company, country, product…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <span className="count">{filtered.length} {filtered.length === 1 ? "lead" : "leads"}</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Company</th><th>Contact</th><th>Country</th>
                  <th>Product</th><th>Engineer</th><th>Source</th><th>Added</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td className="empty" colSpan={8}>
                      {leads.length === 0
                        ? "No catalogue leads yet. They appear here automatically when someone unlocks a catalogue on the website."
                        : "No catalogue leads match your search."}
                    </td>
                  </tr>
                ) : filtered.map((l) => (
                  <tr key={l.id}>
                    <td className="nm">{l.name || <span className="dim">— no name —</span>}</td>
                    <td>{l.company || <span className="dim">—</span>}</td>
                    <td>
                      {l.email ? <a href={`mailto:${l.email}`} className="lnk">{l.email}</a> : null}
                      {l.phone ? <div className="ph">{l.phone}</div> : null}
                      {!l.email && !l.phone ? <span className="dim">—</span> : null}
                    </td>
                    <td>{l.country || <span className="dim">—</span>}</td>
                    <td>
                      <div className="prod">{l.product || <span className="dim">—</span>}</div>
                      {l.catalogue ? <div className="cta" title={l.catalogue}>{l.catalogue}</div> : null}
                    </td>
                    <td>
                      {l.engineer_contact
                        ? <span className="pill yes">Yes</span>
                        : <span className="pill no">No</span>}
                    </td>
                    <td><span className="src">{SOURCE_LABEL}</span></td>
                    <td className="dim">{fmtDate(l.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="foot">
            Live from the CRM’s <span className="mono">catalog_leads</span> table — fetched server-side, credentials
            never reach the browser. Export reflects the current database (with your search applied). This page is <b>noindex</b>.
          </p>
        </>
      )}
    </div>
  );
}

const CSS = `
.cat{--bg:#060507;--card-bg:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.015));
  --line:rgba(255,255,255,.09);--line2:rgba(255,255,255,.16);--text:#f4f4f5;--dim:#a1a1aa;--faint:#6b6b72;
  --accent:#e8722a;--accent2:#ff8a4c;
  min-height:100vh;color:var(--text);font-family:var(--font-poppins),system-ui,sans-serif;line-height:1.5;
  padding:clamp(1.2rem,3vw,2.4rem);font-variant-numeric:tabular-nums;
  background:radial-gradient(1100px 600px at 84% -12%,rgba(232,114,42,.12),transparent 60%),#060507}
.cat *{box-sizing:border-box;margin:0}
.cat .mono{font-family:ui-monospace,Consolas,monospace}
.cat h1{font-family:var(--font-montserrat),sans-serif;font-weight:800;font-size:clamp(1.6rem,4vw,2.3rem);text-transform:uppercase;letter-spacing:-.02em;margin:.4rem 0 .3rem}
.cat .eyebrow{font-size:.7rem;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:var(--accent)}
.cat .sub{color:var(--dim);font-size:.9rem}
.cat .sub b{color:#e9b48f;font-weight:600}
.cat .head{display:flex;justify-content:space-between;align-items:flex-end;gap:1.2rem;flex-wrap:wrap;margin-bottom:1.5rem}
.cat .top-actions{display:flex;align-items:center;gap:.6rem;flex-wrap:wrap}
.cat .ghost{font-size:.8rem;color:var(--dim);text-decoration:none;border:1px solid var(--line);padding:.5rem .85rem;border-radius:9px}
.cat .ghost:hover{color:#fff;border-color:var(--line2);background:rgba(255,255,255,.04)}
.cat .ghost.disabled{opacity:.45;pointer-events:none;cursor:not-allowed}
.cat .primary{font-size:.82rem;font-weight:700;color:#160c04;background:linear-gradient(180deg,var(--accent2),var(--accent));border:none;padding:.55rem 1rem;border-radius:9px;text-decoration:none;cursor:pointer}
.cat .primary:hover{filter:brightness(1.06)}
.cat .primary.disabled{opacity:.45;pointer-events:none;cursor:not-allowed}
.cat .notice{border:1px solid var(--line);border-radius:16px;padding:1.6rem 1.7rem;background:var(--card-bg);max-width:60ch}
.cat .notice.err{border-color:rgba(226,84,66,.4);background:rgba(226,84,66,.08)}
.cat .notice h3{font-size:1.05rem;margin-bottom:.5rem}
.cat .notice p{color:var(--dim);font-size:.9rem}
.cat code{font-family:ui-monospace,Consolas,monospace;font-size:.82rem;background:rgba(232,114,42,.12);padding:.1rem .35rem;border-radius:5px;color:#f0a875}
.cat .toolbar{display:flex;align-items:center;gap:.9rem;margin-bottom:1rem;flex-wrap:wrap}
.cat .search{flex:1;min-width:240px;background:rgba(0,0,0,.3);border:1px solid var(--line);color:var(--text);border-radius:10px;padding:.6rem .85rem;font-size:.9rem;font-family:inherit}
.cat .search:focus{outline:2px solid var(--accent);outline-offset:1px;border-color:var(--accent)}
.cat .count{font-size:.8rem;color:var(--faint);font-weight:600}
.cat .table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:14px;background:var(--card-bg)}
.cat table{width:100%;border-collapse:collapse;min-width:900px}
.cat th{text-align:left;font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:var(--faint);font-weight:700;padding:.7rem .9rem;border-bottom:1px solid var(--line);white-space:nowrap}
.cat td{padding:.7rem .9rem;border-bottom:1px solid rgba(255,255,255,.05);font-size:.86rem;vertical-align:top}
.cat tbody tr:last-child td{border-bottom:none}
.cat tbody tr:hover{background:rgba(255,255,255,.02)}
.cat .nm{font-weight:600}
.cat .dim{color:var(--faint)}
.cat .lnk{color:#7db2ff;text-decoration:none}
.cat .lnk:hover{text-decoration:underline}
.cat .ph{font-size:.8rem;color:var(--dim);margin-top:.15rem}
.cat .prod{font-weight:600}
.cat .cta{font-size:.76rem;color:var(--faint);margin-top:.15rem;max-width:22ch;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cat .pill{font-size:.72rem;font-weight:700;padding:.15rem .55rem;border-radius:20px;border:1px solid}
.cat .pill.yes{color:#7ee2a0;background:rgba(53,196,106,.12);border-color:rgba(53,196,106,.34)}
.cat .pill.no{color:var(--faint);background:rgba(255,255,255,.04);border-color:var(--line)}
.cat .src{font-size:.75rem;color:#e9b48f;background:rgba(232,114,42,.12);padding:.15rem .5rem;border-radius:20px;border:1px solid rgba(232,114,42,.3);white-space:nowrap}
.cat .empty{color:var(--faint);text-align:center;padding:2rem 1rem}
.cat .foot{margin-top:1.3rem;color:var(--faint);font-size:.8rem;line-height:1.6;max-width:80ch}
`;
