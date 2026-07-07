# YatraBeyond — Phase 1 Final Build Brief

Date: 5 July 2026
Status: consolidates `Fable Review.md` (2 Jul), `MASTER_PLAN.md` (3 Jul), `DATA_ARCHITECTURE.md` (3 Jul), the tracker/codebase state as of today, and the decisions made in this session. Purpose: one document a single final build session (Fable, Opus, or otherwise) can be handed, instead of planning across several sessions.

---

## 1. Where things stand, verified against the actual data and code

**Devotional library.** Aarti tracker: 38 items, 31 fully done (sourced, transliterated, English meaning), 0 human-reviewed against sung versions yet. Chalisa: 37 items, catalogued and copyright-triaged, none sourced yet. Stotram: 40 items, same state. Vrat Katha: 32 items, none sourced, 16 flagged `REVIEW-version` (copyright needs a closer look before these get written). `deity_reference.csv` (54 entries) is built and both trackers are reconciled to it. `review/library_review.xlsx` is the Excel mirror of all six tables, kept as the human-review copy; the CSVs stay canonical.

**Website.** Verified directly: Next.js 14 + TypeScript app, 12-section site model, two seed pages (Kedarnath, Kashi Vishwanath), component library, tests, sitemap/robots, security headers. The `/images` folder is genuinely empty, still a launch blocker. This matches what Fable and Master Plan reported; nothing was missing or exaggerated.

**Planning docs.** Fable Review and Master Plan agree on the core shape (four-phase build, unify the two workstreams via `/prayers` and `/deity/[slug]`, CSVs as source of truth, gate publication on `reviewed = yes`, launch narrow and deep, community last). Master Plan and Data Architecture add the parts Fable left open: `deity_group` and site-level `primaryDeity`/`relatedDeities`, the CSV-to-site merge script, the Work→Segment data model for future scriptures, staged database (files now, Postgres later), and SEO fields. No real disagreement between the three documents.

---

## 2. Decisions made in this session (5 July)

1. **Process, not just content.** The immediate goal is not to keep building in small increments across sessions. It is to finish planning, gather everything needed, and hand one final, fully-specified brief to a single build session, to avoid fragmented or sidetracked work. This document is that attempt.
2. **Build order.** The prayer reader and the deity hub pages get built together in the final build session, not sequenced.
3. **Commerce timing.** The `/travel` module ships as part of the Phase 1 launch itself, not deferred to after launch as Fable and Master Plan both recommended. Phase 2 then expands it once more data and traffic exist.
4. **Launch scope.** Char Dham (4 sites) + the 12 Jyotirlingas + the 31 done aartis, plus the Nangli Tirath aarti. Resolved, see 3a.
5. **Database direction changed.** Instead of "files now, Postgres later" (Phase 2), the decision is Postgres now, self-hosted on your DigitalOcean droplet, one Postgres instance holding a separate database per site/platform, since YatraBeyond is one of several sites/platforms planned. A CRM database may also live on the same instance. Setup approach resolved, see 3b.

---

## 3. Two items resolved on 5 July

### 3a. Nangli Tirath — RESOLVED, cleared by owner override

Decision: include it. Vivek has close personal ties to the Nangli Darbar Trust/temple organisation, the content is a non-commercial value-add for sangat (devotee) use rather than a claim of ownership or a direct sale, and Vivek accepts responsibility for the item if a rights question ever arises.

Action taken: `aarti_tracker.csv` (A037) and `chalisa_tracker.csv` (C031) both had `copyright_risk` changed from `REVIEW-recent` to a new value, `Cleared-authorized`, with the clearance rationale and date recorded in each row's `notes`. `RUNBOOK_lyrics.md` now documents this new category (section 5a) so future sessions understand it's an owner override, not public domain, and don't apply it elsewhere without an explicit dated instruction. Every other item on Fable's "hold" list (Jai Santoshi Mata, Shani Dev, Shirdi Sai, Harivarasanam, Khatu Shyam) is untouched and still held.

Note: C031's text is still not sourced (`original_sourced = no`). Clearing the copyright flag doesn't skip that step, it still needs to go through the runbook's sourcing phase before it can ship.

### 3b. Postgres on your DigitalOcean droplet — DONE (5 Jul 2026, executed by a local Claude Code session)

