# YatraBeyond data-sync scripts

Two scripts, one direction each, joined by the `data/*.csv` trackers and the `yatrabeyond` Postgres database:

```
data/*.csv  --sync-csv-to-postgres.mjs-->  Postgres  --export-content-from-db.mjs-->  web/src/content/generated/*.json  --(next build, as today)-->  static site
```

Cowork (or anyone) only ever edits the CSVs. Nobody edits the database by hand and nobody gives the website a live database connection. See `docs/DATA_SYNC_ARCHITECTURE.md` for why this shape was chosen.

## Why this is its own package

`web/` never gets a Postgres driver or a database credential, not in `dependencies`, not in `devDependencies`, not in an env var it reads at runtime. Only this `scripts/` folder does, and only as something a human/SSH-capable session runs deliberately, never something the deployed app or its build pipeline touches automatically. Smaller attack surface for the public-facing site, and the credential only ever needs to exist somewhere with real SSH access to the droplet.

## Setup (run once, wherever you'll execute these)

```bash
cd scripts
npm install
```

## Running the sync (CSV -> Postgres)

Requires an SSH tunnel to the droplet (Postgres is localhost-bound there on purpose, see `docs/DROPLET_ACCESS.md`):

```bash
ssh -L 5432:127.0.0.1:5432 yatrabeyond_setup@<droplet-ip> -N &
DATABASE_URL=postgresql://yatrabeyond_app:<password>@127.0.0.1:5432/yatrabeyond npm run sync
```

Always safe to re-run: every row is an upsert keyed on its id (`work_id`, `deity_key`), and segments are replaced per work_id from the current `aarti_lines.csv`, not appended.

Check what it would do first, without touching the database:

```bash
npm run sync:dry-run
```

## Running the export (Postgres -> site JSON)

Same tunnel, then:

```bash
DATABASE_URL=postgresql://yatrabeyond_app:<password>@127.0.0.1:5432/yatrabeyond npm run export
```

This writes `web/src/content/generated/works.json` and `deities.json`. Only rows that pass the publish gate (`reviewed = true` and an accepted `copyright_risk`) are ever written, enforced by querying the `publishable_works` view, not the raw `works` table. Commit the generated JSON like any other content change, then `next build` picks it up exactly as it already picks up the MDX files in `web/src/content/sites/`.

## Draft-preview mode and the CSV fallback

Both exports accept `--include-drafts` (`npm run export:preview` / `npm run export:csv-fallback:preview`): additionally exports unreviewed works that have segments, each still carrying `reviewed=false` — the site renders those with a mandatory draft banner and noindex. The copyright gate is hard in every mode: REVIEW-version / REVIEW-recent rows never leave the source. Run the strict export before any real deploy.

`export-content-from-csv.mjs` is a fallback for sessions with no network path to the droplet. It produces the identical JSON shape/gates from `data/*.csv`, **pinned to the last verified DB sync** (147 works / 867 segments, 5 Jul 2026) — content added to the CSVs after that sync is excluded until it's actually synced to Postgres. The database remains the source the site should build from; re-run the real export once SSH access is available.

## Status

Sync + export were run against the live database on 5 Jul 2026 (see `docs/PHASE1_POSTGRES_SETUP_PLAN.md` §6). On 7 Jul 2026 the site's generated JSON was produced via the CSV fallback in draft-preview mode (droplet key unavailable — see `docs/BUILD_STATUS_PHASE1.md` §2). Run `sync:dry-run` first regardless of where you run it, to sanity-check the CSV parsing against the real files before it touches anything.
