import type { PrayerWork } from "@/types/prayer";
import { copyrightLabel } from "@/lib/prayers";
import { Badge } from "@/components/ui/Badge";

/**
 * Trust/provenance badges — a first-class UI element on every prayer page
 * (docs/PLATFORM_VISION_AND_MOAT.md §2, idea 1). Ownership is never ambiguous:
 * original text status, author/period when known, and our translation copyright.
 */
export function ProvenanceBadges({ work }: { work: PrayerWork }) {
  return (
    <section
      aria-label="Provenance and rights"
      className="rounded-xl border border-brand-brown/10 bg-brand-cream/40 p-4 dark:border-brand-cream/10 dark:bg-brand-brown/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="neutral">{copyrightLabel(work)}</Badge>
        {work.author && <Badge variant="neutral">Author: {work.author}</Badge>}
        {work.period && <Badge variant="neutral">Period: {work.period}</Badge>}
        <Badge variant="terracotta">Translation &amp; transliteration © YatraBeyond</Badge>
      </div>
      {work.origin_note && (
        <p className="mt-2 font-sans text-xs text-brand-brown/60 dark:text-brand-cream/60">
          {work.origin_note}
        </p>
      )}
      <p className="mt-2 font-sans text-xs text-brand-brown/50 dark:text-brand-cream/50">
        Sourced and cross-checked against two independent sources; our meanings are written in
        our own words, never copied. Personal, devotional use — including printing and sharing
        short excerpts with attribution — is free and encouraged.
      </p>
    </section>
  );
}
