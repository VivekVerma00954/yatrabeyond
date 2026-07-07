import Link from "next/link";
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
 * Logo placeholder — swap the <svg> inside .logo-icon-slot with your final
 * SVG asset when it arrives. The wordmark font and colours are already wired
 * to brand tokens.
 *
 * To replace:
 *   1. Delete the placeholder SVG inside .logo-icon-slot
 *   2. Paste your final <svg> in its place (or use <Image> for a raster asset)
 *   3. Adjust the size prop as needed
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
        // Replace the SVG below with your final logo asset.
        <span
          className="logo-icon-slot flex-shrink-0"
          style={{ width: iconSize, height: iconSize }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={iconSize}
            height={iconSize}
            role="img"
            aria-label="YatraBeyond icon placeholder"
          >
            {/* Placeholder: stylised Om-inspired circle + peak */}
            <circle cx="18" cy="18" r="17" fill="#3A2A1E" />
            <path
              d="M18 6 L28 26 H8 Z"
              fill="none"
              stroke="#C9A227"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="18" cy="20" r="3.5" fill="#B5532E" />
            <text
              x="18"
              y="21.5"
              textAnchor="middle"
              fontSize="5"
              fontFamily="serif"
              fill="#F4ECDD"
              letterSpacing="0"
            >
              ॐ
            </text>
          </svg>
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
