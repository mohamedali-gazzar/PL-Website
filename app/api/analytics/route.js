import { NextResponse } from "next/server";
import { getAnalytics } from "@/lib/ga4";

// Node runtime (the GA4 client needs Node, not Edge) and never cached — always
// return fresh data.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
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
