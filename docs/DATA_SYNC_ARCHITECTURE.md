# YatraBeyond — Data Sync Architecture: Cowork, Postgres, and the Website

Date: 5 July 2026
Answers two questions raised in planning: how the website should pull data out of Postgres, and whether Cowork should get direct database access to speed up adding content.

---

## 1. How the website should sync from Postgres: build-time export, not a live API

Recommendation: the Next.js site never talks to Postgres at request time, not in dev, not in production. Instead, a small export step (`scripts/export-content-from-db.mjs`) runs Postgres queries and writes static JSON into `web/src/content/generated/`, which the site reads at build time exactly the way it already reads the MDX files in `web/src/content/sites/`. Then `next build` runs as normal and deploys statically to Vercel/Cloudflare Pages, as already planned.

Why this over a live API:

- **It matches the architecture already agreed.** `DATA_ARCHITECTURE.md` §4 says explicitly: "we still generate static pages from the database at build time, so SEO and cost benefits remain." A runtime API would be a step backward from that.
- **It's the most secure option by a wide margin.** Postgres stays bound to `localhost` on the droplet, exactly as `PHASE1_POSTGRES_SETUP_PLAN.md` §2 requires. No API server to write, harden, patch, or expose to the internet. No new attack surface at all, since nothing public ever queries the database, directly or through an API.
- **It's the quickest to actually build.** A REST or GraphQL layer is another service: auth, rate limiting, hosting, monitoring. A build-time export script is one file that runs, writes JSON, and exits.
- **The publish gate is enforced at the only place data leaves the database.** The export script queries `publishable_works` (the view that already encodes `reviewed = true` + an accepted `copyright_risk`), not the raw `works` table. An API would need to re-implement that same check on every request; this way it's structurally impossible to leak an unreviewed item, since it's never queried in the first place.

How it runs: from wherever has SSH access to the droplet (today, that's a local Claude Code session, not Cowork), open a tunnel and run the export, commit the resulting JSON, then build and deploy as normal. Later, if genuinely dynamic pages are needed (i.e. content that must update without a rebuild), the right upgrade is Next.js's on-demand ISR reading from the export JSON, or a scheduled export re-run, not a public database connection. That's a Phase 2+ conversation, not needed for Phase 1's launch content.

---

## 2. Cowork's role: CSVs only, never direct database credentials

Answer: no, Cowork should not get direct database write access, and it wouldn't fully work even if you wanted it to.

**It's not just a permissions question.** Cowork sessions run in a sandboxed environment with allowlist-only network egress, they cannot reach the droplet's Postgres over the network at all, confirmed already during the Postgres setup (`PHASE1_POSTGRES_SETUP_PLAN.md` §6 log, 5 Jul). Storing credentials here wouldn't change that.

**It's also not the right shape even if it did work.** The whole editorial system (`RUNBOOK_lyrics.md`) is built around the CSVs as the human-reviewable source of truth: every addition goes through sourcing, cross-checking, copyright triage, and your review, all visible as plain-text diffs in files you can read directly. If Cowork wrote straight to a live database, that review surface disappears, and a mistake (wrong copyright_risk, a line entered wrong) goes straight into what the site could eventually publish, with no diff to catch it first.

**The actual workflow, unchanged by adding Postgres:**

1. Cowork (or you) adds/edits content in `data/*.csv`, following `RUNBOOK_lyrics.md`, exactly as it does today.
2. When you want those changes reflected in the database, a session with real droplet access (currently: a local Claude Code session with SSH) runs `scripts/sync-csv-to-postgres.mjs`. It's an upsert, safe to run repeatedly, and it's the only thing that writes to Postgres.
3. When you want the website to reflect the database, that same kind of session runs `scripts/export-content-from-db.mjs`, commits the generated JSON, and the site builds from it as normal.

No database credentials live anywhere in this OneDrive folder, not in a doc, not in a script, not in a config file. `web/.env` (gitignored, real values only) and whatever secret store the SSH-capable session uses are the only places they exist. This also means the CSVs stay meaningfully useful even after Postgres exists, they're not being replaced as the editing surface, only supplemented with a database that the site can build from at scale.

**Practical effect for you:** describe new content to Cowork the same way you always have (or hand it a source to work from per the runbook), Cowork updates the CSVs, and periodically ask whichever session has droplet access to run the two scripts above to push it live. Nothing about your day-to-day process needs to change.
