import { NextResponse } from "next/server";

/**
 * Stub endpoint for quotation requests.
 * Currently logs server-side and returns success. To go live, forward `data`
 * to Powerline's email (e.g. via Resend/Nodemailer) or CRM here.
 */
export async function POST(request) {
  try {
    const data = await request.json();
    if (!data?.name || !data?.email || !data?.message) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    console.log("[contact] quotation request:", {
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      interest: data.interest,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
