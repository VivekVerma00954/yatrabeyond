# YatraBeyond — Lyrics Gallery Runbook (Aartis, Stotrams, Bhajans, Chalisas)

Purpose: a repeatable method so any session, on any model, produces the same
structured, accurate, ownership-clean lyrics dataset. Hand this file to a new
session before starting work.

------------------------------------------------------------------------
## 1. What we are building
A multi-version lyrics library. For each item we capture, per line:
- original (native script, usually Devanagari)
- Roman transliteration (English-readable)
- English meaning (our own)
- Hindi meaning (our own)

Two files, joined by id:
- `aarti_tracker.csv`  : one row per item (metadata + status)
- `aarti_lines.csv`    : one row per LINE of each item (the content)

Same schema is reused for Stotrams, Bhajans, Chalisas later (add a
`translit_devanagari` column when the original is Sanskrit and we also want a
Hindi-readable transliteration).

------------------------------------------------------------------------
## 2. File schemas

### aarti_tracker.csv
`id, title, deity, type, tradition_region, priority, copyright_status,
original_sourced, transliteration_done, meaning_en_done, meaning_hi_done,
reviewed, source_url, notes, copyright_risk`

- copyright_risk (the review-score column): one of
  PD-clear / PD-likely / REVIEW-recent / REVIEW-version  (see section 5).

- copyright_status: "Public domain (...)" OR "Verify (...)" — see section 5.
- the four *_done columns and `reviewed`: yes/no.
- `reviewed` = has a human checked it against a sung/known version. Stays "no"
  until you confirm.

### aarti_lines.csv
`aarti_id, line_no, section, original, translit_roman, meaning_en, meaning_hi, notes, original_true_script`

- original: always Devanagari (the commonly-sung form).
- original_true_script: when the item's true original is a non-Devanagari language
  (Tamil, Telugu, Malayalam, etc.), put that native-script line here. Otherwise "NA".

- section: refrain / verse 1 / verse 2 / closing doha etc. Mark every repeated
  chorus line as "refrain" (we store refrains in full each time, for synced display).
- Quote any field that contains a comma.
- notes: per-line flags (variant readings, "CONFIRM WORDING", etc.)

------------------------------------------------------------------------
## 3. The two-phase workflow

PHASE A — SOURCING (cheaper model is fine; Sonnet recommended, not Haiku)
1. For each item, fetch the verbatim original (Devanagari) from a reliable OPEN
   source (temple sites, lyrics sites, Wikisource). 
2. Cross-check against a SECOND independent source to catch transcription errors.
3. Produce, per line: line_no | section | original_devanagari | translit_roman.
4. Do NOT write meanings in this phase.
5. Record the two source URLs and list any places the sources disagree
   (variant readings).
6. Confirm public-domain status (author / approx date).
7. NEVER type sacred text from memory — only capture what a source shows. Flag
   any line you cannot verify rather than guessing.

PHASE B — MEANINGS + JUDGMENT (stronger model; Opus/Sonnet)
1. Write English and Hindi meanings line by line, in OUR OWN words.
2. Resolve / flag the variant readings surfaced in Phase A.
3. Apply the copyright triage (section 5).
4. Update the tracker status columns.

------------------------------------------------------------------------
## 4. Hard rules (ownership + accuracy)
- ORIGINALS: only reproduce genuinely public-domain texts (old/traditional).
  These we may store verbatim.
- TRANSLATIONS/MEANINGS: always write our own. NEVER copy another site's
  translation, and never copy-then-tweak it. Other sites are used only to
  sense-check that our meaning agrees in substance.
- Use other translations as a "does this broadly agree" check, not a template.
  Where two independent translations diverge from each other, flag the line.
- Capture verbatim, then cross-check against a 2nd source. Variants get a note,
  not a silent choice.

### Respectful register for the divine (all languages)
- These are prayers. When a line ADDRESSES or DESCRIBES God, use the reverential
  register.
  - English: capitalise divine references (You, Your, He, Him, His, Lord, Mother).
  - Indian languages: use the honorific pronoun + honorific verb forms, e.g.
    Hindi आप + कीजिए (not तू + कर); Marathi आपण/आपणास; Gujarati આપ; Punjabi ਆਪ/ਤੁਸੀਂ;
    Bengali আপনি + -ন verb endings; Tamil தாங்கள்/அவர்; Telugu మీరు/వారు;
    Kannada ತಾವು/ಅವರು; Malayalam അങ്ങ്/താങ്കൾ.
- Devotee referring to himself/herself stays humble/ordinary (no honorific).
- Exception: keep the INTIMATE/affectionate register only where the ORIGINAL text
  itself clearly uses it (some bhakti prayers address the Mother or Krishna as "tu"
  as a mark of closeness). Honorific is the default; do not force it where the
  tradition is deliberately intimate.

------------------------------------------------------------------------
## 5. Copyright triage
- Public domain: anonymous/traditional, or author died long ago (e.g. Tulsidas,
  Samarth Ramdas, 19th-c authors like Shardha Ram Phillauri). Safe to capture.
