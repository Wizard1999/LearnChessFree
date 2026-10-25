"""lp2 (TAC.STALEMATE-TRICK): constructed positions, because the Lichess puzzle data has none.

The puzzle database almost never contains a stalemating line (a scan of 9,081 equality / defensive endgames with the solver at least
two points behind found 13 whose engine line reaches one, 10 of them verified; see docs/exercises-themes.md). So most items are
GENERATED, labelled as such (provenance kind 'generated', licence 'project'), together with the compensation items from real games the
only non-puzzle positions in the lp2 files.

NOTE: this first generator (tablebase first) found nothing in 47 minutes. Use l2_stalemate_gen2.py (engine first); it imports build()
and CONFIGS from here.

Method (seeded, rerunnable):
  1. Random legal positions with the weaker side (the solver) to move, from a short list of material sets in which stalemate
     resources are known to exist (K+P on the seventh against K+Q, K+P against K+R, K+R against K+Q, K+N against K+Q, K+B against K+Q).
  2. Exact tablebase (Lichess service, <= 7 pieces): the solver's result must be a DRAW although the solver is at least three
     points of material behind, and at most three moves keep the draw.
  3. Engine (depth 16): the principal variation from the position starts with a drawing move and reaches a stalemate within
     14 plies (the solver stalemates the opponent, or the opponent's forced capture stalemates the solver).
  4. Claims: one `tablebase` claim per accepted move (result draw) and one on a wrong move that loses (feedback).
What is NOT claimed: that the draw is "by stalemate". The tablebase proves the result, the engine line only shows a stalemate on
the way; the cue-1 siblings that name the theme are therefore needs-human.

    python l2_stalemate_gen.py [target=40]        writes content/items/lp2-stalemate-1.json
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json, random, time, urllib.parse, urllib.request
from l2_common import *
import l2_tb as T

CONFIGS = [   # name, solver pieces (type, relative rank or None), opponent pieces
    ("KP7vKQ", [(chess.PAWN, 6)], [(chess.QUEEN, None)]),
    ("KP6vKQ", [(chess.PAWN, 5)], [(chess.QUEEN, None)]),
    ("KP7vKR", [(chess.PAWN, 6)], [(chess.ROOK, None)]),
    ("KRvKQ", [(chess.ROOK, None)], [(chess.QUEEN, None)]),
    ("KNvKQ", [(chess.KNIGHT, None)], [(chess.QUEEN, None)]),
    ("KBvKQ", [(chess.BISHOP, None)], [(chess.QUEEN, None)]),
    ("KBPvKQ", [(chess.BISHOP, None), (chess.PAWN, 5)], [(chess.QUEEN, None)]),
]
SIDE = {chess.WHITE: "White", chess.BLACK: "Black"}


def material(b, c):
    return sum(VAL[p.piece_type] for p in b.piece_map().values() if p.color == c)


def rand_pos(cfg, rng):
    name, mine, theirs = cfg
    for _ in range(500):
        mover = rng.choice([chess.WHITE, chess.BLACK])
        b = chess.Board(None); b.turn = mover
        used = set(); sqs = list(chess.SQUARES)
        def put(pt, color, rel):
            rng.shuffle(sqs)
            for s in sqs:
                if s in used:
                    continue
                r = chess.square_rank(s) if color == chess.WHITE else 7 - chess.square_rank(s)
                if pt == chess.PAWN:
                    if rel is not None and r != rel:
                        continue
                    if r in (0, 7):
                        continue
                    if rel is not None and chess.square_file(s) in (3, 4):
                        continue      # keep the pawn off the central files for variety of rook / bishop / knight pawns
                b.set_piece_at(s, chess.Piece(pt, color)); used.add(s); return True
            return False
        ok = put(chess.KING, mover, None) and put(chess.KING, not mover, None)
        for pt, rel in mine: ok = ok and put(pt, mover, rel)
        for pt, rel in theirs: ok = ok and put(pt, not mover, rel)
        if not ok or not b.is_valid() or b.is_check() or b.is_game_over():
            continue
        if chess.square_distance(b.king(chess.WHITE), b.king(chess.BLACK)) < 2:
            continue
        return b
    return None


def main():
    target = int(sys.argv[1]) if len(sys.argv) > 1 else 40
    rng = random.Random(f"{L2_SEED}-stalemate-gen")
    from engine import Engine
    eng = Engine()
    found = []; seen = set(); tried = 0; t0 = time.time(); tb_q = 0
    stats = {c[0]: [0, 0, 0] for c in CONFIGS}      # tablebase draws, with trap, stalemate line
    _, _, _, fen_keys = existing_content()
    while len(found) < target and time.time() - t0 < 3 * 3600:
        for cfg in CONFIGS:
            b = rand_pos(cfg, rng)
            if b is None:
                continue
            tried += 1
            key = " ".join(b.fen().split()[:4])
            if key in seen or key in fen_keys:
                continue
            seen.add(key)
            if material(b, b.turn) > material(b, not b.turn) - 3:
                continue
            d = T.tb(b.fen()); tb_q += 1
            if d is None or T.MAP.get(d["category"], d["category"]) != "draw":
                continue
            stats[cfg[0]][0] += 1
            rows = {x["uci"]: T.mover_view(x["category"]) for x in d["moves"]}
            W = [m for m, r in rows.items() if r == "draw"]
            if not (1 <= len(W) <= 3) or len(W) == len(rows):
                continue
            stats[cfg[0]][1] += 1
            res = eng.search(b.fen(), depth=16)
            pv = res[1]["pv"]
            if not pv or pv[0] not in W:
                continue
            bb = b.copy(); hit = None
            for i, u in enumerate(pv[:14]):
                bb.push_uci(u)
                if bb.is_stalemate():
                    hit = i + 1; break
            if hit is None:
                continue
            stats[cfg[0]][2] += 1
            # a tempting wrong move: the first capture, check or pawn move that the tablebase shows to lose
            wrong = None
            for m in b.legal_moves:
                if rows.get(m.uci()) == "loss" and (b.is_capture(m) or b.gives_check(m)):
                    wrong = m.uci(); break
            found.append(dict(cfg=cfg[0], fen=b.fen(), W=sorted(W), pv=pv[:hit], wrong=wrong, deficit=material(b, not b.turn) - material(b, b.turn)))
            if len(found) % 5 == 0:
                T.CACHE.write_text(json.dumps(T._C), encoding="utf-8")
                print(f"  {len(found)} found, tried {tried}, tablebase queries {tb_q}, {time.time() - t0:.0f}s {stats}", flush=True)
            if len(found) >= target:
                break
    T.CACHE.write_text(json.dumps(T._C), encoding="utf-8")
    eng.close()
    print("found", len(found), "tried", tried, stats)
    write_json(L2_OUT / "stalemate_found.json", found)
    build(found)


def san_list(b, ms):
    return " or ".join(b.san(chess.Move.from_uci(m)) for m in ms)


def build(found):
    positions, items = [], []
    byfam = {}
    for n, f in enumerate(sorted(found, key=lambda x: (x["cfg"], x["fen"])), 1):
        b = chess.Board(f["fen"]); side = SIDE[b.turn]
        pid = f"PG2-ST-{n:03d}"
        (pawn,) = [None] if not b.pieces(chess.PAWN, b.turn) else [sorted(b.pieces(chess.PAWN, b.turn))[0]]
        fam = f"FAM-LP2-ST-{f['cfg']}" + (f"-{chess.FILE_NAMES[chess.square_file(pawn)]}" if pawn is not None else "")
        positions.append({"id": pid, "fen": f["fen"], "family": fam,
                          "provenance": {"kind": "generated", "ref": f"tools/corpus/l2_stalemate_gen.py seed {L2_SEED}, material set {f['cfg']}", "licence": "project"}})
        claims = []
        for m in f["W"]:
            claims.append({"id": f"C{len(claims) + 1}", "type": "tablebase", "params": {"move": m, "result": "draw"},
                           "statement": f"The Lichess tablebase (exact for 7 pieces or fewer) confirms that {b.san(chess.Move.from_uci(m))} draws for {side}."})
        fb = {}
        if f.get("wrong"):
            claims.append({"id": f"C{len(claims) + 1}", "type": "tablebase", "params": {"move": f["wrong"], "result": "loss"},
                           "statement": f"The tablebase shows that {b.san(chess.Move.from_uci(f['wrong']))} loses for {side}."})
            fb[f["wrong"]] = "Not best: the tablebase shows that this move loses."
        frm = []
        for m in f["W"]:
            if m[:2] not in frm: frm.append(m[:2])
        base = {
            "position": pid, "task": "find_move", "answer": {"moves": f["W"]}, "claims": claims,
            "hints": ["Count the material, then count the legal moves your opponent would have after each of your candidate moves.",
                      "Could you give up material so that your opponent has no legal move and is not in check?",
                      "A good first move is made by the piece on " + " or ".join(frm) + "."],
            "explain": f"The tablebase confirms that {san_list(b, f['W'])} holds the draw (exact result, 7 pieces or fewer).",
            "orientation": "white" if b.turn else "black",
            "source": {"kind": "generated", "id": pid},
        }
        if fb: base["feedback_by_move"] = fb
        c3 = dict(base, id=f"IG2-ST-{n:03d}", skill="TAC.STALEMATE-TRICK.D2", cue=3, prompt=f"{side} to move. Find the best move.",
                  tags=["theme.stalemateTrick", "node.TAC.STALEMATE-TRICK", "kind.generated", "tier.3", "cue.3", "lang.en"], review={"status": "machine-only", "reviewer": None})
        items.append(c3)
        if n % 4 == 1:
            c1 = dict(base, id=f"IG2-ST-{n:03d}-c1", skill="TAC.STALEMATE-TRICK.D1", cue=1,
                      prompt=f"Theme: stalemate as a resource. {side} to move. Find the best move.",
                      tags=["theme.stalemateTrick", "node.TAC.STALEMATE-TRICK", "kind.generated", "tier.3", "cue.1", "lang.en"], review={"status": "needs-human", "reviewer": None})
            items.append(c1)
    tmp = ITEMS_DIR / (PREFIX + "stalemate-1.json.tmp")
    tmp.write_text(json.dumps({"positions": positions, "items": items}, indent=1, ensure_ascii=False), encoding="utf-8")
    tmp.replace(ITEMS_DIR / (PREFIX + "stalemate-1.json"))
    print("wrote", PREFIX + "stalemate-1.json", len(items), "items")


if __name__ == "__main__":
    main()
