export const DEFAULT_BRAND_LOGO_URL =
  "https://github.com/user-attachments/assets/2d600265-2a96-4fad-a84e-dd41c8262295";

export function getBrandLogoUrl(): string {
  return process.env.NEXT_PUBLIC_BRAND_LOGO_URL ?? DEFAULT_BRAND_LOGO_URL;
}
