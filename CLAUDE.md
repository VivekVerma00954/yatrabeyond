# YatraBeyond — project context for Claude

Auto-loaded at the start of every session in this folder. Keep it short and
current. Detailed method and history live in `docs/`; this file is the map.

## Personal-project isolation (read first)
This is Vivek's PERSONAL project, run on the HQ work seat but kept separate
from HQ work. Do NOT use HQ connectors, skills, plugins, or HQ memory
(Autotask, Datto, Xero, KQM, HSNM, BookStack, hq-memory, etc.). Do NOT write
anything from here into HQ systems. If a task seems to need an HQ tool, stop
and ask. My full personal profile lives in this folder: `PERSONAL_PROFILE.md`.

## Response preferences
Concise and direct. No em dashes (use commas, colons, full stops). Never make
assumptions; ask or state them. Never introduce security vulnerabilities.
Cost-conscious: reuse the cached data and docs below instead of re-researching.

## What YatraBeyond is
A devotional-content plus pilgrimage-travel platform. Three pillars, one site:
- `/lyrics` — prayers library (aarti, chalisa, stotram, vrat-katha) with a
  layered reader (Devanagari / Roman transliteration / meaning in 10 languages).
- `/deity` and temple pages — deity hubs and sacred-site pages, joined to
  prayers via `deity_reference.csv`.
- `/travel` — pilgrimage/travel commerce (affiliate/commission), kept strictly
  separate from prayer content. Never ads on or beside prayer text.

Editorial moat: verifiable accuracy. Two-source rule, never from memory; our
own translations; copyright triage before reproduction; nothing publishes until
`reviewed = yes` AND copyright status is PD-clear/PD-likely. The publish gate is
enforced in code at the export boundary.

## Source of truth and data model
- Canonical data = the CSVs in `data/` (NOT the `.xlsx`, which are review copies).
  Trackers: aarti, chalisa, stotram, vrat-katha (one row per item) plus
  `*_lines.csv` (one row per line), joined by `id`. `deity_reference.csv` is the
  registry (canonical `deity_key`, `deity_group`, tradition, aliases); keep every
  row keyed to it.
- Site content model: `web/src/.../sacred-site.ts` (has `primaryDeity`,
  `relatedDeities[]`, prayer type, `media[]`, etc.).
- Pipeline: `data/*.csv` -> Postgres (`npm run sync`) -> site JSON
  (`npm run export`, strict for launch; `:preview` includes drafts). A CSV
  fallback export exists, pinned to last verified DB state.

## Current state (as of docs dated 7 Jul 2026)
Phase 1 is code-complete and building green (type-check, lint, 32 tests, 97
static pages). The three pillars, prayer reader, deity hubs, temple prayer
embeds, policies, search, SEO, and security posture are built. Site currently
builds from a draft-preview export: 32 draft aartis (copyright-accepted),
54 deities; every draft page carries a "Draft — pending review" banner and is
noindex'd.

## Launch gate / remaining work (see docs/BUILD_STATUS_PHASE1.md §3)
Human-review the 32 aartis (resolve variant lines A002, A003, A006, A009, A013,
flip `reviewed=yes`), then sync + strict export. Plus: logo, social links, hero
imagery, 13 more temple MDX pages, restore droplet SSH access, legal review of
terms/privacy, deploy (git + CI + Vercel/Cloudflare), analytics + email capture.

## Where things are
- `docs/` — the full record. Start points: `MASTER_PLAN.md` (plan + decisions),
  `BUILD_STATUS_PHASE1.md` (what's built + injection list), `RUNBOOK_lyrics.md`
  (the editorial method), `STRATEGIC_REVIEW.md`, `PLATFORM_VISION_AND_MOAT.md`,
  `CONTENT_PROTECTION_AND_LICENSING.md`, `DROPLET_ACCESS.md`.
- `data/` — canonical CSVs. `web/` — Next.js 14 + TS + Tailwind app.
  `scripts/` — sync/export tooling. `review/` — xlsx review copies.
- Droplet: `143.244.134.36` (Postgres). Access notes in `docs/DROPLET_ACCESS.md`.
  Never commit keys or secrets.

## Open decisions (from MASTER_PLAN §9)
Folder reorg timing; provenance fields on trackers; first build target after the
merge (reader vs deity hubs); when to stand up `/travel` commerce.
