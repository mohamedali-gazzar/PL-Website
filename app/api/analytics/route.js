import { NextResponse } from "next/server";
import { getAnalytics, getRealtime } from "@/lib/ga4";
import { getVercelAnalytics } from "@/lib/vercelAnalytics";
import { isAuthed, ADMIN_COOKIE } from "@/lib/adminAuth";

// Node runtime (the GA4 client needs Node, not Edge) and never cached — always
// return fresh data.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  // Gate the endpoint behind the same admin session as the dashboard — no
  // public access to analytics data.
  if (!isAuthed(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    // TEMPORARY: ?debug=1 adds a `probe` field tracing the normal env-based
    // Vercel request (route is already admin-cookie-gated). No override — it
    // uses the same process.env.VERCEL_PROJECT_ID as the dashboard. Remove once
    // the normal path is confirmed working.
    const debug = searchParams.get("debug") === "1";
    // Realtime is independent of the reporting range and must not fail the whole
    // response if it errors — fetch it best-effort.
    const [data, realtime, vercel] = await Promise.all([
      getAnalytics({
        startDate: searchParams.get("start") || undefined,
        endDate: searchParams.get("end") || undefined,
      }),
      getRealtime().catch(() => null),
      getVercelAnalytics({ debug }).catch(() => ({ configured: true, diagnostics: ["request failed"] })),
    ]);
    return NextResponse.json({ ok: true, ...data, realtime, vercel });
  } catch (e) {
    const status = e?.code === "MISSING_CREDENTIALS" ? 501 : 502;
    return NextResponse.json(
      { ok: false, error: e?.message || "Failed to fetch Google Analytics data." },
      { status }
    );
  }
}
