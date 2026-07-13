/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Lets a verification/preview process use an isolated build dir
  // (NEXT_DIST_DIR=.next-preview) so it never clobbers the user's `.next`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    // Local bundled assets only; allow Shopify CDN as a fallback if ever needed.
    remotePatterns: [{ protocol: "https", hostname: "powerlinei.com" }],
  },
  // Keep the old slugs working after renaming them to match page/product names.
  async redirects() {
    return [
      { source: "/assembly-lines", destination: "/our-products", permanent: true },
      { source: "/products/pral24", destination: "/products/pral", permanent: true },
      { source: "/products/minicenter-abb", destination: "/products/minicenter", permanent: true },
      { source: "/products/gis-ring-main-units-12-24-kv", destination: "/products/aegis-plus-12-24-kv", permanent: true },
    ];
  },
};

export default nextConfig;
