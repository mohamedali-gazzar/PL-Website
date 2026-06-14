/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    // Local bundled assets only; allow Shopify CDN as a fallback if ever needed.
    remotePatterns: [{ protocol: "https", hostname: "powerlinei.com" }],
  },
};

export default nextConfig;
