# Fable Review: YatraBeyond

Date: 2 July 2026
Scope: everything in the YatraBeyond folder (the "Initially done work" Next.js codebase, RUNBOOK_lyrics.md, and the aarti/chalisa trackers and lines data). This document is standalone and changes nothing else in the folder. Every statement below is grounded in what the folder contains; where I recommend something new, it is clearly marked as a recommendation.

---

## 1. What exists today

Two workstreams are in the folder, both of high quality, but not yet connected to each other.

**Workstream A: the website (Phase 1 codebase).** A Next.js 14 + TypeScript site with Tailwind, MDX content, client-side search, JSON-LD structured data, sitemap/robots, tests, and a documented design system at `/brand`. The content model (`sacred-site.ts`) is thoughtful: 12 editorial sections per site, required sources, `lastReviewed` dates, accessibility levels, family suitability. Two seed sites exist (Kedarnath, Kashi Vishwanath), clearly marked as scaffolding pending expert review. `/community` and `/plan` are honest stubs. Security posture is already above average for a Phase 1 site: rehype-sanitize on all markdown, security headers including CSP and HSTS, no secrets in the repo.

**Workstream B: the lyrics library.** A rigorous, repeatable production method (RUNBOOK_lyrics.md) for a multi-version prayer library: original Devanagari, Roman transliteration, own English and Hindi meanings, per line. The copyright triage system (PD-clear / PD-likely / REVIEW-version / REVIEW-recent) is genuinely well designed and legally sensible. Status: 11 priority-1 aartis fully processed (~868 lines), 3 parked pending copyright clearance, 27 more aartis tracked, 37 chalisas catalogued but not yet sourced. Nothing is human-reviewed against sung versions yet (`reviewed = no` throughout, correctly).

**What does not exist yet:** deployment, hosting choice, images (the images folder is empty), a home for the lyrics data inside the website, a business/revenue plan, legal entity or policy documents, analytics, and any connection between the trackers (CSV) and the site (MDX).

---

## 2. Honest review of the plan

**Strengths.** The strongest asset here is editorial discipline: two-source verification, never typing sacred text from memory, own-words translations, visible caveats until expert review, copyright triage before reproduction. That discipline is the actual moat. Most competing sites in this space are ad-heavy, unsourced, and legally careless with lyrics. A platform that is verifiably accurate, respectful, and clean on ownership can become the reference. The codebase matches that ambition: swap paths are documented for every layer (CMS, search, logo), so nothing built so far is throwaway.

**Risks and gaps, in order of importance:**

1. **The two workstreams are disconnected.** The lyrics library has no schema, route, or component in the site. If they stay separate, you are running two projects. Unifying them is the single biggest structural decision (section 4).
2. **Content velocity is the bottleneck, not code.** Two site pages and 11 aartis will not sustain traffic. The plan needs a realistic content pipeline with a named review step, because `reviewed = no` on everything is currently an honest blocker to launch.
3. **No business model is documented anywhere.** "Most trusted platform" is a mission, not a model. Section 5 proposes options; pick one before Phase 3 spending.
4. **Community and planner are the hardest parts** (moderation, accounts, personal data) and are correctly stubbed. Keep them last.
5. **Housekeeping:** `node_modules` and `.next` build artifacts are inside the OneDrive-synced folder. Move the codebase to a git repository, gitignore is already correct, and keep OneDrive for documents only. Build artifacts in cloud sync cause corruption and sync churn.

---

## 3. Recommended plan to bring this into existence

A four-phase plan, each phase shippable on its own.

### Phase 0: Foundation (2-4 weeks, mostly non-code)
- Register the domain (`.env.example` already assumes yatrabeyond.com) and decide the operating entity and jurisdiction. If any revenue is intended, do this before launch, not after.
- Write three one-page policies before anything is public: Editorial Policy (the runbook rules, published openly, it is a trust signal), Privacy Policy (minimal now: no accounts, no cookies beyond analytics if added), Terms of Use (content licence: your translations are your copyright, state how others may use them).
- Move code to a private git repo (GitHub or similar) with CI running lint, type-check, and tests on every push. The scripts already exist in package.json.
- Choose hosting: Vercel or Cloudflare Pages fit this stack with zero ops. Put Cloudflare (or equivalent CDN/WAF) in front regardless.

