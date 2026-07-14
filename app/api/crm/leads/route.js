import { NextResponse } from "next/server";
import { isAuthed, ADMIN_COOKIE } from "@/lib/adminAuth";
import { isCrmConfigured, listLeads, createLead, leadCounts } from "@/lib/crmDb";

// Node runtime (pg driver) and never cached — always fresh CRM data.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function guard(request) {
  if (!isAuthed(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isCrmConfigured()) {
    return NextResponse.json({ ok: false, error: "CRM database not configured" }, { status: 503 });
  }
  return null;
}

export async function GET(request) {
  const blocked = guard(request);
  if (blocked) return blocked;
  try {
    const { searchParams } = new URL(request.url);
    const [leads, counts] = await Promise.all([
      listLeads({ status: searchParams.get("status") || undefined, q: searchParams.get("q") || undefined }),
      leadCounts(),
    ]);
    return NextResponse.json({ ok: true, leads, counts });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed to load leads" }, { status: 500 });
  }
}

export async function POST(request) {
  const blocked = guard(request);
  if (blocked) return blocked;
  try {
    const body = await request.json().catch(() => ({}));
    const lead = await createLead({ ...body, source: "manual" });
    return NextResponse.json({ ok: true, lead }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed to create lead" }, { status: 500 });
  }
}
