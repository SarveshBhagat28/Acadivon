export type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";
export type LogoVariant = "default" | "white" | "icon-only";

export interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  className?: string;
  priority?: boolean;
  linkTo?: string;
  showText?: boolean;
}

export interface BrandConfig {
  name: string;
  tagline: string;
  version: string;
  primaryColor: string;
  pageBackground: string;
  pageBackgroundSecondary: string;
  sidebarColor: string;
  logoPath: string;
  logoWhitePath: string;
}
