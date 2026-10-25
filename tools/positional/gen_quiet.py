"""Family B, engine-checked quiet moves from real games: find_move items where Stockfish's top move (depth 16, evidence under recorded
limits) is a quiet positional move that also has a verified structural property (outpost, open file, connected rooks, seventh rank,
blockade, attack on a weak pawn, pawn lever, more active piece). Claims: best_move_in (accepted set = all moves within 30 cp of the
best, at most three) + exact structure claims about the best move + move_loses for one tempting wrong move.

    ./tools/.venv/Scripts/python.exe -I tools/positional/gen_quiet.py [--workers N]

The explanation says only what the claims establish; the reason is labelled a rule of thumb. review.status is needs-human.
"""
import json
import multiprocessing as mp
import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chess
import pcommon as C
import psel
import structure as S
from pcommon import Cl, mk, CN, CT, PN, join_and, FILES

EXTRA = "--extra" in sys.argv        # second batch: new seed, new files pos-quietx-*.json, skips the games of the first batch
SEED = 20261110 if EXTRA else 20261106
AREA, BASE = ("QUIETX", "quietx") if EXTRA else ("QUIET", "quiet")
W, Bk = chess.WHITE, chess.BLACK
DEPTH_SCREEN = 10
WITHIN = 30
QUOTA = ({"outpost": 6, "openfile": 4, "halfopen": 2, "connect": 3, "seventh": 3, "blockade": 3, "target": 5, "lever": 5, "mobility": 5} if EXTRA else
         {"outpost": 18, "openfile": 14, "halfopen": 6, "connect": 10, "seventh": 8, "blockade": 8, "target": 12, "lever": 12, "mobility": 12})
POOLSEL = {"outpost": "to_outpost", "openfile": "rook_to_open_file", "halfopen": "rook_to_half_open_file", "connect": "connects_rooks",
           "seventh": "rook_to_seventh", "blockade": "blockades_passed"}
ENG = None


def sc(r):
    return (100000 - abs(r["value"])) * (1 if r["value"] > 0 else -1) if r["kind"] == "mate" else r["value"]


def init_worker():
    global ENG
    import multiprocessing.util as mu
    from engine import Engine
    ENG = Engine()
    mu.Finalize(None, ENG.close, exitpriority=10)


# ----------------------------------------------------------------------------------------------------------------
# motif handlers: (board, move) -> dict(fact, claims(list of (type, statement, params)), rot, theme, hint2, hint3, nodes, skill) or None
# ----------------------------------------------------------------------------------------------------------------
def after_board(board, move):
    b = board.copy(stack=False)
    b.push(move)
    return b


def pname(board, sq):
    return PN[board.piece_type_at(sq)]


def m_outpost(board, move):
    if not S.mp_to_outpost(board, move):
        return None
    c = board.turn
    after = after_board(board, move)
    d = chess.square_name(move.to_square)
    sup = sorted(chess.square_name(q) for q in board.pieces(chess.PAWN, c) if (chess.BB_PAWN_ATTACKS[c][q] >> move.to_square) & 1)
    if not sup:
        return None
    pc = board.piece_at(move.from_square)
    san = board.san(move)
    return dict(skill="POS.OUTPOST.D2", nodes=["POS.OUTPOST"], cue_theme="Theme: outposts. Look for a square that your pawns defend and that no enemy pawn can ever attack.",
                claims=[("piece_on", f"After {san} the {PN[pc.piece_type]} stands on {d}.", dict(square=d, piece=pc.symbol(), after_move=move.uci())),
                        ("piece_attacks", f"The {CN[c]} pawn on {sup[0]} defends {d}.", dict(square=sup[0], includes=[d])),
                        ("outposts", f"After {san}, {d} is an outpost square for {CT[c]} holding its own piece.", dict(color=CN[c], occupied="own", includes=[d], after_move=move.uci()))],
                fact=f"{san} puts the {PN[pc.piece_type]} on {d}, an outpost square: the {CN[c]} pawn on {sup[0]} defends it and no {CN[not c]} pawn can attack it now or by advancing.",
                rot="a piece on an outpost cannot be driven away by pawns, so it can stay and press on the enemy position.",
                h2="Is there a square on your 4th to 6th rank that one of your pawns defends and no enemy pawn can ever attack?", h3=f"A {PN[pc.piece_type]} makes the move.", ptype=pc.piece_type)


