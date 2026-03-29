import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow longer serverless function execution for AI processing
  serverExternalPackages: ["mammoth"],
};

export default nextConfig;
