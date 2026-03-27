import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoProps } from "@/types/branding";
import { getLogoSize } from "@/lib/branding";

export function Logo({
  size = "md",
  variant = "default",
  className,
  linkTo,
  showText = false,
}: LogoProps) {
  const { width, height } = getLogoSize(size);

  const imgEl = (
    <img
      src="/logo.svg"
      alt="Acadivon logo"
      width={width}
      height={height}
      className={cn(
        "object-contain",
        variant === "white" && "brightness-0 invert",
        className
      )}
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
        Acadivon
      </span>
    </span>
  ) : (
    imgEl
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
