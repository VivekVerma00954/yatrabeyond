import Link from "next/link";
import Image from "next/image";
import type { SacredSite } from "@/types/sacred-site";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

interface SiteCardProps {
  site: SacredSite;
  className?: string;
  /** When true, renders a larger "featured" layout */
  featured?: boolean;
}

export function SiteCard({ site, className, featured = false }: SiteCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-brand-brown/10",
        "bg-white dark:bg-brand-brown/20",
        "shadow-sm hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      {/* Hero image */}
      <div className={cn("relative w-full overflow-hidden", featured ? "h-64" : "h-44")}>
        <Image
          src={site.heroImage}
          alt={site.heroImageAlt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        {/* Gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/60 via-transparent to-transparent" />

        {/* Region badge over image */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="default" className="bg-white/90 text-brand-brown text-xs">
            {site.region}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex flex-wrap gap-1">
          <Badge variant="terracotta">{site.tradition}</Badge>
          {site.familySuitable && (
            <Badge variant="neutral">Family friendly</Badge>
          )}
        </div>

        <h3
          className={cn(
            "font-serif font-semibold text-brand-brown dark:text-brand-cream",
            "group-hover:text-brand-terracotta dark:group-hover:text-brand-terracotta",
            "transition-colors duration-150",
            featured ? "text-xl" : "text-lg"
          )}
        >
          <Link
            href={`/yatra/${site.slug}`}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2 rounded-sm"
          >
            {site.name}
          </Link>
        </h3>

        <p className="mt-1.5 flex-1 font-sans text-sm text-brand-brown/70 dark:text-brand-cream/70 line-clamp-3">
          {site.excerpt}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-sans text-xs text-brand-brown/50 dark:text-brand-cream/50">
            Best: {site.bestSeason.slice(0, 3).join(", ")}
            {site.bestSeason.length > 3 && "…"}
          </span>
          <Link
            href={`/yatra/${site.slug}`}
            className={cn(
              "font-sans text-sm font-medium text-brand-terracotta",
              "hover:underline",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-1 rounded-sm"
            )}
            aria-label={`Read more about ${site.name}`}
          >
            Explore →
          </Link>
        </div>
      </div>
    </article>
  );
}
