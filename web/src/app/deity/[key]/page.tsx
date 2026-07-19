import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllDeities, getAllWorks, getDeityByKey, getWorksByDeity } from "@/lib/prayers";
import { getAllSites } from "@/lib/content";
import { getAllDeityProfiles, getDeityProfileByKey } from "@/lib/deityProfiles";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { PrayerCard } from "@/components/prayer/PrayerCard";
import { SiteCard } from "@/components/SiteCard";
import { Badge } from "@/components/ui/Badge";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { DraftBanner } from "@/components/prayer/DraftBanner";

interface PageProps {
  params: { key: string };
}

// Deity-profile section nav config: order and labels.
const PROFILE_SECTIONS: Array<{
  id: string;
  title: string;
  field: keyof NonNullable<ReturnType<typeof getDeityProfileByKey>>;
}> = [
  { id: "who-is", title: "Who is {name}", field: "quickIdentity" },
  { id: "names", title: "Names & Epithets", field: "namesAndEpithets" },
  { id: "iconography", title: "Iconography & Symbols", field: "iconographyAndSymbols" },
  { id: "stories", title: "Key Stories", field: "keyStories" },
  { id: "family", title: "Family & Relations", field: "familyAndRelations" },
  { id: "significance", title: "Significance", field: "significance" },
  { id: "regional", title: "Regional & Sectarian Variation", field: "regionalVariation" },
];

export function generateStaticParams() {
  // Static pages only for deities that currently have content (prayers,
  // sites, or a profile). Empty hubs add crawl noise, not value. The full
  // registry still renders on /deity.
  const withWorks = new Set(getAllWorks().map((w) => w.deity_key).filter(Boolean));
  for (const site of getAllSites()) {
    if (site.primaryDeity) withWorks.add(site.primaryDeity);
    for (const key of site.relatedDeities ?? []) withWorks.add(key);
  }
  for (const profile of getAllDeityProfiles()) {
    withWorks.add(profile.deityKey);
  }
  return getAllDeities()
    .filter((d) => withWorks.has(d.deity_key))
    .map((d) => ({ key: d.deity_key }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const deity = getDeityByKey(params.key);
  if (!deity) return {};
  const profile = getDeityProfileByKey(params.key);
  return {
    title: `${deity.name}: Prayers, Sacred Sites & Tradition`,
    description: `${deity.name}: aartis, chalisas and prayers with verified lyrics and meanings, plus the sacred sites where ${deity.name} presides.`,
    // A deity profile that hasn't cleared human review is readable in preview
    // builds but must never be indexed. Same convention as draft prayers.
    ...(profile && !profile.reviewed && { robots: { index: false, follow: false } }),
  };
}

export default function DeityHubPage({ params }: PageProps) {
  const deity = getDeityByKey(params.key);
  if (!deity) notFound();

  const profile = getDeityProfileByKey(params.key);
  const deities = getAllDeities();
  const works = getWorksByDeity(deity.deity_key);
  const sites = getAllSites().filter(
    (s) =>
      s.primaryDeity === deity.deity_key ||
      (s.relatedDeities ?? []).includes(deity.deity_key)
  );
  const sameGroup = deity.deity_group
    ? deities.filter(
        (d) => d.deity_group === deity.deity_group && d.deity_key !== deity.deity_key
      )
    : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Deities", path: "/deity" },
              { name: deity.name, path: `/deity/${deity.deity_key}` },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-8xl px-4 py-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-4 font-sans text-sm">
          <Link href="/deity" className="text-brand-terracotta hover:underline">
            Deities
          </Link>{" "}
          <span className="text-brand-brown/40 dark:text-brand-cream/40">/ {deity.name}</span>
        </nav>

        <header className="mb-10">
          <div className="mb-2 flex flex-wrap gap-2">
            {deity.tradition && <Badge variant="terracotta">{deity.tradition}</Badge>}
            {deity.aliases.map((alias) => (
              <Badge key={alias} variant="neutral">
                also: {alias}
              </Badge>
            ))}
          </div>
          <h1 className="font-serif text-4xl font-bold text-brand-brown dark:text-brand-cream">
            {deity.name}
          </h1>
          {deity.notes && (
            <p className="mt-2 max-w-2xl font-sans text-brand-brown/70 dark:text-brand-cream/70">
              {deity.notes}
            </p>
          )}
        </header>

        {/* Deity profile: who/iconography/stories/family/significance */}
        {profile && (
          <section aria-labelledby="deity-profile" className="mb-12 space-y-8">
            {!profile.reviewed && <DraftBanner />}
            {PROFILE_SECTIONS.map(({ id, title, field }) => {
              const content = profile[field];
              if (typeof content !== "string" || !content.trim()) return null;
              return (
                <div key={id} id={id}>
                  <h2
                    id={`deity-profile-${id}`}
                    className="mb-2 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
                  >
                    {title.replace("{name}", deity.name)}
                  </h2>
                  <MarkdownContent content={content} />
                </div>
              );
            })}
            {profile.sources.length > 0 && (
              <div className="rounded-xl border border-brand-brown/10 bg-brand-brown/5 p-4 font-sans text-xs text-brand-brown/60 dark:border-brand-cream/10 dark:bg-brand-cream/5 dark:text-brand-cream/60">
                <p className="mb-1 font-semibold uppercase tracking-wide">Sources</p>
                <ul className="space-y-0.5">
                  {profile.sources.map((source, i) => (
                    <li key={i}>
                      {source.url ? (
                        <a href={source.url} className="underline hover:text-brand-terracotta">
                          {source.title}
                        </a>
                      ) : (
                        source.title
                      )}
                    </li>
                  ))}
                </ul>
                <p className="mt-2">Last reviewed: {profile.lastReviewed}</p>
              </div>
            )}
          </section>
        )}

        {/* Prayers */}
        <section aria-labelledby="deity-prayers" className="mb-12">
          <h2
            id="deity-prayers"
            className="mb-4 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
          >
            Prayers for {deity.name}
          </h2>
          {works.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {works.map((work) => (
                <PrayerCard key={work.work_id} work={work} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-brand-brown/20 p-6 font-sans text-sm text-brand-brown/50 dark:border-brand-cream/20 dark:text-brand-cream/50">
              Prayers for {deity.name} are in production, sourcing and review come before
              publication.
            </p>
          )}
        </section>

        {/* Sacred sites */}
        <section aria-labelledby="deity-sites" className="mb-12">
          <h2
            id="deity-sites"
            className="mb-4 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
          >
            Sacred sites of {deity.name}
          </h2>
          {sites.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sites.map((site) => (
                <SiteCard key={site.slug} site={site} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-brand-brown/20 p-6 font-sans text-sm text-brand-brown/50 dark:border-brand-cream/20 dark:text-brand-cream/50">
              Site guides for {deity.name} are being researched and reviewed.
            </p>
          )}
        </section>

        {/* Same tradition */}
        {sameGroup.length > 0 && (
          <section aria-labelledby="deity-related">
            <h2
              id="deity-related"
              className="mb-3 font-serif text-xl font-semibold text-brand-brown dark:text-brand-cream"
            >
              Related deities
            </h2>
            <div className="flex flex-wrap gap-2">
              {sameGroup.map((d) => (
                <Link
                  key={d.deity_key}
                  href={`/deity/${d.deity_key}`}
                  className="rounded-full border border-brand-brown/20 bg-white px-4 py-1.5 font-sans text-sm text-brand-brown transition-colors duration-150 hover:border-brand-terracotta hover:text-brand-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta dark:border-brand-cream/20 dark:bg-brand-brown/20 dark:text-brand-cream"
                >
                  {d.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
