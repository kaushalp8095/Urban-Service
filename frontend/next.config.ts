import type { NextConfig } from "next";

// Backend URL for server-side API proxy (Next.js rewrites run server-side)
// Priority: BACKEND_API_URL > strip /api/v1 from NEXT_PUBLIC_API_URL > hardcoded production URL
const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "")
    : "https://backend-eta-eight-29.vercel.app");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
