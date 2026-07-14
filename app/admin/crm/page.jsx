import { cookies } from "next/headers";
import { isAuthed, isConfigured, ADMIN_COOKIE } from "@/lib/adminAuth";
import { isCrmConfigured, listLeads, leadCounts } from "@/lib/crmDb";
import CrmBoard from "./CrmBoard";

// Server component: admin gate + initial data load (server-only DB creds),
// then hands plain data to the client board. Live, uncached, noindex.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "CRM · Powerline",
  robots: { index: false, follow: false },
};

const SHELL_CSS = `
.plshell{min-height:100vh;display:grid;place-items:center;padding:2rem;
  color:#f4f4f5;font-family:var(--font-poppins),system-ui,sans-serif;
  background:radial-gradient(1000px 560px at 80% -10%,rgba(232,114,42,.14),transparent 60%),#060507}
.plshell *{box-sizing:border-box;margin:0}
.plshell .shell-card{width:100%;max-width:430px;border:1px solid rgba(255,255,255,.1);border-radius:20px;
  padding:2rem 1.9rem;background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.015));position:relative;overflow:hidden}
.plshell .shell-card::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,#e8722a,#ff8a4c,#e8722a,transparent)}
.plshell .eyebrow{font-size:.7rem;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:#e8722a}
.plshell h1{font-family:var(--font-montserrat),sans-serif;font-weight:800;font-size:1.7rem;text-transform:uppercase;letter-spacing:-.01em;margin:.55rem 0 .5rem}
.plshell .muted{color:#a1a1aa;font-size:.9rem;margin-bottom:1.3rem}
.plshell .err-line{background:rgba(226,84,66,.12);border:1px solid rgba(226,84,66,.4);color:#f0a89f;font-size:.85rem;padding:.6rem .8rem;border-radius:9px;margin-bottom:1rem}
.plshell .warn-line{background:rgba(232,180,42,.1);border:1px solid rgba(232,180,42,.35);color:#e6c778;font-size:.82rem;padding:.6rem .8rem;border-radius:9px;margin-bottom:1rem}
.plshell .fld{display:block;margin-bottom:1.1rem}
.plshell .fld span{display:block;font-size:.76rem;font-weight:600;color:#cfc9c2;margin-bottom:.4rem}
.plshell .fld input{width:100%;padding:.75rem .85rem;border:1px solid rgba(255,255,255,.16);border-radius:10px;font-size:1rem;background:rgba(0,0,0,.25);color:#f4f4f5}
.plshell .fld input:focus{outline:2px solid #e8722a;outline-offset:1px;border-color:#e8722a}
.plshell button{width:100%;padding:.8rem;background:linear-gradient(180deg,#ff8a4c,#e8722a);color:#160c04;font-weight:800;font-size:.95rem;border:none;border-radius:10px;cursor:pointer}
.plshell button:hover{filter:brightness(1.06)}
.plshell button:disabled{opacity:.5;cursor:not-allowed}
.plshell code{font-family:ui-monospace,Consolas,monospace;font-size:.82rem;background:rgba(232,114,42,.12);padding:.1rem .35rem;border-radius:5px;color:#f0a875}
`;

function LoginScreen({ error, configured }) {
  return (
    <div className="plshell">
      <style dangerouslySetInnerHTML={{ __html: SHELL_CSS }} />
      <div className="shell-card">
        <p className="eyebrow">Powerline · Admin</p>
        <h1>CRM</h1>
        <p className="muted">Enter the admin password to view the CRM.</p>
        {error ? <p className="err-line">Incorrect password. Please try again.</p> : null}
        {!configured ? (
          <p className="warn-line">
            <b>ANALYTICS_DASHBOARD_PASSWORD</b> isn’t set on the server, so sign-in is disabled. Add it in Vercel, then redeploy.
          </p>
        ) : null}
        <form method="POST" action="/api/admin/login">
          <label className="fld"><span>Password</span>
            <input type="password" name="password" autoComplete="current-password" required autoFocus />
          </label>
          <button type="submit" disabled={!configured}>Unlock CRM</button>
        </form>
      </div>
    </div>
  );
}

export default async function CrmAdminPage({ searchParams }) {
  if (!isAuthed(cookies().get(ADMIN_COOKIE)?.value)) {
    return <LoginScreen error={searchParams?.error} configured={isConfigured()} />;
  }

  const configured = isCrmConfigured();
  let leads = [];
  let counts = { total: 0, byStatus: {} };
  let dbError = null;
  if (configured) {
    try {
      [leads, counts] = await Promise.all([listLeads(), leadCounts()]);
    } catch (e) {
      dbError = e?.message || "Could not reach the CRM database.";
    }
  }

  return <CrmBoard initialLeads={leads} initialCounts={counts} configured={configured} dbError={dbError} />;
}
