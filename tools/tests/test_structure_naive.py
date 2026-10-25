"""Differential test: tools/structure.py against a deliberately naive second implementation written from the definitions
(explicit loops over coordinates, pawn advancement simulated square by square, Black handled by mirroring the board).

    ./tools/.venv/Scripts/python.exe -I tools/tests/test_structure_naive.py [n_positions]

Positions: real-game FENs (tools/corpus/out/game_candidates.jsonl, Lichess CC0) plus random synthetic pawn structures.
Exit code 1 on any mismatch."""
import sys, json, random
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import chess
import structure as S


# ---------------------------------------------------------------- naive white-perspective implementations
def coords(board, colour):
    return {(chess.square_file(s), chess.square_rank(s)) for s in board.pieces(chess.PAWN, colour)}


def n_passed(W, B):
    out = set()
    for (f, r) in W:
        blocked = False
        for df in (-1, 0, 1):
            for r2 in range(r + 1, 8):
                if (f + df, r2) in B:
                    blocked = True
        if not blocked:
            out.add((f, r))
    return out


def n_isolated(W, B):
    return {(f, r) for (f, r) in W if not any(((f + d, r2) in W) for d in (-1, 1) for r2 in range(8))}


def n_doubled(W, B):
    return {(f, r) for (f, r) in W if sum(1 for r2 in range(8) if (f, r2) in W) >= 2}


def n_protected(W, B):
    return {(f, r) for (f, r) in W if (f - 1, r - 1) in W or (f + 1, r - 1) in W}


def n_backward(W, B):
    out = set()
    for (f, r) in W:
        left = [(f2, r2) for (f2, r2) in W if abs(f2 - f) == 1]
        if not left:
            continue
        if any(r2 <= r for (_f2, r2) in left):
            continue
        if r + 2 <= 7 and ((f - 1, r + 2) in B or (f + 1, r + 2) in B):
            out.add((f, r))
    return out


def n_connected(W, B):
    return {(f, r) for (f, r) in W if any((f + d, r + dr) in W for d in (-1, 1) for dr in (-1, 0, 1))}


def n_protected_passed(W, B):
    return n_passed(W, B) & n_protected(W, B)


def n_connected_passed(W, B):
    P = n_passed(W, B)
    return {(f, r) for (f, r) in P if any((f + d, r + dr) in P for d in (-1, 1) for dr in (-1, 0, 1))}


def n_chain_base(W, B):
    prot = n_protected(W, B)
    return {(f, r) for (f, r) in W if (f, r) not in prot and ((f - 1, r + 1) in W or (f + 1, r + 1) in W)}


def n_hanging(W, B):
    out = set()
    for f in range(7):
        a = [(f, r) for r in range(8) if (f, r) in W]
        b = [(f + 1, r) for r in range(8) if (f + 1, r) in W]
        if len(a) != 1 or len(b) != 1 or a[0][1] != b[0][1] or a[0][1] not in (3, 4):
            continue
        if any((f - 1, r) in W for r in range(8)) or any((f + 2, r) in W for r in range(8)):
            continue
        if any((ff, r) in B for ff in (f, f + 1) for r in range(8)):
            continue
        out |= {a[0], b[0]}
    return out


def n_majority(W, B):
    out = set()
    for rng in (range(0, 4), range(4, 8)):
        if sum(1 for (f, _r) in W if f in rng) > sum(1 for (f, _r) in B if f in rng):
            out |= {(f, r) for (f, r) in W if f in rng}
    return out


def n_blockaded(W, B, pieces_black):
    """pieces_black: dict (f, r) -> piece type for Black NON-pawn pieces"""
    return {(f, r) for (f, r) in n_passed(W, B) if r + 1 <= 7 and (f, r + 1) in pieces_black}


def n_outposts(W, B, occ, mode):
    out = set()
    for f in range(8):
        for r in (3, 4, 5):
            if (f, r) in W or (f, r) in B:
                continue
            if not ((f - 1, r - 1) in W or (f + 1, r - 1) in W):
                continue
            attackable = False
            for (fb, rb) in B:
                rb2 = rb
                while rb2 >= 1:                       # the black pawn advances from rank rb down; it attacks (fb+-1, rb2 - 1)
                    if (f, r) in ((fb - 1, rb2 - 1), (fb + 1, rb2 - 1)):
                        attackable = True
                    rb2 -= 1
            if attackable:
                continue
            what = occ.get((f, r))                    # ('own'|'enemy', type) for non-pawn pieces
            if mode == "empty" and what is not None:
                continue
            if mode == "own" and not (what is not None and what[0] == "own"):
                continue
            if mode == "not_own" and what is not None and what[0] == "own":
                continue
            out.add((f, r))
    return out


def n_holes(W, B):
    out = set()
    for f in range(8):
        for r in (2, 3, 4):
            if (f, r) in W:
                continue
            reachable = False
            for (fw, rw) in W:
                for rw2 in range(rw, 7):              # the white pawn advances; from rank rw2 it attacks (fw+-1, rw2 + 1)
                    if (f, r) in ((fw - 1, rw2 + 1), (fw + 1, rw2 + 1)):
                        reachable = True
            if not reachable:
                out.add((f, r))
    return out


