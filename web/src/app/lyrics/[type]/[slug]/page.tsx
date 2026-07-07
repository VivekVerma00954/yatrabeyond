import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  availableMeaningLangs,
  getAllWorks,
  getDeityByKey,
  getWorkByTypeAndSlug,
  getWorksByDeity,
  workPath,
} from "@/lib/prayers";
import { getAllSites } from "@/lib/content";
import { prayerJsonLd } from "@/lib/structured-data";
import { WORK_TYPE_LABELS, WORK_TYPE_SLUGS, workTypeFromSlug } from "@/types/prayer";
import { PrayerReader } from "@/components/prayer/PrayerReader";
import { DraftBanner } from "@/components/prayer/DraftBanner";
import { ProvenanceBadges } from "@/components/prayer/ProvenanceBadges";
import { Badge } from "@/components/ui/Badge";

interface PageProps {
  params: { type: string; slug: string };
}

export function generateStaticParams() {
  return getAllWorks().map((work) => ({
    type: WORK_TYPE_SLUGS[work.work_type],
    slug: work.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const type = workTypeFromSlug(params.type);
  const work = type ? getWorkByTypeAndSlug(type, params.slug) : null;
  if (!work) return {};

  const deity = work.deity_key ? getDeityByKey(work.deity_key) : null;
  return {
    title: `${work.title} — Lyrics, Meaning & Transliteration`,
    description: `${work.title}${deity ? ` (${deity.name})` : ""}: original Devanagari lyrics with Roman transliteration and line-by-line meanings in up to ten languages.`,
    // Drafts are readable in preview builds but must never be indexed.
    ...(!work.reviewed && { robots: { index: false, follow: false } }),
  };
}

export default function PrayerPage({ params }: PageProps) {
  const type = workTypeFromSlug(params.type);
  const work = type ? getWorkByTypeAndSlug(type, params.slug) : null;
  if (!work) notFound();

  const deity = work.deity_key ? getDeityByKey(work.deity_key) : null;
  const langs = availableMeaningLangs(work);

  // Cross-links: the deity's other prayers and the sites where this deity presides.
  const relatedWorks = work.deity_key
    ? getWorksByDeity(work.deity_key).filter((w) => w.work_id !== work.work_id).slice(0, 4)
    : [];
  const relatedSites = work.deity_key
    ? getAllSites()
        .filter(
          (s) =>
            s.primaryDeity === work.deity_key ||
            (s.relatedDeities ?? []).includes(work.deity_key!)
        )
        .slice(0, 4)
    : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(prayerJsonLd(work, deity)) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-4 font-sans text-sm print:hidden">
          <Link href="/lyrics" className="text-brand-terracotta hover:underline">
            Lyrics Library
          </Link>{" "}
          <span className="text-brand-brown/40 dark:text-brand-cream/40">/</span>{" "}
          <Link
            href={`/lyrics/${WORK_TYPE_SLUGS[work.work_type]}`}
            className="text-brand-terracotta hover:underline"
          >
            {WORK_TYPE_LABELS[work.work_type].plural}
          </Link>{" "}
          <span className="text-brand-brown/40 dark:text-brand-cream/40">/ {work.title}</span>
        </nav>

        <header className="mb-6">
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge variant="terracotta">{WORK_TYPE_LABELS[work.work_type].singular}</Badge>
            {deity && (
              <Link
                href={`/deity/${deity.deity_key}`}
                className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta"
              >
                <Badge variant="neutral">{deity.name}</Badge>
              </Link>
            )}
            {work.tradition_region && <Badge variant="neutral">{work.tradition_region}</Badge>}
          </div>
          <h1 className="font-serif text-3xl font-bold text-brand-brown dark:text-brand-cream sm:text-4xl">
            {work.title}
          </h1>
        </header>

        {!work.reviewed && (
          <div className="mb-6">
            <DraftBanner />
          </div>
        )}

        <PrayerReader work={work} availableLangs={langs} />

        <div className="mt-10 space-y-6 print:hidden">
          <ProvenanceBadges work={work} />

          {(relatedWorks.length > 0 || relatedSites.length > 0) && deity && (
            <section
              aria-labelledby="related-heading"
              className="rounded-xl border border-brand-brown/10 p-6 dark:border-brand-cream/10"
            >
              <h2
                id="related-heading"
                className="mb-3 font-serif text-xl font-semibold text-brand-brown dark:text-brand-cream"
              >
                More on {deity.name}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {relatedWorks.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-sans text-sm font-medium uppercase tracking-wide text-brand-brown/50 dark:text-brand-cream/50">
                      Prayers
                    </h3>
                    <ul className="space-y-1.5" role="list">
                      {relatedWorks.map((w) => (
                        <li key={w.work_id}>
                          <Link
                            href={workPath(w)}
                            className="font-sans text-sm text-brand-terracotta hover:underline"
                          >
                            {w.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {relatedSites.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-sans text-sm font-medium uppercase tracking-wide text-brand-brown/50 dark:text-brand-cream/50">
                      Sacred sites
                    </h3>
                    <ul className="space-y-1.5" role="list">
                      {relatedSites.map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={`/yatra/${s.slug}`}
                            className="font-sans text-sm text-brand-terracotta hover:underline"
                          >
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <p className="mt-4">
                <Link
                  href={`/deity/${deity.deity_key}`}
                  className="font-sans text-sm font-medium text-brand-terracotta hover:underline"
                >
                  Everything on {deity.name} →
                </Link>
              </p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