def m_openfile(board, move):
    if not S.mp_rook_to_open_file(board, move):
        return None
    c = board.turn
    d = chess.square_name(move.to_square)
    fl = S.open_files(after_board(board, move))
    f = d[0]
    san = board.san(move)
    return dict(skill="POS.OPENFILE.D2", nodes=["POS.OPENFILE"], cue_theme="Theme: files. Is there a file where a rook would have no pawns in its way?",
                claims=[("piece_on", f"After {san} the rook stands on {d}.", dict(square=d, piece="R" if c == W else "r", after_move=move.uci())),
                        ("open_files", f"After {san} the open files are {join_and(fl['open'])}.", dict(open=fl["open"], after_move=move.uci()))],
                fact=f"{san} puts the rook on the {f}-file, which has no pawn of either colour (open files after the move: {join_and(fl['open'])}).",
                rot="a rook is strongest where no pawn blocks it; an open file gives it squares to enter and targets to hit.",
                h2="Which files have no pawns at all, and can a rook reach one in a single move?", h3="A rook makes the move.", ptype=chess.ROOK)


def m_halfopen(board, move):
    if not S.mp_rook_to_half_open_file(board, move):
        return None
    c = board.turn
    d = chess.square_name(move.to_square)
    fl = S.open_files(after_board(board, move))
    key = "half_open_white" if c == W else "half_open_black"
    san = board.san(move)
    return dict(skill="POS.OPENFILE.D2", nodes=["POS.OPENFILE"], cue_theme="Theme: files. Is there a file with an enemy pawn on it but none of yours?",
                claims=[("piece_on", f"After {san} the rook stands on {d}.", dict(square=d, piece="R" if c == W else "r", after_move=move.uci())),
                        ("open_files", f"After {san} the files half-open for {CT[c]} are {join_and(fl[key])}.", {key: fl[key], "after_move": move.uci()})],
                fact=f"{san} puts the rook on the {d[0]}-file, which has no {CN[c]} pawn but at least one {CN[not c]} pawn (half-open for {CT[c]}).",
                rot="a rook on a half-open file presses on the enemy pawn in front of it without a pawn of its own in the way.",
                h2="Which files have an enemy pawn but none of yours, and can a rook reach one in a single move?", h3="A rook makes the move.", ptype=chess.ROOK)


def m_connect(board, move):
    if not S.mp_connects_rooks(board, move):
        return None
    c = board.turn
    san = board.san(move)
    pc = board.piece_at(move.from_square)
    return dict(skill="POS.CONNECT.D2", nodes=["POS.CONNECT"], cue_theme="Theme: development. Are your rooks connected yet?",
                claims=[("rooks_connected", f"Before the move {CT[c]}'s rooks are not connected.", dict(color=CN[c], value=False)),
                        ("rooks_connected", f"After {san} {CT[c]}'s rooks are connected.", dict(color=CN[c], value=True, after_move=move.uci()))],
                fact=f"{san} connects {CT[c]}'s rooks: afterwards they stand on one rank or file with nothing between them.",
                rot="connected rooks defend each other and can use the same file together; connecting them is often the last step of development.",
                h2="Which of your pieces stands between your rooks, and where can it go?", h3=f"A {PN[pc.piece_type]} makes the move.", ptype=pc.piece_type)


