import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ["@apollo/server", "mongoose", "nodemailer"],
  },
  compress: true,
  images: {
    unoptimized: true,
  },

  poweredByHeader: false,

  trailingSlash: false,
};

export default nextConfig;
