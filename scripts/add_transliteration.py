#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fills translit_roman in data/chalisa_lines.csv from the original Devanagari
column, using indic_transliteration (ITRANS scheme) as a base, then
normalising to a casual, readable Hinglish style (lowercase short vowels,
sentence-case first letter, common deity/name words capitalised).

Does not touch meaning_* columns — meaning/translation is separate work,
not part of this pass.
"""
import csv
import re
from pathlib import Path
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate

DATA_DIR = Path("/sessions/determined-gifted-gates/mnt/YatraBeyond/data")
LINES_CSV = DATA_DIR / "chalisa_lines.csv"

# Proper nouns/deity-and-name words to capitalise in the otherwise-lowercase
# Hinglish output. Matched case-insensitively on word boundaries.
PROPER_NOUNS = [
    "ram", "raam", "raghubar", "raghuvar", "raghupati", "raghunath", "raghunatha",
    "sita", "siya", "lakhan", "lakshman", "laxman", "bharat", "shatrughan", "shatrughna",
    "hanuman", "hanumat", "kapis", "kapish", "anjani", "pavan", "pawan", "kesari",
    "kesarinandan", "shankar", "shiv", "shiva", "shambhu", "mahesh", "girijapati",
  "purari", "neelkanth", "nilkanth", "girija", "gauri", "uma", "parvati", "bhavani",
    "durga", "amba", "ambe", "annapurna", "lakshmi", "narayan", "narayana",
    "saraswati", "sarad", "sharad", "krishna", "kanhaiya", "kanha", "nand",
    "nandlala", "nandalal", "yashoda", "yasuda", "radha", "devaki", "vasudev",
    "vasudeva", "kans", "kansa", "sudama", "draupadi", "meera", "mira",
    "shishupal", "jarasandh", "jarasindhu", "arjun", "partha", "gita",
    "ganesh", "ganapati", "ganpati", "gajanan", "girijalal", "vishnu",
    "brahma", "shani", "shanishchar", "shanishwar", "vimal", "ravi", "kaal",
    "yam", "kaikeyi", "dashrath", "dasharath", "sugriv", "sugriva",
    "vibhishan", "lanka", "lankesh", "ravan", "ravana", "tulsidas",
    "ayodhyadas", "devidas", "haridas", "ramsundar", "jalandhar", "tripurasur",
    "bhagirath", "gangotri", "ganga", "yamuna", "saryu", "prayag", "kailash",
    "indra", "surapati", "narad", "sanak", "shesh", "kuber", "brahmand",
    "ayodhya", "prahlad", "hiranyakashyap", "hiranyaksha", "narasimha",
    "shalgram", "shaligram",
]
PROPER_NOUN_RE = re.compile(
    r"\b(" + "|".join(sorted(set(PROPER_NOUNS), key=len, reverse=True)) + r")\b",
    re.IGNORECASE,
)


def transliterate_line(original: str) -> str:
    # Preserve word/clause boundaries at danda marks before transliterating.
    prepped = original.replace("।", ", ").replace("॥", ".")
    raw = transliterate(prepped, sanscript.DEVANAGARI, sanscript.ITRANS)

    # Normalise punctuation/whitespace artifacts.
    s = raw
    s = re.sub(r"\s+", " ", s).strip()
    s = re.sub(r",\s*,", ",", s)
    s = re.sub(r",\s*\.$", ".", s)
    s = re.sub(r"\s+,", ",", s)
    s = re.sub(r",(\S)", r", \1", s)
    if not s.endswith("."):
        s = s.rstrip(",").strip() + "."

    # Casual Hinglish: lowercase (drops ITRANS's long-vowel/retroflex
    # capital-letter markers, which is the common informal spelling
    # convention), then re-capitalise the first letter and known proper
    # nouns/deity names.
    s = s.lower()
    s = s[0].upper() + s[1:] if s else s
    s = PROPER_NOUN_RE.sub(lambda m: m.group(1).capitalize(), s)
    # Capitalise the first letter after a period+space (new clause within
    # the same segment, rare but occurs with embedded dohas).
    s = re.sub(r"(\.\s+)([a-z])", lambda m: m.group(1) + m.group(2).upper(), s)
    return s


def main():
    rows = []
    with LINES_CSV.open(encoding="utf-8-sig", newline="") as fh:
        reader = csv.DictReader(fh)
        fieldnames = reader.fieldnames
        for r in reader:
            r["translit_roman"] = transliterate_line(r["original"])
            rows.append(r)

    with LINES_CSV.open("w", newline="", encoding="utf-8-sig") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Filled translit_roman for {len(rows)} rows in {LINES_CSV}")


if __name__ == "__main__":
    main()
