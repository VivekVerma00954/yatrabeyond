# YatraBeyond — Postgres Setup Plan (Phase 1)

Date drafted: 5 July 2026
Scope: **Phase 1 of the YatraBeyond plan only.** This is one database (`yatrabeyond`) on your DigitalOcean droplet's shared Postgres instance. It does not assume anything about other sites/platforms or a CRM database that may later share the same instance, those are undecided and out of scope here (see `PHASE1_FINAL_BUILD_BRIEF.md`, section 3b). The schema is self-contained and safe to sit alongside other databases on the same server without changes.

**STATUS: DONE (5 Jul 2026, local Claude Code session).** Postgres 16.14 was freshly installed on the droplet, and the role/database/schema/view below were created and verified. **Correction to an earlier assumption:** there was *no* pre-existing Postgres instance on the droplet — the CRM (`crm.securifyhq.com`) runs on **MariaDB** (database `securify_crm`), not Postgres. So `yatrabeyond` sits on its own newly-installed Postgres instance, isolated from the CRM by engine as well as by role/database. Because it's a different engine on a different port (5432 vs 3306), Postgres service restarts do **not** affect the CRM. See `DROPLET_ACCESS.md` §3/§5 for the verified access + install details.

---

## 1. What this sets up

- One dedicated Postgres database: `yatrabeyond`.
- One dedicated, least-privilege application role that owns only this database, not a superuser.
- Tables that replace the six CSVs as the source of truth: `deities`, `works` (aarti/chalisa/stotram/vrat-katha metadata), `segments` (the line-by-line content, generalising `aarti_lines.csv` per the Work→Segment model in `DATA_ARCHITECTURE.md`), `sites` (temples), `site_related_deities`, and `media`.
- A `publishable_works` view that encodes the launch gate in the database itself: only rows that are `PD-clear` / `PD-likely` / `Cleared-authorized` AND `reviewed = true` are returned. Nothing unreviewed or uncleared can be queried by the site build, even by accident.
- An import path from the existing CSVs into these tables, so nothing already done gets re-entered by hand.

## 2. Security posture (non-negotiable before this goes anywhere near the public internet)

