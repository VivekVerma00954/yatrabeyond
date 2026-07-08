import type { Metadata } from "next";
import { getAllSites, getAllRegions } from "@/lib/content";
import { YatraClient } from "./YatraClient";

export const metadata: Metadata = {
  title: "Yatra Index — All Sacred Sites",
  description:
    "Browse every sacred pilgrimage site in the YatraBeyond index. Filter by region, tradition, best season, and accessibility.",
};

export default function YatraIndexPage() {
  const sites = getAllSites();
  const regions = getAllRegions();
  return <YatraClient allSites={sites} regions={regions} />;
}
