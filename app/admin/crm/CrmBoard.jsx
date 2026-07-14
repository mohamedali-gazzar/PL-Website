"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STATUSES = ["new", "contacted", "qualified", "won", "lost"];
const STATUS_LABEL = { new: "New", contacted: "Contacted", qualified: "Qualified", won: "Won", lost: "Lost" };
const STATUS_COLOR = {
  new: "#5b9dff", contacted: "#e8b42a", qualified: "#b98cff", won: "#3ecf8e", lost: "#e25442",
};
const SOURCE_LABEL = { manual: "Manual", contact: "Contact form", careers: "Careers form", api: "API" };

const EMPTY_FORM = { name: "", email: "", phone: "", company: "", status: "new", message: "", notes: "" };

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function CrmBoard({ initialLeads, initialCounts, configured, dbError }) {
  const [leads, setLeads] = useState(initialLeads || []);
  const [counts, setCounts] = useState(initialCounts || { total: 0, byStatus: {} });
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null); // null | {mode:'add'} | {mode:'edit', lead}
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const flash = useCallback((msg, kind = "ok") => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const refresh = useCallback(async (nextStatus = status, nextQ = q) => {
    if (!configured) return;
    setBusy(true);
    try {
      const params = new URLSearchParams();
      if (nextStatus && nextStatus !== "all") params.set("status", nextStatus);
      if (nextQ.trim()) params.set("q", nextQ.trim());
      const res = await fetch(`/api/crm/leads?${params.toString()}`, { cache: "no-store" });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Failed to load");
      setLeads(j.leads);
      setCounts(j.counts);
    } catch (e) {
      flash(e.message || "Failed to load leads", "err");
    } finally {
      setBusy(false);
    }
  }, [configured, status, q, flash]);

  // Debounced search
  useEffect(() => {
    if (!configured) return;
    const t = setTimeout(() => refresh(status, q), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const openAdd = () => { setForm(EMPTY_FORM); setModal({ mode: "add" }); };
  const openEdit = (lead) => {
    setForm({
      name: lead.name || "", email: lead.email || "", phone: lead.phone || "",
      company: lead.company || "", status: lead.status || "new",
      message: lead.message || "", notes: lead.notes || "",
    });
    setModal({ mode: "edit", lead });
  };
  const closeModal = () => { if (!saving) setModal(null); };

  const saveLead = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = modal?.mode === "edit";
      const url = isEdit ? `/api/crm/leads/${modal.lead.id}` : "/api/crm/leads";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Save failed");
      setModal(null);
      flash(isEdit ? "Lead updated" : "Lead added");
      refresh();
    } catch (err) {
      flash(err.message || "Save failed", "err");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (lead, next) => {
    if (next === lead.status) return;
    // Optimistic
    setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, status: next } : l)));
    try {
      const res = await fetch(`/api/crm/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Update failed");
      refresh();
    } catch (err) {
      flash(err.message || "Update failed", "err");
      refresh();
    }
  };

  const removeLead = async (lead) => {
    if (!window.confirm(`Delete lead "${lead.name || lead.email || lead.id}"? This can't be undone.`)) return;
    try {
      const res = await fetch(`/api/crm/leads/${lead.id}`, { method: "DELETE" });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Delete failed");
      flash("Lead deleted");
      refresh();
    } catch (err) {
      flash(err.message || "Delete failed", "err");
    }
  };

  const onStatusTab = (s) => { setStatus(s); refresh(s, q); };

  const tiles = useMemo(() => {
    const by = counts.byStatus || {};
    return [{ key: "all", label: "All leads", n: counts.total || 0 },
      ...STATUSES.map((s) => ({ key: s, label: STATUS_LABEL[s], n: by[s] || 0 }))];
  }, [counts]);

  return (
    <div className="crm">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="topbar">
        <div className="brand">
          <span className="dot" />
          <div>
            <p className="eyebrow">Powerline · Admin</p>
            <h1>CRM — Leads</h1>
          </div>
        </div>
        <div className="top-actions">
          <a className="ghost" href="/admin/analytics">Analytics ↗</a>
          <button className="primary" onClick={openAdd} disabled={!configured}>+ Add lead</button>
        </div>
      </header>

      {!configured ? (
        <div className="notice">
          <h3>Connect a database to activate the CRM</h3>
          <p>
            The CRM stores leads in Vercel Postgres. In the Vercel dashboard, add a Postgres store to this
            project (Storage → Create → Postgres) and connect it — that injects <code>POSTGRES_URL</code>.
            Also set <code>CRM_INGEST_SECRET</code> to enable website form auto-capture. Then redeploy.
          </p>
        </div>
      ) : dbError ? (
        <div className="notice err">
          <h3>CRM database error</h3>
          <p>{dbError}</p>
        </div>
      ) : (
        <>
          <div className="tiles">
            {tiles.map((t) => (
              <button
                key={t.key}
                className={`tile ${status === t.key ? "active" : ""}`}
                onClick={() => onStatusTab(t.key)}
                style={t.key !== "all" ? { "--c": STATUS_COLOR[t.key] } : undefined}
              >
                <span className="tile-n">{t.n}</span>
                <span className="tile-l">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="toolbar">
            <input
              className="search"
              placeholder="Search name, email, company, phone…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {busy ? <span className="busy">Loading…</span> : null}
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Company</th><th>Contact</th><th>Source</th>
                  <th>Status</th><th>Added</th><th className="ra">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr><td className="empty" colSpan={7}>No leads {status !== "all" ? `in “${STATUS_LABEL[status]}”` : "yet"}. {status === "all" && !q ? "Add one, or wait for website form submissions." : ""}</td></tr>
                ) : leads.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <div className="nm">{l.name || <span className="dim">— no name —</span>}</div>
                      {l.message ? <div className="msg" title={l.message}>{l.message}</div> : null}
                    </td>
                    <td>{l.company || <span className="dim">—</span>}</td>
                    <td>
                      {l.email ? <a href={`mailto:${l.email}`} className="lnk">{l.email}</a> : null}
                      {l.phone ? <div className="ph">{l.phone}</div> : null}
                      {!l.email && !l.phone ? <span className="dim">—</span> : null}
                    </td>
                    <td><span className="src">{SOURCE_LABEL[l.source] || l.source}</span></td>
                    <td>
                      <select
                        className="status-sel"
                        value={l.status}
                        onChange={(e) => changeStatus(l, e.target.value)}
                        style={{ "--c": STATUS_COLOR[l.status] || "#888" }}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                      </select>
                    </td>
                    <td className="dim">{fmtDate(l.created_at)}</td>
                    <td className="ra">
                      <button className="mini" onClick={() => openEdit(l)}>Edit</button>
                      <button className="mini danger" onClick={() => removeLead(l)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modal ? (
        <div className="overlay" onMouseDown={closeModal}>
          <form className="dialog" onMouseDown={(e) => e.stopPropagation()} onSubmit={saveLead}>
            <h2>{modal.mode === "edit" ? "Edit lead" : "New lead"}</h2>
            <div className="grid2">
              <label className="f"><span>Name</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
              </label>
              <label className="f"><span>Company</span>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </label>
              <label className="f"><span>Email</span>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="f"><span>Phone</span>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </label>
              <label className="f"><span>Status</span>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
              </label>
            </div>
            {modal.mode === "add" ? (
              <label className="f"><span>Message (their enquiry)</span>
                <textarea rows={2} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </label>
            ) : null}
            <label className="f"><span>Internal notes</span>
              <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </label>
            <div className="dialog-actions">
              <button type="button" className="ghost" onClick={closeModal} disabled={saving}>Cancel</button>
              <button type="submit" className="primary" disabled={saving}>{saving ? "Saving…" : modal.mode === "edit" ? "Save changes" : "Add lead"}</button>
            </div>
          </form>
        </div>
      ) : null}

      {toast ? <div className={`toast ${toast.kind}`}>{toast.msg}</div> : null}
    </div>
  );
}

const CSS = `
.crm{min-height:100vh;padding:2rem clamp(1rem,4vw,3rem) 4rem;color:#f4f4f5;
  font-family:var(--font-poppins),system-ui,sans-serif;
  background:radial-gradient(1100px 600px at 85% -12%,rgba(232,114,42,.13),transparent 60%),#060507}
.crm *{box-sizing:border-box}
.crm .topbar{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1.6rem}
.crm .brand{display:flex;gap:.85rem;align-items:center}
.crm .brand .dot{width:38px;height:38px;border-radius:11px;background:linear-gradient(140deg,#ff8a4c,#e8722a);flex:none;box-shadow:0 6px 20px rgba(232,114,42,.35)}
.crm .eyebrow{font-size:.66rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#e8722a;margin:0}
.crm h1{font-family:var(--font-montserrat),sans-serif;font-weight:800;font-size:1.5rem;text-transform:uppercase;letter-spacing:-.01em;margin:.15rem 0 0}
.crm .top-actions{display:flex;gap:.6rem;align-items:center}
.crm a.ghost,.crm button.ghost{padding:.6rem .95rem;border:1px solid rgba(255,255,255,.16);border-radius:10px;background:rgba(255,255,255,.03);color:#e7e2dc;font-weight:600;font-size:.85rem;text-decoration:none;cursor:pointer}
.crm a.ghost:hover,.crm button.ghost:hover{border-color:rgba(232,114,42,.5);color:#fff}
.crm button.primary{padding:.6rem 1.05rem;border:none;border-radius:10px;background:linear-gradient(180deg,#ff8a4c,#e8722a);color:#160c04;font-weight:800;font-size:.85rem;cursor:pointer}
.crm button.primary:hover{filter:brightness(1.06)}
.crm button:disabled{opacity:.5;cursor:not-allowed}
.crm code{font-family:ui-monospace,Consolas,monospace;font-size:.82rem;background:rgba(232,114,42,.12);padding:.1rem .35rem;border-radius:5px;color:#f0a875}
.crm .notice{border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:1.6rem;background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.01));max-width:720px}
.crm .notice.err{border-color:rgba(226,84,66,.4)}
.crm .notice h3{font-family:var(--font-montserrat),sans-serif;font-weight:700;margin:0 0 .5rem;font-size:1.05rem}
.crm .notice p{color:#b3ada5;font-size:.9rem;line-height:1.7;margin:0}
.crm .tiles{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:.7rem;margin-bottom:1.3rem}
@media(max-width:760px){.crm .tiles{grid-template-columns:repeat(3,1fr)}}
@media(max-width:420px){.crm .tiles{grid-template-columns:repeat(2,1fr)}}
.crm .tile{--c:#e8722a;text-align:left;border:1px solid rgba(255,255,255,.1);border-radius:13px;padding:.9rem .95rem;
  background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.008));cursor:pointer;transition:.15s;display:flex;flex-direction:column;gap:.15rem}
.crm .tile:hover{border-color:rgba(255,255,255,.24)}
.crm .tile.active{border-color:var(--c);box-shadow:inset 0 0 0 1px var(--c),0 8px 24px rgba(0,0,0,.3)}
.crm .tile-n{font-family:var(--font-montserrat),sans-serif;font-weight:800;font-size:1.55rem;line-height:1;color:#fff}
.crm .tile.active .tile-n{color:var(--c)}
.crm .tile-l{font-size:.72rem;color:#9a948c;text-transform:uppercase;letter-spacing:.08em;font-weight:600}
.crm .toolbar{display:flex;align-items:center;gap:.9rem;margin-bottom:.9rem}
.crm .search{flex:1;max-width:440px;padding:.65rem .85rem;border:1px solid rgba(255,255,255,.14);border-radius:10px;background:rgba(0,0,0,.25);color:#f4f4f5;font-size:.9rem}
.crm .search:focus{outline:2px solid #e8722a;outline-offset:1px;border-color:#e8722a}
.crm .busy{color:#9a948c;font-size:.82rem}
.crm .table-wrap{border:1px solid rgba(255,255,255,.09);border-radius:14px;overflow-x:auto;background:rgba(255,255,255,.015)}
.crm table{width:100%;border-collapse:collapse;min-width:820px}
.crm thead th{text-align:left;font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:#8b857d;font-weight:700;padding:.85rem 1rem;border-bottom:1px solid rgba(255,255,255,.08);white-space:nowrap}
.crm tbody td{padding:.8rem 1rem;border-bottom:1px solid rgba(255,255,255,.05);font-size:.87rem;vertical-align:top}
.crm tbody tr:last-child td{border-bottom:none}
.crm tbody tr:hover{background:rgba(255,255,255,.02)}
.crm .ra{text-align:right;white-space:nowrap}
.crm .nm{font-weight:600;color:#f4f4f5}
.crm .msg{color:#8f8980;font-size:.78rem;margin-top:.2rem;max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.crm .lnk{color:#ff9d5e;text-decoration:none}.crm .lnk:hover{text-decoration:underline}
.crm .ph{color:#b3ada5;font-size:.8rem;margin-top:.15rem}
.crm .dim{color:#6d675f}
.crm .src{font-size:.75rem;color:#b3ada5;background:rgba(255,255,255,.05);padding:.15rem .5rem;border-radius:20px;border:1px solid rgba(255,255,255,.08)}
.crm .status-sel{--c:#888;appearance:none;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c);
  border:1px solid color-mix(in srgb,var(--c) 45%,transparent);border-radius:20px;padding:.28rem 1.6rem .28rem .7rem;
  font-size:.76rem;font-weight:700;cursor:pointer;
  background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
  background-position:calc(100% - 13px) 52%,calc(100% - 8px) 52%;background-size:5px 5px,5px 5px;background-repeat:no-repeat}
.crm .status-sel option{background:#161311;color:#f4f4f5}
.crm .empty{text-align:center;color:#8b857d;padding:2.4rem 1rem}
.crm .mini{padding:.35rem .7rem;border:1px solid rgba(255,255,255,.16);border-radius:8px;background:rgba(255,255,255,.03);color:#d8d3cc;font-size:.78rem;cursor:pointer;margin-left:.4rem}
.crm .mini:hover{border-color:rgba(232,114,42,.5);color:#fff}
.crm .mini.danger:hover{border-color:rgba(226,84,66,.6);color:#f0a89f}
.crm .overlay{position:fixed;inset:0;background:rgba(4,3,6,.72);backdrop-filter:blur(4px);display:grid;place-items:center;padding:1.5rem;z-index:50}
.crm .dialog{width:100%;max-width:560px;border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:1.7rem;
  background:linear-gradient(180deg,#141013,#0c0a0d);box-shadow:0 30px 80px rgba(0,0,0,.6);max-height:92vh;overflow-y:auto}
.crm .dialog h2{font-family:var(--font-montserrat),sans-serif;font-weight:800;font-size:1.2rem;margin:0 0 1.1rem}
.crm .grid2{display:grid;grid-template-columns:1fr 1fr;gap:.85rem}
@media(max-width:520px){.crm .grid2{grid-template-columns:1fr}}
.crm .f{display:block;margin-bottom:.85rem}
.crm .grid2 .f{margin-bottom:0}
.crm .f span{display:block;font-size:.74rem;font-weight:600;color:#cfc9c2;margin-bottom:.35rem}
.crm .f input,.crm .f select,.crm .f textarea{width:100%;padding:.6rem .7rem;border:1px solid rgba(255,255,255,.16);border-radius:9px;background:rgba(0,0,0,.3);color:#f4f4f5;font-size:.9rem;font-family:inherit}
.crm .f input:focus,.crm .f select:focus,.crm .f textarea:focus{outline:2px solid #e8722a;outline-offset:1px;border-color:#e8722a}
.crm .f select option{background:#161311}
.crm .dialog-actions{display:flex;justify-content:flex-end;gap:.6rem;margin-top:1.2rem}
.crm .toast{position:fixed;bottom:1.6rem;left:50%;transform:translateX(-50%);z-index:60;
  padding:.75rem 1.2rem;border-radius:11px;font-size:.88rem;font-weight:600;box-shadow:0 14px 40px rgba(0,0,0,.5);
  background:linear-gradient(180deg,#1f2a20,#16201a);border:1px solid rgba(62,207,142,.5);color:#a7ecc6}
.crm .toast.err{background:linear-gradient(180deg,#2a1a1a,#201414);border-color:rgba(226,84,66,.5);color:#f0a89f}
`;
