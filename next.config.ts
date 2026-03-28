import type { NextConfig } from "next";

const logoUrl =
  process.env.NEXT_PUBLIC_BRAND_LOGO_URL ??
  "https://github.com/user-attachments/assets/2d600265-2a96-4fad-a84e-dd41c8262295";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  // Firebase Storage avatars
  { protocol: "https", hostname: "firebasestorage.googleapis.com" },
  // Google account profile pictures
  { protocol: "https", hostname: "lh3.googleusercontent.com" },
  // GitHub account avatars
  { protocol: "https", hostname: "avatars.githubusercontent.com" },
];

try {
  const parsedLogoUrl = new URL(logoUrl);
  const protocol = parsedLogoUrl.protocol.replace(":", "");
  if (protocol === "http" || protocol === "https") {
    remotePatterns.push({
      protocol,
      hostname: parsedLogoUrl.hostname,
      pathname: parsedLogoUrl.pathname,
    });
  }
} catch {
  // Ignore non-absolute logo URLs (e.g., local public assets)
}

const nextConfig: NextConfig = {
  // Enable standalone output for Docker / Railway deployments
  output: "standalone",

  // Silence the Prisma require-side-effect warning in Edge runtime
  serverExternalPackages: ["@prisma/client", "prisma"],

  images: {
    remotePatterns,
  },
};

export default nextConfig;
