import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About YatraBeyond",
  description:
    "Our mission, editorial standards, and preservation ethos for India's sacred pilgrimage knowledge platform.",
};

export default function AboutPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 font-serif text-4xl font-bold text-brand-brown dark:text-brand-cream">
          About YatraBeyond
        </h1>

        <section aria-labelledby="mission-h2" className="mb-12">
          <h2
            id="mission-h2"
            className="mb-3 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
          >
            Our Mission
          </h2>
          <p className="font-sans text-lg leading-relaxed text-brand-brown/80 dark:text-brand-cream/80">
            YatraBeyond exists to make India&apos;s most sacred pilgrimage sites accessible to
            every seeker — not just as travel destinations, but as living spiritual and cultural
            landscapes. We believe pilgrimage is richer when you arrive informed: about the
            deity, the history, the ecology, the community, and your responsibilities as a guest
            in a sacred space.
          </p>
        </section>

        <section aria-labelledby="editorial-h2" className="mb-12">
          <h2
            id="editorial-h2"
            className="mb-3 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
          >
            Editorial Standards
          </h2>
          <ul className="space-y-3 font-sans text-brand-brown/80 dark:text-brand-cream/80">
            {[
              "Every site page carries a last-reviewed date and a list of cited sources.",
              "We do not invent or paraphrase scripture quotations. Textual references are flagged for expert verification.",
              "Practical information (transport, accommodation, fees) is time-sensitive and marked accordingly.",
              "We clearly distinguish established scholarship from devotional tradition.",
              "No affiliate links or commercial arrangements influence editorial content.",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-brand-terracotta/20 text-center text-xs leading-4 text-brand-terracotta"
                  aria-hidden="true"
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="preservation-h2" className="mb-12">
          <h2
            id="preservation-h2"
            className="mb-3 font-serif text-2xl font-semibold text-brand-brown dark:text-brand-cream"
          >
            Preservation Ethos
          </h2>
          <p className="font-sans leading-relaxed text-brand-brown/80 dark:text-brand-cream/80">
            Sacred sites face real pressures — over-tourism, environmental degradation, and
            the erosion of local communities. Every site page on YatraBeyond includes a
            Preservation section and a Giving Back section, so pilgrims can contribute
            positively rather than extractively.
          </p>
        </section>

        <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/5 p-6 dark:bg-brand-gold/10">
          <p className="font-sans text-sm text-brand-brown/70 dark:text-brand-cream/70">
            <strong>Phase 1 — Scaffolding:</strong> This platform is in active development.
            Current content is seeded for structural and design review and has not been fully
            editorially verified. Community features, pilgrimage planning tools, and user
            accounts are planned for a future phase.
          </p>
        </div>
      </div>
    </div>
  );
}
