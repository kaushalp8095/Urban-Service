/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const isDev = process.env.NODE_ENV === 'development';
    const backendBase = process.env.BACKEND_API_URL || "https://backend-eta-eight-29.vercel.app";
    const destination = isDev 
      ? "http://localhost:5000/api/v1/:path*" 
      : `${backendBase}/api/v1/:path*`;

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

module.exports = nextConfig;
