#!/usr/bin/env python3
"""Check the curriculum graph in content/skills/*.json.

Usage:  python tools/check_graph.py [--top N] [--route] [--quiet] [--json] [--strict]
        (project convention: ./tools/.venv/Scripts/python.exe -I tools/check_graph.py)

Reports (exit status 1 if any ERROR):
  * schema problems per node (missing fields, non-contiguous depths, bad ids)
  * missing references (node or depth does not exist)
  * cycles in the hard-prerequisite graph (printed), at depth level and at node level
  * tier inversions: a node whose tier is LOWER than the tier of a hard prerequisite (error)
  * orphans: no hard prerequisite and no hard dependent (allowed only for tiers 0-1)
  * advanced roots: tier >= 2 with no hard prerequisite at any depth (warning)
  * average hard in-degree (must be <= 2.5), per-tier and per-strand counts, longest prerequisite chain
  * the most connected nodes (feeds docs/skill-graph.md)
  * soft_prereqs references; hard+soft cycles (warning)
  * the 'Default route' section of docs/skill-graph.md (numbered lines starting with an id in backticks) is
    checked: every node's D0-D2 prerequisites appear earlier in the route (skip with --no-route)

Terms.  A reference is "NODE.Dn".  The hard-prerequisite graph has one vertex per NODE.Dn.  Depth Dn (n>=2)
lists NODE.D(n-1) explicitly (the schema's chain); cross-node prerequisites are every other reference.
In-degree of a node = number of DISTINCT other nodes referenced by any of its depths.

Ids written by another worker may be absent while that worker is running; references to them are accepted
(PENDING below) and checked against assumed tiers (a warning only). Once their files exist they are checked
like any other node.
"""
import argparse
import collections
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SKILLS = ROOT / "content" / "skills"
DOC = ROOT / "docs" / "skill-graph.md"

# Written by the foundation worker; may be missing while that worker runs.
PENDING = {
    "FND.BOARD": 0, "FND.PIECE.ROOK": 0, "FND.PIECE.BISHOP": 0, "FND.PIECE.QUEEN": 0, "FND.PIECE.KING": 0,
    "FND.PIECE.KNIGHT": 0, "FND.PIECE.PAWN": 0, "FND.CAPTURE": 0, "FND.VALUE": 0, "FND.CHECK": 1,
    "FND.MATE1": 1, "FND.STALEMATE": 1, "FND.CASTLE": 1, "FND.ENPASSANT": 1, "FND.PROMOTE": 1, "FND.SPECIAL": 1,
    "SAF.LOOSE": 1, "SAF.COUNT": 2, "SAF.DEFEND-OPTIONS": 2, "SAF.THREAT": 1,
    "END.MATE-KQ": 1, "END.MATE-KR": 1, "END.PAWN-RACE": 1, "END.OPPOSITION": 3, "OPN.PRINCIPLES": 1,
}  # value = assumed tier, used only to warn about inversions while the file is absent

TAG = re.compile(r"\[[^\]]+\]\.?$")
REF = re.compile(r"^(?P<id>.+)\.D(?P<d>[0-5])$")
STRAND = re.compile(r"^S(1[01]|[1-9])$")
MAX_AVG_INDEGREE = 2.5


class Report:
    def __init__(self):
        self.errors, self.warnings = [], []
        self.notes = collections.defaultdict(list)  # node id -> style remarks (never fail the run)

    def err(self, msg):
        self.errors.append(msg)

    def warn(self, msg):
        self.warnings.append(msg)

    def note(self, nid, msg):
        self.notes[nid].append(msg)


def parse_ref(ref):
    m = REF.match(ref) if isinstance(ref, str) else None
    return (m.group("id"), int(m.group("d"))) if m else (None, None)


def load(rep):
    nodes = {}
    if not SKILLS.is_dir():
        rep.err("no directory %s" % SKILLS)
        return nodes
    for path in sorted(SKILLS.glob("*.json")):
        try:
            node = json.loads(path.read_text(encoding="utf-8"))
        except Exception as e:  # noqa: BLE001
            rep.err("%s: unreadable JSON (%s)" % (path.name, e))
            continue
        nid = node.get("id")
        if nid != path.stem:
            rep.err("%s: id %r does not match the file name" % (path.name, nid))
        if nid in nodes:
            rep.err("duplicate id %s" % nid)
        nodes[path.stem] = node
    return nodes


