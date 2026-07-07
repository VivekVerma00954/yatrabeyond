import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllDeities, getWorksByType } from "@/lib/prayers";
import { WORK_TYPE_LABELS, WORK_TYPE_SLUGS, workTypeFromSlug } from "@/types/prayer";
import { PrayerCard } from "@/components/prayer/PrayerCard";

interface PageProps {
  params: { type: string };
}

export function generateStaticParams() {
  return Object.values(WORK_TYPE_SLUGS).map((type) => ({ type }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const type = workTypeFromSlug(params.type);
  if (!type) return {};
  const label = WORK_TYPE_LABELS[type];
  return {
    title: `${label.plural} — Lyrics with Meaning & Transliteration`,
    description: `${label.plural} with original Devanagari text, Roman transliteration, and meanings in up to ten languages. Verified against multiple sources.`,
  };
}

export default function WorkTypePage({ params }: PageProps) {
  const type = workTypeFromSlug(params.type);
  if (!type) notFound();

  const works = getWorksByType(type);
  const deities = getAllDeities();
  const deityByKey = new Map(deities.map((d) => [d.deity_key, d]));
  const label = WORK_TYPE_LABELS[type];

  return (
    <div className="mx-auto max-w-8xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-4 font-sans text-sm">
        <Link href="/lyrics" className="text-brand-terracotta hover:underline">
          Lyrics Library
        </Link>{" "}
        <span className="text-brand-brown/40 dark:text-brand-cream/40">/ {label.plural}</span>
      </nav>

      <h1 className="mb-6 font-serif text-4xl font-bold text-brand-brown dark:text-brand-cream">
        {label.plural}
      </h1>

      {works.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => (
            <PrayerCard
              key={work.work_id}
              work={work}
              deity={work.deity_key ? deityByKey.get(work.deity_key) : null}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-brand-brown/20 p-8 font-sans text-brand-brown/60 dark:border-brand-cream/20 dark:text-brand-cream/60">
          {label.plural} are in production. Every text goes through two-source verification,
          copyright triage, and human review before publication — accuracy comes first, speed
          second.
        </p>
      )}
    </div>
  );
}
