import Link from "next/link";

/**
 * Mandatory banner for works exported in draft/preview mode (reviewed = false).
 * A draft can never render without this: the reader page checks `reviewed` and
 * places the banner above the fold. Draft pages are also noindex'd via
 * metadata, and a strict content export removes them from the site entirely.
 */
export function DraftBanner() {
  return (
    <div
      role="status"
      className="rounded-lg border border-brand-gold/60 bg-brand-gold/10 px-4 py-3 print:hidden"
    >
      <p className="font-sans text-sm text-brand-brown dark:text-brand-cream">
        <strong className="font-semibold">Draft — pending review.</strong> This text has been
        sourced and translated per our{" "}
        <Link href="/editorial-policy" className="underline hover:text-brand-terracotta">
          editorial policy
        </Link>
        , but has not yet completed human review against sung versions. Wording may change.
      </p>
    </div>
  );
}
