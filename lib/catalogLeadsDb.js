// ─────────────────────────────────────────────────────────────────────────
// Server-only data layer for product-catalogue leads (Vercel Postgres).
// Catalogue downloads are their own kind of lead: captured with structured,
// per-field columns (NOT crammed into the crm_leads pipeline) so they export
// cleanly to CSV / Excel. Same database/connection as crm_leads (POSTGRES_URL),
// separate table (catalog_leads). Nothing here runs in the browser.
// ─────────────────────────────────────────────────────────────────────────
import { sql } from "@vercel/postgres";

// This table exists solely for catalogue leads, so the internal source is
// fixed — it can never be coerced to "api". Kept as a stored column (not just a
// constant) so read/export paths are self-describing.
export const CATALOG_LEAD_SOURCE = "product_catalog";
export const CATALOG_LEAD_SOURCE_LABEL = "Product Catalog";

export function isCatalogDbConfigured() {
  return Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING);
}

// Create the table on first use. Memoized; CREATE ... IF NOT EXISTS is
// idempotent. On failure the memo resets so a transient error isn't cached.
let _schemaReady = null;
export function ensureCatalogSchema() {
  if (!_schemaReady) {
    _schemaReady = sql`
      CREATE TABLE IF NOT EXISTS catalog_leads (
        id                SERIAL PRIMARY KEY,
        name              TEXT NOT NULL DEFAULT '',
        company           TEXT NOT NULL DEFAULT '',
        email             TEXT NOT NULL DEFAULT '',
        phone             TEXT NOT NULL DEFAULT '',
        country           TEXT NOT NULL DEFAULT '',
        product           TEXT NOT NULL DEFAULT '',
        slug              TEXT NOT NULL DEFAULT '',
        catalogue         TEXT NOT NULL DEFAULT '',
        page_url          TEXT NOT NULL DEFAULT '',
        referrer          TEXT NOT NULL DEFAULT '',
        utm               TEXT NOT NULL DEFAULT '',
        engineer_contact  BOOLEAN NOT NULL DEFAULT false,
        source            TEXT NOT NULL DEFAULT 'product_catalog',
        created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `.catch((e) => {
      _schemaReady = null;
      throw e;
    });
  }
  return _schemaReady;
}

// Coerce untrusted input to a safe, trimmed string of bounded length.
const str = (v, max = 500) => (v == null ? "" : String(v).trim().slice(0, max));
const bool = (v) => v === true || v === "true" || v === 1 || v === "1";

/**
 * Pure, dependency-free coercion of untrusted input into the exact stored shape.
 * Exported so the field-keeping + source-fixing logic is unit-testable WITHOUT a
 * database. `source` is ALWAYS "product_catalog" for this table — a catalogue
 * lead can never be stored as "api" or anything else.
 */
export function buildCatalogLeadValues(d = {}) {
  return {
    name: str(d.name, 200),
    company: str(d.company, 200),
    email: str(d.email, 200),
    phone: str(d.phone, 60),
    country: str(d.country, 120),
    product: str(d.product, 200),
    slug: str(d.slug, 80),
    catalogue: str(d.catalogue, 200),
    page_url: str(d.pageUrl != null ? d.pageUrl : d.page_url, 500),
    referrer: str(d.referrer, 500),
    utm: str(d.utm, 500),
    engineer_contact: bool(d.engineerContact != null ? d.engineerContact : d.engineer_contact),
    source: CATALOG_LEAD_SOURCE,
  };
}

/** Insert a catalogue lead. Every field is a discrete column; source is fixed. */
export async function createCatalogLead(data = {}) {
  await ensureCatalogSchema();
  const v = buildCatalogLeadValues(data);
  const { rows } = await sql`
    INSERT INTO catalog_leads
      (name, company, email, phone, country, product, slug, catalogue,
       page_url, referrer, utm, engineer_contact, source)
    VALUES
      (${v.name}, ${v.company}, ${v.email}, ${v.phone}, ${v.country}, ${v.product},
       ${v.slug}, ${v.catalogue}, ${v.page_url}, ${v.referrer}, ${v.utm},
       ${v.engineer_contact}, ${v.source})
    RETURNING *;`;
  return rows[0];
}

/** List catalogue leads, newest first, optionally filtered by a search term. */
export async function listCatalogLeads({ q } = {}) {
  await ensureCatalogSchema();
  const term = q ? `%${String(q).trim().toLowerCase()}%` : null;
  if (term) {
    const { rows } = await sql`
      SELECT * FROM catalog_leads
      WHERE lower(name) LIKE ${term} OR lower(email) LIKE ${term}
         OR lower(company) LIKE ${term} OR lower(country) LIKE ${term}
         OR lower(product) LIKE ${term}
      ORDER BY created_at DESC LIMIT 2000;`;
    return rows;
  }
  const { rows } = await sql`SELECT * FROM catalog_leads ORDER BY created_at DESC LIMIT 2000;`;
  return rows;
}

// Fixed, Excel-friendly column order for the export.
const EXPORT_COLUMNS = [
  ["created_at", "Created at"],
  ["name", "Name"],
  ["company", "Company"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["country", "Country"],
  ["product", "Product"],
  ["slug", "Slug"],
  ["catalogue", "Catalogue"],
  ["engineer_contact", "Engineer contact"],
  ["page_url", "Page URL"],
  ["referrer", "Referrer"],
  ["utm", "UTM"],
  ["source", "Source"],
];

// Format rows to an ordered matrix of plain strings (header row first) for the
// Excel (.xlsx) export. The source column always shows the human label
// ("Product Catalog"); booleans render Yes/No and dates as ISO. Pure + testable.
export function toRowsMatrix(rows = []) {
  const cell = (r, key) => {
    if (key === "source") return CATALOG_LEAD_SOURCE_LABEL;
    const v = r[key];
    if (v == null) return "";
    if (v instanceof Date) return v.toISOString();
    if (typeof v === "boolean") return v ? "Yes" : "No";
    return String(v);
  };
  const header = EXPORT_COLUMNS.map(([, label]) => label);
  return [header, ...rows.map((r) => EXPORT_COLUMNS.map(([key]) => cell(r, key)))];
}
