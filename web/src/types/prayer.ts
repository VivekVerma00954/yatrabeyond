// ── Prayer / devotional-work content model ───────────────────────────────────
// Mirrors the Work → Segment model in docs/DATA_ARCHITECTURE.md §1 and the
// Postgres schema in docs/PHASE1_POSTGRES_SETUP_PLAN.md §3. The site reads
// this data from build-time JSON exported by scripts/export-content-from-db.mjs
// (or its CSV fallback) — never from a live database connection.

export type WorkType = "aarti" | "chalisa" | "stotram" | "vrat_katha";

/** URL slug for each work type (used in /lyrics/[type]/[slug] routes). */
export const WORK_TYPE_SLUGS: Record<WorkType, string> = {
  aarti: "aarti",
  chalisa: "chalisa",
  stotram: "stotram",
  vrat_katha: "vrat-katha",
};

export const WORK_TYPE_LABELS: Record<WorkType, { singular: string; plural: string }> = {
  aarti: { singular: "Aarti", plural: "Aartis" },
  chalisa: { singular: "Chalisa", plural: "Chalisas" },
  stotram: { singular: "Stotram", plural: "Stotrams" },
  vrat_katha: { singular: "Vrat Katha", plural: "Vrat Kathas" },
};

export function workTypeFromSlug(slug: string): WorkType | null {
  const entry = Object.entries(WORK_TYPE_SLUGS).find(([, s]) => s === slug);
  return entry ? (entry[0] as WorkType) : null;
}

export type MeaningLang = "en" | "hi" | "mr" | "gu" | "pa" | "bn" | "ta" | "te" | "kn" | "ml";

export const MEANING_LANGS: MeaningLang[] = ["en", "hi", "mr", "gu", "pa", "bn", "ta", "te", "kn", "ml"];

/** English + native-script labels for the meaning-language switcher. */
export const MEANING_LANG_LABELS: Record<MeaningLang, { english: string; native: string }> = {
  en: { english: "English", native: "English" },
  hi: { english: "Hindi", native: "हिन्दी" },
  mr: { english: "Marathi", native: "मराठी" },
  gu: { english: "Gujarati", native: "ગુજરાતી" },
  pa: { english: "Punjabi", native: "ਪੰਜਾਬੀ" },
  bn: { english: "Bengali", native: "বাংলা" },
  ta: { english: "Tamil", native: "தமிழ்" },
  te: { english: "Telugu", native: "తెలుగు" },
  kn: { english: "Kannada", native: "ಕನ್ನಡ" },
  ml: { english: "Malayalam", native: "മലയാളം" },
};

export type CopyrightRisk =
  | "PD-clear"
  | "PD-likely"
  | "REVIEW-version"
  | "REVIEW-recent"
  | "Cleared-authorized";

export interface PrayerSegment {
  work_id: string;
  section_path: string | null;
  order_num: number;
  /** e.g. "refrain", "verse 1", "closing doha" — a display label, not an enum */
  segment_type: string;
  original: string | null;
  original_true_script: string | null;
  translit_roman: string | null;
  meaning_en: string | null;
  meaning_hi: string | null;
  meaning_mr: string | null;
  meaning_gu: string | null;
  meaning_pa: string | null;
  meaning_bn: string | null;
  meaning_ta: string | null;
  meaning_te: string | null;
  meaning_kn: string | null;
  meaning_ml: string | null;
  word_by_word: string | null;
  commentary: string | null;
  notes: string | null;
}

export interface PrayerWork {
  work_id: string;
  title: string;
  work_type: WorkType;
  deity_key: string | null;
  deity_group: string | null;
  tradition_region: string | null;
  priority: number | null;
  copyright_status: string | null;
  copyright_risk: CopyrightRisk;
  original_sourced: boolean;
  transliteration_done: boolean;
  meaning_en_done: boolean;
  meaning_hi_done: boolean;
  /** false = draft awaiting human review against sung versions; rendered with a
   * mandatory draft banner and noindex, and excluded from strict exports. */
  reviewed: boolean;
  source_url: string | null;
  notes: string | null;
  author: string | null;
  period: string | null;
  origin_note: string | null;
  slug: string;
  segments: PrayerSegment[];
}

export interface Deity {
  deity_key: string;
  name: string;
  deity_group: string | null;
  tradition: string | null;
  aliases: string[];
  notes: string | null;
}

export interface ContentManifest {
  source: "database" | "csv-fallback";
  generatedAt: string;
  includesDrafts: boolean;
  counts: { deities: number; worksPublishable: number; worksDraft: number };
  note?: string;
}
