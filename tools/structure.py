"""Exact pawn-structure and piece-placement facts computed with python-chess (no engine, no heuristics).

Used by tools/validate.py (the claim types `pawn_set`, `pawn_islands`, `open_files`, `holes`, `outposts`, `bishop_pair`,
`pawn_colours`, `mobility`, `king_pawn_shield`, `space`, `rooks_connected`, `piece_on`, `king_wing`, `moves_where`) and by
the item generators in tools/positional/. Every definition below is the definition the validator enforces; an item may only
say what its claim states. Where a definition is a simplification of the usual chess meaning, the simplification is spelled out.

Conventions
  * "relative rank" r(c, sq) counts from the colour's own back rank: 0 = own first rank ... 7 = enemy back rank
    (White: the rank index; Black: 7 - rank index). Relative rank n+1 in prose (rank 4 for White is r = 3).
  * Only pawns count as pawns: promotion, en passant and pins are ignored. Pawn "attacks" are the two diagonal squares in front,
    whether or not anything stands on them.
  * "Ahead" for colour c means a higher relative rank for c.
  * File letters are 'a'..'h'. Square names are UCI ('e4').

PAWN KINDS (pawn_set)
  passed        no enemy pawn on the same or an adjacent file with a higher relative rank (no enemy pawn can block or capture it
                by advancing); the enemy KING and pieces are ignored.
  isolated      no own pawn on either adjacent file (any rank).
  doubled       every pawn standing on a file that holds two or more own pawns.
  backward      a pawn that (1) has at least one own pawn on an adjacent file (so it is not isolated), (2) has no own pawn on an
                adjacent file at its own relative rank or lower (every neighbouring own pawn is strictly ahead of it), and (3) its
                stop square (the square directly in front) is attacked by an enemy pawn. Occupancy of the stop square is ignored.
  connected     an own pawn on an adjacent file whose relative rank differs by at most 1 (side by side, or one protects the other).
  protected     attacked ("defended") by at least one own pawn.
  protected_passed   passed and protected.
  connected_passed   passed and has another passed own pawn on an adjacent file with relative rank within 1.
  blockaded_passed   passed and its stop square holds an enemy non-pawn piece (a king counts).
  chain_base    an own pawn that defends at least one own pawn and is itself defended by no own pawn.
  hanging_pair  two own pawns on adjacent files and the same rank, that rank being the 4th or 5th relative rank, that are the only own
                pawns on those two files, with no own pawn on the file on either outer side, and no enemy pawn on either of the two
                files. Both pawns are returned.
  majority_side wings are files a-d (queenside) and e-h (kingside). The colour has a majority on a wing when it has strictly more
                pawns there than the opponent; every own pawn on a wing where it has a majority is returned.

OUTPOST (outposts): a square s is an outpost square for colour c when
  (1) its relative rank is 3, 4 or 5 (ranks 4-6 for White, ranks 5-3 for Black);
  (2) at least one own pawn defends it;
  (3) no enemy pawn attacks it now and no enemy pawn can attack it by advancing: there is no enemy pawn on an adjacent file whose
      relative rank (from c's view) is at least r(s) + 1. Captures that move an enemy pawn to another file are NOT considered (stated
      limit of the definition);
  (4) no pawn of either colour stands on s;
  plus an occupancy filter chosen by the claim: 'any' (no filter), 'empty' (no piece on s), 'own' (an own non-pawn piece on s),
  'not_own' (no own piece on s: empty or holding an enemy piece).

HOLE (holes): a square s in colour c's own camp is a hole when
  (1) its relative rank is 2, 3 or 4 (ranks 3-5 for White, ranks 6-4 for Black);
  (2) no own pawn attacks it now and none can attack it by advancing: there is no own pawn on an adjacent file with relative rank
      <= r(s) - 1;
  (3) no own pawn stands on s.
  (Pieces on s are ignored. A hole is a fact about c's pawns only; whether the enemy can use it is a separate question.)

OTHERS
  open_files      open = no pawn of either colour; half_open_white = no white pawn but at least one black pawn; half_open_black likewise.
  wing_pawns      number of own pawns on the queenside (files a-d) or the kingside (files e-h).
  pawn_islands    maximal runs of adjacent files that hold at least one own pawn.
  bishop_pair     a colour has it when it owns at least one light-squared and one dark-squared bishop.
  pawn_colours    number of own pawns on light squares and on dark squares (a1 is dark).
  mobility        mode 'legal': number of distinct destination squares among the legal moves of the piece, computed as if its colour were
                  to move (en passant right ignored when the turn is switched). mode 'squares': squares the piece attacks that are not
                  occupied by an own piece (non-pawn pieces only; pins and checks ignored).
  king_pawn_shield  own pawns on the three files centred on the king's file, on the two ranks directly in front of the king (towards the
                  enemy), whatever rank the king stands on.
  space           mode 'pawn_attacks': squares in the OPPONENT's half (ranks 5-8 for White, 1-4 for Black) attacked by at least one own
                  pawn; mode 'pawn_controlled': those squares that no enemy pawn attacks. An optional `region` (list of squares) replaces the
                  opponent's half, e.g. the four central squares.
  piece_attacks   squares attacked by the piece on a square (own-occupied squares included: "defends"; pins and checks ignored).
  pawn_attackers  number of pawns of a colour attacking a square (pieces do not count).
  pawn_move_attacks (move property, needs `square`) a pawn move after which the moved pawn attacks that square.
  blockades_passed (move property) a knight, bishop, rook or queen lands on the stop square of an enemy passed pawn (evaluated after the move).
  rooks_connected two own rooks on the same rank or file with no piece of either colour between them.
  king_wing       king on files a-c = queenside, d-e = centre, f-h = kingside.
"""
from __future__ import annotations

