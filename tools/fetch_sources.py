"""Fetch rights-clear texts for the in-app library and record the evidence for each decision.

Reads library/candidates.csv (rows whose locator is a gutenberg.org/ebooks/N link) plus any ids given on the command line,
downloads the plain text, and decides from the text's own notices, never from an uploader tag:
  - stored  : a publication year of 1930 or earlier is stated, and no later copyright notice appears
  - refused : a copyright notice dated after 1930, a renewal, or no year that can be found (logged, never stored)
Output: library/files/pgN.txt (stored texts) and library/catalog.json (one record per id, with the evidence quoted).
Idempotent: a stored file is never overwritten; a refused id is re-checked on each run.
Usage: python -I tools/fetch_sources.py [--dry] [id ...]
"""
import csv, json, re, sys, time, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES = ROOT / "library" / "files"
CATALOG = ROOT / "library" / "catalog.json"
CSV = ROOT / "library" / "candidates.csv"
APPROVED = json.loads((ROOT / "library" / "approved.json").read_text(encoding="utf8")) if (ROOT / "library" / "approved.json").exists() else {}
CUTOFF = 1930  # US public domain by publication date as of 2026 (95-year rule); texts first published up to this year qualify
UA = {"User-Agent": "scholarmate-library-fetch/1.0 (rights-checked; contact via github.com/Wizard1999/LearnChessFree)"}


def get(url: str) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def header(text: str, key: str) -> str:
    m = re.search(rf"^{key}:\s*(.+)$", text, re.M)
    return m.group(1).strip() if m else ""


def judge(text: str) -> tuple[bool, str, int | None]:
    """Returns (clear, evidence, year). Evidence quotes what the decision rests on."""
    # judge only the book itself, not the Project Gutenberg licence text around it
    m1 = re.search(r"\*\*\* ?START OF[^\n]*\n", text)
    m2 = re.search(r"\*\*\* ?END OF", text)
    text = text[m1.end(): m2.start() if m2 else len(text)] if m1 else text
    body = text[:60000]
    later = re.findall(r"(?i)(?:copyright|©|\(c\))[^.\n]{0,25}?(19[3-9]\d|20\d\d)", text)
    if later:
        ys = sorted({int(y) for y in later})
        if any(y > CUTOFF for y in ys):
            return False, f"notice of a later copyright year in the text: {ys}", max(ys)
    if re.search(r"(?i)renewed|all rights reserved", body):
        return False, "text mentions a renewal or 'all rights reserved'", None
    years = [int(y) for y in re.findall(r"\b(1[7-9]\d\d)\b", body[:20000])]
    years = [y for y in years if y <= 1960]
    if not years:
        return False, "no publication year found near the start of the text", None
    year = max(years)
    if year > CUTOFF:
        return False, f"the front matter mentions {year}, after {CUTOFF}: check this edition by hand", year
    return True, f"latest year in the front matter is {year}; no copyright notice dated after {CUTOFF} anywhere in the text", year


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    dry = "--dry" in sys.argv
    ids: list[str] = []
    if CSV.exists():
        with open(CSV, encoding="utf8", newline="") as f:
            for row in csv.DictReader(f):
                m = re.search(r"gutenberg\.org/(?:ebooks|cache/epub)/(\d+)", row.get("locator", ""))
                if m and "held" not in row.get("status", ""):
                    ids.append(m.group(1))
    ids += [a for a in args if a.isdigit()]
    ids = list(dict.fromkeys(ids))
    FILES.mkdir(parents=True, exist_ok=True)
    cat = json.loads(CATALOG.read_text(encoding="utf8")) if CATALOG.exists() else {}
    for gid in ids:
        key = f"pg{gid}"
        target = FILES / f"{key}.txt"
        if target.exists() and cat.get(key, {}).get("status") == "stored":
            print(f"{key}: already stored")
            continue
        try:
            raw = get(f"https://www.gutenberg.org/cache/epub/{gid}/pg{gid}.txt").decode("utf-8-sig", errors="replace").replace("\r\n", "\n").replace("\r", "\n")
        except Exception as e:  # network or missing: log and move on, never block
            print(f"{key}: could not fetch ({e})")
            continue
        ok, why, year = judge(raw)
        note = APPROVED.get(gid)
        approved = False
        if not ok and note:
            why, ok, approved = f"{note} (script said: {why})", True, True
        rec = {"id": key, "source_url": f"https://www.gutenberg.org/ebooks/{gid}", "title": header(raw, "Title"), "author": header(raw, "Author"),
               "release": header(raw, "Release date"), "language": header(raw, "Language"), "year": year, "kind": "book",
               "rights": {"label": ("Approved by the owner after a hand check" if approved else "PD-US by publication date") if ok else "not cleared", "basis": why, "checked": time.strftime("%Y-%m-%d")},
               "size": len(raw.encode("utf8")), "status": "stored" if ok else "refused"}
        print(f"{key}: {'STORE' if ok else 'REFUSE'} | {rec['title'][:50]} | {rec['author']} | {why}")
        if ok and not dry:
            target.write_bytes(raw.encode("utf8"))
        cat[key] = rec
        time.sleep(1.0)  # be polite to the server
    if not dry:
        CATALOG.write_text(json.dumps(cat, indent=1, ensure_ascii=False), encoding="utf8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
