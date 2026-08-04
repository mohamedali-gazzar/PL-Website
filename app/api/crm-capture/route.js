import { NextResponse } from "next/server";

// Server-side proxy that forwards website form submissions to the CRM's ingest
// endpoint. The shared secret lives ONLY here (server env) — the browser calls
// this same-origin route, so the secret never reaches the client. Entirely
// best-effort: any failure returns quietly so the contact/careers email path
// (the primary channel) is never affected.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INGEST_URL = process.env.CRM_INGEST_URL || "https://pl-website-crm.vercel.app/api/crm/ingest";

export async function POST(request) {
  const secret = process.env.CRM_INGEST_SECRET;
  // If the CRM isn't wired up on this environment, no-op silently.
  if (!secret) return NextResponse.json({ ok: false, skipped: "not_configured" });

  let body = {};
  try { body = await request.json(); } catch { /* empty body */ }

  const source = body.source === "careers" ? "careers" : "contact";
  const payload = {
    name: body.name, email: body.email, phone: body.phone,
    company: body.company, message: body.message, source,
  };

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000); // don't hang the form
    const res = await fetch(INGEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-crm-ingest-secret": secret },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    return NextResponse.json({ ok: res.ok });
  } catch {
    // Swallow — CRM capture is secondary to the email and must never surface.
    return NextResponse.json({ ok: false });
  }
}
