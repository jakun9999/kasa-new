import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["localhost", "127.0.0.1", "s3-eu-west-1.amazonaws.com"],
  },
};

export default nextConfig;
