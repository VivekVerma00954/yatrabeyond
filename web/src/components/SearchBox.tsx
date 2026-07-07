"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SearchRecord } from "@/lib/search-index";
import { matchesQuery } from "@/lib/search-index";
import { cn } from "@/lib/cn";

interface SearchBoxProps {
  /** If true, expands to a full search page input. Default: compact inline widget. */
  fullPage?: boolean;
  initialQuery?: string;
}

const KIND_LABELS: Record<SearchRecord["kind"], string> = {
  site: "Site",
  prayer: "Prayer",
  deity: "Deity",
};

/**
 * Client-side search over a pre-built JSON index of sites, prayers, and
 * deities. The index is fetched once from /api/search/index.json and cached
 * in module scope.
 */
let cachedIndex: SearchRecord[] | null = null;

async function loadIndex(): Promise<SearchRecord[]> {
  if (cachedIndex) return cachedIndex;
  const res = await fetch("/api/search/index.json");
  if (!res.ok) throw new Error("Failed to load search index");
  cachedIndex = (await res.json()) as SearchRecord[];
  return cachedIndex;
}

export function SearchBox({ fullPage = false, initialQuery = "" }: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const runSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const index = await loadIndex();
      const matched = index.filter((r) => matchesQuery(r, q)).slice(0, 8);
      setResults(matched);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void runSearch(query);
    }, 200);
    return () => clearTimeout(timer);
  }, [query, runSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      void router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", fullPage ? "w-full" : "w-full max-w-md")}>
      <form onSubmit={handleSubmit} role="search">
        <label htmlFor="site-search" className="sr-only">
          Search sites, prayers, and deities
        </label>
        <div className="relative flex items-center">
          <span
            className="pointer-events-none absolute left-3 text-brand-brown/50 dark:text-brand-cream/50"
            aria-hidden="true"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M6.5 1a5.5 5.5 0 1 0 3.493 9.707l3.15 3.15a.75.75 0 1 0 1.06-1.06l-3.15-3.15A5.5 5.5 0 0 0 6.5 1ZM2.5 6.5a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <input
            id="site-search"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search prayers, sites, deities…"
            className={cn(
              "w-full rounded-lg border border-brand-brown/20 bg-white pl-9 pr-4",
              "font-sans text-brand-brown placeholder:text-brand-brown/40",
              "dark:border-brand-cream/20 dark:bg-brand-brown/30 dark:text-brand-cream dark:placeholder:text-brand-cream/40",
              "focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-transparent",
              fullPage ? "py-3 text-base" : "py-2 text-sm"
            )}
            aria-autocomplete="list"
            aria-controls={showDropdown && results.length > 0 ? "search-results" : undefined}
            aria-busy={isLoading}
          />
        </div>
      </form>

      {/* Inline dropdown results (not full-page) */}
      {!fullPage && showDropdown && results.length > 0 && (
        <ul
          id="search-results"
          role="listbox"
          aria-label="Search suggestions"
          className={cn(
            "absolute top-full left-0 right-0 z-50 mt-1 max-h-72 overflow-y-auto",
            "rounded-lg border border-brand-brown/10 bg-white shadow-lg",
            "dark:border-brand-cream/10 dark:bg-[#2a1e14]"
          )}
        >
          {results.map((r) => (
            <li key={r.path} role="option" aria-selected="false">
              <Link
                href={r.path}
                className={cn(
                  "flex items-baseline justify-between gap-2 px-4 py-2.5 hover:bg-brand-cream dark:hover:bg-brand-brown/50",
                  "focus-visible:bg-brand-cream dark:focus-visible:bg-brand-brown/50",
                  "focus-visible:outline-none"
                )}
                onClick={() => setShowDropdown(false)}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-serif text-sm font-medium text-brand-brown dark:text-brand-cream">
                    {r.name}
                  </span>
                  <span className="truncate font-sans text-xs text-brand-brown/60 dark:text-brand-cream/60">
                    {r.subtitle}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-brand-cream px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wide text-brand-brown/60 dark:bg-brand-brown/60 dark:text-brand-cream/60">
                  {KIND_LABELS[r.kind]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
