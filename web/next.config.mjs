/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: emit plain HTML/CSS/JS to `out/`. No server runtime, so the
  // site deploys to Cloudflare Pages with no adapter and no edge-runtime
  // workarounds. Security headers now live in `public/_headers` (Cloudflare
  // reads it natively); headers()/redirects() do not apply to static export.
  output: "export",

  experimental: {
    typedRoutes: false,
  },

  images: {
    // Required for static export: Next's on-demand image optimizer needs a
    // server, which export does not have. Our images are our own static assets,
    // served as-is. Revisit with a build-time loader if real photography lands.
    unoptimized: true,
  },
};

export default nextConfig;
