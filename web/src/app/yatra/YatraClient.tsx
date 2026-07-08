'use client';

import { useState, useMemo } from "react";
import { SiteCard } from "@/components/SiteCard";
import type { SacredSite, Tradition, Season } from "@/types/sacred-site";

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

interface Props {
  allSites: SacredSite[];
  regions: string[];
}

export function YatraClient({ allSites, regions }: Props) {
  const [region, setRegion] = useState("");
  const [tradition, setTradition] = useState("");
  const [season, setSeason] = useState("");
  const [familyOnly, setFamilyOnly] = useState(false);

  const sites = useMemo(() => {
    let filtered = allSites;
    if (region) filtered = filtered.filter((s) => s.region.toLowerCase() === region.toLowerCase());
    if (tradition) filtered = filtered.filter((s) => s.tradition === tradition);
    if (season) filtered = filtered.filter((s) => s.bestSeason.includes(season as Season));
    if (familyOnly) filtered = filtered.filter((s) => s.familySuitable);
    return filtered;
  }, [allSites, region, tradition, season, familyOnly]);

  const hasFilters = !!(region || tradition || season || familyOnly);

  function clearFilters() {
    setRegion("");
    setTradition("");
    setSeason("");
    setFamilyOnly(false);
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-8xl">
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
          <aside className="w-full lg:w-64 flex-shrink-0" aria-label="Filter sites">
            <div className="mb-6">
              <label
                htmlFor="filter-region"
                className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-brand-brown/50 dark:text-brand-cream/50"
              >
                Region
              </label>
              <select
                id="filter-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-md border border-brand-brown/20 bg-white px-3 py-2 font-sans text-sm text-brand-brown dark:border-brand-cream/20 dark:bg-brand-brown/20 dark:text-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
              >
                <option value="">All regions</option>
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label
                htmlFor="filter-tradition"
                className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-brand-brown/50 dark:text-brand-cream/50"
              >
                Tradition
              </label>
              <select
                id="filter-tradition"
                value={tradition}
                onChange={(e) => setTradition(e.target.value)}
                className="w-full rounded-md border border-brand-brown/20 bg-white px-3 py-2 font-sans text-sm text-brand-brown dark:border-brand-cream/20 dark:bg-brand-brown/20 dark:text-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
              >
                <option value="">All traditions</option>
                {ALL_TRADITIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label
                htmlFor="filter-season"
                className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-brand-brown/50 dark:text-brand-cream/50"
              >
                Best Season
              </label>
              <select
                id="filter-season"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full rounded-md border border-brand-brown/20 bg-white px-3 py-2 font-sans text-sm text-brand-brown dark:border-brand-cream/20 dark:bg-brand-brown/20 dark:text-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
              >
                <option value="">Any month</option>
                {ALL_SEASONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="mb-6 flex items-center gap-2">
              <input
                type="checkbox"
                id="filter-family"
                checked={familyOnly}
                onChange={(e) => setFamilyOnly(e.target.checked)}
                className="h-4 w-4 rounded border-brand-brown/30 accent-brand-terracotta"
              />
              <label
                htmlFor="filter-family"
                className="font-sans text-sm text-brand-brown dark:text-brand-cream"
              >
                Family friendly only
              </label>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="font-sans text-sm text-brand-terracotta hover:underline"
              >
                Clear all filters
              </button>
            )}
          </aside>

          <div className="flex-1">
            {sites.length === 0 ? (
              <div className="rounded-xl border border-brand-brown/10 bg-brand-cream/30 p-12 text-center dark:border-brand-cream/10 dark:bg-brand-brown/20">
                <p className="font-serif text-xl text-brand-brown/60 dark:text-brand-cream/60">
                  No sites match your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-3 inline-block font-sans text-sm text-brand-terracotta hover:underline"
                >
                  Clear filters →
                </button>
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
