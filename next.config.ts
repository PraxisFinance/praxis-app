import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.praxis.cc",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.api-sports.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
