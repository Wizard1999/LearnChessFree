#!/usr/bin/env python3
"""Human-review packets for the release slice (docs/review-slice.md).

    ./tools/.venv/Scripts/python.exe -I tools/review_packet.py            # writes review/packets/<lesson-id>.md and review/index.md
    ./tools/.venv/Scripts/python.exe -I tools/review_packet.py L-TAC-FORK-1 [more ids]   # only those lessons (the index is not rewritten)
    ./tools/.venv/Scripts/python.exe -I tools/review_packet.py --list    # prints the slice and nothing else

A packet is a readable text version of one lesson: every step in order, boards as ASCII diagrams plus FEN, the line with its
sentences, items with the answer and explanation, claims noted. A reviewer can read it without running the app.
It also holds revision(lesson), the same hash tools/build_content.py puts on each shipped lesson, so a sign-off
(content/review/<lesson-id>.json) can be matched to the exact text that was reviewed (see tools/apply_review.py).
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))  # allow `python -I tools/<script>.py`
import hashlib, json, re
from pathlib import Path
import chess

ROOT = Path(__file__).resolve().parent.parent
C = ROOT / "content"
OUT = ROOT / "review" / "packets"
SIGNOFF_DIR = C / "review"
EXEMPLARS = ["L-TAC-FORK-1", "L-TAC-BACKRANK-1"] + [f"L-OD-DRAGON-{n}" for n in range(1, 10)] + [f"L-HI-ENGINES-HUMANS-{n}" for n in range(1, 6)]
SLICE_STAGES = ("S0", "S1", "S2")


# ---- revision: must equal tools/build_content.py (stable step ids are added to every step BEFORE the hash) ----
def _step_key(st):
    """Copy of step_key in tools/build_content.py. If you change one, change the other (tools/test_review.py compares against a shipped lesson)."""
    t = st.get("type")
    if t == "card": raw = " ".join(st.get("text", "").split()[:12])
    elif t == "board": raw = st.get("fen", "") + "|" + (st.get("line") or [{}])[0].get("move", "")
    elif t == "item": raw = st.get("item", "")
    elif t == "practice": raw = ",".join(st.get("tags", []))
    elif t == "contrast": raw = str(st.get("working", ""))
    elif t == "reflect": raw = st.get("prompt", "")[:40]
    elif t == "finale": raw = st.get("fen", "") + "|" + str(st.get("color", ""))
    else: raw = json.dumps(st, sort_keys=True)[:60]
    return t[0] + hashlib.sha1((t + "|" + raw).encode("utf-8")).hexdigest()[:7]


def with_step_ids(steps):
    out, seen = [], {}
    for st in steps:
        st = dict(st); k = _step_key(st); seen[k] = seen.get(k, 0) + 1
        st["sid"] = k if seen[k] == 1 else f"{k}-{seen[k]}"
        out.append(st)
    return out


def revision(lesson):
    """First 8 hex of sha1(json.dumps(steps, sort_keys=True, ensure_ascii=False)), steps carrying their sid, as build_content.py computes it."""
    steps = with_step_ids(lesson.get("steps", []))
    return hashlib.sha1(json.dumps(steps, sort_keys=True, ensure_ascii=False).encode("utf-8")).hexdigest()[:8]


# ---- loading ----
def load_lessons():
    return {d["id"]: d for d in (json.loads(f.read_text(encoding="utf-8")) for f in sorted((C / "lessons").glob("*.json")))}


def load_items():
    items, positions = {}, {}
    for f in sorted((C / "items").glob("*.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        for p in d.get("positions", []): positions[p["id"]] = p
        for it in d.get("items", []): items[it["id"]] = it
    return items, positions


def slice_ids(lessons=None):
    """(stage label, lesson id) for the slice, in teaching order: stages S0-S2 of content/path.json, then the exemplars not already in them."""
    path = json.loads((C / "path.json").read_text(encoding="utf-8"))
    rows, seen = [], set()
    for st in path["stages"]:
        if st["id"] in SLICE_STAGES:
            for lid in st["lessons"]:
                if lid not in seen: rows.append((st["id"], lid)); seen.add(lid)
    for lid in EXEMPLARS:
        if lid not in seen: rows.append(("exemplar", lid)); seen.add(lid)
    if lessons is not None:
        missing = [l for _, l in rows if l not in lessons]
        if missing: raise SystemExit(f"slice lessons missing from content/lessons: {missing}")
    return rows


# ---- rendering ----
def ascii_board(fen, orientation="white"):
    b = chess.Board(fen)
    files = "abcdefgh"; ranks = range(7, -1, -1); cols = range(8)
    if orientation == "black": ranks = range(8); cols = range(7, -1, -1)
    lines = []
    for r in ranks:
        row = []
        for c in cols:
            p = b.piece_at(chess.square(c, r))
            row.append(p.symbol() if p else ".")
        lines.append(f"  {r + 1}  " + " ".join(row))
    lines.append("     " + " ".join(files[c] for c in cols))
    return "\n".join(lines)


def diagram(fen, orientation="white", note=None):
    try:
        side = "White" if chess.Board(fen).turn else "Black"
        body = ascii_board(fen, orientation)
    except Exception as ex:
        return f"```\n[bad FEN: {ex}]\n{fen}\n```"
    cap = f"{side} to move. Capitals = White, lower case = Black." + (f" {note}" if note else "")
    return f"```\n{body}\n\n{cap}\nFEN: {fen}\n```"


def san_line(fen, moves):
    """[(san, say)] for a stored line; stops and flags the first move that is not legal."""
    b = chess.Board(fen); out = []
    for m in moves:
        try:
            mv = chess.Move.from_uci(m["move"])
            if mv not in b.legal_moves: raise ValueError("illegal")
            num = f"{b.fullmove_number}." if b.turn else f"{b.fullmove_number}..."
            san = b.san(mv); b.push(mv)
            out.append((f"{num} {san}", m.get("say", "")))
        except Exception:
            out.append((f"[ILLEGAL OR UNREADABLE MOVE {m.get('move')}]", m.get("say", ""))); break
    return out, b.fen()


def san_one(fen, uci):
    try:
        b = chess.Board(fen); mv = chess.Move.from_uci(uci)
        return b.san(mv) if mv in b.legal_moves else uci
    except Exception:
        return uci


def claims_block(claims):
    if not claims: return ""
    rows = [f"- [{c.get('type')}] {c.get('statement') or '(no sentence; a rules check)'}" for c in claims]
    return "Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:\n" + "\n".join(rows) + "\n"


def render_item(iid, items, positions, indent_note=""):
    it = items.get(iid)
    if not it: return f"[item {iid} NOT FOUND]\n"
    pos = positions.get(it.get("position"), {})
    fen = it.get("fen") or pos.get("fen")
    ori = it.get("orientation", "white")
    out = [f"**Task `{iid}`** ({it.get('task')}, difficulty cue {it.get('cue')})" + indent_note]
    if it.get("prompt"): out.append(it["prompt"])
    if fen: out.append(diagram(fen, ori))
    if it.get("options"): out.append("Options shown: " + " / ".join(str(o) for o in it["options"]))
    a = it.get("answer", {})
    t = it.get("task")
    if t == "find_move" and fen:
        out.append("**Accepted answer(s):** " + ", ".join(san_one(fen, m) for m in a.get("moves", [])))
        fb = it.get("feedback_by_move") or {}
        if fb: out.append("Feedback shown for wrong moves:\n" + "\n".join(f"- {san_one(fen, m)}: {s}" for m, s in fb.items()))
    elif t == "select_squares":
        out.append(f"**Accepted answer:** squares {', '.join(a.get('squares', []))}" + (f" (from {a['from']})" if a.get("from") else ""))
    elif t == "threat_detection" and fen:
        tm = a.get("threat_move", "")
        flipped = chess.Board(fen); flipped.turn = not flipped.turn; flipped.ep_square = None   # the threat is the OTHER side's move
        out.append(f"**Accepted answer:** the threatened move is {san_one(flipped.fen(), tm)} ({tm})")
    else:
        out.append("**Accepted answer:** " + json.dumps({k: v for k, v in a.items() if k != "options"}, ensure_ascii=False))
    if it.get("explain"): out.append("**Explanation shown:** " + it["explain"])
    if it.get("hints"): out.append("Hints (in order):\n" + "\n".join(f"{n}. {h}" for n, h in enumerate(it["hints"], 1)))
    cb = claims_block(it.get("claims"))
    if cb: out.append(cb.rstrip())
    return "\n\n".join(out) + "\n"


def render_step(n, st, items, positions):
    t = st.get("type")
    head = f"### Step {n}: {t}"
    if st.get("chapter"): head = f"## Chapter: {st['chapter']}\n\n" + head
    flags = [k for k in ("silent",) if st.get(k)]
    if flags: head += "  (shown without telling the learner the topic: unlabeled test)"
    out = [head]
    if t == "card":
        out.append(st.get("text", ""))
    elif t == "board":
        ori = st.get("orientation", "white")
        out.append(f"Caption: {st.get('caption', '')}")
        out.append(diagram(st["fen"], ori, "Starting position."))
        rows, end_fen = san_line(st["fen"], st.get("line") or [])
        if rows:
            out.append("The line, with the sentence the learner sees at each move:\n" + "\n".join(f"{n2}. **{san}**: {say}" for n2, (san, say) in enumerate(rows, 1)))
            out.append(diagram(end_fen, ori, "Position at the end of the line."))
        extras = []
        if st.get("arrows"): extras.append("arrows " + ", ".join(f"{a['from']}-{a['to']}" for a in st["arrows"]))
        if st.get("highlight"): extras.append("highlighted squares " + ", ".join(st["highlight"]))
        if extras: out.append("Drawn on the board: " + "; ".join(extras) + ".")
        cb = claims_block(st.get("claims"))
        if cb: out.append(cb.rstrip())
    elif t == "item":
        out.append(render_item(st["item"], items, positions).rstrip())
        if st.get("ask_confidence"): out.append("(The learner is asked how sure they are before the answer.)")
    elif t == "contrast":
        out.append(f"Title: {st.get('title', '')}\n\nPrompt: {st.get('prompt', '')}")
        for k in ("working", "failing", "irrelevant"):
            if st.get(k): out.append(f"**The {k} board:**\n\n" + render_item(st[k], items, positions).rstrip())
    elif t == "practice":
        tags = st.get("tags", [])
        n_match = sum(1 for it in items.values() if all(g in it.get("tags", []) for g in tags)) if tags else 0
        out.append(f"A drill of {st.get('n')} tasks drawn from the bank by tag {tags} ({n_match} tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.")
    elif t == "reflect":
        out.append(f"Kind: {st.get('kind')}\n\nPrompt: {st.get('prompt', '')}")
        for f in st.get("fields", []):
            line = f"- Field \"{f.get('label')}\""
            if f.get("options"): line += " with options: " + " / ".join(f["options"]) + (f"; correct: {f['answer']}" if f.get("answer") else "; no single correct answer (a guess or a self-report)")
            else: line += " (free text)"
            out.append(line)
        if st.get("feedback"): out.append("Feedback shown: " + (st["feedback"] if isinstance(st["feedback"], str) else json.dumps(st["feedback"], ensure_ascii=False)))
        cb = claims_block(st.get("claims"))
        if cb: out.append(cb.rstrip())
    elif t == "finale":
        out.append(f"Prompt: {st.get('prompt', '')}\n\nThe learner plays {st.get('color')} from this position, using what the lesson taught.")
        out.append(diagram(st["fen"], "black" if st.get("color") == "black" else "white"))
    else:
        out.append("```json\n" + json.dumps(st, ensure_ascii=False, indent=1) + "\n```")
    return "\n\n".join(out) + "\n"


SCORECARD = """## Reviewer scorecard

