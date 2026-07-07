# YatraBeyond — Content Protection, Anti-Scraping, and Licensing Strategy

Date: 5 July 2026
Not legal advice. This covers the product/technical decisions clearly, and flags exactly where a lawyer needs to draft or review the actual legal documents before they're published.

---

## 1. Should the site block copy/right-click? No.

Sites that disable text selection, right-click, or copy-paste via JavaScript are not a real answer here, for two separate reasons:

- **It doesn't stop scraping at all.** A bot doesn't use the rendered page the way a person does, it requests the raw HTML/HTTP response directly, or runs a headless browser that ignores JS-level restrictions entirely. Every serious scraper bypasses this trivially (view-source, disabling JS, dev tools, or just hitting the page with `curl`). It only ever inconveniences real humans.
- **It actively hurts the people you want using the site.** A huge, completely legitimate use case for a prayer/aarti site is someone copying a few lines to share with family on WhatsApp, or to print for the puja shelf (already planned as a feature). Blocking copy fights your own users to stop a threat it doesn't actually stop. It also breaks accessibility tools that rely on text selection.

**Recommendation: allow copying freely.** Protect the content through the terms of use (what people are allowed to do with what they copy) and server-side technical measures (below), not client-side tricks. People sharing a line of a prayer with attribution is good for you anyway, it's free reach.

---

## 2. What actually needs to be "very solid": Terms of Use and Privacy Policy

Fable's original recommendation (Phase 0) was two one-pagers: Privacy Policy and Terms of Use, plus a public Editorial Policy. Given the new licensing ambition (idea #7 in `PLATFORM_VISION_AND_MOAT.md`) and the explicit concern about copying/scraping, the Terms of Use needs to do more work than a generic template. A lawyer should draft or review the final version, but here's what it needs to cover, so the brief you hand them is complete rather than generic:

