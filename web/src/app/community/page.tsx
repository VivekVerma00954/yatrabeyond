import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community — Coming Soon",
  description: "The YatraBeyond community platform is coming soon.",
};

export default function CommunityPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-32 text-center sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <span className="mb-4 inline-block rounded-full bg-brand-terracotta/10 px-4 py-1.5 font-sans text-sm font-medium text-brand-terracotta">
          Coming in a future phase
        </span>
        <h1 className="mb-4 font-serif text-4xl font-bold text-brand-brown dark:text-brand-cream">
          Community
        </h1>
        <p className="font-sans text-lg text-brand-brown/70 dark:text-brand-cream/70">
          A space for pilgrims to share experiences, ask questions, and connect with fellow
          seekers. This feature is planned and not yet built.
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