- Postgres should **not** listen on a public interface. Keep `listen_addresses` bound to `localhost` (or a private VPC address if the app server is separate), and reach it only via SSH tunnel or from the app server on the same private network. Do not open port 5432 in the droplet's firewall (ufw/DigitalOcean cloud firewall) to the internet.
- Use a dedicated, least-privilege role for the application (`yatrabeyond_app`), never the `postgres` superuser, with `GRANT` limited to the `yatrabeyond` database and its schema.
- Require SCRAM-SHA-256 authentication (Postgres 14+ default), not `trust` or `md5`.
- Generate the application role's password with a proper random generator (e.g. `openssl rand -base64 32`) at setup time. Never put the real password in a document, a commit, or this file. It belongs in the app's `.env` (already gitignored per the website's existing `.gitignore`) or a secrets manager, not here.
- Take an automated daily `pg_dump` backup once real content lives in the database (Master Plan and Fable both flagged backups as a pre-accounts requirement; it applies just as much to the content database). **Implemented 5 Jul 2026 (Round 2):**
  - Script: `/home/yatrabeyond_setup/backups/yb-backup.sh` (mode 700). Runs `sudo -u postgres pg_dump --no-owner --format=plain yatrabeyond | gzip -9` to `~/backups/yatrabeyond/yatrabeyond-<timestamp>.sql.gz`.
  - Location: `/home/yatrabeyond_setup/backups/yatrabeyond/` (dir mode 700). This is in the maintenance user's home, **not** on any web-served path (the droplet's only web root is the CRM's `/var/www/securify-crm/public`; the YatraBeyond site itself deploys statically off-box).
  - Cron (user `yatrabeyond_setup`, verified installed): `17 3 * * * /home/yatrabeyond_setup/backups/yb-backup.sh >> /home/yatrabeyond_setup/backups/yb-backup.log 2>&1` — daily at 03:17.
  - Retention: **14 days** (`find … -mtime +14 -delete` inside the script). Content also lives in `data/*.csv` and (eventually) git, so 14 days of DB snapshots is ample.
  - First backup taken and integrity-checked on 5 Jul 2026 (223 KB, all 6 tables + data, `gzip -t` OK).
  - Restore sketch: `zcat yatrabeyond-<ts>.sql.gz | sudo -u postgres psql -d yatrabeyond` (into an empty/rebuilt DB). `--no-owner` means objects restore as the connecting role, not a hard-coded owner.
- Enable `ssl = on` for any non-localhost connections if the app server ever lives on a different host from the database.

## 3. Schema (DDL)

```sql
-- Run as a superuser once, to create the isolated database and role.
-- Password is a placeholder: replace {{GENERATED_PASSWORD}} with a freshly
-- generated secret before running, and never store the real value in this file.

CREATE ROLE yatrabeyond_app WITH LOGIN PASSWORD '{{GENERATED_PASSWORD}}';
CREATE DATABASE yatrabeyond OWNER yatrabeyond_app;

\connect yatrabeyond

-- Everything below runs inside the yatrabeyond database, owned by yatrabeyond_app.

CREATE TABLE deities (
    deity_key       text PRIMARY KEY,
    name            text NOT NULL,
    deity_group     text,
    tradition       text,
    aliases         text[],
    notes           text
);

CREATE TABLE works (
    work_id             text PRIMARY KEY,          -- e.g. A001, C001
    title               text NOT NULL,
    work_type           text NOT NULL CHECK (work_type IN ('aarti','chalisa','stotram','vrat_katha')),
    deity_key           text REFERENCES deities(deity_key),
    deity_group         text,
    tradition_region    text,
    priority            int,
    copyright_status    text,
    copyright_risk      text NOT NULL CHECK (
        copyright_risk IN ('PD-clear','PD-likely','REVIEW-version','REVIEW-recent','Cleared-authorized')
    ),
    original_sourced       boolean DEFAULT false,
    transliteration_done   boolean DEFAULT false,
    meaning_en_done        boolean DEFAULT false,
    meaning_hi_done        boolean DEFAULT false,
    reviewed                boolean DEFAULT false,
    source_url              text,
    notes                   text,
    author                  text,
    period                  text,
    origin_note             text,
    slug                    text UNIQUE,           -- generated at import time
    created_at              timestamptz DEFAULT now(),
    updated_at              timestamptz DEFAULT now()
);

CREATE TABLE segments (
    segment_id      bigserial PRIMARY KEY,
    work_id         text NOT NULL REFERENCES works(work_id) ON DELETE CASCADE,
    section_path    text,                          -- e.g. 'Sundarkand > Doha 1', empty for flat works
    order_num       int NOT NULL,
    segment_type    text NOT NULL,                 -- refrain, verse-line, doha, chaupai, shloka, etc.
    original                text,                  -- Devanagari
    original_true_script    text,                  -- when the true original isn't Devanagari
    translit_roman          text,
    meaning_en              text,
    meaning_hi              text,
    meaning_mr              text,
    meaning_gu              text,
    meaning_pa              text,
    meaning_bn              text,
    meaning_ta              text,
    meaning_te              text,
    meaning_kn              text,
    meaning_ml              text,
    word_by_word            text,
    commentary              text,
    notes                   text,
    UNIQUE (work_id, order_num)
);

CREATE TABLE sites (
    site_slug           text PRIMARY KEY,          -- e.g. 'kedarnath'
    name                text NOT NULL,
    primary_deity_key   text REFERENCES deities(deity_key),
    region              text,
    geo_lat             numeric,
    geo_lng             numeric,
    domain              text NOT NULL DEFAULT 'religious' CHECK (domain IN ('religious','adventure','tourism')),
    geo_scope           text NOT NULL DEFAULT 'india' CHECK (geo_scope IN ('india','international')),
    status              text NOT NULL DEFAULT 'seed' CHECK (status IN ('seed','drafted','reviewed','published')),
    last_reviewed       date,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

CREATE TABLE site_related_deities (
    site_slug   text NOT NULL REFERENCES sites(site_slug) ON DELETE CASCADE,
    deity_key   text NOT NULL REFERENCES deities(deity_key) ON DELETE CASCADE,
    PRIMARY KEY (site_slug, deity_key)
);

CREATE TABLE media (
    media_id        bigserial PRIMARY KEY,
    work_id         text REFERENCES works(work_id) ON DELETE CASCADE,
    site_slug       text REFERENCES sites(site_slug) ON DELETE CASCADE,
    url             text NOT NULL,
    title           text,
    channel         text,
    relationship    text CHECK (relationship IN ('official','creator','community')),
    CHECK (work_id IS NOT NULL OR site_slug IS NOT NULL)
);

-- The publish gate, enforced in the database, not just the import script.
CREATE VIEW publishable_works AS
SELECT * FROM works
WHERE copyright_risk IN ('PD-clear','PD-likely','Cleared-authorized')
  AND reviewed = true;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO yatrabeyond_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO yatrabeyond_app;
```

## 4. CSV import path

Once the schema exists, import the current trackers so nothing already done is lost or re-typed:

```sql
\copy deities FROM 'deity_reference.csv' WITH (FORMAT csv, HEADER true)
-- works: import each of aarti_tracker.csv, chalisa_tracker.csv, stotram_tracker.csv,
-- vrat_katha_tracker.csv into a staging table first (column names don't match 1:1,
-- e.g. 'id' -> work_id, 'type' -> work_type), then INSERT INTO works SELECT ... from staging.
-- segments: import aarti_lines.csv the same way once a work_id join is confirmed.
```

**Update, 5 Jul 2026: this script now exists.** `scripts/sync-csv-to-postgres.mjs` does exactly this mapping (dependency-free CSV parser, all four trackers plus `aarti_lines.csv`, upserts keyed on `work_id`/`deity_key` so it's safe to re-run). Dry-run tested against the current, verified contents of every tracker: 54 deities, 147 works (38+37+40+32, matching each tracker's row count exactly), 867 segments, zero parse errors, zero slug collisions. Not yet run against the live database, that still needs a session with SSH access to the droplet. See `scripts/README.md` for exact commands, and `docs/DATA_SYNC_ARCHITECTURE.md` for why this stays a CSV-in-the-middle flow rather than direct database writes from Cowork. The counterpart export script, `scripts/export-content-from-db.mjs`, generates the JSON the website reads at build time (Postgres -> JSON -> static site, never a live query from the site itself).

## 5. What I need to actually run this

1. Access to the droplet: either a connector that gives me SSH/shell access, or you run these steps yourself with me providing the exact commands.
2. Confirmation of the Postgres version already installed (or whether it needs installing).
3. Confirmation this is the only database going on this instance for now, or a heads-up if another site's database is being created in the same session, so role/privilege boundaries are set correctly from the start.

## 6. Status log

- 5 Jul 2026: Plan drafted, not executed. Waiting on droplet access.
- 5 Jul 2026: Scoped access (`yatrabeyond_setup` user + key, non-root) set up via Cowork + DO web console. Discovered Cowork sessions cannot reach the droplet at all (sandboxed network, allowlist-only egress) — this isn't fixable by granting more credentials, it's a platform-level restriction. Execution handed off to a local Claude Code session, which has real SSH access from the user's own machine. See `DROPLET_ACCESS.md` for exact access details and unverified items to check first.
- 5 Jul 2026 (local Claude Code session): **Executed and verified.** SSH access confirmed. Found no Postgres on the droplet (CRM runs on MariaDB, not a shared Postgres — the earlier "shared instance" assumption was wrong). With confirmation from Vivek that a fresh Postgres install would not disturb the existing CRM/Frigate/n8n stack (different engine, port 5432 free, localhost-bound, no firewall change), installed **Postgres 16.14**. Created role `yatrabeyond_app` (random password via `openssl rand -hex 24`, stored only in `web/.env`), database `yatrabeyond`, all six tables, and the `publishable_works` view. Verified a TCP SCRAM login as `yatrabeyond_app` and that the publish-gate view returns 0 rows. Security posture (§2) all passes out of the box: `listen_addresses=localhost`, `ssl=on`, `scram-sha-256`, 5432 not exposed in ufw. **Not yet done:** CSV import (§4) and daily `pg_dump` backups (§2) — both deferred as follow-ups.
- 5 Jul 2026 (Round 2, local Claude Code session): **CSV→Postgres sync run for real and verified.** Narrowed `yatrabeyond_setup` sudo first (see `DROPLET_ACCESS.md` §2). Ran `scripts/sync-csv-to-postgres.mjs` over an SSH tunnel with the `yatrabeyond_app` credential from `web/.env` (the per-row upsert over the tunnel is slow, ~1k round-trips, so it was run as a background job rather than a foreground command). Result matches the dry-run exactly: **54 deities, 147 works (aarti 38 / chalisa 37 / stotram 40 / vrat_katha 32), 867 segments**, zero parse errors. Spot-checks confirmed `A037` and `C031` both show `copyright_risk = 'Cleared-authorized'`. `publishable_works` is still **0 rows** — correct and expected: nothing has `reviewed = true` yet, so the publish gate is holding as designed.