def n_islands(W):
    files = sorted({f for (f, _r) in W})
    out, cur = [], ""
    prev = None
    for f in files:
        if prev is not None and f == prev + 1:
            cur += "abcdefgh"[f]
        else:
            if cur:
                out.append(cur)
            cur = "abcdefgh"[f]
        prev = f
    if cur:
        out.append(cur)
    return out


def n_space(W, B, mode):
    att = set()
    for (f, r) in W:
        for d in (-1, 1):
            if 0 <= f + d <= 7 and r + 1 <= 7:
                att.add((f + d, r + 1))
    attb = set()
    for (f, r) in B:
        for d in (-1, 1):
            if 0 <= f + d <= 7 and r - 1 >= 0:
                attb.add((f + d, r - 1))
    sq = {(f, r) for (f, r) in att if r >= 4}
    if mode == "pawn_controlled":
        sq -= attb
    return sq


def n_shield(board, W, white_king):
    kf, kr = white_king
    out = set()
    for df in (-1, 0, 1):
        for dr in (1, 2):
            if 0 <= kf + df <= 7 and 0 <= kr + dr <= 7 and (kf + df, kr + dr) in W:
                out.add((kf + df, kr + dr))
    return out


# ---------------------------------------------------------------- comparison harness
def to_names(cs, mirror):
    out = []
    for (f, r) in cs:
        sq = chess.square(f, r)
        out.append(chess.square_name(chess.square_mirror(sq) if mirror else sq))
    return sorted(out)


def check_board(board):
    """Returns a list of mismatch descriptions for both colours."""
    bad = []
    for colour in (chess.WHITE, chess.BLACK):
        mirror = colour == chess.BLACK
        vb = board.mirror() if mirror else board          # white-perspective view of `colour`
        W, B = coords(vb, chess.WHITE), coords(vb, chess.BLACK)
        black_nonpawn = {(chess.square_file(s), chess.square_rank(s)): p.piece_type for s, p in vb.piece_map().items()
                         if p.color == chess.BLACK and p.piece_type != chess.PAWN}
        occ = {}
        for s, p in vb.piece_map().items():
            if p.piece_type != chess.PAWN:
                occ[(chess.square_file(s), chess.square_rank(s))] = ("own" if p.color == chess.WHITE else "enemy", p.piece_type)
        tag = "white" if colour == chess.WHITE else "black"
        pairs = {
            "passed": n_passed(W, B), "isolated": n_isolated(W, B), "doubled": n_doubled(W, B), "backward": n_backward(W, B),
            "connected": n_connected(W, B), "protected": n_protected(W, B), "protected_passed": n_protected_passed(W, B),
            "connected_passed": n_connected_passed(W, B), "blockaded_passed": n_blockaded(W, B, black_nonpawn),
            "chain_base": n_chain_base(W, B), "hanging_pair": n_hanging(W, B), "majority_side": n_majority(W, B),
        }
        for kind, exp in pairs.items():
            got = S.pawn_set(board, kind, colour)
            if got != to_names(exp, mirror):
                bad.append(f"{tag} {kind}: got {got} expected {to_names(exp, mirror)}")
        for mode in ("any", "empty", "own", "not_own"):
            got = S.outpost_squares(board, colour, mode); exp = to_names(n_outposts(W, B, occ, mode), mirror)
            if got != exp:
                bad.append(f"{tag} outposts[{mode}]: got {got} expected {exp}")
        got = S.hole_squares(board, colour); exp = to_names(n_holes(W, B), mirror)
        if got != exp:
            bad.append(f"{tag} holes: got {got} expected {exp}")
        if S.pawn_islands(board, colour) != n_islands(W):
            bad.append(f"{tag} islands: got {S.pawn_islands(board, colour)} expected {n_islands(W)}")
        for mode in ("pawn_attacks", "pawn_controlled"):
            got = S.space_squares(board, colour, mode); exp = to_names(n_space(W, B, mode), mirror)
            if got != exp:
                bad.append(f"{tag} space[{mode}]: got {got} expected {exp}")
        wk = vb.king(chess.WHITE)
        if wk is not None:
            got = S.king_pawn_shield(board, colour); exp = to_names(n_shield(vb, W, (chess.square_file(wk), chess.square_rank(wk))), mirror)
            if got != exp:
                bad.append(f"{tag} shield: got {got} expected {exp}")
    # open files: colour-symmetric facts
    wf = {chess.square_file(s) for s in board.pieces(chess.PAWN, chess.WHITE)}
    bf = {chess.square_file(s) for s in board.pieces(chess.PAWN, chess.BLACK)}
    of = S.open_files(board)
    exp = dict(open=["abcdefgh"[f] for f in range(8) if f not in wf and f not in bf],
               half_open_white=["abcdefgh"[f] for f in range(8) if f not in wf and f in bf],
               half_open_black=["abcdefgh"[f] for f in range(8) if f in wf and f not in bf])
    if of != exp:
        bad.append(f"open_files: got {of} expected {exp}")
    # bishop pair / pawn colours
    for colour in (chess.WHITE, chess.BLACK):
        bs = [s for s, p in board.piece_map().items() if p.color == colour and p.piece_type == chess.BISHOP]
        light = sum(1 for s in bs if (chess.square_file(s) + chess.square_rank(s)) % 2 == 1)
        dark = len(bs) - light
        if S.has_bishop_pair(board, colour) != (light >= 1 and dark >= 1):
            bad.append(f"bishop pair {colour}")
        ps = [s for s, p in board.piece_map().items() if p.color == colour and p.piece_type == chess.PAWN]
        li = sum(1 for s in ps if (chess.square_file(s) + chess.square_rank(s)) % 2 == 1)
        if S.pawn_colours(board, colour) != dict(light=li, dark=len(ps) - li):
            bad.append(f"pawn colours {colour}")
    return bad


