# YatraBeyond — Data Architecture and Presentation Plan

Date: 3 July 2026
Purpose: answer the hard questions before any code. How does all our content fit one model? Line-by-line prayers, structured forms (doha, chaupai, ashtapadi), and large scriptures that themselves contain bhajans, dohas and explanations. How do languages and translations display flexibly? How do temples fit? Do we need a database? How is SEO built in from day one? And how do we keep it visually beautiful.

This is a plan, not code.

---

## 1. The one idea that makes everything fit: Work → Segment

Every text we will ever publish (aarti, chalisa, stotram, vrat katha, and later full scriptures) is the same shape underneath:

- A **Work** = one publishable text with its own page (e.g. "Hanuman Chalisa", "Shiv Tandav Stotram", "Sundarkand", "Satyanarayan Vrat Katha").
- A Work is an ordered list of **Segments**.
- A Segment is one unit of text: a refrain line, a doha, a chaupai, a shloka, an ashtapadi stanza, a prose paragraph, a heading, an embedded bhajan line, or a "simple explanation" note.
- Segments can **nest under sections** (a scripture has Kanda / chapter → segments), so the same model scales from a 6-line aarti to a 10,000-verse epic.

Our current `aarti_lines.csv` is already this model in its simplest form: it is a flat list of segments (refrain / verse line) under one Work. We are not changing that good work; we are generalising it so scriptures and stotrams reuse it.

### What a Segment carries

| Field | Meaning |
|---|---|
| `work_id` | which Work it belongs to |
| `section_path` | e.g. `Sundarkand > Doha 1` (empty for flat works like aartis) |
| `order` | position within the work/section |
| `segment_type` | refrain, verse-line, doha, sortha, chaupai, chhand, shloka, ashtapadi, bhajan-line, prose, heading, mantra, phalashruti |
| `original` | native script (usually Devanagari) |
| `original_true_script` | when the true original is Tamil/Telugu/etc. |
| `translit_roman` | Roman transliteration |
| `meaning_*` | meaning per language (en, hi, mr, gu, pa, bn, ta, te, kn, ml) |
| `word_by_word` | optional padachheda, for study mode |
| `commentary` | optional deeper explanation |
| `notes` | variant flags, "CONFIRM WORDING", etc. |

Because `segment_type` is just a label, new forms cost nothing: an ashtapadi is a segment_type, a bhajan embedded inside a scripture chapter is a segment_type. The reader learns to render each type; the data never has to be restructured.

### Scriptures specifically

A scripture is a Work with real hierarchy and mixed segment types in one flow:

```
Work: Ramcharitmanas
 └ Section: Sundarkand
    ├ Segment (doha)      original / translit / meaning
    ├ Segment (chaupai)   original / translit / meaning
    ├ Segment (prose)     "simple explanation of this passage" (our own words)
    └ Segment (bhajan)    an embedded devotional song
```

So yes, scriptures work like the current line-by-line data, just with (a) section nesting and (b) more segment types, including prose explanations and embedded bhajans. Nothing new conceptually. Large scriptures get chapter-level pages and in-work search.

---

## 2. Presentation: flexible layers the user controls

Each segment can show up to five **layers**. The reader chooses which are on.

