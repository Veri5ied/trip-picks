import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@trip-picks/web'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
