"""lp2: find stalemate tricks. Lichess puzzle lines never end in the stalemating move, so the theme cannot be read from the
data. Instead: take equality / defensive endgames in which the solver is materially behind, search the shown position with the
engine (depth 16) and keep the puzzles whose engine principal variation (a) starts with the Lichess solution move and
(b) reaches a stalemate within 14 plies (the solver stalemates the opponent, or the opponent's forced move stalemates the solver).

Output: out/l2/hits_stale.pkl  (same tuple layout as l2_sample hits, bucket 'TAC.STALEMATE-TRICK', plus the PV in the dict stale_pv)
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import csv, pickle, time
from l2_common import *
from pool import run_pool

OUTP = L2_OUT / "hits_stale.pkl"


def material(b, c):
    return sum(VAL[p.piece_type] for p in b.piece_map().values() if p.color == c)


def candidates():
    rows = []
    with open_zst_text(PUZZLE_CSV) as fh:
        for row in csv.DictReader(fh):
            th = row["Themes"].split()
            if "equality" not in th and not ("defensiveMove" in th and "endgame" in th):
                continue
            try:
                rating = int(row["Rating"]); rd = int(row["RatingDeviation"]); plays = int(row["NbPlays"]); pop = int(row["Popularity"])
            except ValueError:
                continue
            q = quality(rating, rd, plays, pop)
            if q == 0:
                continue
            mv = row["Moves"].split()
            b = chess.Board(row["FEN"])
            try:
                b.push_uci(mv[0])
            except Exception:
                continue
            if not b.is_valid() or b.is_game_over() or len(b.piece_map()) > 9:
                continue
            behind = material(b, not b.turn) - material(b, b.turn)
            if "equality" in th:
                if behind < 2:
                    continue            # the solver must be at least two points behind
            elif len(b.piece_map()) > 8 or behind < 3:
                continue
            rows.append(dict(id=row["PuzzleId"], fen=row["FEN"], moves=mv, themes=th, rating=rating, rd=rd, plays=plays, pop=pop, q=q, fen_after=b.fen()))
    return rows


def scan(rec, eng, V):
    b = chess.Board(rec["fen_after"])
    res = eng.search(b.fen(), depth=16)
    pv = res[1]["pv"]
    if not pv or pv[0] != rec["moves"][1]:
        return dict(ok=False, id=rec["id"], why="engine differs")
    bb = b.copy()
    for i, u in enumerate(pv[:14]):
        mv = chess.Move.from_uci(u)
        if mv not in bb.legal_moves:
            break
        bb.push(mv)
        if bb.is_stalemate():
            # i even: the solver stalemates the opponent; i odd: the opponent's (forced) move stalemates the solver
            return dict(ok=True, id=rec["id"], pv=pv[: i + 1], plies=i + 1)
    return dict(ok=False, id=rec["id"], why="no stalemate in the engine line")


def main():
    t0 = time.time()
    rows = candidates()
    print(f"{len(rows)} candidate equality endgames ({time.time() - t0:.0f}s)", flush=True)
    by = {r["id"]: r for r in rows}
    out = run_pool(scan, rows, workers=6)
    hits = []
    for r in out:
        if r.get("ok"):
            rec = by[r["id"]]
            hits.append(("TAC.STALEMATE-TRICK", rec["id"], rec["fen"], " ".join(rec["moves"]), " ".join(sorted(rec["themes"])), rec["rating"], rec["rd"],
                         rec["plays"], rec["pop"], rec["q"], r["plies"], rec["fen_after"]))
    OUTP.write_bytes(pickle.dumps(hits))
    print(f"{len(hits)} stalemate lines found in {time.time() - t0:.0f}s", flush=True)


if __name__ == "__main__":
    main()
