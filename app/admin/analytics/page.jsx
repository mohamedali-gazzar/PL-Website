import { cookies } from "next/headers";
import { getAnalytics, getRealtime } from "@/lib/ga4";
import { getVercelAnalytics } from "@/lib/vercelAnalytics";
import { isAuthed, isConfigured, ADMIN_COOKIE } from "@/lib/adminAuth";

// Live data, Node runtime, never statically cached; keep it out of search engines.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Analytics · Powerline",
  robots: { index: false, follow: false },
};

const nf = new Intl.NumberFormat("en-US");
const dur = (s) => {
  s = Math.round(s || 0);
  const m = Math.floor(s / 60);
  return m ? `${m}m ${s % 60}s` : `${s}s`;
};
const pct = (x) => `${((x || 0) * 100).toFixed(1)}%`;
const shortDate = (iso) => (iso && iso.length === 10 ? iso.slice(5) : iso); // MM-DD

const CSS = `
.gax{min-height:100vh;background:#faf8f4;color:#1b1712;
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.55;padding-bottom:4rem}
.gax *{box-sizing:border-box;margin:0}
.gax .wrap{max-width:1080px;margin-inline:auto;padding-inline:clamp(1rem,4vw,2rem)}
.gax .mono{font-family:ui-monospace,Consolas,Menlo,monospace;font-variant-numeric:tabular-nums}
.gax h1,.gax h2,.gax h3{font-family:"Helvetica Neue",Arial,system-ui,sans-serif;line-height:1.1;font-weight:800}
.gax .band{background:#211d16;color:#f4efe8;position:relative;overflow:hidden}
.gax .band::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,transparent,#e8722a 15%,#e8722a 85%,transparent)}
.gax .band .wrap{padding-block:clamp(1.8rem,5vw,2.8rem)}
.gax .eyebrow{font-size:.72rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#e8722a}
.gax .band h1{font-size:clamp(1.7rem,4vw,2.5rem);text-transform:uppercase;letter-spacing:-.01em;color:#fff;margin:.7rem 0 .4rem}
.gax .band .sub{color:#c9bdae;font-size:.95rem}
.gax .badge{display:inline-flex;align-items:center;gap:.5rem;margin-top:1rem;padding:.45rem .85rem;border-radius:999px;
  background:rgba(46,125,70,.18);border:1px solid rgba(46,125,70,.5);color:#8fe0aa;font-size:.8rem;font-weight:600}
.gax .badge .d{width:.5rem;height:.5rem;border-radius:50%;background:#3fbf6a}
.gax section{margin-top:clamp(1.8rem,5vw,2.8rem)}
.gax .sec-h{font-size:.72rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#8a8072;margin-bottom:.9rem}
.gax .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.8rem}
.gax .kpi{background:#fff;border:1px solid #eae3d8;border-radius:14px;padding:1rem 1.1rem}
.gax .kpi .k{font-size:.74rem;color:#6f665a;font-weight:600;text-transform:uppercase;letter-spacing:.05em}
.gax .kpi .v{font-size:1.9rem;font-weight:800;margin-top:.35rem;font-variant-numeric:tabular-nums;line-height:1}
.gax .kpi .v.sm{font-size:1.4rem}
.gax .grid2{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.gax .panel{background:#fff;border:1px solid #eae3d8;border-radius:16px;padding:1.2rem 1.3rem}
.gax .panel h3{font-size:1rem;margin-bottom:1rem}
/* daily bar chart */
.gax .chart{display:flex;align-items:flex-end;gap:3px;height:170px;padding-top:.5rem;overflow-x:auto}
.gax .col{flex:1 0 14px;display:flex;flex-direction:column;align-items:center;gap:.4rem;min-width:14px}
.gax .col .bar{width:100%;max-width:26px;background:linear-gradient(180deg,#f08a45,#e8722a);border-radius:4px 4px 0 0;min-height:2px}
.gax .col .cd{font-size:.6rem;color:#9a9084;white-space:nowrap;transform:rotate(-45deg);transform-origin:center;height:1.2rem}
/* horizontal bar list */
.gax .hbars{display:flex;flex-direction:column;gap:.7rem}
.gax .hrow{display:grid;grid-template-columns:1fr;gap:.3rem}
.gax .hrow .top{display:flex;justify-content:space-between;gap:1rem;font-size:.86rem}
.gax .hrow .lab{color:#3f382f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gax .hrow .val{font-weight:700;font-variant-numeric:tabular-nums;color:#1b1712}
.gax .track{height:8px;background:#f0eae0;border-radius:999px;overflow:hidden}
.gax .fill{height:100%;background:#e8722a;border-radius:999px}
.gax .fill.g{background:#2e7d46}.gax .fill.b{background:#2b6c86}.gax .fill.v{background:#111}
.gax .empty{color:#9a9084;font-size:.9rem;padding:.5rem 0}
.gax .empty.na{font-style:italic;color:#b0a698}
.gax .na-sm{font-size:.95rem;font-weight:600;color:#b0a698;font-style:italic}
/* source divider (Vercel section) */
.gax .src{margin-top:2.8rem;border-top:2px solid #e4ddd0;padding-top:1.7rem}
.gax .src-head{display:flex;align-items:baseline;gap:.7rem;flex-wrap:wrap;margin-bottom:1.2rem}
.gax .src-head h2{font-size:1.45rem;letter-spacing:-.01em}
.gax .src-head .tag{font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#111;
  border:1px solid #d9d0c2;border-radius:999px;padding:.25rem .6rem}
.gax .src-head p{width:100%;font-size:.82rem;color:#8a8072}
.gax .note{margin-top:2.4rem;padding:1rem 1.2rem;background:#f4f0e9;border:1px solid #eae3d8;border-radius:12px;color:#6f665a;font-size:.84rem}
.gax .err{background:#fff;border:1px solid #f2c9c1;border-left:4px solid #bb3a2c;border-radius:14px;padding:1.4rem 1.5rem;margin-top:2rem}
.gax .err h2{font-size:1.15rem;color:#bb3a2c;margin-bottom:.6rem}
.gax .err p{color:#5c5348;font-size:.92rem;margin-bottom:.5rem}
.gax .err code{font-family:ui-monospace,Consolas,monospace;font-size:.82rem;background:#faf0ed;padding:.1rem .35rem;border-radius:5px;color:#8a2f22}
/* realtime */
.gax .rt{display:grid;grid-template-columns:minmax(180px,240px) 1fr;gap:1rem}
.gax .rt-main{background:#211d16;color:#fff;border-radius:16px;padding:1.3rem 1.4rem;display:flex;align-items:center;gap:1rem}
.gax .rt-dot{width:.7rem;height:.7rem;border-radius:50%;background:#3fbf6a;box-shadow:0 0 0 0 rgba(63,191,106,.6);animation:rtpulse 1.8s infinite}
@keyframes rtpulse{0%{box-shadow:0 0 0 0 rgba(63,191,106,.55)}70%{box-shadow:0 0 0 12px rgba(63,191,106,0)}100%{box-shadow:0 0 0 0 rgba(63,191,106,0)}}
@media (prefers-reduced-motion:reduce){.gax .rt-dot{animation:none}}
.gax .rt-num{font-size:2.6rem;font-weight:800;line-height:1;font-variant-numeric:tabular-nums}
.gax .rt-lab{font-size:.8rem;color:#c9bdae;margin-top:.3rem;text-transform:uppercase;letter-spacing:.05em}
.gax .rt-side{background:#fff;border:1px solid #eae3d8;border-radius:16px;padding:1.1rem 1.3rem;display:flex;align-items:center}
.gax .rt-side>*{width:100%}
@media (max-width:640px){.gax .rt{grid-template-columns:1fr}}
/* login */
.gax .login{max-width:420px;margin:3rem auto 0;background:#fff;border:1px solid #eae3d8;border-radius:16px;padding:1.9rem 1.8rem}
.gax .login h2{font-size:1.35rem;margin-bottom:.4rem}
.gax .login .lg-sub{color:#6f665a;font-size:.9rem;margin-bottom:1.3rem}
.gax .login .lg-err{background:#faf0ed;border:1px solid #f2c9c1;color:#a3352a;font-size:.85rem;padding:.6rem .8rem;border-radius:8px;margin-bottom:1rem}
.gax .login .lg-warn{background:#fbf6ea;border:1px solid #ecd9a8;color:#8a6d1f;font-size:.83rem;padding:.6rem .8rem;border-radius:8px;margin-bottom:1rem}
.gax .lg-field{display:block;margin-bottom:1.2rem}
.gax .lg-field span{display:block;font-size:.78rem;font-weight:600;color:#3f382f;margin-bottom:.4rem}
.gax .lg-field input{width:100%;padding:.72rem .85rem;border:1px solid #d9d0c2;border-radius:9px;font-size:1rem;background:#fbfaf7;color:#1b1712}
.gax .lg-field input:focus{outline:2px solid #e8722a;outline-offset:1px;border-color:#e8722a}
.gax .login button{width:100%;padding:.78rem;background:#e8722a;color:#fff;font-weight:700;font-size:.95rem;border:none;border-radius:9px;cursor:pointer}
.gax .login button:hover{background:#d5641f}
.gax .signout{display:inline-block;margin-top:1rem;color:#c9bdae;font-size:.8rem;text-decoration:underline}
@media (max-width:720px){.gax .grid2{grid-template-columns:1fr}}
`;

