"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

interface NavSection {
  id: string;
  label: string;
}

interface SiteInPageNavProps {
  sections: NavSection[];
}

/**
 * Sticky in-page navigation for a sacred site page.
 * Highlights the active section via IntersectionObserver.
 */
export function SiteInPageNav({ sections }: SiteInPageNavProps) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setActive(id);
        },
        { rootMargin: "-20% 0px -70% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  return (
    <nav
      aria-label="Page sections"
      className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-2"
    >
      <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-brand-brown/50 dark:text-brand-cream/50">
        On this page
      </p>
      <ol className="space-y-1" role="list">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={cn(
                "block rounded-md px-2 py-1 font-sans text-sm transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta",
                active === id
                  ? "bg-brand-terracotta/10 text-brand-terracotta font-medium"
                  : "text-brand-brown/60 hover:text-brand-brown dark:text-brand-cream/60 dark:hover:text-brand-cream"
              )}
            >
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
