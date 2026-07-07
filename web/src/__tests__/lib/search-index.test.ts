import { describe, it, expect } from "vitest";
import { buildSearchIndex, matchesQuery, siteToRecord, workToRecord } from "@/lib/search-index";
import { getAllSites } from "@/lib/content";
import type { Deity, PrayerWork } from "@/types/prayer";

const deity: Deity = {
  deity_key: "shiva",
  name: "Shiva",
  deity_group: "shiva",
  tradition: "Shaivism",
  aliases: [],
  notes: null,
};

const work = {
  work_id: "A003",
  title: "Om Jai Shiv Omkara",
  work_type: "aarti",
  deity_key: "shiva",
  copyright_risk: "PD-clear",
  reviewed: false,
  slug: "om-jai-shiv-omkara",
  segments: [
    {
      work_id: "A003",
      order_num: 1,
      segment_type: "refrain",
      original: "ॐ जय शिव ओंकारा",
      translit_roman: "om jai shiv omkara",
    },
  ],
} as unknown as PrayerWork;

describe("search index builder", () => {
  it("produces unified records for sites, prayers, and deities with content", () => {
    const sites = getAllSites();
    const index = buildSearchIndex(sites, [work], [deity]);
    expect(index.length).toBe(sites.length + 2); // + prayer + shiva hub
    expect(index.map((r) => r.kind)).toContain("prayer");
    expect(index.map((r) => r.kind)).toContain("deity");
  });

  it("excludes deities that have no prayers and no sites", () => {
    const lonely: Deity = { ...deity, deity_key: "rahu", name: "Rahu" };
    const index = buildSearchIndex(getAllSites(), [work], [deity, lonely]);
    expect(index.find((r) => r.name === "Rahu")).toBeUndefined();
  });

  it("links each record to its canonical path", () => {
    const kedarnath = getAllSites().find((s) => s.slug === "kedarnath");
    expect(kedarnath).toBeDefined();
    expect(siteToRecord(kedarnath!).path).toBe("/yatra/kedarnath");
    expect(workToRecord(work, deity).path).toBe("/lyrics/aarti/om-jai-shiv-omkara");
  });
});

describe("matchesQuery", () => {
  it("matches prayers by roman transliteration — how people actually search", () => {
    expect(matchesQuery(workToRecord(work, deity), "om jai shiv")).toBe(true);
  });

  it("matches sites by tag", () => {
    const kedarnath = getAllSites().find((s) => s.slug === "kedarnath");
    expect(matchesQuery(siteToRecord(kedarnath!), "jyotirlinga")).toBe(true);
  });

  it("does not match unrelated queries", () => {
    expect(matchesQuery(workToRecord(work, deity), "annapurna stuti")).toBe(false);
  });
});
