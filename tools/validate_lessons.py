"""Validate lessons (content/lessons/*.json) against the contract in docs/content-schema.md.

    python tools/validate_lessons.py [content/lessons/L-xxx.json ...]     (default: all lessons)

Checks: structure; card length; every board line and guided game legal move-by-move; every step claim machine-verified against the step's FEN
(same claim types as items); referenced items / practice tags / contrast items exist; a card must be followed by a task within two steps.
Writes content/_evidence/lessons.evidence.json. Exit 1 on any error.
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))  # allow `python -I tools/<script>.py`
import json, sys, datetime, re
from pathlib import Path
import chess
import validate as V
from engine import Engine, ROOT

STEP_TYPES = {"card", "board", "item", "practice", "contrast", "reflect", "finale", "guided"}
TASK_STEPS = {"item", "practice", "contrast", "reflect", "board_task", "finale", "guided"}
GUIDED_KEYS = {"type", "fen", "title", "moves", "end", "chapter", "sid"}
GUIDED_MOVE_KEYS = {"move", "by", "say", "hint"}


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
