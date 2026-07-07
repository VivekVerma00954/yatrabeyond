#!/usr/bin/env node
// FALLBACK export: data/*.csv -> web/src/content/generated/*.json, producing
// the exact same JSON shape as export-content-from-db.mjs.
//
// WHY THIS EXISTS: the canonical pipeline is CSV -> Postgres -> JSON (see
// docs/DATA_SYNC_ARCHITECTURE.md). This fallback exists for sessions that have
// no network path to the droplet (e.g. the yatrabeyond_setup SSH key is
// unavailable). The CSVs are the same rows the database was synced from
// (verified identical counts 5 Jul 2026: 54 deities / 147 works / 867
// segments), so the output is content-identical. Before any real deploy,
// re-run export-content-from-db.mjs against the live database so the
// database remains the single verified source the site builds from.
//
// THE PUBLISH GATE IS THE SAME HERE AS IN THE DATABASE VIEW:
//   - copyright_risk must be PD-clear / PD-likely / Cleared-authorized.
//     REVIEW-version and REVIEW-recent NEVER leave this script, in any mode.
//   - reviewed = true is required by default. Passing --include-drafts also
//     exports unreviewed works that have segments, each still carrying
//     reviewed:false; the site renders those with a mandatory draft banner
//     and noindex, and a strict re-export removes them entirely.
//
// Usage:
//   node scripts/export-content-from-csv.mjs                  # strict (launch)
//   node scripts/export-content-from-csv.mjs --include-drafts # preview build

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildDeityRows,
  buildWorkRows,
  buildSegmentRows,
  ACCEPTED_COPYRIGHT_RISK,
} from "./lib/build-rows.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "web", "src", "content", "generated");
const INCLUDE_DRAFTS = process.argv.includes("--include-drafts");

// DB-PARITY PIN: the live database was last synced 5 Jul 2026 and verified at
// 147 works / 867 segments (docs/PHASE1_POSTGRES_SETUP_PLAN.md §6). Content
// added to the CSVs after that sync (stotram works S041–S045 and all stotram
// lines) is Phase 2 material that has NOT been uploaded, and per the standing
// instruction the site only builds from what the database holds. Remove this
// pin only by re-running the real DB export after the next verified sync.
const DB_PARITY = {
  excludedWorkIds: new Set(["S041", "S042", "S043", "S044", "S045"]),
  segmentWorkIdPrefix: "A", // DB segments were the aarti lines only
  expectedWorks: 147,
  expectedSegments: 867,
};

function main() {
  const deities = buildDeityRows();
  const works = buildWorkRows().filter((w) => !DB_PARITY.excludedWorkIds.has(w.work_id));
  const segments = buildSegmentRows().filter((s) =>
    s.work_id.startsWith(DB_PARITY.segmentWorkIdPrefix)
  );

  if (works.length !== DB_PARITY.expectedWorks || segments.length !== DB_PARITY.expectedSegments) {
    console.warn(
      `[export-csv] WARNING: DB-parity mismatch — got ${works.length} works / ${segments.length} segments, ` +
        `expected ${DB_PARITY.expectedWorks} / ${DB_PARITY.expectedSegments}. The CSVs have drifted from the ` +
        `last verified database sync; re-check before trusting this output.`
    );
  }

  const segmentsByWork = new Map();
  for (const s of segments) {
    if (!segmentsByWork.has(s.work_id)) segmentsByWork.set(s.work_id, []);
    segmentsByWork.get(s.work_id).push(s);
  }
  for (const list of segmentsByWork.values()) {
    list.sort((a, b) => a.order_num - b.order_num);
  }

  // Hard gate first: anything not copyright-accepted is dropped unconditionally.
  const accepted = works.filter((w) => ACCEPTED_COPYRIGHT_RISK.has(w.copyright_risk));

  const publishable = accepted.filter((w) => w.reviewed);
  const drafts = INCLUDE_DRAFTS
    ? accepted.filter((w) => !w.reviewed && (segmentsByWork.get(w.work_id)?.length ?? 0) > 0)
    : [];

  const exported = [...publishable, ...drafts]
    .map((w) => ({ ...w, segments: segmentsByWork.get(w.work_id) || [] }))
    .sort(
      (a, b) =>
        a.work_type.localeCompare(b.work_type) ||
        (a.priority ?? 99) - (b.priority ?? 99) ||
        a.work_id.localeCompare(b.work_id)
    );

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "works.json"), JSON.stringify(exported, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "deities.json"), JSON.stringify(deities, null, 2));
  fs.writeFileSync(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(
      {
        source: "csv-fallback",
        generatedAt: new Date().toISOString(),
        includesDrafts: INCLUDE_DRAFTS,
        counts: {
          deities: deities.length,
          worksPublishable: publishable.length,
          worksDraft: drafts.length,
        },
        note:
          "Generated from data/*.csv (fallback). Re-run export-content-from-db.mjs against the live database before deploying.",
      },
      null,
      2
    )
  );

  console.log(
    `[export-csv] wrote ${publishable.length} publishable + ${drafts.length} draft works, ${deities.length} deities to ${OUT_DIR}`
  );
  if (INCLUDE_DRAFTS && drafts.length > 0) {
    console.log(
      "[export-csv] drafts are unreviewed (reviewed=false). The site renders them with a draft banner + noindex. Run a strict export before launch."
    );
  }
}

main();
