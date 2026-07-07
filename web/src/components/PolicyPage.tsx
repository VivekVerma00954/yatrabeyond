import type { ReactNode } from "react";

interface PolicyPageProps {
  title: string;
  effectiveDate: string;
  /** Shown when the document still needs professional legal review. */
  pendingLegalReview?: boolean;
  children: ReactNode;
}

/** Shared shell for policy documents — consistent typography and dating. */
export function PolicyPage({ title, effectiveDate, pendingLegalReview, children }: PolicyPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-brand-brown dark:text-brand-cream">
          {title}
        </h1>
        <p className="mt-2 font-sans text-sm text-brand-brown/50 dark:text-brand-cream/50">
          Effective date: {effectiveDate}
        </p>
        {pendingLegalReview && (
          <p className="mt-3 rounded-lg border border-brand-gold/60 bg-brand-gold/10 px-4 py-2 font-sans text-sm text-brand-brown dark:text-brand-cream">
            <strong>Draft:</strong> this document states our working position and is pending
            professional legal review before launch.
          </p>
        )}
      </header>
      <div className="prose prose-sm sm:prose-base dark:prose-invert font-sans">{children}</div>
    </div>
  );
}
