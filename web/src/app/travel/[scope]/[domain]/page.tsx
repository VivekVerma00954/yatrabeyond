import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSites } from "@/lib/content";
import { DOMAINS, GEO_SCOPES, isDomain, isGeoScope, sitesForFacet } from "@/lib/travel-taxonomy";
import { AffiliateDisclosure } from "@/components/travel/AffiliateDisclosure";
import { SiteCard } from "@/components/SiteCard";

interface PageProps {
  params: { scope: string; domain: string };
}

export function generateStaticParams() {
  return GEO_SCOPES.flatMap((scope) =>
    DOMAINS.map((domain) => ({ scope: scope.key, domain: domain.key }))
  );
}

export function generateMetadata({ params }: PageProps): Metadata {
  if (!isGeoScope(params.scope) || !isDomain(params.domain)) return {};
  const scopeLabel = GEO_SCOPES.find((g) => g.key === params.scope)!.label;
  const domainLabel = DOMAINS.find((d) => d.key === params.domain)!.label;
  return {
    title: `${domainLabel} Travel — ${scopeLabel}`,
    description: `${domainLabel} destinations and journeys in ${scopeLabel}, with trusted practical guidance from YatraBeyond.`,
  };
}

export default function TravelFacetPage({ params }: PageProps) {
  if (!isGeoScope(params.scope) || !isDomain(params.domain)) notFound();

  const scope = GEO_SCOPES.find((g) => g.key === params.scope)!;
  const domain = DOMAINS.find((d) => d.key === params.domain)!;
  const sites = sitesForFacet(getAllSites(), scope.key, domain.key);

  return (
    <div className="mx-auto max-w-8xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-4 font-sans text-sm">
        <Link href="/travel" className="text-brand-terracotta hover:underline">
          Travel
        </Link>{" "}
        <span className="text-brand-brown/40 dark:text-brand-cream/40">
          / {scope.label} / {domain.label}
        </span>
      </nav>

      <header className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-brand-brown dark:text-brand-cream">
          {domain.label} — {scope.label}
        </h1>
        <p className="mt-2 max-w-2xl font-sans text-brand-brown/70 dark:text-brand-cream/70">
          {domain.description}
        </p>
      </header>

      {sites.length > 0 ? (
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <SiteCard key={site.slug} site={site} />
          ))}
        </div>
      ) : (
        <div className="mb-8 rounded-xl border border-dashed border-brand-brown/20 p-10 text-center dark:border-brand-cream/20">
          <p className="font-serif text-lg text-brand-brown/70 dark:text-brand-cream/70">
            {domain.label} destinations in {scope.label} are coming.
          </p>
          <p className="mx-auto mt-2 max-w-md font-sans text-sm text-brand-brown/50 dark:text-brand-cream/50">
            Every destination we publish is researched, sourced, and reviewed first — the same
            standard as everything else on YatraBeyond.
          </p>
          <Link
            href="/yatra"
            className="mt-4 inline-block font-sans text-sm font-medium text-brand-terracotta hover:underline"
          >
            Explore the sacred sites index →
          </Link>
        </div>
      )}

      <AffiliateDisclosure />
    </div>
  );
}
