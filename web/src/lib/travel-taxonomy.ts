import type { GeoScope, SacredSite, SiteDomain } from "@/types/sacred-site";

// The Travel pillar's faceted taxonomy (docs/PLATFORM_VISION_AND_MOAT.md §1):
// geo scope (India / International) × domain (Religious / Adventure / Tourism).
// Built as real routing in Phase 1 even where combinations are empty today —
// empty categories are fine; rebuilding the model later is not.

export const GEO_SCOPES: { key: GeoScope; label: string }[] = [
  { key: "india", label: "India" },
  { key: "international", label: "International" },
];

export const DOMAINS: { key: SiteDomain; label: string; description: string }[] = [
  {
    key: "religious",
    label: "Religious",
    description: "Pilgrimage circuits, temple towns, and sacred journeys.",
  },
  {
    key: "adventure",
    label: "Adventure",
    description: "Treks, high passes, and journeys that test as much as they reward.",
  },
  {
    key: "tourism",
    label: "Tourism",
    description: "Heritage, culture, and destinations worth travelling for.",
  },
];

export function isGeoScope(value: string): value is GeoScope {
  return GEO_SCOPES.some((g) => g.key === value);
}

export function isDomain(value: string): value is SiteDomain {
  return DOMAINS.some((d) => d.key === value);
}

/** Sites matching a facet pair; religious/india is the default for legacy content. */
export function sitesForFacet(sites: SacredSite[], scope: GeoScope, domain: SiteDomain): SacredSite[] {
  return sites.filter(
    (s) => (s.geoScope ?? "india") === scope && (s.domain ?? "religious") === domain
  );
}
