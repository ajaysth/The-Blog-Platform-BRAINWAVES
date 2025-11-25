import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "slelguoygbfzlpylpxfs.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/project-uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        port: "",
        pathname: "/7.x/avataaars/**",
      },
      {
        protocol: 'https',
        hostname: 'ucarecdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '2l9nx4euxr.ucarecd.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
