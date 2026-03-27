import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker / Railway deployments
  output: "standalone",

  // Silence the Prisma require-side-effect warning in Edge runtime
  serverExternalPackages: ["@prisma/client", "prisma"],

  images: {
    remotePatterns: [
      // Firebase Storage avatars
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      // Google account profile pictures
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // GitHub account avatars
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
