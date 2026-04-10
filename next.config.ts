import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: false,
  output: "standalone",
  webpack(config) {
    config.experiments = {
      ...(config.experiments ?? {}),
      asyncWebAssembly: true,
    };

    return config;
  },
};

export default nextConfig;
