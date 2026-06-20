import { NextResponse } from "next/server";
import { formEmail } from "@/lib/content";

/**
 * Job applications (with CV attachment) → emailed to formEmail via
 * FormSubmit.co. The CV is forwarded as a file attachment. The first
 * submission triggers a one-time activation email to the recipient.
 */
export async function POST(request) {
  try {
    const incoming = await request.formData();
    const cv = incoming.get("cv");
    if (!incoming.get("name") || !incoming.get("email") || !cv || typeof cv === "string") {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    const fd = new FormData();
    fd.append("_subject", `New job application — ${incoming.get("name")}`);
    fd.append("_template", "table");
    fd.append("Name", incoming.get("name"));
    fd.append("Email", incoming.get("email"));
    fd.append("Phone", incoming.get("phone") || "-");
    fd.append("Position", incoming.get("position") || "-");
    fd.append("Message", incoming.get("message") || "-");
    fd.append("attachment", cv, cv.name); // CV emailed as attachment

    // FormSubmit rejects requests without a browser Origin/Referer.
    const origin =
      request.headers.get("origin") ||
      `https://${request.headers.get("host") || "powerlinei.com"}`;

    const res = await fetch(`https://formsubmit.co/${formEmail}`, {
      method: "POST",
      headers: { Origin: origin, Referer: `${origin}/careers` },
      body: fd,
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "Email service error" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
