"""Family 10 (added because lessons practise it): square names (FND.BOARD).

There is no chess-rule fact in 'tap e4', so the square-naming drills are tied to a legal move, which `legal_move` verifies:
  D1 / cue 1   "Play g1 to f3." (a move given by square names)      find_move, claim legal_move
  D2 / cue 3   "Move the bishop to f4." / "Capture the piece on d5."  find_move; accepted set = EVERY legal move that fits
               (computed with python-chess), one `legal_move` claim per accepted move.
Random quiet middlegame-style positions (3-5 pieces a side), no pinned pieces, side to move not in check. Half of the
bases have Black to move (the board is then shown from Black's side, which is the point of the D2 drill). Each base is a
family with 3 positions (original, mirror, colour-flip).

    python tools/generators/gen_board.py          # writes content/items/gen-t0-board.json
"""
from __future__ import annotations

import sys as _s, pathlib as _p
_s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import chess

from common import *  # noqa: F401,F403
from gen_loose import random_cluster

AREA, MODULE, SEED, FILE = "BOARD", "board", 20261102, "gen-t0-board.json"

HINTS_D1 = ["Find the first square by its file letter (a-h) and its rank number (1-8). Remember the board may be turned.",
            "Files are the columns, ranks are the rows. Count columns for the letter and rows for the number from the side where that colour starts.",
            "Check that you picked the piece on the first square and the empty square (or enemy piece) on the second."]
HINTS_D2 = ["Say the target square to yourself: letter for the column, number for the row.",
            "Look along the file and the rank of that square for a piece of the right kind that can get there.",
            "Check the piece can really reach the square: nothing in the way, and the move follows the piece's own rule."]


def variant_board(base, kind):
    return {"orig": base.copy(stack=False), "mirror": mirror_files(base), "flip": colour_flip(base)}[kind]


def tmap(s, kind):
    return {"orig": s, "mirror": s ^ 7, "flip": s ^ 56}[kind]


def quiet_moves(board):
    out = []
    for m in board.legal_moves:
        if board.is_capture(m) or m.promotion or board.gives_check(m):
            continue
        out.append(m)
    return out


def emit_d1(b, vb, mv, fam, kind):
    col = vb.turn
    a, t = chess.square_name(mv.from_square), chess.square_name(mv.to_square)
    item = {"skill": "FND.BOARD.D1", "cue": 1, "task": "find_move",
            "prompt": f"{CTITLE[col]} to move. Play {a} to {t}: move the piece on {a} to {t}.",
            "answer": {"moves": [mv.uci()]},
            "claims": [claim("C1", "legal_move", f"{a} to {t} is a legal move.", move=mv.uci())],
            "tags": tags_for(["FND.BOARD"], 0, 1, fam, ["task.find_move", "board.name-to-square"]),
            "hints": HINTS_D1,
            "explain": f"The piece on {a} can legally move to {t}: {a} is file {a[0]}, rank {a[1]}; {t} is file {t[0]}, rank {t[1]}."}
    return b.add(vb, fam, item, f"square names D1 {kind}", label="board-d1")


def emit_d2(b, vb, piece_type, target, fam, kind, capture):
    col = vb.turn
    tsq = chess.square_name(target)
    acc = [m for m in vb.legal_moves if m.to_square == target and vb.piece_type_at(m.from_square) == piece_type and not m.promotion
           and (vb.is_capture(m) == capture)]
    if not acc or len(acc) > 2:
        return None
    acc.sort(key=lambda m: m.uci())
    if capture:
        prompt = f"{CTITLE[col]} to move. Capture the piece on {tsq} with your {PNAME[piece_type]}."
        expl = f"The {PNAME[piece_type]} on {chess.square_name(acc[0].from_square)} can capture on {tsq}."
    else:
        prompt = f"{CTITLE[col]} to move. Move your {PNAME[piece_type]} to {tsq}."
        expl = f"The {PNAME[piece_type]} on {chess.square_name(acc[0].from_square)} can move to {tsq}: file {tsq[0]}, rank {tsq[1]}." if len(acc) == 1 else \
            f"A {PNAME[piece_type]} can reach {tsq} from {join_squares([chess.square_name(m.from_square) for m in acc])}; any of these moves is legal."
    item = {"skill": "FND.BOARD.D2", "cue": 3, "task": "find_move", "prompt": prompt,
            "answer": {"moves": [m.uci() for m in acc]},
            "claims": [claim(f"C{i + 1}", "legal_move", f"{m.uci()} is a legal move.", move=m.uci()) for i, m in enumerate(acc)],
            "tags": tags_for(["FND.BOARD"], 0, 3, fam, ["task.find_move", "board.square-to-piece"]),
            "hints": HINTS_D2, "explain": expl}
    return b.add(vb, fam, item, f"square names D2 {kind}", label="board-d2")


def build(registry, pre):
    b = Builder(AREA, MODULE, SEED, registry, pre)
    rng = b.rng
    plan = ["d1"] * 5 + ["d2q"] * 4 + ["d2c"] * 3
    for i, what in enumerate(plan):
        fam = f"FAM-GEN-BOARD-{i + 1:02d}"
        for attempt in range(400):
            base = random_cluster(rng)
            if base is None:
                continue
            if i % 2 == 1:
                base = colour_flip(base)
            base.turn = base.turn
            if what == "d1":
                qm = quiet_moves(base)
                if not qm:
                    continue
                mv = rng.choice(qm)
                if emit_d1(b, base, mv, fam, "orig"):
                    for kind in ("mirror", "flip"):
                        vb = variant_board(base, kind)
                        vm = chess.Move(tmap(mv.from_square, kind), tmap(mv.to_square, kind))
                        if vm in vb.legal_moves:
                            emit_d1(b, vb, vm, fam, kind)
                    break
            else:
                capture = what == "d2c"
                cands = []
                for m in base.legal_moves:
                    if base.is_capture(m) != capture or m.promotion:
                        continue
                    pt = base.piece_type_at(m.from_square)
                    cands.append((pt, m.to_square))
                if not cands:
                    continue
                pt, tgt = rng.choice(cands)
                if emit_d2(b, base, pt, tgt, fam, "orig", capture):
                    for kind in ("mirror", "flip"):
                        vb = variant_board(base, kind)
                        emit_d2(b, vb, pt, tmap(tgt, kind), fam, kind, capture)
                    break
        else:
            b.stats["no-base"] += 1
    return {FILE: b}


def main():
    reg = Registry.for_module(MODULE)
    pre = PreCheck()
    try:
        builders = build(reg, pre)
        for fname, bl in builders.items():
            bl.write(fname)
            print(fname, len(bl.items), "items", dict(bl.stats))
        for k, v in pre.rejects.items():
            print("reject", k, v, pre.reject_examples[k])
    finally:
        pre.close()


if __name__ == "__main__":
    main()
