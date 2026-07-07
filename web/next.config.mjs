const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Aligned with the CSP's frame-ancestors 'none' below.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "img-src 'self' data: blob:",
      "style-src 'self' 'unsafe-inline'",
      // 'unsafe-eval' is required only by React's dev tooling — never shipped
      // in production. 'unsafe-inline' for scripts remains because the site is
      // fully statically generated (Next.js hydration and our theme snippet are
      // inline); a nonce-based CSP would force every page to render
      // per-request, giving up the static architecture. Revisit if the
      // deployment ever moves to dynamic rendering.
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    // Needed only for the branded SVG hero placeholders in
    // public/images/sites/. They are our own static assets (never
    // user-supplied), and the CSP below confines them; remove this flag once
    // real licensed photography replaces the placeholders.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [];
  },
};

export default nextConfig;
