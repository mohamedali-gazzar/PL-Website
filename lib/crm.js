// Single server-side CRM integration, reused by every lead source (contact,
// careers, and the product-catalogue unlock) so there is ONE place that talks
// to the CRM ingest endpoint — no duplicate systems. The shared secret stays
// server-only. Best-effort by design; never throws.
const INGEST_URL =
  process.env.CRM_INGEST_URL || "https://pl-website-crm.vercel.app/api/crm/ingest";

// Product-catalogue leads have their own structured store (catalog_leads) in
// the same CRM, reached by a dedicated endpoint. Separate URL, SAME shared
// secret as the crm_leads ingest above.
const CATALOG_INGEST_URL =
  process.env.CRM_CATALOG_INGEST_URL ||
  "https://pl-website-crm.vercel.app/api/crm/catalog/ingest";

export function crmConfigured() {
  return Boolean(process.env.CRM_INGEST_SECRET);
}

// Forwards a lead to the CRM. Returns:
//   { ok: true }                       — saved
//   { ok: false }                      — configured but failed (network / non-2xx)
//   { ok: false, skipped: "not_configured" } — no secret set on this environment
export async function forwardLeadToCrm({ name, email, phone, company, message, source }) {
  const secret = process.env.CRM_INGEST_SECRET;
  if (!secret) return { ok: false, skipped: "not_configured" };
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000); // never hang a form
    const res = await fetch(INGEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-crm-ingest-secret": secret },
      body: JSON.stringify({ name, email, phone, company, message, source }),
      signal: ctrl.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}

// Forwards a product-catalogue lead to the CRM's dedicated catalog_leads store.
// Every catalogue field is kept as a discrete column server-side (nothing is
// packed into a text blob), and the internal source is always "product_catalog".
// Same best-effort contract as forwardLeadToCrm: returns { ok } / skipped when
// the secret isn't set on this environment, and never throws.
export async function forwardCatalogLeadToCrm(lead) {
  const secret = process.env.CRM_INGEST_SECRET;
  if (!secret) return { ok: false, skipped: "not_configured" };
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000); // never hang a form
    const res = await fetch(CATALOG_INGEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-crm-ingest-secret": secret },
      body: JSON.stringify({ ...lead, source: "product_catalog" }),
      signal: ctrl.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
