"""Family 4: check / checkmate / stalemate / ongoing (FND.CHECK, FND.STALEMATE).

classify_position with options, claim game_state (the validator's own labelling of the side to move).
Forms:  'ms'  options [checkmate, stalemate]   (cue 1, FND.STALEMATE.D1)
        'cm'  options [check, checkmate]       (cue 1, FND.CHECK.D1)
        'all' options [check, checkmate, stalemate, ongoing]  (cue 3, FND.STALEMATE.D2)
Target: 18 items per class. Terminal positions (mates, stalemates) are drawn by random sampling over small material
signatures (plus back-rank and smothered templates); NEAR-MISS positions are made from a terminal position by moving one
White piece (one move different) so that the class changes (mate -> check, stalemate -> ongoing). A terminal position and
its near-misses share a family, and every base has a colour-flipped twin (White to move / White mated).

    python tools/generators/gen_state.py          # writes content/items/gen-t0-state.json
"""
from __future__ import annotations

import sys as _s, pathlib as _p
_s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import chess

from common import *  # noqa: F401,F403

AREA, MODULE, SEED, FILE = "STATE", "state", 20261027, "gen-t0-state.json"
P, N, B, R, Q, K = chess.PAWN, chess.KNIGHT, chess.BISHOP, chess.ROOK, chess.QUEEN, chess.KING

SIG = {  # white pieces, black pieces (besides kings)
    "KQvK": ([Q], []), "KRvK": ([R], []), "KQPvK": ([Q, P], []), "KRRvK": ([R, R], []), "KQvKP": ([Q], [P]),
    "KRvKP": ([R], [P]), "KPvK": ([P], []), "KPvKP": ([P], [P]), "KQRvK": ([Q, R], []), "KBBvK": ([B, B], []),
    "KRvKN": ([R], [N]), "KQvKB": ([Q], [B]),
}


def edge_square(rng):
    side = rng.randrange(4)
    k = rng.randrange(8)
    return [chess.square(0, k), chess.square(7, k), chess.square(k, 0), chess.square(k, 7)][side]


def place_ok(sq, pt):
    return not (pt == P and chess.square_rank(sq) in (0, 7))


def sample_sig(rng, sig, target, tries=400000):
    wh, bl = SIG[sig]
    for _ in range(tries):
        b = new_board()
        bk = edge_square(rng) if rng.random() < 0.85 else random_empty(b, rng)
        put(b, bk, K, chess.BLACK)
        wk = random_empty(b, rng)
        if chess.square_distance(wk, bk) <= 1:
            continue
        put(b, wk, K, chess.WHITE)
        ok = True
        for pt in wh:
            s = random_empty(b, rng)
            if not place_ok(s, pt):
                ok = False
                break
            put(b, s, pt, chess.WHITE)
        if not ok:
            continue
        for pt in bl:
            s = random_empty(b, rng)
            if not place_ok(s, pt):
                ok = False
                break
            put(b, s, pt, chess.BLACK)
        if not ok:
            continue
        b.turn = chess.BLACK
        if not b.is_valid() or any_pinned(b):
            continue
        if game_state(b) == target:
            return b
    return None


def sample_backrank(rng, heavy, tries=200000):
    for _ in range(tries):
        b = new_board()
        f = rng.randrange(8)
        bk = chess.square(f, 7)
        put(b, bk, K, chess.BLACK)
        for df in (-1, 0, 1):
            ff = f + df
            if 0 <= ff <= 7 and rng.random() < 0.9:
                put(b, chess.square(ff, 6), P, chess.BLACK)
        s = chess.square(rng.randrange(8), 7)
        if b.piece_at(s) is not None or abs(chess.square_file(s) - f) < 2:
            continue
        put(b, s, heavy, chess.WHITE)
        wk = random_empty(b, rng, ranks=range(0, 5))
        if wk is None:
            continue
        put(b, wk, K, chess.WHITE)
        if rng.random() < 0.5:
            s2 = random_empty(b, rng, ranks=range(1, 5))
            put(b, s2, P, chess.WHITE)
        b.turn = chess.BLACK
        if b.is_valid() and not any_pinned(b) and game_state(b) == "checkmate":
            return b
    return None


def sample_smothered(rng, tries=200000):
    corners = [(chess.H8, [chess.G8, chess.G7, chess.H7], [chess.F7, chess.G6]), (chess.A8, [chess.B8, chess.B7, chess.A7], [chess.C7, chess.B6]),
               (chess.H1, [chess.G1, chess.G2, chess.H2], [chess.F2, chess.G3]), (chess.A1, [chess.B1, chess.B2, chess.A2], [chess.C2, chess.B3])]
    for _ in range(tries):
        kc, neigh, nsq = rng.choice(corners)
        b = new_board()
        put(b, kc, K, chess.BLACK)
        for s in neigh:
            pt = rng.choice([R, P, P, B, N, Q])
            if not place_ok(s, pt):
                pt = R
            put(b, s, pt, chess.BLACK)
        put(b, rng.choice(nsq), N, chess.WHITE)
        wk = random_empty(b, rng)
        if chess.square_distance(wk, kc) <= 2:
            continue
        put(b, wk, K, chess.WHITE)
        b.turn = chess.BLACK
        if b.is_valid() and not any_pinned(b) and game_state(b) == "checkmate":
            return b
    return None


