import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getCatalog, catalogKey } from "@/lib/catalogs";
import { verifyAccessToken, cookieName } from "@/lib/catalogAccess";

// Serves ONE catalogue page as an image for the in-site viewer. EVERY page
// requires a valid access cookie (there is no free preview) — the catalogue is
// never exposed as a single downloadable PDF here, and there is no public/static
// URL for any page. Missing / invalid / expired / wrong-slug cookie → 403.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const cat = getCatalog(params.slug);
  const n = parseInt(params.n, 10);

  if (!cat || !Number.isInteger(n) || n < 1 || n > cat.totalPages) {
    return new NextResponse("Not found", { status: 404 });
  }

  const key = catalogKey(cat);
  const token = request.cookies.get(cookieName(key))?.value;
  if (!verifyAccessToken(token, key)) {
    return new NextResponse("Access denied", { status: 403 });
  }

  const file = path.join(
    process.cwd(),
    "private",
    "catalogs",
    key,
    "pages",
    `${cat.pagePrefix}-${String(n).padStart(3, "0")}.webp`
  );

  let buf;
  try {
    buf = fs.readFileSync(file);
  } catch {
    return new NextResponse("Page unavailable", { status: 404 });
  }

  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Content-Length": String(buf.length),
      "Cache-Control": "private, max-age=0, must-revalidate",
      "Content-Disposition": "inline",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