def check_schema(nodes, rep):
    for nid, n in nodes.items():
        for key in ("id", "title", "strand", "tier", "depths", "misconceptions", "sources", "rating",
                    "conditions", "contrasts"):
            if key not in n:
                rep.err("%s: missing field %r" % (nid, key))
        if not isinstance(n.get("title"), str) or not n.get("title", "").strip():
            rep.err("%s: empty title" % nid)
        if not STRAND.match(str(n.get("strand", ""))):
            rep.err("%s: strand %r is not S1..S11" % (nid, n.get("strand")))
        t = n.get("tier")
        if not isinstance(t, int) or isinstance(t, bool) or not 0 <= t <= 7:
            rep.err("%s: tier %r is not an integer 0..7" % (nid, t))
        depths = n.get("depths")
        if not isinstance(depths, dict) or not depths:
            rep.err("%s: no depths" % nid)
            continue
        want = ["D%d" % i for i in range(len(depths))]
        if sorted(depths) != want or len(depths) > 6:
            rep.err("%s: depths %s are not contiguous from D0 (max D5)" % (nid, sorted(depths)))
        for dk in sorted(depths):
            d = depths[dk]
            if not isinstance(d.get("outcome"), str) or len(d.get("outcome", "").split()) < 5:
                rep.err("%s.%s: outcome missing or too short" % (nid, dk))
            if not isinstance(d.get("prereqs"), list):
                rep.err("%s.%s: prereqs is not a list" % (nid, dk))
                continue
            for r in d["prereqs"]:
                if parse_ref(r)[0] is None:
                    rep.err("%s.%s: malformed prerequisite %r" % (nid, dk, r))
            k = int(dk[1:]) if re.match(r"^D\d$", dk) else None
            if k == 0 and d["prereqs"]:
                rep.warn("%s.D0 has prerequisites (D0 should be free)" % nid)
            if k is not None and k >= 2 and "%s.D%d" % (nid, k - 1) not in d["prereqs"]:
                rep.warn("%s.%s does not list %s.D%d (chain)" % (nid, dk, nid, k - 1))
        rating = n.get("rating")
        if not isinstance(rating, dict) or rating.get("grade") not in ("G0", "G1", "G2", "G3"):
            rep.err("%s: rating.grade must be G0..G3" % nid)
        for key in ("conditions", "contrasts", "sources"):
            v = n.get(key)
            if not isinstance(v, list) or not v or not all(isinstance(x, str) and x.strip() for x in v):
                rep.warn("%s: %s empty or not a list of strings" % (nid, key))
        # evidence for every condition and contrast lives in parallel arrays, so that the app can show the
        # texts to learners without author tags: condition_sources / contrast_sources / contrast_kinds
        for text_key, src_key in (("conditions", "condition_sources"), ("contrasts", "contrast_sources")):
            a_, b_ = n.get(text_key), n.get(src_key)
            if isinstance(a_, list) and (not isinstance(b_, list) or len(a_) != len(b_)):
                rep.err("%s: %s must be a list as long as %s" % (nid, src_key, text_key))
        kinds = n.get("contrast_kinds")
        if isinstance(n.get("contrasts"), list):
            if not isinstance(kinds, list) or len(kinds) != len(n["contrasts"]) or any(k not in ("fails", "irrelevant") for k in kinds):
                rep.err("%s: contrast_kinds must align with contrasts and be 'fails' or 'irrelevant'" % nid)
            else:
                for want in ("fails", "irrelevant"):
                    if want not in kinds:
                        rep.note(nid, "no '%s' contrast" % want)
        if not n.get("misconceptions"):
            rep.warn("%s: no misconceptions" % nid)
        sp = n.get("soft_prereqs", [])
        if not isinstance(sp, list) or not all(isinstance(x, str) for x in sp):
            rep.err("%s: soft_prereqs must be a list of 'NODE.Dn' strings" % nid)
        else:
            notes = n.get("soft_prereq_notes", {})
            if not isinstance(notes, dict) or set(notes) != set(sp):
                rep.err("%s: soft_prereq_notes must have exactly one explanation per soft prerequisite" % nid)