import chess

FILES = "abcdefgh"
LIGHT = chess.BB_LIGHT_SQUARES
OCC_MODES = ("any", "empty", "own", "not_own")
PAWN_KINDS = ("passed", "isolated", "doubled", "backward", "connected", "protected", "protected_passed", "connected_passed",
              "blockaded_passed", "chain_base", "hanging_pair", "majority_side")


def colour(name_or_bool):
    if isinstance(name_or_bool, bool):
        return name_or_bool
    if name_or_bool in ("white", "w", "White"):
        return chess.WHITE
    if name_or_bool in ("black", "b", "Black"):
        return chess.BLACK
    raise ValueError(f"bad colour {name_or_bool!r}")


def rr(c, sq):
    """relative rank, 0 = own back rank"""
    r = chess.square_rank(sq)
    return r if c == chess.WHITE else 7 - r


def _f(sq):
    return chess.square_file(sq)


def names(squares):
    return sorted(chess.square_name(s) for s in squares)


def _pawns(board, c):
    return sorted(board.pieces(chess.PAWN, c))


def pawn_attack_mask(board, c):
    m = 0
    for s in board.pieces(chess.PAWN, c):
        m |= chess.BB_PAWN_ATTACKS[c][s]
    return m


def stop_square(c, sq):
    r = chess.square_rank(sq)
    nr = r + 1 if c == chess.WHITE else r - 1
    return chess.square(_f(sq), nr) if 0 <= nr <= 7 else None


# ----------------------------------------------------------------------------------------------------------------
# pawn kinds
# ----------------------------------------------------------------------------------------------------------------
def passed_pawns(board, c):
    enemy = _pawns(board, not c)
    out = []
    for s in _pawns(board, c):
        if not any(abs(_f(e) - _f(s)) <= 1 and rr(c, e) > rr(c, s) for e in enemy):
            out.append(s)
    return out


def isolated_pawns(board, c):
    own = _pawns(board, c)
    return [s for s in own if not any(abs(_f(q) - _f(s)) == 1 for q in own)]


def doubled_pawns(board, c):
    own = _pawns(board, c)
    cnt = {}
    for s in own:
        cnt[_f(s)] = cnt.get(_f(s), 0) + 1
    return [s for s in own if cnt[_f(s)] >= 2]


def backward_pawns(board, c):
    own = _pawns(board, c)
    enemy_att = pawn_attack_mask(board, not c)
    out = []
    for s in own:
        nb = [q for q in own if abs(_f(q) - _f(s)) == 1]
        if not nb:
            continue                                   # isolated
        if any(rr(c, q) <= rr(c, s) for q in nb):
            continue                                   # a neighbour can still support it
        st = stop_square(c, s)
        if st is not None and (enemy_att >> st) & 1:
            out.append(s)
    return out


def connected_pawns(board, c):
    own = _pawns(board, c)
    return [s for s in own if any(abs(_f(q) - _f(s)) == 1 and abs(rr(c, q) - rr(c, s)) <= 1 for q in own)]


