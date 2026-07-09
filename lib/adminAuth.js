// ─────────────────────────────────────────────────────────────────────────
// Server-only auth for the /admin area.
// The password lives ONLY in ANALYTICS_DASHBOARD_PASSWORD (server env, never
// NEXT_PUBLIC_). We never send the password to the browser; instead we set an
// HttpOnly cookie holding a SHA-256 token derived from it. Every request
// recomputes the expected token and compares in constant time — no session
// store needed, and the cookie is useless without the server-side secret.
// ─────────────────────────────────────────────────────────────────────────
import crypto from "crypto";

export const ADMIN_COOKIE = "pl_admin_auth";

function tokenFor(password) {
  return crypto.createHash("sha256").update(`pl-admin::${password}`).digest("hex");
}

/** True if the admin password env var is configured at all. */
export function isConfigured() {
  return typeof process.env.ANALYTICS_DASHBOARD_PASSWORD === "string" &&
    process.env.ANALYTICS_DASHBOARD_PASSWORD.length > 0;
}

/** The cookie token value for a valid session (null if no password configured). */
export function makeToken() {
  if (!isConfigured()) return null;
  return tokenFor(process.env.ANALYTICS_DASHBOARD_PASSWORD);
}

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/** Constant-time check of a submitted password against the env var. */
export function verifyPassword(input) {
  if (!isConfigured() || input == null) return false;
  return safeEqual(input, process.env.ANALYTICS_DASHBOARD_PASSWORD);
}

/** True if a request's cookie value proves a valid admin session. */
export function isAuthed(cookieValue) {
  const expected = makeToken();
  if (!expected || !cookieValue) return false;
  return safeEqual(cookieValue, expected);
}
