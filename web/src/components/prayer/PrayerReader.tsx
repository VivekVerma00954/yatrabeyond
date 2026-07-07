"use client";

import { useEffect, useMemo, useState } from "react";
import type { MeaningLang, PrayerSegment, PrayerWork } from "@/types/prayer";
import { MEANING_LANG_LABELS } from "@/types/prayer";
import { cn } from "@/lib/cn";

// ── Reader preferences (persisted locally; tied to an account in Phase 3) ────
interface ReaderPrefs {
  mode: "study" | "paath";
  showOriginal: boolean;
  showTranslit: boolean;
  showMeaning: boolean;
  meaningLang: MeaningLang;
  fontScale: number; // index into FONT_SCALES
}

const PREFS_KEY = "yb:reader-prefs:v1";
const FONT_SCALES = [0.875, 1, 1.125, 1.25, 1.5];

const DEFAULT_PREFS: ReaderPrefs = {
  mode: "study",
  showOriginal: true,
  showTranslit: true,
  showMeaning: true,
  meaningLang: "en",
  fontScale: 1,
};

function loadPrefs(): ReaderPrefs {
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<ReaderPrefs>;
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return DEFAULT_PREFS;
  }
}

// ── Stanza grouping: consecutive segments sharing a segment_type ──────────────
interface Stanza {
  label: string;
  isRefrain: boolean;
  segments: PrayerSegment[];
}

function groupIntoStanzas(segments: PrayerSegment[]): Stanza[] {
  const stanzas: Stanza[] = [];
  for (const segment of segments) {
    const last = stanzas[stanzas.length - 1];
    if (last && last.label === segment.segment_type) {
      last.segments.push(segment);
    } else {
      stanzas.push({
        label: segment.segment_type,
        isRefrain: segment.segment_type.toLowerCase().includes("refrain"),
        segments: [segment],
      });
    }
  }
  return stanzas;
}

function meaningOf(segment: PrayerSegment, lang: MeaningLang): string | null {
  return segment[`meaning_${lang}` as const];
}

interface PrayerReaderProps {
  work: PrayerWork;
  availableLangs: MeaningLang[];
}

/**
 * The flagship reading experience (docs/DATA_ARCHITECTURE.md §2): per-line
 * layered display (original / transliteration / meaning) with per-layer
 * toggles, a meaning-language switcher, font-size control, two modes —
 * Study (layers stacked per stanza) and Paath (continuous recitation flow) —
 * refrains visually distinct, print-friendly, preferences remembered locally.
 */