def m_seventh(board, move):
    if not S.mp_rook_to_seventh(board, move):
        return None
    c = board.turn
    after = after_board(board, move)
    d = chess.square_name(move.to_square)
    att = S.attacked_squares(after, move.to_square)
    pawns = sorted(chess.square_name(s) for s in chess.SQUARES if S.rr(c, s) == 6 and chess.square_name(s) in att and after.piece_at(s) == chess.Piece(chess.PAWN, not c))
    if not pawns:
        return None
    san = board.san(move)
    claims = [("piece_on", f"After {san} the rook stands on {d}.", dict(square=d, piece="R" if c == W else "r", after_move=move.uci())),
              ("piece_attacks", f"After {san} the rook attacks {join_and(pawns)}.", dict(square=d, includes=pawns, after_move=move.uci()))]
    for p in pawns:
        claims.append(("piece_on", f"{p} holds an enemy pawn.", dict(square=p, piece="p" if c == W else "P")))
    return dict(skill="POS.SEVENTH.D2", nodes=["POS.SEVENTH"], cue_theme="Theme: the seventh rank (seen from your side).",
                claims=claims, fact=f"{san} puts the rook on the seventh rank, where it attacks {join_and(pawns)}.",
                rot="a rook on the seventh rank attacks pawns from behind and can cut the enemy king off.",
                h2="Can a rook reach the seventh rank, and what stands on that rank?", h3="A rook makes the move.", ptype=chess.ROOK)


def m_blockade(board, move):
    if not S.mp_blockades_passed(board, move):
        return None
    c = board.turn
    after = after_board(board, move)
    bl = S.pawn_set(after, "blockaded_passed", not c)
    mine = [p for p in bl if S.stop_square(not c, chess.parse_square(p)) == move.to_square]
    if not mine:
        return None
    pc = board.piece_at(move.from_square)
    d = chess.square_name(move.to_square)
    san = board.san(move)
    return dict(skill="POS.BLOCKADE.D2", nodes=["POS.BLOCKADE", "POS.PASSED"], cue_theme="Theme: passed pawns. Does the opponent have one that you can stop?",
                claims=[("piece_on", f"After {san} the {PN[pc.piece_type]} stands on {d}.", dict(square=d, piece=pc.symbol(), after_move=move.uci())),
                        ("pawn_set", f"After {san} the {CN[not c]} passed pawn on {mine[0]} is blockaded.", dict(kind="blockaded_passed", color=CN[not c], includes=[mine[0]], after_move=move.uci()))],
                fact=f"{san} puts the {PN[pc.piece_type]} on {d}, directly in front of the {CN[not c]} passed pawn on {mine[0]}: the pawn is blockaded.",
                rot="a piece in front of a passed pawn stops it from advancing, and a knight there is hard to dislodge.",
                h2="Does the opponent have a passed pawn? Which square is directly in front of it?", h3=f"A {PN[pc.piece_type]} makes the move.", ptype=pc.piece_type)


def m_target(board, move):
    c = board.turn
    pc = board.piece_at(move.from_square)
    if pc.piece_type == chess.PAWN or board.is_capture(move):
        return None
    after = after_board(board, move)
    att_after = set(S.attacked_squares(after, move.to_square))
    att_before = set(S.attacked_squares(board, move.from_square))
    weak = {}
    for kind in ("isolated", "backward"):
        for s in S.pawn_set(after, kind, not c):
            weak.setdefault(s, kind)
    new = sorted(s for s in weak if s in att_after and s not in att_before)
    if not new:
        return None
    t = new[0]
    d = chess.square_name(move.to_square)
    o = chess.square_name(move.from_square)
    san = board.san(move)
    kind = weak[t]
    return dict(skill="POS.TARGET.D2", nodes=["POS.TARGET", "POS.PAWNWEAK"], cue_theme="Theme: weak pawns. Does the opponent have an isolated or backward pawn you could pressure?",
                claims=[("piece_attacks", f"The {PN[pc.piece_type]} on {o} does not attack {t}.", dict(square=o, excludes=[t])),
                        ("piece_attacks", f"After {san} the {PN[pc.piece_type]} on {d} attacks {t}.", dict(square=d, includes=[t], after_move=move.uci())),
                        ("pawn_set", f"After {san} the {kind} {CN[not c]} pawns include {t}.", dict(kind=kind, color=CN[not c], includes=[t], after_move=move.uci()))],
                fact=f"{san} brings the {PN[pc.piece_type]} to {d}, where it attacks the {kind} {CN[not c]} pawn on {t} (it did not attack it before).",
                rot="a weak pawn that cannot easily be defended or moved makes a lasting target.",
                h2="Which enemy pawns are isolated or backward, and which of your pieces could attack one of them?", h3=f"A {PN[pc.piece_type]} makes the move.", ptype=pc.piece_type)


