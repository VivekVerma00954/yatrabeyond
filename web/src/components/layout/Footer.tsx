import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SocialLinks } from "@/components/SocialLinks";

const exploreLinks = [
  { href: "/lyrics", label: "Lyrics Library" },
  { href: "/travel", label: "Travel" },
  { href: "/history", label: "Religious History" },
  { href: "/yatra", label: "All Sacred Sites" },
  { href: "/deity", label: "Deities" },
  { href: "/regions", label: "Browse by Region" },
  { href: "/search", label: "Search" },
];

const aboutLinks = [
  { href: "/about", label: "Our Mission" },
  { href: "/editorial-policy", label: "Editorial Policy" },
  { href: "/community", label: "Community (coming soon)", muted: true },
  { href: "/plan", label: "Plan a Yatra (coming soon)", muted: true },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-brand-brown/10 bg-brand-cream/50 dark:border-brand-cream/10 dark:bg-brand-brown/50 print:hidden">
      <div className="mx-auto max-w-8xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Logo size="md" className="mb-3" />
            <p className="max-w-xs font-sans text-sm text-brand-brown/70 dark:text-brand-cream/70">
              Verified prayers, sacred history, and trusted journey guidance — for the yatra,
              and beyond it.
            </p>
            <SocialLinks className="mt-4" />
          </div>

          {/* Explore */}
          <nav aria-label="Explore links">
            <h2 className="mb-3 font-serif text-sm font-semibold uppercase tracking-widest text-brand-brown dark:text-brand-cream">
              Explore
            </h2>
            <ul className="space-y-2 font-sans text-sm" role="list">
              {exploreLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-brand-brown/70 hover:text-brand-terracotta dark:text-brand-cream/70 dark:hover:text-brand-terracotta"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* About */}
          <nav aria-label="About links">
            <h2 className="mb-3 font-serif text-sm font-semibold uppercase tracking-widest text-brand-brown dark:text-brand-cream">
              About
            </h2>
            <ul className="space-y-2 font-sans text-sm" role="list">
              {aboutLinks.map(({ href, label, muted }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={
                      muted
                        ? "cursor-default text-brand-brown/40 dark:text-brand-cream/40"
                        : "text-brand-brown/70 hover:text-brand-terracotta dark:text-brand-cream/70 dark:hover:text-brand-terracotta"
                    }
                    aria-disabled={muted}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal links">
            <h2 className="mb-3 font-serif text-sm font-semibold uppercase tracking-widest text-brand-brown dark:text-brand-cream">
              Legal
            </h2>
            <ul className="space-y-2 font-sans text-sm" role="list">
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-brand-brown/70 hover:text-brand-terracotta dark:text-brand-cream/70 dark:hover:text-brand-terracotta"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 max-w-[16rem] font-sans text-xs text-brand-brown/50 dark:text-brand-cream/50">
              Original prayer texts are public domain or published with authorisation. Our
              translations, transliterations, and commentary are © YatraBeyond.
            </p>
          </nav>
        </div>

        <div className="mt-8 border-t border-brand-brown/10 pt-6 dark:border-brand-cream/10">
          <p className="font-sans text-xs text-brand-brown/50 dark:text-brand-cream/50">
            © {year} YatraBeyond. Content is provided for informational and devotional purposes.{" "}
            <Link href="/editorial-policy" className="underline hover:text-brand-terracotta">
              How we verify content →
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
