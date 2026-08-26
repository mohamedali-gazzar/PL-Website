// ── Gated product catalogues — single source of truth ──────────────────────
// Add a new catalogue by (1) placing its PDF at private/catalogs/<slug>/<file>,
// (2) rendering its pages to private/catalogs/<slug>/pages/<prefix>-001.webp …,
// and (3) adding an entry here. Both the in-site viewer (page images) and the
// optional PDF download are delivered ONLY through gated APIs after a lead is
// captured — neither is ever a public/static URL.
//
// `slug` must match the product slug in lib/content.js `products`.
export const catalogs = {
  psec: {
    slug: "psec",
    productName: "PSEC",
    title: "PSEC Technical Catalogue",
    edition: "2026 · SF6 Ring Main Unit",
    file: "PSEC_Catalogue_2026.pdf", // full PDF at private/catalogs/psec/<file>
    downloadName: "Powerline-PSEC-Technical-Catalogue-2026.pdf",
    sizeLabel: "PDF · 5.5 MB",
    // In-site viewer renders one page image per request from
    // private/catalogs/psec/pages/psec-001.webp … (all gated).
    totalPages: 31,
    pageAspect: 0.7071, // page width / height (A4) — reserved to avoid layout shift
    pagePrefix: "psec",
  },
};

export function getCatalog(slug) {
  return (slug && catalogs[slug]) || null;
}
