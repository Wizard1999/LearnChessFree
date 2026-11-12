#!/usr/bin/env python3
"""Widen the library with more public-domain chess texts from the Internet Archive, each cleared twice (item metadata and the text itself).

    ./tools/.venv/Scripts/python.exe -I tools/fetch_ia_bulk.py [--dry] [--max N]

Selection: English texts with "chess" in the title, a stated year of 1930 or earlier, and the archive's own `possible-copyright-status: NOT_IN_COPYRIGHT`,
not already held, most downloaded first, with fiction, poetry, plays and periodicals left out. Each text is then judged by `fetch_sources.judge` (a later
copyright notice or renewal wording, or a front-matter year after 1930, refuses it: an uploader's tag is never enough, CLAUDE.md rule 4). Cleared texts
go to library/files/ and library/catalog.json with the quoted evidence; subject, level and blurb are our own labels [I] written to library/tags.json.
Afterwards run tools/build_library.py and tools/fetch_covers.py.
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import json, re, time, urllib.parse, urllib.request, importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES = ROOT / "library" / "files"; CATALOG = ROOT / "library" / "catalog.json"; TAGS = ROOT / "library" / "tags.json"
_spec = importlib.util.spec_from_file_location("fs", Path(__file__).resolve().parent / "fetch_sources.py")
FS = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(FS)
UA = {"User-Agent": "scholarmate-library-fetch/1.0 (rights-checked; github.com/Wizard1999/LearnChessFree)"}
SKIP = re.compile(r"(?i)magazine|chronicle|register|annual|journal|newspaper|poem|poetry|novel|story|stories|play in|drama|fiction|checkers|draughts|romance|iceland|catalogue|bibliograph|magic|automaton|turk|sermon|shogi|shōg|japanese|chinese|go|\bverse\b")
MAX_BYTES = 2_500_000


def get_json(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90) as r:
        return json.loads(r.read().decode("utf8", "replace"))


def year_of(x):
    m = re.search(r"\b(1[4-9]\d\d)\b", str(x or ""))
    return int(m.group(1)) if m else None


def tag(title):
    t = title.lower()
    if re.search(r"problem|composition|two-move|three-move|mate in", t): subj = ["composition"]
    elif re.search(r"opening|gambit|defen[cs]e|debut", t): subj = ["openings"]
    elif re.search(r"end(ing)?s?[- ]game|endings|studies", t): subj = ["endgames"]
    elif re.search(r"tournament|congress|match|games|morphy|selection", t): subj = ["game collections"]
    elif re.search(r"history|reminiscence|chess in|annals", t): subj = ["history"]
    elif re.search(r"middle game|strategy|positional|generalship|principles|fundamental|system", t): subj = ["strategy"]
    else: subj = ["rules and basics"] if re.search(r"hand-?book|manual|guide|primer|elementary|beginner|instruct|lessons|rudiments|learn", t) else ["unsorted"]
    if re.search(r"elementary|beginner|rudiments|first|primer|easy|simple|learn", t): level = "Beginner"
    elif re.search(r"instruct|handbook|hand-book|manual|guide|principles|fundamental|lessons", t): level = "Improver"
    else: level = "Reference"
    return subj, level


def main():
    _s.stdout.reconfigure(encoding="utf-8")
    dry = "--dry" in _s.argv
    cap = int(_s.argv[_s.argv.index("--max") + 1]) if "--max" in _s.argv else 40
    cat = json.loads(CATALOG.read_text(encoding="utf8")); tags = json.loads(TAGS.read_text(encoding="utf8"))
    held = {r["source_url"].rsplit("/", 1)[-1] for r in cat.values()}
    q = '(title:chess OR subject:chess) AND date:[1400-01-01 TO 1930-12-31] AND mediatype:texts AND language:(eng OR English)'
    docs, page = [], 1
    while page <= 4:
        url = "https://archive.org/advancedsearch.php?" + urllib.parse.urlencode({"q": q, "fl[]": ["identifier", "title", "creator", "date", "downloads", "possible-copyright-status"], "rows": 300, "page": page, "sort[]": "downloads desc", "output": "json"}, doseq=True)
        r = get_json(url)["response"]; docs += r["docs"]
        if len(docs) >= r["numFound"]: break
        page += 1
    pool = [d for d in docs if d.get("possible-copyright-status") == "NOT_IN_COPYRIGHT" and d["identifier"] not in held
            and "chess" in str(d.get("title", "")).lower() and not SKIP.search(str(d.get("title", "")))]
    print(f"{len(docs)} found, {len(pool)} candidates after the metadata and title filters")
    stored = 0
    for d in pool:
        if stored >= cap: break
        ident = d["identifier"]; title = str(d.get("title", "")).replace("\n", " ")
        y = year_of(d.get("date"))
        if y is None or y > 1930: continue
        try: meta = get_json(f"https://archive.org/metadata/{ident}")
        except Exception: continue
        time.sleep(0.8)
        md = meta.get("metadata", {}); status = str(md.get("possible-copyright-status", ""))
        if status != "NOT_IN_COPYRIGHT": continue
        f = next((x for x in meta.get("files", []) if x["name"].endswith("_djvu.txt")), None)
        if not f or int(f.get("size", 0) or 0) > MAX_BYTES or int(f.get("size", 0) or 0) < 15000: continue
        try: data = urllib.request.urlopen(urllib.request.Request(f"https://archive.org/download/{ident}/{urllib.parse.quote(f['name'])}", headers=UA), timeout=180).read().decode("utf8", "replace").replace("\r\n", "\n")
        except Exception as e: print("download failed", ident, e); continue
        ok, why, _ = FS.judge(data)
        if not ok: print(f"REFUSED {ident}: {why}"); continue
        creator = d.get("creator"); creator = " ".join(creator) if isinstance(creator, list) else str(creator or "")
        subj, level = tag(title)
        key = f"ia_{ident}"
        rec = {"id": key, "source_url": f"https://archive.org/details/{ident}", "title": title, "author": creator, "year": y, "release": str(md.get("date", "")),
               "language": "English", "kind": "book", "subjects": subj, "level": level,
               "rights": {"label": "PD-US by publication date (text checked)",
                          "basis": f"item metadata: possible-copyright-status {status}; stated year {y}. The text itself was checked: {why}. Uncorrected OCR text.",
                          "checked": "2026-11-12"},
               "status": "stored", "size": len(data.encode("utf8"))}
        print(f"STORE {ident} | {title[:60]} | {y} | {level} | {subj}", flush=True)
        if not dry:
            (FILES / f"{key}.txt").write_bytes(data.encode("utf8"))
            cat[key] = rec; tags[key] = {"subjects": subj, "level": level, "blurb": f"{title[:90]} ({y}). Scanned from the original and read by machine, so expect odd characters and broken diagrams. Subject and level are our guess from the title."}
            CATALOG.write_text(json.dumps(cat, indent=1, ensure_ascii=False), encoding="utf8"); TAGS.write_text(json.dumps(tags, indent=1, ensure_ascii=False), encoding="utf8")
        stored += 1; time.sleep(1.2)
    print(f"{stored} texts stored")


if __name__ == "__main__":
    main()
