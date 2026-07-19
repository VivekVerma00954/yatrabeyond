# YatraBeyond — architecture and operating model

Practical reference for how the project is hosted, synced, and deployed.
Written 2026-07-19. Update when any of these decisions change.

## 1. Repository and cross-PC sync

- One git repository holds the whole content platform: `data/` (CSVs) plus the
  Next.js app in `web/`. Source only. Built HTML is never committed.
- The repo lives OUTSIDE OneDrive, at `C:\Dev\yatrabeyond` on each PC.
  It is NOT kept in the OneDrive folder. Reason: OneDrive syncs git's internal
  object files asynchronously and dehydrates some to cloud placeholders, which
  corrupts `.git`. That is what caused the missing-tree / stale-lock failures.
- Syncing between the office PC and home PC is done by git, not OneDrive:
  - Start of a session:  `git pull`
  - End of a session:     `git add -A` then `git commit -m "..."` then `git push`
- GitHub is the single shared source of truth and the backup. Public repo:
  `https://github.com/VivekVerma00954/yatrabeyond`.
- Commit identity is set locally in this repo to a personal email, so commits
  do not carry a work address in public history.

## 2. Branch model: separate "editing" from "publishing"

- `work` branch = day-to-day editing. Push freely and often. It is private
  backup and PC-to-PC sync. Pushing here does NOT change the public site.
- `main` branch = the reviewed, ready-for-public version.
- Going live is a deliberate act: merge `work` into `main`. That merge is the
  only thing that triggers a production deploy.
- The host is configured with `main` as its production branch, and preview
  builds for other branches are disabled, so `work` pushes cost zero builds and
  never reach the public.

## 3. Hosting split: free content vs future paid products

One domain, two independent deployments joined by subdomains:

- `www.yatrabeyond.com` — the free devotional content site (lyrics, deity hubs,
  temple pages, travel/history). Static. Hosted on Cloudflare Pages.
- `shop.` / `learn.` `yatrabeyond.com` — future paid products (marketplace,
  courses, classes). Dynamic: logins, payments. A SEPARATE app in a SEPARATE
  repo, hosted wherever suits a commercial dynamic app when it is built.

Rationale: keep the commercial, dynamic surface fully separate from the free,
static content site so neither complicates the other, and so hosting choices
for each can differ.

## 4. Build mode: static export

- The content site builds as a Next.js static export (`output: 'export'`),
  emitting plain files served directly by Cloudflare Pages.
- No server runtime, so none of the edge-runtime / SSR friction seen earlier.
- Consequences already handled in config:
  - Security headers live in `web/public/_headers` (Cloudflare-native), not in
    `next.config`'s `headers()` (ignored during export).
  - `images.unoptimized: true` (site uses static image assets).
  - The search index is a `force-static` GET route handler, exported as a file;
    search runs client-side (FlexSearch). No server needed.

## 5. Hosting cost and limits (as of 2026-07)

- Cloudflare Pages free tier: unlimited bandwidth, ~500 builds/month,
  commercial use allowed. Fits an edit-often, deploy-occasionally pattern.
- Vercel free (Hobby) tier was rejected for production because it forbids
  commercial use and caps at 100 build-minutes/month; it would force a paid
  migration once the site earns revenue.

## 6. Data vs media: what goes in git

- Text scales in git for free, effectively forever: prayers, transliterations,
  translations, metadata, and YouTube video IDs. All small.
- Binary media does NOT go in git: deity/temple images and any video. Git bloats
  on binaries and GitHub blocks large files. Store media in object storage
  (e.g. Cloudflare R2 free tier) and reference it by URL from the data.

## 7. Publish gate (unchanged, still enforced)

- Nothing publishes until `reviewed = yes` and copyright status is PD-clear or
  PD-likely. The gate is enforced in code at the export boundary, so even a
  production deploy cannot leak unreviewed or copyright-unsafe content.

## 8. Deploy trigger, in one line

The public site changes only when `main` receives new commits (via a deliberate
`work` -> `main` merge). Editing data and pushing to `work` deploys nothing.
