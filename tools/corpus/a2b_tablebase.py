"""Task A step 2b: tablebase cross-check for the puzzles whose win is only an engine claim (material / eval) and that have
<= 7 pieces. Read-only: queries the Lichess tablebase service directly (does NOT write library/cache/tablebase.json).
Result is merged into out/verdicts.jsonl as fields tb_result ('win'|'draw'|'loss' for the mover after the solution move);
puzzles whose tablebase result is not 'win' are marked ok=false (reason 'tablebase says the engine win is not a win'),
and puzzles that pass get an extra claim C<n> of type 'tablebase' (move, result=win) so the validator re-checks it.
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json, time, urllib.parse, urllib.request
import chess
from common import *


def tb(fen):
    url = "https://tablebase.lichess.ovh/standard?fen=" + urllib.parse.quote(fen.replace(" ", "_"), safe="/_-")
    for attempt in range(5):
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "chess-school-corpus"}), timeout=40))
        except Exception:
            time.sleep(1.5 * (attempt + 1))
    return None


def main():
    path = OUT / "verdicts.jsonl"
    vs = [json.loads(l) for l in path.read_text(encoding="utf-8").splitlines() if l.strip()]
    n = changed = 0
    for v in vs:
        if not v.get("ok") or v.get("win_type") not in ("material", "eval") or "tb_result" in v:
            continue
        if len(chess.Board(v["fen"]).piece_map()) > 7:
            continue
        d = tb(v["fen"]); n += 1
        if d is None:
            v["tb_result"] = "unavailable"; continue
        row = next((x for x in d["moves"] if x["uci"] == v["lichess_move"]), None)
        cat = row["category"] if row else None
        res = {"loss": "win", "win": "loss", "draw": "draw", "cursed-win": "draw", "blessed-loss": "draw"}.get(cat, cat)   # row category is for the side to move AFTER the move
        v["tb_result"] = res
        time.sleep(0.2)
        if res == "win":
            v["claims"] = v["claims"] + [dict(id="C%d" % (len(v["claims"]) + 1), type="tablebase", params=dict(move=v["lichess_move"], result="win"))]
        else:
            v["ok"] = False; v["reason"] = f"tablebase says the engine win is not a win ({res})"; changed += 1
        print(v["id"], v["theme"], v["win_type"], res, flush=True)
    path.write_text("".join(json.dumps(v, ensure_ascii=False) + "\n" for v in vs), encoding="utf-8")
    print("queried", n, "changed to drop", changed)


if __name__ == "__main__":
    main()
