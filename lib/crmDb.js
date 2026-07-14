// ─────────────────────────────────────────────────────────────────────────
// Server-only CRM data layer (Vercel Postgres).
// Every function is server-side; nothing here runs in the browser. Connection
// comes from POSTGRES_URL (auto-provided by Vercel Postgres) — read at runtime,
// never bundled. When the DB isn't provisioned yet, isCrmConfigured() is false
// and the UI shows a "connect a database" state instead of crashing.
// ─────────────────────────────────────────────────────────────────────────
import { sql } from "@vercel/postgres";

// Allowed lead lifecycle stages and origins — enforced server-side so the DB
// never stores an arbitrary status/source coming from a form or a client.
export const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost"];
export const LEAD_SOURCES = ["manual", "contact", "careers", "api"];

export function isCrmConfigured() {
  return Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING);
}

// Create the table on first use. Memoized so repeated calls are cheap; the
// CREATE ... IF NOT EXISTS is idempotent regardless.
let _schemaReady = null;
export function ensureSchema() {
  if (!_schemaReady) {
    _schemaReady = sql`
      CREATE TABLE IF NOT EXISTS crm_leads (
        id          SERIAL PRIMARY KEY,
        name        TEXT NOT NULL DEFAULT '',
        email       TEXT NOT NULL DEFAULT '',
        phone       TEXT NOT NULL DEFAULT '',
        company     TEXT NOT NULL DEFAULT '',
        source      TEXT NOT NULL DEFAULT 'manual',
        status      TEXT NOT NULL DEFAULT 'new',
        message     TEXT NOT NULL DEFAULT '',
        notes       TEXT NOT NULL DEFAULT '',
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `.catch((e) => {
      // Reset so a transient failure doesn't permanently poison the cache.
      _schemaReady = null;
      throw e;
    });
  }
  return _schemaReady;
}

// Coerce untrusted input to a safe, trimmed string of bounded length.
const str = (v, max = 500) => (v == null ? "" : String(v).trim().slice(0, max));
const oneOf = (v, allowed, fallback) => (allowed.includes(v) ? v : fallback);

/** List leads, newest first, optionally filtered by status and a search term. */
export async function listLeads({ status, q } = {}) {
  await ensureSchema();
  const wantStatus = LEAD_STATUSES.includes(status) ? status : null;
  const term = q ? `%${String(q).trim().toLowerCase()}%` : null;

  // Parameterized in every branch — no string interpolation into SQL.
  if (wantStatus && term) {
    const { rows } = await sql`
      SELECT * FROM crm_leads
      WHERE status = ${wantStatus}
        AND (lower(name) LIKE ${term} OR lower(email) LIKE ${term}
             OR lower(company) LIKE ${term} OR lower(phone) LIKE ${term})
      ORDER BY created_at DESC LIMIT 500;`;
    return rows;
  }
  if (wantStatus) {
    const { rows } = await sql`
      SELECT * FROM crm_leads WHERE status = ${wantStatus}
      ORDER BY created_at DESC LIMIT 500;`;
    return rows;
  }
  if (term) {
    const { rows } = await sql`
      SELECT * FROM crm_leads
      WHERE lower(name) LIKE ${term} OR lower(email) LIKE ${term}
         OR lower(company) LIKE ${term} OR lower(phone) LIKE ${term}
      ORDER BY created_at DESC LIMIT 500;`;
    return rows;
  }
  const { rows } = await sql`SELECT * FROM crm_leads ORDER BY created_at DESC LIMIT 500;`;
  return rows;
}

/** Count of leads grouped by status (for the pipeline summary tiles). */
export async function leadCounts() {
  await ensureSchema();
  const { rows } = await sql`SELECT status, COUNT(*)::int AS n FROM crm_leads GROUP BY status;`;
  const byStatus = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0]));
  let total = 0;
  for (const r of rows) {
    if (r.status in byStatus) byStatus[r.status] = r.n;
    total += r.n;
  }
  return { total, byStatus };
}

export async function getLead(id) {
  await ensureSchema();
  const { rows } = await sql`SELECT * FROM crm_leads WHERE id = ${Number(id)};`;
  return rows[0] || null;
}

/** Insert a lead. Untrusted fields are coerced + whitelisted server-side. */
export async function createLead(data = {}) {
  await ensureSchema();
  const name = str(data.name, 200);
  const email = str(data.email, 200);
  const phone = str(data.phone, 60);
  const company = str(data.company, 200);
  const message = str(data.message, 4000);
  const notes = str(data.notes, 4000);
  const source = oneOf(str(data.source, 20), LEAD_SOURCES, "manual");
  const status = oneOf(str(data.status, 20), LEAD_STATUSES, "new");
  const { rows } = await sql`
    INSERT INTO crm_leads (name, email, phone, company, source, status, message, notes)
    VALUES (${name}, ${email}, ${phone}, ${company}, ${source}, ${status}, ${message}, ${notes})
    RETURNING *;`;
  return rows[0];
}

/** Patch a lead. Only provided, whitelisted fields change; updated_at bumps. */
export async function updateLead(id, patch = {}) {
  await ensureSchema();
  const cur = await getLead(id);
  if (!cur) return null;
  const next = {
    name: patch.name != null ? str(patch.name, 200) : cur.name,
    email: patch.email != null ? str(patch.email, 200) : cur.email,
    phone: patch.phone != null ? str(patch.phone, 60) : cur.phone,
    company: patch.company != null ? str(patch.company, 200) : cur.company,
    status: patch.status != null ? oneOf(str(patch.status, 20), LEAD_STATUSES, cur.status) : cur.status,
    notes: patch.notes != null ? str(patch.notes, 4000) : cur.notes,
  };
  const { rows } = await sql`
    UPDATE crm_leads SET
      name = ${next.name}, email = ${next.email}, phone = ${next.phone},
      company = ${next.company}, status = ${next.status}, notes = ${next.notes},
      updated_at = now()
    WHERE id = ${Number(id)}
    RETURNING *;`;
  return rows[0] || null;
}

export async function deleteLead(id) {
  await ensureSchema();
  const { rowCount } = await sql`DELETE FROM crm_leads WHERE id = ${Number(id)};`;
  return rowCount > 0;
}
