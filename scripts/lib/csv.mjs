// Minimal RFC4180-ish CSV parser. No external dependency on purpose: this
// tooling never runs as part of the Next.js app, but keeping it dependency-free
// keeps the whole scripts/ package's attack surface as small as possible.

/** Parse CSV text into an array of row-arrays (strings, unquoted). */
export function parseCSV(text) {
  // Strip a UTF-8 BOM if present (the trackers were saved with one).
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\r") {
      // ignore, \n (or \r\n) below ends the row
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  // last field/row if the file doesn't end with a newline
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

/** Parse CSV text into an array of objects keyed by the header row. */
export function parseCSVObjects(text) {
  const rows = parseCSV(text);
  const [header, ...rest] = rows;
  return rest.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

/** 'yes'/'no' (case-insensitive) -> boolean. Anything else -> false, logged. */
export function yesNoToBool(value, context) {
  const v = (value || "").trim().toLowerCase();
  if (v === "yes") return true;
  if (v === "no" || v === "") return false;
  console.warn(`[csv] unexpected yes/no value "${value}" in ${context}, treating as false`);
  return false;
}

/** Title -> stable kebab-case slug. */
export function slugify(title) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
