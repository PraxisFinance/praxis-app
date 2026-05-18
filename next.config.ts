import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.praxis.cc",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
