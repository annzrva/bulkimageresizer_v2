import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/bulkimageresizer_v2' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/bulkimageresizer_v2' : '',
  trailingSlash: true,
  distDir: 'dist',
  reactStrictMode: true,
  poweredByHeader: false,
} as const;

export default nextConfig;
