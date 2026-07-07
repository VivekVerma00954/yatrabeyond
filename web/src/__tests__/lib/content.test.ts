import { describe, it, expect } from "vitest";
import { getAllSites, getSiteBySlug, getAllSlugs, getAllRegions } from "@/lib/content";

describe("content library", () => {
  it("getAllSites returns at least one site", () => {
    const sites = getAllSites();
    expect(sites.length).toBeGreaterThan(0);
  });

  it("every site has required fields", () => {
    const sites = getAllSites();
    for (const site of sites) {
      expect(site.name).toBeTruthy();
      expect(site.slug).toBeTruthy();
      expect(site.region).toBeTruthy();
      expect(site.deity).toBeTruthy();
      expect(site.heroImage).toBeTruthy();
      expect(site.heroImageAlt).toBeTruthy();
      expect(Array.isArray(site.bestSeason)).toBe(true);
      expect(Array.isArray(site.sources)).toBe(true);
      expect(typeof site.familySuitable).toBe("boolean");
    }
  });

  it("getSiteBySlug returns the correct site for kedarnath", () => {
    const site = getSiteBySlug("kedarnath");
    expect(site).not.toBeNull();
    expect(site?.name).toBe("Kedarnath");
    expect(site?.tradition).toBe("Shaivism");
    expect(site?.featured).toBe(true);
  });

  it("getSiteBySlug returns the correct site for kashi-vishwanath", () => {
    const site = getSiteBySlug("kashi-vishwanath");
    expect(site).not.toBeNull();
    expect(site?.name).toBe("Kashi Vishwanath");
    expect(site?.region).toBe("Uttar Pradesh");
  });

  it("getSiteBySlug returns null for an unknown slug", () => {
    const site = getSiteBySlug("nonexistent-site-12345");
    expect(site).toBeNull();
  });

  it("getAllSlugs includes both sample sites", () => {
    const slugs = getAllSlugs();
    expect(slugs).toContain("kedarnath");
    expect(slugs).toContain("kashi-vishwanath");
  });

  it("getAllRegions returns distinct strings", () => {
    const regions = getAllRegions();
    const unique = new Set(regions);
    expect(unique.size).toBe(regions.length);
  });

  it("sites have generated excerpts", () => {
    const sites = getAllSites();
    for (const site of sites) {
      expect(typeof site.excerpt).toBe("string");
      expect(site.excerpt.length).toBeGreaterThan(0);
    }
  });

  it("kedarnath has dosDonts with non-empty dos and donts", () => {
    const site = getSiteBySlug("kedarnath");
    expect(site?.dosDonts).toBeDefined();
    expect((site?.dosDonts?.dos.length ?? 0)).toBeGreaterThan(0);
    expect((site?.dosDonts?.donts.length ?? 0)).toBeGreaterThan(0);
  });

  it("kedarnath has nearbySacredLocations", () => {
    const site = getSiteBySlug("kedarnath");
    expect(Array.isArray(site?.nearbySacredLocations)).toBe(true);
    expect((site?.nearbySacredLocations?.length ?? 0)).toBeGreaterThan(0);
  });
});