### Phase 1: Public launch of the knowledge site (6-10 weeks)
- **Unify the lyrics library into the site** (structure in section 4). This is the launch differentiator: nobody else ships verified, multi-script, own-translation prayer texts with a clean reading UI.
- Build a small import script: `aarti_tracker.csv` + `aarti_lines.csv` → generated content files (or JSON) consumed by a new `/prayers` route. Do not hand-copy CSV rows into MDX, keep the CSVs as the source of truth and generate.
- Only publish items that are `PD-clear` or `PD-likely` AND `reviewed = yes`. That means the launch gate is human review of the 11 done aartis against sung versions, plus resolving the flagged variant lines (A002, A003, A006, A009, A013). This is days of focused work, not months.
- Grow sacred sites to a coherent launch set rather than a random scatter: one complete circuit tells a story. Char Dham (4 sites, Kedarnath is already drafted) plus the 12 Jyotirlingas (Kashi is already drafted) gives ~15 pages with natural internal linking, and both seed pages already carry the right tags.
- Source real hero images with clear licences (own photography, government tourism media with permission, or properly licensed stock). The empty images folder is a launch blocker.
- Add analytics (privacy-respecting, e.g. Plausible-style) and an email capture ("get notified when the planner launches"). The email list is the cheapest asset to start compounding now.
- Expert review pass on the two seeded site pages, per the caveats already written into them.

### Phase 2: Depth and reach (3-6 months)
- Chalisa production (all 37 are PD-triaged in the tracker, Hanuman Chalisa first, it is the single highest-search-volume devotional text in the category).
- Extend meanings beyond EN/HI where the runbook already anticipates it (the honorific-register rules for 9 languages are already written; A014 notes all 9 done, proving the pipeline works).
- Replace client-side search with Typesense/Algolia only when content volume demands it (the README already documents the swap path).
- PWA offline support, prioritised for prayer pages: pilgrims at Kedarnath have no connectivity, and an offline-capable aarti reader is a genuinely loved feature, not a checkbox.
- SEO consolidation: the JSON-LD generators already exist, add FAQ and BreadcrumbList schema, and build deity hub pages (section 4) as the internal-linking spine.

### Phase 3: Platform (only after Phase 1-2 traction)
- User accounts via a managed auth provider (Auth.js, Clerk, or similar; never hand-rolled). Accounts unlock saved prayers, planner drafts, and review contributions.
- `/plan` itinerary builder: start as a simple checklist/route tool over existing site data before attempting anything personalised.
- `/community`: last, and only with a moderation plan funded and staffed (section 6). A devotional community without moderation becomes a sectarian battleground, which would destroy the brand's neutrality.
- CMS adoption (the `content.ts` adapter swap documented in the README) once non-technical editors join.

### Phase 4: Sustainability
Scale whatever revenue model was validated in section 5, add editors, and formalise the expert-review board.

---

## 4. Website and platform structure (recommended)

The current IA plus a new prayers pillar and deity hubs that tie everything together:

```
/                       Home
/yatra                  Sacred sites index (exists)
/yatra/[slug]           Site page, 12 sections (exists)
/regions, /regions/[r]  (exists)
/prayers                NEW: library index (filter: deity, type, region)
/prayers/aarti/[slug]   NEW: line-by-line reader
/prayers/chalisa/[slug] NEW: same reader component
/deity/[slug]           NEW: hub page: the deity's sites + prayers + traditions
/plan                   (stub, Phase 3)
/community              (stub, Phase 3)
/about, /search, /brand (exist)
/editorial-policy       NEW: publish the runbook's rules publicly
/privacy, /terms        NEW: Phase 0 policies
```

The deity hub is the connective tissue: `deity_key` already exists in the trackers and `deity` exists in the site frontmatter, so the join key is already designed. A visitor reading the Kedarnath page should see "Prayers for Shiva: Om Jai Shiv Omkara, Shiv Chalisa" one click away, and vice versa. That cross-linking is what makes this one platform instead of two projects, and it is also the SEO spine.

