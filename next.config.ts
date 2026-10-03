import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Case study cover and gallery images are served from Sanity's CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
