#!/usr/bin/env node
// Export publishable content from Postgres into static JSON the Next.js site
// reads at build time. This is the other half of the CSV -> Postgres ->
// website pipeline: Postgres is authoring/source-of-truth storage, but the
// site itself stays statically generated (per docs/DATA_ARCHITECTURE.md §4),
// so it never opens a live database connection, in dev, in CI, or in
// production. Only this export step, run somewhere with a secured path to
// the droplet, ever talks to Postgres.
//
// WHERE THIS RUNS: same constraint as sync-csv-to-postgres.mjs, needs an SSH
// tunnel (or equivalent private network path) to the droplet. Typical use:
//   ssh -L 5432:127.0.0.1:5432 yatrabeyond_setup@<droplet-ip> -N &
//   DATABASE_URL=postgresql://yatrabeyond_app:<password>@127.0.0.1:5432/yatrabeyond \
//     node scripts/export-content-from-db.mjs
//   git add web/src/content/generated && git commit -m "content: refresh from db"
//   # then `next build` runs exactly as it does today, reading the committed JSON.
//
// This deliberately mirrors how web/src/lib/content.ts already reads
// pre-built MDX files rather than hitting a live source at request time.
// A later lib/prayers.ts would read the JSON this produces the same way.
//
// UNTESTED AGAINST THE LIVE DATABASE: drafted without network access to
// verify it end-to-end. Run and inspect the output before wiring it into the
// site's build.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "web", "src", "content", "generated");

// --include-drafts additionally exports unreviewed works that have segments.
// The copyright gate stays hard in SQL either way: REVIEW-version and
// REVIEW-recent rows never leave the database in any mode. Draft rows keep
// reviewed=false; the site renders them with a mandatory draft banner and
// noindex. Run the strict (default) export before any real launch.
const INCLUDE_DRAFTS = process.argv.includes("--include-drafts");

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("[export] DATABASE_URL is not set. Open the SSH tunnel first, then set DATABASE_URL and re-run.");
    process.exit(1);
  }

  const { default: pg } = await import("pg");
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    // Only publishable_works, never `works` directly: this is the publish
    // gate from docs/PHASE1_POSTGRES_SETUP_PLAN.md enforced at the export
    // boundary, an unreviewed or uncleared item cannot reach the JSON that
    // feeds the site no matter what queries a future page component writes.
    const { rows: publishable } = await client.query(
      "SELECT * FROM publishable_works ORDER BY work_type, priority, work_id"
    );
    // Draft mode still hard-filters copyright_risk in SQL — only the reviewed
    // gate is relaxed, and only behind the explicit flag.
    const { rows: drafts } = INCLUDE_DRAFTS
      ? await client.query(
          `SELECT w.* FROM works w
           WHERE w.copyright_risk IN ('PD-clear','PD-likely','Cleared-authorized')
             AND w.reviewed = false
             AND EXISTS (SELECT 1 FROM segments s WHERE s.work_id = w.work_id)
           ORDER BY w.work_type, w.priority, w.work_id`
        )
      : { rows: [] };
    const { rows: segments } = await client.query("SELECT * FROM segments ORDER BY work_id, order_num");
    const { rows: deities } = await client.query("SELECT * FROM deities ORDER BY deity_key");

    const segmentsByWork = new Map();
    for (const s of segments) {
      if (!segmentsByWork.has(s.work_id)) segmentsByWork.set(s.work_id, []);
      segmentsByWork.get(s.work_id).push(s);
    }

    const worksWithSegments = [...publishable, ...drafts].map((w) => ({
      ...w,
      segments: segmentsByWork.get(w.work_id) || [],
    }));

    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(path.join(OUT_DIR, "works.json"), JSON.stringify(worksWithSegments, null, 2));
    fs.writeFileSync(path.join(OUT_DIR, "deities.json"), JSON.stringify(deities, null, 2));
    fs.writeFileSync(
      path.join(OUT_DIR, "manifest.json"),
      JSON.stringify(
        {
          source: "database",
          generatedAt: new Date().toISOString(),
          includesDrafts: INCLUDE_DRAFTS,
          counts: {
            deities: deities.length,
            worksPublishable: publishable.length,
            worksDraft: drafts.length,
          },
        },
        null,
        2
      )
    );

    console.log(
      `[export] wrote ${publishable.length} publishable + ${drafts.length} draft works and ${deities.length} deities to ${OUT_DIR}`
    );
    console.log("[export] note: works without an accepted copyright_risk never leave the database in any mode.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("[export] failed:", err);
  process.exit(1);
});
