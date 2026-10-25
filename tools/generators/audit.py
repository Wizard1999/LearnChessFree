"""Audit of the generated Tier 0-1 content (gen-t0-*.json + the 25 skill files).

    python -I tools/generators/audit.py            # prints the report; exit code 1 if anything is wrong

What it checks (independently of the generators, from the files and from python-chess only):
  1. per-family / per-area counts, by skill, cue and orientation
  2. duplicate FENs (first four FEN fields) across the WHOLE content/ tree (items, lessons), and duplicate ids
  3. evidence: every claim of every item has a passing record in content/_evidence/<file>.evidence.json whose content_hash matches
     the CURRENT item+position (so an edited item without a re-run of the validator shows up as stale)
  4. item sanity: position legal, orientation matches the side to move, 2-3 escalating hints, explain present, tags (node/tier/cue/kind/
     family) consistent with the item, answer consistent with the claims (select_squares == legal_destinations / loose_pieces;
     find_move answers legal and each backed by a claim naming the move; mate-in-one answer == ALL mating moves recomputed here;
     predict/classify answers inside their options; classify game_state == answer.class; feedback_by_move moves legal and claimed),
     the last hint does not contain an accepted move in SAN or UCI
  5. skill files: all 25 present, D0-D3, prerequisites exist, graph acyclic, items point at existing skill depths
"""
from __future__ import annotations

import hashlib
import json
import sys as _s
import pathlib as _p
from collections import Counter, defaultdict

HERE = _p.Path(__file__).resolve().parent
_s.path.insert(0, str(HERE))
import chess  # noqa: E402
from common import ITEMS_DIR, SKILLS_DIR, ROOT, GEN_PREFIX, fen_key, _collect_fens  # noqa: E402

EVID = ROOT / "content" / "_evidence"
SKILLS_EXPECTED = ["FND.BOARD", "FND.PIECE.ROOK", "FND.PIECE.BISHOP", "FND.PIECE.QUEEN", "FND.PIECE.KING", "FND.PIECE.KNIGHT", "FND.PIECE.PAWN",
                   "FND.CAPTURE", "FND.VALUE", "FND.CHECK", "FND.MATE1", "FND.STALEMATE", "FND.CASTLE", "FND.ENPASSANT", "FND.PROMOTE",
                   "SAF.LOOSE", "SAF.COUNT", "SAF.DEFEND-OPTIONS", "SAF.THREAT", "END.MATE-KQ", "END.MATE-KR", "END.PAWN-RACE",
                   "END.OPPOSITION", "OPN.PRINCIPLES"]
# the task text lists 24 ids plus FND.PIECE.* six = see SKILLS_EXPECTED; keep it explicit and print the count


def jload(p):
    return json.loads(p.read_text(encoding="utf-8"))


def content_hash(item, pos):
    return hashlib.sha256(json.dumps([item, pos], sort_keys=True).encode()).hexdigest()[:16]