- Verify (HOLD until cleared): likely 20th-century or sect-specific compositions
  that may still be owned. Do not reproduce until ownership is confirmed.
  Examples currently parked: Jai Santoshi Mata, Aarti Shani Dev Ki, Shirdi Sai
  aartis, Harivarasanam, Nangli Tirath "Hari Om Jai Shri Jag Taran".
- Note: a website's own page layout/translation is copyrighted even when the
  underlying ancient text is public domain. We take only the PD original.

### copyright_risk scoring scale (fill this column for every item)
- PD-clear     : ancient/traditional, author long dead. Process fully.
- PD-likely    : probably old/traditional, attribution unclear. Process fully, note it.
- REVIEW-version: the ORIGINAL is ancient/PD, but the only wording we can find looks
  like a specific owned edition. Source from a clearly-open source if possible and
  process; otherwise capture metadata and hold the text. (We write our own meanings
  regardless, so a third party's translation is never copied.)
- REVIEW-recent : the original COMPOSITION itself appears modern (20th/21st c) or
  sect-specific and may still be under copyright. Do NOT reproduce the full lyrics.
  Capture only metadata (title, deity, suspected author/date, source) + this score,
  and leave the line content empty until the user clears it.
A flag is not permission to reproduce: REVIEW-recent text stays out of aarti_lines
until cleared.

### 5a. Owner-authorized override: Cleared-authorized
A fifth copyright_risk value, added 5 Jul 2026: Cleared-authorized. This is not
public domain, it is a specific item the platform owner (Vivek) has personally
authorized for publication because of a direct relationship to the rights holder,
on the basis that the content is a non-commercial value-add for devotee (sangat)
use, not a claim of ownership or a direct sale, and the owner accepts
responsibility for the item. Record the date and rationale in the item's `notes`
column whenever this value is used; do not apply it without an explicit,
dated instruction from the owner.

Applied so far: A037 (Hari Om Jai Shri Jag Taran, Nangli Tirath) and C031
(Shri Swaroop Chalisa), both previously REVIEW-recent per the "Verify (HOLD
until cleared)" example list above. That example list is now out of date for
these two items only; every other item named there (Jai Santoshi Mata, Aarti
Shani Dev Ki, Shirdi Sai aartis, Harivarasanam) is still held.

------------------------------------------------------------------------
## 6. Variant-flagging convention
- Put a short note in the line's `notes` column, e.g. "Variant: some read X".
- For lines whose wording we are unsure of, write "CONFIRM WORDING" and the user
  reconciles against the version they sing.
- For an item with multiple recensions (e.g. Om Jai Shiv Omkara), note it in the
  tracker `notes` and flag each variable line.

------------------------------------------------------------------------
## 7. Sourcing sources
- Prefer open/permissive: sanskritdocuments.org, GRETIL, Wikisource, archive.org,
  plus mainstream temple/lyrics sites for cross-check.
- Do NOT scrape the two reference platforms (drikpanchang.com, bhaktibharat.com)
  as a primary pull; use them only as a comparison/error-check reference.
- Avoid copyrighted compilations (Gita Press / ISKCON / Vedabase text).
- Transliteration: prefer a deterministic engine (Aksharamukha / Sanscript) for
  exactness; otherwise simple readable Roman (IAST-lite).

------------------------------------------------------------------------
## 8. Handoff prompt for a Phase-A (sourcing) session
Paste this into a new (cheaper-model) session, once per item:

  "I need the verbatim text of the [TYPE] '[TITLE]' (for [deity]).
   Public-domain traditional Hindu devotional text.
   1. Fetch the full Devanagari from a reliable open source; cross-check a 2nd source.
   2. Return line by line, pipe-delimited: line_no | section | original_devanagari | translit_roman
      (section = refrain / verse 1 etc.; mark repeated chorus lines 'refrain').
   3. Do NOT write any translation/meaning.
   4. List the two source URLs and note any variant readings.
   5. Confirm public-domain status (author/date).
   Be exact; never invent a line; flag anything you cannot verify."

Then bring that output back to a Phase-B session for meanings + judgment + tracker update.

------------------------------------------------------------------------
## 9. Current status (priority-1 Aartis)
DONE (sourced + translit + EN/HI meanings, reviewed=no):
A001 Sukhkarta Dukhharta, A002 Om Jai Jagdish Hare, A003 Om Jai Shiv Omkara,
A004 Jai Ambe Gauri, A005 Om Jai Lakshmi Mata, A006 Jai Saraswati Mata,
A007 Aarti Kije Hanuman Lala Ki, A008 Aarti Kunj Bihari Ki,
A009 Aarti Shri Ramayan Ji Ki, A013 Satyanarayan Aarti,
A038 Jai Ganesh Jai Ganesh Jai Ganesh Deva.

PARKED (Verify copyright first):
A010 Jai Santoshi Mata, A011 Aarti Shani Dev Ki, A012 Shirdi Sai aarti.

OPEN REVIEW ITEMS (variant lines to confirm against sung versions):
A002 closing doha (62-65), A003 lines 11/16/17 + verses 6-10,
A006 line 11, A009 line 19, A013 line 26.