function LoginScreen({ error, configured }) {
  return (
    <div className="gax">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="band">
        <div className="wrap">
          <p className="eyebrow">Powerline · Admin</p>
          <h1>Analytics</h1>
          <p className="sub">Restricted area — sign in to continue</p>
        </div>
      </header>
      <div className="wrap">
        <form className="login" method="POST" action="/api/admin/login">
          <h2>Sign in</h2>
          <p className="lg-sub">Enter the admin password to view the analytics dashboard.</p>
          {error ? <p className="lg-err">Incorrect password. Please try again.</p> : null}
          {!configured ? (
            <p className="lg-warn">
              The <b>ANALYTICS_DASHBOARD_PASSWORD</b> environment variable isn’t set on the server, so sign-in
              is disabled. Add it in Vercel → Settings → Environment Variables, then redeploy.
            </p>
          ) : null}
          <label className="lg-field">
            <span>Password</span>
            <input type="password" name="password" autoComplete="current-password" required autoFocus />
          </label>
          <button type="submit" disabled={!configured}>Unlock dashboard</button>
        </form>
      </div>
    </div>
  );
}

function HBars({ items, labelKey, valueKey, max, fmt = (n) => nf.format(n), variant = "" }) {
  if (!items || items.length === 0) return <p className="empty">No data recorded in this range yet.</p>;
  const top = Math.max(1, max ?? Math.max(...items.map((i) => i[valueKey])));
  return (
    <div className="hbars">
      {items.map((it, i) => (
        <div className="hrow" key={i}>
          <div className="top">
            <span className="lab">{it[labelKey] || "(not set)"}</span>
            <span className="val">{fmt(it[valueKey])}</span>
          </div>
          <div className="track">
            <div className={`fill ${variant}`} style={{ width: `${(it[valueKey] / top) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// A Vercel metric is one of: array (available — maybe empty), or null (the API
// or plan didn't provide it → show a clear "not available" note, never fake it).
function VercelList({ items }) {
  if (items === null || items === undefined) return <p className="empty na">Not available from Vercel API</p>;
  if (items.length === 0) return <p className="empty">No data in this range yet.</p>;
  return <HBars items={items} labelKey="label" valueKey="value" variant="v" />;
}
function vkpi(v) {
  if (v === null || v === undefined) return <span className="na-sm">Not available from Vercel API</span>;
  return nf.format(v);
}

export default async function AnalyticsAdminPage({ searchParams }) {
  // Gate the dashboard behind the admin password (HttpOnly cookie session).
  if (!isAuthed(cookies().get(ADMIN_COOKIE)?.value)) {
    return <LoginScreen error={searchParams?.error} configured={isConfigured()} />;
  }

  let data = null;
  let realtime = null;
  let vercel = null;
  let error = null;
  try {
    // Realtime + Vercel are best-effort — a hiccup in either shouldn't blank the page.
    [data, realtime, vercel] = await Promise.all([
      getAnalytics(),
      getRealtime().catch(() => null),
      getVercelAnalytics().catch(() => ({ configured: true, diagnostics: ["request failed"] })),
    ]);
  } catch (e) {
    error = e?.message || "Could not load Google Analytics data.";
  }

  if (error) {
    return (
      <div className="gax">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <header className="band">
          <div className="wrap">
            <p className="eyebrow">Powerline · Admin</p>
            <h1>Analytics</h1>
            <p className="sub">Live Google Analytics 4 dashboard</p>
          </div>
        </header>
        <div className="wrap">
          <div className="err">
            <h2>Analytics data couldn’t be loaded</h2>
            <p>{error}</p>
            <p>
              Required server environment variables:&nbsp;
              <code>GA4_PROPERTY_ID</code>, <code>GOOGLE_CLIENT_EMAIL</code>, <code>GOOGLE_PRIVATE_KEY</code>.
              Also confirm the service-account email has <b>Viewer</b> access on the GA4 property, and that
              <code> GA4_PROPERTY_ID</code> is the numeric property ID (not the <code>G-XXXX</code> measurement ID).
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { totals, daily, topPages, sources, countries, cities, devices, browsers, range, propertyId } = data;
  const days = daily.slice(-30);
  const maxUsers = Math.max(1, ...days.map((d) => d.users));
  const hasData = totals.sessions > 0 || totals.totalUsers > 0;

  return (
    <div className="gax">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="band">
        <div className="wrap">
          <p className="eyebrow">Powerline · Admin</p>
          <h1>Analytics</h1>
          <p className="sub">Live Google Analytics 4 · property {propertyId} · {range.startDate} → {range.endDate}</p>
          <span className="badge"><span className="d" /> Connected to GA4 — real data</span>
          <div><a className="signout" href="/api/admin/login">Sign out</a></div>
        </div>
      </header>

      <div className="wrap">
        {/* Realtime — no processing lag, so this fills in the moment someone is on the site */}
        <section>
          <p className="sec-h">Right now · last 30 minutes</p>
          <div className="rt">
            <div className="rt-main">
              <span className="rt-dot" />
              <div>
                <div className="rt-num">{realtime ? nf.format(realtime.activeUsers) : "—"}</div>
                <div className="rt-lab">active users</div>
              </div>
            </div>
            <div className="rt-side">
              {realtime && realtime.byCountry?.length ? (
                <HBars items={realtime.byCountry.slice(0, 5)} labelKey="country" valueKey="users" variant="g" />
              ) : (
                <p className="empty">
                  {realtime ? "No one on the site this minute — open the site to see this update live." : "Realtime unavailable right now."}
                </p>
              )}
            </div>
          </div>
        </section>

        {!hasData && (
          <div className="note" style={{ marginTop: "1.4rem" }}>
            <b>Standard reports below read 0 so far — that’s expected.</b> Google Analytics processes standard
            reports with a delay (often a few hours, up to 24–48h), and the Data API these cards use does
            <b> not</b> include realtime. So live visitors show in <b>“Right now”</b> above immediately, but the
            Overview / charts fill in once GA finishes processing. Reading GA4 property <b>{propertyId}</b>.
          </div>
        )}

        {/* KPIs */}
        <section>
          <p className="sec-h">Overview</p>
          <div className="cards">
            <div className="kpi"><div className="k">Total users</div><div className="v">{nf.format(totals.totalUsers)}</div></div>
            <div className="kpi"><div className="k">Active users</div><div className="v">{nf.format(totals.activeUsers)}</div></div>
            <div className="kpi"><div className="k">New users</div><div className="v">{nf.format(totals.newUsers)}</div></div>
            <div className="kpi"><div className="k">Sessions</div><div className="v">{nf.format(totals.sessions)}</div></div>
            <div className="kpi"><div className="k">Page views</div><div className="v">{nf.format(totals.pageViews)}</div></div>
            <div className="kpi"><div className="k">Avg. session</div><div className="v sm">{dur(totals.avgSessionDuration)}</div></div>
            <div className="kpi"><div className="k">Engagement rate</div><div className="v sm">{pct(totals.engagementRate)}</div></div>
            <div className="kpi"><div className="k">Bounce rate</div><div className="v sm">{pct(totals.bounceRate)}</div></div>
          </div>
        </section>

        {/* Daily users */}
        <section>
          <p className="sec-h">Daily active users</p>
          <div className="panel">
            {days.length ? (
              <div className="chart">
                {days.map((d, i) => (
                  <div className="col" key={i} title={`${d.date}: ${nf.format(d.users)} users · ${nf.format(d.sessions)} sessions`}>
                    <div className="bar" style={{ height: `${(d.users / maxUsers) * 140 + 2}px` }} />
                    <span className="cd mono">{shortDate(d.date)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty">No daily data recorded in this range yet.</p>
            )}
          </div>
        </section>

        {/* Pages + Sources */}
        <section>
          <div className="grid2">
            <div className="panel">
              <h3>Top pages</h3>
              <HBars items={topPages} labelKey="path" valueKey="views" />
            </div>
            <div className="panel">
              <h3>Traffic sources</h3>
              <HBars items={sources} labelKey="channel" valueKey="sessions" variant="b" />
            </div>
          </div>
        </section>

        {/* Countries + Cities */}
        <section>
          <div className="grid2">
            <div className="panel">
              <h3>Top countries</h3>
              <HBars items={countries} labelKey="country" valueKey="users" variant="g" />
            </div>
            <div className="panel">
              <h3>Top cities</h3>
              <HBars items={cities} labelKey="city" valueKey="users" variant="g" />
            </div>
          </div>
        </section>

        {/* Devices + Browsers */}
        <section>
          <div className="grid2">
            <div className="panel">
              <h3>Devices</h3>
              <HBars items={devices} labelKey="device" valueKey="users" />
            </div>
            <div className="panel">
              <h3>Browsers</h3>
              <HBars items={browsers} labelKey="browser" valueKey="users" variant="b" />
            </div>
          </div>
        </section>

        <p className="note">
          Live figures from the Google Analytics 4 Data API (property fetched server-side; credentials never reach
          the browser). Data collection began 06–07 Jul 2026 — traffic before that date was not recorded. This page
          is <b>noindex</b> and refreshes on every load.
        </p>

        {/* ───────────────────────── Vercel Analytics (separate source) ───────────────────────── */}
        <section className="src">
          <div className="src-head">
            <h2>Vercel Analytics</h2>
            <span className="tag">▲ Vercel</span>
            <p>
              Source: Vercel Web Analytics API (fetched server-side; token never reaches the browser)
              {vercel?.range ? ` · ${vercel.range.from} → ${vercel.range.to}` : ""}
            </p>
          </div>

          {!vercel?.configured ? (
            <div className="note">
              Vercel Analytics isn’t configured — set <b>VERCEL_API_TOKEN</b> and <b>VERCEL_PROJECT_ID</b>
              &nbsp;(server-side, not <code>NEXT_PUBLIC_</code>) in Vercel, then redeploy.
            </div>
          ) : (
            <>
              <div className="cards" style={{ marginBottom: "1.1rem" }}>
                <div className="kpi"><div className="k">Visitors</div><div className="v">{vkpi(vercel.visitors)}</div></div>
                <div className="kpi"><div className="k">Page views</div><div className="v">{vkpi(vercel.pageViews)}</div></div>
              </div>

              <div className="grid2">
                <div className="panel"><h3>Top pages</h3><VercelList items={vercel.topPages} /></div>
                <div className="panel"><h3>Referrers</h3><VercelList items={vercel.referrers} /></div>
              </div>
              <div className="grid2" style={{ marginTop: "1rem" }}>
                <div className="panel"><h3>Countries</h3><VercelList items={vercel.countries} /></div>
                <div className="panel"><h3>Devices</h3><VercelList items={vercel.devices} /></div>
              </div>
              <div className="grid2" style={{ marginTop: "1rem" }}>
                <div className="panel"><h3>Browsers</h3><VercelList items={vercel.browsers} /></div>
                <div className="panel"><h3>Operating systems</h3><VercelList items={vercel.os} /></div>
              </div>

              {vercel.diagnostics?.length ? (
                <div className="note">
                  The Vercel API returned no data for any metric, so everything above shows
                  <b> “Not available from Vercel API.”</b> Common causes: the project is team-scoped
                  (add <b>VERCEL_TEAM_ID</b>), the token lacks analytics access, or the plan/endpoint doesn’t
                  expose this data. Detail: <code>{vercel.diagnostics.join(" · ")}</code>
                </div>
              ) : null}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
