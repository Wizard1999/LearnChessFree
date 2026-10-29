"""Turn library/cache/master_stats.json into app/public/masters/stats.json, small enough to ship (about 8 MB at most).
Moves seen in fewer than MIN games are dropped; the threshold rises until the file fits. Run after tools/build_master_stats.py."""
import json, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = json.loads((ROOT / "library" / "cache" / "master_stats.json").read_text(encoding="utf8"))
LIMIT = 8 * 1024 * 1024
out = ROOT / "app" / "public" / "masters"
out.mkdir(parents=True, exist_ok=True)
for min_games in (5, 8, 12, 20, 30, 50, 100):
    tree = {}
    for epd, rows in src["tree"].items():
        keep = [r for r in rows if r[2] >= min_games]
        if keep: tree[epd] = keep[:12]
    data = json.dumps({"info": {"games": src["games"], "minElo": src["min_elo"], "maxPly": src["max_ply"], "built": time.strftime("%Y-%m-%d")}, "tree": tree}, separators=(",", ":"), ensure_ascii=False)
    if len(data.encode("utf8")) <= LIMIT: break
(out / "stats.json").write_text(data, encoding="utf8")
print(f"masters: {len(tree)} positions, moves with at least {min_games} games, {len(data) // 1024} KB, from {src['games']} games")
