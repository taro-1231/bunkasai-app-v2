import type { NextConfig } from "next";
const base = process.env.NEXT_PUBLIC_API_BASE;

const nextConfig: NextConfig = {
  /* config options here */
  // ブラウザと別オリジンサーバーの通信はCORSにより制限される
  //フロントサーバとバックサーバはCORS制限を受けない
  //rewriteはブラウザからnextのサーバーを経由することで同一オリジンでバックと通信することができる
  //また、rewriteのsourceのURLでfetchできるため、バックエンドのフルURLを書く必要がない
  async rewrites() {
    return [
      {
        source: '/api/register', //フロント側
        destination: `${base}/api/v2/register`, //バックエンド側
      },
      {
        source: '/api/tenants/:path*',
        destination: `${base}/api/v2/tenants/:path*`,
      },
    ];
  },
  turbopack: {
    root: __dirname, // プロジェクトルートを明示
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
