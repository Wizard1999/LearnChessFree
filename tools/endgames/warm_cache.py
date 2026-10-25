"""Copy the tablebase answers this folder has already fetched into the validator's shared cache (library/cache/tablebase.json), so that
tools/validate.py does not have to query the rate-limited public service again for the same positions.

    ./tools/.venv/Scripts/python.exe -I tools/endgames/warm_cache.py

Uses the validator's own locked, atomic, merging cache functions (tools/validate.py: _tb_file_lock, _tb_store, tb_flush); never writes the
file directly. Key = the FEN exactly as stored in the item file (the validator queries board.fen()). Entries come from the same Lichess
service the validator would call; nothing is derived or transformed.
"""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(HERE.parent))
import json
import chess
import tb
import validate as V


def main():
    items_dir = HERE.parent.parent / "content" / "items"
    fens = []
    for f in sorted(items_dir.glob("end-*.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        for p in d.get("positions", []):
            fens.append(p["fen"])
    with V._tb_file_lock():
        V._TB = V._tb_read_disk()
    added = missing = have = 0
    for fen in fens:
        key = chess.Board(fen).fen()
        if key in V._TB:
            have += 1
            continue
        d = tb.get(fen)
        if d is None:
            missing += 1
            continue
        V._tb_store(key, d)
        added += 1
    V.tb_flush()
    print(f"positions {len(fens)}: already in the validator cache {have}, added {added}, not fetched {missing}")


if __name__ == "__main__":
    main()
