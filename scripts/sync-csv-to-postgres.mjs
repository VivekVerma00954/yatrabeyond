#!/usr/bin/env node
// Push the six data/*.csv trackers into the yatrabeyond Postgres database.
//
// This is one direction only: CSV -> Postgres. The CSVs stay the canonical
// source Cowork (or anyone) edits; this script is how those edits reach the
// database. It is idempotent (safe to re-run): every row is an upsert keyed
// on its natural id, so running it twice does not duplicate anything.
//
// WHERE THIS RUNS: it needs a real network path to the droplet's Postgres,
// which is bound to localhost there on purpose. Run this from a session with
// SSH access, after opening a tunnel, e.g.:
//   ssh -L 5432:127.0.0.1:5432 yatrabeyond_setup@<droplet-ip> -N &
//   DATABASE_URL=postgresql://yatrabeyond_app:<password>@127.0.0.1:5432/yatrabeyond \
//     node scripts/sync-csv-to-postgres.mjs
//
// It cannot be run from a Cowork session: Cowork's sandbox has no network
// path to the droplet at all (confirmed separately, it's a platform-level
// restriction, not a credentials problem). Credentials for this database are
// never stored in this repo/folder; DATABASE_URL is read from the
// environment only, same as the website already does in web/.env.
//
// UNTESTED AGAINST THE LIVE DATABASE: drafted without network access to
// verify it end-to-end. Run it with --dry-run first and read the plan before
// trusting it against real data.

import { buildDeityRows, buildWorkRows, buildSegmentRows } from "./lib/build-rows.mjs";

const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  const deities = buildDeityRows();
  const works = buildWorkRows();
  const segments = buildSegmentRows();

  console.log(`[sync] parsed ${deities.length} deities, ${works.length} works, ${segments.length} segments`);

  if (DRY_RUN) {
    console.log("[sync] --dry-run: not connecting to the database. Sample rows:");
    console.log(JSON.stringify({ deities: deities.slice(0, 2), works: works.slice(0, 2), segments: segments.slice(0, 2) }, null, 2));
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.error("[sync] DATABASE_URL is not set. Open the SSH tunnel first, then set DATABASE_URL and re-run.");
    process.exit(1);
  }

  // 'pg' is a devDependency of this scripts/ package only, never of web/.
  const { default: pg } = await import("pg");
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query("BEGIN");

    for (const d of deities) {
      await client.query(
        `INSERT INTO deities (deity_key, name, deity_group, tradition, aliases, notes)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (deity_key) DO UPDATE SET
           name = EXCLUDED.name, deity_group = EXCLUDED.deity_group,
           tradition = EXCLUDED.tradition, aliases = EXCLUDED.aliases, notes = EXCLUDED.notes`,
        [d.deity_key, d.name, d.deity_group, d.tradition, d.aliases, d.notes]
      );
    }

    for (const w of works) {
      await client.query(
        `INSERT INTO works (
           work_id, title, work_type, deity_key, deity_group, tradition_region, priority,
           copyright_status, copyright_risk, original_sourced, transliteration_done,
           meaning_en_done, meaning_hi_done, reviewed, source_url, notes, author, period,
           origin_note, slug, updated_at
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20, now())
         ON CONFLICT (work_id) DO UPDATE SET
           title = EXCLUDED.title, work_type = EXCLUDED.work_type, deity_key = EXCLUDED.deity_key,
           deity_group = EXCLUDED.deity_group, tradition_region = EXCLUDED.tradition_region,
           priority = EXCLUDED.priority, copyright_status = EXCLUDED.copyright_status,
           copyright_risk = EXCLUDED.copyright_risk, original_sourced = EXCLUDED.original_sourced,
           transliteration_done = EXCLUDED.transliteration_done, meaning_en_done = EXCLUDED.meaning_en_done,
           meaning_hi_done = EXCLUDED.meaning_hi_done, reviewed = EXCLUDED.reviewed,
           source_url = EXCLUDED.source_url, notes = EXCLUDED.notes, author = EXCLUDED.author,
           period = EXCLUDED.period, origin_note = EXCLUDED.origin_note, slug = EXCLUDED.slug,
           updated_at = now()`,
        [
          w.work_id, w.title, w.work_type, w.deity_key, w.deity_group, w.tradition_region, w.priority,
          w.copyright_status, w.copyright_risk, w.original_sourced, w.transliteration_done,
          w.meaning_en_done, w.meaning_hi_done, w.reviewed, w.source_url, w.notes, w.author, w.period,
          w.origin_note, w.slug,
        ]
      );
    }

    // Segments: delete-and-reinsert per work_id is simpler and safe here since
    // aarti_lines.csv is always the full authoritative line set for that work.
    const workIdsWithSegments = [...new Set(segments.map((s) => s.work_id))];
    for (const workId of workIdsWithSegments) {
      await client.query(`DELETE FROM segments WHERE work_id = $1`, [workId]);
    }
    for (const s of segments) {
      await client.query(
        `INSERT INTO segments (
           work_id, section_path, order_num, segment_type, original, original_true_script,
           translit_roman, meaning_en, meaning_hi, meaning_mr, meaning_gu, meaning_pa,
           meaning_bn, meaning_ta, meaning_te, meaning_kn, meaning_ml, word_by_word,
           commentary, notes
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
        [
          s.work_id, s.section_path, s.order_num, s.segment_type, s.original, s.original_true_script,
          s.translit_roman, s.meaning_en, s.meaning_hi, s.meaning_mr, s.meaning_gu, s.meaning_pa,
          s.meaning_bn, s.meaning_ta, s.meaning_te, s.meaning_kn, s.meaning_ml, s.word_by_word,
          s.commentary, s.notes,
        ]
      );
    }

    await client.query("COMMIT");
    console.log("[sync] done: upserted deities, works, and replaced segments for the works present in aarti_lines.csv");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("[sync] failed:", err);
  process.exit(1);
});
