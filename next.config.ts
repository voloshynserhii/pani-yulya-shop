import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ['images.unsplash.com', 'kiddisvit.ua'],
  },
  experimental: {},
};

export default nextConfig;
