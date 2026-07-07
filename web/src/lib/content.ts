import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { SacredSite, SacredSiteFrontmatter } from "@/types/sacred-site";

const SITES_DIR = path.join(process.cwd(), "src", "content", "sites");

function stripMarkdown(md: string): string {
  return md
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
}

function makeExcerpt(frontmatter: SacredSiteFrontmatter, length = 160): string {
  const source = frontmatter.overview ?? "";
  const plain = stripMarkdown(source);
  return plain.length > length ? plain.slice(0, length).trimEnd() + "…" : plain;
}

function parseSite(filePath: string): SacredSite {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as SacredSiteFrontmatter;

  const body = content.trim();
  return {
    ...frontmatter,
    excerpt: makeExcerpt(frontmatter),
    ...(body ? { body } : {}),
  };
}

/** Return all sacred sites, sorted by name. */
export function getAllSites(): SacredSite[] {
  const files = fs
    .readdirSync(SITES_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files
    .map((f) => parseSite(path.join(SITES_DIR, f)))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Return a single site by slug, or null if not found. */
export function getSiteBySlug(slug: string): SacredSite | null {
  const mdxPath = path.join(SITES_DIR, `${slug}.mdx`);
  const mdPath = path.join(SITES_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;
  if (!filePath) return null;
  return parseSite(filePath);
}

/** Return all slugs (used for generateStaticParams). */
export function getAllSlugs(): string[] {
  return fs
    .readdirSync(SITES_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.(mdx|md)$/, ""));
}

/** Return all distinct regions. */
export function getAllRegions(): string[] {
  const sites = getAllSites();
  return [...new Set(sites.map((s) => s.region))].sort();
}

/** Return sites belonging to a region. */
export function getSitesByRegion(region: string): SacredSite[] {
  return getAllSites().filter(
    (s) => s.region.toLowerCase() === region.toLowerCase()
  );
}

/** Return featured sites. */
export function getFeaturedSites(): SacredSite[] {
  return getAllSites().filter((s) => s.featured);
}
