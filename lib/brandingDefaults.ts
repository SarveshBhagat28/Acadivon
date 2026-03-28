// Default Acadivon logo hosted on GitHub user attachments.
// Override via NEXT_PUBLIC_BRAND_LOGO_URL (requires rebuild to update image allowlists).
export const DEFAULT_BRAND_LOGO_URL =
  "https://github.com/user-attachments/assets/2d600265-2a96-4fad-a84e-dd41c8262295";

/**
 * Returns the configured brand logo URL, falling back to the default asset.
 * Note: changes to NEXT_PUBLIC_BRAND_LOGO_URL require a rebuild because the
 * image allowlist is computed at build time in next.config.ts.
 */
export function getBrandLogoUrl(): string {
  return process.env.NEXT_PUBLIC_BRAND_LOGO_URL ?? DEFAULT_BRAND_LOGO_URL;
}
