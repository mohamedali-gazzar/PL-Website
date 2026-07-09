import { NextResponse } from "next/server";
import { getAnalytics, getRealtime } from "@/lib/ga4";
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
    // Realtime is independent of the reporting range and must not fail the whole
    // response if it errors — fetch it best-effort.
    const [data, realtime] = await Promise.all([
      getAnalytics({
        startDate: searchParams.get("start") || undefined,
        endDate: searchParams.get("end") || undefined,
      }),
      getRealtime().catch(() => null),
    ]);
    return NextResponse.json({ ok: true, ...data, realtime });
  } catch (e) {
    const status = e?.code === "MISSING_CREDENTIALS" ? 501 : 502;
    return NextResponse.json(
      { ok: false, error: e?.message || "Failed to fetch Google Analytics data." },
      { status }
    );
  }
}