Cowork sessions turned out not to be able to reach the droplet at all (sandboxed, allowlist-only network), so execution was handed to a local Claude Code session with real SSH access. That session installed Postgres 16.14 and built the schema from `PHASE1_POSTGRES_SETUP_PLAN.md`, verified. Full detail and log in `PHASE1_POSTGRES_SETUP_PLAN.md` §6 and `DROPLET_ACCESS.md`.

**Correction to the assumption in decision 5 above:** there was no pre-existing shared Postgres instance. The droplet's CRM (`crm.securifyhq.com`, live production, real customer data) runs on MariaDB, not Postgres. `yatrabeyond` sits on its own freshly-installed Postgres instance on that same droplet, isolated from the CRM by engine, port, and role. The droplet is still shared, live infrastructure (also runs Frigate NVR, go2rtc, mosquitto, n8n), so it gets treated with the same care as before, this just corrects what it was already sharing.

Still open, not yet decided: the `yatrabeyond_setup` Linux user was given broad `NOPASSWD:ALL` sudo to get the install done, and hasn't been narrowed since. CSV import into the new tables (§4 of the Postgres doc) hasn't run yet. Daily `pg_dump` backups aren't scheduled yet. See section 6.

---

## 4. New scope: the multi-domain platform taxonomy

Beyond devotional content, the direction discussed today is broader: YatraBeyond becomes a platform with three pillars, Lyrics, Travel, and Religious History, aimed primarily at the Indian diaspora audience, with room to grow into non-religious tourism and international destinations for monetisation and reach, even though none of that content exists yet.

The navigation shape described: a user picks Lyrics, Travel, or Religious History. Inside Travel, they pick National or International, then Religious, Adventure, or Tourism, then see sites within that combination. One database underneath, but the same content can appear in different presentation contexts, for example a Shiva aarti has its own full page under Lyrics, a simplified version embedded on the Kedarnath page (with a link to the full version), and potentially also surfaces on a Shiva temple page outside India (Bali, Nepal, or China were mentioned as examples) if such a page ever exists.

This is a real extension to the Data Architecture model, not just more content. It implies two new fields on the site/temple model (`domain`: religious / adventure / tourism, and `geo_scope`: India / international), and a "view" concept on Works so the same prayer can render as a full reader, an embedded summary, or a cross-reference link, depending on where it appears. None of the three planning docs cover this, since it wasn't part of the original scope.

**RESOLVED, 5 Jul 2026: folded into this build, not deferred.** Vivek's direction: Phase 1 means the structure is built right the first time, future-proof and expandable without rebuilding, even where content doesn't exist yet. See `PLATFORM_VISION_AND_MOAT.md` for the taxonomy architecture detail (pillar routing, `domain`/`geo_scope`, the content-view concept for reusing one prayer across multiple pages) and a curated shortlist of further moat ideas (festival calendar, audio library, a marketplace, priest/puja booking, self-hosted analytics, dataset licensing), each tagged with a phase recommendation so nothing gets over-built now that doesn't need to be.

---

## 5. Consolidated Phase 1 sequence (what a final build session would execute, pending 3a to 4 above)

1. Freeze the data model: Work/Segment, Temple, SEO fields, provenance, media, plus the taxonomy pillars/routing and the architecture-reserve fields from `PLATFORM_VISION_AND_MOAT.md` (festivals, audio, generic vendor/listing shape), schema-only, no content or features built for those yet.
2. Stand up Postgres (per section 3b) and migrate the six CSVs into it as the source of truth, replacing the file-based Phase 1 originally planned.
3. Add `deity_group`, `primaryDeity`/`relatedDeities`, and provenance fields (`author`, `period`, `origin_note`) across the trackers.
4. Build the CSV/Postgres-to-site import with the hard publish gate: only `PD-clear`/`PD-likely` and `reviewed = yes` can render.
5. Human-review the 31 done aartis (now 31, A037 is cleared but was already fully drafted) against sung versions, resolve the flagged variant lines (A002, A003, A006, A009, A013), flip `reviewed = yes`.
6. Build the prayer reader and the `/deity/[slug]` hubs together, with Devanagari font support.
7. Complete and expert-review the Char Dham and Jyotirlinga site pages (the confirmed launch set).
8. Build the `/travel` module for Phase 1 (per the commerce-timing decision), including affiliate disclosure and the taxonomy from section 4 if confirmed.
9. Source licensed hero imagery, the empty `/images` folder is a hard launch blocker.
10. Publish editorial, privacy, and terms policies (brief for the lawyer drafting/reviewing them is in `CONTENT_PROTECTION_AND_LICENSING.md` §2, includes the copyright/anti-scraping/licensing-carve-out clauses, not just a generic template); tighten the CSP (nonce-based, currently `unsafe-inline`/`unsafe-eval`); align `X-Frame-Options` with the CSP's `frame-ancestors`.
11. Deploy behind a CDN (Cloudflare, with bot-management defaults left on per `CONTENT_PROTECTION_AND_LICENSING.md` §3), register with Search Console, submit sitemaps, add privacy-respecting analytics (self-hosted Plausible/Umami per `PLATFORM_VISION_AND_MOAT.md` idea 6) and an email capture.
12. Go live.

