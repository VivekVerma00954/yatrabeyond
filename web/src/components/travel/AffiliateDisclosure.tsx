import Link from "next/link";

/**
 * Required on every page that carries (or will carry) commercial travel links
 * (docs/COMMERCE_ENTITY_POLICY_DRAFT.md §4). YatraBeyond is a directory and
 * referrer, never the service provider — this wording must not overstate our
 * role. Editorial and prayer content never carries commercial links at all.
 */
export function AffiliateDisclosure() {
  return (
    <aside
      aria-label="Affiliate disclosure"
      className="rounded-lg border border-brand-brown/15 bg-brand-cream/40 px-4 py-3 dark:border-brand-cream/15 dark:bg-brand-brown/20"
    >
      <p className="font-sans text-xs leading-relaxed text-brand-brown/70 dark:text-brand-cream/70">
        <strong className="font-semibold">Disclosure:</strong> travel listings on this page may
        include partner or affiliate links, and YatraBeyond may earn a commission if you book
        through them — at no extra cost to you. We are a knowledge platform and referrer, not
        the tour operator or service provider: bookings, cancellations, and service delivery
        are between you and the provider. Commercial links never appear on or beside prayer
        text. See our <Link href="/terms" className="underline hover:text-brand-terracotta">terms</Link>.
      </p>
    </aside>
  );
}
