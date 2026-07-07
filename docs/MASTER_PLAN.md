# YatraBeyond — Master Plan and Next Steps

Date: 3 July 2026
Status: living document. Builds on `Fable Review.md` (2 Jul 2026). Where this agrees with Fable it says so briefly; the value here is the gaps beyond Fable, the reorganisation, and a concrete build order.

---

## 1. Where we actually are

Two workstreams sit in the folder, both good, not yet connected.

**The website.** A Next.js 14 + TypeScript + Tailwind codebase (in `Initially done work`). Full recovery confirmed after the OneDrive move: all pages, components, the 12-section site model (`sacred-site.ts`), lib loaders, tests, and two seed sites (Kedarnath, Kashi Vishwanath) are present. Community and Plan are honest stubs. Security posture is already strong.

**The devotional-content library.** Four trackers, one shared schema, `deity_key` on every row:

| Tracker | Items | State |
|---|---|---|
| Aarti | 38 | 31 fully translated (9 languages), rest sourced or held |
| Chalisa | 37 | catalogued and copyright-triaged, not yet sourced |
| Stotram | 40 | catalogued and copyright-triaged, not yet sourced |
| Vrat Katha | 32 | catalogued; most need our own prose retelling |

That is ~147 items with copyright triage on each. The editorial method is documented in `RUNBOOK_lyrics.md`. Nothing is human-reviewed against sung versions yet (`reviewed = no` everywhere, correctly).

**The moat, restated:** verifiable accuracy (two-source rule, never from memory), our own translations, visible caveats, and copyright triage before reproduction. Most competitors are ad-heavy, unsourced, and careless with lyrics. That discipline is the actual differentiator.

---

## 2. What I agree with Fable on (no repetition needed)

Phased build (Foundation, knowledge-site launch, depth, platform); unify the two workstreams via a `/prayers` pillar and `/deity/[slug]` hubs; keep CSVs as the single source of truth and generate site content from them; gate publication on `reviewed = yes` + PD status; launch narrow and deep (one circuit, one prayer set); move code to git and get `node_modules`/`.next` out of OneDrive; Devanagari typography as a first-class requirement; never ads on prayer text; community last, only with funded moderation.

All accepted. The rest of this document is what Fable did not cover or under-specified.

---

## 3. Gaps found on top of Fable

1. **Deity vocabulary drift (fixed).** `deity_key` values had drifted across trackers (`bhairav` vs `bhairava`, `sheetla` vs `sheetala`). I created `deity_reference.csv` (54 canonical deities with `deity_group`, tradition, aliases) and reconciled every key. This registry is the backbone of the site-to-prayer join. Keep all future rows keyed to it.

2. **One `deity_key` is not enough for temple pages.** A Kashi page needs Shiva content *and* Annapurna and Kaal Bhairav, which are Shakti/Shiva forms, not literally `shiva`. Recommended model, in order of precision:
   - `deity_key` (specific, exists) for the item's own identity.
   - `deity_group` (umbrella, now in the registry: bhairava, annapurna→ their groups) for broad roll-ups.
   - **site-level association**: each site page lists its `primaryDeity` plus a `relatedDeities[]` array. This is the accurate way to curate "everything shown on the Kashi page". Add these two fields to `sacred-site.ts`.

3. **The merge itself is unbuilt.** The connective tissue Fable describes (CSV → `/prayers`) does not exist yet. This is the single highest-leverage build and is detailed in section 5.

4. **Partnerships and commerce are under-specified.** You want temple-tour bundles, treks, and air/bus tickets on commission. Fable mentioned affiliation in passing. This needs its own module, disclosure rules, and a legal/entity path (section 6).

5. **External media and provenance labelling.** You want YouTube links for aartis and darshan/vlog videos on temple pages, with clear "what is ours vs sourced" labelling. Neither Fable nor the current schema handles this. Needs a media field set and a provenance badge system (section 7).

6. **Provenance depth (author, date, history).** You want "who wrote this aarti, when, its history" surfaced. The trackers hold `copyright_status` and `notes` but not clean, displayable provenance. Add structured `author`, `period`, `origin_note` fields and extend the runbook to cover scripture and temple-history sourcing the same rigorous way.

7. **Housekeeping specifics.** Remove the redundant `aarti_library_v2.xlsx`. The `.xlsx` files are review conveniences only; the CSVs are canonical. Do not let the build folder live in OneDrive.

---

## 4. Proposed folder reorganisation

Target structure (rename in one clean pass, ideally right before moving to git):

```
YatraBeyond/
├── web/                     ← the Next.js app (was "Initially done work")
│   └── (node_modules & .next stay here, git-ignored, NOT in OneDrive long-term)
├── data/                    ← single source of truth
│   ├── aarti_tracker.csv, aarti_lines.csv
│   ├── chalisa_tracker.csv, stotram_tracker.csv, vrat_katha_tracker.csv
│   └── deity_reference.csv
├── docs/
│   ├── RUNBOOK_lyrics.md
│   ├── Fable Review.md
│   └── MASTER_PLAN.md  (this file)
└── review/                  ← the .xlsx review copies (regenerated from data/)
```

Two cautions before executing:
- The last folder move mid-sync caused trouble. Do the rename only when OneDrive shows "Up to date," in one pass, then leave it.
- The real fix for the code is git, not OneDrive. Once `web/` is in a private repo, OneDrive should hold `data/`, `docs/`, and `review/` only.