def m_lever(board, move):
    c = board.turn
    pc = board.piece_at(move.from_square)
    if pc.piece_type != chess.PAWN or board.is_capture(move) or move.promotion:
        return None
    after = after_board(board, move)
    d = chess.square_name(move.to_square)
    att = S.attacked_squares(after, move.to_square)
    targets = sorted(s for s in att if after.piece_at(chess.parse_square(s)) == chess.Piece(chess.PAWN, not c))
    if not targets:
        return None
    t = targets[0]
    san = board.san(move)
    return dict(skill="POS.BREAKS.D2", nodes=["POS.BREAKS"], cue_theme="Theme: pawn breaks. Can a pawn step forward to challenge an enemy pawn?",
                claims=[("piece_attacks", f"After {san} the pawn on {d} attacks {t}.", dict(square=d, includes=[t], after_move=move.uci())),
                        ("piece_on", f"{t} holds an enemy pawn.", dict(square=t, piece="p" if c == W else "P"))],
                fact=f"{san} is a pawn lever: afterwards the pawn on {d} attacks the {CN[not c]} pawn on {t}.",
                rot="a lever offers a pawn exchange that can open a file or diagonal or change the structure; who benefits depends on the position.",
                h2="Which of your pawns could step forward to a square where it attacks an enemy pawn?", h3=f"A pawn on the {chess.square_name(move.from_square)[0]}-file moves.", ptype=chess.PAWN)


def m_mobility(board, move):
    c = board.turn
    pc = board.piece_at(move.from_square)
    if pc.piece_type not in (chess.KNIGHT, chess.BISHOP, chess.ROOK, chess.QUEEN) or board.is_capture(move) or board.gives_check(move):
        return None
    a = S.mobility(board, move.from_square, "squares")
    after = after_board(board, move)
    b = S.mobility(after, move.to_square, "squares")
    if b - a < 4:
        return None
    o, d = chess.square_name(move.from_square), chess.square_name(move.to_square)
    san = board.san(move)
    return dict(skill="POS.ACTIVITY.D2", nodes=["POS.ACTIVITY"], cue_theme="Theme: piece activity. Which of your pieces attacks the fewest squares?",
                claims=[("mobility", f"Before the move the {PN[pc.piece_type]} on {o} attacks {a} squares that none of {CT[c]}'s pieces occupy.", dict(square=o, mode="squares", count=a)),
                        ("mobility", f"After {san} the {PN[pc.piece_type]} on {d} attacks {b} such squares.", dict(square=d, mode="squares", count=b, after_move=move.uci()))],
                fact=f"{san} improves the {PN[pc.piece_type]}: it attacks {a} squares not held by {CT[c]}'s own pieces from {o} and {b} from {d}.",
                rot="a piece that reaches more squares can do more; the move that most improves the worst-placed piece is often a good quiet move.",
                h2="Which of your pieces has the fewest squares to go to, and where would it have more?", h3=f"A {PN[pc.piece_type]} makes the move.", ptype=pc.piece_type)


HANDLERS = {"outpost": m_outpost, "openfile": m_openfile, "halfopen": m_halfopen, "connect": m_connect, "seventh": m_seventh, "blockade": m_blockade,
            "target": m_target, "lever": m_lever, "mobility": m_mobility}


