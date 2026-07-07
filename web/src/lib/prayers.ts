import fs from "fs";
import path from "path";
import type {
  ContentManifest,
  Deity,
  MeaningLang,
  PrayerWork,
  WorkType,
} from "@/types/prayer";
import { MEANING_LANGS, WORK_TYPE_SLUGS } from "@/types/prayer";

// Build-time loader for the generated prayer content. The JSON is produced by
// scripts/export-content-from-db.mjs (canonical, from Postgres) or its CSV
// fallback — both enforce the publish gate before anything lands here. The
// site itself never opens a database connection (docs/DATA_SYNC_ARCHITECTURE.md).
//
// Every loader degrades gracefully when the generated files are absent so the
// site still builds with zero prayer content (e.g. a fresh checkout before the
// first export has been run).

const GENERATED_DIR = path.join(process.cwd(), "src", "content", "generated");

function readGeneratedJson<T>(filename: string, fallback: T): T {
  const filePath = path.join(GENERATED_DIR, filename);
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

let worksCache: PrayerWork[] | null = null;
let deitiesCache: Deity[] | null = null;

// ── Respectful display names ─────────────────────────────────────────────────
// The database/CSV registry stores neutral reference names ("Shiva",
// "Lakshmi") as internal keys. For display, Indian devotional convention adds
// an honorific — "Shiv Ji", "Lakshmi Ji", "Shri Swaroopanand Ji". Applied here
// at load time so every page shows the respectful form without touching the
// data layer.

/** Full-name overrides where the default "… Ji" suffix reads wrong. */
const HONORIFIC_OVERRIDES: Record<string, string> = {
  shiva: "Shiv Ji", // "Shiva Ji" collides visually with Shivaji Maharaj
  "nangli-sahib": "Shri Swaroopanand Ji (Nangli Sahib)",
};

/** Collective/generic entries where a personal honorific doesn't apply. */
const NO_HONORIFIC = new Set(["devi", "navagraha", "guru", "saptarishi"]);

function toHonorificName(deityKey: string, name: string): string {
  const override = HONORIFIC_OVERRIDES[deityKey];
  if (override) return override;
  if (NO_HONORIFIC.has(deityKey)) return name;
  // "Santoshi Mata", "Shirdi Sai Baba" — already honorific forms.
  if (/\b(Mata|Baba)$/.test(name)) return name;
  // Keep any parenthetical qualifier after the honorific: "Chandra Ji (Moon)".
  const parenIndex = name.indexOf(" (");
  return parenIndex === -1
    ? `${name} Ji`
    : `${name.slice(0, parenIndex)} Ji${name.slice(parenIndex)}`;
}

/** All exported works (publishable + any explicitly exported drafts). */
export function getAllWorks(): PrayerWork[] {
  worksCache ??= readGeneratedJson<PrayerWork[]>("works.json", []);
  return worksCache;
}

/** All deities from the canonical registry, with respectful display names. */
export function getAllDeities(): Deity[] {
  deitiesCache ??= readGeneratedJson<Deity[]>("deities.json", []).map((d) => ({
    ...d,
    name: toHonorificName(d.deity_key, d.name),
  }));
  return deitiesCache;
}

export function getContentManifest(): ContentManifest | null {
  return readGeneratedJson<ContentManifest | null>("manifest.json", null);
}

export function getWorksByType(type: WorkType): PrayerWork[] {
  return getAllWorks().filter((w) => w.work_type === type);
}

export function getWorkByTypeAndSlug(type: WorkType, slug: string): PrayerWork | null {
  return getAllWorks().find((w) => w.work_type === type && w.slug === slug) ?? null;
}

export function getWorksByDeity(deityKey: string): PrayerWork[] {
  return getAllWorks().filter((w) => w.deity_key === deityKey);
}

export function getDeityByKey(key: string): Deity | null {
  return getAllDeities().find((d) => d.deity_key === key) ?? null;
}

/** Deities that currently have at least one exported work. */
export function getDeitiesWithWorks(): Deity[] {
  const keysWithWorks = new Set(getAllWorks().map((w) => w.deity_key).filter(Boolean));
  return getAllDeities().filter((d) => keysWithWorks.has(d.deity_key));
}

/** Canonical URL path for a work's reader page. */
export function workPath(work: Pick<PrayerWork, "work_type" | "slug">): string {
  return `/lyrics/${WORK_TYPE_SLUGS[work.work_type]}/${work.slug}`;
}

/** Meaning languages actually present in a work's segments, in canonical order. */
export function availableMeaningLangs(work: PrayerWork): MeaningLang[] {
  return MEANING_LANGS.filter((lang) =>
    work.segments.some((s) => Boolean(s[`meaning_${lang}` as const]))
  );
}

/** Human copyright/provenance label for the badge system. */
export function copyrightLabel(work: PrayerWork): string {
  switch (work.copyright_risk) {
    case "PD-clear":
      return "Original text: public domain";
    case "PD-likely":
      return "Original text: public domain (assessed)";
    case "Cleared-authorized":
      return "Original text: published with authorisation";
    default:
      // REVIEW-* never passes the export gate; this exists for type-completeness.
      return "Original text: rights under review";
  }
}
