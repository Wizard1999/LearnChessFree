"""Candidate finders for pawn endings, built on the two local exact solvers (K+P v K and locked K+P v K+P).

Everything here is deterministic given the rng it is handed. Nothing here is learner-facing: the tablebase decides what ships.
White-pawn coordinates are used throughout; `orient()` applies a random colour flip / left-right mirror to a candidate (and to its
partner boards) so the bank does not only contain 'White queens up the board'.
"""
from __future__ import annotations

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(HERE.parent / "generators"))

import chess  # noqa: E402

import kpk_solver as ks  # noqa: E402
import lockedkp as L  # noqa: E402
import egcommon as E  # noqa: E402

F, R, D = chess.square_file, chess.square_rank, chess.square_distance
ks.solve()

_KEY = {}


def keysq(p):
    """Strict key squares of a WHITE pawn on p: squares where a white king wins whoever moves and wherever the black king stands
    (positions in which the black king takes an undefended pawn at once are not counted against the square)."""
    if p in _KEY:
        return _KEY[p]
    out = []
    for wk in range(64):
        if wk == p:
            continue
        ok = True
        for bk in range(64):
            if bk == wk or bk == p or D(bk, wk) <= 1:
                continue
            for wtm in (True, False):
                r = ks.result(wk, bk, p, wtm)
                if r == ks.INVALID:
                    continue
                if (not wtm) and D(bk, p) <= 1 and D(wk, p) > 1:
                    continue
                if r != ks.WIN:
                    ok = False
                    break
            if not ok:
                break
        if ok:
            out.append(wk)
    _KEY[p] = out
    return out


def kp_board(wk, bk, p, wtm):
    b = E.make("", wtm)
    b.set_piece_at(wk, chess.Piece(chess.KING, chess.WHITE))
    b.set_piece_at(bk, chess.Piece(chess.KING, chess.BLACK))
    b.set_piece_at(p, chess.Piece(chess.PAWN, chess.WHITE))
    b.turn = chess.WHITE if wtm else chess.BLACK
    return b


def kp_valid(wk, bk, p, wtm):
    if ks.result(wk, bk, p, wtm) == ks.INVALID:
        return False
    return kp_board(wk, bk, p, wtm).is_valid()


def orient(boards, rng, allow_flip=True, allow_mirror=True):
    """Apply one random symmetry to every board of a candidate. Returns (boards, kind)."""
    flip = allow_flip and rng.random() < 0.5
    mir = allow_mirror and rng.random() < 0.5
    out = []
    for b in boards:
        x = b
        if mir:
            x = E.mirror(x)
        if flip:
            x = E.flip(x)
        x.castling_rights = 0
        x.ep_square = None
        out.append(x)
    return out, ("flip" if flip else "") + ("mirror" if mir else "") or "orig"


# ----------------------------------------------------------------------------------------------------------------
# K+P v K candidate finders
# ----------------------------------------------------------------------------------------------------------------
def white_winning_moves(wk, bk, p):
    mv = ks.white_moves(wk, bk, p)
    return [m for m, r in mv if r == ks.WIN], [m for m, r in mv if r != ks.WIN], mv


def find_reach_key(rng, n, ranks=(2, 3, 4), files=range(1, 7)):
    """White to move, K+P v K. The only winning move is a king step onto a key square of the pawn.
    Returns [(wk, bk, p, winning_uci)]; at most one per pawn square."""
    out = []
    cells = [(f, r) for f in files for r in ranks]
    rng.shuffle(cells)
    for f, r in cells:
        p = chess.square(f, r)
        keys = set(keysq(p))
        cand = []
        for wk in range(64):
            if wk in keys or D(wk, p) > 3 or wk == p:
                continue
            for bk in range(64):
                if D(bk, p) > 3 or D(bk, p) < 2 or bk == p or D(bk, wk) <= 1:
                    continue
                if ks.result(wk, bk, p, True) != ks.WIN:
                    continue
                win, bad, mv = white_winning_moves(wk, bk, p)
                if len(win) != 1 or len(mv) < 5 or len(bad) < 3:
                    continue
                m = chess.Move.from_uci(win[0])
                if m.from_square != wk or m.to_square not in keys:
                    continue
                if not kp_valid(wk, bk, p, True):
                    continue
                cand.append((wk, bk, p, win[0]))
        if cand:
            out.append(rng.choice(cand))
        if len(out) >= n:
            break
    return out


def find_key_vs_short(rng, n, ranks=(3, 4), files=range(1, 7)):
    """Pairs for 'key square reached or not': Black to move, same black king; white king on a key square (win) versus one step away on a
    non-key square (draw). Returns [(p, bk, s_key, s_short)]."""
    out = []
    cells = [(f, r) for f in files for r in ranks]
    rng.shuffle(cells)
    for f, r in cells:
        p = chess.square(f, r)
        keys = set(keysq(p))
        cand = []
        for s1 in keys:
            for s0 in ks.KN[s1]:
                if s0 in keys or s0 == p or D(s0, p) > 3:
                    continue
                for bk in range(64):
                    if bk == p or D(bk, p) > 2 or D(bk, s1) <= 1 or D(bk, s0) <= 1:
                        continue
                    if not (kp_valid(s1, bk, p, False) and kp_valid(s0, bk, p, False)):
                        continue
                    if ks.result(s1, bk, p, False) == ks.WIN and ks.result(s0, bk, p, False) == ks.DRAW:
                        cand.append((p, bk, s1, s0))
        if cand:
            out.append(rng.choice(cand))
        if len(out) >= n:
            break
    return out


