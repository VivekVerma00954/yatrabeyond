import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description:
    "How YatraBeyond sources, verifies, translates, and publishes sacred texts and site guides — the rules we hold ourselves to, published in full.",
};

// This page publishes the working rules from docs/RUNBOOK_lyrics.md verbatim
// in spirit — it is a trust signal, not marketing. Keep it in sync with the
// runbook when the rules change.
export default function EditorialPolicyPage() {
  return (
    <PolicyPage title="Editorial Policy" effectiveDate="7 July 2026">
      <p>
        YatraBeyond exists to be the reference for accurate devotional texts and sacred-site
        knowledge. These are the rules every piece of content on this platform goes through.
        They are not aspirations — an item that has not passed them does not publish.
      </p>

      <h2>Sacred texts (aartis, chalisas, stotrams, vrat kathas)</h2>
      <ul>
        <li>
          <strong>Never from memory.</strong> Every original text is captured verbatim from a
          reliable open source and cross-checked against a second, independent source. A line
          that cannot be verified is flagged, never guessed.
        </li>
        <li>
          <strong>Variants are recorded, not silently chosen.</strong> Where sources disagree
          on a line’s wording, the variant is noted and resolved against sung tradition during
          human review.
        </li>
        <li>
          <strong>Our translations are our own.</strong> Every meaning, in every language, is
          written in our own words. We never copy another translation, and never
          copy-then-tweak one. Other translations are used only to sense-check that ours
          agrees in substance.
        </li>
        <li>
          <strong>Reverential register.</strong> Where a line addresses or describes the
          divine, our translations use the honorific register of each language — except where
          the original itself is deliberately intimate, which we preserve.
        </li>
        <li>
          <strong>Human review before full publication.</strong> Texts are reviewed against
          sung versions before the draft marking is removed. Anything not yet reviewed is
          clearly labelled as a draft on the page itself.
        </li>
      </ul>

      <h2>Copyright and ownership</h2>
      <ul>
        <li>
          We reproduce only texts that are genuinely public domain (traditional, or the author
          died long ago), or texts we have specific authorisation to publish. Modern or
          sect-specific compositions with unclear ownership are held — catalogued but not
          reproduced — until cleared.
        </li>
        <li>
          Where an item is published with the rights-holder’s authorisation rather than being
          public domain, its provenance badge says so.
        </li>
        <li>
          Our own translations, transliterations, commentary, and page structure are ©
          YatraBeyond. Personal, devotional use is free and encouraged — see the{" "}
          <a href="/terms">Terms of Use</a>.
        </li>
      </ul>

      <h2>Sacred sites and history</h2>
      <ul>
        <li>
          Every site guide cites its sources on the page, and every page carries a
          last-reviewed date. Scripture citations that have not been expert-verified are
          marked as such.
        </li>
        <li>
          Practical information (timings, fees, transport) is refreshed on a scheduled cycle;
          the last-reviewed date tells you how current a page is.
        </li>
        <li>
          We present traditions and cite sources; we do not adjudicate sectarian disputes or
          take sectarian editorial positions.
        </li>
        <li>
          Imagery is licensed or our own, and follows respectful-photography rules — no
          sanctum interiors where photography is prohibited.
        </li>
      </ul>

      <h2>Commercial separation</h2>
      <ul>
        <li>
          <strong>No advertising on or beside prayer text — ever.</strong>
        </li>
        <li>
          Travel listings may carry disclosed partner or affiliate links, always separated
          from editorial and devotional content, and always labelled. Sponsorship, where it
          exists, is section-level and disclosed; it never buys placement inside editorial
          content.
        </li>
      </ul>

      <h2>Corrections</h2>
      <p>
        If you find an error — a wrong line, a variant we should know about, a stale fact —
        we want to hear it. Corrections are reviewed against sources and the page’s
        last-reviewed date is updated when a fix lands.
      </p>
    </PolicyPage>
  );
}
