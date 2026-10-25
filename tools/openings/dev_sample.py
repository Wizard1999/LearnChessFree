"""DEV ONLY: build a small openings dataset in the production contract format from the 2013-01 Lichess sample,
so the Openings UI can be developed and tested before the full pipeline finishes.
Output: app/public/openings-dev/{manifest.json, core.json}.  The real data lives in app/public/openings/.
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parents[1]))
import csv, hashlib, io, json, re, datetime
from collections import defaultdict
from pathlib import Path
import chess, zstandard

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "library" / "data" / "lichess_db_standard_rated_2013-01.pgn.zst"
OUT = ROOT / "app" / "public" / "openings-dev"
MAXPLY = 10
MIN_PREFIX = 12
BANDS = [("u900", "Below 900", 0, 899), ("b900", "900-1100", 900, 1099), ("b1100", "1100-1300", 1100, 1299), ("b1300", "1300-1500", 1300, 1499),
         ("b1500", "1500-1700", 1500, 1699), ("b1700", "1700-1900", 1700, 1899), ("b1900", "1900-2100", 1900, 2099), ("b2100", "2100+ (online)", 2100, 9999)]


def band(avg):
    for i, (_, _, lo, hi) in enumerate(BANDS):
        if lo <= avg <= hi: return i
    return 0


def games():
    rd = io.TextIOWrapper(zstandard.ZstdDecompressor().stream_reader(open(SRC, "rb")), encoding="utf-8", errors="replace")
    h = {}
    for line in rd:
        if line.startswith("["):
            m = re.match(r'\[(\w+) "(.*)"\]', line)
            if m: h[m.group(1)] = m.group(2)
        elif line.strip() and h:
            move_text = re.sub(r"\{[^}]*\}", " ", line)
            toks = [t for t in move_text.split() if not re.match(r"^\d+\.(\.\.)?$", t) and t not in ("1-0", "0-1", "1/2-1/2", "*")]
            yield h, toks
            h = {}


def main():
    cnt = defaultdict(lambda: [[0] * 8, [0] * 8, [0] * 8])  # prefix tuple -> [n, w, d] per band
    used = 0
    for h, toks in games():
        ev = h.get("Event", "")
        if not any(k in ev for k in ("Blitz", "Rapid", "Classical")): continue
        try: avg = (int(h["WhiteElo"]) + int(h["BlackElo"])) // 2
        except (KeyError, ValueError): continue
        b = band(avg); used += 1
        res = h.get("Result", "*")
        toks = toks[:MAXPLY]
        for d in range(1, len(toks) + 1):
            c = cnt[tuple(toks[:d])]
            c[0][b] += 1
            if res == "1-0": c[1][b] += 1
            elif res == "1/2-1/2": c[2][b] += 1
    keep = {k: v for k, v in cnt.items() if sum(v[0]) >= MIN_PREFIX}
    # names from chess-openings: EPD -> (eco, name)
    names = {}
    for f in "abcde":
        for row in csv.DictReader(open(ROOT / "library" / "data" / "chess-openings" / f"{f}.tsv", encoding="utf-8"), delimiter="\t"):
            b = chess.Board()
            try:
                for tok in re.sub(r"\d+\.", " ", row["pgn"]).split(): b.push_san(tok)
            except Exception: continue
            names[b.epd()] = (row["eco"], row["name"])
    nid = lambda epd: hashlib.sha1(epd.encode()).hexdigest()[:10]
    nodes, edges = {}, []
    root = chess.Board(); rid = nid(root.epd())
    nodes[rid] = {"e": root.epd(), "p": 0, "n": [used if i == 0 else 0 for i in range(8)], "eco": None, "name": None, "path": ""}
    # total games per band for the root
    tot = [0] * 8
    for k, v in keep.items():
        if len(k) == 1:
            for i in range(8): tot[i] += v[0][i]
    nodes[rid]["n"] = tot
    for prefix in sorted(keep, key=lambda k: (len(k), k)):
        b = chess.Board(); parent_epd = b.epd(); ok = True
        try:
            for tok in prefix[:-1]: b.push_san(tok)
            parent_epd = b.epd(); mv = b.push_san(prefix[-1]);
        except Exception: continue
        u = b.peek().uci(); epd = b.epd(); pid, cid = nid(parent_epd), nid(epd)
        n, w, d = keep[prefix]
        edges.append({"f": pid, "t": cid, "m": prefix[-1], "u": u, "n": n, "w": w, "d": d})
        nd = nodes.get(cid)
        if nd is None:
            e = names.get(epd)
            nodes[cid] = {"e": epd, "p": len(prefix), "n": list(n), "eco": e[0] if e else None, "name": e[1] if e else None, "path": " ".join(prefix)}
        else:
            nd["n"] = [a + c for a, c in zip(nd["n"], n)]
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "core.json").write_text(json.dumps({"nodes": nodes, "edges": edges}, separators=(",", ":")), encoding="utf-8")
    man = {"version": 1, "dev": True, "source": {"name": "DEV SAMPLE: Lichess standard rated games 2013-01 (CC0)", "month": "2013-01", "games_scanned": used, "games_used": used,
           "speeds": ["blitz", "rapid", "classical"], "sampling": "whole month file; old low-volume month; for UI development only", "generated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")},
           "bands": [{"id": i, "label": l, "min": lo, "max": hi, "games": 0} for i, l, lo, hi in BANDS], "bandRule": "average of white and black rating", "maxPly": MAXPLY,
           "core": "core.json", "chunkIndex": None, "dir": "chunks/"}
    (OUT / "manifest.json").write_text(json.dumps(man, indent=1), encoding="utf-8")
    print(f"games used {used}; nodes {len(nodes)}; edges {len(edges)}; core.json {(OUT / 'core.json').stat().st_size / 1e6:.2f} MB")
    multi = defaultdict(set)
    for e in edges: multi[e["t"]].add(e["f"])
    print("nodes with >1 parent (transpositions):", sum(1 for v in multi.values() if len(v) > 1))


if __name__ == "__main__":
    main()
