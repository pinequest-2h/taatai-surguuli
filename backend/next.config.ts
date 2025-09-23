import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds to succeed even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@apollo/server', 'mongoose', 'nodemailer'],
  },
  // Enable compression
  compress: true,
  // Optimize images and static assets
  images: {
    unoptimized: true, // For serverless deployment
  },
  // Reduce bundle size
  swcMinify: true,
  // Optimize for production
  poweredByHeader: false,
  // Enable static optimization where possible
  trailingSlash: false,
};

export default nextConfig;
