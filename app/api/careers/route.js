import { NextResponse } from "next/server";

/**
 * Stub endpoint for job applications (multipart form, includes a CV file).
 * Currently logs the fields and acknowledges. To go live, store the CV
 * (e.g. S3/Blob) and forward the application to Powerline's HR email/ATS.
 */
export async function POST(request) {
  try {
    const data = await request.formData();
    const cv = data.get("cv");
    if (!data.get("name") || !data.get("email") || !cv) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    console.log("[careers] application:", {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      position: data.get("position"),
      cv: cv && cv.name ? `${cv.name} (${cv.size} bytes)` : "none",
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
