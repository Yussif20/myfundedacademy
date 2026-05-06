import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "@radix-ui/react-dropdown-menu"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "fra1.digitaloceanspaces.com" },
      { protocol: "https", hostname: "*.digitaloceanspaces.com" },
      { protocol: "https", hostname: "*.cdn.digitaloceanspaces.com" },
    ],
    minimumCacheTTL: 2592000,
    formats: ["image/avif", "image/webp"],
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(nextConfig);
