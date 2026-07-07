import type { Metadata } from "next";
import Link from "next/link";
import { getFeaturedSites, getAllSites, getAllRegions } from "@/lib/content";
import { getAllWorks, getAllDeities } from "@/lib/prayers";
import { websiteJsonLd } from "@/lib/structured-data";
import { SiteCard } from "@/components/SiteCard";
import { SearchBox } from "@/components/SearchBox";
import { PrayerCard } from "@/components/prayer/PrayerCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "YatraBeyond — Verified Prayers, Sacred Sites & Journey Guidance",
  description:
    "Verified aarti and prayer lyrics with meanings in ten languages, researched sacred-site guides, and trusted travel guidance for pilgrimage across India and beyond.",
};

const PILLARS = [
  {
    href: "/lyrics",
    title: "Lyrics",
    devanagari: "आरती · चालीसा · स्तोत्र",
    description:
      "Prayers with original Devanagari, Roman transliteration, and meanings in up to ten languages — verified against multiple sources, translated in our own words.",
    cta: "Open the library",
  },
  {
    href: "/travel",
    title: "Travel",
    devanagari: "यात्रा",
    description:
      "Pilgrimage circuits, treks, and destinations across India and beyond — with the practical guidance to travel prepared and with reverence.",
    cta: "Plan a journey",
  },
  {
    href: "/history",
    title: "Religious History",
    devanagari: "इतिहास",
    description:
      "How a place became sacred, who built what and when — every claim sourced and dated, nothing typed from memory.",
    cta: "Explore the history",
  },
] as const;

export default function HomePage() {
  const featured = getFeaturedSites();
  const allSites = getAllSites();
  const regions = getAllRegions();
  const works = getAllWorks();
  const deities = getAllDeities();
  const deityByKey = new Map(deities.map((d) => [d.deity_key, d]));
  const featuredPrayers = works.slice(0, 3);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-brand-brown px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
        aria-labelledby="hero-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          aria-hidden="true"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #C9A227 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #B5532E 0%, transparent 40%)`,
          }}
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 flex justify-center">
            <Badge variant="gold" className="px-4 py-1 text-xs uppercase tracking-widest">
              Verified · Sourced · Respectful
            </Badge>
          </div>

          <h1
            id="hero-heading"
            className="mb-6 font-serif text-4xl font-bold leading-tight text-brand-cream sm:text-5xl lg:text-6xl"
          >
            The Yatra, and Everything <span className="text-brand-gold">Beyond</span> It
          </h1>

          <p className="mx-auto mb-8 max-w-2xl font-sans text-lg text-brand-cream/80 sm:text-xl">
            Prayers you can trust word by word. Sacred places explained with sources. Journeys
            planned with care. One platform, built on accuracy.
          </p>

          <div className="mx-auto max-w-lg">
            <SearchBox />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/lyrics">
              <Button variant="primary" size="lg">
                Explore the Lyrics Library
              </Button>
            </Link>
            <Link href="/yatra">
              <Button
                variant="secondary"
                size="lg"
                className="border-brand-cream/30 bg-white/10 text-brand-cream hover:bg-white/20"
              >
                Sacred Sites
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Three pillars ─────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="pillars-heading">
        <div className="mx-auto max-w-8xl">
          <h2 id="pillars-heading" className="sr-only">
            What YatraBeyond offers
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PILLARS.map((pillar) => (
              <Link
                key={pillar.href}
                href={pillar.href}
                className="group flex flex-col rounded-xl border border-brand-brown/10 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta dark:border-brand-cream/10 dark:bg-brand-brown/20"
              >
                <p
                  lang="hi"
                  className="mb-2 font-devanagari text-sm text-brand-terracotta/80"
                  aria-hidden="true"
                >
                  {pillar.devanagari}
                </p>
                <h3 className="font-serif text-2xl font-semibold text-brand-brown transition-colors duration-150 group-hover:text-brand-terracotta dark:text-brand-cream">
                  {pillar.title}
                </h3>
                <p className="mt-2 flex-1 font-sans text-sm leading-relaxed text-brand-brown/70 dark:text-brand-cream/70">
                  {pillar.description}
                </p>
                <span className="mt-4 font-sans text-sm font-medium text-brand-terracotta group-hover:underline">
                  {pillar.cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured prayers ──────────────────────────────────────────────── */}
      {featuredPrayers.length > 0 && (
        <section className="band-cream px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="prayers-heading">
          <div className="mx-auto max-w-8xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2
                  id="prayers-heading"
                  className="font-serif text-3xl font-semibold text-brand-brown dark:text-brand-cream"
                >
                  From the Lyrics Library
                </h2>
                <p className="mt-1 font-sans text-brand-brown/60 dark:text-brand-cream/60">
                  Line by line: original script, transliteration, and meanings in ten languages
                </p>
              </div>
              <Link
                href="/lyrics"
                className="hidden font-sans text-sm text-brand-terracotta hover:underline sm:block"
              >
                View all {works.length} →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPrayers.map((work) => (
                <PrayerCard
                  key={work.work_id}
                  work={work}
                  deity={work.deity_key ? deityByKey.get(work.deity_key) : null}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Sites ────────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="featured-heading">
          <div className="mx-auto max-w-8xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2
                  id="featured-heading"
                  className="font-serif text-3xl font-semibold text-brand-brown dark:text-brand-cream"
                >
                  Featured Sacred Sites
                </h2>
                <p className="mt-1 font-sans text-brand-brown/60 dark:text-brand-cream/60">
                  Researched, sourced, and reviewed destination guides
                </p>
              </div>
              <Link
                href="/yatra"
                className="hidden font-sans text-sm text-brand-terracotta hover:underline sm:block"
              >
                View all {allSites.length} sites →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((site) => (
                <SiteCard key={site.slug} site={site} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Browse by Region ──────────────────────────────────────────────── */}
      <section className="band-cream px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="regions-heading">
        <div className="mx-auto max-w-8xl">
          <h2
            id="regions-heading"
            className="mb-6 font-serif text-3xl font-semibold text-brand-brown dark:text-brand-cream"
          >
            Browse by Region
          </h2>
          <div className="flex flex-wrap gap-3">
            {regions.map((region) => (
              <Link
                key={region}
                href={`/regions/${encodeURIComponent(region.toLowerCase().replace(/\s+/g, "-"))}`}
                className="rounded-full border border-brand-brown/20 bg-white px-4 py-2 font-sans text-sm text-brand-brown transition-colors duration-150 hover:border-brand-terracotta hover:text-brand-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta dark:border-brand-cream/20 dark:bg-brand-brown/20 dark:text-brand-cream dark:hover:border-brand-terracotta dark:hover:text-brand-terracotta"
              >
                {region}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust strip ───────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="mission-heading">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="mission-heading"
            className="mb-4 font-serif text-3xl font-semibold text-brand-brown dark:text-brand-cream"
          >
            Why trust YatraBeyond
          </h2>
          <p className="font-sans text-lg text-brand-brown/70 dark:text-brand-cream/70">
            Every text is verified against at least two independent sources and never typed from
            memory. Every translation is written in our own words. Every page shows where its
            information came from and when it was last reviewed. And prayer pages never carry
            advertising.
          </p>
          <div className="mt-6">
            <Link href="/editorial-policy">
              <Button variant="secondary">Read our editorial policy →</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
