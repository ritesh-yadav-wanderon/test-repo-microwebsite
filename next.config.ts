import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3845", pathname: "/assets/**" },
    ],
  },
};

export default nextConfig;
