import { NextResponse } from "next/server";
import { formEmail, isValidEmail } from "@/lib/content";
import { renderSubmissionEmail, sendEmail } from "@/lib/email";

export const runtime = "nodejs";

// Keep under Vercel's ~4.5MB request-body cap.
const MAX_CV_BYTES = 4 * 1024 * 1024;

export async function POST(request) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  // Honeypot.
  if (form.get("website")) return NextResponse.json({ ok: true });

  const name = (form.get("name") || "").toString().trim();
  const email = (form.get("email") || "").toString().trim();
  const cv = form.get("cv");

  if (!name || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 422 });
  }
  if (!cv || typeof cv === "string" || !cv.name) {
    return NextResponse.json({ ok: false, error: "A CV file is required" }, { status: 422 });
  }
  if (cv.size > MAX_CV_BYTES) {
    return NextResponse.json(
      { ok: false, error: "CV is too large (max 4MB). Please compress it." },
      { status: 413 }
    );
  }

  const buf = Buffer.from(await cv.arrayBuffer());
  const attachments = [{ filename: cv.name, content: buf.toString("base64") }];

  const { html, text } = renderSubmissionEmail({
    title: "New job application",
    intro: "You received a new application from the Powerline website.",
    rows: [
      { label: "Name", value: name },
      { label: "Email", value: email },
      { label: "Phone", value: (form.get("phone") || "").toString() },
      { label: "Position of interest", value: (form.get("position") || "").toString() },
    ],
    message: (form.get("message") || "").toString().trim() || undefined,
    messageLabel: "Message",
    name,
    email,
    attachmentNote: `CV attached: ${cv.name}`,
  });

  const sent = await sendEmail({
    to: formEmail,
    replyTo: email,
    subject: `New job application — ${name}`,
    html,
    text,
    attachments,
  });

  if (!sent.ok) {
    return NextResponse.json({ ok: false, error: sent.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
