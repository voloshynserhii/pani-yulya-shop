import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ['images.unsplash.com', 'kiddisvit.ua', 'img.youtube.com'],
  },
  experimental: {},
};

export default nextConfig;
