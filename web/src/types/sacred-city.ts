// ── Sacred City content model ────────────────────────────────────────────────
// Cities are a distinct content type from Sacred Sites (temples/locations).
// A city is a hub page: place-level history and significance, plus a
// curated "must visit" list of temples within it — cross-linked to
// SacredSite pages by slug where already covered on this platform, and
// named-only (with a `covered: false` flag) where not yet written.
//
// Cross-reference IDs: this schema anticipates the tracker registry in
// data/city_reference.csv, data/site_reference.csv, data/state_reference.csv,
// and data/country_reference.csv (cityId, siteId, stateId, countryId below
// are the stable codes used there — e.g. "CTY-001", "TMP-0083", "ST-36",
// "CTRY-01"). Frontmatter carries the display name for state/country now;
// the *_Id fields are optional and forward-compatible with the future
// State and Country page build described in PLATFORM_VISION_AND_MOAT.md —
// adding those pages later is additive, not a schema change here.

import type {
  Coordinates,
  Source,
  DosDonts,
  NearbyLocation,
  Season,
  AccessibilityLevel,
  Tradition,
  SiteDomain,
  GeoScope,
} from "./sacred-site";

/** One entry in a city's "must visit" temple list. */
export interface MajorTemple {
  name: string;
  /** Set only when this temple already has a dedicated SacredSite page on
   * this platform — enables a real internal link. */
  slug?: string;
  /** Stable site_reference.csv code (e.g. "TMP-0083"), when covered. */
  siteId?: string;
  /** Whether this temple already has a dedicated page on this platform. */
  covered: boolean;
  /** Short one-line description shown alongside the name. */
  note?: string;
}

// ── Raw frontmatter shape (parsed directly from MDX) ─────────────────────────
export interface CityFrontmatter {
  // Identity
  name: string;
  slug: string;
  /** Stable city_reference.csv code, e.g. "CTY-001". */
  cityId: string;
  state: string;        // display name, e.g. "Uttar Pradesh"
  /** Stable state_reference.csv code, e.g. "ST-36". Optional until the
   * State page build exists; safe to add now, no migration needed later. */
  stateId?: string;
  country: string;       // display name, e.g. "India"
  /** Stable country_reference.csv code, e.g. "CTRY-01". */
  countryId?: string;
  /** Primary traditions represented in this city (a city, unlike most single
   * temples, often spans more than one). */
  traditions: Tradition[];
  domain?: SiteDomain;    // default "religious"
  geoScope?: GeoScope;    // default "india"
  festivals?: string[];
  tags?: string[];
  featured?: boolean;

  // Discovery & filters
  bestSeason: Season[];
  accessibilityLevel: AccessibilityLevel;
  accessibilityNotes?: string;
  familySuitable: boolean;
  coordinates?: Coordinates;

  // Media
  heroImage: string;
  heroImageAlt: string;

  // Editorial
  lastReviewed: string;
  sources: Source[];

  // ── Section content (markdown strings, same discipline as SacredSite) ────
  overview?: string;
  history?: string;
  spiritualSignificance?: string;
  pilgrimageInfo?: string;
  familySuitability?: string;
  accommodation?: string;
  localServices?: string;
  dosDonts?: DosDonts;

  /** The "must visit" temple list — this is the city page's equivalent of a
   * temple page's nearbySacredLocations, and the main cross-linking device
   * described in the platform taxonomy (City → Temples). */
  majorTemples: MajorTemple[];

  /** Other cities (not temples) worth linking from this page, e.g. Vrindavan
   * ↔ Mathura, or Haridwar ↔ Rishikesh. */
  nearbySacredLocations?: NearbyLocation[];

  preservation?: string;
  givingBack?: string;
}

// ── Resolved city (frontmatter + computed helpers) ────────────────────────────
export interface SacredCity extends CityFrontmatter {
  excerpt: string;
  body?: string;
}

// ── Index record used by search ───────────────────────────────────────────────
export interface CityIndexRecord {
  slug: string;
  name: string;
  state: string;
  country: string;
  excerpt: string;
}
