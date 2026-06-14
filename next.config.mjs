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
};

export default nextConfig;
