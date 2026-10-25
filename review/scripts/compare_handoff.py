import re, hashlib, pathlib, sys
comb = pathlib.Path(r"O:\_downloads\chess-claude-complete-handoff.md").read_text(encoding="utf-8")
zdir = pathlib.Path(sys.argv[1])
parts = re.findall(r"# BEGIN DOCUMENT: (.+?)\n(.*?)\n# END DOCUMENT: \1", comb, flags=re.S)
print("documents found in combined file:", [p[0] for p in parts])
def norm(s): return re.sub(r"\s+", " ", s).strip()
for name, body in parts:
    z = (zdir / name).read_text(encoding="utf-8")
    same = norm(z) == norm(body)
    print(f"{name:45s} whitespace-normalised identical to zip file: {same}  (zip chars={len(z)}, combined chars={len(body)})")
    if not same:
        a, b = norm(z), norm(body)
        i = next((k for k in range(min(len(a), len(b))) if a[k] != b[k]), None)
        print("   first difference at", i, "\n   zip:", a[i-60:i+80] if i is not None else "(length only)", "\n   cmb:", b[i-60:i+80] if i is not None else "")
# is 08 the same as the combined file?
z8 = (zdir / "08-COMPLETE-HANDOFF.md").read_text(encoding="utf-8")
print("\n08-COMPLETE-HANDOFF.md chars:", len(z8), "| attached combined chars:", len(comb), "| identical:", norm(z8) == norm(comb))
print("08 headers:", re.findall(r"BEGIN (?:DOCUMENT|FILE)[: ]+(.+)", z8)[:12])
