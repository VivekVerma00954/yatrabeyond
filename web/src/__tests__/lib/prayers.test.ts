import { describe, it, expect } from "vitest";
import {
  availableMeaningLangs,
  copyrightLabel,
  getAllDeities,
  getAllWorks,
  getWorkByTypeAndSlug,
  workPath,
} from "@/lib/prayers";

// These tests run against the real generated JSON in src/content/generated —
// they are the regression net for the publish gate: if a REVIEW-* item or an
// empty-segment work ever reaches the export, the build's tests fail.

describe("publish gate (against generated content)", () => {
  it("never exposes a work with an unaccepted copyright risk", () => {
    for (const work of getAllWorks()) {
      expect(["PD-clear", "PD-likely", "Cleared-authorized"]).toContain(work.copyright_risk);
    }
  });

  it("every exported work has renderable segments in order", () => {
    for (const work of getAllWorks()) {
      expect(work.segments.length).toBeGreaterThan(0);
      const orders = work.segments.map((s) => s.order_num);
      expect(orders).toEqual([...orders].sort((a, b) => a - b));
    }
  });

  it("every exported work has a stable slug and type", () => {
    for (const work of getAllWorks()) {
      expect(work.slug).toMatch(/^[a-z0-9-]+$/);
      expect(["aarti", "chalisa", "stotram", "vrat_katha"]).toContain(work.work_type);
    }
  });
});

describe("loaders", () => {
  it("resolves a work by type and slug round-trip", () => {
    const [first] = getAllWorks();
    if (!first) return; // empty content is a valid state (fresh checkout)
    expect(getWorkByTypeAndSlug(first.work_type, first.slug)?.work_id).toBe(first.work_id);
  });

  it("loads the deity registry with respectful display names", () => {
    const deities = getAllDeities();
    if (deities.length === 0) return;
    expect(deities.find((d) => d.deity_key === "shiva")?.name).toBe("Shiv Ji");
    expect(deities.find((d) => d.deity_key === "lakshmi")?.name).toBe("Lakshmi Ji");
    expect(deities.find((d) => d.deity_key === "nangli-sahib")?.name).toBe(
      "Shri Swaroopanand Ji (Nangli Sahib)"
    );
    // Collectives and already-honorific forms stay untouched.
    expect(deities.find((d) => d.deity_key === "navagraha")?.name).toContain("Navagraha");
    expect(deities.find((d) => d.deity_key === "santoshi")?.name).toBe("Santoshi Mata");
  });
});

describe("helpers", () => {
  it("builds canonical reader paths", () => {
    expect(workPath({ work_type: "vrat_katha", slug: "some-katha" })).toBe(
      "/lyrics/vrat-katha/some-katha"
    );
  });

  it("reports only meaning languages that actually exist on the work", () => {
    const work = getAllWorks()[0];
    if (!work) return;
    for (const lang of availableMeaningLangs(work)) {
      expect(work.segments.some((s) => s[`meaning_${lang}`])).toBe(true);
    }
  });

  it("labels authorised works distinctly from public domain", () => {
    expect(
      copyrightLabel({ copyright_risk: "Cleared-authorized" } as never)
    ).toContain("authorisation");
  });
});
