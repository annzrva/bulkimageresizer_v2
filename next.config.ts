import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/bulkimageresizer_v2' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/bulkimageresizer_v2' : '',
  trailingSlash: true,
} as const;

export default nextConfig;
