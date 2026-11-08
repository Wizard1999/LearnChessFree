"""Validate lessons (content/lessons/*.json) against the contract in docs/content-schema.md.

    python tools/validate_lessons.py [content/lessons/L-xxx.json ...]     (default: all lessons)

Checks: structure; card length; every board line and guided game legal move-by-move; every reach step solvable with its par checked; every step claim machine-verified against the step's FEN
(same claim types as items); referenced items / practice tags / contrast items exist; a card must be followed by a task within two steps.
Writes content/_evidence/lessons.evidence.json. Exit 1 on any error.
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))  # allow `python -I tools/<script>.py`
import json, sys, datetime, re
from pathlib import Path
import chess
import validate as V
from engine import Engine, ROOT

STEP_TYPES = {"card", "board", "item", "practice", "contrast", "reflect", "finale", "guided", "reach"}
TASK_STEPS = {"item", "practice", "contrast", "reflect", "board_task", "finale", "guided", "reach"}
GUIDED_KEYS = {"type", "fen", "title", "moves", "end", "chapter", "sid"}
GUIDED_MOVE_KEYS = {"move", "by", "say", "hint"}
REACH_KEYS = {"type", "fen", "title", "stars", "order", "par", "say", "rounds", "chapter", "sid"}
REACH_ROUND_KEYS = {"fen", "stars", "order", "par", "say"}
REACH_SEARCH_LIMIT = 100000   # same as SEARCH_LIMIT in app/src/lib/reach.ts
REACH_SAY_WORDS = 15


def load_items():
    pos, items = {}, {}
    for f in sorted((ROOT / "content" / "items").glob("*.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        for p in d.get("positions", []): pos[p["id"]] = p
        for it in d.get("items", []): items[it["id"]] = it
    return pos, items


def words(s): return len(re.findall(r"\S+", s))


def check_guided(s, where):
    """A guided game (docs/first-game-design.md): {fen?, title?, moves:[{move SAN, by learner|opponent, say?, hint?}], end?}.
    Every SAN is replayed with python-chess from the start position (default: the standard start). Returns (errors, warnings)."""
    errs, warns = [], []
    for k in s:
        if k not in GUIDED_KEYS: warns.append(f"{where}: unknown key '{k}'")
    try: b = chess.Board(s["fen"]) if s.get("fen") else chess.Board()
    except Exception as ex: return [f"{where}: bad fen ({ex})"], warns
    if not b.is_valid(): errs.append(f"{where}: invalid position {b.status().name}")
    moves = s.get("moves")
    if not isinstance(moves, list) or not moves: return errs + [f"{where}: 'moves' must be a non-empty list"], warns
    for k in ("title", "end"):
        if k in s and not isinstance(s[k], str): errs.append(f"{where}: '{k}' must be a string")
    if words(s.get("end") or "") > 40: warns.append(f"{where}: 'end' has more than 40 words")
    colour = {}
    for j, m in enumerate(moves):
        w = f"{where}: moves[{j}]"
        if not isinstance(m, dict) or not isinstance(m.get("move"), str): errs.append(f"{w}: needs a 'move' (SAN)"); break
        for k in m:
            if k not in GUIDED_MOVE_KEYS: warns.append(f"{w}: unknown key '{k}'")
        by = m.get("by")
        if by not in ("learner", "opponent"): errs.append(f"{w}: 'by' must be learner or opponent")
        try: mv = b.parse_san(m["move"])
        except Exception: errs.append(f"{w}: {m['move']} is not a legal move in {b.fen()}"); break
        canon = b.san(mv)
        if canon != m["move"]: warns.append(f"{w}: write {m['move']} as {canon} (canonical SAN)")
        side = "white" if b.turn == chess.WHITE else "black"
        if by in ("learner", "opponent"):
            if colour.setdefault(by, side) != side: errs.append(f"{w}: every {by} move must be the same colour ({colour[by]}), this one is {side}")
        for k in ("say", "hint"):
            if k in m and not isinstance(m[k], str): errs.append(f"{w}: '{k}' must be a string")
        if not (m.get("say") or "").strip(): warns.append(f"{w}: no 'say' (each move should have one sentence about what the piece does)")
        elif words(m["say"]) > 30: warns.append(f"{w}: 'say' > 30 words")
        b.push(mv)
    if "learner" not in colour: errs.append(f"{where}: no learner move")
    if colour.get("learner") and colour.get("learner") == colour.get("opponent"): errs.append(f"{where}: learner and opponent play the same colour")
    return errs, warns


# ---- reach step: grab the stars (docs/reach-step.md). The rules mirror app/src/lib/reach.ts: the learner's pieces other than the king move
# (the king only when it is the learner's only piece), only legal moves that do not give check (the other side never moves, so a check could
# never be answered), the turn goes straight back to the learner, a star is collected when a piece lands on it (in-order: only the next one).
def reach_start(fen):
    """(normalised board with the learner to move, no castling, no en passant) or raises ValueError."""
    b = chess.Board(fen)
    return chess.Board(f"{b.board_fen()} {'w' if b.turn == chess.WHITE else 'b'} - - 0 1")


def reach_moves(b):
    side = b.turn
    mine = [sq for sq, p in b.piece_map().items() if p.color == side]
    others = [sq for sq in mine if b.piece_type_at(sq) != chess.KING]
    movable = set(others or mine)
    return [m for m in b.legal_moves if m.from_square in movable and not b.gives_check(m)]


def reach_play(b, m):
    side = b.turn
    nb = b.copy(stack=False); nb.push(m); nb.turn = side; nb.ep_square = None
    return nb


def reach_solve(fen, stars, order="any", limit=REACH_SEARCH_LIMIT):
    """Breadth-first search for the fewest moves that collect every star. Returns (par or None, reason or None).
    reason names unreachable stars, an order that cannot be kept, or a search larger than the limit."""
    start = reach_start(fen)
    idx = {chess.parse_square(s): i for i, s in enumerate(stars)}
    full = (1 << len(stars)) - 1
    def collect(got, to):
        i = idx.get(to)
        if i is None or got >> i & 1: return got
        if order == "in-order" and got != (1 << i) - 1: return got   # only the next star in the list counts
        return got | (1 << i)
    # 1. where can a piece land at all? (the board never depends on the stars)
    seen_b, frontier, lands = {start.board_fen()}, [start], set()
    while frontier:
        nxt = []
        for b in frontier:
            for m in reach_moves(b):
                lands.add(m.to_square)
                nb = reach_play(b, m); k = nb.board_fen()
                if k not in seen_b:
                    seen_b.add(k); nxt.append(nb)
                    if len(seen_b) > limit: return None, f"the search is larger than {limit} positions; simplify the position"
        frontier = nxt
    far = [s for s in stars if chess.parse_square(s) not in lands]
    if far: return None, f"no legal way to reach {', '.join(far)}"
    # 2. the fewest moves that collect every star
    seen, frontier, depth = {(start.board_fen(), 0)}, [(start, 0)], 0
    while frontier:
        depth += 1; nxt = []
        for b, got in frontier:
            for m in reach_moves(b):
                g = collect(got, m.to_square)
                if g == full: return depth, None
                nb = reach_play(b, m); k = (nb.board_fen(), g)
                if k in seen: continue
                seen.add(k); nxt.append((nb, g))
                if len(seen) > limit: return None, f"the search is larger than {limit} positions; simplify the position"
        frontier = nxt
    return None, "the stars cannot all be collected" + (" in this order" if order == "in-order" else "")


def check_reach(s, where):
    """A reach step (docs/reach-step.md): {fen, title?, stars:[squares], order: any|in-order, par?, say?, rounds?:[{fen?, stars, order?, par?, say?}]}.
    The step's own fields are round 1; each round is solved with python-chess and its par checked. Returns (errors, warnings)."""
    errs, warns = [], []
    for k in s:
        if k not in REACH_KEYS: warns.append(f"{where}: unknown key '{k}'")
    if "title" in s and not isinstance(s["title"], str): errs.append(f"{where}: 'title' must be a string")
    rounds = [{k: s[k] for k in ("fen", "stars", "order", "par", "say") if k in s}]
    if "rounds" in s:
        if not isinstance(s["rounds"], list) or not s["rounds"]: return errs + [f"{where}: 'rounds' must be a non-empty list when present"], warns
        for r in s["rounds"]:
            if not isinstance(r, dict): errs.append(f"{where}: every round must be an object"); return errs, warns
            for k in r:
                if k not in REACH_ROUND_KEYS: warns.append(f"{where}: rounds: unknown key '{k}'")
            rounds.append({"fen": r.get("fen", s.get("fen")), "order": r.get("order", s.get("order", "any")), **{k: r[k] for k in ("stars", "par", "say") if k in r}})
    for n, r in enumerate(rounds, 1):
        w = where if len(rounds) == 1 else f"{where}: round {n}"
        fen = r.get("fen")
        if not isinstance(fen, str) or not fen.strip(): errs.append(f"{w}: needs a 'fen'"); continue
        try: b = reach_start(fen)
        except Exception as ex: errs.append(f"{w}: bad fen ({ex})"); continue
        if not b.is_valid(): errs.append(f"{w}: invalid position {b.status().name}"); continue
        if b.is_check(): errs.append(f"{w}: the learner's king starts in check"); continue
        order = r.get("order", "any")
        if order not in ("any", "in-order"): errs.append(f"{w}: 'order' must be any or in-order")
        stars = r.get("stars")
        if not isinstance(stars, list) or not stars or not all(isinstance(x, str) for x in stars): errs.append(f"{w}: 'stars' must be a non-empty list of squares"); continue
        bad = [x for x in stars if x not in chess.SQUARE_NAMES]
        if bad: errs.append(f"{w}: not squares: {', '.join(bad)}"); continue
        if len(set(stars)) != len(stars): errs.append(f"{w}: a square is starred twice"); continue
        own = [x for x in stars if (p := b.piece_at(chess.parse_square(x))) and p.color == b.turn]
        if own: errs.append(f"{w}: star on a square of the learner's own piece: {', '.join(own)}"); continue
        if not reach_moves(b): errs.append(f"{w}: no learner piece to move (no legal move that does not give check)"); continue
        say = r.get("say")
        if say is not None and not isinstance(say, str): errs.append(f"{w}: 'say' must be a string")
        elif say and words(say) > REACH_SAY_WORDS: warns.append(f"{w}: 'say' has {words(say)} words (aim <= {REACH_SAY_WORDS})")
        par, why = reach_solve(fen, stars, order if order in ("any", "in-order") else "any")
        if par is None: errs.append(f"{w}: {why}"); continue
        if "par" not in r: warns.append(f"{w}: no 'par' (the best is {par}); add \"par\": {par}")
        elif not isinstance(r["par"], int) or isinstance(r["par"], bool) or r["par"] != par: errs.append(f"{w}: par is {r['par']} but the best is {par}")
    return errs, warns