def protected_pawns(board, c):
    own = _pawns(board, c)
    return [s for s in own if any((chess.BB_PAWN_ATTACKS[c][q] >> s) & 1 for q in own)]


def protected_passed_pawns(board, c):
    prot = set(protected_pawns(board, c))
    return [s for s in passed_pawns(board, c) if s in prot]


def connected_passed_pawns(board, c):
    ps = passed_pawns(board, c)
    return [s for s in ps if any(abs(_f(q) - _f(s)) == 1 and abs(rr(c, q) - rr(c, s)) <= 1 for q in ps)]


def blockaded_passed_pawns(board, c):
    out = []
    for s in passed_pawns(board, c):
        st = stop_square(c, s)
        if st is None:
            continue
        pc = board.piece_at(st)
        if pc is not None and pc.color != c and pc.piece_type != chess.PAWN:
            out.append(s)
    return out


def chain_bases(board, c):
    own = _pawns(board, c)
    prot = set(protected_pawns(board, c))
    out = []
    for s in own:
        if s in prot:
            continue
        if any((chess.BB_PAWN_ATTACKS[c][s] >> q) & 1 for q in own):
            out.append(s)
    return out


def hanging_pairs(board, c):
    own = _pawns(board, c)
    enemy = _pawns(board, not c)
    byfile = {}
    for s in own:
        byfile.setdefault(_f(s), []).append(s)
    out = []
    for f in range(7):
        if len(byfile.get(f, [])) != 1 or len(byfile.get(f + 1, [])) != 1:
            continue
        a, b = byfile[f][0], byfile[f + 1][0]
        if chess.square_rank(a) != chess.square_rank(b) or rr(c, a) not in (3, 4):
            continue
        if byfile.get(f - 1) or byfile.get(f + 2):
            continue
        if any(_f(e) in (f, f + 1) for e in enemy):
            continue
        out += [a, b]
    return sorted(set(out))


def wing_counts(board, c):
    own, opp = _pawns(board, c), _pawns(board, not c)
    res = {}
    for wing, rng in (("queenside", range(0, 4)), ("kingside", range(4, 8))):
        res[wing] = (sum(1 for s in own if _f(s) in rng), sum(1 for s in opp if _f(s) in rng))
    return res


def wing_pawn_count(board, c, wing):
    """Number of pawns of colour c on the wing: queenside = files a-d, kingside = files e-h."""
    rng = range(0, 4) if wing == "queenside" else range(4, 8)
    return sum(1 for s in board.pieces(chess.PAWN, c) if _f(s) in rng)


def majority_pawns(board, c):
    own = _pawns(board, c)
    out = []
    for wing, (mine, theirs) in wing_counts(board, c).items():
        if mine > theirs:
            rng = range(0, 4) if wing == "queenside" else range(4, 8)
            out += [s for s in own if _f(s) in rng]
    return out


_PAWN_FN = {"passed": passed_pawns, "isolated": isolated_pawns, "doubled": doubled_pawns, "backward": backward_pawns,
            "connected": connected_pawns, "protected": protected_pawns, "protected_passed": protected_passed_pawns,
            "connected_passed": connected_passed_pawns, "blockaded_passed": blockaded_passed_pawns,
            "chain_base": chain_bases, "hanging_pair": hanging_pairs, "majority_side": majority_pawns}


def pawn_set(board, kind, c):
    return names(_PAWN_FN[kind](board, c))


# ----------------------------------------------------------------------------------------------------------------
# files, islands, squares
# ----------------------------------------------------------------------------------------------------------------
def open_files(board):
    wp = {_f(s) for s in board.pieces(chess.PAWN, chess.WHITE)}
    bp = {_f(s) for s in board.pieces(chess.PAWN, chess.BLACK)}
    return dict(open=[FILES[f] for f in range(8) if f not in wp and f not in bp],
                half_open_white=[FILES[f] for f in range(8) if f not in wp and f in bp],
                half_open_black=[FILES[f] for f in range(8) if f not in bp and f in wp])


def pawn_islands(board, c):
    fs = sorted({_f(s) for s in board.pieces(chess.PAWN, c)})
    islands, cur = [], []
    for f in fs:
        if cur and f == cur[-1] + 1:
            cur.append(f)
        else:
            if cur:
                islands.append(cur)
            cur = [f]
    if cur:
        islands.append(cur)
    return ["".join(FILES[f] for f in isl) for isl in islands]


