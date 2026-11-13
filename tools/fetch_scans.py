#!/usr/bin/env python3
"""Download the page images of each Internet Archive library book so the reader can show the original scan with no connection.

    ./tools/.venv/Scripts/python.exe -I tools/fetch_scans.py [--only ID] [--max-books N] [--width 700]

For every `ia_` book in app/public/library/catalog.json this saves each page as a grayscale-preserving WebP (default 700 px wide, quality 45) under
app/public/library/scans/<id>/<n>.webp and writes scans/<id>/index.json {"pages": N}. It resumes: pages already saved are skipped, and a book is only
marked complete (index.json written) when every page is present. The folder is gitignored (about a gigabyte for the whole library, far too much for the
repository); it ships in the downloadable offline build, so a copy on a USB stick carries the books with their pictures. Gutenberg books have no scan.
The source is the archive's own page-image service for works already cleared as public domain in library/REGISTRY.md.
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import io, json, time, urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CAT = ROOT / "app" / "public" / "library" / "catalog.json"
OUT = ROOT / "app" / "public" / "library" / "scans"
UA = {"User-Agent": "Scholarmate-library/1.0 (+https://github.com/Wizard1999/LearnChessFree)"}


def get(url, tries=3):
    for k in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                return r.read()
        except Exception:
            time.sleep(1.5 * (k + 1))
    return None


def main():
    _s.stdout.reconfigure(encoding="utf-8")
    arg = lambda f, d=None: _s.argv[_s.argv.index(f) + 1] if f in _s.argv else d
    only, cap, width = arg("--only"), int(arg("--max-books", 999)), int(arg("--width", 700))
    books = json.loads(CAT.read_text(encoding="utf-8"))["books"]
    done = 0
    for b in books:
        if not b["id"].startswith("ia_") or (only and b["id"] != only): continue
        if done >= cap: break
        ident = b["id"][3:]; d = OUT / b["id"]
        if (d / "index.json").exists(): continue
        meta = get(f"https://archive.org/metadata/{ident}")
        n = int(json.loads(meta).get("metadata", {}).get("imagecount", 0) or 0) if meta else 0
        if not n: print("no page count", b["id"]); continue
        d.mkdir(parents=True, exist_ok=True); ok = 0
        for i in range(n):
            f = d / f"{i}.webp"
            if f.exists(): ok += 1; continue
            data = get(f"https://archive.org/download/{ident}/page/n{i}_w{width}.jpg")
            if not data: continue
            try: im = Image.open(io.BytesIO(data)); im.load()
            except Exception: continue
            if im.mode not in ("L", "RGB"): im = im.convert("RGB")
            im.save(f, "WEBP", quality=45, method=6); ok += 1
            time.sleep(0.15)
        print(f"{b['id']}: {ok}/{n} pages", flush=True)
        have = [i for i in range(n) if (d / f"{i}.webp").exists()]
        if ok >= n - 8 and have:   # the archive lists a few trailing leaves (covers, colour bars) it cannot serve; the reader ends at the last page we hold
            (d / "index.json").write_text(json.dumps({"pages": max(have) + 1}), encoding="utf-8"); done += 1
    print(f"{done} books complete")


if __name__ == "__main__":
    main()
