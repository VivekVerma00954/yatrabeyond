import Link from "next/link";
import type { Deity, PrayerWork } from "@/types/prayer";
import { WORK_TYPE_LABELS } from "@/types/prayer";
import { workPath, availableMeaningLangs } from "@/lib/prayers";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

interface PrayerCardProps {
  work: PrayerWork;
  deity?: Deity | null | undefined;
  className?: string;
}

/** Card for the lyrics index, deity hubs, and search surfaces. */
export function PrayerCard({ work, deity, className }: PrayerCardProps) {
  const firstLine = work.segments[0]?.original;
  const langCount = availableMeaningLangs(work).length;

  return (
    <article
      className={cn(
        "group flex flex-col rounded-xl border border-brand-brown/10 bg-white p-4",
        "dark:border-brand-cream/10 dark:bg-brand-brown/20",
        "shadow-sm transition-shadow duration-200 hover:shadow-md",
        className
      )}
    >
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
        <Badge variant="terracotta">{WORK_TYPE_LABELS[work.work_type].singular}</Badge>
        {deity && <Badge variant="neutral">{deity.name}</Badge>}
        {!work.reviewed && <Badge variant="gold">Draft</Badge>}
      </div>

      <h3 className="font-serif text-lg font-semibold text-brand-brown transition-colors duration-150 group-hover:text-brand-terracotta dark:text-brand-cream">
        <Link
          href={workPath(work)}
          className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2"
        >
          {work.title}
        </Link>
      </h3>

      {firstLine && (
        <p className="mt-1.5 flex-1 font-devanagari text-base leading-relaxed text-brand-brown/70 line-clamp-2 dark:text-brand-cream/70">
          {firstLine}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="font-sans text-xs text-brand-brown/50 dark:text-brand-cream/50">
          {work.segments.length} lines · meanings in {langCount} languages
        </span>
        <Link
          href={workPath(work)}
          className="rounded-sm font-sans text-sm font-medium text-brand-terracotta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-1"
          aria-label={`Read ${work.title}`}
        >
          Read →
        </Link>
      </div>
    </article>
  );
}
