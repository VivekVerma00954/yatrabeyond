#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Marks the seven now-sourced chalisas in data/chalisa_tracker.csv as
original_sourced = yes, and fills in the author field from each text's own
closing bhanita (self-naming) signature line, where one is present. Does
NOT set reviewed = yes — that step is the separate human-check-against-
sung-versions pass already established in MASTER_PLAN.md, not done here.
"""
import csv
from pathlib import Path

DATA_DIR = Path("/sessions/determined-gifted-gates/mnt/YatraBeyond/data")
TRACKER = DATA_DIR / "chalisa_tracker.csv"

UPDATES = {
    "C001": {"author": "Tulsidas", "period": "16th century", "origin_note": "Bhanita (self-naming) signature in closing chaupai; unambiguous, well-documented authorship."},
    "C002": {"author": "Devidas", "period": "Unknown; traditional", "origin_note": "Bhanita signature in closing chaupai; period/identity of this Devidas not independently verified."},
    "C003": {"author": "Ayodhyadas", "period": "Unknown; traditional", "origin_note": "Bhanita signature in opening and closing verses; period/identity not independently verified."},
    "C004": {"author": "Ramsundar (per text)", "period": "Unknown; traditional", "origin_note": "Bhanita signature in closing chaupai; some print traditions attribute this chalisa differently — needs verification."},
    "C008": {"author": "Haridas", "period": "Unknown; traditional", "origin_note": "Bhanita signature in closing chaupai and doha; period/identity not independently verified."},
    "C009": {"author": "", "period": "", "origin_note": "No bhanita/self-naming signature found in the supplied text; authorship remains untraced."},
    "C011": {"author": "Vimal (per text)", "period": "Unknown; traditional", "origin_note": "Closing doha names 'Vimal' as compiler ('kiho Vimal taiyaar'); likely a later print-tradition compiler name rather than the original composer — needs verification."},
}

rows = []
with TRACKER.open(encoding="utf-8-sig", newline="") as fh:
    reader = csv.DictReader(fh)
    fieldnames = reader.fieldnames
    for r in reader:
        if r["id"] in UPDATES:
            r["original_sourced"] = "yes"
            u = UPDATES[r["id"]]
            if u["author"]:
                r["author"] = u["author"]
            if u["period"]:
                r["period"] = u["period"]
            r["origin_note"] = u["origin_note"]
            r["notes"] = (r.get("notes") or "").rstrip()
            if r["notes"] and not r["notes"].endswith("."):
                r["notes"] += "."
            r["notes"] = (r["notes"] + " Original text sourced 2026-07-13 (segments in data/chalisa_lines.csv); translation/transliteration still pending; reviewed=no until checked against sung versions.").strip()
        rows.append(r)

with TRACKER.open("w", newline="", encoding="utf-8-sig") as fh:
    writer = csv.DictWriter(fh, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

updated = [r["id"] for r in rows if r["id"] in UPDATES]
print("Updated rows:", updated)
