import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getCatalog, catalogKey } from "@/lib/catalogs";
import { verifyAccessToken, cookieName } from "@/lib/catalogAccess";

// Delivers the protected catalogue PDF — only to a visitor holding a valid
// access cookie (set after the lead form). There is no public/static URL for
// the file; it lives outside /public and is streamed from here as an
// attachment. Not a valid token → 403.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const cat = getCatalog(params.slug);
  if (!cat) return new NextResponse("Not found", { status: 404 });

  const key = catalogKey(cat);
  const token = request.cookies.get(cookieName(key))?.value;
  if (!verifyAccessToken(token, key)) {
    return new NextResponse("Access denied", { status: 403 });
  }

  const file = path.join(process.cwd(), "private", "catalogs", key, cat.file);
  let buf;
  try {
    buf = fs.readFileSync(file);
  } catch {
    return new NextResponse("Catalogue unavailable", { status: 404 });
  }

  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(buf.length),
      "Content-Disposition": `attachment; filename="${cat.downloadName || cat.file}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
