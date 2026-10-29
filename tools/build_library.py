"""Build the in-app library: library/catalog.json (stored texts only) + library/tags.json -> app/public/library/.
Only records whose status is "stored" ship. Tags (subjects, level, blurb) are our own labels [I], not claims about the author."""
import json, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
cat = json.loads((ROOT / "library" / "catalog.json").read_text(encoding="utf8"))
tags = json.loads((ROOT / "library" / "tags.json").read_text(encoding="utf8"))
out = ROOT / "app" / "public" / "library"
(out / "files").mkdir(parents=True, exist_ok=True)
books = []
for key, rec in sorted(cat.items()):
    src = ROOT / "library" / "files" / f"{key}.txt"
    if rec.get("status") != "stored" or not src.exists():
        continue
    t = tags.get(key, {})
    shutil.copyfile(src, out / "files" / f"{key}.txt")
    books.append({"id": key, "title": rec["title"], "author": rec["author"].replace("‏", ""), "year": rec.get("year"), "language": rec.get("language", ""),
                  "source_url": rec["source_url"], "file": f"files/{key}.txt", "size": rec["size"], "rights": rec["rights"],
                  "subjects": t.get("subjects", ["unsorted"]), "level": t.get("level", "Reference"), "blurb": t.get("blurb", "")})
(out / "catalog.json").write_text(json.dumps({"books": books}, indent=1, ensure_ascii=False), encoding="utf8")
print(f"library: {len(books)} books shipped, {sum(b['size'] for b in books) // 1024} KB")
