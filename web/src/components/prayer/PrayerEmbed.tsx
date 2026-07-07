import Link from "next/link";
import type { Deity, PrayerWork } from "@/types/prayer";
import { WORK_TYPE_LABELS } from "@/types/prayer";
import { workPath } from "@/lib/prayers";
import { Badge } from "@/components/ui/Badge";

interface PrayerEmbedProps {
  /** Works to surface, already filtered/ordered by the caller. */
  works: PrayerWork[];
  deities: Deity[];
  heading?: string;
}

/**
 * The "content view" concept from docs/PLATFORM_VISION_AND_MOAT.md §1: the
 * same prayer renders as a full reader page under /lyrics, and as this compact
 * cross-reference block anywhere else it belongs (temple pages, deity hubs,
 * future international sites). Build once, embed everywhere.
 */
export function PrayerEmbed({ works, deities, heading = "Prayers for this site" }: PrayerEmbedProps) {
  if (works.length === 0) return null;
  const deityByKey = new Map(deities.map((d) => [d.deity_key, d]));

  return (
    <section
      id="prayers"
      aria-labelledby="prayers-heading"
      className="mb-8 rounded-xl border border-brand-brown/10 bg-brand-cream/40 p-6 dark:border-brand-cream/10 dark:bg-brand-brown/20"
    >
      <h2
        id="prayers-heading"
        className="mb-4 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
      >
        {heading}
      </h2>
      <ul className="space-y-3" role="list">
        {works.map((work) => {
          const deity = work.deity_key ? deityByKey.get(work.deity_key) : null;
          const firstLine = work.segments[0]?.original;
          return (
            <li key={work.work_id} className="flex flex-col gap-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={workPath(work)}
                  className="rounded-sm font-serif text-base font-medium text-brand-terracotta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta"
                >
                  {work.title}
                </Link>
                <Badge variant="neutral">{WORK_TYPE_LABELS[work.work_type].singular}</Badge>
                {deity && (
                  <span className="font-sans text-xs text-brand-brown/50 dark:text-brand-cream/50">
                    {deity.name}
                  </span>
                )}
                {!work.reviewed && <Badge variant="gold">Draft</Badge>}
              </div>
              {firstLine && (
                <p lang="hi" className="font-devanagari text-sm text-brand-brown/60 line-clamp-1 dark:text-brand-cream/60">
                  {firstLine}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-4">
        <Link
          href="/lyrics"
          className="font-sans text-sm font-medium text-brand-terracotta hover:underline"
        >
          Browse the full lyrics library →
        </Link>
      </p>
    </section>
  );
}
