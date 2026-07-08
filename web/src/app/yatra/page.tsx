export const runtime = 'edge';

import type { Metadata } from "next";
import { getAllSites, getAllRegions } from "@/lib/content";
import { SiteCard } from "@/components/SiteCard";
import type { Tradition, Season } from "@/types/sacred-site";

export const metadata: Metadata = {
  title: "Yatra Index — All Sacred Sites",
  description:
    "Browse every sacred pilgrimage site in the YatraBeyond index. Filter by region, tradition, best season, and accessibility.",
};

interface PageProps {
  searchParams: {
    region?: string;
    tradition?: string;
    season?: string;
    family?: string;
    accessibility?: string;
  };
}

const ALL_TRADITIONS: Tradition[] = [
  "Shaivism",
  "Vaishnavism",
  "Shaktism",
  "Smartism",
  "Jainism",
  "Buddhism",
  "Sikhism",
  "Other",
];

const ALL_SEASONS: Season[] = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function YatraIndexPage({ searchParams }: PageProps) {
  let sites = getAllSites();
  const regions = getAllRegions();

  // ── Apply filters ──────────────────────────────────────────────────────────
  if (searchParams.region) {
    sites = sites.filter(
      (s) => s.region.toLowerCase() === searchParams.region?.toLowerCase()
    );
  }
  if (searchParams.tradition) {
    sites = sites.filter((s) => s.tradition === searchParams.tradition);
  }
  if (searchParams.season) {
    sites = sites.filter((s) =>
      s.bestSeason.includes(searchParams.season as Season)
    );
  }
  if (searchParams.family === "true") {
    sites = sites.filter((s) => s.familySuitable);
  }
  if (searchParams.accessibility) {
    sites = sites.filter(
      (s) => s.accessibilityLevel === searchParams.accessibility
    );
  }

  const hasFilters = Object.values(searchParams).some(Boolean);

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-8xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-brand-brown dark:text-brand-cream">
            Sacred Sites Index
          </h1>
          <p className="mt-2 font-sans text-brand-brown/60 dark:text-brand-cream/60">
            {sites.length} site{sites.length !== 1 ? "s" : ""}
            {hasFilters ? " matching your filters" : " in the index"}
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ── Sidebar filters ──────────────────────────────────────────── */}
          <aside className="w-full lg:w-64 flex-shrink-0" aria-label="Filter sites">
            <form>
              {/* Region */}
              <div className="mb-6">
                <label
                  htmlFor="filter-region"
                  className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-brand-brown/50 dark:text-brand-cream/50"
                >
                  Region
                </label>
                <select
                  id="filter-region"
                  name="region"
                  defaultValue={searchParams.region ?? ""}
                  className="w-full rounded-md border border-brand-brown/20 bg-white px-3 py-2 font-sans text-sm text-brand-brown dark:border-brand-cream/20 dark:bg-brand-brown/20 dark:text-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                  onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.value) url.searchParams.set("region", e.target.value);
                    else url.searchParams.delete("region");
                    window.location.href = url.toString();
                  }}
                >
                  <option value="">All regions</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tradition */}
              <div className="mb-6">
                <label
                  htmlFor="filter-tradition"
                  className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-brand-brown/50 dark:text-brand-cream/50"
                >
                  Tradition
                </label>
                <select
                  id="filter-tradition"
                  name="tradition"
                  defaultValue={searchParams.tradition ?? ""}
                  className="w-full rounded-md border border-brand-brown/20 bg-white px-3 py-2 font-sans text-sm text-brand-brown dark:border-brand-cream/20 dark:bg-brand-brown/20 dark:text-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                  onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.value) url.searchParams.set("tradition", e.target.value);
                    else url.searchParams.delete("tradition");
                    window.location.href = url.toString();
                  }}
                >
                  <option value="">All traditions</option>
                  {ALL_TRADITIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Season */}
              <div className="mb-6">
                <label
                  htmlFor="filter-season"
                  className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-brand-brown/50 dark:text-brand-cream/50"
                >
                  Best Season
                </label>
                <select
                  id="filter-season"
                  name="season"
                  defaultValue={searchParams.season ?? ""}
                  className="w-full rounded-md border border-brand-brown/20 bg-white px-3 py-2 font-sans text-sm text-brand-brown dark:border-brand-cream/20 dark:bg-brand-brown/20 dark:text-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                  onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.value) url.searchParams.set("season", e.target.value);
                    else url.searchParams.delete("season");
                    window.location.href = url.toString();
                  }}
                >
                  <option value="">Any month</option>
                  {ALL_SEASONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Family */}
              <div className="mb-6 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="filter-family"
                  name="family"
                  value="true"
                  defaultChecked={searchParams.family === "true"}
                  className="h-4 w-4 rounded border-brand-brown/30 accent-brand-terracotta"
                  onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.checked) url.searchParams.set("family", "true");
                    else url.searchParams.delete("family");
                    window.location.href = url.toString();
                  }}
                />
                <label
                  htmlFor="filter-family"
                  className="font-sans text-sm text-brand-brown dark:text-brand-cream"
                >
                  Family friendly only
                </label>
              </div>

              {hasFilters && (
                <a
                  href="/yatra"
                  className="font-sans text-sm text-brand-terracotta hover:underline"
                >
                  Clear all filters
                </a>
              )}
            </form>
          </aside>

          {/* ── Grid ─────────────────────────────────────────────────────── */}
          <div className="flex-1">
            {sites.length === 0 ? (
              <div className="rounded-xl border border-brand-brown/10 bg-brand-cream/30 p-12 text-center dark:border-brand-cream/10 dark:bg-brand-brown/20">
                <p className="font-serif text-xl text-brand-brown/60 dark:text-brand-cream/60">
                  No sites match your filters.
                </p>
                <a href="/yatra" className="mt-3 inline-block font-sans text-sm text-brand-terracotta hover:underline">
                  Clear filters →
                </a>
              </div>
            ) : (
              <ul
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                role="list"
                aria-label="Sacred sites"
              >
                {sites.map((site) => (
                  <li key={site.slug}>
                    <SiteCard site={site} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