def main():
    problems = []
    files = sorted(ITEMS_DIR.glob(GEN_PREFIX + "*.json"))
    print(f"generated item files: {len(files)}")
    all_items, all_pos, per_file = [], {}, {}
    for f in files:
        d = jload(f)
        per_file[f.name] = d
        for p in d["positions"]:
            all_pos[p["id"]] = (f.name, p)
        for it in d["items"]:
            all_items.append((f.name, it))
    # ---------------------------------------------------------------- 1. counts
    print("\n== counts by file ==")
    total = 0
    for fn, d in per_file.items():
        print(f"  {fn:24s} items {len(d['items']):4d}  positions {len(d['positions']):4d}  families {len({p['family'] for p in d['positions']}):3d}")
        total += len(d["items"])
    print(f"  {'TOTAL':24s} items {total:4d}")
    by_skill = Counter(it["skill"] for _, it in all_items)
    print("\n== items by skill depth ==")
    for k, v in sorted(by_skill.items()):
        print(f"  {k:26s} {v:4d}")
    print("\n== cue / tier / orientation ==")
    print("  cue:", dict(sorted(Counter(it["cue"] for _, it in all_items).items())), " tier:", dict(sorted(Counter(next(t for t in it['tags'] if t.startswith('tier.')) for _, it in all_items).items())),
          " orientation:", dict(Counter(it.get("orientation") for _, it in all_items)))
    print("  tasks:", dict(Counter(it["task"] for _, it in all_items)))
    fam_tags = Counter()
    for _, it in all_items:
        for t in it["tags"]:
            if t.startswith("family."):
                fam_tags[t.split("-")[2] if t.count("-") >= 2 else t] += 1
    print("  per generator family (tag family.FAM-GEN-<X>-):", dict(sorted(fam_tags.items())))

    # ---------------------------------------------------------------- 2. duplicates
    seen_ids, dup_ids = {}, []
    for jf in sorted((ROOT / "content").rglob("*.json")):
        if "_evidence" in jf.parts or "skills" in jf.parts:
            continue
        try:
            d = jload(jf)
        except Exception as ex:
            problems.append(f"{jf}: unreadable json ({ex})")
            continue
        for key in ("items", "positions"):
            for x in d.get(key, []) if isinstance(d, dict) else []:
                if "id" in x:
                    if x["id"] in seen_ids and seen_ids[x["id"]] != jf.name:
                        dup_ids.append((x["id"], seen_ids[x["id"]], jf.name))
                    seen_ids.setdefault(x["id"], jf.name)
    fen_src = defaultdict(list)
    for jf in sorted((ROOT / "content").rglob("*.json")):
        if "_evidence" in jf.parts or "skills" in jf.parts:
            continue
        d = jload(jf)
        found = []
        _collect_list(d, found)
        for k in found:
            fen_src[k].append(jf.name)
    dups = {k: v for k, v in fen_src.items() if len(v) > 1}
    print(f"\n== duplicates ==\n  FEN keys in content/: {len(fen_src)}   duplicate FENs (any files): {len(dups)}   duplicate ids: {len(dup_ids)}")
    for k, v in list(dups.items())[:10]:
        print("   DUP FEN", k, v)
    mine = {k: v for k, v in dups.items() if any(n.startswith(GEN_PREFIX) for n in v)}
    problems += [f"duplicate FEN {k} in {v}" for k, v in mine.items()]
    problems += [f"duplicate id {i}" for i in dup_ids if i[0].startswith(("IG-", "PG-"))]

    # ---------------------------------------------------------------- 3. evidence
    print("\n== evidence (content/_evidence) ==")
    ev_total = ev_pass = ev_stale = ev_missing = 0
    for fn, d in per_file.items():
        ep = EVID / (fn[:-5] + ".evidence.json")
        if not ep.exists():
            problems.append(f"{fn}: no evidence file (run tools/validate.py on it)")
            ev_missing += sum(len(it["claims"]) for it in d["items"])
            print(f"  {fn:24s} NO EVIDENCE FILE")
            continue
        recs = jload(ep)
        by_item = defaultdict(list)
        for r in recs:
            by_item[r["item"]].append(r)
        pos = {p["id"]: p for p in d["positions"]}
        items_ok = 0
        for it in d["items"]:
            h = content_hash(it, pos[it["position"]])
            ok = True
            for c in it["claims"]:
                ev_total += 1
                rs = [r for r in by_item.get(it["id"], []) if r["claim"] == c["id"]]
                if not rs:
                    ev_missing += 1
                    ok = False
                    continue
                r = rs[-1]
                if r.get("content_hash") != h:
                    ev_stale += 1
                    ok = False
                elif r["result"] != "pass":
                    ok = False
                else:
                    ev_pass += 1
            if ok:
                items_ok += 1
            else:
                problems.append(f"{it['id']}: evidence missing/stale/failed")
        print(f"  {fn:24s} items with every claim passing + fresh: {items_ok}/{len(d['items'])}")
    print(f"  claims: {ev_total}  pass+fresh: {ev_pass}  stale: {ev_stale}  missing: {ev_missing}")

    # ---------------------------------------------------------------- 4. item sanity
    skills = {}
    for sf in sorted(SKILLS_DIR.glob("*.json")):
        skills[sf.stem] = jload(sf)
    n_checked = 0
    for fn, it in all_items:
        iid = it["id"]
        pos = all_pos[it["position"]][1]
        try:
            board = chess.Board(pos["fen"])
        except Exception as ex:
            problems.append(f"{iid}: bad FEN {ex}")
            continue
        n_checked += 1
        if not board.is_valid():
            problems.append(f"{iid}: invalid position")
        if "family" not in pos or not pos["family"]:
            problems.append(f"{iid}: no family")
        if it.get("orientation") != ("white" if board.turn == chess.WHITE else "black"):
            problems.append(f"{iid}: orientation {it.get('orientation')} vs turn")
        hints = it.get("hints", [])
        if not (2 <= len(hints) <= 3 and all(isinstance(h, str) and h for h in hints)):
            problems.append(f"{iid}: hints must be 2-3 non-empty strings")
        if not it.get("explain"):
            problems.append(f"{iid}: no explain")
        tags = it["tags"]
        for need in (f"cue.{it['cue']}", "kind.generated", "lang.en"):
            if need not in tags:
                problems.append(f"{iid}: tag {need} missing")
        if not any(t.startswith("node.") for t in tags) or not any(t.startswith("tier.") for t in tags) or not any(t.startswith("family.") for t in tags):
            problems.append(f"{iid}: node/tier/family tag missing")
        base, depth = it["skill"].rsplit(".", 1)
        if base not in skills:
            problems.append(f"{iid}: skill {base} has no skill file")
        elif depth not in skills[base]["depths"]:
            problems.append(f"{iid}: skill depth {it['skill']} not defined")
        if f"node.{base}" not in tags:
            problems.append(f"{iid}: tag node.{base} missing")
        prompt = it["prompt"]
        side = "White" if board.turn == chess.WHITE else "Black"
        if prompt.startswith(("White to move", "Black to move")) and not prompt.startswith(side + " to move"):
            problems.append(f"{iid}: prompt side vs FEN turn")
        claims = it["claims"]
        ids = [c["id"] for c in claims]
        if len(ids) != len(set(ids)):
            problems.append(f"{iid}: duplicate claim ids")
        ans = it["answer"]
        task = it["task"]
        ctypes = [c["type"] for c in claims]
        if task == "select_squares":
            sq = sorted(ans["squares"])
            if "from" in ans:
                c = next((c for c in claims if c["type"] == "legal_destinations"), None)
                if not c or sorted(c["params"]["to"]) != sq or c["params"]["from"] != ans["from"]:
                    problems.append(f"{iid}: select_squares answer != legal_destinations claim")
                if not sq:
                    problems.append(f"{iid}: empty answer squares")
            else:
                c = next((c for c in claims if c["type"] == "loose_pieces"), None)
                if not c or sorted(c["params"]["squares"]) != sq or not sq:
                    problems.append(f"{iid}: select_squares answer != loose_pieces claim")
        elif task == "find_move":
            legal = {m.uci() for m in board.legal_moves}
            claimed = {c["params"].get("move") for c in claims if "move" in c["params"]}
            for m in ans["moves"]:
                if m not in legal:
                    problems.append(f"{iid}: accepted move {m} not legal")
                if m not in claimed:
                    problems.append(f"{iid}: accepted move {m} has no claim")
            for m in it.get("feedback_by_move", {}):
                if m not in legal:
                    problems.append(f"{iid}: feedback move {m} not legal")
                if m not in claimed:
                    problems.append(f"{iid}: feedback move {m} has no claim")
            if all(c["type"] == "mate_in" and c["params"]["n"] == 1 for c in claims) and claims:
                mates = set()
                for m in board.legal_moves:
                    board.push(m)
                    if board.is_checkmate():
                        mates.add(m.uci())
                    board.pop()
                if mates != set(ans["moves"]):
                    problems.append(f"{iid}: mate-in-one accepted set {sorted(ans['moves'])} != all mating moves {sorted(mates)}")
            # last hint must not give a move away
            sans = {board.san(chess.Move.from_uci(m)) for m in ans["moves"]}
            for h in hints:
                if any(m in h for m in ans["moves"]) or any(s.rstrip('+#') in h.split() for s in sans if len(s) > 2):
                    problems.append(f"{iid}: a hint mentions the answer move")
            # polarity: accepted moves carry a 'positive' claim, feedback moves a 'negative' one
            for c in claims:
                mv_ = c["params"].get("move")
                if mv_ is None:
                    continue
                if mv_ in ans["moves"]:
                    ok_pos = (c["type"] in ("mate_in", "legal_move")
                              or (c["type"] == "material_after_move" and "min" in c["params"])
                              or (c["type"] == "tablebase" and c["params"]["result"] in ("win", "draw")))
                    if not ok_pos:
                        problems.append(f"{iid}: accepted move {mv_} has a non-positive claim {c['type']} {c['params']}")
                elif mv_ in it.get("feedback_by_move", {}):
                    ok_neg = ((c["type"] == "material_after_move" and "max" in c["params"] and "min" not in c["params"])
                              or (c["type"] == "tablebase" and c["params"]["result"] in ("draw", "loss")))
                    if not ok_neg:
                        problems.append(f"{iid}: feedback move {mv_} has a non-negative claim {c['type']} {c['params']}")
        elif task in ("predict_outcome", "classify_position"):
            key = "outcome" if task == "predict_outcome" else "class"
            out = ans.get(key)
            # answer vs claims, per claim family
            if task == "predict_outcome":
                att = [c for c in claims if c["type"] == "attackers"]
                if len(claims) == 1 and att and out != str(att[0]["params"]["count"]):
                    problems.append(f"{iid}: count answer {out} != attackers claim {att[0]['params']['count']}")
                lp = [c for c in claims if c["type"] == "loose_pieces"]
                if lp:
                    n_ = len(lp[0]["params"]["squares"])
                    want_ = "none" if n_ == 0 else "one" if n_ == 1 else "two or more"
                    if out != want_:
                        problems.append(f"{iid}: loose answer {out} != {want_}")
                if any(c["type"] == "legal_move" for c in claims) and not any(c["type"] in ("illegal_move",) for c in claims) and out not in ("yes",):
                    problems.append(f"{iid}: legal_move claim but answer {out}")
                if any(c["type"] == "illegal_move" for c in claims) and out != "no":
                    problems.append(f"{iid}: illegal_move claim but answer {out}")
                mm = [c for c in claims if c["type"] == "material_after_move"]
                if mm and ans.get("options") == ["yes", "no"]:
                    c0 = mm[0]["params"]
                    if ("min" in c0 and out != "yes") or ("max" in c0 and out != "no"):
                        problems.append(f"{iid}: material claim {c0} vs answer {out}")
                tb = [c for c in claims if c["type"] == "tablebase" and "move" not in c["params"]]
                if tb:
                    r_ = tb[0]["params"]["result"]
                    if ans.get("options") == ["yes", "no"]:           # 'can the king catch the pawn?': draw = yes
                        if (out == "yes") != (r_ == "draw"):
                            problems.append(f"{iid}: tablebase {r_} vs answer {out}")
                    elif out != r_:
                        problems.append(f"{iid}: tablebase {r_} vs answer {out}")
            if "options" in ans and ans[key] not in ans["options"]:
                problems.append(f"{iid}: answer not in options")
            if task == "classify_position" and "options" not in ans:
                problems.append(f"{iid}: classify_position without options")
            if task == "classify_position":
                gs = next((c for c in claims if c["type"] == "game_state"), None)
                if gs and gs["params"]["state"] != ans["class"]:
                    problems.append(f"{iid}: class != game_state claim")
            if ans.get(key) == "yes" and not any(t in ctypes for t in ("legal_move", "mate_in", "material_after_move", "tablebase")):
                problems.append(f"{iid}: 'yes' answer without a positive claim")
        c_types = Counter(ctypes)
        if "tablebase" in c_types and len(board.piece_map()) > 7:
            problems.append(f"{iid}: tablebase claim with >7 pieces")
    print(f"\n== item sanity ==\n  checked {n_checked} items")

    # ---------------------------------------------------------------- 5. skills
    print("\n== skills ==")
    missing = [s for s in SKILLS_EXPECTED if s not in skills]
    extra = [s for s in skills if s not in SKILLS_EXPECTED and not s.startswith("TAC.")]
    print(f"  expected {len(SKILLS_EXPECTED)}, present among expected: {len(SKILLS_EXPECTED) - len(missing)}; missing {missing}; other skill files in content/skills (not mine): {len([s for s in skills if s not in SKILLS_EXPECTED])}")
    problems += [f"skill file missing: {s}" for s in missing]
    graph = {}
    for sid in SKILLS_EXPECTED:
        s = skills.get(sid)
        if not s:
            continue
        if s["id"] != sid:
            problems.append(f"{sid}: id mismatch")
        if s.get("tier") not in (0, 1):
            problems.append(f"{sid}: tier must be 0 or 1")
        for dname in ("D0", "D1", "D2", "D3"):
            if dname not in s["depths"]:
                problems.append(f"{sid}: depth {dname} missing")
                continue
            dd = s["depths"][dname]
            if not dd.get("outcome") or "prereqs" not in dd:
                problems.append(f"{sid}.{dname}: outcome/prereqs missing")
            graph[f"{sid}.{dname}"] = list(dd.get("prereqs", []))
    all_nodes = set(graph)
    for sf, s in skills.items():
        for dname, dd in s["depths"].items():
            all_nodes.add(f"{sf}.{dname}")
            graph.setdefault(f"{sf}.{dname}", list(dd.get("prereqs", [])))
    for n, pre in graph.items():
        for q in pre:
            if q not in all_nodes:
                problems.append(f"{n}: prerequisite {q} does not exist")
    state = {}
    def dfs(n, stack):
        if state.get(n) == 2:
            return
        if state.get(n) == 1:
            problems.append(f"prerequisite cycle through {n}: {stack}")
            return
        state[n] = 1
        for q in graph.get(n, []):
            dfs(q, stack + [n])
        state[n] = 2
    for n in list(graph):
        dfs(n, [])
    print(f"  graph nodes {len(graph)}; acyclic check done")

    print("\n== RESULT ==")
    if problems:
        print(f"{len(problems)} PROBLEM(S):")
        for p in problems[:80]:
            print("  -", p)
        if len(problems) > 80:
            print(f"  ... {len(problems) - 80} more")
        _s.exit(1)
    print("OK: no problems found")


def _collect_list(obj, out):
    s = set()
    _collect_fens(obj, s)
    out.extend(sorted(s))


if __name__ == "__main__":
    main()
