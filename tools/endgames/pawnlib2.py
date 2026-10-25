"""Locked-pawn candidate finders (zugzwang, triangulation, distant opposition) on top of lockedkp (exact local solver).

Nothing here is learner-facing; the tablebase decides what ships. All functions are deterministic given the rng they are handed.
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chess  # noqa: E402

import lockedkp as L  # noqa: E402
from pawnlib import D, F, R, locked_cells, mutual_zugzwang_placements, locked_move_results  # noqa: E402,F401


def _natural(wp, wk, bk, kd=3):
    return D(wk, wp) <= kd and D(bk, wp) <= kd and D(wk, wp + 8) >= 1 and D(bk, wp) >= 1


def locked_ok(wp, wk, bk, wtm):
    if L.result_locked(wp, wk, bk, wtm) == L.LINVALID:
        return False
    b = L.board_locked(wp, wk, bk, wtm)
    return b.is_valid() and not b.is_check()


def _one_per_cell(rng, cand, n, key=lambda c: c[0]):
    rng.shuffle(cand)
    out, seen = [], set()
    for c in cand:
        k = key(c)
        if k in seen:
            continue
        seen.add(k)
        out.append(c)
        if len(out) >= n:
            break
    return out


def find_mutual_pairs(rng, n, cells=None):
    """One mutual-zugzwang placement per pawn cell. Returns [(wp, wk, bk)]."""
    out = []
    cells = list(cells or locked_cells(ranks=(2, 3, 4)))
    rng.shuffle(cells)
    for wp in cells:
        pl_ = mutual_zugzwang_placements(wp)
        pl_ = [x for x in pl_ if locked_ok(wp, x[0], x[1], True) and locked_ok(wp, x[0], x[1], False)]
        if pl_:
            wk, bk = rng.choice(pl_)
            out.append((wp, wk, bk))
        if len(out) >= n:
            break
    return out


def find_locked_who_moves(rng, n, kd=3):
    """Locked pawns, same placement, the side to move decides: results differ. Returns [(wp, wk, bk, resW, resB)]."""
    cand = []
    for wp in locked_cells(ranks=(2, 3, 4)):
        res, _ = L.solve_locked(wp)
        for wk in range(64):
            for bk in range(64):
                if not _natural(wp, wk, bk, kd) or D(wk, bk) <= 1 or D(wk, bk) > 4:
                    continue
                a, b = res[L.idx(wk, bk, True)], res[L.idx(wk, bk, False)]
                if a in (L.LINVALID, L.LU) or b in (L.LINVALID, L.LU) or a == b:
                    continue
                if not (locked_ok(wp, wk, bk, True) and locked_ok(wp, wk, bk, False)):
                    continue
                cand.append((wp, wk, bk, a, b))
    return _one_per_cell(rng, cand, n)


def find_locked_put_in_zugzwang(rng, n):
    """White to move wins; the only winning move leaves Black to move in a mutual-zugzwang placement. Returns [(wp, wk, bk, uci)]."""
    cand = []
    for wp in locked_cells(ranks=(2, 3, 4)):
        res, _ = L.solve_locked(wp)
        bp = wp + 8
        mz = {(a, b) for a, b in mutual_zugzwang_placements(wp)}
        for wk in range(64):
            for bk in range(64):
                if (wk, bk) in mz or not _natural(wp, wk, bk, 4) or not locked_ok(wp, wk, bk, True):
                    continue
                if res[L.idx(wk, bk, True)] != L.LW:
                    continue
                mr = locked_move_results(wp, wk, bk, True)
                win = [m for m, v in mr.items() if v == L.LW]
                if len(win) != 1 or len(mr) < 5:
                    continue
                m = chess.Move.from_uci(win[0])
                if (m.to_square, bk) in mz:
                    cand.append((wp, wk, bk, win[0]))
    return _one_per_cell(rng, cand, n)


def find_locked_only_hold(rng, n, stm_white=False):
    """Side to move can hold the draw with exactly one move; at least three moves lose. Returns [(wp, wk, bk, uci)]."""
    cand = []
    for wp in locked_cells(ranks=(2, 3, 4)):
        res, _ = L.solve_locked(wp)
        for wk in range(64):
            for bk in range(64):
                if not _natural(wp, wk, bk, 3) or D(wk, bk) <= 1 or not locked_ok(wp, wk, bk, stm_white):
                    continue
                if res[L.idx(wk, bk, stm_white)] != L.LD:
                    continue
                mr = locked_move_results(wp, wk, bk, stm_white)
                lose_val = L.LB if stm_white else L.LW
                hold = [m for m, v in mr.items() if v == L.LD]
                lose = [m for m, v in mr.items() if v == lose_val]
                if len(hold) == 1 and len(lose) >= 3:
                    cand.append((wp, wk, bk, hold[0]))
    return _one_per_cell(rng, cand, n)


def triangulation_certificate(wp, wk, bk):
    """White to move in the locked family. If White's only winning move is a king step a->b and a single third square c exists such that,
    whatever Black replies, White's only winning continuation is b->c and then (whatever Black replies) c->a, return (b, c); else None.
    Together with a first step that does not approach the enemy king this is a king triangle a-b-c that loses a tempo."""
    res, _ = L.solve_locked(wp)
    bp = wp + 8
    if res[L.idx(wk, bk, True)] != L.LW:
        return None
    mr = locked_move_results(wp, wk, bk, True)
    win = [m for m, v in mr.items() if v == L.LW]
    if len(win) != 1:
        return None
    m1 = chess.Move.from_uci(win[0])
    a, b = wk, m1.to_square
    if b == bp or m1.from_square != wk:
        return None
    bb = L.board_locked(wp, b, bk, False)
    cs = None
    for r1 in bb.legal_moves:
        k1 = r1.to_square
        if bb.piece_at(k1) is not None:
            return None
        mr2 = locked_move_results(wp, b, k1, True)
        win2 = [m for m, v in mr2.items() if v == L.LW]
        cands = [chess.Move.from_uci(m).to_square for m in win2
                 if chess.Move.from_uci(m).from_square == b and D(chess.Move.from_uci(m).to_square, a) == 1
                 and chess.Move.from_uci(m).to_square != a]
        if not cands:
            return None
        if cs is None:
            opts = set(cands)
        else:
            opts = {cs} & set(cands)
            if not opts:
                return None
        cs = sorted(opts)[0]
        bb2 = L.board_locked(wp, cs, k1, False)
        for r2 in bb2.legal_moves:
            k2 = r2.to_square
            if bb2.piece_at(k2) is not None:
                return None
            mr3 = locked_move_results(wp, cs, k2, True)
            if mr3.get(chess.Move(cs, a).uci()) != L.LW:
                return None
    if cs is None:
        return None
    return (b, cs)


_TRI_CACHE = {}


def all_triangulations(loose=True):
    if loose in _TRI_CACHE:
        return _TRI_CACHE[loose]
    cand = []
    for wp in locked_cells(files=range(0, 8), ranks=(1, 2, 3, 4, 5)) if loose else locked_cells(ranks=(2, 3, 4)):
        for wk in range(64):
            for bk in range(64):
                if D(wk, bk) <= 1 or not locked_ok(wp, wk, bk, True):
                    continue
                if not loose and not _natural(wp, wk, bk, 4):
                    continue
                if L.result_locked(wp, wk, bk, True) != L.LW:
                    continue
                cert = triangulation_certificate(wp, wk, bk)
                if cert:
                    b, c = cert
                    if loose or D(b, bk) >= D(wk, bk):
                        cand.append((wp, wk, bk, b, c, chess.Move(wk, b).uci()))
    _TRI_CACHE[loose] = cand
    return cand


def find_triangulations(rng, n, loose=True):
    """Locked-pawn positions where White wins by a forced king triangle (one per pawn cell). Returns (list, total_found).
    loose=True drops the 'natural zone' and 'first step does not approach' filters (the certificate itself is the standard)."""
    cand = list(all_triangulations(loose))
    return _one_per_cell(rng, cand, n), len(cand)


def dist_opposition_after(b, move_uci):
    """After the move: kings on one file or rank with an even gap of 4 or more (3+ squares between)? 'file' / 'rank' / None."""
    nb = b.copy()
    nb.push(chess.Move.from_uci(move_uci))
    a, c = nb.king(chess.WHITE), nb.king(chess.BLACK)
    if F(a) == F(c) and abs(R(a) - R(c)) >= 4 and abs(R(a) - R(c)) % 2 == 0:
        return "file"
    if R(a) == R(c) and abs(F(a) - F(c)) >= 4 and abs(F(a) - F(c)) % 2 == 0:
        return "rank"
    return None


def find_distant(rng, n, stm_white=True):
    """Locked pawns; the side to move has exactly one move that keeps the result (win for White / draw for Black) and that move puts the
    kings in distant opposition (same file or rank, even gap >= 4, opponent to move), which they were not in before. Both kings within 4
    of the pawn. Returns ([(wp, wk, bk, uci, kind)], total_found)."""
    cand = []
    for wp in locked_cells(ranks=(2, 3, 4)):
        res, _ = L.solve_locked(wp)
        for wk in range(64):
            for bk in range(64):
                if not _natural(wp, wk, bk, 4) or D(wk, bk) <= 1 or not locked_ok(wp, wk, bk, stm_white):
                    continue
                r = res[L.idx(wk, bk, stm_white)]
                want = L.LW if stm_white else L.LD
                if r != want:
                    continue
                mr = locked_move_results(wp, wk, bk, stm_white)
                keep = [m for m, v in mr.items() if v == want]
                if len(keep) != 1 or len(mr) < 4:
                    continue
                b = L.board_locked(wp, wk, bk, stm_white)
                already = (F(wk) == F(bk) and abs(R(wk) - R(bk)) % 2 == 0) or (R(wk) == R(bk) and abs(F(wk) - F(bk)) % 2 == 0)
                kind = dist_opposition_after(b, keep[0])
                if kind and not already:
                    cand.append((wp, wk, bk, keep[0], kind))
    total = len(cand)
    if n is None:                       # every certified position, not one per pawn cell
        return cand, total
    return _one_per_cell(rng, cand, n), total


# ----------------------------------------------------------------------------------------------------------------
# K+P v K: forced king triangle (same certificate as the locked family)
# ----------------------------------------------------------------------------------------------------------------
import kpk_solver as ks  # noqa: E402


def _kp_win_moves(wk, bk, p):
    mv = ks.white_moves(wk, bk, p)
    return [m for m, r in mv if r == ks.WIN], mv


def kpk_triangulation_certificate(wk, bk, p):
    if ks.result(wk, bk, p, True) != ks.WIN:
        return None
    win, mv = _kp_win_moves(wk, bk, p)
    if len(win) != 1:
        return None
    m1 = chess.Move.from_uci(win[0])
    if m1.from_square != wk:
        return None
    a, b = wk, m1.to_square
    cs = None
    reps = ks.black_moves(b, bk, p)
    if not reps:
        return None
    for (u, r) in reps:
        k1 = chess.Move.from_uci(u).to_square
        if k1 == p or r != ks.WIN:
            return None
        w2, _ = _kp_win_moves(b, k1, p)
        cands = [chess.Move.from_uci(x).to_square for x in w2
                 if chess.Move.from_uci(x).from_square == b and D(chess.Move.from_uci(x).to_square, a) == 1 and chess.Move.from_uci(x).to_square != a]
        if not cands:
            return None
        opts = set(cands) if cs is None else ({cs} & set(cands))
        if not opts:
            return None
        cs = sorted(opts)[0]
        for (u2, r2) in ks.black_moves(cs, k1, p):
            k2 = chess.Move.from_uci(u2).to_square
            if k2 == p or r2 != ks.WIN:
                return None
            w3, _ = _kp_win_moves(cs, k2, p)
            if chess.Move(cs, a).uci() not in w3:
                return None
    return (b, cs)


def find_kpk_triangulations(rng, n):
    cand = []
    for p in range(8, 56):
        if F(p) in (0, 7) or R(p) < 2 or R(p) > 5:
            continue
        for wk in range(64):
            if D(wk, p) > 4:
                continue
            for bk in range(64):
                if D(bk, p) > 4 or D(wk, bk) <= 1 or ks.result(wk, bk, p, True) == ks.INVALID:
                    continue
                c = kpk_triangulation_certificate(wk, bk, p)
                if c:
                    cand.append((p, wk, bk, c[0], c[1], chess.Move(wk, c[0]).uci()))
    total = len(cand)
    if n is None:                       # every certified position, not one per pawn cell
        return cand, total
    return _one_per_cell(rng, cand, n), total
