import type { NextConfig } from "next";

// Backend URL for server-side API proxy (Next.js rewrites run server-side)
// Priority: BACKEND_API_URL > strip /api/v1 from NEXT_PUBLIC_API_URL > env-based default
const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "")
    : process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://backend-eta-eight-29.vercel.app");

const nextConfig: NextConfig = {
  async rewrites() {
    const isDev = process.env.NODE_ENV === 'development';
    const backendBase = process.env.BACKEND_API_URL || "https://backend-eta-eight-29.vercel.app";
    const destination = isDev ? "http://localhost:5000/api/v1/:path*" : `${backendBase}/api/v1/:path*`;

    return {
      beforeFiles: [
        {
          source: "/api/v1/:path*",
          destination: destination,
        },
      ],
    };
  },
};

export default nextConfig;
