// ── Sacred Site content model ────────────────────────────────────────────────
// This is the single source of truth for site data shape.
// Frontmatter in each .mdx file must conform to SacredSiteFrontmatter.
// The resolved SacredSite adds computed fields.

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Source {
  title: string;
  url?: string;
  type: "scripture" | "academic" | "government" | "journalism" | "other";
}

export interface DosDonts {
  dos: string[];
  donts: string[];
}

export interface NearbyLocation {
  name: string;
  slug?: string;
  distanceKm?: number;
  note?: string;
}

export type Tradition =
  | "Shaivism"
  | "Vaishnavism"
  | "Shaktism"
  | "Smartism"
  | "Jainism"
  | "Buddhism"
  | "Sikhism"
  | "Other";

export type Season = "January" | "February" | "March" | "April" | "May" | "June"
  | "July" | "August" | "September" | "October" | "November" | "December";

export type AccessibilityLevel = "easy" | "moderate" | "difficult" | "very-difficult";

/** Travel-taxonomy pillar facets (docs/PLATFORM_VISION_AND_MOAT.md §1). */
export type SiteDomain = "religious" | "adventure" | "tourism";
export type GeoScope = "india" | "international";

/** Linked (never hosted) external video with creator attribution. */
export interface VideoLink {
  title: string;
  channel: string;
  url: string;
  relationship: "official" | "creator" | "community";
}

// ── Raw frontmatter shape (parsed directly from MDX) ─────────────────────────
export interface SacredSiteFrontmatter {
  // Identity
  name: string;
  slug: string;
  region: string;      // geographic region / state (e.g. "Uttarakhand")
  state: string;       // Indian state
  deity: string;       // primary deity / presiding deity (display name)
  /** Canonical deity key from deity_reference.csv — joins this site to the
   * prayer library and /deity hubs. */
  primaryDeity?: string;
  /** Additional enshrined/associated deities (canonical keys), e.g. Kashi
   * also gathers Annapurna and Kaal Bhairav. */
  relatedDeities?: string[];
  tradition: Tradition;
  /** Taxonomy facets; default religious/india when omitted. */
  domain?: SiteDomain;
  geoScope?: GeoScope;
  festivals?: string[];   // architecture-reserve: festival calendar (Phase 2)
  media?: VideoLink[];    // linked darshan/vlog videos with attribution
  tags?: string[];
  featured?: boolean;

  // Discovery & filters
  bestSeason?: Season[];
  accessibilityLevel: AccessibilityLevel;
  accessibilityNotes?: string;
  altitude?: number;   // metres above sea level
  familySuitable: boolean;
  coordinates?: Coordinates;

  // Media
  heroImage: string;
  heroImageAlt: string;

  // Editorial
  lastReviewed: string;  // ISO date string, e.g. "2024-03-01"
  sources: Source[];

  // ── Section content (markdown strings) ───────────────────────────────────
  // Each section is a markdown string rendered by MarkdownContent.
  // Omit a field entirely to hide that section gracefully.
  overview?: string;
  history?: string;
  spiritualSignificance?: string;
  scriptures?: string;
  pilgrimageInfo?: string;
  familySuitability?: string;
  accommodation?: string;
  localServices?: string;
  dosDonts?: DosDonts;
  nearbySacredLocations?: NearbyLocation[];
  preservation?: string;
  givingBack?: string;
}

// ── Resolved site (frontmatter + computed helpers) ────────────────────────────
export interface SacredSite extends SacredSiteFrontmatter {
  /** Excerpt from overview for cards / meta descriptions (auto-generated) */
  excerpt: string;
  /** Body content of the MDX file — editorial notes, not the 12 sections */
  body?: string;
}

// ── Index record used by search ───────────────────────────────────────────────
export interface SiteIndexRecord {
  slug: string;
  name: string;
  region: string;
  deity: string;
  tradition: Tradition;
  tags: string[];
  excerpt: string;
}