export function PrayerReader({ work, availableLangs }: PrayerReaderProps) {
  const [prefs, setPrefs] = useState<ReaderPrefs>(DEFAULT_PREFS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPrefs(loadPrefs());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      // Private browsing / storage denied — prefs just don't persist.
    }
  }, [prefs, hydrated]);

  const stanzas = useMemo(() => groupIntoStanzas(work.segments), [work.segments]);

  // Fall back to the first available language if the stored one is absent here.
  const meaningLang = availableLangs.includes(prefs.meaningLang)
    ? prefs.meaningLang
    : (availableLangs[0] ?? "en");

  const scale = FONT_SCALES[prefs.fontScale] ?? 1;
  const update = (patch: Partial<ReaderPrefs>) => setPrefs((p) => ({ ...p, ...patch }));

  const layerButton = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1 font-sans text-xs font-medium transition-colors duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta",
      active
        ? "border-brand-terracotta bg-brand-terracotta text-white"
        : "border-brand-brown/20 bg-white text-brand-brown/70 hover:border-brand-terracotta hover:text-brand-terracotta dark:border-brand-cream/20 dark:bg-transparent dark:text-brand-cream/70"
    );

  return (
    <div>
      {/* ── Reader toolbar ────────────────────────────────────────────────── */}
      <div
        className="sticky top-[57px] z-40 -mx-4 mb-6 border-b border-brand-brown/10 bg-[var(--color-bg)]/95 px-4 py-3 backdrop-blur-sm dark:border-brand-cream/10 print:hidden sm:-mx-6 sm:px-6"
        role="toolbar"
        aria-label="Reading controls"
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode switch */}
          <div
            className="flex rounded-full border border-brand-brown/20 p-0.5 dark:border-brand-cream/20"
            role="group"
            aria-label="Reading mode"
          >
            {(["study", "paath"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => update({ mode })}
                aria-pressed={prefs.mode === mode}
                className={cn(
                  "rounded-full px-3 py-1 font-sans text-xs font-medium transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta",
                  prefs.mode === mode
                    ? "bg-brand-brown text-brand-cream dark:bg-brand-cream dark:text-brand-brown"
                    : "text-brand-brown/60 hover:text-brand-brown dark:text-brand-cream/60 dark:hover:text-brand-cream"
                )}
              >
                {mode === "study" ? "Study" : "Paath"}
              </button>
            ))}
          </div>

          {/* Layer toggles (Study mode only — Paath is deliberately minimal) */}
          {prefs.mode === "study" && (
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Visible layers">
              <button
                type="button"
                onClick={() => update({ showOriginal: !prefs.showOriginal })}
                aria-pressed={prefs.showOriginal}
                className={layerButton(prefs.showOriginal)}
              >
                देवनागरी
              </button>
              <button
                type="button"
                onClick={() => update({ showTranslit: !prefs.showTranslit })}
                aria-pressed={prefs.showTranslit}
                className={layerButton(prefs.showTranslit)}
              >
                Roman
              </button>
              <button
                type="button"
                onClick={() => update({ showMeaning: !prefs.showMeaning })}
                aria-pressed={prefs.showMeaning}
                className={layerButton(prefs.showMeaning)}
              >
                Meaning
              </button>
            </div>
          )}

          {/* Paath: transliteration is the single optional companion layer */}
          {prefs.mode === "paath" && (
            <button
              type="button"
              onClick={() => update({ showTranslit: !prefs.showTranslit })}
              aria-pressed={prefs.showTranslit}
              className={layerButton(prefs.showTranslit)}
            >
              Roman
            </button>
          )}

          {/* Meaning language */}
          {prefs.mode === "study" && prefs.showMeaning && availableLangs.length > 1 && (
            <label className="flex items-center gap-1.5 font-sans text-xs text-brand-brown/70 dark:text-brand-cream/70">
              <span className="sr-only sm:not-sr-only">Meaning:</span>
              <select
                value={meaningLang}
                onChange={(e) => update({ meaningLang: e.target.value as MeaningLang })}
                className="rounded-md border border-brand-brown/20 bg-white px-2 py-1 font-sans text-xs text-brand-brown focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-terracotta dark:border-brand-cream/20 dark:bg-brand-brown/40 dark:text-brand-cream"
                aria-label="Meaning language"
              >
                {availableLangs.map((lang) => (
                  <option key={lang} value={lang}>
                    {MEANING_LANG_LABELS[lang].native}
                    {lang !== "en" ? ` · ${MEANING_LANG_LABELS[lang].english}` : ""}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="ml-auto flex items-center gap-1.5">
            {/* Font size */}
            <div
              className="flex items-center rounded-full border border-brand-brown/20 dark:border-brand-cream/20"
              role="group"
              aria-label="Text size"
            >
              <button
                type="button"
                onClick={() => update({ fontScale: Math.max(0, prefs.fontScale - 1) })}
                disabled={prefs.fontScale === 0}
                aria-label="Decrease text size"
                className="rounded-l-full px-2.5 py-1 font-sans text-xs text-brand-brown/70 disabled:opacity-40 hover:text-brand-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta dark:text-brand-cream/70"
              >
                A−
              </button>
              <button
                type="button"
                onClick={() =>
                  update({ fontScale: Math.min(FONT_SCALES.length - 1, prefs.fontScale + 1) })
                }
                disabled={prefs.fontScale === FONT_SCALES.length - 1}
                aria-label="Increase text size"
                className="rounded-r-full px-2.5 py-1 font-sans text-sm text-brand-brown/70 disabled:opacity-40 hover:text-brand-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta dark:text-brand-cream/70"
              >
                A+
              </button>
            </div>

            {/* Print — people print prayers for the puja shelf */}
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full border border-brand-brown/20 px-3 py-1 font-sans text-xs font-medium text-brand-brown/70 hover:border-brand-terracotta hover:text-brand-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta dark:border-brand-cream/20 dark:text-brand-cream/70"
            >
              Print
            </button>
          </div>
        </div>
      </div>

      {/* ── Text ──────────────────────────────────────────────────────────── */}
      <div style={{ fontSize: `${scale}rem` }}>
        {prefs.mode === "paath" ? (
          <PaathView stanzas={stanzas} showTranslit={prefs.showTranslit} />
        ) : (
          <StudyView
            stanzas={stanzas}
            showOriginal={prefs.showOriginal}
            showTranslit={prefs.showTranslit}
            showMeaning={prefs.showMeaning}
            meaningLang={meaningLang}
          />
        )}
      </div>
    </div>
  );
}

// ── Paath (continuous recitation) mode ────────────────────────────────────────
function PaathView({ stanzas, showTranslit }: { stanzas: Stanza[]; showTranslit: boolean }) {
  return (
    <div className="mx-auto max-w-2xl space-y-8 text-center">
      {stanzas.map((stanza, i) => (
        <div
          key={i}
          className={cn(
            stanza.isRefrain &&
              "rounded-xl border-l-4 border-brand-gold/70 bg-brand-cream/50 py-4 dark:bg-brand-brown/30"
          )}
        >
          {stanza.segments.map((segment) => (
            <div key={segment.order_num} className="mb-2 last:mb-0">
              <p lang="hi" className="font-devanagari text-[1.5em] leading-[1.9] text-brand-brown dark:text-brand-cream">
                {segment.original ?? segment.original_true_script}
              </p>
              {showTranslit && segment.translit_roman && (
                <p className="font-serif text-[0.8em] italic leading-relaxed text-brand-brown/55 dark:text-brand-cream/55">
                  {segment.translit_roman}
                </p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Study (per-stanza layered) mode ───────────────────────────────────────────
function StudyView({
  stanzas,
  showOriginal,
  showTranslit,
  showMeaning,
  meaningLang,
}: {
  stanzas: Stanza[];
  showOriginal: boolean;
  showTranslit: boolean;
  showMeaning: boolean;
  meaningLang: MeaningLang;
}) {
  return (
    <div className="space-y-6">
      {stanzas.map((stanza, i) => (
        <section
          key={i}
          aria-label={stanza.label}
          className={cn(
            "rounded-xl border p-5",
            stanza.isRefrain
              ? "border-brand-gold/50 border-l-4 border-l-brand-gold bg-brand-cream/50 dark:bg-brand-brown/30"
              : "border-brand-brown/10 bg-white dark:border-brand-cream/10 dark:bg-brand-brown/15"
          )}
        >
          <p className="mb-3 font-sans text-[0.7em] font-medium uppercase tracking-widest text-brand-brown/40 dark:text-brand-cream/40">
            {stanza.label}
          </p>
          <div className="space-y-4">
            {stanza.segments.map((segment) => (
              <div key={segment.order_num}>
                {showOriginal && (segment.original ?? segment.original_true_script) && (
                  <p lang="hi" className="font-devanagari text-[1.35em] leading-[1.9] text-brand-brown dark:text-brand-cream">
                    {segment.original ?? segment.original_true_script}
                  </p>
                )}
                {showTranslit && segment.translit_roman && (
                  <p className="mt-0.5 font-serif text-[0.9em] italic leading-relaxed text-brand-brown/60 dark:text-brand-cream/60">
                    {segment.translit_roman}
                  </p>
                )}
                {showMeaning && meaningOf(segment, meaningLang) && (
                  <p
                    lang={meaningLang}
                    className={cn(
                      "mt-1 leading-relaxed text-brand-brown/80 dark:text-brand-cream/80",
                      meaningLang === "hi" || meaningLang === "mr"
                        ? "font-devanagari text-[1em]"
                        : "font-sans text-[0.9em]"
                    )}
                  >
                    {meaningOf(segment, meaningLang)}
                  </p>
                )}
                {segment.word_by_word && (
                  <p className="mt-1 font-sans text-[0.8em] leading-relaxed text-brand-brown/50 dark:text-brand-cream/50">
                    {segment.word_by_word}
                  </p>
                )}
                {segment.commentary && (
                  <p className="mt-1 font-sans text-[0.85em] leading-relaxed text-brand-brown/60 dark:text-brand-cream/60">
                    {segment.commentary}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
