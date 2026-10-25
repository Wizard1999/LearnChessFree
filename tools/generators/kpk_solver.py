"""Exact K+P v K solver (White pawn), used ONLY to search for teaching positions. The learner-facing claims are the Lichess
tablebase claims checked by tools/validate.py; this solver just finds candidates quickly (and a disagreement between the
two is reported by the pre-check in gen_kpk.py).

Algorithm: classic retrograde fixed point over (white king, black king, pawn square 8..55, side to move) = 196,608 positions
per side. Immediate results: pawn on the 7th that promotes without being captured = win (an under-promotion is assumed
available if a queen would stalemate); Black to move with no free square, or able to capture an undefended pawn = draw.
Iterate "White wins if some move reaches a won position; Black draws if some move reaches a drawn position" to a fixed point.

    from kpk_solver import solve, white_moves, black_moves, UNKNOWN, INVALID, DRAW, WIN
"""
from __future__ import annotations

import chess

UNKNOWN, INVALID, DRAW, WIN = 0, 1, 2, 3

KN = [[t for t in range(64) if t != s and chess.square_distance(s, t) == 1] for s in range(64)]
KNS = [frozenset(x) for x in KN]


def _pa(p):
    f = p & 7
    out = set()
    if p + 8 < 64:
        if f > 0:
            out.add(p + 7)
        if f < 7:
            out.add(p + 9)
    return frozenset(out)


PA = [_pa(p) for p in range(64)]
DIST = chess.square_distance


def idx(wk, bk, p):
    return ((p - 8) * 64 + wk) * 64 + bk


_TABLES = None


def solve():
    global _TABLES
    if _TABLES is not None:
        return _TABLES
    n = 48 * 64 * 64
    resW = bytearray(n)
    resB = bytearray(n)
    for p in range(8, 56):
        for wk in range(64):
            for bk in range(64):
                i = idx(wk, bk, p)
                if wk == bk or wk == p or bk == p or bk in KNS[wk]:
                    resW[i] = resB[i] = INVALID
                    continue
                # White to move
                if bk in PA[p]:
                    resW[i] = INVALID
                else:
                    if p >= 48 and wk != p + 8 and (DIST(bk, p + 8) > 1 or DIST(wk, p + 8) == 1):
                        resW[i] = WIN
                # Black to move
                free = [t for t in KN[bk] if t not in KNS[wk] and t not in PA[p]]
                if not free:
                    resB[i] = WIN if bk in PA[p] else DRAW
                elif p in KNS[bk] and p not in KNS[wk]:
                    resB[i] = DRAW
    changed = True
    while changed:
        changed = False
        for p in range(8, 56):
            for wk in range(64):
                kw = KN[wk]
                for bk in range(64):
                    i = idx(wk, bk, p)
                    if resW[i] == UNKNOWN:
                        any_win = any_unk = False
                        kb = KNS[bk]
                        for t in kw:
                            if t == p or t == bk or t in kb:
                                continue
                            r = resB[idx(t, bk, p)]
                            if r == WIN:
                                any_win = True
                                break
                            if r == UNKNOWN:
                                any_unk = True
                        if not any_win and p < 48 and p + 8 != wk and p + 8 != bk:
                            r = resB[idx(wk, bk, p + 8)]
                            if r == WIN:
                                any_win = True
                            elif r == UNKNOWN:
                                any_unk = True
                            if not any_win and p < 16 and p + 16 != wk and p + 16 != bk:
                                r = resB[idx(wk, bk, p + 16)]
                                if r == WIN:
                                    any_win = True
                                elif r == UNKNOWN:
                                    any_unk = True
                        if any_win:
                            resW[i] = WIN
                            changed = True
                        elif not any_unk:
                            resW[i] = DRAW
                            changed = True
                    if resB[i] == UNKNOWN:
                        any_draw = any_unk = False
                        for t in KN[bk]:
                            if t in KNS[wk] or t in PA[p] or t == p:
                                continue
                            r = resW[idx(wk, t, p)]
                            if r == DRAW:
                                any_draw = True
                                break
                            if r == UNKNOWN:
                                any_unk = True
                        if any_draw:
                            resB[i] = DRAW
                            changed = True
                        elif not any_unk:
                            resB[i] = WIN
                            changed = True
    for i in range(n):
        if resW[i] == UNKNOWN:
            resW[i] = DRAW
        if resB[i] == UNKNOWN:
            resB[i] = DRAW
    _TABLES = (resW, resB)
    return _TABLES


def result(wk, bk, p, white_to_move):
    rw, rb = solve()
    return (rw if white_to_move else rb)[idx(wk, bk, p)]


def white_moves(wk, bk, p):
    """[(uci, result_for_White_after_the_move)] for the pawn NOT on the 7th rank."""
    rw, rb = solve()
    out = []
    for t in KN[wk]:
        if t == p or t == bk or t in KNS[bk]:
            continue
        out.append((chess.square_name(wk) + chess.square_name(t), rb[idx(t, bk, p)]))
    if p < 48 and p + 8 != wk and p + 8 != bk:
        out.append((chess.square_name(p) + chess.square_name(p + 8), rb[idx(wk, bk, p + 8)]))
        if p < 16 and p + 16 != wk and p + 16 != bk:
            out.append((chess.square_name(p) + chess.square_name(p + 16), rb[idx(wk, bk, p + 16)]))
    return out


def black_moves(wk, bk, p):
    """[(uci, result_for_White_after_the_move)] (the black king's legal moves; capturing the undefended pawn = DRAW)."""
    rw, rb = solve()
    out = []
    for t in KN[bk]:
        if t in KNS[wk] or t in PA[p]:
            continue
        if t == p:
            out.append((chess.square_name(bk) + chess.square_name(t), DRAW))
        else:
            out.append((chess.square_name(bk) + chess.square_name(t), rw[idx(wk, t, p)]))
    return out


if __name__ == "__main__":
    import time
    t = time.time()
    solve()
    rw, rb = solve()
    print("solved in", round(time.time() - t, 1), "s;", "white-to-move wins:", rw.count(WIN), "draws:", rw.count(DRAW))