def find_rook_vs_central(rng, n):
    """Pairs 'same arrangement, rook pawn versus central pawn': a-file pawn drawn, the same picture shifted three files right (d-file)
    won, White to move, white king ahead of the pawn. Returns [(p_a, wk_a, bk_a, shift)] with shift = 3 (files)."""
    out = []
    cand = []
    for r in (3, 4, 5):
        pa = chess.square(0, r)
        for wk in range(64):
            if F(wk) > 3 or R(wk) < r + 1 or D(wk, pa) > 2:
                continue
            for bk in range(64):
                if F(bk) > 3 or R(bk) < r + 1 or D(bk, pa) > 4 or D(bk, wk) <= 1 or bk == pa:
                    continue
                s = 3
                wk2, bk2, p2 = wk + s, bk + s, pa + s
                if not (kp_valid(wk, bk, pa, True) and kp_valid(wk2, bk2, p2, True)):
                    continue
                if ks.result(wk, bk, pa, True) == ks.DRAW and ks.result(wk2, bk2, p2, True) == ks.WIN:
                    cand.append((pa, wk, bk, s))
    rng.shuffle(cand)
    seen = set()
    for c in cand:
        key = (R(c[0]), R(c[1]))
        if key in seen:
            continue
        seen.add(key)
        out.append(c)
        if len(out) >= n:
            break
    return out


def find_who_moves(rng, n, ranks=(3, 4), files=range(1, 7)):
    """Same placement, the side to move decides: returns [(p, wk, bk, white_wins_with_white_to_move)]"""
    out = []
    cells = [(f, r) for f in files for r in ranks]
    rng.shuffle(cells)
    for f, r in cells:
        p = chess.square(f, r)
        cand = []
        for wk in range(64):
            if D(wk, p) > 2 or wk == p:
                continue
            for bk in range(64):
                if D(bk, p) > 3 or bk == p or D(bk, wk) <= 1 or D(bk, wk) > 3:
                    continue
                if not (kp_valid(wk, bk, p, True) and kp_valid(wk, bk, p, False)):
                    continue
                rw, rb = ks.result(wk, bk, p, True), ks.result(wk, bk, p, False)
                if rw == ks.WIN and rb == ks.DRAW:
                    cand.append((p, wk, bk, True))
                elif rw == ks.DRAW and rb == ks.WIN:
                    cand.append((p, wk, bk, False))
        if cand:
            out.append(rng.choice(cand))
        if len(out) >= n:
            break
    return out


# ----------------------------------------------------------------------------------------------------------------
# locked K+P v K+P
# ----------------------------------------------------------------------------------------------------------------
def locked_cells(files=range(1, 7), ranks=(3, 4)):
    """White pawn squares (white pawn on the 4th or 5th rank by default, black pawn directly in front)."""
    return [chess.square(f, r) for f in files for r in ranks]


def mutual_zugzwang_placements(wp):
    """[(wk, bk)] where White to move loses AND Black to move loses (both kings active, not touching the pawns)."""
    res, _ = L.solve_locked(wp)
    bp = wp + 8
    out = []
    for wk in range(64):
        for bk in range(64):
            if D(wk, wp) < 1 or D(bk, wp) < 1:
                continue
            if D(wk, wp) > 3 or D(bk, wp) > 3 and D(bk, bp) > 3:
                continue
            a, b = res[L.idx(wk, bk, True)], res[L.idx(wk, bk, False)]
            if a == L.LB and b == L.LW:
                bd = L.board_locked(wp, wk, bk, True)
                if bd.is_valid() and not bd.is_check() and not L.board_locked(wp, wk, bk, False).is_check():
                    out.append((wk, bk))
    return out


def locked_move_results(wp, wk, bk, wtm):
    """{uci: LW/LB/LD after the move} for every legal move, or None if a move leaves the locked family (a capture)."""
    res, _ = L.solve_locked(wp)
    bp = wp + 8
    b = L.board_locked(wp, wk, bk, wtm)
    out = {}
    for m in b.legal_moves:
        if b.piece_at(m.to_square) is not None:
            # capture of the enemy pawn: value from the K+P v K table
            kind = "w" if wtm else "b"
            nwk, nbk = (m.to_square, bk) if wtm else (wk, m.to_square)
            out[m.uci()] = L._capture_value(wp, bp, nwk, nbk, kind)
        else:
            nwk, nbk = (m.to_square, bk) if wtm else (wk, m.to_square)
            out[m.uci()] = res[L.idx(nwk, nbk, not wtm)]
    return out
