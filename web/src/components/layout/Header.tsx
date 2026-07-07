"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/cn";

// The three platform pillars first, then discovery routes.
const navLinks = [
  { href: "/lyrics", label: "Lyrics" },
  { href: "/travel", label: "Travel" },
  { href: "/history", label: "History" },
  { href: "/yatra", label: "Sacred Sites" },
  { href: "/deity", label: "Deities" },
  { href: "/search", label: "Search" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-brown/10 bg-white/95 backdrop-blur-sm dark:border-brand-cream/10 dark:bg-brand-brown/95">
      <div className="mx-auto flex max-w-8xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo size="md" />

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-1" role="list">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "rounded-md px-3 py-2 font-sans text-sm font-medium",
                    "text-brand-brown/80 hover:text-brand-terracotta",
                    "dark:text-brand-cream/80 dark:hover:text-brand-terracotta",
                    "transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2"
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          {/* Mobile menu button */}
          <button
          type="button"
          className={cn(
            "rounded-md p-2 md:hidden",
            "text-brand-brown dark:text-brand-cream",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta"
          )}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span aria-hidden="true" className="block h-5 w-5 relative">
            <span
              className={cn(
                "absolute left-0 top-1 h-0.5 w-5 bg-current transition-all duration-200",
                menuOpen && "top-2.5 rotate-45"
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-2.5 h-0.5 w-5 bg-current transition-all duration-200",
                menuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-4 h-0.5 w-5 bg-current transition-all duration-200",
                menuOpen && "top-2.5 -rotate-45"
              )}
            />
          </span>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="border-t border-brand-brown/10 bg-white dark:border-brand-cream/10 dark:bg-brand-brown md:hidden"
        >
          <ul className="flex flex-col px-4 py-2" role="list">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "block rounded-md px-3 py-2.5 font-sans text-base font-medium",
                    "text-brand-brown hover:text-brand-terracotta",
                    "dark:text-brand-cream/80 dark:hover:text-brand-terracotta",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
