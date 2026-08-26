import { NextResponse } from "next/server";
import { isAuthed, ADMIN_COOKIE } from "@/lib/adminAuth";
import { isCatalogDbConfigured, listCatalogLeads, toCsv } from "@/lib/catalogLeadsDb";

// Admin-only CSV export of catalogue leads (same admin session as the dashboard).
// Honours the optional ?q= search so the export matches what's on screen.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!isAuthed(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isCatalogDbConfigured()) {
    return NextResponse.json({ ok: false, error: "CRM database not configured" }, { status: 503 });
  }
  try {
    const q = new URL(request.url).searchParams.get("q") || undefined;
    const rows = await listCatalogLeads({ q });
    // Prepend a UTF-8 BOM so Excel opens non-ASCII (e.g. Arabic country) correctly.
    const csv = "\uFEFF" + toCsv(rows);
    const stamp = new Date().toISOString().slice(0, 10);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="catalogue-leads-${stamp}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Failed to export catalogue leads" },
      { status: 500 }
    );
  }
}
