import type { NextConfig } from "next";
import { getBrandLogoUrl } from "./lib/brandingDefaults";

const logoUrl = getBrandLogoUrl();

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
  if (parsedLogoUrl.protocol === "http:" || parsedLogoUrl.protocol === "https:") {
    const hostname = parsedLogoUrl.hostname;
    const pattern: { protocol: "http" | "https"; hostname: string; pathname?: string } = {
      protocol: parsedLogoUrl.protocol.slice(0, -1) as "http" | "https",
      hostname,
    };

    if (hostname === "github.com" && parsedLogoUrl.pathname.startsWith("/user-attachments/assets/")) {
      pattern.pathname = "/user-attachments/assets/**";
    }

    remotePatterns.push(pattern);
  }
} catch (error) {
  // Ignore non-absolute logo URLs (e.g., local public assets) but surface malformed URLs in dev.
  if (process.env.NODE_ENV !== "production") {
    console.warn("Invalid NEXT_PUBLIC_BRAND_LOGO_URL; falling back to default.", error);
  }
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
