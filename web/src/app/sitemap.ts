import type { MetadataRoute } from "next";
import { getAllSites, getAllRegions } from "@/lib/content";
import { getAllWorks, getDeitiesWithWorks, workPath } from "@/lib/prayers";
import { DOMAINS, GEO_SCOPES } from "@/lib/travel-taxonomy";
import { WORK_TYPE_SLUGS } from "@/types/prayer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.yatrabeyond.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const sites = getAllSites();
  const regions = getAllRegions();
  // Draft works are noindex'd — keep them out of the sitemap too.
  const works = getAllWorks().filter((w) => w.reviewed);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/lyrics`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/yatra`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/travel`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/history`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/deity`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/regions`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/editorial-policy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const workTypeRoutes: MetadataRoute.Sitemap = Object.values(WORK_TYPE_SLUGS).map((type) => ({
    url: `${SITE_URL}/lyrics/${type}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const workRoutes: MetadataRoute.Sitemap = works.map((work) => ({
    url: `${SITE_URL}${workPath(work)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const deityRoutes: MetadataRoute.Sitemap = getDeitiesWithWorks().map((deity) => ({
    url: `${SITE_URL}/deity/${deity.deity_key}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const travelFacetRoutes: MetadataRoute.Sitemap = GEO_SCOPES.flatMap((scope) =>
    DOMAINS.map((domain) => ({
      url: `${SITE_URL}/travel/${scope.key}/${domain.key}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  const siteRoutes: MetadataRoute.Sitemap = sites.map((site) => ({
    url: `${SITE_URL}/yatra/${site.slug}`,
    lastModified: new Date(site.lastReviewed),
    changeFrequency: "monthly" as const,
    priority: site.featured ? 0.9 : 0.8,
  }));

  const regionRoutes: MetadataRoute.Sitemap = regions.map((region) => ({
    url: `${SITE_URL}/regions/${region.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...workTypeRoutes,
    ...workRoutes,
    ...deityRoutes,
    ...travelFacetRoutes,
    ...siteRoutes,
    ...regionRoutes,
  ];
}
