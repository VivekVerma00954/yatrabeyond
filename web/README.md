# YatraBeyond

> The most trusted knowledge and connection platform for sacred pilgrimage journeys across India's Hindu sacred sites.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy and configure environment variables
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_SITE_URL for your environment

# 3. Run in development
npm run dev
# → http://localhost:3000

# 4. Build for production
npm run build && npm start

# 5. Lint, format, type-check
npm run lint
npm run format:check
npm run type-check

# 6. Run tests
npm test
# Or in watch mode:
npm run test:watch
```

---

## Stack

| Layer | Choice | Swap path |
|---|---|---|
| Framework | Next.js 14 App Router + TypeScript | Replace `src/app/` routing if migrating |
| Styling | Tailwind CSS + brand tokens in `tailwind.config.ts` | Tokens are in one file; swap colours there |
| Content | MDX files + gray-matter | Replace `src/lib/content.ts` adapter to point at a CMS/DB |
| Markdown rendering | react-markdown + rehype-sanitize (XSS-safe) | Swap renderer in `MarkdownContent.tsx` |
| Fonts | next/font (Lora serif + Inter sans) | Change in `src/app/layout.tsx` |
| Search | Client-side fuzzy match over `/api/search/index.json` | Replace with Algolia/Typesense by swapping `SearchBox.tsx` |
| Testing | Vitest + Testing Library + jsdom | Jest is a drop-in swap |

---

## Folder structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home
│   ├── yatra/
│   │   ├── page.tsx        # All-sites index with filters
│   │   └── [slug]/page.tsx # Individual site page (12 sections)
│   ├── regions/
│   │   ├── page.tsx        # Region list
│   │   └── [region]/page.tsx
│   ├── about/page.tsx
│   ├── search/page.tsx
│   ├── brand/page.tsx      # Style guide / design system
│   ├── community/page.tsx  # STUB — not built
│   ├── plan/page.tsx       # STUB — not built
│   ├── api/search/index.json/route.ts  # Static search index endpoint
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── layout.tsx          # Root layout (fonts, Header, Footer)
│   └── globals.css         # Tailwind + CSS variables
│
├── components/
│   ├── Logo.tsx            # Logo with swappable icon slot
│   ├── SiteCard.tsx        # Card used in grids and search results
│   ├── SearchBox.tsx       # Client-side fuzzy search widget
│   ├── SiteInPageNav.tsx   # Sticky in-page nav for site pages
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   └── MarkdownContent.tsx   # Secure markdown renderer
│   └── site-sections/
│       ├── index.tsx             # Barrel export
│       ├── SectionWrapper.tsx    # Shared heading + anchor wrapper
│       ├── Overview.tsx
│       ├── History.tsx
│       ├── SpiritualSignificance.tsx
│       ├── Scriptures.tsx        # Includes editorial verification note
│       ├── PilgrimageInfo.tsx
│       ├── FamilySuitability.tsx
│       ├── Accommodation.tsx
│       ├── LocalServices.tsx
│       ├── DosDonts.tsx          # Structured two-column layout
│       ├── NearbyLocations.tsx   # Card grid with distance badges
│       ├── Preservation.tsx
│       └── GivingBack.tsx
│
├── content/sites/          # MDX content files — one per sacred site
│   ├── kedarnath.mdx
│   └── kashi-vishwanath.mdx
│
├── lib/
│   ├── cn.ts               # Tailwind class merging utility
│   ├── content.ts          # MDX file loader (gray-matter)
│   ├── search-index.ts     # Builds serialisable search index
│   └── structured-data.ts  # JSON-LD generators (Place, Article, WebSite)
│
├── types/
│   └── sacred-site.ts      # All TypeScript types for the content model
│
└── __tests__/
    ├── setup.ts
    ├── lib/
    │   ├── content.test.ts
    │   └── search-index.test.ts
    └── components/
        ├── Logo.test.tsx
        └── Badge.test.tsx
```

---

## How to add a new sacred site

