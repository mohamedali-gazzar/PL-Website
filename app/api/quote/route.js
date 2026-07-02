import { NextResponse } from "next/server";
import { formEmail, isValidEmail } from "@/lib/content";
import { renderSubmissionEmail, sendEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  // Honeypot — silently accept obvious bots.
  if (data.website) return NextResponse.json({ ok: true });

  const name = (data.name || "").toString().trim();
  const email = (data.email || "").toString().trim();
  const message = (data.message || "").toString().trim();
  if (!name || !isValidEmail(email) || !message) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 422 });
  }

  const { html, text } = renderSubmissionEmail({
    title: "New quotation request",
    intro: "You received a new enquiry from the Powerline website.",
    rows: [
      { label: "Name", value: name },
      { label: "Company", value: data.company },
      { label: "Email", value: email },
      { label: "Phone", value: data.phone },
      { label: "Area of interest", value: data.interest },
    ],
    message,
    messageLabel: "Project details",
    name,
    email,
  });

  const sent = await sendEmail({
    to: formEmail,
    replyTo: email,
    subject: `New quotation request — ${name}`,
    html,
    text,
  });

  if (!sent.ok) {
    return NextResponse.json({ ok: false, error: sent.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