def build_graph(nodes, rep):
    """Return (dedges, nedges, pending_used). dedges: (id,d) -> set((id,d)); nedges: id -> set(id)."""
    dedges = collections.defaultdict(set)
    nedges = collections.defaultdict(set)
    pending_used = collections.defaultdict(set)  # pending id -> set of depths referenced
    for nid, n in nodes.items():
        for dk, d in n.get("depths", {}).items():
            if not isinstance(d, dict) or not isinstance(d.get("prereqs"), list):
                continue
            k = int(dk[1:])
            dedges[(nid, k)]  # make sure every vertex exists
            for r in d["prereqs"]:
                tid, td = parse_ref(r)
                if tid is None:
                    continue
                if tid == nid:
                    if td >= k:
                        rep.err("%s.%s: refers to its own depth D%d (not lower)" % (nid, dk, td))
                    elif td not in [int(x[1:]) for x in n["depths"]]:
                        rep.err("%s.%s: refers to missing own depth D%d" % (nid, dk, td))
                    dedges[(nid, k)].add((nid, td))
                    continue
                if tid in nodes:
                    if "D%d" % td not in nodes[tid].get("depths", {}):
                        rep.err("%s.%s: %s does not exist (node %s has depths %s)"
                                % (nid, dk, r, tid, sorted(nodes[tid]["depths"])))
                        continue
                elif tid in PENDING:
                    pending_used[tid].add(td)
                else:
                    rep.err("%s.%s: missing reference %s (no node %s)" % (nid, dk, r, tid))
                    continue
                dedges[(nid, k)].add((tid, td))
                nedges[nid].add(tid)
    return dedges, nedges, pending_used


def find_cycle(edges, vertices):
    """Return one cycle as a list of vertices (first == last) or None. Iterative DFS."""
    WHITE, GREY, BLACK = 0, 1, 2
    color = {v: WHITE for v in vertices}
    for start in vertices:
        if color[start] != WHITE:
            continue
        stack = [(start, iter(sorted(edges.get(start, ()))))]
        color[start] = GREY
        path = [start]
        while stack:
            v, it = stack[-1]
            nxt = next(it, None)
            if nxt is None:
                color[v] = BLACK
                stack.pop()
                path.pop()
                continue
            if nxt not in color:  # reference to an absent (pending) vertex
                continue
            if color[nxt] == GREY:
                return path[path.index(nxt):] + [nxt]
            if color[nxt] == WHITE:
                color[nxt] = GREY
                stack.append((nxt, iter(sorted(edges.get(nxt, ())))))
                path.append(nxt)
    return None


def fmt(v):
    return "%s.D%d" % v if isinstance(v, tuple) else str(v)


def longest_chain(edges, vertices):
    """Longest path (in vertices) following prerequisite edges in a DAG. Returns list from root to leaf."""
    memo = {}

    def depth(v, seen=()):
        if v in memo:
            return memo[v]
        best = (1, [v])
        for w in edges.get(v, ()):
            if w not in vertices or w in seen:
                continue
            sub = depth(w, seen + (v,))
            if sub[0] + 1 > best[0]:
                best = (sub[0] + 1, [v] + sub[1])
        memo[v] = best
        return best

    sys.setrecursionlimit(10000)
    best = (0, [])
    for v in sorted(vertices, key=fmt):
        r = depth(v)
        if r[0] > best[0]:
            best = r
    return list(reversed(best[1]))  # root first


