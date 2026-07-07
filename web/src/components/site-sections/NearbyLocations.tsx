import Link from "next/link";
import { SectionWrapper } from "./SectionWrapper";
import type { NearbyLocation } from "@/types/sacred-site";

interface NearbyLocationsProps {
  locations?: NearbyLocation[] | undefined;
}

export function NearbyLocationsSection({ locations }: NearbyLocationsProps) {
  if (!locations || locations.length === 0) return null;

  return (
    <SectionWrapper id="nearby-sacred-locations" title="Nearby Sacred Locations">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="list">
        {locations.map((loc) => (
          <li
            key={loc.name}
            className="rounded-lg border border-brand-brown/10 bg-brand-cream/40 p-3 dark:border-brand-cream/10 dark:bg-brand-brown/20"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                {loc.slug ? (
                  <Link
                    href={`/yatra/${loc.slug}`}
                    className="font-serif text-sm font-medium text-brand-terracotta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta rounded-sm"
                  >
                    {loc.name}
                  </Link>
                ) : (
                  <span className="font-serif text-sm font-medium text-brand-brown dark:text-brand-cream">
                    {loc.name}
                  </span>
                )}
                {loc.note && (
                  <p className="mt-0.5 font-sans text-xs text-brand-brown/60 dark:text-brand-cream/60">
                    {loc.note}
                  </p>
                )}
              </div>
              {loc.distanceKm != null && (
                <span className="flex-shrink-0 rounded-full bg-brand-terracotta/10 px-2 py-0.5 font-sans text-xs text-brand-terracotta">
                  ~{loc.distanceKm} km
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}