- **Ownership, stated precisely.** The original prayer/scripture text is public domain (say so plainly, don't overclaim it). The translations, transliterations, commentary, structuring, provenance research, and the specific compiled/curated presentation are YatraBeyond's copyright. This mirrors what Fable already flagged: "a website's own page layout/translation is copyrighted even when the underlying ancient text is public domain."
- **Explicit permitted use.** Personal, devotional, non-commercial use (reading, printing for personal puja use, sharing short excerpts with attribution) is free and encouraged. Say this clearly, it's good will and it's also what most visitors are already doing anyway.
- **Explicit prohibited use.** No bulk downloading, scraping, crawling (except identified, permitted search engines), automated reproduction, or republishing of the translations/commentary elsewhere, in whole or in substantial part, without a separate written licence. This is the clause that gives you contractual standing against a scraper even though there's no separate "database right" in NZ law the way there is in the EU, a clear contractual term is still enforceable and is what most terms-of-use rely on for this.
- **A licensing carve-out.** State that bulk/commercial access (API access, dataset licensing, AI training use) is available only under a separate written agreement, and point to a contact for that. This is what turns "someone wants our data" into a business conversation instead of a legal grey area, see section 4.
- **Takedown/enforcement path.** A stated process for what happens when content is found reproduced elsewhere without permission (contact first, escalate if ignored), so there's a documented process to point to if it's ever needed.
- **DPDP Act 2023 (India) and GDPR (EU) coverage**, already flagged by Fable, relevant given the diaspora/international audience: what's collected (minimal, per the existing plan), how long it's kept, and how someone requests deletion.
- **The affiliate/travel disclosure language** from `COMMERCE_ENTITY_POLICY_DRAFT.md`, folded in once `/travel` ships.

None of this needs to exist before there's real traffic worth protecting, but it does need to exist before launch, since Phase 1's sequence already includes publishing editorial/privacy/terms policies before go-live (`PHASE1_FINAL_BUILD_BRIEF.md` §5, step 10). Treat this document as the brief for whoever drafts the real one.

---

## 3. How to actually know if you're being scraped

Realistic detection, roughly in order of effort:

1. **Cloudflare in front of the site (already planned).** Since July 2025, Cloudflare blocks known AI crawlers by default unless a site owner explicitly allows them, and its bot management scores traffic and can challenge or block suspicious requests without touching legitimate visitors or search engines. This is the single highest-leverage thing on this list, and it's infrastructure you were already going to have for the CDN, not an extra system.
2. **`robots.txt`, set deliberately, not left default.** Legitimate crawlers (Google, Bing) respect it, and it costs nothing, but don't rely on it alone, a scraper that ignores it is exactly the case Cloudflare's bot management is for.
3. **Rate limiting and pattern monitoring** at the CDN/WAF layer: many sequential requests from one IP/ASN, requests with no referrer or a non-browser user-agent, or someone systematically walking through slugs (`/prayers/aarti/a001`, `/a002`, `/a003`...) faster than a human would. Cloudflare surfaces this without custom engineering.
4. **A periodic manual check**: since your translations are original wording (never copied from anywhere), an exact-phrase search on Google for a distinctive line from one of your English meanings will surface anyone who's republished it verbatim. Quarterly is plenty at this scale, this is a five-minute check, not a system to build.
5. **Fingerprinting, applied carefully, and only to non-sacred layers.** Subtle, meaningless variations (in commentary or structuring metadata, never in the prayer text itself) can help trace verbatim copies back to your site if they turn up elsewhere. This is a standard technique (the same idea as "trap streets" on maps), but it must never touch the actual sacred text, that would conflict with the accuracy-above-all principle the whole project is built on. Low priority, only worth it once the dataset is valuable enough that someone would bother stealing it wholesale.

---

## 4. How you'd actually sell licensed access, when it's time

This connects to moat idea #7 (dataset licensing), tagged Phase 3+ since the dataset isn't large or proven enough yet to be worth someone's money. When it is, here's the realistic shape of that market right now:

- **Direct enterprise-style deals (OpenAI-Associated Press style arrangements) are not realistic for a site this size.** Those go to large publishers with massive, unique corpora. Don't plan around that.
- **What actually works for small/independent publishers is intermediary infrastructure that's emerging specifically for this**: Cloudflare's own pay-per-crawl mechanism (built on the same bot-blocking infrastructure recommended in section 3), and independent services like TollBit and Sphere, which let a publisher keep control of pricing/access while the intermediary handles metering and billing AI companies for crawl access. Collective licensing schemes (the UK's Publishers' Licensing Services is one early example) are also emerging for smaller players who can't negotiate one-on-one.
- **What this means practically for YatraBeyond**: once Cloudflare is in front of the site (Phase 1 already), you already hold the switch that decides whether AI crawlers can access the content at all, off by default. Turning on a metered/paid access option later (via Cloudflare or a similar intermediary) is a configuration decision at that point, not a system you need to build now.
- **For a specific, direct enquiry** (e.g. a panchang app or another devotional platform wants your dataset specifically, not a generic AI crawl), that's a bespoke licence agreement: define exactly what's licensed (your translations/commentary/structuring, not the public-domain originals, since those can't be exclusively licensed to anyone), the field of use, pricing (flat fee, revenue share, or usage-based), and get it drafted properly at the time, it's a real contract, not a form.

Nothing here needs building for Phase 1. What Phase 1 does need: Cloudflare in front of the site with sane bot-management defaults (already planned as infrastructure), and the Terms of Use licensing carve-out from section 2, so the door is legally and technically already set up correctly for whenever this becomes real.

---
Sources checked for the current AI-licensing market context: [Nieman Lab — Publishers will see no meaningful AI licensing revenue](https://www.niemanlab.org/2025/12/publishers-will-see-no-meaningful-ai-licensing-revenue/), [Nieman Lab — The emerging AI content licensing market puts news publishers in a "double bind"](https://www.niemanlab.org/2026/05/the-emerging-ai-content-licensing-market-puts-news-publishers-in-a-double-bind-a-new-report-warns/)