def random_structure(rng):
    b = chess.Board(None)
    b.set_piece_at(chess.E1, chess.Piece(chess.KING, chess.WHITE))
    b.set_piece_at(chess.E8, chess.Piece(chess.KING, chess.BLACK))
    sqs = [chess.square(f, r) for f in range(8) for r in range(1, 7) if chess.square(f, r) not in (chess.E1, chess.E8)]
    rng.shuffle(sqs)
    for colour in (chess.WHITE, chess.BLACK):
        for _ in range(rng.randint(2, 8)):
            s = sqs.pop()
            b.set_piece_at(s, chess.Piece(chess.PAWN, colour))
    for _ in range(rng.randint(0, 6)):
        s = sqs.pop()
        b.set_piece_at(s, chess.Piece(rng.choice([chess.KNIGHT, chess.BISHOP, chess.ROOK, chess.QUEEN]), rng.choice([chess.WHITE, chess.BLACK])))
    b.turn = chess.WHITE
    return b


def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 1500
    rng = random.Random(20261024)
    boards = []
    cand = HERE.parent / "corpus" / "out" / "game_candidates.jsonl"
    if cand.exists():
        lines = cand.read_text(encoding="utf-8").splitlines()
        for ln in rng.sample(lines, min(n, len(lines))):
            boards.append(chess.Board(json.loads(ln)["fen"]))
    boards += [random_structure(rng) for _ in range(n)]
    total_bad = 0
    for i, b in enumerate(boards):
        bad = check_board(b)
        if bad:
            total_bad += 1
            if total_bad <= 10:
                print("MISMATCH", b.fen(), *bad[:3], sep="\n   ")
    print(f"differential test: {len(boards)} boards, {total_bad} with mismatches")
    sys.exit(1 if total_bad else 0)


if __name__ == "__main__":
    main()


# ---------------------------------------------------------------- facade used by tools/positional/audit.py
def _views(board, colour):
    mirror = colour == chess.BLACK
    vb = board.mirror() if mirror else board
    W, B = coords(vb, chess.WHITE), coords(vb, chess.BLACK)
    black_nonpawn = {(chess.square_file(s), chess.square_rank(s)): p.piece_type for s, p in vb.piece_map().items() if p.color == chess.BLACK and p.piece_type != chess.PAWN}
    occ = {}
    for s, p in vb.piece_map().items():
        if p.piece_type != chess.PAWN:
            occ[(chess.square_file(s), chess.square_rank(s))] = ("own" if p.color == chess.WHITE else "enemy", p.piece_type)
    return mirror, vb, W, B, black_nonpawn, occ


def naive_pawns(board, kind, colour):
    mirror, vb, W, B, bnp, occ = _views(board, colour)
    fn = {"passed": n_passed, "isolated": n_isolated, "doubled": n_doubled, "backward": n_backward, "connected": n_connected, "protected": n_protected,
          "protected_passed": n_protected_passed, "connected_passed": n_connected_passed, "chain_base": n_chain_base, "hanging_pair": n_hanging, "majority_side": n_majority}
    if kind == "blockaded_passed":
        return to_names(n_blockaded(W, B, bnp), mirror)
    return to_names(fn[kind](W, B), mirror)


def naive_outposts(board, colour, mode):
    mirror, vb, W, B, bnp, occ = _views(board, colour)
    return to_names(n_outposts(W, B, occ, mode), mirror)


def naive_holes(board, colour):
    mirror, vb, W, B, bnp, occ = _views(board, colour)
    return to_names(n_holes(W, B), mirror)


def naive_space(board, colour, mode):
    mirror, vb, W, B, bnp, occ = _views(board, colour)
    return to_names(n_space(W, B, mode), mirror)


def naive_islands(board, colour):
    mirror, vb, W, B, bnp, occ = _views(board, colour)
    return n_islands(W)
