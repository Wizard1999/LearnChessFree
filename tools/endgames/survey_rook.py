"""Exploration helper (not a generator): enqueue random rook-ending placements so that their tablebase results can be inspected.

    ./tools/.venv/Scripts/python.exe -I tools/endgames/survey_rook.py enqueue lucena 150      # pass 1
    ./tools/.venv/Scripts/python.exe -I tools/endgames/survey_rook.py report lucena 150       # pass 2 (after the daemon fetched them)
The results are used by hand to choose parameter ranges for gen_rook.py; nothing here ships.
"""
import random, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import chess
import tb
import gen_rook as G
from collections import Counter
sqr = chess.square


def lucena_family(rng):
    f = rng.choice([0, 1, 2, 3, 4, 5, 6, 7])
    wk, p = sqr(f, 7), sqr(f, 6)
    bkf = max(0, min(7, f + rng.choice([-4, -3, -2, 2, 3, 4])))
    bk = sqr(bkf, rng.choice([5, 6, 7]))
    wr = sqr(rng.randrange(8), rng.randrange(0, 5))
    br = sqr(rng.randrange(8), rng.choice([0, 1, 2, 3, 4, 5, 6, 7]))
    return G.put([(wk, G.KING, True), (p, G.PAWN, True), (wr, G.ROOK, True), (bk, G.KING, False), (br, G.ROOK, False)], rng.random() < 0.7), f


def main():
    mode, fam, n = sys.argv[1], sys.argv[2], int(sys.argv[3])
    rng = random.Random(777)
    boards = []
    while len(boards) < n:
        b, f = lucena_family(rng)
        if b is None or b.is_check() or not G._rooks_ok(b):
            continue
        boards.append((b, f))
    if mode == "enqueue":
        print("queued", tb.enqueue([b.fen() for b, _ in boards], "survey-" + fam, 1))
    else:
        cnt = Counter()
        show = []
        for b, f in boards:
            r = tb.result(b.fen(), pure=False)
            if r is None:
                cnt["pending"] += 1
                continue
            kind = "rookpawn" if f in (0, 7) else "knightpawn" if f in (1, 6) else "central"
            cnt[(kind, "W" if b.turn else "B", r)] += 1
            if r != "win" and b.turn:
                show.append(b.fen() + "  " + r)
        for k, v in sorted(cnt.items(), key=str):
            print(k, v)
        print("\n".join(show[:25]))


main()
