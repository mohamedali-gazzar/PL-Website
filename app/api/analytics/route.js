import { NextResponse } from "next/server";
import { getAnalytics } from "@/lib/ga4";
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
    const data = await getAnalytics({
      startDate: searchParams.get("start") || undefined,
      endDate: searchParams.get("end") || undefined,
    });
    return NextResponse.json({ ok: true, ...data });
  } catch (e) {
    const status = e?.code === "MISSING_CREDENTIALS" ? 501 : 502;
    return NextResponse.json(
      { ok: false, error: e?.message || "Failed to fetch Google Analytics data." },
      { status }
    );
  }
}
