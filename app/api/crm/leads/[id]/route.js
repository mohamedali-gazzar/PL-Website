import { NextResponse } from "next/server";
import { isAuthed, ADMIN_COOKIE } from "@/lib/adminAuth";
import { isCrmConfigured, getLead, updateLead, deleteLead } from "@/lib/crmDb";

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

export async function GET(request, { params }) {
  const blocked = guard(request);
  if (blocked) return blocked;
  try {
    const lead = await getLead(params.id);
    if (!lead) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, lead });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed to load lead" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const blocked = guard(request);
  if (blocked) return blocked;
  try {
    const body = await request.json().catch(() => ({}));
    const lead = await updateLead(params.id, body);
    if (!lead) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, lead });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const blocked = guard(request);
  if (blocked) return blocked;
  try {
    const removed = await deleteLead(params.id);
    if (!removed) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed to delete lead" }, { status: 500 });
  }
}
