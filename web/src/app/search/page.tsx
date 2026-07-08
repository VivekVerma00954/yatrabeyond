export const runtime = 'edge';

import type { Metadata } from "next";
import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { getAllSites } from "@/lib/content";
import { getAllWorks, getAllDeities } from "@/lib/prayers";
import { buildSearchIndex, matchesQuery } from "@/lib/search-index";
import { Badge } from "@/components/ui/Badge";

interface PageProps {
  searchParams: { q?: string };
}

export function generateMetadata({ searchParams }: PageProps): Metadata {
  return {
    title: searchParams.q ? `Search: "${searchParams.q}"` : "Search",
    description: "Search across prayers, sacred sites, and deities on YatraBeyond.",
  };
}

const KIND_LABELS = { site: "Site", prayer: "Prayer", deity: "Deity" } as const;

export default function SearchPage({ searchParams }: PageProps) {
  const query = searchParams.q?.trim() ?? "";

  // Server-side search as fallback (client-side handles typeahead).
  const results =
    query.length >= 2
      ? buildSearchIndex(getAllSites(), getAllWorks(), getAllDeities()).filter((r) =>
          matchesQuery(r, query)
        )
      : [];

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 font-serif text-4xl font-bold text-brand-brown dark:text-brand-cream">
          Search
        </h1>

        <SearchBox fullPage initialQuery={query} />

        {query && (
          <div className="mt-8">
            <p className="mb-4 font-sans text-sm text-brand-brown/60 dark:text-brand-cream/60">
              {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>

            {results.length > 0 ? (
              <ul className="space-y-3" role="list">
                {results.map((r) => (
                  <li key={r.path}>
                    <Link
                      href={r.path}
                      className="group flex items-start justify-between gap-3 rounded-xl border border-brand-brown/10 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta dark:border-brand-cream/10 dark:bg-brand-brown/20"
                    >
                      <span className="min-w-0">
                        <span className="block font-serif text-lg font-semibold text-brand-brown transition-colors duration-150 group-hover:text-brand-terracotta dark:text-brand-cream">
                          {r.name}
                        </span>
                        <span className="block font-sans text-sm text-brand-brown/60 dark:text-brand-cream/60">
                          {r.subtitle}
                        </span>
                        {r.excerpt && (
                          <span className="mt-1 block font-sans text-sm text-brand-brown/50 line-clamp-2 dark:text-brand-cream/50">
                            {r.excerpt}
                          </span>
                        )}
                      </span>
                      <Badge variant="neutral" className="shrink-0">
                        {KIND_LABELS[r.kind]}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-brand-brown/10 bg-brand-cream/30 p-10 text-center dark:border-brand-cream/10 dark:bg-brand-brown/20">
                <p className="font-serif text-lg text-brand-brown/60 dark:text-brand-cream/60">
                  Nothing found. Try a deity name, a prayer title, or a place.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
