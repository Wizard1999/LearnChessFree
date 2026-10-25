"""Cross-check the local exact solvers (kpk_solver, lockedkp) against the Lichess tablebase on random samples.

    ./tools/.venv/Scripts/python.exe -I tools/endgames/crosscheck.py [n_kpk] [n_locked]

Prints the number of positions compared and the number of disagreements (must be 0 for the generators' candidate search to be trusted;
the learner-facing claims are tablebase claims regardless)."""
import sys, random
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import chess
import tb
import lockedkp as L
import kpk_solver as ks

def kpk_sample(n, rng):
    out = []
    while len(out) < n:
        p = rng.randrange(8, 56); wk = rng.randrange(64); bk = rng.randrange(64); wtm = rng.random() < 0.5
        r = ks.result(wk, bk, p, wtm)
        if r == ks.INVALID: continue
        b = chess.Board(None); b.castling_rights = 0
        b.set_piece_at(wk, chess.Piece(chess.KING, chess.WHITE)); b.set_piece_at(bk, chess.Piece(chess.KING, chess.BLACK)); b.set_piece_at(p, chess.Piece(chess.PAWN, chess.WHITE))
        b.turn = chess.WHITE if wtm else chess.BLACK
        if not b.is_valid(): continue
        out.append((b, "win" if (r == ks.WIN and wtm) else "loss" if (r == ks.WIN and not wtm) else "draw"))
    return out

def locked_sample(n, rng):
    out = []
    while len(out) < n:
        wp = rng.randrange(16, 40); wk = rng.randrange(64); bk = rng.randrange(64); wtm = rng.random() < 0.5
        r = L.result_locked(wp, wk, bk, wtm)
        if r == L.LINVALID: continue
        b = L.board_locked(wp, wk, bk, wtm)
        if not b.is_valid(): continue
        out.append((b, L.mover_view(r, wtm)))
    return out

if __name__ == "__main__":
    n1 = int(sys.argv[1]) if len(sys.argv) > 1 else 20
    n2 = int(sys.argv[2]) if len(sys.argv) > 2 else 20
    rng = random.Random(7)
    bad = 0; tot = 0; missing = 0
    for name, smp in (("kpk", kpk_sample(n1, rng)), ("locked", locked_sample(n2, rng))):
        tb.enqueue([b.fen() for b, _ in smp], "crosscheck-" + name, prio=1)
        mism = []
        for b, want in smp:
            got = tb.result(b.fen(), pure=False)
            if got is None:
                missing += 1
                continue
            tot += 1
            if got != want:
                mism.append((b.fen(), want, got))
        print(name, len(smp), "sampled;", len(mism), "disagreements", mism[:5])
        bad += len(mism)
    print("TOTAL", tot, "compared,", bad, "disagreements;", missing, "not fetched yet (run again later)")
