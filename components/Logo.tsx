import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoProps } from "@/types/branding";
import { brandConfig, getLogoSize } from "@/lib/branding";

export function Logo({
  size = "md",
  variant = "default",
  className,
  linkTo,
  showText = false,
  priority = false,
}: LogoProps) {
  const { width, height } = getLogoSize(size);
  const logoSrc =
    variant === "white" ? brandConfig.logoWhitePath : brandConfig.logoPath;

  const imgEl = (
    <Image
      src={logoSrc}
      alt="Acadivon logo"
      width={width}
      height={height}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );

  const content = showText ? (
    <span className="flex items-center gap-2">
      {imgEl}
      <span
        className={cn(
          "font-bold tracking-tight",
          size === "xl" && "text-4xl",
          size === "lg" && "text-2xl",
          size === "md" && "text-xl",
          size === "sm" && "text-base",
          size === "xs" && "text-sm",
          variant === "white" ? "text-white" : "text-gray-900"
        )}
      >
        {brandConfig.name}
      </span>
    </span>
  ) : (
    <span className="inline-flex">{imgEl}</span>
  );

  if (linkTo) {
    return (
      <Link href={linkTo} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