1. Create `src/content/sites/<slug>.mdx` — copy an existing file as a template.
2. Fill in the frontmatter fields (see `src/types/sacred-site.ts` for the full schema).
3. Add a hero image to `public/images/sites/<slug>.jpg` (or update `heroImage` to an external URL).
4. The site will automatically appear in:
   - `/yatra` index
   - `/regions/[region]` page
   - `/api/search/index.json` search endpoint
   - `sitemap.xml`
5. Run `npm run type-check` to catch any missing required fields.

### Required frontmatter fields

```yaml
name: string
slug: string          # must match the filename
region: string        # Indian state / geographic region
state: string
deity: string
tradition: Shaivism | Vaishnavism | Shaktism | Smartism | ...
bestSeason: string[]  # Month names
accessibilityLevel: easy | moderate | difficult | very-difficult
familySuitable: boolean
heroImage: string     # /images/sites/... or absolute URL
heroImageAlt: string  # descriptive alt text
lastReviewed: string  # ISO date YYYY-MM-DD
sources: []           # At least one source required
```

### Optional section fields (all markdown strings)

`overview`, `history`, `spiritualSignificance`, `scriptures`, `pilgrimageInfo`,
`familySuitability`, `accommodation`, `localServices`, `preservation`, `givingBack`

Structured fields: `dosDonts` (object with `dos[]` and `donts[]`),
`nearbySacredLocations` (array with `name`, optional `slug`, `distanceKm`, `note`).

Any omitted section is **silently hidden** — the section component returns `null`.

---

## How to swap the logo

1. Open `src/components/Logo.tsx`.
2. Find the comment `<!-- LOGO ICON SLOT -->` (look for `.logo-icon-slot`).
3. Replace the placeholder `<svg>` with your final SVG or an `<Image>` component.
4. Adjust the `sizes` constants at the top of the file if your icon has different proportions.

The wordmark font and colour tokens are defined in Tailwind and will auto-adapt.

---

## Design tokens

All brand tokens live in **one place**: `tailwind.config.ts` → `theme.extend.colors.brand`.
CSS variables that mirror them are in `src/app/globals.css` → `:root` / `.dark`.

| Token | Hex | Usage |
|---|---|---|
| `brand-brown` | `#3A2A1E` | Primary text, header, dark-mode base |
| `brand-terracotta` | `#B5532E` | Links, buttons, active states |
| `brand-gold` | `#C9A227` | **Sparing** highlights only — never small text |
| `brand-cream` | `#F4ECDD` | Warm surfaces, cards, section bands |

Visit `/brand` to see the live style guide.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes (production) | Absolute URL, no trailing slash |

See `.env.example` for the full list. Never commit `.env.local`.

---

## Content notes

The two sample sites (Kedarnath, Kashi Vishwanath) are seeded with well-known
public information **for development and editorial review only**. Every site page
carries a visible caveat. Before publication:

- Verify all factual claims against cited sources.
- Have scripture references checked by a subject-matter expert.
- Update practical information (temple timings, transport, fees) — it changes annually.
- Remove or update the "Scaffolding content" caveat in the page footer.

---

## Security

- All markdown section content is rendered through `rehype-sanitize` with the
  default schema — raw HTML injection is not possible.
- Security response headers (CSP, HSTS, X-Frame-Options, etc.) are set in
  `next.config.ts`.
- No secrets are in the repo; environment variables use `.env.local` (gitignored).
- Dependency surface is kept minimal; audit regularly with `npm audit`.

---

## Phase 2 checklist (stubbed, not built)

- [ ] `/community` — pilgrimage forums and Q&A
- [ ] `/plan` — personalised itinerary builder
- [ ] User accounts and authentication
- [ ] CMS integration (replace `src/lib/content.ts` adapter)
- [ ] Algolia/Typesense full-text search (replace `SearchBox.tsx`)
- [ ] RSS feed (`/feed.xml`)
- [ ] PWA offline support (service worker)
- [ ] Image CDN integration
- [ ] Analytics integration
- [ ] Dark-mode toggle UI (CSS class switching is already wired; needs a UI control)