def outpost_squares(board, c, occupied="any"):
    if occupied not in OCC_MODES:
        raise ValueError(f"occupied must be one of {OCC_MODES}")
    own = _pawns(board, c)
    enemy = _pawns(board, not c)
    out = []
    for s in chess.SQUARES:
        if rr(c, s) not in (3, 4, 5):
            continue
        if board.piece_type_at(s) == chess.PAWN:
            continue
        if not any((chess.BB_PAWN_ATTACKS[c][q] >> s) & 1 for q in own):
            continue
        if any(abs(_f(e) - _f(s)) == 1 and rr(c, e) >= rr(c, s) + 1 for e in enemy):
            continue
        pc = board.piece_at(s)
        if occupied == "empty" and pc is not None:
            continue
        if occupied == "own" and not (pc is not None and pc.color == c):
            continue
        if occupied == "not_own" and pc is not None and pc.color == c:
            continue
        out.append(s)
    return names(out)


def hole_squares(board, c):
    own = _pawns(board, c)
    out = []
    for s in chess.SQUARES:
        if rr(c, s) not in (2, 3, 4):
            continue
        if board.piece_type_at(s) == chess.PAWN and board.color_at(s) == c:
            continue
        if any(abs(_f(q) - _f(s)) == 1 and rr(c, q) <= rr(c, s) - 1 for q in own):
            continue
        out.append(s)
    return names(out)


def has_bishop_pair(board, c):
    bs = list(board.pieces(chess.BISHOP, c))
    light = any((LIGHT >> s) & 1 for s in bs)
    dark = any(not (LIGHT >> s) & 1 for s in bs)
    return light and dark


def bishop_pair_holders(board):
    return [("white" if c == chess.WHITE else "black") for c in (chess.WHITE, chess.BLACK) if has_bishop_pair(board, c)]


def pawn_colours(board, c):
    own = _pawns(board, c)
    light = sum(1 for s in own if (LIGHT >> s) & 1)
    return dict(light=light, dark=len(own) - light)


def mobility(board, sq, mode):
    pc = board.piece_at(sq)
    if pc is None:
        raise ValueError("no piece on that square")
    if mode == "legal":
        b = board.copy(stack=False)
        if b.turn != pc.color:
            b.turn = pc.color
            b.ep_square = None
        if not b.is_valid():
            raise ValueError("position is not valid with that colour to move (the other king is in check)")
        return len({m.to_square for m in b.legal_moves if m.from_square == sq})
    if mode == "squares":
        if pc.piece_type == chess.PAWN:
            raise ValueError("mode 'squares' is for pieces, not pawns")
        own_occ = board.occupied_co[pc.color]
        return chess.popcount(board.attacks_mask(sq) & ~own_occ)
    raise ValueError("mode must be 'legal' or 'squares'")


def king_shield_squares(board, c):
    k = board.king(c)
    if k is None:
        return []
    d = 1 if c == chess.WHITE else -1
    out = []
    for df in (-1, 0, 1):
        for dr in (1, 2):
            f, r = _f(k) + df, chess.square_rank(k) + d * dr
            if 0 <= f <= 7 and 0 <= r <= 7:
                out.append(chess.square(f, r))
    return out


def king_pawn_shield(board, c):
    return names(s for s in king_shield_squares(board, c) if board.piece_at(s) == chess.Piece(chess.PAWN, c))


def space_squares(board, c, mode, region=None):
    half = chess.BB_RANK_5 | chess.BB_RANK_6 | chess.BB_RANK_7 | chess.BB_RANK_8 if c == chess.WHITE \
        else chess.BB_RANK_1 | chess.BB_RANK_2 | chess.BB_RANK_3 | chess.BB_RANK_4
    if region is not None:                                  # an explicit list of squares replaces the opponent's half
        half = 0
        for name in region:
            half |= chess.BB_SQUARES[chess.parse_square(name)]
    mine = pawn_attack_mask(board, c) & half
    if mode == "pawn_attacks":
        m = mine
    elif mode == "pawn_controlled":
        m = mine & ~pawn_attack_mask(board, not c)
    else:
        raise ValueError("mode must be 'pawn_attacks' or 'pawn_controlled'")
    return names(chess.scan_forward(m))


