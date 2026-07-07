import type { Metadata } from "next";
import Link from "next/link";
import { getAllRegions, getSitesByRegion } from "@/lib/content";

export const metadata: Metadata = {
  title: "Browse by Region",
  description: "Explore sacred pilgrimage sites across India, organised by region and state.",
};

export default function RegionsPage() {
  const regions = getAllRegions();

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-8xl">
        <h1 className="mb-2 font-serif text-4xl font-bold text-brand-brown dark:text-brand-cream">
          Browse by Region
        </h1>
        <p className="mb-8 font-sans text-brand-brown/60 dark:text-brand-cream/60">
          Explore India&apos;s sacred landscape, state by state.
        </p>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {regions.map((region) => {
            const sites = getSitesByRegion(region);
            const slug = region.toLowerCase().replace(/\s+/g, "-");
            return (
              <li key={region}>
                <Link
                  href={`/regions/${slug}`}
                  className="flex items-center justify-between rounded-xl border border-brand-brown/10 bg-white p-5 hover:border-brand-terracotta/40 hover:shadow-sm dark:border-brand-cream/10 dark:bg-brand-brown/20 dark:hover:border-brand-terracotta/40 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta"
                >
                  <span className="font-serif text-lg font-medium text-brand-brown dark:text-brand-cream">
                    {region}
                  </span>
                  <span className="rounded-full bg-brand-cream px-2.5 py-0.5 font-sans text-sm text-brand-brown dark:bg-brand-brown/40 dark:text-brand-cream">
                    {sites.length}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
