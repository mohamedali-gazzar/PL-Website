import { NextResponse } from "next/server";
import crypto from "crypto";
import { isCrmConfigured, createLead, LEAD_SOURCES } from "@/lib/crmDb";

// Public-facing (no admin cookie) endpoint the marketing site's contact/careers
// forms POST to, so submissions auto-capture as CRM leads. Protected by a shared
// secret in the `x-crm-ingest-secret` header (constant-time compare), NOT the
// admin session — the website has no admin cookie.
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
  if (!isCrmConfigured()) {
    return NextResponse.json({ ok: false, error: "CRM database not configured" }, { status: 503 });
  }
  try {
    const body = await request.json().catch(() => ({}));
    // Only "contact"/"careers"/"api" are valid external sources; anything else
    // (incl. "manual") is coerced to "api" so ingested rows can't masquerade.
    const source = LEAD_SOURCES.includes(body.source) && body.source !== "manual" ? body.source : "api";
    const lead = await createLead({
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      message: body.message,
      source,
      status: "new",
    });
    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed to ingest lead" }, { status: 500 });
  }
}
