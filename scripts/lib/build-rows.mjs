// Shared CSV -> row builders used by both sync-csv-to-postgres.mjs (CSV -> DB)
// and export-content-from-csv.mjs (CSV -> site JSON fallback). One mapping,
// two consumers, so the database and the fallback export can never drift.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCSVObjects, yesNoToBool, slugify } from "./csv.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.join(__dirname, "..", "..", "data");

export const TRACKER_FILES = [
  { file: "aarti_tracker.csv", workType: "aarti" },
  { file: "chalisa_tracker.csv", workType: "chalisa" },
  { file: "stotram_tracker.csv", workType: "stotram" },
  { file: "vrat_katha_tracker.csv", workType: "vrat_katha" },
];

export const VALID_COPYRIGHT_RISK = new Set([
  "PD-clear",
  "PD-likely",
  "REVIEW-version",
  "REVIEW-recent",
  "Cleared-authorized",
]);

// The publish gate's accepted set — mirrors the publishable_works view in
// docs/PHASE1_POSTGRES_SETUP_PLAN.md §3. REVIEW-* never passes, anywhere.
export const ACCEPTED_COPYRIGHT_RISK = new Set([
  "PD-clear",
  "PD-likely",
  "Cleared-authorized",
]);

export const MEANING_LANGS = ["en", "hi", "mr", "gu", "pa", "bn", "ta", "te", "kn", "ml"];

export function readCSV(filename) {
  const filePath = path.join(DATA_DIR, filename);
  return parseCSVObjects(fs.readFileSync(filePath, "utf-8"));
}

export function buildDeityRows() {
  return readCSV("deity_reference.csv").map((r) => ({
    deity_key: r.deity_key,
    name: r.display_name,
    deity_group: r.deity_group || null,
    tradition: r.tradition || null,
    aliases: r.aliases ? r.aliases.split(";").map((a) => a.trim()).filter(Boolean) : [],
    notes: r.notes || null,
  }));
}

export function buildWorkRows() {
  const seenSlugs = new Map(); // slug -> count, to disambiguate collisions
  const rows = [];

  for (const { file, workType } of TRACKER_FILES) {
    for (const r of readCSV(file)) {
      const workId = r.id;
      if (!workId) continue;

      const risk = r.copyright_risk?.trim();
      if (!VALID_COPYRIGHT_RISK.has(risk)) {
        console.warn(`[rows] ${file} ${workId}: unrecognised copyright_risk "${risk}", skipping row`);
        continue;
      }

      let slug = slugify(r.title);
      const count = seenSlugs.get(slug) || 0;
      seenSlugs.set(slug, count + 1);
      if (count > 0) slug = `${slug}-${count + 1}`;

      rows.push({
        work_id: workId,
        title: r.title,
        work_type: workType,
        deity_key: r.deity_key || null,
        deity_group: r.deity_group || null,
        tradition_region: r.tradition_region || null,
        priority: r.priority ? Number(r.priority) : null,
        copyright_status: r.copyright_status || null,
        copyright_risk: risk,
        original_sourced: yesNoToBool(r.original_sourced, `${file} ${workId}`),
        transliteration_done: yesNoToBool(r.transliteration_done, `${file} ${workId}`),
        meaning_en_done: yesNoToBool(r.meaning_en_done, `${file} ${workId}`),
        meaning_hi_done: yesNoToBool(r.meaning_hi_done, `${file} ${workId}`),
        reviewed: yesNoToBool(r.reviewed, `${file} ${workId}`),
        source_url: r.source_url || null,
        notes: r.notes || null,
        author: r.author || null,
        period: r.period || null,
        origin_note: r.origin_note || null,
        slug,
      });
    }
  }
  return rows;
}

// Segment-line CSVs, keyed by work type. aarti_lines.csv also carries S-prefixed
// stotram rows (reused rather than duplicated); chalisa and vrat_katha each get
// their own file, matching the shape below. A file is optional here: if it
// doesn't exist yet (e.g. vrat_katha_lines.csv before any vrat katha has been
// sourced), it's skipped rather than treated as an error.
const SEGMENT_FILES = ["aarti_lines.csv", "chalisa_lines.csv", "vrat_katha_lines.csv"];

export function buildSegmentRows() {
  const rows = [];
  for (const file of SEGMENT_FILES) {
    if (!fs.existsSync(path.join(DATA_DIR, file))) continue;
    for (const r of readCSV(file)) {
      const row = {
        work_id: r.aarti_id,
        section_path: null,
        order_num: Number(r.line_no),
        segment_type: r.section || "verse-line",
        original: r.original || null,
        original_true_script: r.original_true_script && r.original_true_script !== "NA" ? r.original_true_script : null,
        translit_roman: r.translit_roman || null,
        word_by_word: null,
        commentary: null,
        notes: r.notes || null,
      };
      for (const lang of MEANING_LANGS) {
        row[`meaning_${lang}`] = r[`meaning_${lang}`] || null;
      }
      rows.push(row);
    }
  }
  return rows;
}