def validate_lesson(path, eng, items):
    d = json.loads(Path(path).read_text(encoding="utf-8"))
    errs, warns, ev = [], [], []
    lid = d.get("id", Path(path).stem)
    for k in ("id", "title", "skill", "depth", "steps", "review"):
        if k not in d: errs.append(f"{lid}: missing '{k}'")
    if d.get("review", {}).get("status") not in ("machine-only", "needs-human", "human-reviewed"):
        errs.append(f"{lid}: review.status invalid")
    steps = d.get("steps", [])
    for i, s in enumerate(steps):
        t = s.get("type")
        where = f"{lid} step {i + 1} ({t})"
        if t not in STEP_TYPES: errs.append(f"{where}: unknown step type"); continue
        if t == "card":
            n = words(s.get("text", ""))
            if n == 0: errs.append(f"{where}: empty card")
            elif n > 90: errs.append(f"{where}: card has {n} words (limit 90, aim <= 70)")
            elif n > 70: warns.append(f"{where}: card has {n} words (aim <= 70)")
            nxt = [x.get("type") for x in steps[i + 1:i + 3]]
            if not any(x in TASK_STEPS or x == "board" and steps[i + 1 + j].get("claims") for j, x in enumerate(nxt)):
                if not any(x in ("item", "practice", "contrast", "reflect") for x in nxt):
                    errs.append(f"{where}: no task (item/practice/contrast/reflect) within the next two steps")
        if t == "finale":   # an optional game against Maia or Stockfish from the position the lesson taught (D41): {fen, color: white|black|both, moves?, prompt?}
            try: fb = chess.Board(s["fen"])
            except Exception as ex: errs.append(f"{where}: bad fen ({ex})"); continue
            if not fb.is_valid(): errs.append(f"{where}: invalid position {fb.status().name}")
            if s.get("color", "both") not in ("white", "black", "both"): errs.append(f"{where}: color must be white, black or both")
            if fb.is_game_over(): errs.append(f"{where}: the finale position is already over")
        if t == "guided":
            e2, w2 = check_guided(s, where); errs += e2; warns += w2
        if t == "reach":
            e2, w2 = check_reach(s, where); errs += e2; warns += w2
        if t == "board":
            try: b = chess.Board(s["fen"])
            except Exception as ex: errs.append(f"{where}: bad fen ({ex})"); continue
            if not b.is_valid(): errs.append(f"{where}: invalid position {b.status().name}")
            bb = b.copy()
            for j, step in enumerate(s.get("line", [])):
                try: mv = chess.Move.from_uci(step["move"])
                except Exception: errs.append(f"{where}: line[{j}] bad uci"); break
                if mv not in bb.legal_moves: errs.append(f"{where}: line[{j}] {step['move']} illegal"); break
                bb.push(mv)
                if words(step.get("say", "")) > 30: warns.append(f"{where}: line[{j}] 'say' > 30 words")
            for c in s.get("claims", []):
                try: r = V.check_claim(eng, {"fen": s["fen"]}, c)
                except Exception as ex: r = dict(result="fail", reason=f"error: {ex}")
                ev.append(dict(lesson=lid, step=i + 1, claim=c.get("id"), type=c["type"], result=r["result"], measured=r.get("measured")))
                if r["result"] != "pass": errs.append(f"{where}: claim {c.get('id')} ({c['type']}) failed: {r.get('reason', r.get('measured'))}")
        if t == "item" and s.get("item") not in items: errs.append(f"{where}: unknown item {s.get('item')}")
        if t == "practice":
            tags = set(s.get("tags", []))
            avail = [it for it in items.values() if tags and tags <= set(it.get("tags", []))]
            if len(avail) < s.get("n", 1): errs.append(f"{where}: only {len(avail)} items match tags {sorted(tags)} (need {s.get('n', 1)})")
        if t == "contrast":
            for k in ("working", "failing"):
                if s.get(k) not in items: errs.append(f"{where}: contrast {k} item missing/unknown ({s.get(k)})")
            if s.get("irrelevant") and s["irrelevant"] not in items: errs.append(f"{where}: unknown irrelevant item")
    return errs, warns, ev


def main():
    files = [Path(a) for a in sys.argv[1:]] or sorted((ROOT / "content" / "lessons").glob("*.json"))
    if not files: print("no lessons"); return
    _, items = load_items()
    eng = Engine()
    all_e, all_w, all_ev = [], [], []
    try:
        for f in files:
            e, w, ev = validate_lesson(f, eng, items)
            all_e += [f"{f.name}: {x}" for x in e]; all_w += [f"{f.name}: {x}" for x in w]; all_ev += ev
            print(f"{f.name}: {len(e)} errors, {len(w)} warnings")
    finally:
        eng.close()
    (ROOT / "content" / "_evidence" / "lessons.evidence.json").write_text(json.dumps(all_ev, indent=1), encoding="utf-8")
    for w in all_w: print("  warn:", w)
    print("\n" + ("ALL LESSONS PASSED" if not all_e else f"{len(all_e)} PROBLEM(S):\n  " + "\n  ".join(all_e)))
    sys.exit(1 if all_e else 0)


if __name__ == "__main__":
    main()
