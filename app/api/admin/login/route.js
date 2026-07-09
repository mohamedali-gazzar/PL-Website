import { NextResponse } from "next/server";
import { verifyPassword, makeToken, ADMIN_COOKIE } from "@/lib/adminAuth";

// Reads the password from the POSTed form, compares it server-side, and on
// success sets the HttpOnly session cookie. The password itself never leaves
// the server or gets echoed back.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const form = await request.formData();
  const password = form.get("password");

  if (!verifyPassword(password)) {
    // Wrong (or missing) password → back to the login screen with an error flag.
    return NextResponse.redirect(new URL("/admin/analytics?error=1", request.url), { status: 303 });
  }

  const res = NextResponse.redirect(new URL("/admin/analytics", request.url), { status: 303 });
  res.cookies.set(ADMIN_COOKIE, makeToken(), {
    httpOnly: true, // not readable from JS
    secure: process.env.NODE_ENV === "production", // https only in prod (allows http://localhost in dev)
    sameSite: "lax",
    path: "/",
    // Session cookie (no maxAge): clears when the browser session ends.
  });
  return res;
}

// Signing out clears the cookie.
export async function GET(request) {
  const res = NextResponse.redirect(new URL("/admin/analytics", request.url), { status: 303 });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
