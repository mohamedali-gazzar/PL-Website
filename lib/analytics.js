// Thin wrapper over the GA4 gtag that is already loaded site-wide by
// @next/third-parties (<GoogleAnalytics/> in app/layout.jsx). Safe to call
// anywhere on the client; a no-op on the server or if GA hasn't loaded.
//
// IMPORTANT: never pass personal data (name / email / phone) here — only
// non-sensitive metadata (product_name, product_slug, catalog_name, page_path…).
export function track(event, params = {}) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") window.gtag("event", event, params);
  } catch {
    /* analytics must never break the UI */
  }
}