Fill in the file `content/review/{lid}.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `{rev}`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{{
  "lesson": "{lid}",
  "revision": "{rev}",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {{"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0}},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
"""


def render_lesson(l, items, positions, stage=""):
    rev = revision(l)
    steps = l.get("steps", [])
    n_task = sum(1 for s in steps if s.get("type") in ("item", "contrast", "practice", "finale"))
    out = [f"# Review packet: {l['id']}", "",
           f"**{l.get('title', '')}**", "",
           f"- Skill: {l.get('skill')} ({l.get('depth')}); stage: {stage or 'n/a'}; stated length: {l.get('minutes', '?')} minutes",
           f"- Steps: {len(steps)} ({n_task} are tasks); revision: `{rev}`",
           f"- Review status now: {l.get('review', {}).get('status')}",
           ""]
    if l.get("outcomes"):
        out += ["## What the lesson says the learner will be able to do", ""] + [f"- {o}" for o in l["outcomes"]] + [""]
    if l.get("sources"):
        out += ["## Sources the author names (check that they are used fairly, in our own words)", ""] + [f"- {s}" for s in l["sources"]] + [""]
    out += ["## How to read this packet", "",
            "Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. "
            "Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. "
            "Please judge the explanations, not only the moves: does each sentence tell the learner why?", "",
            "---", ""]
    for n, st in enumerate(steps, 1):
        out.append(render_step(n, st, items, positions))
    out += ["---", "", SCORECARD.format(lid=l["id"], rev=rev)]
    return "\n".join(out)


def signoff_state(lid, rev):
    p = SIGNOFF_DIR / f"{lid}.json"
    if not p.exists(): return "no sign-off"
    try:
        d = json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return "sign-off file unreadable"
    rows = d if isinstance(d, list) else [d]
    return "; ".join(f"{r.get('verdict')} by {r.get('reviewer')} ({r.get('reviewer_role')})" + ("" if r.get("revision") == rev else " [stale: other revision]") for r in rows)


def main(argv):
    lessons = load_lessons(); items, positions = load_items()
    rows = slice_ids(lessons)
    if "--list" in argv:
        for st, lid in rows: print(f"{st:9} {lid}")
        print(len(rows), "lessons in the slice"); return 0
    only = [a for a in argv if not a.startswith("--")]
    OUT.mkdir(parents=True, exist_ok=True)
    chosen = [(st, lid) for st, lid in rows if not only or lid in only]
    bad = [o for o in only if o not in {lid for _, lid in rows}]
    if bad: raise SystemExit(f"not in the slice: {bad}")
    index = []
    for st, lid in chosen:
        l = lessons[lid]
        (OUT / f"{lid}.md").write_text(render_lesson(l, items, positions, st), encoding="utf-8")
    if not only:
        for st, lid in rows:
            l = lessons[lid]; rev = revision(l)
            index.append(f"| {st} | [{lid}](packets/{lid}.md) | {l.get('title', '').replace('|', '/')} | {len(l.get('steps', []))} | `{rev}` | {l.get('review', {}).get('status')} | {signoff_state(lid, rev)} |")
        head = ["# Review index: the release slice", "",
                "Generated by `tools/review_packet.py`. Read `docs/review-slice.md` first (what the slice is, who reviews what, how long it takes, how to sign off).", "",
                f"{len(rows)} lessons. Nothing here has been reviewed by a person unless the last column says so.", "",
                "| Stage | Packet | Title | Steps | Revision | Status in lesson file | Sign-off file |", "|---|---|---|---|---|---|---|"]
        (ROOT / "review" / "index.md").write_text("\n".join(head + index) + "\n", encoding="utf-8")
    print(f"wrote {len(chosen)} packets to {OUT}" + ("" if only else " and review/index.md"))
    return 0


if __name__ == "__main__":
    sys_argv = _s.argv[1:]
    _s.exit(main(sys_argv))
