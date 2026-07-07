import type { Metadata } from "next";
import Link from "next/link";
import { getAllSites } from "@/lib/content";
import { DOMAINS, GEO_SCOPES, sitesForFacet } from "@/lib/travel-taxonomy";
import { AffiliateDisclosure } from "@/components/travel/AffiliateDisclosure";
import { SiteCard } from "@/components/SiteCard";

export const metadata: Metadata = {
  title: "Travel — Pilgrimage Circuits, Treks & Destinations",
  description:
    "Plan sacred journeys across India and beyond: pilgrimage circuits, adventure treks, and heritage destinations, with trusted practical guidance.",
};

export default function TravelPage() {
  const sites = getAllSites();
  const featured = sites.filter((s) => s.featured).slice(0, 3);

  return (
    <div className="mx-auto max-w-8xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-3xl">
        <h1 className="font-serif text-4xl font-bold text-brand-brown dark:text-brand-cream">
          Travel
        </h1>
        <p className="mt-3 font-sans text-lg text-brand-brown/70 dark:text-brand-cream/70">
          Journeys organised the way you actually plan them: where in the world, and what kind
          of journey. Knowledge stays free — travel convenience is how the platform sustains
          itself.
        </p>
      </header>

      {/* ── Facet grid: scope × domain ─────────────────────────────────────── */}
      {GEO_SCOPES.map((scope) => (
        <section key={scope.key} aria-labelledby={`scope-${scope.key}`} className="mb-10">
          <h2
            id={`scope-${scope.key}`}
            className="mb-4 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
          >
            {scope.label}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {DOMAINS.map((domain) => {
              const count = sitesForFacet(sites, scope.key, domain.key).length;
              return (
                <Link
                  key={domain.key}
                  href={`/travel/${scope.key}/${domain.key}`}
                  className="group rounded-xl border border-brand-brown/10 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta dark:border-brand-cream/10 dark:bg-brand-brown/20"
                >
                  <h3 className="font-serif text-lg font-semibold text-brand-brown transition-colors duration-150 group-hover:text-brand-terracotta dark:text-brand-cream">
                    {domain.label}
                  </h3>
                  <p className="mt-1 font-sans text-sm text-brand-brown/60 dark:text-brand-cream/60">
                    {domain.description}
                  </p>
                  <p className="mt-2 font-sans text-xs text-brand-brown/40 dark:text-brand-cream/40">
                    {count > 0 ? `${count} destination${count === 1 ? "" : "s"}` : "Coming soon"}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {/* ── Featured journeys ──────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section aria-labelledby="featured-travel" className="mb-10">
          <h2
            id="featured-travel"
            className="mb-4 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
          >
            Featured journeys
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((site) => (
              <SiteCard key={site.slug} site={site} />
            ))}
          </div>
        </section>
      )}

      {/* ── Partner bundles placeholder ────────────────────────────────────── */}
      <section aria-labelledby="bundles-heading" className="mb-8">
        <h2
          id="bundles-heading"
          className="mb-4 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
        >
          Tours &amp; bookings
        </h2>
        {/*
          PLACEHOLDER — partner tour bundles, treks, and transport bookings land
          here once partner agreements exist (docs/MASTER_PLAN.md §6). Keep every
          listing keyed to the same deity/region/site taxonomy so a Kedarnath
          page can surface a Char Dham tour naturally, and keep the
          AffiliateDisclosure below on every page carrying commercial links.
        */}
        <div className="rounded-xl border border-dashed border-brand-brown/20 p-8 text-center dark:border-brand-cream/20">
          <p className="font-serif text-lg text-brand-brown/70 dark:text-brand-cream/70">
            Temple-tour bundles, treks, and transport bookings are coming.
          </p>
          <p className="mt-2 font-sans text-sm text-brand-brown/50 dark:text-brand-cream/50">
            We are selecting partners carefully — the same trust standard as our editorial
            content, with every commercial relationship disclosed.
          </p>
        </div>
      </section>

      <AffiliateDisclosure />
    </div>
  );
}
