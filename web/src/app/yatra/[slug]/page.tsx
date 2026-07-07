import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getSiteBySlug, getAllSlugs } from "@/lib/content";
import { getAllDeities, getAllWorks } from "@/lib/prayers";
import { siteJsonLd } from "@/lib/structured-data";
import { SiteInPageNav } from "@/components/SiteInPageNav";
import { PrayerEmbed } from "@/components/prayer/PrayerEmbed";
import { Badge } from "@/components/ui/Badge";
import {
  Overview,
  History,
  SpiritualSignificance,
  Scriptures,
  PilgrimageInfo,
  FamilySuitabilitySection,
  AccommodationSection,
  LocalServicesSection,
  DosDontsSection,
  NearbyLocationsSection,
  PreservationSection,
  GivingBackSection,
} from "@/components/site-sections/index";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const site = getSiteBySlug(params.slug);
  if (!site) return {};

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.yatrabeyond.com";

  return {
    title: site.name,
    description: site.excerpt,
    openGraph: {
      title: site.name,
      description: site.excerpt,
      images: [
        {
          url: site.heroImage.startsWith("http")
            ? site.heroImage
            : `${SITE_URL}${site.heroImage}`,
          alt: site.heroImageAlt,
        },
      ],
    },
  };
}

// ── Section nav config — determines order and labels ─────────────────────────
const NAV_SECTIONS = [
  { id: "overview",               label: "Overview" },
  { id: "history",                label: "History" },
  { id: "spiritual-significance", label: "Spiritual Significance" },
  { id: "scriptures",             label: "Scriptures" },
  { id: "prayers",                label: "Prayers" },
  { id: "pilgrimage-info",        label: "Pilgrimage Info" },
  { id: "family-suitability",     label: "Family Suitability" },
  { id: "accommodation",          label: "Accommodation" },
  { id: "local-services",         label: "Local Services" },
  { id: "dos-donts",              label: "Do's & Don'ts" },
  { id: "nearby-sacred-locations",label: "Nearby Sites" },
  { id: "preservation",           label: "Preservation" },
  { id: "giving-back",            label: "Giving Back" },
];

export default function SitePage({ params }: PageProps) {
  const site = getSiteBySlug(params.slug);
  if (!site) notFound();

  // Prayers for this site's deities — primary deity's works first, then
  // works for the related/enshrined deities (the Kashi page also gathers
  // Annapurna and Kaal Bhairav, per MASTER_PLAN.md §3).
  const siteDeityKeys = [site.primaryDeity, ...(site.relatedDeities ?? [])].filter(
    (key): key is string => Boolean(key)
  );
  const sitePrayers = getAllWorks()
    .filter((w) => w.deity_key && siteDeityKeys.includes(w.deity_key))
    .sort(
      (a, b) =>
        siteDeityKeys.indexOf(a.deity_key!) - siteDeityKeys.indexOf(b.deity_key!) ||
        (a.priority ?? 99) - (b.priority ?? 99)
    )
    .slice(0, 6);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd(site)) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative h-72 w-full overflow-hidden sm:h-96 lg:h-[28rem]">
        <Image
          src={site.heroImage}
          alt={site.heroImageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/80 via-brand-brown/30 to-transparent" />

        {/* Hero overlay content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-8xl">
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant="terracotta">{site.tradition}</Badge>
              <Badge
                variant="default"
                className="bg-white/20 text-white backdrop-blur-sm"
              >
                {site.region}
              </Badge>
              {site.altitude != null && (
                <Badge
                  variant="default"
                  className="bg-white/20 text-white backdrop-blur-sm"
                >
                  {site.altitude.toLocaleString()} m
                </Badge>
              )}
            </div>
            <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {site.name}
            </h1>
            <p className="mt-1 font-sans text-sm text-white/70">
              Deity: {site.deity} · Best: {site.bestSeason.join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* ── Content layout ────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-8xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Sidebar nav */}
          <div className="lg:w-52 xl:w-60 flex-shrink-0">
            <SiteInPageNav sections={NAV_SECTIONS} />
          </div>

          {/* Main content */}
          <article className="min-w-0 flex-1" aria-label={`${site.name} details`}>
            <Overview content={site.overview} />
            <History content={site.history} />
            <SpiritualSignificance content={site.spiritualSignificance} />
            <Scriptures content={site.scriptures} />
            <PrayerEmbed
              works={sitePrayers}
              deities={getAllDeities()}
              heading={`Prayers at ${site.name}`}
            />
            <PilgrimageInfo content={site.pilgrimageInfo} />
            <FamilySuitabilitySection
              content={site.familySuitability}
              familySuitable={site.familySuitable}
            />
            <AccommodationSection content={site.accommodation} />
            <LocalServicesSection content={site.localServices} />
            <DosDontsSection data={site.dosDonts} />
            <NearbyLocationsSection locations={site.nearbySacredLocations} />
            <PreservationSection content={site.preservation} />
            <GivingBackSection content={site.givingBack} />

            {/* ── Sources ─────────────────────────────────────────────────── */}
            {site.sources.length > 0 && (
              <section
                id="sources"
                aria-labelledby="sources-heading"
                className="mt-8 rounded-xl border border-brand-brown/10 bg-brand-cream/40 p-6 dark:border-brand-cream/10 dark:bg-brand-brown/20"
              >
                <h2
                  id="sources-heading"
                  className="mb-3 font-serif text-lg font-semibold text-brand-brown dark:text-brand-cream"
                >
                  Sources
                </h2>
                <ul className="space-y-1.5" role="list">
                  {site.sources.map((source, i) => (
                    <li key={i} className="font-sans text-sm text-brand-brown/70 dark:text-brand-cream/70">
                      {source.url ? (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-terracotta hover:underline"
                        >
                          {source.title}
                        </a>
                      ) : (
                        source.title
                      )}{" "}
                      <Badge variant="neutral">{source.type}</Badge>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ── Editorial caveat ──────────────────────────────────────── */}
            <p className="mt-6 font-sans text-xs text-brand-brown/40 dark:text-brand-cream/40">
              Last reviewed: {site.lastReviewed}.{" "}
              <strong>Scaffolding content:</strong> This page was seeded with well-known
              public information for development purposes and is pending full editorial review
              before publication.
            </p>
          </article>
        </div>
      </div>
    </>
  );
}
