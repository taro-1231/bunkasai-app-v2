import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/register', //フロント側
        destination: 'http://localhost:8000/api/register', //バックエンド側
      },
      {
        source: '/api/tenants/:path*',
        destination: 'http://localhost:8000/api/tenants/:path*',
      },
    ];
  },
};

export default nextConfig;
