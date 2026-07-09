// ─────────────────────────────────────────────────────────────────────────
// Server-only Vercel Web Analytics access.
// Reads VERCEL_API_TOKEN + VERCEL_PROJECT_ID from server env (never
// NEXT_PUBLIC_, never sent to the browser). Vercel does not publish an
// official Web-Analytics *query* API; the dashboard is backed by two internal
// endpoints that DO exist (verified via X-Matched-Path):
//     GET https://vercel.com/api/web-analytics/overview
//     GET https://vercel.com/api/web-analytics/timeseries
// The token goes in the Authorization header (never in a URL). These endpoints
// require a token with Web-Analytics read access, and — because pl-website is
// team-scoped — a teamId (VERCEL_TEAM_ID).
//
// The exact response shape is undocumented, so we parse defensively and any
// metric we can't find resolves to `null` → the UI shows
// "Not available from Vercel API" rather than inventing numbers. A metric that
// resolves but is empty returns `[]` ("available, no data yet").
// ─────────────────────────────────────────────────────────────────────────

const BASE = "https://vercel.com/api/web-analytics";

export function isVercelConfigured() {
  return Boolean(process.env.VERCEL_API_TOKEN && process.env.VERCEL_PROJECT_ID);
}

function baseParams(from, to) {
  const p = new URLSearchParams({
    projectId: process.env.VERCEL_PROJECT_ID,
    environment: "production",
    from,
    to,
  });
  // Team-scoped projects require the team id; personal (Hobby) projects don't.
  if (process.env.VERCEL_TEAM_ID) p.set("teamId", process.env.VERCEL_TEAM_ID);
  return p;
}

async function vaGet(path, params) {
  const res = await fetch(`${BASE}/${path}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${path} → HTTP ${res.status}${body ? `: ${body.slice(0, 120)}` : ""}`);
  }
  return res.json();
}

// Overview/timeseries may wrap payload under `data` — unwrap once.
const root = (json) => json?.data ?? json ?? {};

// Turn one breakdown row into {label,value} regardless of field names.
function normRow(r) {
  if (r == null || typeof r !== "object") return { label: "(not set)", value: 0 };
  return {
    label: String(
      r.key ?? r.name ?? r.label ?? r.path ?? r.pathname ?? r.referrer ??
      r.country ?? r.device ?? r.browser ?? r.os ?? r.value ?? "(not set)"
    ),
    value: Number(r.total ?? r.count ?? r.visitors ?? r.views ?? r.value ?? 0),
  };
}

// First array found among candidate keys → normalized rows, else null.
function pickArray(obj, keys, limit = 10) {
  for (const k of keys) {
    const v = obj?.[k];
    if (Array.isArray(v)) return v.slice(0, limit).map(normRow);
    if (v && Array.isArray(v.data)) return v.data.slice(0, limit).map(normRow);
  }
  return null;
}

// First number found among candidate keys (also handles {total}/{value}), else null.
function pickNum(obj, keys) {
  for (const k of keys) {
    const v = obj?.[k];
    if (typeof v === "number") return v;
    if (v && typeof v.total === "number") return v.total;
    if (v && typeof v.value === "number") return v.value;
  }
  return null;
}

async function fetchOverview(from, to, diag) {
  try {
    return root(await vaGet("overview", baseParams(from, to)));
  } catch (e) {
    diag.push(e.message);
    return null;
  }
}

// Sum the daily timeseries as a reliable fallback for visitors/pageviews.
async function fetchTimeseriesTotals(from, to, diag) {
  try {
    const p = baseParams(from, to);
    p.set("interval", "1d");
    const j = await vaGet("timeseries", p);
    const rows = j?.data ?? j?.rows ?? (Array.isArray(j) ? j : []);
    if (!Array.isArray(rows) || !rows.length) return { visitors: null, pageViews: null };
    let visitors = 0, pageViews = 0, sawV = false, sawP = false;
    for (const r of rows) {
      const v = r.visitors ?? r.devices ?? r.uniques;
      const pv = r.total ?? r.pageviews ?? r.pageViews ?? r.views ?? r.count;
      if (v != null) { visitors += Number(v) || 0; sawV = true; }
      if (pv != null) { pageViews += Number(pv) || 0; sawP = true; }
    }
    return { visitors: sawV ? visitors : null, pageViews: sawP ? pageViews : null };
  } catch (e) {
    diag.push(e.message);
    return { visitors: null, pageViews: null };
  }
}

/**
 * Pull the Vercel Web Analytics snapshot. Never throws — returns
 * { configured:false } when env vars are absent, otherwise an object whose
 * per-metric fields are an array (available) or null (unavailable).
 */
export async function getVercelAnalytics({ days = 30 } = {}) {
  if (!isVercelConfigured()) return { configured: false };

  const toD = new Date();
  const fromD = new Date(toD.getTime() - days * 86400000);
  const from = fromD.toISOString();
  const to = toD.toISOString();
  const diag = [];

  const [ov, ts] = await Promise.all([
    fetchOverview(from, to, diag),
    fetchTimeseriesTotals(from, to, diag),
  ]);

  // Totals: prefer explicit overview numbers, fall back to the timeseries sum.
  const visitors = pickNum(ov, ["visitors", "totalVisitors", "uniqueVisitors", "uniques", "devices"]) ?? ts.visitors;
  const pageViews = pickNum(ov, ["pageviews", "pageViews", "views", "totalPageviews", "total"]) ?? ts.pageViews;

  // Breakdowns are read from the overview payload under any plausible key.
  const topPages = pickArray(ov, ["pages", "paths", "topPages", "path", "pageviews_by_path"]);
  const referrers = pickArray(ov, ["referrers", "referrer", "topReferrers", "sources", "referrer_hostname"]);
  const countries = pickArray(ov, ["countries", "country", "geos", "locations"]);
  const devices = pickArray(ov, ["devices", "device", "deviceTypes", "device_type"]);
  const browsers = pickArray(ov, ["browsers", "browser", "browserNames", "browser_name"]);
  const os = pickArray(ov, ["os", "operatingSystems", "systems", "osNames", "os_name", "oses"]);

  const everythingNull =
    visitors === null && pageViews === null &&
    [topPages, referrers, countries, devices, browsers, os].every((x) => x === null);

  return {
    configured: true,
    range: { from: from.slice(0, 10), to: to.slice(0, 10) },
    visitors,
    pageViews,
    topPages,
    referrers,
    countries,
    devices,
    browsers,
    os,
    // Only surfaced (admin-only) when the whole source failed, to explain the
    // "Not available" state. The token is header-only, so it never leaks here.
    diagnostics: everythingNull ? Array.from(new Set(diag)).slice(0, 3) : [],
  };
}
