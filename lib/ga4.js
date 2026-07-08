// ─────────────────────────────────────────────────────────────────────────
// Server-only Google Analytics 4 data access (GA4 Data API).
// Credentials come from server env vars (never NEXT_PUBLIC_) and are only ever
// read here — this module must only be imported from server code (API routes /
// server components). Nothing here is sent to the browser.
// ─────────────────────────────────────────────────────────────────────────
import { BetaAnalyticsDataClient } from "@google-analytics/data";

let _client = null;

function getClient() {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  const missing = [];
  if (!propertyId) missing.push("GA4_PROPERTY_ID");
  if (!clientEmail) missing.push("GOOGLE_CLIENT_EMAIL");
  if (!rawKey) missing.push("GOOGLE_PRIVATE_KEY");
  if (missing.length) {
    const err = new Error(
      `Google Analytics is not configured — missing ${missing.join(", ")}. ` +
        `Set these environment variables (server-side, not NEXT_PUBLIC_) in Vercel → Settings → Environment Variables, then redeploy.`
    );
    err.code = "MISSING_CREDENTIALS";
    throw err;
  }

  // Env vars store the PEM key on a single line with escaped "\n" — restore
  // the real line breaks so the private key parses.
  const privateKey = rawKey.replace(/\\n/g, "\n");

  if (!_client) {
    _client = new BetaAnalyticsDataClient({
      credentials: { client_email: clientEmail, private_key: privateKey },
    });
  }
  return { client: _client, property: `properties/${propertyId}` };
}

const num = (v) => Number(v || 0);
const mv = (row, i) => num(row?.metricValues?.[i]?.value);
const dv = (row, i) => row?.dimensionValues?.[i]?.value ?? "";
const fmtDate = (d) =>
  d && d.length === 8 ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}` : d;

/**
 * Fetch the full analytics snapshot for the dashboard + report.
 * @param {{startDate?:string, endDate?:string}} opts GA4 date range
 *   (defaults cover the site's launch window through today).
 * @throws Error with .code="MISSING_CREDENTIALS" if env vars are absent.
 */
export async function getAnalytics({ startDate = "2026-06-01", endDate = "today" } = {}) {
  const { client, property } = getClient();
  const dateRanges = [{ startDate, endDate }];

  // The GA4 Data API caps batchRunReports at 5 requests per batch, so the 8
  // reports are split across two batches and run in parallel.
  const batchA = [
    // 0 — totals
    {
      dateRanges,
      metrics: [
        { name: "totalUsers" },
        { name: "activeUsers" },
        { name: "newUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "averageSessionDuration" },
        { name: "engagementRate" },
        { name: "bounceRate" },
      ],
    },
    // 1 — daily
    {
      dateRanges,
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    },
    // 2 — top pages
    {
      dateRanges,
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 12,
    },
    // 3 — traffic sources (channel grouping)
    {
      dateRanges,
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }, { name: "totalUsers" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    },
    // 4 — countries
    {
      dateRanges,
      dimensions: [{ name: "country" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10,
    },
  ];

  const batchB = [
    // 5 — cities
    {
      dateRanges,
      dimensions: [{ name: "city" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10,
    },
    // 6 — devices
    {
      dateRanges,
      dimensions: [{ name: "deviceCategory" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    },
    // 7 — browsers
    {
      dateRanges,
      dimensions: [{ name: "browser" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 8,
    },
  ];

  const [[resA], [resB]] = await Promise.all([
    client.batchRunReports({ property, requests: batchA }),
    client.batchRunReports({ property, requests: batchB }),
  ]);

  // Re-join both batches into the original 0..7 report order.
  const R = [...(resA.reports || []), ...(resB.reports || [])];
  const t = R[0]?.rows?.[0];

  return {
    range: { startDate, endDate },
    totals: {
      totalUsers: mv(t, 0),
      activeUsers: mv(t, 1),
      newUsers: mv(t, 2),
      sessions: mv(t, 3),
      pageViews: mv(t, 4),
      avgSessionDuration: mv(t, 5), // seconds
      engagementRate: mv(t, 6), // 0..1
      bounceRate: mv(t, 7), // 0..1
    },
    daily: (R[1]?.rows || []).map((r) => ({
      date: fmtDate(dv(r, 0)),
      users: mv(r, 0),
      sessions: mv(r, 1),
      pageViews: mv(r, 2),
    })),
    topPages: (R[2]?.rows || []).map((r) => ({ path: dv(r, 0), views: mv(r, 0), users: mv(r, 1) })),
    sources: (R[3]?.rows || []).map((r) => ({ channel: dv(r, 0), sessions: mv(r, 0), users: mv(r, 1) })),
    countries: (R[4]?.rows || []).map((r) => ({ country: dv(r, 0), users: mv(r, 0) })),
    cities: (R[5]?.rows || []).map((r) => ({ city: dv(r, 0), users: mv(r, 0) })),
    devices: (R[6]?.rows || []).map((r) => ({ device: dv(r, 0), users: mv(r, 0), sessions: mv(r, 1) })),
    browsers: (R[7]?.rows || []).map((r) => ({ browser: dv(r, 0), users: mv(r, 0) })),
  };
}
