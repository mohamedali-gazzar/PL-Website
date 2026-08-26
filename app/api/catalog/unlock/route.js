import { NextResponse } from "next/server";
import { forwardCatalogLeadToCrm } from "@/lib/crm";
import { getCatalog } from "@/lib/catalogs";
import { isValidEmail } from "@/lib/content";
import {
  createAccessToken,
  verifyAccessToken,
  cookieName,
  ACCESS_TTL_DAYS,
} from "@/lib/catalogAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/catalog/unlock?slug=psec  → { unlocked: boolean }
// Lets the client know (authoritatively, via the signed cookie) whether a
// returning visitor already has access — so they don't re-fill the form.
export async function GET(request) {
  const slug = new URL(request.url).searchParams.get("slug") || "";
  const cat = getCatalog(slug);
  if (!cat) return NextResponse.json({ unlocked: false });
  const token = request.cookies.get(cookieName(slug))?.value;
  return NextResponse.json({ unlocked: verifyAccessToken(token, slug) });
}

// POST /api/catalog/unlock  → validate + save lead + grant access cookie
export async function POST(request) {
  let b = {};
  try {
    b = await request.json();
  } catch {
    /* empty body */
  }

  const cat = getCatalog(b.slug);
  if (!cat) {
    return NextResponse.json({ ok: false, error: "Unknown catalogue." }, { status: 400 });
  }

  const name = String(b.name || "").trim();
  const company = String(b.company || "").trim();
  const email = String(b.email || "").trim();
  const phone = String(b.phone || "").trim();
  const country = String(b.country || "").trim();

  const errors = {};
  if (!name) errors.name = "Please enter your name";
  if (!company) errors.company = "Enter your company";
  if (!isValidEmail(email)) errors.email = "Enter a valid work email";
  if (!phone) errors.phone = "Enter your phone number";
  if (!country) errors.country = "Enter your country";
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const engineer = b.engineerContact === true || b.engineerContact === "true";
  const utm =
    b.utm && typeof b.utm === "object"
      ? Object.entries(b.utm)
          .filter(([, v]) => v)
          .map(([k, v]) => `${k}=${v}`)
          .join(", ")
      : "";

  // Save the catalogue lead as its own structured record (source
  // "product_catalog") in the CRM's dedicated catalog_leads store. Every
  // catalogue field is a discrete column — nothing is packed into a text blob.
  const crm = await forwardCatalogLeadToCrm({
    name,
    company,
    email,
    phone,
    country,
    product: cat.productName,
    slug: cat.slug,
    catalogue: cat.title,
    pageUrl: typeof b.pageUrl === "string" ? b.pageUrl : "",
    referrer: typeof b.referrer === "string" ? b.referrer : "",
    utm,
    engineerContact: engineer,
  });

  // Do NOT grant access if lead capture actually failed. If the CRM simply
  // isn't configured on this environment (skipped), we still grant so the
  // feature works pre-config; a configured-but-failing CRM blocks the unlock.
  if (crm.ok === false && crm.skipped !== "not_configured") {
    return NextResponse.json(
      { ok: false, error: "We couldn't submit your details just now. Please try again." },
      { status: 502 }
    );
  }

  const res = NextResponse.json({
    ok: true,
    crm: crm.ok ? "saved" : crm.skipped || "unsaved",
  });
  res.cookies.set(cookieName(cat.slug), createAccessToken(cat.slug), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TTL_DAYS * 24 * 60 * 60,
  });
  return res;
}
