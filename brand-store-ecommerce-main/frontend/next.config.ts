import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Use webpack instead of turbopack to avoid unicode path issues
  // The path contains Japanese characters (ドキュメント) which cause Turbopack to crash
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Disable turbopack for dev to avoid the unicode path crash
  experimental: {},
};

export default nextConfig;
