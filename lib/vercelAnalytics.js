// ─────────────────────────────────────────────────────────────────────────
// Server-only Vercel Web Analytics access — OFFICIAL documented API.
//   Docs: https://vercel.com/docs/analytics/web-analytics-api
//   Host: https://api.vercel.com/v1/query/web-analytics/...
//     visits/count      → { data: { visitors, pageviews } }
//     visits/aggregate  → { data: [ { <dimension>, visitors, pageviews } ] }
//
// Auth: VERCEL_API_TOKEN in the Authorization header (never NEXT_PUBLIC_,
// never placed in a URL, never logged). Team projects require teamId; ours is
// team-scoped so VERCEL_TEAM_ID is sent. VERCEL_PROJECT_ID identifies the
// project. Any metric the API doesn't return degrades to null → the UI shows
// "Not available from Vercel API" rather than inventing data.
// ─────────────────────────────────────────────────────────────────────────

const API = "https://api.vercel.com/v1/query/web-analytics";

export function isVercelConfigured() {
  return Boolean(process.env.VERCEL_API_TOKEN && process.env.VERCEL_PROJECT_ID);
}

function buildParams(extra) {
  const p = new URLSearchParams();
  // Team projects need a team identifier; personal projects omit it. Vercel's
  // `teamId` expects the "team_xxx" ID form — a human team slug (e.g.
  // "acme-projects") must be sent as `slug` instead. Sending a slug as teamId
  // returns HTTP 400 ("invalid value"), so route it to the right param.
  const team = process.env.VERCEL_TEAM_ID;
  if (team) {
    if (team.startsWith("team_")) p.set("teamId", team);
    else p.set("slug", team);
  }
  p.set("projectId", process.env.VERCEL_PROJECT_ID);
  for (const [k, v] of Object.entries(extra || {})) p.set(k, String(v));
  return p;
}

async function apiGet(path, extra) {
  // The token is a header — it never appears in the URL, so error messages
  // (which include only the path + status + Vercel's reason) can't leak it.
  const res = await fetch(`${API}/${path}?${buildParams(extra).toString()}`, {
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    // Surface Vercel's own error reason. The response body carries a
    // { error: { code, message } } — none of which is the token (that's only
    // in the request header), so it's safe to include and makes 400s debuggable.
    let reason = "";
    try {
      const body = await res.json();
      reason = body?.error?.message || body?.error?.code || "";
    } catch {
      /* non-JSON error body — status alone will have to do */
    }
    throw new Error(`${path} → HTTP ${res.status}${reason ? ` — ${reason}` : ""}`);
  }
  return res.json();
}

const numOrNull = (v) => (typeof v === "number" ? v : v == null ? null : Number(v));

function labelize(v, dim) {
  if (v === "" || v == null) return dim === "referrerHostname" ? "Direct / none" : "(not set)";
  return String(v);
}

async function totals(since, until, diag) {
  try {
    const j = await apiGet("visits/count", { since, until });
    const d = j?.data || {};
    return { visitors: numOrNull(d.visitors), pageViews: numOrNull(d.pageviews) };
  } catch (e) {
    diag.push(e.message);
    return { visitors: null, pageViews: null };
  }
}

// Daily visitors/pageviews trend for the area chart (mirrors the GA daily).
async function dailySeries(since, until, diag) {
  try {
    const j = await apiGet("visits/aggregate", { since, until, by: "day", limit: 100 });
    const rows = j?.data;
    if (!Array.isArray(rows)) return null;
    return rows.map((r) => ({
      date: String(r.timestamp || "").slice(0, 10),
      visitors: Number(r.visitors || 0),
      pageViews: Number(r.pageviews || 0),
    }));
  } catch (e) {
    diag.push(e.message);
    return null;
  }
}

// Grouped breakdown: one row per dimension value (Vercel rolls the long tail
// into an "Others" row). `metric` picks which number to chart per row.
async function breakdown(by, metric, limit, since, until, diag) {
  try {
    const j = await apiGet("visits/aggregate", { since, until, by, limit });
    const rows = j?.data;
    if (!Array.isArray(rows)) return null;
    return rows.slice(0, limit).map((r) => ({
      label: labelize(r[by], by),
      value: Number(r[metric] ?? r.visitors ?? 0),
    }));
  } catch (e) {
    diag.push(e.message);
    return null;
  }
}

/**
 * Pull the Vercel Web Analytics snapshot from the official API. Never throws —
 * returns { configured:false } when env vars are absent, otherwise an object
 * whose per-metric fields are an array/number (available) or null (unavailable).
 */
export async function getVercelAnalytics({ days = 30 } = {}) {
  if (!isVercelConfigured()) return { configured: false };

  const untilD = new Date();
  const sinceD = new Date(untilD.getTime() - days * 86400000);
  const since = sinceD.toISOString().slice(0, 10); // YYYY-MM-DD
  const until = untilD.toISOString().slice(0, 10);
  const diag = [];

  const [tot, daily, topPages, referrers, countries, devices, browsers, os] = await Promise.all([
    totals(since, until, diag),
    dailySeries(since, until, diag),
    breakdown("requestPath", "pageviews", 10, since, until, diag),
    breakdown("referrerHostname", "visitors", 10, since, until, diag),
    breakdown("country", "visitors", 10, since, until, diag),
    breakdown("deviceType", "visitors", 5, since, until, diag),
    breakdown("browserName", "visitors", 8, since, until, diag),
    breakdown("osName", "visitors", 8, since, until, diag),
  ]);

  const everythingNull =
    tot.visitors === null && tot.pageViews === null &&
    [topPages, referrers, countries, devices, browsers, os].every((x) => x === null);

  return {
    configured: true,
    range: { from: since, to: until },
    visitors: tot.visitors,
    pageViews: tot.pageViews,
    daily,
    topPages,
    referrers,
    countries,
    devices,
    browsers,
    os,
    // Only surfaced (admin-only) when the whole source failed. Contains
    // "path → HTTP status — <Vercel reason>" strings — never the token.
    diagnostics: everythingNull ? Array.from(new Set(diag)).slice(0, 3) : [],
  };
}
