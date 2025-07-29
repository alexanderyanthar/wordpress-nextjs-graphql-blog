import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'wordpress-graphql-blog.local', // Your local WordPress domain
      // Add any other domains you might use:
      // 'your-production-domain.com',
      // 'cdn.example.com',
    ],
    // Alternative: use remotePatterns for more control
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'wordpress-graphql-blog.local',
        port: '', // Leave empty for default ports
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'wordpress-graphql-blog.local',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