def cluster(rng, stm=chess.BLACK):
    b = new_board()
    cx, cy = rng.randrange(2, 6), rng.randrange(2, 6)
    window = [chess.square(f, r) for f in range(8) for r in range(8) if abs(f - cx) <= 2 and abs(r - cy) <= 2]
    for color in (chess.WHITE, chess.BLACK):
        for _ in range(rng.randrange(2, 5)):
            pt = rng.choice([P, P, N, N, B, B, R, Q])
            opts = [s for s in window if b.piece_at(s) is None and place_ok(s, pt)]
            if pt == P:
                opts = [s for s in opts if 1 <= chess.square_rank(s) <= 6]
            if opts:
                put(b, rng.choice(opts), pt, color)
    for color in (chess.WHITE, chess.BLACK):
        s = random_empty(b, rng)
        if b.king(not color) is not None and chess.square_distance(s, b.king(not color)) <= 1:
            return None
        put(b, s, K, color)
    b.turn = stm
    if not b.is_valid() or any_pinned(b):
        return None
    return b


def sample_cluster_class(rng, target, checker_type=None, tries=400000):
    for _ in range(tries):
        b = cluster(rng)
        if b is None or game_state(b) != target:
            continue
        if target == "check":
            cs = list(b.checkers())
            if len(cs) != 1:
                continue
            if checker_type is not None and b.piece_type_at(cs[0]) != checker_type:
                continue
        return b
    return None


