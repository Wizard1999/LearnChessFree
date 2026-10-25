"""Builds tools/positional/out/index.jsonl: for every calm real-game position in the pool, the exact structure features
(tools/structure.py) and the sets of moves with each move property. Deterministic (no randomness). The generators select from it.

    ./tools/.venv/Scripts/python.exe -I tools/positional/build_index.py [workers]
"""
import sys, json, multiprocessing as mp
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import pcommon as C
import chess
import structure as S


def work(line):
    d = json.loads(line)
    b = chess.Board(d["fen"])
    if d["pieces"] < 10 or d["ply"] < 10 or not C.calm(b):
        return None
    pawns = len(b.pieces(chess.PAWN, chess.WHITE)) + len(b.pieces(chess.PAWN, chess.BLACK))
    if pawns < 6:
        return None
    m = {}
    for prop in S.MOVE_PROPS:
        if prop in S.NEEDS_SQUARE:
            continue
        mv = S.moves_where(b, prop)
        if mv:
            m[prop] = mv
    return json.dumps({"g": d["gid"], "p": d["ply"], "fen": d["fen"], "n": d["pieces"], "elo": (d["white_elo"] + d["black_elo"]) // 2,
                       "f": C.features(b), "m": m}, separators=(",", ":"))


def main():
    workers = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    tmp = C.INDEX.with_name(C.INDEX.name + ".tmp")
    kept = total = 0
    with open(C.POOL, encoding="utf-8") as src, open(tmp, "w", encoding="utf-8") as out, mp.Pool(workers) as pool:
        for res in pool.imap(work, src, chunksize=200):
            total += 1
            if res:
                out.write(res + "\n")
                kept += 1
            if total % 20000 == 0:
                print(total, kept, flush=True)
    tmp.replace(C.INDEX)
    print(f"pool {total} positions, index {kept} calm positions -> {C.INDEX}")


if __name__ == "__main__":
    main()
