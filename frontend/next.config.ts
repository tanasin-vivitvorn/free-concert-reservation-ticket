import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    PORT: '8080',
  },
  serverExternalPackages: [],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost/api/:path*',
      },
    ];
  },
};

export default nextConfig;