def near_miss(rng, board, desired):
    """One White piece (or the White king) moves one move; return a board (Black to move) whose class is in `desired`."""
    w = board.copy(stack=False)
    w.turn = chess.WHITE
    cands = []
    for m in w.pseudo_legal_moves:
        if board.piece_at(m.to_square) is not None:
            continue
        n = board.copy(stack=False)
        n.set_piece_at(m.from_square, None)
        n.set_piece_at(m.to_square, board.piece_at(m.from_square))
        n.turn = chess.BLACK
        if not n.is_valid() or any_pinned(n):
            continue
        if game_state(n) in desired:
            cands.append((m, n))
    if not cands:
        return None
    # prefer a small displacement: the near-miss should look like the same position
    cands.sort(key=lambda mn: (chess.square_distance(mn[0].from_square, mn[0].to_square), mn[0].uci()))
    pool = cands[: max(3, len(cands) // 3)]
    return rng.choice(pool)[1]


HINTS = {
    "ms": ["First ask: is the side to move attacked right now?",
           "If the king is attacked and nothing can help, it is checkmate (a win). If it is not attacked but there is no legal move, it is stalemate (a draw).",
           "Test the moves one by one: king steps, capturing the attacker, blocking the line."],
    "cm": ["Which enemy piece attacks the king? Find the line or the jump.",
           "A king in check escapes by moving away, by capturing the attacker, or by blocking the line. If none of these works, it is checkmate.",
           "Check every square next to the king: is it attacked, or held by its own piece? Then ask about capturing and blocking."],
    "all": ["Is the king attacked right now?",
            "Look for legal moves. No legal move means the game is over: check which kind of ending it is. A legal move means the game goes on.",
            "King attacked + no way out = checkmate. King attacked + a way out = check. King safe + no legal move = stalemate. King safe + a legal move = ongoing."],
}
PROMPTS = {
    "ms": "{c} to move and has no legal move. Is this checkmate or stalemate?",
    "cm": "{c} to move, and the king is attacked. Is it check or checkmate?",
    "all": "{c} to move. Which is it: check, checkmate, stalemate, or ongoing (not in check and able to move)?",
}
OPTIONS = {"ms": ["checkmate", "stalemate"], "cm": ["check", "checkmate"],
           "all": ["check", "checkmate", "stalemate", "ongoing"]}
EXPLAIN = {
    "checkmate": "The king is attacked and the side to move has no legal move: checkmate.",
    "stalemate": "The king is not attacked but the side to move has no legal move: stalemate, which is a draw.",
    "check": "The king is attacked, but the side to move has a legal reply (move away, capture the attacker, or block): check, not checkmate.",
    "ongoing": "The king is not attacked and the side to move has a legal move: the game goes on.",
}


def emit(b, board, fam, form, extra_tag=None):
    st = game_state(board)
    if st not in OPTIONS[form]:
        return None
    c = CTITLE[board.turn]
    skill = {"ms": "FND.STALEMATE.D1", "cm": "FND.CHECK.D1", "all": "FND.STALEMATE.D2"}[form]
    cue = 3 if form == "all" else 1
    nodes = ["FND.STALEMATE", "FND.CHECK"] if form != "cm" else ["FND.CHECK"]
    if form == "ms":
        nodes = ["FND.STALEMATE", "FND.CHECK"]
    tags = tags_for(nodes, 0, cue, fam, ["task.classify", f"state.{st}"] + ([extra_tag] if extra_tag else []))
    item = {
        "skill": skill, "cue": cue, "task": "classify_position", "prompt": PROMPTS[form].format(c=c),
        "answer": {"class": st, "options": OPTIONS[form]},
        "claims": [claim("C1", "game_state", f"For the side to move the state is {st}.", state=st)],
        "tags": tags, "hints": HINTS[form], "explain": EXPLAIN[st],
    }
    return b.add(board, fam, item, f"state {st} form {form}", label=f"state-{st}")


def build(registry, pre):
    b = Builder(AREA, MODULE, SEED, registry, pre)
    rng = b.rng
    mate_sigs = ["KQvK", "KRvK", "BR:R", "BR:Q", "SM", "KQvKP", "KRRvK", "BR:R", "KQPvK"]
    stale_sigs = ["KQvK", "KQvK", "KRvK", "KPvK", "KPvKP", "KQvKP", "KQPvK", "KRvKP", "KPvKP"]
    # form assignment per class (counts over the 18 items of a class: 9 bases x 2 colours)
    mate_forms = ["ms", "ms", "ms", "cm", "cm", "all", "all", "all", "all"]
    stale_forms = ["ms", "ms", "ms", "ms", "all", "all", "all", "all", "all"]
    rng.shuffle(mate_forms)
    rng.shuffle(stale_forms)
    fam_n = 0

    def fam_name():
        nonlocal fam_n
        fam_n += 1
        return f"FAM-GEN-STATE-{fam_n:02d}"

    # --- checkmates, with near-miss 'check' positions for the first five
    for i, sig in enumerate(mate_sigs):
        fam = fam_name()
        for _ in range(30):
            if sig.startswith("BR:"):
                base = sample_backrank(rng, R if sig == "BR:R" else Q)
            elif sig == "SM":
                base = sample_smothered(rng)
            else:
                base = sample_sig(rng, sig, "checkmate")
            if base is None:
                break
            if emit(b, base, fam, mate_forms[i]):
                emit(b, colour_flip(base), fam, mate_forms[i])
                if i < 5:  # near-miss: same pieces, one White move different -> only check
                    nm = near_miss(rng, base, {"check"})
                    if nm is not None:
                        form = "cm" if i % 2 == 0 else "all"
                        emit(b, nm, fam, form, "state.near-miss")
                        emit(b, colour_flip(nm), fam, form, "state.near-miss")
                break
        else:
            b.stats["no-base"] += 1
    # --- stalemates, with near-miss 'ongoing' positions for the first five
    for i, sig in enumerate(stale_sigs):
        fam = fam_name()
        for _ in range(30):
            base = sample_sig(rng, sig, "stalemate")
            if base is None:
                break
            if emit(b, base, fam, stale_forms[i]):
                emit(b, colour_flip(base), fam, stale_forms[i])
                if i < 5:
                    nm = near_miss(rng, base, {"ongoing"})
                    if nm is not None:
                        emit(b, nm, fam, "all", "state.near-miss")
                        emit(b, colour_flip(nm), fam, "all", "state.near-miss")
                break
        else:
            b.stats["no-base"] += 1
    # --- more 'check' (4 bases x 2, by checking piece) and 'ongoing' (4 bases x 2)
    for ctype in (P, N, B, R, Q):
        fam = fam_name()
        base = sample_cluster_class(rng, "check", checker_type=ctype)
        if base is None:
            b.stats["no-base"] += 1
            continue
        form = "cm" if ctype in (N, R) else "all"
        if emit(b, base, fam, form):
            emit(b, colour_flip(base), fam, form)
    for _ in range(4):
        fam = fam_name()
        base = sample_cluster_class(rng, "ongoing")
        if base is None:
            b.stats["no-base"] += 1
            continue
        if emit(b, base, fam, "all"):
            emit(b, colour_flip(base), fam, "all")
    return {FILE: b}


def main():
    reg = Registry.for_module(MODULE)
    pre = PreCheck()
    try:
        builders = build(reg, pre)
        for fname, bl in builders.items():
            bl.write(fname)
            import collections
            print(fname, len(bl.items), "items", dict(bl.stats), dict(collections.Counter(i["answer"]["class"] for i in bl.items)))
        for k, v in pre.rejects.items():
            print("reject", k, v, pre.reject_examples[k])
    finally:
        pre.close()


if __name__ == "__main__":
    main()
