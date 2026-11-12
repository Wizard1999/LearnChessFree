"""Scan the top-level game tree for positions where the bishop sacrifice on h7 is legal and rate it with the engine.

    ./tools/.venv/Scripts/python.exe -I tools/scan_greek_gift.py [depth]

Filter (French pawn skeleton): White to move, white bishop on d3, black king on g8, black pawns on e6, d5 and h7, and Bxh7+ legal.
Source: app/public/masters/stats.json (329,379 games, both players 2,500 or more, up to 24 plies). For each position the engine rates the move
Bxh7+ alone (searchmoves) at the given depth (default 12). Prints the number of positions and the best five scores (mover's point of view, centipawns).
Used by L-OD-FRENCH-4 (the figure is quoted there). Engine results are evidence under recorded settings, not proofs."""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import json, chess
from engine import Engine, ROOT

depth = int(_s.argv[1]) if len(_s.argv) > 1 else 12
tree = json.loads((ROOT / "app" / "public" / "masters" / "stats.json").read_text(encoding="utf8"))["tree"]
cands = []
for fen in tree:
    b = chess.Board(fen + " 0 1")
    if not b.turn: continue
    p = b.piece_at
    def is_(sq, sym): return p(sq) is not None and p(sq).symbol() == sym
    if not (is_(chess.E6, "p") and is_(chess.D5, "p") and is_(chess.H7, "p") and is_(chess.G8, "k") and is_(chess.D3, "B")): continue
    if chess.Move.from_uci("d3h7") in b.legal_moves: cands.append(fen)
print(f"{len(cands)} positions", flush=True)
eng = Engine(64)
rows = []
for fen in cands:
    r = eng.search(fen + " 0 1", depth, 1, ["d3h7"])[1]
    rows.append((r["value"] if r["kind"] == "cp" else (100000 if r["value"] > 0 else -100000), fen))
rows.sort(reverse=True)
for v, fen in rows[:5]: print(v, fen)
eng.close()
