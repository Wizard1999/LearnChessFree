#!/usr/bin/env python3
"""Fetch a cover image for each rights-checked library book and record it in the catalog.

    ./tools/.venv/Scripts/python.exe -I tools/fetch_covers.py [--only ID]

Internet Archive books: the first page of the book's own scan (`/download/<id>/page/cover_w400.jpg`), which is a faithful photograph of a work already
cleared as public domain in `library/REGISTRY.md`; if that is missing, the archive's thumbnail service. Project Gutenberg books: the cover Gutenberg
serves for the text. Every image is shrunk to 300 px wide, saved as WebP under `app/public/library/covers/`, and the catalog row gets `cover`
and `coverSource`. A book whose cover cannot be fetched keeps the generated typographic cover. Nothing is fetched for a book the catalog does not list.
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import json, io, urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CAT = ROOT / "app" / "public" / "library" / "catalog.json"
OUT = ROOT / "app" / "public" / "library" / "covers"
UA = {"User-Agent": "Scholarmate-library/1.0 (+https://github.com/Wizard1999/LearnChessFree)"}


def get(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
            return r.read() if r.status == 200 and "image" in (r.headers.get("content-type") or "") else None
    except Exception:
        return None


# Scans from Google Books begin with Google's notice page, so page 0 is no cover. These are the scan pages that show the book's own cover or title page,
# chosen by looking at pages 0-11 of every scan (12 Nov 2026). Books not listed use page 0, which for the others is the binding or title page.
PAGE = {"acollectiontwoh00healgoog": 7, "americanchessnu01gilbgoog": 8, "artchess00hoffgoog": 4, "bub_gb_D_4UAAAAYAAJ": 3, "bub_gb_g2XzAAAAMAAJ": 8,
        "bwb_KP-645-451": 6, "chessmatchbetwe00blacgoog": 5, "chesssparksorsho00elliiala": 6, "chessstudiesore00horwgoog": 1, "cu31924029919820": 8,
        "in.ernet.dli.2015.37809": 7, "knightsandbisho00whitgoog": 1, "principleschess01masogoog": 11, "twomovechesspro00lawsgoog": 7}
# Gutenberg serves a generated abstract cover for most books; only the ones that are a real scan of the book's cover are used.
PG_REAL = {"pg55278", "pg5614", "pg78804"}


# Covers that are a plain binding with no lettering and no picture, so our typographic title goes over them. Judged by eye on a montage of every
# dark cover (12 Nov 2026); a brightness test wrongly caught covers with a stamped board or emblem, which keep their own picture.
BLANK = {"ia_artofchess00maso", "ia_grandtacticsofch00younrich", "ia_majortacticsofch00younrich", "ia_memorablechessga00moffiala", "ia_modernchessinstr00steirich"}


def candidates(b):
    i = b["id"]
    if i.startswith("ia_"):
        k = i[3:]
        if k in PAGE: return [f"https://archive.org/download/{k}/page/n{PAGE[k]}_w400.jpg"]
        if "goog" in k or k.startswith("bub_gb"): return []   # Google Books scans open with Google's notice page; add the title page to PAGE after looking
        return [f"https://archive.org/download/{k}/page/cover_w400.jpg", f"https://archive.org/services/img/{k}"]
    if i in PG_REAL:
        n = i[2:]
        return [f"https://www.gutenberg.org/cache/epub/{n}/pg{n}.cover.medium.jpg"]
    return []


def main():
    only = _s.argv[_s.argv.index("--only") + 1] if "--only" in _s.argv else None
    cat = json.loads(CAT.read_text(encoding="utf-8")); OUT.mkdir(exist_ok=True)
    books = cat["books"] if "books" in cat else cat
    rows = books.values() if isinstance(books, dict) else books
    got = 0
    for b in rows:
        if only and b["id"] != only: continue
        for url in candidates(b):
            data = get(url)
            if not data or len(data) < 3000: continue
            try: im = Image.open(io.BytesIO(data)).convert("RGB")
            except Exception: continue
            im.thumbnail((300, 450))
            im.save(OUT / f"{b['id']}.webp", "WEBP", quality=80)
            b["cover"] = f"covers/{b['id']}.webp"; b["coverSource"] = url; got += 1
            if b["id"] in BLANK: b["coverBlank"] = True
            else: b.pop("coverBlank", None)
            print("ok  ", b["id"], im.size, url); break
        else:
            print("none", b["id"])
    CAT.write_text(json.dumps(cat, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{got} covers")


if __name__ == "__main__":
    main()
