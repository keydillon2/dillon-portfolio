import type { NextConfig } from "next";

// Baseline browser protections for every page. There is no full script
// Content-Security-Policy yet (Google Analytics and the Sanity Studio would
// need careful allowlisting); these headers block framing by other sites,
// MIME sniffing, plugin content and leaking full URLs to other sites.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'" },
];

const nextConfig: NextConfig = {
  images: {
    // Case study cover and gallery images are served from Sanity's CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
