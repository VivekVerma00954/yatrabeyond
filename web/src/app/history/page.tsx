import type { Metadata } from "next";
import Link from "next/link";
import { getAllSites } from "@/lib/content";
import { getDeitiesWithWorks } from "@/lib/prayers";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Religious History — Origins, Traditions & Sacred Places",
  description:
    "The history behind India's sacred sites and traditions — researched, sourced, and told with reverence.",
};

/**
 * The Religious History pillar. Phase 1 surfaces the researched history that
 * already lives on each site page; dedicated long-form history articles get
 * their own Work-type in the data model when that content is produced
 * (docs/DATA_ARCHITECTURE.md §1 — a history article is a Work of prose
 * segments; no schema change needed).
 */
export default function HistoryPage() {
  const sitesWithHistory = getAllSites().filter((s) => s.history);
  const deities = getDeitiesWithWorks();

  return (
    <div className="mx-auto max-w-8xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-3xl">
        <h1 className="font-serif text-4xl font-bold text-brand-brown dark:text-brand-cream">
          Religious History
        </h1>
        <p className="mt-3 font-sans text-lg text-brand-brown/70 dark:text-brand-cream/70">
          Where a tradition began, who built what and when, and how a place became sacred —
          every claim sourced, every page dated, nothing typed from memory.
        </p>
      </header>

      <section aria-labelledby="site-histories" className="mb-12">
        <h2
          id="site-histories"
          className="mb-4 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
        >
          Histories of sacred places
        </h2>
        {sitesWithHistory.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sitesWithHistory.map((site) => (
              <Link
                key={site.slug}
                href={`/yatra/${site.slug}#history`}
                className="group rounded-xl border border-brand-brown/10 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta dark:border-brand-cream/10 dark:bg-brand-brown/20"
              >
                <div className="mb-1.5 flex flex-wrap gap-1.5">
                  <Badge variant="terracotta">{site.tradition}</Badge>
                  <Badge variant="neutral">{site.region}</Badge>
                </div>
                <h3 className="font-serif text-lg font-semibold text-brand-brown transition-colors duration-150 group-hover:text-brand-terracotta dark:text-brand-cream">
                  {site.name}
                </h3>
                <p className="mt-1 font-sans text-sm text-brand-brown/60 line-clamp-2 dark:text-brand-cream/60">
                  {site.excerpt}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-brand-brown/20 p-6 font-sans text-sm text-brand-brown/50 dark:border-brand-cream/20 dark:text-brand-cream/50">
            Site histories are being researched and reviewed.
          </p>
        )}
      </section>

      {deities.length > 0 && (
        <section aria-labelledby="deity-traditions">
          <h2
            id="deity-traditions"
            className="mb-4 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
          >
            Traditions by deity
          </h2>
          <div className="flex flex-wrap gap-2">
            {deities.map((deity) => (
              <Link
                key={deity.deity_key}
                href={`/deity/${deity.deity_key}`}
                className="rounded-full border border-brand-brown/20 bg-white px-4 py-1.5 font-sans text-sm text-brand-brown transition-colors duration-150 hover:border-brand-terracotta hover:text-brand-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta dark:border-brand-cream/20 dark:bg-brand-brown/20 dark:text-brand-cream"
              >
                {deity.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
