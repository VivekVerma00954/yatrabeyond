import { NextResponse } from "next/server";
import { getAllSites } from "@/lib/content";
import { getAllWorks, getAllDeities } from "@/lib/prayers";
import { buildSearchIndex } from "@/lib/search-index";

// Cache this route at CDN level — regenerates on each build.
export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  const index = buildSearchIndex(getAllSites(), getAllWorks(), getAllDeities());
  return NextResponse.json(index);
}
