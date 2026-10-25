"""Exact solver for K+P v K+P with the two pawns LOCKED head to head (white pawn on wp, black pawn on wp+8; neither can move).

Used ONLY to search for teaching positions quickly (mutual zugzwang, triangulation, corresponding squares). The learner-facing claims are
Lichess tablebase claims checked by tools/validate.py; tools/endgames/crosscheck.py compares this solver with the tablebase.

A king may capture the enemy pawn (if the pawn is not protected by the enemy king); that leads to K+P v K, solved by
tools/generators/kpk_solver.py. Results are given from White's point of view: W (White wins), B (Black wins), D (draw).

    from lockedkp import solve_locked, LW, LB, LD, LINVALID, moves_locked
"""
from __future__ import annotations

import sys
from pathlib import Path

import chess

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "generators"))
import kpk_solver as ks  # noqa: E402

LU, LINVALID, LD, LW, LB = 0, 1, 2, 3, 4

KN = ks.KN
KNS = ks.KNS


def _wp_attacks(wp):
    f = wp & 7
    out = set()
    if f > 0:
        out.add(wp + 7)
    if f < 7:
        out.add(wp + 9)
    return out


def _bp_attacks(bp):
    f = bp & 7
    out = set()
    if f > 0:
        out.add(bp - 9)
    if f < 7:
        out.add(bp - 7)
    return out


_cache = {}


def idx(wk, bk, wtm):
    return (wk * 64 + bk) * 2 + (1 if wtm else 0)


def _capture_value(wp, bp, wk, bk, who):
    """Result (from White's POV: LW/LB/LD) after `who` ('w' or 'b') captures. wk, bk are the NEW king squares (the capturing king is on
    the captured pawn's square)."""
    if who == "w":                      # white king took the black pawn; black to move; white pawn on wp
        r = ks.result(wk, bk, wp, False)
        return LW if r == ks.WIN else LD
    # black king took the white pawn; white to move; black pawn on bp; flip the board for the kpk solver
    r = ks.result(bk ^ 56, wk ^ 56, bp ^ 56, False)   # flipped white = original black ; it is the flipped-"black" (orig white) to move
    return LB if r == ks.WIN else LD


def solve_locked(wp):
    """res[idx(wk, bk, wtm)] for the locked pair (wp, wp+8). wp in 8..47."""
    if wp in _cache:
        return _cache[wp]
    bp = wp + 8
    wpa, bpa = _wp_attacks(wp), _bp_attacks(bp)
    res = [LU] * (64 * 64 * 2)
    moves = {}                           # idx -> list of (kind, target idx or terminal value)
    for wk in range(64):
        for bk in range(64):
            for wtm in (True, False):
                i = idx(wk, bk, wtm)
                if wk == bk or wk in (wp, bp) or bk in (wp, bp) or bk in KNS[wk]:
                    res[i] = LINVALID
                    continue
                # the side NOT to move must not be in check
                if wtm and bk in wpa:
                    res[i] = LINVALID
                    continue
                if (not wtm) and wk in bpa:
                    res[i] = LINVALID
                    continue
                lst = []
                if wtm:
                    for t in KN[wk]:
                        if t == wp or t in KNS[bk] or t in bpa:
                            continue
                        if t == bp:
                            lst.append(("t", _capture_value(wp, bp, t, bk, "w")))
                        else:
                            lst.append(("p", idx(t, bk, False)))
                    in_check = wk in bpa
                else:
                    for t in KN[bk]:
                        if t == bp or t in KNS[wk] or t in wpa:
                            continue
                        if t == wp:
                            lst.append(("t", _capture_value(wp, bp, wk, t, "b")))
                        else:
                            lst.append(("p", idx(wk, t, True)))
                    in_check = bk in wpa
                if not lst:
                    res[i] = (LB if wtm else LW) if in_check else LD      # mate (by a pawn check) or stalemate
                    continue
                moves[i] = lst
    changed = True
    while changed:
        changed = False
        for i, lst in moves.items():
            if res[i] != LU:
                continue
            wtm = bool(i & 1)
            me_win, opp_win = (LW, LB) if wtm else (LB, LW)
            any_unknown = False
            all_opp = True
            win = False
            for kind, v in lst:
                val = v if kind == "t" else res[v]
                if val == me_win:
                    win = True
                    break
                if val == LU:
                    any_unknown = True
                    all_opp = False
                elif val != opp_win:
                    all_opp = False
            if win:
                res[i] = me_win
                changed = True
            elif all_opp and not any_unknown:
                res[i] = opp_win
                changed = True
    for i in range(len(res)):
        if res[i] == LU:
            res[i] = LD
    _cache[wp] = (res, moves)
    return _cache[wp]


def result_locked(wp, wk, bk, wtm):
    res, _ = solve_locked(wp)
    return res[idx(wk, bk, wtm)]


def mover_view(r, wtm):
    """'win'/'draw'/'loss' for the side to move from a LW/LB/LD value."""
    if r == LD:
        return "draw"
    if (r == LW) == wtm:
        return "win"
    return "loss"


def board_locked(wp, wk, bk, wtm):
    b = chess.Board(None)
    b.castling_rights = 0
    b.set_piece_at(wk, chess.Piece(chess.KING, chess.WHITE))
    b.set_piece_at(bk, chess.Piece(chess.KING, chess.BLACK))
    b.set_piece_at(wp, chess.Piece(chess.PAWN, chess.WHITE))
    b.set_piece_at(wp + 8, chess.Piece(chess.PAWN, chess.BLACK))
    b.turn = chess.WHITE if wtm else chess.BLACK
    return b


if __name__ == "__main__":
    import time
    t = time.time()
    r, _ = solve_locked(chess.parse_square("e5"))
    from collections import Counter
    print(Counter(r), round(time.time() - t, 2), "s")