I can execute this reorganisation on your say-so.

---

## 5. The merge, built properly (highest priority)

Goal: CSV data becomes live, cross-linked pages, with the publication gate enforced in code so nothing unreviewed or copyright-risky can ship.

1. **Extend the content model.** Add a prayer type to the site (`aarti | chalisa | stotram | vrat-katha`), a generated `slug` per item, and `primaryDeity` + `relatedDeities[]` to `sacred-site.ts`.
2. **Import script.** `data/*.csv` → typed JSON the site consumes. The script hard-filters to `copyright_risk ∈ {PD-clear, PD-likely}` AND `reviewed = yes`. An unreviewed or held item physically cannot render.
3. **`/prayers` index** with filters (deity, type, region, language) reusing the existing `SiteCard`/`SearchBox` patterns.
4. **Prayer reader component** (the flagship): per-line layered display (original / transliteration / meaning), per-layer toggles, meaning-language switcher, font-size control, refrains visually distinct, distraction-free mode, print stylesheet.
5. **`/deity/[slug]` hubs** joining sites + prayers via `deity_reference.csv`. This is the SEO spine and the thing that makes it one platform.
6. **Devanagari font** via next/font (Noto Serif Devanagari), generous line-height, larger base size for original-script lines.

Launch gate for content: human-review the 31 done aartis against sung versions, resolve the flagged variant lines (A002, A003, A006, A009, A013), flip `reviewed = yes`. Days of focused work, not months.

---

## 6. Commerce and partnerships (your travel vision)

Model: free knowledge and prayers forever; money comes from *travel convenience*, cleanly separated from editorial and prayer content. Never ads on or beside prayer text.

Revenue streams, easiest first:
1. **Pilgrimage-services affiliation.** Temple-tour bundles (partner tour operators in India), treks, and transport (air/bus) as affiliate or commission links. Start with affiliate links or a single booking partner; graduate to a partner API when volume justifies it.
2. **Tasteful disclosed sponsorship** by dharmic orgs, temple trusts, tourism boards (Uttarakhand Tourism is already a cited source). Section-level only.
3. **Donations / "support the archive" membership** once trust is established.
4. **Premium planner** (Phase 3): paid convenience tools over free data.

Site shape: a `/travel` (or `/plan`) section holding partner bundles, keyed to the same deity/region/site taxonomy so a Kedarnath page can surface a Char Dham tour naturally. Every commercial link carries a visible affiliate disclosure.

Legal and operational (decisions needed):
- Operating entity and jurisdiction for commission income (you are NZ-based; partners and customers are largely India-facing). This affects tax, GST, and payment flow. Get advice before taking money.
- Written partner agreements: commission %, attribution, cancellation liability (you are a referrer, not the tour operator; make that explicit to users).
- Consumer-protection wording so YatraBeyond is clearly a directory/referrer, not the service provider.

This document flags these; it is not legal advice.

---

## 7. External media and provenance (your "what's ours vs sourced" ask)

Add to each item and site a small media set: `videos[]` (YouTube links: performance of the aarti, or a darshan/temple vlog), each with `title`, `channel`, `url`, and a `relationship` tag (`official` / `creator` / `community`). Embed via privacy-friendly YouTube nocookie, lazy-loaded.

Provenance badge system, shown on every prayer and temple page, so ownership is never ambiguous:
- Original text: Public domain (with author/period when known).
- Translation and commentary: © YatraBeyond.
- Linked video: © the creator/channel, linked not hosted, "not affiliated" where true.
- Temple facts: cited sources with `lastReviewed` date (already in the model).

To support "who wrote it, when, the history": add `author`, `period`, and `origin_note` fields to the trackers (many rows already have this inside `copyright_status`/`notes`; we lift it into clean fields for display). Extend `RUNBOOK_lyrics.md` with a scripture-and-temple-history sourcing standard (two-source, cited, our own prose) so history content meets the same bar as the lyrics.

---

## 8. Recommended order of work

Near-term (I can start now):
1. Reorganise the folder (section 4) — on your approval.
2. Add `deity_group` and clean provenance fields (`author`, `period`, `origin_note`) across the four trackers, keyed to `deity_reference.csv`.
3. Add `primaryDeity` + `relatedDeities[]` and the prayer type to `sacred-site.ts`.
4. Write the CSV → site import script with the publication gate.

Then:
5. Build `/prayers`, the reader component, `/deity/[slug]` hubs, Devanagari font.
6. Content review pass on the 31 done aartis; resolve variant lines; flip `reviewed`.
7. Source licensed hero imagery for the launch site set (Char Dham + Jyotirlingas).
8. Policies (editorial, privacy, terms) and the git + CI + hosting move.

Later (Fable's Phases 2–3): chalisa/stotram production, more languages, `/travel` commerce module, PWA offline for prayer pages, accounts and community with funded moderation.

---

## 9. Decisions needed from you

1. Execute the folder reorganisation now, or wait until the code is in git?
2. Add `deity_group` + provenance fields to the trackers now (recommended)?
3. First build target after the merge foundation: the prayer reader, or the deity hubs?
4. Commerce priority: stand up the `/travel` affiliate module early, or keep it for after the knowledge-site launch?

*Prepared as a plan on top of Fable's review. The only files changed in this pass were the creation of `deity_reference.csv`, `MASTER_PLAN.md`, and the reconciliation of two `deity_key` values in `chalisa_tracker.csv`.*
