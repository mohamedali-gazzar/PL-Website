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
    const debug = searchParams.get("debug") === "1";

    // ── TEMPORARY DIAGNOSTIC OVERRIDE ───────────────────────────────────────
    // Admin-only (this route is already cookie-gated above). When ?debug=1, an
    // optional ?projectId= lets an admin probe a DIFFERENT Vercel project than
    // VERCEL_PROJECT_ID for the debug fetch only — to find which project holds
    // the data without redeploying. Value must start with "prj_". Team scope
    // stays empty unless a valid ?teamId=(team_…) or ?slug= is explicitly given.
    // The override never touches the normal dashboard queries. REMOVE this block
    // (and the debug override in lib/vercelAnalytics.js) once the correct
    // VERCEL_PROJECT_ID is confirmed.
    let debugScope;
    if (debug) {
      const pid = searchParams.get("projectId");
      if (pid && pid.startsWith("prj_")) {
        const teamId = searchParams.get("teamId");
        const slug = searchParams.get("slug");
        const team = teamId && teamId.startsWith("team_") ? teamId : slug || "";
        debugScope = { projectId: pid, team };
      }
    }

    // Realtime is independent of the reporting range and must not fail the whole
    // response if it errors — fetch it best-effort.
    const [data, realtime, vercel] = await Promise.all([
      getAnalytics({
        startDate: searchParams.get("start") || undefined,
        endDate: searchParams.get("end") || undefined,
      }),
      getRealtime().catch(() => null),
      getVercelAnalytics({ debug, debugScope }).catch(() => ({ configured: true, diagnostics: ["request failed"] })),
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
