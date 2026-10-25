"""Pawn majorities in pawn endings, checked against the Lichess tablebase (exact for <= 7 pieces):
K+3P v K+2P with White's three pawns on one wing against two Black pawns (a 3 v 2 majority), kings placed at random.
  * "Does White win or draw?"  (classify_position; claim: tablebase result for the side to move)
  * "Which move wins?"         (find_move; accepted set = every winning move in the tablebase move list; claims: tablebase for each accepted
                               move and for one tempting non-winning pawn move)
Positions are random but seeded; only positions with the wanted result are kept. These items verify the RESULT, not any
rule of thumb such as "advance the candidate pawn first"; the explanation says only what the tablebase shows.

    ./tools/.venv/Scripts/python.exe -I tools/positional/gen_endings.py
"""
import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chess
import pcommon as C
import validate
from pcommon import Cl, mk, CN, CT, PN, join_and, FILES

SEED = 20261107
W, Bk = chess.WHITE, chess.BLACK


def mover_view(cat, after_move):
    m = {"win": "win", "cursed-win": "draw", "draw": "draw", "blessed-loss": "draw", "loss": "loss", "maybe-win": "win", "syzygy-win": "win", "maybe-loss": "loss", "syzygy-loss": "loss"}.get(cat, cat)
    if after_move:
        m = {"win": "loss", "loss": "win", "draw": "draw"}.get(m, m)
    return m


def random_position(rng, wing):
    files = [0, 1, 2] if wing == "queenside" else [5, 6, 7]
    b = chess.Board(None)
    b.castling_rights = 0
    wp = [chess.square(f, rng.choice([1, 1, 1, 2, 3])) for f in files]
    bf = rng.sample(files, 2)
    bp = [chess.square(f, rng.choice([4, 5, 5, 6, 6])) for f in bf]
    for s in wp:
        b.set_piece_at(s, chess.Piece(chess.PAWN, W))
    for s in bp:
        if b.piece_at(s) is None:
            b.set_piece_at(s, chess.Piece(chess.PAWN, Bk))
    lo, hi = (0, 4) if wing == "queenside" else (4, 7)             # kings stand near the action: files of the wing +-1, own half of the board
    wk = [s for s in chess.SQUARES if b.piece_at(s) is None and lo <= chess.square_file(s) <= hi and chess.square_rank(s) <= 3]
    bk = [s for s in chess.SQUARES if b.piece_at(s) is None and lo <= chess.square_file(s) <= hi and chess.square_rank(s) >= 4]
    b.set_piece_at(rng.choice(wk), chess.Piece(chess.KING, W))
    bk = [s for s in bk if b.piece_at(s) is None]
    b.set_piece_at(rng.choice(bk), chess.Piece(chess.KING, Bk))
    b.turn = W
    if not b.is_valid() or b.is_check() or len(b.piece_map()) != 7:
        return None
    if chess.square_distance(b.king(W), b.king(Bk)) < 2:
        return None
    return b


