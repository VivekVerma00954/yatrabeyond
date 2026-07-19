// ── Deity Profile content model ─────────────────────────────────────────────
// Concise "who is this deity" pages: identity, iconography, key stories,
// family, significance, and regional/sectarian variation. Distinct from the
// Deity registry (deity_reference.csv / prayer.ts) which is a pure lookup/join
// table, and distinct from SacredSiteFrontmatter which is place-scoped.
//
// Follows the same file-based pattern as sacred-site content: authored
// directly as MDX in web/src/content/deities/{deityKey}.mdx, read straight
// off disk (no Postgres sync, no CSV round-trip) and joined to the existing
// /deity/[key] page by deityKey.
//
// Frontmatter in each .mdx file must conform to DeityProfileFrontmatter.

import type { Source } from "./sacred-site";

export type { Source };

// ── Raw frontmatter shape (parsed directly from MDX) ─────────────────────────
export interface DeityProfileFrontmatter {
  /** Canonical deity key from deity_reference.csv, must match exactly. */
  deityKey: string;
  displayName: string;

  // Editorial / publish gate, mirrors the prayer content convention:
  // nothing renders as final/indexed until reviewed = true.
  reviewed: boolean;
  lastReviewed: string; // ISO date string
  sources: Source[];
  tags?: string[];

  // ── Section content (markdown strings) ───────────────────────────────────
  // Each section is optional; omit a field entirely to hide that section.
  quickIdentity?: string;
  namesAndEpithets?: string;
  iconographyAndSymbols?: string;
  keyStories?: string;
  familyAndRelations?: string;
  significance?: string;
  regionalVariation?: string;
}

// ── Resolved profile (frontmatter + computed helpers) ─────────────────────────
export interface DeityProfile extends DeityProfileFrontmatter {
  /** Body content of the MDX file, editorial notes, not the sections above. */
  body?: string;
}
