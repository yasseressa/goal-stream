import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

function normalizeInternalApiBaseUrl(value?: string) {
  if (!value) {
    return "";
  }

  return value.startsWith("http://") || value.startsWith("https://") ? value : `http://${value}`;
}

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  reactStrictMode: true,
  async rewrites() {
    const internalApiBaseUrl = normalizeInternalApiBaseUrl(process.env.INTERNAL_API_BASE_URL);

    if (!internalApiBaseUrl) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${internalApiBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