---

## 6. Open items before this brief is truly final

1. ~~Resolve Nangli Tirath and Shri Swaroop Chalisa's copyright status.~~ Done, section 3a.
2. ~~Stand up Postgres on the droplet.~~ Done, section 3b.
3. ~~Narrow `yatrabeyond_setup`'s `NOPASSWD:ALL` sudo now that the install is stable.~~ **Done 5 Jul 2026 (Round 2).** Narrowed to `(root)` control of the `postgresql` service only + `(postgres)` runas; verified it can no longer touch the CRM's MariaDB or other services. See `docs/DROPLET_ACCESS.md` §2.
4. ~~Run the CSV-to-Postgres import.~~ **Done 5 Jul 2026 (Round 2).** `scripts/sync-csv-to-postgres.mjs` run against the live DB over an SSH tunnel; verified 54 deities / 147 works / 867 segments, `A037` & `C031` both `Cleared-authorized`, and `publishable_works` correctly holding at 0 (nothing `reviewed=true` yet). See `docs/PHASE1_POSTGRES_SETUP_PLAN.md` §6. Data-flow design unchanged (CSV -> Postgres -> build-time JSON export -> static site; Cowork only ever touches the CSVs) — see `docs/DATA_SYNC_ARCHITECTURE.md`.
5. ~~Schedule daily `pg_dump` backups for the `yatrabeyond` database.~~ **Done 5 Jul 2026 (Round 2).** Daily cron at 03:17, 14-day retention, dumps to `~/backups/yatrabeyond/` (off any web path); first backup taken and integrity-checked. See `docs/PHASE1_POSTGRES_SETUP_PLAN.md` §2.
6. ~~Confirm whether the multi-domain taxonomy is in scope for this build.~~ Done, it's in scope. See `PLATFORM_VISION_AND_MOAT.md`.
7. ~~Legal/entity decision for the `/travel` commission income.~~ Working default set (NZ entity, no action needed until real transactions or the GST threshold approaches), not a final legal position. See `COMMERCE_ENTITY_POLICY_DRAFT.md`, get a professional to confirm at the triggers listed there.
8. Confirm the launch temple set is exactly Char Dham + 12 Jyotirlingas (15 pages), or narrower/wider. (Effectively already answered via the launch-scope decision, this is a formality to close out, not a new question.)
9. Source the Shri Swaroop Chalisa (C031) text through the runbook's sourcing phase, the copyright clearance doesn't skip that step.

---

## 7. Build executed — 7 July 2026

The final build session ran. **The Phase 1 platform is code-complete and building green** (97 static pages; type-check/lint/tests all passing): `/lyrics` with the flagship reader, `/deity` hubs, `/travel` with the full taxonomy, `/history`, prayer embeds on temple pages, policies, unified search, hardened CSP, and the publish gate enforced and regression-tested. Current content is the draft-preview export (32 draft aartis, banner + noindex on every draft).

See `BUILD_STATUS_PHASE1.md` for the full record, the two deviations (droplet SSH key missing from this PC — new keypair generated, needs a 30-second authorized_keys paste via the DO console; content exported via the DB-parity-pinned CSV fallback until then), and the precise injection list (logo, social URLs, imagery, review flips, 13 temple pages, legal sign-off, deploy).
