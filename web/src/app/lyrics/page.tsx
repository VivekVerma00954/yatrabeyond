import type { Metadata } from "next";
import Link from "next/link";
import { getAllWorks, getAllDeities } from "@/lib/prayers";
import type { WorkType } from "@/types/prayer";
import { WORK_TYPE_LABELS, WORK_TYPE_SLUGS } from "@/types/prayer";
import { PrayerCard } from "@/components/prayer/PrayerCard";

export const metadata: Metadata = {
  title: "Lyrics Library — Aartis, Chalisas, Stotrams & Vrat Kathas",
  description:
    "Verified devotional texts with original Devanagari, Roman transliteration, and meanings in ten languages — sourced, cross-checked, and translated in our own words.",
};

const TYPE_ORDER: WorkType[] = ["aarti", "chalisa", "stotram", "vrat_katha"];

const TYPE_DESCRIPTIONS: Record<WorkType, string> = {
  aarti: "Devotional songs of light, sung at the close of worship.",
  chalisa: "Forty-verse devotional hymns, recited for strength and grace.",
  stotram: "Sanskrit hymns of praise from scripture and tradition.",
  vrat_katha: "The stories told during vrat observances, retold in our own words.",
};

export default function LyricsIndexPage() {
  const works = getAllWorks();
  const deities = getAllDeities();
  const deityByKey = new Map(deities.map((d) => [d.deity_key, d]));

  return (
    <div className="mx-auto max-w-8xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-3xl">
        <h1 className="font-serif text-4xl font-bold text-brand-brown dark:text-brand-cream">
          Lyrics Library
        </h1>
        <p className="mt-3 font-sans text-lg text-brand-brown/70 dark:text-brand-cream/70">
          Every text here is sourced from at least two independent references, never typed from
          memory, and translated in our own words — original Devanagari, Roman transliteration,
          and meanings in up to ten languages, line by line.
        </p>
        <p className="mt-2 font-sans text-sm text-brand-brown/50 dark:text-brand-cream/50">
          Read how we work in our{" "}
          <Link href="/editorial-policy" className="text-brand-terracotta hover:underline">
            editorial policy
          </Link>
          .
        </p>
      </header>

      {TYPE_ORDER.map((type) => {
        const typeWorks = works.filter((w) => w.work_type === type);
        return (
          <section key={type} aria-labelledby={`${type}-heading`} className="mb-12">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2
                  id={`${type}-heading`}
                  className="font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
                >
                  {WORK_TYPE_LABELS[type].plural}
                </h2>
                <p className="mt-0.5 font-sans text-sm text-brand-brown/60 dark:text-brand-cream/60">
                  {TYPE_DESCRIPTIONS[type]}
                </p>
              </div>
              {typeWorks.length > 0 && (
                <Link
                  href={`/lyrics/${WORK_TYPE_SLUGS[type]}`}
                  className="whitespace-nowrap font-sans text-sm text-brand-terracotta hover:underline"
                >
                  All {typeWorks.length} →
                </Link>
              )}
            </div>

            {typeWorks.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {typeWorks.slice(0, 6).map((work) => (
                  <PrayerCard
                    key={work.work_id}
                    work={work}
                    deity={work.deity_key ? deityByKey.get(work.deity_key) : null}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-brand-brown/20 p-6 font-sans text-sm text-brand-brown/50 dark:border-brand-cream/20 dark:text-brand-cream/50">
                {WORK_TYPE_LABELS[type].plural} are in production — each one goes through
                sourcing, cross-checking, and review before it appears here.
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
