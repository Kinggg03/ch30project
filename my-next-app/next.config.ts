import type { NextConfig } from "next";

const nextConfig = {
  reactCompiler: false,
  

  allowedDevOrigins: ["127.0.01","192.168.*.*","10.*.*.*"],
};

export default nextConfig;
