import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Plan a Yatra — Coming Soon",
  description: "Pilgrimage planning tools are coming to YatraBeyond.",
};

export default function PlanPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-32 text-center sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <span className="mb-4 inline-block rounded-full bg-brand-terracotta/10 px-4 py-1.5 font-sans text-sm font-medium text-brand-terracotta">
          Coming in a future phase
        </span>
        <h1 className="mb-4 font-serif text-4xl font-bold text-brand-brown dark:text-brand-cream">
          Plan a Yatra
        </h1>
        <p className="font-sans text-lg text-brand-brown/70 dark:text-brand-cream/70">
          Build a personalised pilgrimage itinerary, track your planned sites, and prepare for
          your journey. Planning tools are designed and not yet built.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="font-sans text-sm text-brand-terracotta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