def rooks_connected(board, c):
    rooks = sorted(board.pieces(chess.ROOK, c))
    for i in range(len(rooks)):
        for j in range(i + 1, len(rooks)):
            a, b = rooks[i], rooks[j]
            if (chess.square_rank(a) == chess.square_rank(b) or _f(a) == _f(b)) and not (chess.between(a, b) & board.occupied):
                return True
    return False


def attacked_squares(board, sq):
    """Squares the piece on `sq` attacks (python-chess attack set: includes squares held by own pieces, ignores pins and checks)."""
    if board.piece_at(sq) is None:
        raise ValueError("no piece on that square")
    return names(board.attacks(sq))


def pawn_attackers(board, sq, c):
    """Number of pawns of colour c that attack square sq (not pieces)."""
    return sum(1 for q in board.pieces(chess.PAWN, c) if (chess.BB_PAWN_ATTACKS[c][q] >> sq) & 1)


def king_wing(board, c):
    k = board.king(c)
    if k is None:
        raise ValueError("no king")
    f = _f(k)
    return "queenside" if f <= 2 else "centre" if f <= 4 else "kingside"


def piece_symbol(board, sq):
    pc = board.piece_at(sq)
    return pc.symbol() if pc else None


# ----------------------------------------------------------------------------------------------------------------
# move properties (for the exact-set claim `moves_where`)
# ----------------------------------------------------------------------------------------------------------------
def _after(board, move):
    b = board.copy(stack=False)
    b.push(move)
    return b


def mp_connects_rooks(board, move):
    c = board.turn
    return (not rooks_connected(board, c)) and rooks_connected(_after(board, move), c)


def mp_to_outpost(board, move):
    pc = board.piece_at(move.from_square)
    if pc is None or pc.piece_type not in (chess.KNIGHT, chess.BISHOP):
        return False
    after = _after(board, move)
    return chess.square_name(move.to_square) in outpost_squares(after, pc.color, "any")


def mp_rook_to_open_file(board, move):
    pc = board.piece_at(move.from_square)
    if pc is None or pc.piece_type != chess.ROOK:
        return False
    return FILES[_f(move.to_square)] in open_files(_after(board, move))["open"]


def mp_rook_to_half_open_file(board, move):
    pc = board.piece_at(move.from_square)
    if pc is None or pc.piece_type != chess.ROOK:
        return False
    key = "half_open_white" if pc.color == chess.WHITE else "half_open_black"
    return FILES[_f(move.to_square)] in open_files(_after(board, move))[key]


def mp_rook_to_seventh(board, move):
    pc = board.piece_at(move.from_square)
    if pc is None or pc.piece_type != chess.ROOK:
        return False
    return rr(pc.color, move.to_square) == 6 and rr(pc.color, move.from_square) != 6


def mp_blockades_passed(board, move):
    """A knight, bishop, rook or queen moves onto the stop square of an enemy passed pawn."""
    pc = board.piece_at(move.from_square)
    if pc is None or pc.piece_type not in (chess.KNIGHT, chess.BISHOP, chess.ROOK, chess.QUEEN):
        return False
    after = _after(board, move)
    return move.to_square in [stop_square(not pc.color, q) for q in passed_pawns(after, not pc.color)]


def mp_pawn_move_attacks(board, move, square):
    """A pawn move (push or capture) after which the MOVED pawn attacks `square` (a square name)."""
    pc = board.piece_at(move.from_square)
    if pc is None or pc.piece_type != chess.PAWN:
        return False
    return (chess.BB_PAWN_ATTACKS[pc.color][move.to_square] >> chess.parse_square(square)) & 1 == 1


MOVE_PROPS = {"connects_rooks": mp_connects_rooks, "to_outpost": mp_to_outpost, "rook_to_open_file": mp_rook_to_open_file,
              "rook_to_half_open_file": mp_rook_to_half_open_file, "rook_to_seventh": mp_rook_to_seventh,
              "blockades_passed": mp_blockades_passed, "pawn_move_attacks": mp_pawn_move_attacks}
NEEDS_SQUARE = {"pawn_move_attacks"}


def moves_where(board, prop, square=None):
    fn = MOVE_PROPS[prop]
    if prop in NEEDS_SQUARE:
        if square is None:
            raise ValueError(f"property {prop} needs a `square`")
        return sorted(m.uci() for m in board.legal_moves if fn(board, m, square))
    return sorted(m.uci() for m in board.legal_moves if fn(board, m))
