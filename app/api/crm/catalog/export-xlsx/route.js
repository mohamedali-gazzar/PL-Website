import { NextResponse } from "next/server";
import { isAuthed, ADMIN_COOKIE } from "@/lib/adminAuth";
import { isCatalogDbConfigured, listCatalogLeads, toRowsMatrix } from "@/lib/catalogLeadsDb";
import { buildXlsx } from "@/lib/xlsx";

// Admin-only Excel (.xlsx) export of catalogue leads — same admin session and
// optional ?q= search as the CSV export; identical columns/values, delivered as
// a real Excel workbook (bold header) rather than CSV.
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
    const buf = buildXlsx(toRowsMatrix(rows), "Catalogue Leads");
    const stamp = new Date().toISOString().slice(0, 10);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="catalogue-leads-${stamp}.xlsx"`,
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
