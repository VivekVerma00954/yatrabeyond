import type { SacredSite } from "@/types/sacred-site";
import type { Deity, PrayerWork } from "@/types/prayer";
import { WORK_TYPE_LABELS, WORK_TYPE_SLUGS } from "@/types/prayer";

/** One searchable record — sites, prayers, and deities share this shape. */
export interface SearchRecord {
  kind: "site" | "prayer" | "deity";
  /** Absolute path on this site, e.g. /yatra/kedarnath */
  path: string;
  name: string;
  subtitle: string;
  /** Extra matchable terms: tags, aliases, transliterations, deity names… */
  keywords: string[];
  excerpt: string;
}

export function siteToRecord(site: SacredSite): SearchRecord {
  return {
    kind: "site",
    path: `/yatra/${site.slug}`,
    name: site.name,
    subtitle: `${site.region} · ${site.tradition}`,
    keywords: [site.deity, site.tradition, site.region, site.state, ...(site.tags ?? [])],
    excerpt: site.excerpt,
  };
}

export function workToRecord(work: PrayerWork, deity?: Deity | null): SearchRecord {
  const first = work.segments[0];
  return {
    kind: "prayer",
    path: `/lyrics/${WORK_TYPE_SLUGS[work.work_type]}/${work.slug}`,
    name: work.title,
    subtitle: [WORK_TYPE_LABELS[work.work_type].singular, deity?.name]
      .filter(Boolean)
      .join(" · "),
    keywords: [
      WORK_TYPE_LABELS[work.work_type].singular,
      deity?.name ?? "",
      ...(deity?.aliases ?? []),
      work.tradition_region ?? "",
      // Roman transliteration matches how people actually search
      // ("om jai jagdish hare lyrics") — a real SEO/search edge.
      first?.translit_roman ?? "",
    ].filter(Boolean),
    excerpt: [first?.original, first?.translit_roman].filter(Boolean).join(" · "),
  };
}

export function deityToRecord(deity: Deity): SearchRecord {
  return {
    kind: "deity",
    path: `/deity/${deity.deity_key}`,
    name: deity.name,
    subtitle: deity.tradition ?? "Deity",
    keywords: [...deity.aliases, deity.deity_group ?? ""],
    excerpt: deity.notes ?? "",
  };
}

/** Build the complete unified search index as a serialisable array. */
export function buildSearchIndex(
  sites: SacredSite[],
  works: PrayerWork[] = [],
  deities: Deity[] = []
): SearchRecord[] {
  const deityByKey = new Map(deities.map((d) => [d.deity_key, d]));
  const keysWithContent = new Set(works.map((w) => w.deity_key).filter(Boolean));
  for (const site of sites) {
    if (site.primaryDeity) keysWithContent.add(site.primaryDeity);
    for (const key of site.relatedDeities ?? []) keysWithContent.add(key);
  }

  return [
    ...sites.map(siteToRecord),
    ...works.map((w) => workToRecord(w, w.deity_key ? deityByKey.get(w.deity_key) : null)),
    // Only deities that lead somewhere useful.
    ...deities.filter((d) => keysWithContent.has(d.deity_key)).map(deityToRecord),
  ];
}

/** Case-insensitive match used by both the client typeahead and /search. */
export function matchesQuery(record: SearchRecord, query: string): boolean {
  const q = query.toLowerCase();
  return (
    record.name.toLowerCase().includes(q) ||
    record.subtitle.toLowerCase().includes(q) ||
    record.excerpt.toLowerCase().includes(q) ||
    record.keywords.some((k) => k.toLowerCase().includes(q))
  );
}
