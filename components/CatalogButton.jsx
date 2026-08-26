"use client";

import { useEffect, useState } from "react";
import CatalogModal from "@/components/CatalogModal";
import CatalogViewer from "@/components/CatalogViewer";
import { track } from "@/lib/analytics";

/**
 * "View Technical Catalogue" button for a product page.
 *  - First-time visitor: opens the lead form (popup). On successful submit the
 *    lead is saved, the signed access cookie is set, and the in-site viewer
 *    opens — nothing downloads automatically.
 *  - Returning visitor with valid access: opens the viewer directly, no form.
 * The optional "Download PDF" lives inside the viewer (also gated).
 */
export default function CatalogButton({ catalog }) {
  const [unlocked, setUnlocked] = useState(false);
  const [view, setView] = useState("idle"); // idle | form | viewer

  const meta = () => ({
    product_name: catalog.productName,
    product_slug: catalog.slug,
    catalog_name: catalog.title,
    page_path: typeof location !== "undefined" ? location.pathname : "",
  });

  useEffect(() => {
    let alive = true;
    fetch(`/api/catalog/unlock?slug=${catalog.slug}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (alive && d?.unlocked) setUnlocked(true);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [catalog.slug]);

  const onClick = () => {
    track("catalog_unlock_click", meta());
    setView(unlocked ? "viewer" : "form");
  };

  const onSuccess = () => {
    setUnlocked(true);
    setView("viewer");
  };

  return (
    <>
      <button type="button" className="btn btn-ghost cat-view" onClick={onClick}>
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        View Technical Catalogue
      </button>

      <CatalogModal open={view === "form"} onClose={() => setView("idle")} onSuccess={onSuccess} catalog={catalog} />
      {view === "viewer" && <CatalogViewer catalog={catalog} onClose={() => setView("idle")} />}

      <style jsx>{`
        .cat-view {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
        }
      `}</style>
    </>
  );
}