**Prayer page data model:** keep the CSV schemas exactly as the runbook defines them (they are good), add a generated `slug` per item, and render each line as a row with three toggleable layers: original (Devanagari or `original_true_script`), transliteration, meaning in the reader's chosen language. Refrain rows repeat in full, which the runbook already mandates for synced display, so the UI decision is already made correctly in the data.

**Architecture:** stay on Next.js 14 static generation for everything in Phases 1-2. No database is needed until accounts arrive (Phase 3: add Postgres via a managed host, plus the auth provider). Do not adopt a CMS before there are non-technical editors; the MDX + CSV pipeline is faster for a solo operator.

---

## 5. Business model (recommendation, since none is documented)

The trust positioning constrains monetisation, and that is a feature. Options ranked by fit:

1. **Sponsorship/patronage:** tasteful, disclosed sponsorship by dharmic organisations, temple trusts, and tourism boards (Uttarakhand Tourism is already cited as a source). Section-level ("this circuit guide supported by...") never inline with prayer text.
2. **Pilgrimage-services affiliation:** helicopter bookings, accommodation, travel gear for treks. The Kedarnath page already documents helipads and services; linking to bookable services is natural and useful. Disclose every affiliation.
3. **Donations/membership:** a "support the archive" model fits the editorial-integrity brand. Works only after trust is established.
4. **Premium planner (Phase 3):** free knowledge and prayers forever, paid convenience tools. This is the long-term model that scales.

What to rule out permanently: display ad networks on prayer/lyrics pages, selling user data, and paid placement inside editorial content. Any of these would spend the trust the runbook's rules exist to build.

---

## 6. Security and policy

**What is already right:** sanitised markdown rendering (rehype-sanitize, default schema), HSTS with preload, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors 'none', no secrets in repo, minimal dependency surface, gitignored env files.

**Fix now (small):**
- CSP allows `script-src 'unsafe-eval' 'unsafe-inline'`. Needed in dev, but production should move to nonce-based CSP (Next.js middleware supports this). This is the one real weakness in an otherwise strong header set.
- Minor inconsistency: `X-Frame-Options: SAMEORIGIN` vs CSP `frame-ancestors 'none'`. Align both to deny.
- Add `npm audit` (or Dependabot/Renovate) to CI so dependency review is automatic, as the README already intends.
- Pin the production domain in `NEXT_PUBLIC_SITE_URL` per environment and never fall back to a default in production builds.

**Policies for launch (Phase 1):** privacy policy covering analytics only, cookie-free analytics preferred; terms asserting copyright over your own translations while acknowledging the PD status of originals; the editorial policy published verbatim from the runbook's rules.

**Policies before Phase 3 (accounts/community):**
- Managed authentication only, with MFA available; passwordless/OAuth preferred so you never store passwords.
- Data minimisation: collect email and display name, nothing else, until a feature demands more.
- India's DPDP Act 2023 will apply to Indian users, and GDPR to any EU users; design consent and deletion flows before accounts ship, not after.
- Community moderation policy written and staffed before the forum opens: no sectarian disputes adjudicated by the platform, no medical/miracle claims, no solicitation, human review of flagged content within a defined SLA.
- Rate limiting and abuse protection on every write endpoint from day one of Phase 3.
- Backups: content is in git (inherently backed up); once a database exists, automated daily backups with tested restores.

---

## 7. Do's and Don'ts

**Do:**
- Keep the two-source rule and "never type sacred text from memory" absolute. This is the moat.
- Gate every publication on `reviewed = yes` and copyright_risk of PD-clear/PD-likely. The tracker columns already encode the gate; enforce it in the import script so an unreviewed item physically cannot ship.
- Publish the editorial policy publicly and date-stamp every page (`lastReviewed` already exists in the model).
- Launch narrow and deep: one complete circuit and one complete prayer set beat 50 thin pages.
- Keep refrains stored in full per repetition (already the rule) because synced/scrolling display depends on it.
- Cross-link sites ↔ deities ↔ prayers on every page.
- Start the email list at launch.
- Resolve the open variant lines (A002 doha, A003 lines 11/16/17 and verses 6-10, A006 line 11, A009 line 19, A013 line 26) against the versions you sing, then flip `reviewed`.

