import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { DeityProfile, DeityProfileFrontmatter } from "@/types/deity-profile";

const PROFILES_DIR = path.join(process.cwd(), "src", "content", "deities");

function parseProfile(filePath: string): DeityProfile {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as DeityProfileFrontmatter;

  const body = content.trim();
  return {
    ...frontmatter,
    ...(body ? { body } : {}),
  };
}

/** Return a single deity profile by canonical deity_key, or null if none exists yet. */
export function getDeityProfileByKey(deityKey: string): DeityProfile | null {
  if (!fs.existsSync(PROFILES_DIR)) return null;
  const mdxPath = path.join(PROFILES_DIR, `${deityKey}.mdx`);
  if (!fs.existsSync(mdxPath)) return null;
  return parseProfile(mdxPath);
}

/** Return all deity profiles that exist today. */
export function getAllDeityProfiles(): DeityProfile[] {
  if (!fs.existsSync(PROFILES_DIR)) return [];
  return fs
    .readdirSync(PROFILES_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => parseProfile(path.join(PROFILES_DIR, f)));
}
