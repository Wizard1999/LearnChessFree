"""Validation of the shipped opening-explorer data (app/public/openings).

    python -I validate_openings.py --out <app/public/openings> --work <work dir> [--json validation.json]

Checks: structure, (1) ply-1 sanity, (2) conservation + pruned fraction, (3) transpositions,
(4) name coverage, (5) round trip with python-chess.  Prints a report; writes a JSON copy of the numbers.
"""
import argparse, collections, glob, hashlib, json, os, random, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import chess
from build_graph import BANDS, NB, connect
from select_graph import load_names

BAND_IDS = [b[0] for b in BANDS]


def load_all(out):
    core = json.load(open(os.path.join(out, "core.json"), encoding="utf-8"))
    idx = json.load(open(os.path.join(out, "chunks.json")))
    nodes = dict(core["nodes"])
    edges = {}
    problems = []
    for e in core["edges"]:
        edges[(e["f"], e["t"], e["m"])] = e
    chunk_files = sorted(glob.glob(os.path.join(out, "chunks", "*.json")))
    sizes = {}
    dup_nodes = dup_edges = 0
    for fp in chunk_files:
        sizes[os.path.basename(fp)] = os.path.getsize(fp)
        ch = json.load(open(fp, encoding="utf-8"))
        for k, v in ch["nodes"].items():
            if k in nodes:
                dup_nodes += 1
                if nodes[k] != v:
                    problems.append("node %s differs between files" % k)
            else:
                nodes[k] = v
        for e in ch["edges"]:
            key = (e["f"], e["t"], e["m"])
            if key in edges:
                dup_edges += 1
                if edges[key] != e:
                    problems.append("edge %s differs between files" % (key,))
            else:
                edges[key] = e
    return core, idx, nodes, edges, sizes, dup_nodes, dup_edges, problems


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--work", required=True)
    ap.add_argument("--json", default=None)
    a = ap.parse_args()
    R = {}
    core, idx, nodes, edges, sizes, dup_nodes, dup_edges, problems = load_all(a.out)
    man = json.load(open(os.path.join(a.out, "manifest.json")))
    # ------------------------------------------------------------------ structure
    out_e = collections.defaultdict(list)
    in_e = collections.defaultdict(list)
    for e in edges.values():
        out_e[e["f"]].append(e)
        in_e[e["t"]].append(e)
        if e["f"] not in nodes: problems.append("edge from unknown node %s" % e["f"])
        if e["t"] not in nodes: problems.append("edge to unknown node %s" % e["t"])
        if nodes.get(e["t"], {}).get("p") != nodes.get(e["f"], {}).get("p", -9) + 1:
            problems.append("edge %s %s does not go from ply p to p+1" % (e["f"], e["m"]))
        for b in range(NB):
            if e["w"][b] + e["d"][b] > e["n"][b]: problems.append("w+d>n on edge %s" % e["m"])
    for k, nd in nodes.items():
        if len(nd["n"]) != NB: problems.append("node n has wrong length")
    core_ids = set(core["nodes"])
    for k in core_ids:
        if core["nodes"][k]["p"] > 8: problems.append("core node ply > 8")
    for fp in glob.glob(os.path.join(a.out, "chunks", "*.json")):
        ch = json.load(open(fp, encoding="utf-8"))
        for k, v in ch["nodes"].items():
            if not 9 <= v["p"] <= 16: problems.append("chunk node ply outside 9..16")
    for k, fn in idx.items():
        if not os.path.exists(os.path.join(a.out, "chunks", fn)): problems.append("missing chunk %s" % fn)
        if core["nodes"].get(k, {}).get("c") != fn: problems.append("chunks.json disagrees with core node %s" % k)
    for k, nd in core["nodes"].items():
        if "c" in nd and idx.get(k) != nd["c"]: problems.append("core node c without index entry")
    R["structure"] = {"nodes": len(nodes), "edges": len(edges), "core_nodes": len(core["nodes"]), "core_edges": len(core["edges"]),
                      "chunk_files": len(sizes), "dup_node_entries_across_chunks": dup_nodes, "dup_edge_entries_across_chunks": dup_edges,
                      "problems": problems[:20], "n_problems": len(problems)}
    print("STRUCTURE: %d nodes, %d edges (core %d/%d), %d chunk files, duplicated node entries across chunk files %d, edge entries %d, problems: %d" % (
        len(nodes), len(edges), len(core["nodes"]), len(core["edges"]), len(sizes), dup_nodes, dup_edges, len(problems)))
    for p in problems[:10]: print("   !", p)

    # ------------------------------------------------------------------ (1) ply-1 shares
    root_id = [k for k, v in nodes.items() if v["p"] == 0][0]
    root = nodes[root_id]
    tot_root = sum(root["n"])
    print("\n(1) PLY-1 SHARES (share of games whose first move is ...)")
    names1 = {}
    rows = []
    for e in out_e[root_id]:
        rows.append((sum(e["n"]), e))
    rows.sort(key=lambda x: -x[0])
    R["ply1"] = {}
    hdr = "%-6s %8s " % ("move", "all") + " ".join("%7s" % b for b in BAND_IDS)
    print(hdr)
    for tot, e in rows[:8]:
        shares = [100.0 * e["n"][b] / root["n"][b] for b in range(NB)]
        print("%-6s %7.2f%% " % (e["m"], 100.0 * tot / tot_root) + " ".join("%6.2f%%" % s for s in shares))
        R["ply1"][e["m"]] = {"all": 100.0 * tot / tot_root, "bands": shares}
    cover = 100.0 * sum(t for t, _ in rows) / tot_root
    print("moves kept at ply 1: %d, covering %.3f%% of the games' first moves" % (len(rows), cover))
    # white score of e4 / d4 (white wins + draws/2)
    for tot, e in rows[:4]:
        sc = [100.0 * (e["w"][b] + 0.5 * e["d"][b]) / max(e["n"][b], 1) for b in range(NB)]
        print("   white score after 1.%s per band: " % e["m"] + " ".join("%5.1f" % s for s in sc))

    # ------------------------------------------------------------------ (2) conservation
    viol = 0
    eq = 0
    checked = 0
    worst = None
    for k, nd in nodes.items():
        oe = out_e.get(k)
        if not oe:
            continue
        checked += 1
        s = [sum(e["n"][b] for e in oe) for b in range(NB)]
        if any(s[b] > nd["n"][b] for b in range(NB)):
            viol += 1
            worst = worst or (k, nd["n"], s)
        if s == nd["n"]:
            eq += 1
    print("\n(2) CONSERVATION: nodes with outgoing edges: %d; violations of sum(out n) <= node n (per band): %d; equality in all bands: %d" % (checked, viol, eq))
    if worst: print("   first violation:", worst)
    con = connect(a.work, readonly=True)
    q = """WITH k AS (SELECT KN.pos, KN.ply, %s AS n FROM KN JOIN NODE USING (pos) WHERE KN.ply < 16),
                ok AS (SELECT f, sum(N) AS s FROM KE GROUP BY f),
                oa AS (SELECT f, sum(N) AS s FROM PE GROUP BY f)
           SELECT k.ply, sum(k.n), sum(coalesce(oa.s,0)), sum(coalesce(ok.s,0)), count(*)
           FROM k LEFT JOIN ok ON ok.f = k.pos LEFT JOIN oa ON oa.f = k.pos GROUP BY k.ply ORDER BY k.ply""" % "+".join("NODE.n%d" % b for b in range(NB))
    rows2 = con.execute(q).fetchall()
    print("   per ply of the source node (kept nodes only):  visits | retained continuations (all edges) | shown (kept edges) | nodes")
    R["conservation"] = {"violations": viol, "equal": eq, "checked": checked, "per_ply": []}
    tv = ta = tk = 0
    for ply, v, oa_, ok_, cnt in rows2:
        print("   ply %2d: %12d | %5.1f%% | %5.1f%% | %d nodes" % (ply, v, 100.0 * oa_ / v, 100.0 * ok_ / v, cnt))
        R["conservation"]["per_ply"].append([ply, int(v), int(oa_), int(ok_), cnt])
        tv += v; ta += oa_; tk += ok_
    print("   all plies: shown edges carry %.1f%% of node visits; %.1f%% of the retained continuations were pruned (%.1f%% of visits ended, were cut by maxPly=16 or were singleton lines dropped by the c0=2 floor)" % (
        100.0 * tk / tv, 100.0 * (ta - tk) / ta, 100.0 * (tv - ta) / tv))
    R["conservation"]["pruned_fraction_of_retained_continuations"] = (ta - tk) / ta
    R["conservation"]["share_shown"] = tk / tv
    # pruned fraction inside the core only (plies 0-7)
    cv = sum(r[1] for r in R["conservation"]["per_ply"] if r[0] <= 7)
    ck = sum(r[3] for r in R["conservation"]["per_ply"] if r[0] <= 7)
    ca = sum(r[2] for r in R["conservation"]["per_ply"] if r[0] <= 7)
    print("   core only (source plies 0-7): shown %.1f%% of visits, pruned %.1f%% of retained continuations" % (100.0 * ck / cv, 100.0 * (ca - ck) / ca))
    R["conservation"]["core_share_shown"] = ck / cv
    R["conservation"]["core_pruned_fraction"] = (ca - ck) / ca

    # ------------------------------------------------------------------ (3) transpositions
    cand = []
    for k, ins in in_e.items():
        p = nodes[k]["p"]
        if 4 <= p <= 8:
            cand.append((len(ins), sum(nodes[k]["n"]), k))
    cand.sort(reverse=True)
    print("\n(3) TRANSPOSITIONS: nodes at plies 4-8 with the most distinct parent positions (kept edges)")
    R["transpositions"] = []
    for npar, n, k in cand[:15]:
        nd = nodes[k]
        label = "%s %s" % (nd["eco"] or "", nd["name"] or "(unnamed)")
        orders = sorted(in_e[k], key=lambda e: -sum(e["n"]))
        ords = ["%s %s [%d]" % (nodes[e["f"]]["path"], e["m"], sum(e["n"])) for e in orders[:4]]
        print("  ply %d, %d parents, n=%d  %s\n      path: %s\n      orders: %s" % (nd["p"], npar, n, label.strip(), nd["path"], " | ".join(ords)))
        R["transpositions"].append({"ply": nd["p"], "parents": npar, "n": n, "name": label.strip(), "path": nd["path"], "orders": ords})
    big = sum(1 for k, ins in in_e.items() if len(ins) > 1)
    print("  nodes with more than one parent in the kept graph: %d of %d (%.1f%%)" % (big, len(nodes), 100.0 * big / len(nodes)))
    R["multi_parent_nodes"] = [big, len(nodes)]

    # ------------------------------------------------------------------ (4) names
    top = sorted((k for k in nodes if nodes[k]["p"] > 0), key=lambda k: -sum(nodes[k]["n"]))[:500]
    named = sum(1 for k in top if nodes[k]["name"])
    names, _ = load_names()
    inh = 0
    for k in top:
        if nodes[k]["name"]:
            inh += 1
            continue
        b = chess.Board()
        got = False
        for san in nodes[k]["path"].split():
            b.push_san(san)
            if b.epd() in names:
                got = True
        inh += got
    print("\n(4) NAMES: top-500 nodes by count: %d have their own opening name (%.1f%%); %d (%.1f%%) have a name on the node or somewhere on its path" % (
        named, 100.0 * named / 500, inh, 100.0 * inh / 500))
    allnamed = sum(1 for nd in nodes.values() if nd["name"])
    print("    all nodes: %d of %d carry a name (%.1f%%)" % (allnamed, len(nodes), 100.0 * allnamed / len(nodes)))
    for p_ in (4, 8, 12, 16):
        sel = [nd for nd in nodes.values() if nd["p"] == p_]
        if sel: print("    ply %2d: %.1f%% named (%d nodes)" % (p_, 100.0 * sum(1 for nd in sel if nd["name"]) / len(sel), len(sel)))
    R["names"] = {"top500_named": named, "top500_named_or_ancestor": inh, "all_named": allnamed, "all": len(nodes)}
    unnamed_top = [nodes[k] for k in top if not nodes[k]["name"]][:8]
    print("    biggest unnamed nodes: " + "; ".join("%s (%d)" % (nd["path"], sum(nd["n"])) for nd in unnamed_top))

    # ------------------------------------------------------------------ (5) round trip
    rnd = random.Random(7)
    keys = rnd.sample(sorted(edges), 20)
    ok = 0
    print("\n(5) ROUND TRIP: 20 random edges, rebuilt from the start position via path + UCI with python-chess")
    for key in keys:
        e = edges[key]
        f, t = nodes[e["f"]], nodes[e["t"]]
        b = chess.Board()
        for san in f["path"].split():
            b.push_san(san)
        good = hashlib.sha1(b.epd().encode()).hexdigest().startswith(e["f"]) and b.epd() == f["e"]
        mv = chess.Move.from_uci(e["u"])
        legal = mv in b.legal_moves
        san = b.san(mv) if legal else None
        b.push(mv)
        good = good and legal and san == e["m"] and b.epd() == t["e"] and hashlib.sha1(b.epd().encode()).hexdigest().startswith(e["t"])
        ok += good
        print("   %-5s %s -> ply %d %s %s" % ("ok" if good else "FAIL", (f["path"] or "(start)") + " " + e["m"], t["p"], e["t"], "" if good else "<<<"))
    print("   %d/20 ok" % ok)
    R["round_trip"] = [ok, 20]
    # every node: id == sha1(epd)[:len(id)]
    bad = sum(1 for k, nd in nodes.items() if hashlib.sha1(nd["e"].encode()).hexdigest()[:len(k)] != k)
    print("   all %d nodes: id == sha1(EPD) prefix: %d mismatches" % (len(nodes), bad))
    R["id_mismatches"] = bad
    # bands
    print("\nBANDS (games in root):", ", ".join("%s=%d" % (BAND_IDS[b], root["n"][b]) for b in range(NB)), "| total", tot_root)
    print("SIZES: core.json %.2f MB; chunks %d files, total %.2f MB, largest %.2f MB, mean %.2f MB" % (
        os.path.getsize(os.path.join(a.out, "core.json")) / 1e6, len(sizes), sum(sizes.values()) / 1e6,
        max(sizes.values()) / 1e6 if sizes else 0, (sum(sizes.values()) / len(sizes) / 1e6) if sizes else 0))
    total = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(a.out) for f in fs)
    print("TOTAL app/public/openings: %.2f MB" % (total / 1e6))
    R["sizes"] = {"core": os.path.getsize(os.path.join(a.out, "core.json")), "chunks": sizes, "total": total}
    if a.json:
        json.dump(R, open(a.json, "w"), indent=1)


if __name__ == "__main__":
    main()
