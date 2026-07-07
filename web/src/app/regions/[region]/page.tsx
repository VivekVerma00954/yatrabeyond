import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSitesByRegion, getAllRegions } from "@/lib/content";
import { SiteCard } from "@/components/SiteCard";

interface PageProps {
  params: { region: string };
}

function slugToRegion(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function generateStaticParams() {
  return getAllRegions().map((r) => ({
    region: r.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const regionName = slugToRegion(decodeURIComponent(params.region));
  return {
    title: `Sacred Sites in ${regionName}`,
    description: `Browse all sacred pilgrimage sites in ${regionName} on YatraBeyond.`,
  };
}

export default function RegionPage({ params }: PageProps) {
  const regionName = slugToRegion(decodeURIComponent(params.region));
  const sites = getSitesByRegion(regionName);

  if (sites.length === 0) notFound();

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-8xl">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 font-sans text-sm text-brand-brown/60 dark:text-brand-cream/60">
            <li>
              <a href="/yatra" className="hover:text-brand-terracotta">
                Yatra Index
              </a>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="text-brand-brown dark:text-brand-cream">
              {regionName}
            </li>
          </ol>
        </nav>

        <h1 className="mb-2 font-serif text-4xl font-bold text-brand-brown dark:text-brand-cream">
          {regionName}
        </h1>
        <p className="mb-8 font-sans text-brand-brown/60 dark:text-brand-cream/60">
          {sites.length} sacred site{sites.length !== 1 ? "s" : ""} in this region
        </p>

        <ul
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label={`Sites in ${regionName}`}
        >
          {sites.map((site) => (
            <li key={site.slug}>
              <SiteCard site={site} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