1. **Original script** (Devanagari, or the true native script)
2. **Transliteration** (Roman; optional Devanagari transliteration for Sanskrit)
3. **Meaning** (in the reader's chosen language, from our set)
4. **Word-by-word** (optional, study aid)
5. **Commentary / explanation** (optional)

Two reading **modes**, both from the same data:

- **Paath (continuous) mode:** original text flowing for recitation, minimal chrome, optionally one layer (e.g. transliteration) beneath. This is the "one full version for continuous reading" you want.
- **Study mode:** each segment broken out with all enabled layers stacked. This is the "breakdown with meanings" you want.

User controls, remembered between visits: layers on/off, meaning language, script preference, font size, mode, light/dark. Stored locally now; tied to an account later.

This gives full flexibility: a Tamil speaker can read a Sanskrit stotram in original Devanagari with Tamil meaning and Roman transliteration on; a Hindi speaker can hide transliteration and read original + Hindi meaning; a reciter can switch to Paath mode and see only the original at large size.

---

## 3. Temples: same discipline, richer record

Temples extend the existing 12-section site model (already strong). Add:

- `primaryDeity` + `relatedDeities[]` (keyed to `deity_reference.csv`) — this is how a Kedarnath page auto-gathers Shiva prayers, and a Kashi page also gathers Annapurna and Bhairav.
- `geo` (lat/lng) for maps and for Place / TouristAttraction structured data.
- `festivals[]`, timings, how-to-reach, nearby sites (exists).
- `media[]`: darshan and vlog videos (linked, not hosted) with creator attribution.
- Sources + `lastReviewed` (exists) and provenance (author/period for history).

Temples relate to prayers by deity, and to future travel bundles by region/site. One taxonomy ties sites ↔ deities ↔ prayers ↔ travel.

---

## 4. Do we need a database? Staged answer

Recommendation: **start file-based, move to Postgres when scale or editors demand it, keep the site statically generated throughout.** This is the pattern that keeps cost near zero, SEO strong, and growth open.

**Phase 1 (launch with what we have): files → static site.**
Authoring stays in the `data/` CSVs (the trackers and lines). A build step converts them to typed JSON, and Next.js generates static HTML pages. No database, no server cost, fastest possible pages (best for SEO), and it fits the existing codebase. Perfect for the ~147 items plus the first temple set.

**Phase 2 (scriptures and volume): introduce Postgres.**
Large scriptures (thousands of segments) and continuous additions outgrow hand-edited CSVs. Move authoring into a managed Postgres (Supabase or Neon). The Work → Section → Segment → Translation model maps cleanly to relational tables, with a JSONB column for the per-type flexible bits. Crucially, we still generate static pages from the database at build time, so SEO and cost benefits remain. This is "content in Postgres, site statically served."

**Phase 3 (editors and accounts): add an editor UI and user features.**
When non-technical people add temples/prayers, add a headless CMS/admin (Payload on the same Postgres is a strong fit, or Sanity if hosted is preferred). Accounts (saved prayers, planner) also arrive here, via a managed auth provider, never hand-rolled.

Why not a database on day one: a read-mostly content site ranks and loads best as static HTML; a live DB adds cost, ops, and a slower path to Google for no launch benefit. We adopt the database exactly when the content model (scriptures) and the team (editors) need it, and not before. The migration is planned, not a rewrite: the Work/Segment shape is identical in CSV and in Postgres.

---

## 5. SEO built into the data, from the first row

You want people to find our temples, aartis and lyrics on Google. SEO is treated as a data field, not an afterthought.

Add to every Work and Temple, now:

- `slug` (stable, human-readable URL)
- `seo_title` and `meta_description`
- `alt_names[]` / `aka` — the spellings people actually search ("Hanuman Chalisa lyrics", "हनुमान चालीसा", "hanuman chaleesa", "Kedarnath temple history"). These feed titles, headings, and on-page text.
- `keywords[]` and `canonical_language`

Structural SEO (the codebase already has the generators, we extend them):

- JSON-LD per page: CreativeWork/Article for prayers, Place + TouristAttraction for temples, BreadcrumbList everywhere, FAQPage where we answer common questions.
- Static HTML + mobile-first + fast load = the ranking fundamentals, which static generation gives us for free.
- Transliteration means we naturally match Roman-script searches ("om jai jagdish hare lyrics") that most Devanagari-only sites miss. This is a real, ownable SEO edge.
- `hreflang` for language variants; per-type and per-language sitemaps (basic sitemap exists).
- Deity hub pages + dense internal cross-linking = the link graph Google rewards.
- E-E-A-T trust signals: published editorial policy, cited sources, author/period provenance, `lastReviewed` dates. For devotional/heritage content this materially helps ranking and is aligned with our accuracy moat.

Result: each new item ships search-ready because the SEO fields are part of the content model.

---

## 6. Keeping it beautiful

Modern and reverent, never cluttered, never ads by prayer text. Build on the existing tokens (brown #3A2A1E, terracotta #B5532E, gold #C9A227 sparingly, cream #F4ECDD) and Lora + Inter, add Noto Serif Devanagari for original-script lines with generous line-height and a larger base size.

Design principles: calm, paper-like warm surfaces; large legible script; subtle gold only for accents; the **prayer reader as the flagship component** (smooth layer toggles, a sticky language/mode control, distraction-free Paath mode, print stylesheet for the puja shelf, dark mode for early-morning use). Temple pages: strong hero imagery, a map, the existing sticky section nav, a media gallery. Creative but dignified: the subject sets the tone.

Accessibility target WCAG 2.1 AA (alt text already required, gold-never-for-small-text already a rule); mobile-first and low-bandwidth for pilgrim contexts, with PWA offline for prayer pages in a later phase.

---

## 7. Launch-first sequence (matches your "go live, then SEO, then phased growth")

1. Freeze the models above (Work/Segment, Temple, SEO fields, provenance, media).
2. Human-review the 31 done aartis; resolve flagged variant lines; flip `reviewed = yes`.
3. Build the CSV → static-site generation with the publish gate (only PD-clear/PD-likely + reviewed).
4. Ship the prayer reader, `/prayers`, and `/deity/[slug]` hubs; add Devanagari font.
5. Complete the launch temple set (Char Dham + Jyotirlingas), source licensed imagery.
6. Publish editorial/privacy/terms; deploy behind a CDN; register with Google Search Console; submit sitemaps.
7. Go live with what we have. Then: measure search, expand content in fortnightly commits, add chalisas/stotrams, more languages, then scriptures (introducing Postgres), then the travel/commerce module, then accounts/community.

---

## 8. Open decisions this raises

1. Confirm the staged database path (files now → Postgres when scriptures/editors arrive). Any preference between Supabase and Neon can wait until Phase 2.
2. Confirm the five presentation layers and the two reading modes as the reader spec.
3. Confirm we add SEO fields (slug, seo_title, meta_description, alt_names, keywords) and provenance to the models before the merge build.
4. Decide the exact launch set: which temples and which prayer set ship in v1.

*Companion to MASTER_PLAN.md and Fable Review.md. No code written; no content changed by this document.*