**Don't:**
- Don't reproduce any REVIEW-recent text (Jai Santoshi Mata, Shani Dev, Shirdi Sai, Harivarasanam, Khatu Shyam, Nangli Tirath) until cleared. A flag is not permission, as the runbook already states.
- Don't scrape drikpanchang or bhaktibharat as primary sources, comparison only (already the rule, keep it).
- Don't copy or "copy-then-tweak" anyone's translation, ever.
- Don't put ads on or beside prayer text.
- Don't build community before moderation is funded.
- Don't launch accounts before privacy/deletion flows exist.
- Don't take sectarian editorial positions; present traditions, cite sources, stay neutral.
- Don't hand-edit generated content; the CSVs stay the single source of truth for lyrics.
- Don't keep `node_modules`/`.next` in the synced folder; move code to git.
- Don't let practical info (timings, fees, transport) go stale; the README already mandates annual refresh, schedule it.

---

## 8. Design and UI

**What is already right:** the token set (brown #3A2A1E, terracotta #B5532E, gold #C9A227 sparingly, cream #F4ECDD) is warm, restrained, and appropriate to the subject; Lora + Inter is a solid serif/sans pairing; tokens live in exactly one place; dark mode is wired at the CSS level; the `/brand` living style guide exists; focus-visible states are present even in the stub pages, which signals accessibility care.

**Recommendations:**
1. **Devanagari typography is now a first-class requirement.** The lyrics library makes script rendering the core reading experience. Add a proper Devanagari face via next/font (Noto Serif Devanagari pairs well with Lora; Tiro Devanagari Hindi is an alternative), with generous line-height and a larger base size for original-script lines. Test conjuncts and vowel marks; system-font fallback rendering is not acceptable for a prayer reader.
2. **Design the prayer reader as the flagship component.** Per-line layered display (original / transliteration / meaning) with per-layer toggles, a language switcher for meanings, a reader font-size control, visually distinguished refrains, and a distraction-free mode. This one component will define the product's reputation.
3. **Print and offline matter here.** People print aartis for the puja shelf. Ship a print stylesheet and PWA offline for prayer pages (Phase 2).
4. **Mobile first, low bandwidth.** Pilgrim contexts mean poor connectivity and small screens; keep pages static, images lazy and CDN-served (AVIF/WebP is already configured), and test on throttled connections.
5. **Finish the dark-mode toggle** (already on the Phase 2 checklist; the CSS is wired, only the control is missing). Dark mode suits early-morning and evening prayer use.
6. **Imagery discipline:** the empty images folder should be filled with licensed, high-quality photography only. Respectful photography guidelines belong in the editorial policy (e.g. no sanctum interiors where photography is prohibited).
7. **Accessibility target: WCAG 2.1 AA.** The gold-never-for-small-text rule is already documented; extend that rigour: alt text is already required in the schema, add skip links, ensure the in-page nav (`SiteInPageNav`) is keyboard-friendly, and audit contrast in dark mode.

---

## 9. Ten immediate next actions

1. Move the codebase into a git repository with CI; take `node_modules`/`.next` out of OneDrive.
2. Human-review the 11 completed aartis against sung versions and resolve the flagged variant lines; flip `reviewed` to yes.
3. Write the CSV → site import script with the publication gate built in.
4. Build the `/prayers` reader (flagship component) and `/deity/[slug]` hubs.
5. Add Devanagari font support.
6. Complete and expert-review the Char Dham and Jyotirlinga site pages.
7. Source licensed hero imagery.
8. Write and publish editorial policy, privacy policy, terms.
9. Tighten production CSP (nonces), align frame headers, add audit/Dependabot to CI.
10. Deploy to Vercel/Cloudflare Pages behind a CDN, add privacy-respecting analytics and email capture, launch.

---

*Prepared as a standalone review. No existing documents, trackers, or code in the folder were modified.*
