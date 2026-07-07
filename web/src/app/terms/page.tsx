import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "What you may freely do with YatraBeyond’s content, what requires a licence, and where we stand on ownership.",
};

// Drafted to the brief in docs/CONTENT_PROTECTION_AND_LICENSING.md §2 —
// ownership stated precisely, generous permitted use, explicit prohibited use,
// and the licensing carve-out. A lawyer reviews this before launch.
export default function TermsPage() {
  return (
    <PolicyPage title="Terms of Use" effectiveDate="7 July 2026" pendingLegalReview>
      <h2>Ownership, stated precisely</h2>
      <ul>
        <li>
          <strong>Original prayer and scripture texts</strong> published here are public
          domain, or are published with specific authorisation from the rights holder (each
          page’s provenance badge says which). We claim no ownership over sacred texts.
        </li>
        <li>
          <strong>Everything we made</strong> — translations, transliterations, commentary,
          provenance research, site guides, and the structured, curated presentation of it
          all — is © YatraBeyond.
        </li>
      </ul>

      <h2>What you may freely do</h2>
      <p>
        Personal, devotional, non-commercial use is free and encouraged: read, recite, print
        for your puja shelf, and share short excerpts with family and community — with
        attribution to YatraBeyond where our translation or commentary is included. We will
        never make you fight the website to copy a prayer.
      </p>

      <h2>What requires a written licence</h2>
      <p>
        Bulk downloading, scraping, or crawling of this site (other than by recognised search
        engines); automated reproduction; republishing our translations, transliterations, or
        commentary elsewhere in whole or substantial part; and any commercial use of our
        content — each requires a separate written agreement with us first.
      </p>

      <h2>Dataset and AI licensing</h2>
      <p>
        Bulk or programmatic access to the YatraBeyond dataset — including use as training
        data for machine-learning systems — is available only under a separate written
        licence. If you want our data for your app, service, research, or model, contact us
        via the <a href="/about">About page</a> and we will have that conversation properly.
      </p>

      <h2>Travel listings and affiliate links</h2>
      <p>
        Travel pages may carry partner or affiliate links, and YatraBeyond may earn a
        commission on bookings made through them, at no extra cost to you. YatraBeyond is a
        knowledge platform and referrer, not a tour operator or travel agent: the contract
        for any booked service is between you and the provider, and service delivery,
        changes, cancellations, and refunds are the provider’s responsibility. Commercial
        links never appear on or beside prayer text.
      </p>

      <h2>If content is misused</h2>
      <p>
        Where we find our content reproduced in breach of these terms, we contact the
        publisher first and ask for removal or a licence; if ignored, we escalate through the
        host’s takedown process and any legal remedies available. If you believe content on
        this site infringes rights you hold, contact us via the{" "}
        <a href="/about">About page</a> and we will review it promptly.
      </p>

      <h2>No warranties; use with care</h2>
      <p>
        Content is provided for informational and devotional purposes with an honest effort
        at accuracy (see our <a href="/editorial-policy">Editorial Policy</a>), but
        pilgrimage conditions change — verify practical details (timings, routes, weather,
        fees) with official sources before travelling. YatraBeyond is not liable for
        decisions made on the basis of this site’s content.
      </p>

      <h2>General</h2>
      <p>
        These terms are governed by the laws of New Zealand. We may update these terms; the
        effective date above changes when we do.
      </p>
    </PolicyPage>
  );
}
