/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        // Product images are hotlinked from agcosmetics.ca's Shopify CDN for
        // now (see scripts/import/import-images.ts) - not re-hosted on our
        // own storage yet.
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
