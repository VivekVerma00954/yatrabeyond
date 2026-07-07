import type { SacredSite } from "@/types/sacred-site";
import type { Deity, PrayerWork } from "@/types/prayer";
import { WORK_TYPE_LABELS, WORK_TYPE_SLUGS } from "@/types/prayer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.yatrabeyond.com";

/** JSON-LD for a prayer/lyrics page (CreativeWork). */
export function prayerJsonLd(work: PrayerWork, deity: Deity | null) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.title,
    genre: WORK_TYPE_LABELS[work.work_type].singular,
    inLanguage: ["hi", "sa"],
    url: `${SITE_URL}/lyrics/${WORK_TYPE_SLUGS[work.work_type]}/${work.slug}`,
    ...(deity && { about: { "@type": "Thing", name: deity.name } }),
    ...(work.author && { author: { "@type": "Person", name: work.author } }),
    publisher: {
      "@type": "Organization",
      name: "YatraBeyond",
      url: SITE_URL,
    },
    // The underlying text is public domain (or published with authorisation);
    // the translation/transliteration presented here is YatraBeyond's.
    copyrightNotice: "Translation and transliteration © YatraBeyond",
  };
}

/** JSON-LD BreadcrumbList for any page. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** JSON-LD for a sacred site page (Place + TouristAttraction). */
export function siteJsonLd(site: SacredSite) {
  return {
    "@context": "https://schema.org",
    "@type": ["TouristAttraction", "LandmarksOrHistoricalBuildings"],
    name: site.name,
    description: site.excerpt,
    url: `${SITE_URL}/yatra/${site.slug}`,
    ...(site.coordinates && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: site.coordinates.lat,
        longitude: site.coordinates.lng,
      },
    }),
    address: {
      "@type": "PostalAddress",
      addressRegion: site.region,
      addressCountry: "IN",
    },
    image: site.heroImage.startsWith("http")
      ? site.heroImage
      : `${SITE_URL}${site.heroImage}`,
    ...(site.bestSeason.length > 0 && {
      tourBookingPage: `${SITE_URL}/yatra/${site.slug}#pilgrimage-info`,
    }),
  };
}

/** JSON-LD for an Article-style content page. */
export function articleJsonLd({
  title,
  description,
  url,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${SITE_URL}${url}`,
    publisher: {
      "@type": "Organization",
      name: "YatraBeyond",
      url: SITE_URL,
    },
    ...(dateModified && { dateModified }),
  };
}

/** JSON-LD for the website itself (used on home). */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "YatraBeyond",
    url: SITE_URL,
    description:
      "The most trusted knowledge and connection platform for sacred pilgrimage journeys across India.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
