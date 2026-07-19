import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
  /** "full" shows wordmark + icon; "icon" shows just the icon mark; "wordmark" text only */
  variant?: "full" | "icon" | "wordmark";
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: 28, text: "text-lg" },
  md: { icon: 36, text: "text-2xl" },
  lg: { icon: 48, text: "text-3xl" },
};

/**
 * Logo icon: the "YB" mark, supplied 2026-07-19 as two raster PNGs (one
 * drawn for light backgrounds, one for dark), both transparent, living at
 * web/public/logo/logo-light.png and logo-dark.png. Both render at once and
 * CSS toggles which is visible via Tailwind's `dark:` class, matching the
 * `dark:text-brand-cream` pattern already used for the wordmark below.
 */
export function Logo({ className, variant = "full", size = "md" }: LogoProps) {
  const { icon: iconSize, text: textSize } = sizes[size];

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2 rounded-sm",
        className
      )}
      aria-label="YatraBeyond — home"
    >
      {variant !== "wordmark" && (
        // ── LOGO ICON SLOT ─────────────────────────────────────────────────
        <span
          className="logo-icon-slot relative flex-shrink-0"
          style={{ width: iconSize, height: iconSize }}
        >
          <Image
            src="/logo/logo-light.png"
            alt="YatraBeyond"
            width={iconSize}
            height={iconSize}
            priority
            className="block dark:hidden"
          />
          <Image
            src="/logo/logo-dark.png"
            alt="YatraBeyond"
            width={iconSize}
            height={iconSize}
            priority
            className="hidden dark:block"
          />
        </span>
      )}

      {variant !== "icon" && (
        <span
          className={cn(
            "font-serif font-semibold tracking-tight leading-none",
            textSize,
            // Light: deep brown. Dark: cream.
            "text-brand-brown dark:text-brand-cream"
          )}
        >
          Yatra
          <span className="text-brand-terracotta">Beyond</span>
        </span>
      )}
    </Link>
  );
}
