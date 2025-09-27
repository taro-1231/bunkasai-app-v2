import type { NextConfig } from "next";

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
        destination: 'http://localhost:8000/api/register', //バックエンド側
      },
      {
        source: '/api/tenants/:path*',
        destination: 'http://localhost:8000/api/tenants/:path*',
      },
    ];
  },
  turbopack: {
    root: __dirname, // プロジェクトルートを明示
  },
};

export default nextConfig;
