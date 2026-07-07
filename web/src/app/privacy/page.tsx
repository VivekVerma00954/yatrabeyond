import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What YatraBeyond collects (very little), why, and your rights.",
};

export default function PrivacyPage() {
  return (
    <PolicyPage title="Privacy Policy" effectiveDate="7 July 2026" pendingLegalReview>
      <h2>The short version</h2>
      <p>
        YatraBeyond has no user accounts, no advertising trackers, and no social-media pixels.
        We collect as close to nothing as a working website allows.
      </p>

      <h2>What is collected</h2>
      <ul>
        <li>
          <strong>Server and CDN logs.</strong> Our hosting and content-delivery providers
          record standard request logs (IP address, user agent, pages requested) for security
          and abuse prevention. These are retained per the provider’s standard policy and are
          not used to profile you.
        </li>
        <li>
          <strong>Aggregate analytics.</strong> When analytics are enabled, we use a
          privacy-respecting, self-hosted tool that works without cookies and without
          tracking you across sites. It tells us which pages are read, not who you are.
        </li>
        <li>
          <strong>Reader preferences.</strong> The prayer reader stores your display choices
          (script layers, language, text size, theme) in your own browser’s local storage.
          That data never leaves your device.
        </li>
      </ul>

      <h2>What is not collected</h2>
      <p>
        No account data (there are no accounts yet), no payment data (we sell nothing
        directly), no advertising identifiers, and no sale or sharing of personal data with
        third parties — that last one is permanent policy, not a current limitation.
      </p>

      <h2>When accounts arrive</h2>
      <p>
        If and when user accounts launch, this policy will be updated first, collection will
        stay minimal (email and a display name, nothing more until a feature demands it), and
        consent and deletion flows will exist from day one — including the rights granted by
        India’s DPDP Act 2023 and the GDPR where they apply to you.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions or deletion requests: use the contact address published on our{" "}
        <a href="/about">About page</a>.
      </p>
    </PolicyPage>
  );
}
