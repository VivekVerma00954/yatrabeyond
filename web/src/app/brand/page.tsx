import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Style Guide & Brand",
  description: "YatraBeyond design system — colours, typography, and component library.",
};

const PALETTE = [
  {
    name: "Deep Brown",
    hex: "#3A2A1E",
    token: "brand.brown",
    usage: "Primary text · header · dark-mode base",
    textClass: "text-white",
    bgClass: "bg-[#3A2A1E]",
  },
  {
    name: "Terracotta",
    hex: "#B5532E",
    token: "brand.terracotta",
    usage: "Links · buttons · active states · brand accent",
    textClass: "text-white",
    bgClass: "bg-[#B5532E]",
  },
  {
    name: "Gold",
    hex: "#C9A227",
    token: "brand.gold",
    usage: "Sparing highlights ONLY — never body text",
    textClass: "text-brand-brown",
    bgClass: "bg-[#C9A227]",
  },
  {
    name: "Cream",
    hex: "#F4ECDD",
    token: "brand.cream",
    usage: "Warm surfaces · cards · section bands",
    textClass: "text-brand-brown",
    bgClass: "bg-[#F4ECDD]",
  },
];

const TYPE_SCALE = [
  { name: "Display (5xl)", className: "font-serif text-5xl font-bold", sample: "Sacred Journey" },
  { name: "H1 (4xl)", className: "font-serif text-4xl font-bold", sample: "Kedarnath Temple" },
  { name: "H2 (3xl)", className: "font-serif text-3xl font-semibold", sample: "Spiritual Significance" },
  { name: "H3 (2xl)", className: "font-serif text-2xl font-semibold", sample: "History & Origins" },
  { name: "H4 (xl)", className: "font-serif text-xl font-medium", sample: "Pilgrimage Information" },
  { name: "Body large (lg)", className: "font-sans text-lg", sample: "The temple stands at 3,583 metres above sea level." },
  { name: "Body (base)", className: "font-sans text-base", sample: "Kedarnath is one of the twelve Jyotirlingas of Lord Shiva." },
  { name: "Small (sm)", className: "font-sans text-sm", sample: "Last reviewed: January 2024 · Sources: 4 cited" },
  { name: "Caption (xs)", className: "font-sans text-xs uppercase tracking-widest", sample: "Tradition · Shaivism" },
];

export default function BrandPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-16">
        <div>
          <h1 className="mb-2 font-serif text-4xl font-bold text-brand-brown dark:text-brand-cream">
            Style Guide
          </h1>
          <p className="font-sans text-brand-brown/60 dark:text-brand-cream/60">
            YatraBeyond design system — tokens, typography, and components.
          </p>
        </div>

        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <section aria-labelledby="logo-h2">
          <h2
            id="logo-h2"
            className="mb-4 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
          >
            Logo
          </h2>
          <p className="mb-6 font-sans text-sm text-brand-brown/60 dark:text-brand-cream/60">
            The icon slot uses a placeholder SVG. Replace the SVG inside{" "}
            <code className="rounded bg-brand-cream px-1 dark:bg-brand-brown/40">
              src/components/Logo.tsx
            </code>{" "}
            — the slot is clearly labelled in the source.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-brand-brown/10 bg-white p-8 dark:border-brand-cream/10 dark:bg-brand-brown/20">
              <Logo variant="full" size="lg" />
              <span className="font-sans text-xs text-brand-brown/40">full · lg</span>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-brand-brown/10 bg-white p-8 dark:border-brand-cream/10 dark:bg-brand-brown/20">
              <Logo variant="icon" size="lg" />
              <span className="font-sans text-xs text-brand-brown/40">icon · lg</span>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl bg-brand-brown p-8">
              <Logo variant="full" size="lg" />
              <span className="font-sans text-xs text-brand-cream/40">on dark bg</span>
            </div>
          </div>
        </section>

        {/* ── Colour palette ─────────────────────────────────────────────── */}
        <section aria-labelledby="colour-h2">
          <h2
            id="colour-h2"
            className="mb-4 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
          >
            Colour Palette
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PALETTE.map((colour) => (
              <div key={colour.hex} className="overflow-hidden rounded-xl border border-brand-brown/10 dark:border-brand-cream/10">
                <div className={`h-24 w-full ${colour.bgClass}`} />
                <div className="bg-white p-4 dark:bg-brand-brown/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-serif font-semibold text-brand-brown dark:text-brand-cream">
                        {colour.name}
                      </p>
                      <p className="font-sans text-xs text-brand-brown/50 dark:text-brand-cream/50">
                        {colour.hex}
                      </p>
                      <p className="font-sans text-xs text-brand-brown/50 dark:text-brand-cream/50">
                        tailwind: colors.{colour.token}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 font-sans text-sm text-brand-brown/70 dark:text-brand-cream/70">
                    {colour.usage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Typography scale ───────────────────────────────────────────── */}
        <section aria-labelledby="type-h2">
          <h2
            id="type-h2"
            className="mb-4 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
          >
            Typography Scale
          </h2>
          <div className="space-y-4 rounded-xl border border-brand-brown/10 bg-white p-6 dark:border-brand-cream/10 dark:bg-brand-brown/20">
            {TYPE_SCALE.map(({ name, className, sample }) => (
              <div key={name} className="flex flex-col gap-0.5 border-b border-brand-brown/5 pb-4 last:border-b-0 last:pb-0 dark:border-brand-cream/5">
                <span className="font-sans text-xs text-brand-brown/40 dark:text-brand-cream/40">
                  {name}
                </span>
                <span className={`${className} text-brand-brown dark:text-brand-cream`}>
                  {sample}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 font-sans text-sm text-brand-brown/50 dark:text-brand-cream/50">
            Serif: Lora (Google Fonts, via next/font). Sans: Inter (Google Fonts, via next/font).
          </p>
        </section>

        {/* ── Buttons ────────────────────────────────────────────────────── */}
        <section aria-labelledby="btn-h2">
          <h2
            id="btn-h2"
            className="mb-4 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
          >
            Buttons
          </h2>
          <div className="flex flex-wrap gap-4 rounded-xl border border-brand-brown/10 bg-white p-6 dark:border-brand-cream/10 dark:bg-brand-brown/20">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" isLoading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </section>

        {/* ── Badges ─────────────────────────────────────────────────────── */}
        <section aria-labelledby="badge-h2">
          <h2
            id="badge-h2"
            className="mb-4 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
          >
            Badges
          </h2>
          <div className="flex flex-wrap gap-3 rounded-xl border border-brand-brown/10 bg-white p-6 dark:border-brand-cream/10 dark:bg-brand-brown/20">
            <Badge variant="default">Default</Badge>
            <Badge variant="terracotta">Shaivism</Badge>
            <Badge variant="gold">Featured</Badge>
            <Badge variant="neutral">Family friendly</Badge>
          </div>
        </section>
      </div>
    </div>
  );
}
