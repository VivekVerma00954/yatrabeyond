# YatraBeyond — Phase 1 Build Status

Date: 7 July 2026 (built by a local Claude Code session, per `PHASE1_FINAL_BUILD_BRIEF.md`)
Verdict: **the Phase 1 platform is code-complete and building green** (type-check, lint, 32 tests, 97 static pages). What remains is content/asset injection and launch operations — listed precisely in §3 so any session (Opus/Sonnet) can pick them up without re-planning.

---

## 1. What was built in this session

**The merge is done — it's one platform now.**

- **`/lyrics` pillar** — library index, per-type indexes (`/lyrics/aarti|chalisa|stotram|vrat-katha`), and the flagship **prayer reader** (`/lyrics/[type]/[slug]`): Study/Paath modes, per-layer toggles (Devanagari / Roman / meaning), meaning-language switcher across all 10 languages, font-size control, refrains visually distinct, print stylesheet, preferences persisted locally. Noto Serif Devanagari loaded via next/font.
- **`/deity` hubs** — index grouped by `deity_group`, and `/deity/[key]` pages joining prayers + sacred sites (static pages generated only for deities with content; 30 today). This is the SEO spine.
- **`/travel` pillar** — full taxonomy routing (India/International × Religious/Adventure/Tourism) as real routes with honest empty states, `AffiliateDisclosure` on every travel page, partner-bundles placeholder block, referrer-not-provider wording.
- **`/history` pillar** — indexes site histories + deity traditions; long-form history articles slot in later as a Work type (no schema change needed).
- **Temple pages now embed prayers** — `PrayerEmbed` renders "Prayers at {site}" from `primaryDeity` + `relatedDeities[]` (Kashi correctly gathers Shiva + Annapurna + Bhairav + Ganga).
- **Home/nav/footer** rebuilt around the three pillars; dark-mode toggle added (no-flash inline script); social buttons (FB/IG/WhatsApp/YouTube) rendered as muted "coming soon" until URLs exist.
- **Policies** — `/editorial-policy` (runbook rules published), `/privacy` and `/terms` (drafted to `CONTENT_PROTECTION_AND_LICENSING.md` §2 incl. licensing carve-out; both visibly flagged "pending professional legal review").
- **Search** — unified index across sites + prayers + deities, matching Roman transliteration (how people actually search).
- **SEO** — sitemap covers every route (drafts excluded), CreativeWork JSON-LD on prayer pages, BreadcrumbList generator, draft pages noindex'd.
- **Security** — production CSP no longer allows `unsafe-eval`; `X-Frame-Options: DENY` aligned with `frame-ancestors 'none'`; `object-src 'none'`; publish gate enforced at the export boundary and regression-tested in vitest.
- **Data model** — `sacred-site.ts` gained `primaryDeity`, `relatedDeities[]`, `domain`, `geoScope`, plus architecture-reserve `festivals[]` and `media[]` (VideoLink with attribution/relationship).

**Content pipeline state:** the site currently builds from a **draft-preview export**: 0 publishable + **32 draft aartis** (all copyright-accepted, incl. A037 Nangli `Cleared-authorized`), 54 deities. Every draft page carries a mandatory "Draft — pending review" banner and is noindex'd. REVIEW-version/REVIEW-recent items **cannot** be exported in any mode.

## 2. Two deviations to know about (both deliberate, both documented)

1. **The droplet SSH key is missing from this PC.** `%USERPROFILE%\.ssh\yatrabeyond_setup_ed25519` doesn't exist (auth to the droplet fails), so the DB export couldn't run. The CRM/SecurifyHQ root key was **not** used — isolation held. A **new keypair** was generated at the documented path. To restore access (~30 seconds): DigitalOcean web console → droplet `143.244.134.36` → as root, append this line to `/home/yatrabeyond_setup/.ssh/authorized_keys` (and remove the old `yatrabeyond-postgres-setup` line):

   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILEZfoMbX8IryilFmkGbzHQipcOb0qNwqYAQT0wjOgfW yatrabeyond-postgres-setup-2026-07-07
   ```

2. **Generated JSON came from the CSV fallback, pinned to DB parity.** `scripts/export-content-from-csv.mjs` produces the identical shape/gates as the DB export and **pins to the last verified DB state** (147 works / 867 segments): stotram works S041–S045 and all stotram lines (added to the CSVs 6–7 Jul, after the last sync) are excluded, per the instruction to build only from what the database holds. Once SSH is restored: run `npm run sync` (pushes the new stotram content up, when you're ready for it) and `npm run export -- --include-drafts` (or strict `npm run export` for launch) from `scripts/`.

## 3. Remaining pieces (the injection list)

| # | Item | How |
|---|------|-----|
| 1 | **Logo** | Replace the placeholder SVG inside `.logo-icon-slot` in `web/src/components/Logo.tsx` (instructions in the file header). |
| 2 | **Social links** | Fill the four empty `href` strings in `web/src/components/SocialLinks.tsx`. Buttons un-mute automatically. |
| 3 | **Hero imagery** | Replace `web/public/images/sites/*-placeholder.svg` with licensed photos; update `heroImage`/`heroImageAlt` in each site's MDX; then remove `dangerouslyAllowSVG` from `next.config.mjs`. |
| 4 | **Human review of the 32 aartis** | Resolve variant lines (A002, A003, A006, A009, A013), flip `reviewed=yes` in `data/aarti_tracker.csv`, run sync + strict export. Draft banners disappear; pages enter the sitemap. This is the launch gate. |
| 5 | **Remaining temple pages** | 13 more MDX files (Char Dham ×3 + Jyotirlingas ×10) in `web/src/content/sites/`, following the two seeds' 12-section pattern, with `primaryDeity`/`relatedDeities` set from `deity_reference.csv`. |
| 6 | **Restore droplet access** | §2 item 1 above; then re-run the canonical DB export. |
| 7 | **Legal review** | `/terms` + `/privacy` to a lawyer (brief = `CONTENT_PROTECTION_AND_LICENSING.md` §2). Remove `pendingLegalReview` flags when signed off. |
| 8 | **Deploy** | Git repo + CI (lint/type-check/test), Vercel or Cloudflare Pages, Cloudflare in front with bot-management defaults, Search Console + sitemap submission. |
| 9 | **Analytics + email capture** | Self-hosted Plausible/Umami on the droplet (Phase 1 per `PLATFORM_VISION_AND_MOAT.md` idea 6); simple email-capture endpoint (needs a backend decision — not built statically). |
| 10 | **Contact address** | Policies point to "the contact address on the About page" — add one there when the domain's mailbox exists. |

## 4. Commands

```bash
# from scripts/ (needs npm install once)
npm run sync                          # CSV -> Postgres (SSH tunnel required)
npm run export                        # Postgres -> site JSON, strict (launch)
npm run export:preview                # Postgres -> site JSON, incl. draft works
npm run export:csv-fallback:preview   # CSV -> site JSON fallback (DB-parity pinned)

# from web/
npm run dev / build / test / lint / type-check
```