def main():
    rng = random.Random(SEED)
    reg = C.make_registry("endings")
    pre = C.PreCheck()
    B = C.PBuilder("END", "endings", SEED, reg, pre)
    wins, draws, wins_cls = [], [], []
    tries = 0
    while (len(wins) < 8 or len(draws) < 4 or len(wins_cls) < 4) and tries < 3000:
        tries += 1
        wing = rng.choice(["queenside", "kingside"])
        b = random_position(rng, wing)
        if b is None or reg.has(b.fen()):
            continue
        d = validate.tb_query(b.fen())
        if d is None:
            continue
        res = mover_view(d["category"], False)
        moves = {m["uci"]: mover_view(m["category"], True) for m in d["moves"]}
        winning = sorted(m for m, v in moves.items() if v == "win")
        if res == "win" and 1 <= len(winning) <= 2 and len(wins) < 8:
            wins.append((b, wing, winning, moves))
        elif res == "win" and len(wins_cls) < 4:
            wins_cls.append((b, wing, winning, moves))
        elif res == "draw" and not winning and len(draws) < 4:
            draws.append((b, wing, moves))
    validate.tb_flush()
    print(f"tablebase queries: {tries}; wins {len(wins)}, classify-wins {len(wins_cls)}, draws {len(draws)}")
    n = 0
    for b, wing, winning, moves in wins:
        fam = f"FAM-PS-END-{n}"
        n += 1
        sans = [b.san(chess.Move.from_uci(m)) for m in winning]
        pawn_moves = [m for m, v in moves.items() if v != "win" and b.piece_type_at(chess.parse_square(m[:2])) == chess.PAWN]
        cl = Cl().add("tablebase", "White to move wins (Lichess tablebase, exact).", result="win")
        for m, san in zip(winning, sans):
            cl.add("tablebase", f"After {san} White still wins.", result="win", move=m)
        feedback = {}
        wrong_txt = ""
        if pawn_moves:
            wm = rng.choice(sorted(pawn_moves))
            wsan = b.san(chess.Move.from_uci(wm))
            cl.add("tablebase", f"After {wsan} the result is only a {moves[wm]} for White.", result=moves[wm], move=wm)
            feedback[wm] = f"After {wsan} the tablebase result is a {moves[wm]} for White, not a win."
            wrong_txt = f" {wsan}, for example, only {'draws' if moves[wm] == 'draw' else 'loses'}."
        item = mk("POS.MAJORITY.D2", 2, "find_move",
                  f"White to move: three White pawns on the {wing} against two Black pawns, and the kings. White can win. Find a winning move.",
                  {"moves": winning}, cl, ["POS.MAJORITY", "END.KPK"] if False else ["POS.MAJORITY"],
                  ["Count the pawns on each wing: where does White have more?", "A win needs a passed pawn that the Black king cannot catch or stop, or a king that gets in first. Check both kings' distances.",
                   f"{len(winning)} move{'s' if len(winning) != 1 else ''} win{'s' if len(winning) == 1 else ''}" + (f"; {'it is' if len(winning) == 1 else 'they are'} made by a {'pawn' if b.piece_type_at(chess.parse_square(winning[0][:2])) == chess.PAWN else 'king'}." if len({b.piece_type_at(chess.parse_square(m[:2])) for m in winning}) == 1 else ".")],
                  f"The tablebase confirms that {join_and(sans)} win{'s' if len(sans) == 1 else ''} for White.{wrong_txt} This verifies the result of the moves; it does not prove any rule of thumb about which pawn to push first.",
                  fam, feedback=feedback or None, status="needs-human", extra=("source.tablebase",))
        B.add(b, fam, item, {"kind": "generated", "ref": f"tools/positional/gen_endings.py seed={SEED}: random K+3P v K+2P, {wing}", "licence": "project"}, label="end-win")
    for b, wing, moves in draws:
        fam = f"FAM-PS-END-{n}"
        n += 1
        opts = ["White wins", "The game is drawn"]
        cl = Cl().add("tablebase", "With White to move the position is a draw (Lichess tablebase, exact).", result="draw")
        item = mk("POS.MAJORITY.D2", 2, "classify_position",
                  f"White to move: three White pawns on the {wing} against two Black pawns, and the kings. With best play from both sides, what is the result?",
                  {"class": opts[1]}, cl, ["POS.MAJORITY"],
                  ["Look at the kings first: how far is each from the pawns that matter?", "A majority wins only if it can make a passed pawn that the enemy king cannot stop in time.",
                   "Count the moves the pawns need and the moves the Black king needs."],
                  "The tablebase shows a draw with White to move: no move wins. A pawn majority is not a win by itself; the king positions and the tempo decide.",
                  fam, options=opts, status="needs-human", extra=("source.tablebase",))
        B.add(b, fam, item, {"kind": "generated", "ref": f"tools/positional/gen_endings.py seed={SEED}: random K+3P v K+2P, {wing}", "licence": "project"}, label="end-draw")
    for b, wing, winning, moves in wins_cls:
        fam = f"FAM-PS-END-{n}"
        n += 1
        opts = ["White wins", "The game is drawn"]
        cl = Cl().add("tablebase", "With White to move the position is a win for White (Lichess tablebase, exact).", result="win")
        item = mk("POS.MAJORITY.D2", 2, "classify_position",
                  f"White to move: three White pawns on the {wing} against two Black pawns, and the kings. With best play from both sides, what is the result?",
                  {"class": opts[0]}, cl, ["POS.MAJORITY"],
                  ["Look at the kings first: how far is each from the pawns that matter?", "A majority wins only if it can make a passed pawn that the enemy king cannot stop in time.",
                   "Count the moves the pawns need and the moves the Black king needs."],
                  "The tablebase shows a win for White with White to move. The majority is not decisive by itself: this position is won because of how the kings and pawns stand.",
                  fam, options=opts, status="needs-human", extra=("source.tablebase",))
        B.add(b, fam, item, {"kind": "generated", "ref": f"tools/positional/gen_endings.py seed={SEED}: random K+3P v K+2P, {wing}", "licence": "project"}, label="end-wincls")
    names = C.split_write(B, "endings", chunk=60)
    print("items", len(B.items), "per node", dict(B.by_node), "stats", dict(B.stats), "rejects", dict(pre.rejects))
    print("files", names)
    pre.close()


if __name__ == "__main__":
    main()
