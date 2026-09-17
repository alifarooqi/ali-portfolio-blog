/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "medium.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  // Externalize the CJS/ESM-mixed DOMPurify dep chain so Turbopack doesn't
  // bundle jsdom as CJS. `html-encoding-sniffer` requires
  // `@exodus/bytes/encoding-lite.js` synchronously; that file is ESM-only
  // since @exodus/bytes 1.x. When Turbopack inlines jsdom the require throws
  // ERR_REQUIRE_ESM and /blog/[slug] returns 500 on cold re-renders
  // (revalidate = 12h), intermittently breaking GoogleBot indexing and
  // LinkedIn unfurl previews. See issue #2.
  serverExternalPackages: ["jsdom", "@exodus/bytes", "html-encoding-sniffer"],
};

// @next/bundle-analyzer is a devDependency — only `npm run analyze` needs it.
// Load it lazily when ANALYZE=true so production installs that omit devDeps
// (e.g. `npm ci --omit=dev`) don't fail resolving it at config-load time.
const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? (await import("@next/bundle-analyzer")).default({ enabled: true })
    : (config) => config;

export default withBundleAnalyzer(nextConfig);