# ----------------------------------------------------------------------------------------------------------------
# worker: screen at low depth, confirm at depth 16, build claims, pre-check with the validator's own check_claim
# ----------------------------------------------------------------------------------------------------------------
def work(task):
    import validate
    motif, rec = task
    board = chess.Board(rec["fen"])
    c = board.turn
    try:
        r0 = ENG.search(rec["fen"], depth=DEPTH_SCREEN, multipv=1)[1]
        m0 = chess.Move.from_uci(r0["pv"][0])
        if board.is_capture(m0) or board.gives_check(m0) or HANDLERS[motif](board, m0) is None:
            return None
        res = ENG.search(rec["fen"], depth=16, multipv=5)
        if len(res) < 5:
            return None
        best = res[1]
        if best["kind"] != "cp" or abs(best["value"]) > 300:
            return None
        top = chess.Move.from_uci(best["pv"][0])
        if board.is_capture(top) or board.gives_check(top):
            return None
        h = HANDLERS[motif](board, top)
        if h is None:
            return None
        scores = [(sc(r), r["pv"][0]) for _k, r in sorted(res.items())]
        b = scores[0][0]
        accepted = [m for s, m in scores if b - s <= WITHIN]
        if not (1 <= len(accepted) <= 3) or b - scores[4][0] < 50:
            return None
        if accepted[0] != best["pv"][0]:
            return None
        wrong = [(b - s, m) for s, m in scores if b - s > WITHIN]
        wrong_m = wrong[0] if wrong else None
        san_best = board.san(top)
        sans = [board.san(chess.Move.from_uci(m)) for m in accepted]
        cl = Cl().add("best_move_in", f"The engine's best move (Stockfish 19 lite, depth 16) is {san_best}; the accepted move{'s' if len(accepted) > 1 else ''} {join_and(sans)} {'are' if len(accepted) > 1 else 'is'} within {WITHIN} cp of it.",
                      moves=accepted, within_cp=WITHIN)
        for ctype, stmt, params in h["claims"]:
            cl.add(ctype, stmt, **params)
        feedback = {}
        if wrong_m and wrong_m[0] >= 60:
            cp = max(40, int(wrong_m[0] * 0.7) // 10 * 10)
            wsan = board.san(chess.Move.from_uci(wrong_m[1]))
            cl.add("move_loses", f"{wsan} is at least {cp} cp worse than the best move (engine, depth 16).", move=wrong_m[1], cp=cp)
            feedback[wrong_m[1]] = f"{wsan} is at least {cp} centipawns worse than the engine's best move here (depth 16)."
        pos = {"id": "tmp", "fen": rec["fen"], "family": "x", "provenance": {"kind": "lichess_game", "licence": "CC0"}}
        for cc in cl.items:
            rr = validate.check_claim(ENG, pos, cc)
            if rr["result"] != "pass":
                return ("reject", motif, cc["type"])
        ev = best["value"] * (1 if c == W else -1)
        return dict(motif=motif, rec=rec, accepted=accepted, sans=sans, san_best=san_best, claims=cl.items, handler={k: v for k, v in h.items() if k != "claims"},
                    feedback=feedback, eval_white=ev)
    except Exception as ex:  # a worker error must not kill the run; it is reported as a reject
        return ("error", motif, repr(ex)[:80])


# ----------------------------------------------------------------------------------------------------------------
def build_item(res, n_in_motif, B):
    rec, h = res["rec"], res["handler"]
    board = chess.Board(rec["fen"])
    c = board.turn
    cue = 2 if n_in_motif % 3 == 2 else 3
    prompt = f"{CT[c]} to move. Find a strong move." + (f" {h['cue_theme']}" if cue == 2 else "")
    sans = res["sans"]
    others = f"; {join_and(sans[1:])} {'is' if len(sans) == 2 else 'are'} within {WITHIN} cp of it" if len(sans) > 1 else ""
    expl = (f"Engine evidence (Stockfish 19 lite, depth 16, one thread): {res['san_best']} is the top choice{others}. {h['fact']} "
            f"Rule of thumb, not proved by the engine: {h['rot']}")
    item = mk(h["skill"], cue, "find_move", prompt, {"moves": res["accepted"]}, res["claims"], h["nodes"],
              ["List your pieces and ask which one has the worst job, or which feature of the position you could use.", h["h2"], h["h3"]],
              expl, C.fam(rec), tpl=f"quiet-{res['motif']}", feedback=res["feedback"] or None, status="needs-human", kind="quiet",
              source={"kind": "lichess_game", "id": f"{rec['g']}#{rec['p']}"}, extra=("engine.depth16",))
    return board, item


def main():
    workers = 10
    if "--workers" in sys.argv:
        workers = int(sys.argv[sys.argv.index("--workers") + 1])
    reg = C.make_registry(BASE)
    pre = C.PreCheck()
    B = C.PBuilder(AREA, BASE, SEED, reg, pre)
    rng = random.Random(SEED)
    sel = {}
    for motif, prop in POOLSEL.items():
        sel[motif] = (lambda r, prop=prop: bool(r["m"].get(prop)))
    sel["any"] = lambda r: True
    recs, seen = psel.collect(sel, SEED, cap=3000)
    print("pools:", {k: seen[k] for k in sorted(seen)})
    pools = {m: list(recs[m]) for m in QUOTA if m in POOLSEL}
    for m in ("target", "lever", "mobility"):
        pools[m] = list(recs["any"])
        rng.shuffle(pools[m])
    done = {m: 0 for m in QUOTA}
    stats = {m: dict(tried=0, ok=0, rejects={}) for m in QUOTA}
    used_games = {}
    if EXTRA:                                               # never reuse a game of the first batch
        for p in sorted(C.ITEMS_DIR.glob(C.PREFIX + "quiet-*.json")):
            for pos in json.loads(p.read_text(encoding="utf-8"))["positions"]:
                used_games[pos["family"].replace("FAM-PS-", "")] = 1
    ctx = mp.get_context("spawn")
    pool = ctx.Pool(workers, initializer=init_worker)
    pos_in = {m: 0 for m in QUOTA}
    rounds = 0
    try:
        while any(done[m] < QUOTA[m] for m in QUOTA) and rounds < 60:
            rounds += 1
            tasks = []
            for m in QUOTA:
                if done[m] >= QUOTA[m]:
                    continue
                need = QUOTA[m] - done[m]
                take = pools[m][pos_in[m]: pos_in[m] + max(workers, need * 8)]
                pos_in[m] += len(take)
                tasks += [(m, r) for r in take]
            if not tasks:
                break
            results = pool.map(work, tasks, chunksize=2)         # ordered, so the run is reproducible
            for (motif, rec), out in zip(tasks, results):
                st = stats[motif]
                st["tried"] += 1
                if out is None:
                    continue
                if isinstance(out, tuple):
                    st["rejects"][out[2]] = st["rejects"].get(out[2], 0) + 1
                    continue
                if done[motif] >= QUOTA[motif] or used_games.get(rec["g"], 0) >= 1:
                    continue
                board, item = build_item(out, done[motif], B)
                iid = B.add(board, C.fam(rec), item, C.prov(rec), label="quiet-" + motif, precheck=False)
                if iid:
                    done[motif] += 1
                    used_games[rec["g"]] = used_games.get(rec["g"], 0) + 1
                    st["ok"] += 1
            print(f"round {rounds}: done {done}", flush=True)
    finally:
        pool.close()
        pool.join()
    names = C.split_write(B, BASE, chunk=12 if EXTRA else 60)
    print("items", len(B.items), "per node", dict(B.by_node))
    print("per motif", {m: (done[m], stats[m]["tried"], stats[m]["rejects"]) for m in QUOTA})
    print("builder stats", dict(B.stats))
    print("files", names)
    pre.close()


if __name__ == "__main__":
    main()
