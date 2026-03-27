import { LogoSize, BrandConfig } from "@/types/branding";

export const brandConfig: BrandConfig = {
  name: "Acadivon",
  tagline: "Your intelligent learning companion",
  version: "0.1.0",
  primaryColor: "#2563eb",
  sidebarColor: "#1e3a5f",
  logoPath: "/logo.svg",
  logoPngPath: "/acadivon-logo.png",
};

const logoSizeMap: Record<LogoSize, { width: number; height: number }> = {
  xs: { width: 20, height: 20 },
  sm: { width: 28, height: 28 },
  md: { width: 36, height: 36 },
  lg: { width: 48, height: 48 },
  xl: { width: 88, height: 88 },
};

export function getLogoSize(size: LogoSize): { width: number; height: number } {
  return logoSizeMap[size];
}
