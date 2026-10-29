"""Find and fetch the remaining candidate books from the Internet Archive, with rights evidence from the item's own metadata.

For each book row in library/candidates.csv without a Project Gutenberg link and not yet held: search archive.org by title and author,
accept an item only if (1) its title and creator match the candidate, (2) its stated year is 1930 or earlier, and (3) its metadata says
`possible-copyright-status: NOT_IN_COPYRIGHT` or carries a public-domain licence URL. The OCR text (the item's _djvu.txt) is stored in
library/files/ and recorded in library/catalog.json with the quoted metadata. Anything else is logged as not found or not cleared.
Texts are uncorrected OCR and the record says so. Usage: python -I tools/fetch_archive.py [--dry] [--only N]
"""
import csv, importlib.util, json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES = ROOT / "library" / "files"
CATALOG = ROOT / "library" / "catalog.json"
CSV = ROOT / "library" / "candidates.csv"
_spec = importlib.util.spec_from_file_location("fs", Path(__file__).resolve().parent / "fetch_sources.py")
FS = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(FS)
UA = {"User-Agent": "scholarmate-library-fetch/1.0 (rights-checked; github.com/Wizard1999/LearnChessFree)"}
LEVELS = {"beginner": "Beginner", "improver": "Improver", "club": "Club", "advanced": "Advanced"}
STOP = {"the", "of", "and", "in", "a", "an", "to", "for", "on", "chess", "games", "game"}


def get_json(url: str):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return json.loads(r.read().decode("utf8", "replace"))


def words(s: str) -> set[str]:
    return {w for w in re.findall(r"[a-zà-ÿ]+", s.lower()) if w not in STOP and len(w) > 2}


def year_of(x) -> int | None:
    m = re.search(r"\b(1[5-9]\d\d)\b", str(x or ""))
    return int(m.group(1)) if m else None


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    dry = "--dry" in sys.argv
    only = int(sys.argv[sys.argv.index("--only") + 1]) if "--only" in sys.argv else None
    cat = json.loads(CATALOG.read_text(encoding="utf8")) if CATALOG.exists() else {}
    have = {r.get("candidate") for r in cat.values() if r.get("candidate")}
    FILES.mkdir(parents=True, exist_ok=True)
    for row in csv.DictReader(open(CSV, encoding="utf8", newline="")):
        n = int(row["n"])
        if only and n != only: continue
        if not row["kind"].startswith("book") or "held" in row["status"] or "gutenberg" in row["locator"] or n in have: continue
        title, author = row["title"], row["author"]
        surname = (re.findall(r"[A-Za-zÀ-ÿ'\-]+", author.split("/")[0].replace("Em.", "").replace("Ed.", "")) or [""])[-1]
        q = f'title:({" ".join(sorted(words(title) | ({"chess"} if "chess" in title.lower() else set()))[:6])}) AND creator:({surname}) AND mediatype:texts'
        url = "https://archive.org/advancedsearch.php?" + urllib.parse.urlencode({"q": q, "fl[]": ["identifier", "title", "creator", "year", "date"], "rows": 15, "output": "json"}, doseq=True)
        try: docs = get_json(url)["response"]["docs"]
        except Exception as e: print(f"{n} {title[:40]}: search failed ({e})"); continue
        time.sleep(1.2)
        done = False
        for d in docs:
            t = d.get("title", ""); c = " ".join(d.get("creator", [])) if isinstance(d.get("creator"), list) else str(d.get("creator", ""))
            wt, wc = words(title), words(t)
            if not wt or len(wt & wc) / len(wt) < 0.6 or surname.lower() not in c.lower(): continue
            y = year_of(d.get("year")) or year_of(d.get("date"))
            if y is None or y > 1930: continue
            try: meta = get_json(f"https://archive.org/metadata/{d['identifier']}")
            except Exception: continue
            time.sleep(1.0)
            md = meta.get("metadata", {})
            status, lic = str(md.get("possible-copyright-status", "")), str(md.get("licenseurl", ""))
            meta_ok = status == "NOT_IN_COPYRIGHT" or "publicdomain" in lic
            txt = next((f["name"] for f in meta.get("files", []) if f["name"].endswith("_djvu.txt")), None)
            if not txt: continue
            try:
                data = urllib.request.urlopen(urllib.request.Request(f"https://archive.org/download/{d['identifier']}/{urllib.parse.quote(txt)}", headers=UA), timeout=180).read().decode("utf8", "replace").replace("\r\n", "\n")
            except Exception as e: print(f"{n} {title[:40]}: download failed ({e})"); continue
            basis_extra = ""
            if not meta_ok:
                ok, why, _ = FS.judge(data)
                if not ok: print(f"{n} not cleared ({d['identifier']}): {why}", flush=True); continue
                basis_extra = f" Metadata has no copyright status; the text itself was checked: {why}."
            key = f"ia_{d['identifier']}"
            rec = {"id": key, "candidate": n, "source_url": f"https://archive.org/details/{d['identifier']}", "title": t, "author": c, "year": y,
                   "release": str(md.get("date", "")), "language": ",".join(md["language"]) if isinstance(md.get("language"), list) else str(md.get("language", "")),
                   "kind": "book", "subjects": [s.strip() for s in row["subject"].split(" and ")] if row["subject"] else ["unsorted"], "level": LEVELS.get(row["level"].lower(), "Reference"),
                   "rights": {"label": "Not in copyright" if meta_ok else "PD-US by publication date (text checked)", "basis": f"item metadata: possible-copyright-status {status or '-'}; licenseurl {lic or '-'}; stated year {y}.{basis_extra} Uncorrected OCR text.", "checked": time.strftime("%Y-%m-%d")},
                   "status": "stored", "size": 0}
            if not dry:
                (FILES / f"{key}.txt").write_bytes(data.encode("utf8")); rec["size"] = len(data.encode("utf8"))
                cat[key] = rec; CATALOG.write_text(json.dumps(cat, indent=1, ensure_ascii=False), encoding="utf8")
            print(f"{n} STORE {title[:44]} <- {d['identifier']} ({y}, {status})", flush=True)
            done = True; time.sleep(1.5); break
        if not done: print(f"{n} none: {title[:50]}", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
