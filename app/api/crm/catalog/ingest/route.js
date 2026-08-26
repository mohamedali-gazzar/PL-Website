import { NextResponse } from "next/server";
import crypto from "crypto";
import { isCatalogDbConfigured, createCatalogLead } from "@/lib/catalogLeadsDb";

// Public-facing (no admin cookie) endpoint the marketing site's catalogue
// unlock POSTs to, so every catalogue download is captured as a structured
// catalog_leads row. Protected by the SAME shared secret as /api/crm/ingest
// (`x-crm-ingest-secret`, constant-time compare), NOT the admin session — the
// website has no admin cookie.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function secretOk(request) {
  const expected = process.env.CRM_INGEST_SECRET;
  if (!expected) return false; // fail closed when unconfigured
  const got = request.headers.get("x-crm-ingest-secret") || "";
  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(request) {
  if (!secretOk(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isCatalogDbConfigured()) {
    return NextResponse.json({ ok: false, error: "CRM database not configured" }, { status: 503 });
  }
  try {
    const body = await request.json().catch(() => ({}));
    // source is fixed to "product_catalog" inside createCatalogLead — the caller
    // cannot override it, and it can never fall through to "api".
    const lead = await createCatalogLead(body);
    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Failed to ingest catalogue lead" },
      { status: 500 }
    );
  }
}
