import type { Metadata } from "next";
import Link from "next/link";
import { getAllDeities, getAllWorks } from "@/lib/prayers";
import { getAllSites } from "@/lib/content";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Deities — Prayers, Sacred Sites & Traditions",
  description:
    "Explore Hindu deities with their prayers, sacred sites, and traditions — Shiva, Vishnu, Shakti, Ganesha, Hanuman, and more.",
};

/** Display order and labels for deity groups from deity_reference.csv. */
const GROUP_LABELS: Record<string, string> = {
  shiva: "Shiva",
  shakti: "Shakti — the Goddess",
  vishnu: "Vishnu & Avatars",
  ganesha: "Ganesha",
  hanuman: "Hanuman",
  kartikeya: "Kartikeya",
  surya: "Surya",
  navagraha: "Navagraha — the Nine Grahas",
  river: "Sacred Rivers",
  "saint-guru": "Saints & Gurus",
  ayyappa: "Ayyappa",
  folk: "Folk Traditions",
  legend: "Legendary Figures",
  other: "Other",
};

export default function DeityIndexPage() {
  const deities = getAllDeities();
  const works = getAllWorks();
  const sites = getAllSites();

  const workCount = new Map<string, number>();
  for (const w of works) {
    if (w.deity_key) workCount.set(w.deity_key, (workCount.get(w.deity_key) ?? 0) + 1);
  }
  const siteCount = new Map<string, number>();
  for (const s of sites) {
    for (const key of [s.primaryDeity, ...(s.relatedDeities ?? [])]) {
      if (key) siteCount.set(key, (siteCount.get(key) ?? 0) + 1);
    }
  }

  // Group deities, keeping the GROUP_LABELS ordering; unknown groups go last.
  const groupOrder = Object.keys(GROUP_LABELS);
  const groups = new Map<string, typeof deities>();
  for (const d of deities) {
    const g = d.deity_group ?? "other";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(d);
  }
  const sortedGroups = [...groups.entries()].sort(
    (a, b) =>
      (groupOrder.indexOf(a[0]) + 1 || groupOrder.length + 1) -
      (groupOrder.indexOf(b[0]) + 1 || groupOrder.length + 1)
  );

  return (
    <div className="mx-auto max-w-8xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-3xl">
        <h1 className="font-serif text-4xl font-bold text-brand-brown dark:text-brand-cream">
          Deities
        </h1>
        <p className="mt-3 font-sans text-lg text-brand-brown/70 dark:text-brand-cream/70">
          Each deity page gathers everything in one place — their prayers from the lyrics
          library, the sacred sites where they preside, and the traditions around them.
        </p>
      </header>

      {sortedGroups.map(([group, groupDeities]) => (
        <section key={group} aria-labelledby={`group-${group}`} className="mb-10">
          <h2
            id={`group-${group}`}
            className="mb-4 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
          >
            {GROUP_LABELS[group] ?? group}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {groupDeities.map((deity) => {
              const prayers = workCount.get(deity.deity_key) ?? 0;
              const deitySites = siteCount.get(deity.deity_key) ?? 0;
              return (
                <Link
                  key={deity.deity_key}
                  href={`/deity/${deity.deity_key}`}
                  className="group rounded-xl border border-brand-brown/10 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta dark:border-brand-cream/10 dark:bg-brand-brown/20"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-serif text-lg font-semibold text-brand-brown transition-colors duration-150 group-hover:text-brand-terracotta dark:text-brand-cream">
                      {deity.name}
                    </span>
                    {deity.tradition && <Badge variant="neutral">{deity.tradition}</Badge>}
                  </div>
                  <p className="mt-1 font-sans text-xs text-brand-brown/50 dark:text-brand-cream/50">
                    {prayers > 0 && `${prayers} prayer${prayers === 1 ? "" : "s"}`}
                    {prayers > 0 && deitySites > 0 && " · "}
                    {deitySites > 0 && `${deitySites} site${deitySites === 1 ? "" : "s"}`}
                    {prayers === 0 && deitySites === 0 && "Content in production"}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
