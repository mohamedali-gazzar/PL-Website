import { NextResponse } from "next/server";
import { formEmail } from "@/lib/content";

/**
 * Quotation / contact requests → emailed to formEmail via FormSubmit.co
 * (no API key needed). The first submission triggers a one-time activation
 * email to the recipient; once confirmed, all submissions are delivered.
 */
export async function POST(request) {
  try {
    const data = await request.json();
    if (!data?.name || !data?.email || !data?.message) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    // FormSubmit rejects requests without a browser Origin/Referer.
    const origin =
      request.headers.get("origin") ||
      `https://${request.headers.get("host") || "powerlinei.com"}`;

    const res = await fetch(`https://formsubmit.co/ajax/${formEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: origin,
        Referer: `${origin}/contact`,
      },
      body: JSON.stringify({
        _subject: `New quotation request — ${data.name}`,
        _template: "table",
        Name: data.name,
        Company: data.company || "-",
        Email: data.email,
        Phone: data.phone || "-",
        "Area of interest": data.interest || "-",
        Message: data.message,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "Email service error" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
