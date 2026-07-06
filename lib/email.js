// Powerline-branded submission emails, sent via Resend from the server.
// The API key lives only in env (RESEND_API_KEY) and never reaches the browser.

const ORANGE = "#e8722a";

/** Escape user input before putting it in the email HTML. */
export function escapeHtml(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Render a dark, Powerline-branded submission email (HTML + plain-text).
 * @param {{title:string, intro:string, rows:{label:string,value:string}[],
 *          message?:string, messageLabel?:string, name:string, email:string,
 *          attachmentNote?:string}} data
 */
export function renderSubmissionEmail({
  title,
  intro,
  rows,
  message,
  messageLabel = "Message",
  name,
  email,
  attachmentNote,
}) {
  const rowsHtml = rows
    .filter((r) => r.value && String(r.value).trim())
    .map(
      (r) => `
      <tr>
        <td style="padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:${ORANGE};vertical-align:top;width:36%;">${escapeHtml(
        r.label
      )}</td>
        <td style="padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#f4f4f5;vertical-align:top;">${escapeHtml(
        r.value
      )}</td>
      </tr>`
    )
    .join("");

  const messageBlock = message
    ? `
      <tr><td style="padding:8px 32px 4px;">
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:${ORANGE};margin:0 0 8px;">${escapeHtml(
          messageLabel
        )}</div>
        <div style="background:#0a0a0c;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px 16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#f4f4f5;white-space:pre-wrap;">${escapeHtml(
          message
        )}</div>
      </td></tr>`
    : "";

  const attachBlock = attachmentNote
    ? `
      <tr><td style="padding:6px 32px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#a1a1aa;">
        <span style="color:${ORANGE};font-weight:bold;">&#128206;</span> ${escapeHtml(
          attachmentNote
        )}
      </td></tr>`
    : "";

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#050506;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050506;padding:26px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#111114;border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;">
            <tr><td style="height:4px;line-height:4px;font-size:0;background:${ORANGE};">&nbsp;</td></tr>
            <tr>
              <td style="padding:26px 32px 6px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;letter-spacing:0.22em;color:#ffffff;">POWER<span style="color:${ORANGE};">LINE</span></div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:19px;font-weight:bold;color:#ffffff;margin-top:16px;">${escapeHtml(
                  title
                )}</div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#a1a1aa;margin-top:6px;">${escapeHtml(
                  intro
                )}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 32px 4px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rowsHtml}</table>
              </td>
            </tr>
            ${messageBlock}
            ${attachBlock}
            <tr>
              <td style="padding:20px 32px 26px;">
                <a href="mailto:${escapeHtml(
                  email
                )}" style="display:inline-block;background:${ORANGE};color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 24px;border-radius:8px;">Reply to ${escapeHtml(
    name || "sender"
  )}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.08);font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b6b72;">
                Sent from the Powerline website &middot; powerlinei.com
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text =
    `${title}\n${intro}\n\n` +
    rows
      .filter((r) => r.value && String(r.value).trim())
      .map((r) => `${r.label}: ${r.value}`)
      .join("\n") +
    (message ? `\n\n${messageLabel}:\n${message}` : "") +
    (attachmentNote ? `\n\n${attachmentNote}` : "") +
    `\n\nReply to: ${email}`;

  return { html, text };
}

/**
 * Send an email through Resend. Returns { ok, error }.
 * @param {{to:string, replyTo?:string, subject:string, html:string,
 *          text:string, attachments?:{filename:string,content:string}[]}} opts
 */
export async function sendEmail({ to, replyTo, subject, html, text, attachments }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return { ok: false, error: "RESEND_API_KEY is not configured on the server." };
  }
  const from = process.env.RESEND_FROM || "Powerline Website <onboarding@resend.dev>";
  // Optional override so the recipient can be redirected without a code change
  // (e.g. to the Resend account address while a sending domain is being verified).
  const recipient = process.env.RESEND_TO || to;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: replyTo,
        subject,
        html,
        text,
        ...(attachments && attachments.length ? { attachments } : {}),
      }),
    });

    if (res.ok) return { ok: true };
    const detail = await res.json().catch(() => ({}));
    return { ok: false, error: detail?.message || `Resend responded ${res.status}` };
  } catch (e) {
    return { ok: false, error: "Could not reach the email service." };
  }
}
