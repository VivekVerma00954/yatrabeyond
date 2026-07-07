import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "terracotta" | "gold" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default:
    "bg-brand-cream text-brand-brown dark:bg-brand-brown/60 dark:text-brand-cream",
  terracotta:
    "bg-brand-terracotta/15 text-brand-terracotta dark:bg-brand-terracotta/25",
  gold:
    "bg-brand-gold/15 text-[#8a6b0a] dark:bg-brand-gold/20 dark:text-brand-gold",
  neutral:
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