def route_ids():
    """Parse the 'Default route' section of docs/skill-graph.md: numbered lines with `ID` in backticks."""
    if not DOC.exists():
        return None
    text = DOC.read_text(encoding="utf-8")
    m = re.search(r"^##\s+(?:\d+\.\s+)?Default route.*?$(.*?)(?=^##\s|\Z)", text, re.S | re.M)
    if not m:
        return None
    ids = []
    for line in m.group(1).splitlines():
        mm = re.match(r"^\s*\d+\.\s+`([^`]+)`", line)
        if mm:
            ids.append(mm.group(1))
    return ids


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--top", type=int, default=10, help="how many most-connected nodes to list")
    ap.add_argument("--quiet", action="store_true", help="only errors, warnings and the summary line")
    ap.add_argument("--json", action="store_true", help="print a machine-readable summary at the end")
    ap.add_argument("--strict", action="store_true", help="warnings also fail the run")
    ap.add_argument("--skills", default=None, help="directory of skill JSON files (default content/skills; for tests)")
    ap.add_argument("--no-route", action="store_true", help="do not check the default route in docs/skill-graph.md")
    args = ap.parse_args()
    global SKILLS
    if args.skills:
        SKILLS = pathlib.Path(args.skills).resolve()
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:  # noqa: BLE001
        pass

    rep = Report()
    nodes = load(rep)
    check_schema(nodes, rep)
    dedges, nedges, pending_used = build_graph(nodes, rep)
    absent = sorted(i for i in PENDING if i not in nodes)

    # ---- cycles
    verts = set(dedges)
    cyc = find_cycle(dedges, verts)
    if cyc:
        rep.err("CYCLE at depth level: " + " -> ".join(fmt(v) for v in cyc))
    ncyc = find_cycle(nedges, set(nodes))
    if ncyc:
        rep.err("CYCLE at node level (kept acyclic by policy): " + " -> ".join(ncyc))

    # ---- tiers
    for nid, tos in sorted(nedges.items()):
        for tid in sorted(tos):
            tn = nodes[nid].get("tier")
            if tid in nodes:
                tt = nodes[tid].get("tier")
                if isinstance(tn, int) and isinstance(tt, int) and tn < tt:
                    rep.err("TIER inversion: %s (tier %d) needs %s (tier %d)" % (nid, tn, tid, tt))
            elif tid in PENDING and isinstance(tn, int) and tn < PENDING[tid]:
                rep.warn("tier (assumed): %s (tier %d) needs pending %s (assumed tier %d)"
                         % (nid, tn, tid, PENDING[tid]))

    # ---- in/out degree, orphans
    indeg = {nid: len(nedges.get(nid, ())) for nid in nodes}
    dependents = collections.defaultdict(set)
    for nid, tos in nedges.items():
        for tid in tos:
            dependents[tid].add(nid)
    orphans, adv_roots, leaves = [], [], []
    for nid, n in sorted(nodes.items()):
        tier = n.get("tier", 0)
        if indeg[nid] == 0 and not dependents.get(nid):
            (orphans.append(nid) if tier >= 2 else None)
        if indeg[nid] == 0 and isinstance(tier, int) and tier >= 2:
            adv_roots.append(nid)
        if not dependents.get(nid):
            leaves.append(nid)
    for nid in orphans:
        rep.err("ORPHAN: %s (tier %d) has no hard prerequisite and no dependent" % (nid, nodes[nid]["tier"]))
    for nid in adv_roots:
        if nid not in orphans:
            rep.warn("advanced root: %s (tier %d) has no hard prerequisite at any depth" % (nid, nodes[nid]["tier"]))
    tier01_roots = [nid for nid in nodes if indeg[nid] == 0 and nodes[nid].get("tier", 9) <= 1]
    avg_in = sum(indeg.values()) / len(indeg) if indeg else 0.0
    if avg_in > MAX_AVG_INDEGREE:
        rep.err("average hard in-degree %.2f exceeds %.1f" % (avg_in, MAX_AVG_INDEGREE))
    for nid, k in sorted(indeg.items(), key=lambda kv: -kv[1]):
        if k > 4:
            rep.warn("%s has %d distinct hard prerequisite nodes (a node should not lean on a whole tier)" % (nid, k))
        else:
            break
    cross_per_depth = []
    for (nid, k), outs in dedges.items():
        if k >= 1:
            cross_per_depth.append(len([o for o in outs if o[0] != nid]))
    avg_depth_in = sum(cross_per_depth) / len(cross_per_depth) if cross_per_depth else 0.0

    # ---- soft prerequisites
    for nid, n in sorted(nodes.items()):
        for sp in n.get("soft_prereqs", []) or []:
            ref = sp if isinstance(sp, str) else None
            tid, td = parse_ref(ref)
            if tid is None:
                rep.err("%s: malformed soft prerequisite %r" % (nid, sp))
            elif tid == nid:
                rep.err("%s: soft prerequisite refers to itself" % nid)
            elif tid in nodes:
                if "D%d" % td not in nodes[tid]["depths"]:
                    rep.err("%s: soft prerequisite %s names a missing depth" % (nid, ref))
                elif nodes[tid].get("tier", 0) > nodes[nid].get("tier", 0):
                    rep.warn("%s (tier %d): soft prerequisite %s has a higher tier (%d)"
                             % (nid, nodes[nid]["tier"], tid, nodes[tid]["tier"]))
            elif tid not in PENDING:
                rep.err("%s: soft prerequisite %s does not exist" % (nid, ref))
            pass
    mixed = {k: set(v) for k, v in nedges.items()}
    for nid, n in nodes.items():
        for sp in n.get("soft_prereqs", []) or []:
            tid, _ = parse_ref(sp if isinstance(sp, str) else None)
            if tid in nodes and tid != nid:
                mixed.setdefault(nid, set()).add(tid)
    mcyc = find_cycle(mixed, set(nodes)) if not ncyc else None
    if mcyc:
        rep.warn("hard+soft cycle: " + " -> ".join(mcyc))

    # ---- evidence summary (where do the conditions and contrasts come from?)
    ev = collections.Counter()
    only_ours = []
    for nid, n in nodes.items():
        srcs = list(n.get("condition_sources") or []) + list(n.get("contrast_sources") or [])
        for sr in srcs:
            sr = str(sr).strip()
            if sr == "ours" or sr.startswith("ours;") or sr.startswith("rules"):
                ev["ours"] += 1
            elif re.match(r"^(CAP|Nimz|EML|EDL|ZB)", sr):
                ev["sheet"] += 1
            else:
                ev["docs"] += 1
        if srcs and all(str(sr).strip().startswith("ours") for sr in srcs):
            only_ours.append(nid)

    # ---- counts
    by_tier = collections.Counter(n.get("tier") for n in nodes.values())
    by_strand = collections.Counter(n.get("strand") for n in nodes.values())
    matrix = collections.defaultdict(collections.Counter)
    for n in nodes.values():
        matrix[n.get("strand")][n.get("tier")] += 1
    chain_nodes = longest_chain(nedges, set(nodes)) if not ncyc else []
    chain_depths = longest_chain(dedges, verts) if not cyc else []
    degree = {nid: (indeg[nid], len(dependents.get(nid, ()))) for nid in nodes}
    for pid in PENDING:
        if pid not in nodes and dependents.get(pid):
            degree[pid] = (0, len(dependents[pid]))  # in-degree unknown while the file is absent
    ranking = sorted(degree, key=lambda i: (-(degree[i][0] + degree[i][1]), -degree[i][1], i))

    # ---- route
    route = None if args.no_route else route_ids()
    route_report = None
    if route is not None:
        pos, problems = {}, []
        for i, rid in enumerate(route):
            if rid in pos:
                problems.append("duplicate in route: %s" % rid)
            pos.setdefault(rid, i)
            if rid not in nodes and rid not in PENDING:
                problems.append("route names unknown node %s" % rid)
        for i, rid in enumerate(route):
            # the route is the order of FIRST meeting (D0-D2); prerequisites of D3 and up are not needed yet
            early = {t for (a, k), outs in dedges.items() if a == rid and k <= 2 for (t, _td) in outs if t != rid}
            for pre in sorted(early):
                if pre not in pos:
                    problems.append("route: %s needs %s, which is not in the route" % (rid, pre))
                elif pos[pre] > i:
                    problems.append("route: %s (#%d) comes before its prerequisite %s (#%d)" % (rid, i + 1, pre, pos[pre] + 1))
        for p in problems:
            rep.err(p)
        route_report = (len(route), len(problems))

    # ---- print
    p = (lambda *a: None) if args.quiet else print
    p("Skill graph: %d nodes in %s" % (len(nodes), SKILLS))
    if absent:
        p("Pending ids (not yet written, references accepted): %d -> %s" % (len(absent), ", ".join(absent)))
    p("")
    p("Per tier   : " + "  ".join("T%s=%d" % (t, by_tier[t]) for t in sorted(by_tier, key=lambda x: (x is None, x))))
    p("Per strand : " + "  ".join("%s=%d" % (s, by_strand[s]) for s in sorted(by_strand, key=lambda s: int(str(s)[1:]) if str(s)[1:].isdigit() else 99)))
    p("")
    p("Strand x tier")
    p("        " + " ".join("T%d" % t for t in range(8)) + "  total")
    for s in sorted(matrix, key=lambda s: int(str(s)[1:]) if str(s)[1:].isdigit() else 99):
        p("  %-4s  " % s + " ".join("%2d" % matrix[s][t] for t in range(8)) + "   %3d" % sum(matrix[s].values()))
    p("")
    nedge_total = sum(len(v) for v in nedges.values())
    p("Hard edges (distinct node pairs): %d   average hard in-degree: %.2f (limit %.1f)   max: %d"
      % (nedge_total, avg_in, MAX_AVG_INDEGREE, max(indeg.values()) if indeg else 0))
    p("Average cross-node prerequisites per depth (D1 and up): %.2f" % avg_depth_in)
    hist = collections.Counter(indeg.values())
    p("In-degree histogram: " + "  ".join("%d:%d" % (k, hist[k]) for k in sorted(hist)))
    tot_ev = sum(ev.values()) or 1
    p("Conditions and contrasts by source: five synthesis sheets %d, project docs %d, ours (unsourced) %d (%.0f%%); nodes with only [ours] lines: %d"
      % (ev["sheet"], ev["docs"], ev["ours"], 100.0 * ev["ours"] / tot_ev, len(only_ours)))
    p("Tier 0-1 roots (no prerequisites): %d" % len(tier01_roots))
    p("Leaf nodes (nothing depends on them): %d" % len(leaves))
    p("")
    if chain_nodes:
        p("Longest prerequisite chain: %d nodes" % len(chain_nodes))
        p("  " + " -> ".join(chain_nodes))
    if chain_depths:
        p("Longest depth-level chain: %d steps" % len(chain_depths))
        p("  " + " -> ".join(fmt(v) for v in chain_depths))
    p("")
    p("Most connected nodes (hard in + hard out):")
    for nid in ranking[:args.top]:
        if nid in nodes:
            p("  %-26s tier %d  in %2d  out %2d   %s" % (nid, nodes[nid]["tier"], degree[nid][0], degree[nid][1], nodes[nid]["title"]))
        else:
            p("  %-26s tier %d  in  ?  out %2d   (pending: written by another worker; in-degree unknown)" % (nid, PENDING[nid], degree[nid][1]))
    if pending_used:
        p("")
        p("Depths referenced on pending ids: " + "; ".join("%s: %s" % (k, ",".join("D%d" % d for d in sorted(v))) for k, v in sorted(pending_used.items())))
    if route_report:
        p("")
        p("Default route in docs/skill-graph.md: %d nodes, %d problems" % route_report)
    p("")
    if rep.notes and not args.quiet:
        print("Style notes (do not fail the run): %d nodes" % len(rep.notes))
        for nid in sorted(rep.notes):
            print("  %-26s %s" % (nid, "; ".join(rep.notes[nid])))
        print("")
    for w in rep.warnings:
        print("WARNING: " + w)
    for e in rep.errors:
        print("ERROR: " + e)
    fail = bool(rep.errors) or (args.strict and bool(rep.warnings))
    print("%s: %d nodes, %d errors, %d warnings" % ("FAIL" if fail else "OK", len(nodes), len(rep.errors), len(rep.warnings)))
    if args.json:
        print(json.dumps({
            "nodes": len(nodes), "errors": len(rep.errors), "warnings": len(rep.warnings),
            "per_tier": {str(k): v for k, v in sorted(by_tier.items())},
            "per_strand": dict(by_strand), "avg_in_degree": round(avg_in, 3),
            "longest_chain": chain_nodes, "top": ranking[:args.top],
        }, indent=2))
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main())
