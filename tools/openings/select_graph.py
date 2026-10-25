"""Stage 5: apply thresholds, name, id, chunk and write the JSON for the web app.

    python -I select_graph.py --work <dir> --out <outdir> --core-min 150 --chunk-min 60 --early-floor 10 [--dry]

Reads <work>/graph.duckdb (tables TE, NODE, FE from build_graph.py prep), the scan markers in <work>/clusters
and the opening names in library/data/chess-openings.  See docs/openings-data.md for the method.
"""
import argparse, collections, concurrent.futures as cf, datetime, glob, hashlib, json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import duckdb
from build_graph import BANDS, NB, CORE_PLY, MAXPLY, P, connect
from replay import pkey

OPENINGS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "library", "data", "chess-openings")


def sep(o):
    return json.dumps(o, separators=(",", ":"), ensure_ascii=False)


# ------------------------------------------------------------------------------------------ selection
def select_graph(con, core_min, chunk_min, early_floor, early_ply):
    con.execute("DROP TABLE IF EXISTS KN"); con.execute("DROP TABLE IF EXISTS KE")
    root = con.execute("SELECT pos FROM NODE WHERE ply = 0").fetchone()[0]
    con.execute("CREATE TABLE KN (pos UBIGINT, ply INT)")
    con.execute("INSERT INTO KN VALUES (%d, 0)" % root)
    con.execute("CREATE TABLE KE AS SELECT * FROM FE WHERE false")
    for k in range(1, MAXPLY + 1):
        thr = core_min if k <= CORE_PLY else chunk_min
        con.execute("""INSERT INTO KE SELECT FE.* FROM FE JOIN (SELECT pos FROM KN WHERE ply = %d) kn ON FE.f = kn.pos
                       WHERE FE.fply = %d AND (FE.N >= %d OR (%d <= %d AND FE.N >= %d))""" % (
            k - 1, k - 1, thr, k - 1, early_ply, early_floor))
        con.execute("INSERT INTO KN SELECT DISTINCT t, %d FROM KE WHERE fply = %d" % (k, k - 1))
    return root


def band_arr(row, off):
    return [int(x) for x in row[off:off + NB]]


# --------------------------------------------------------------------------------------------- names
def load_names():
    import chess
    names = collections.defaultdict(list)  # epd -> [(eco, name, san-string)]
    n_lines = 0
    for fn in sorted(glob.glob(os.path.join(OPENINGS_DIR, "?.tsv"))):
        with open(fn, encoding="utf-8") as f:
            next(f)
            for line in f:
                line = line.rstrip("\n")
                if not line:
                    continue
                eco, name, pgn = line.split("\t")
                b = chess.Board()
                toks = [t for t in pgn.split() if not t.endswith(".")]
                for t in toks:
                    b.push_san(t)
                names[b.epd()].append((eco, name, " ".join(toks)))
                n_lines += 1
    return names, n_lines


def choose_name(cands, path):
    if not cands:
        return None, None
    norm = path.replace("+", "").replace("#", "")
    for eco, name, line in cands:
        if line.replace("+", "").replace("#", "") == norm:
            return eco, name
    cands = sorted(cands, key=lambda c: (len(c[2]), c[1]))
    return cands[0][0], cands[0][1]


# --------------------------------------------------------------------------------------------- epd pool
def epd_task(items):
    import chess
    out = []
    for pos, path in items:
        b = chess.Board()
        if path:
            for san in path.split(" "):
                b.push_san(san)
        epd = b.epd()
        out.append((pos, epd, pkey(epd) == pos))
    return out


# --------------------------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--work", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--core-min", type=int, default=150)
    ap.add_argument("--chunk-min", type=int, default=60)
    ap.add_argument("--early-floor", type=int, default=10)
    ap.add_argument("--early-ply", type=int, default=4)
    ap.add_argument("--chunk-cap", type=int, default=1_500_000)
    ap.add_argument("--procs", type=int, default=6)
    ap.add_argument("--dry", action="store_true")
    a = ap.parse_args()
    t0 = time.time()
    con = connect(a.work)
    root = select_graph(con, a.core_min, a.chunk_min, a.early_floor, a.early_ply)
    per = con.execute("""SELECT fply + 1 AS ply, count(*) FROM KE GROUP BY 1 ORDER BY 1""").fetchall()
    nn = con.execute("SELECT ply, count(*) FROM KN GROUP BY 1 ORDER BY 1").fetchall()
    print("kept edges per target ply:", per)
    print("kept nodes per ply:", nn, "total nodes", sum(x[1] for x in nn), "edges", sum(x[1] for x in per), "%.0fs" % (time.time() - t0), flush=True)
    if a.dry:
        return

    # ---- node rows
    cols = ", ".join("n%d" % b for b in range(NB))
    nodes = {}  # pos -> dict
    for row in con.execute("SELECT KN.pos, KN.ply, %s FROM KN JOIN NODE USING (pos)" % ", ".join("NODE.n%d" % b for b in range(NB))).fetchall():
        nodes[row[0]] = {"pos": row[0], "p": row[1], "n": [int(x) for x in row[2:2 + NB]]}
    # ---- edges
    ecols = ["f", "t", "san", "uci", "fply"] + ["n%d" % b for b in range(NB)] + ["w%d" % b for b in range(NB)] + ["d%d" % b for b in range(NB)] + ["N"]
    edges = []
    for row in con.execute("SELECT %s FROM KE" % ", ".join(ecols)).fetchall():
        edges.append({"f": row[0], "t": row[1], "m": row[2], "u": row[3], "fply": row[4],
                      "n": [int(x) for x in row[5:5 + NB]], "w": [int(x) for x in row[5 + NB:5 + 2 * NB]],
                      "d": [int(x) for x in row[5 + 2 * NB:5 + 3 * NB]], "N": int(row[5 + 3 * NB])})
    print("loaded %d nodes, %d edges %.0fs" % (len(nodes), len(edges), time.time() - t0), flush=True)

    # ---- most common path per node (min-ply trie node with the most games, walk up the trie)
    con.execute("DROP TABLE IF EXISTS BEST")
    con.execute("""CREATE TABLE BEST AS SELECT TE.pos, arg_max(TE.child, %s) AS child
                   FROM TE JOIN KN ON TE.pos = KN.pos AND TE.ply = KN.ply GROUP BY TE.pos""" % "+".join("TE.n%d" % b for b in range(NB)))
    rows = con.execute("""WITH RECURSIVE up(pos, cur, path, d) AS (
            SELECT b.pos, te.parent, te.san, 1 FROM BEST b JOIN TE te ON te.child = b.child
            UNION ALL
            SELECT u.pos, te.parent, te.san || ' ' || u.path, u.d + 1 FROM up u JOIN TE te ON te.child = u.cur)
        SELECT pos, arg_max(path, d) FROM up GROUP BY pos""").fetchall()
    paths = {r[0]: r[1] for r in rows}
    paths[root] = ""
    miss = [p for p in nodes if p not in paths]
    print("paths for %d nodes (missing %d) %.0fs" % (len(paths), len(miss), time.time() - t0), flush=True)
    if miss:
        raise SystemExit("nodes without path: %d" % len(miss))
    for pos, nd in nodes.items():
        nd["path"] = paths[pos]
        if len(nd["path"].split()) != nd["p"] and nd["p"] > 0:
            raise SystemExit("path length != ply for node %s" % pos)

    # ---- EPDs (replay the path; also a check that the position key matches)
    items = [(pos, nodes[pos]["path"]) for pos in nodes]
    step = 2000
    bad = 0
    with cf.ProcessPoolExecutor(a.procs) as pool:
        for res in pool.map(epd_task, [items[i:i + step] for i in range(0, len(items), step)]):
            for pos, epd, ok in res:
                nodes[pos]["e"] = epd
                if not ok:
                    bad += 1
    print("epd done, key mismatches: %d  %.0fs" % (bad, time.time() - t0), flush=True)
    if bad:
        raise SystemExit("position-key mismatch for %d nodes" % bad)

    # ---- names
    names, n_lines = load_names()
    named = 0
    for nd in nodes.values():
        eco, name = choose_name(names.get(nd["e"]), nd["path"])
        nd["eco"], nd["name"] = eco, name
        named += name is not None
    print("opening-name lines %d, distinct EPDs %d, kept nodes with a name: %d  %.0fs" % (n_lines, len(names), named, time.time() - t0), flush=True)

    # ---- ids (sha1(EPD)[:10]; extend on collision)
    by_id = {}
    collisions = 0
    for nd in sorted(nodes.values(), key=lambda x: (-sum(x["n"]), x["e"])):
        h = hashlib.sha1(nd["e"].encode()).hexdigest()
        L = 10
        while h[:L] in by_id:
            L += 2
            collisions += 1
        nd["id"] = h[:L]
        by_id[nd["id"]] = nd
    print("id collisions handled: %d" % collisions, flush=True)
    for e in edges:
        e["fid"] = nodes[e["f"]]["id"]
        e["tid"] = nodes[e["t"]]["id"]

    # ---- assemble core / chunks
    def node_json(nd, chunk=None):
        o = {"e": nd["e"], "p": nd["p"], "n": nd["n"], "eco": nd["eco"], "name": nd["name"], "path": nd["path"]}
        if chunk:
            o["c"] = chunk
        return o

    def edge_json(e):
        return {"f": e["fid"], "t": e["tid"], "m": e["m"], "u": e["u"], "n": e["n"], "w": e["w"], "d": e["d"]}

    core_nodes = [nd for nd in nodes.values() if nd["p"] <= CORE_PLY]
    core_edges = [e for e in edges if e["fply"] < CORE_PLY]
    deep_edges = [e for e in edges if e["fply"] >= CORE_PLY]
    out_deep = collections.defaultdict(list)
    for i, e in enumerate(deep_edges):
        out_deep[e["f"]].append(i)
    boundary = sorted([pos for pos in out_deep if nodes[pos]["p"] == CORE_PLY], key=lambda p: (nodes[p]["path"], p))
    esize = [len(sep(edge_json(e))) + 1 for e in deep_edges]
    nsize = {pos: len(sep(nodes[pos]["id"])) + len(sep(node_json(nodes[pos]))) + 2 for pos in nodes}

    def subtree(b):
        es, ns = set(), set()
        stack = [b]
        seen = {b}
        while stack:
            x = stack.pop()
            for i in out_deep.get(x, ()):
                es.add(i)
                t = deep_edges[i]["t"]
                ns.add(t)
                if t not in seen:
                    seen.add(t)
                    stack.append(t)
        return es, ns

    subs = {b: subtree(b) for b in boundary}
    groups = []  # list of (boundary list, edge set, node set, size)
    cur_b, cur_e, cur_n, cur_sz = [], set(), set(), 0
    for b in boundary:
        es, ns = subs[b]
        add = sum(esize[i] for i in es - cur_e) + sum(nsize[x] for x in ns - cur_n)
        if cur_b and cur_sz + add > a.chunk_cap:
            groups.append((cur_b, cur_e, cur_n, cur_sz))
            cur_b, cur_e, cur_n, cur_sz = [], set(), set(), 0
            add = sum(esize[i] for i in es) + sum(nsize[x] for x in ns)
        cur_b.append(b); cur_e |= es; cur_n |= ns; cur_sz += add
    if cur_b:
        groups.append((cur_b, cur_e, cur_n, cur_sz))

    os.makedirs(os.path.join(a.out, "chunks"), exist_ok=True)
    for f in glob.glob(os.path.join(a.out, "chunks", "*.json")):
        os.remove(f)
    chunk_index = {}
    chunk_sizes = []
    file_of = {}
    for gi, (bl, es, ns, sz) in enumerate(groups):
        fn = "k%04d.json" % (gi + 1)
        order = sorted(es, key=lambda i: (deep_edges[i]["fply"], deep_edges[i]["fid"], -deep_edges[i]["N"]))
        obj = {"nodes": {nodes[x]["id"]: node_json(nodes[x]) for x in sorted(ns, key=lambda x: (nodes[x]["p"], nodes[x]["id"]))},
               "edges": [edge_json(deep_edges[i]) for i in order]}
        s = sep(obj)
        open(os.path.join(a.out, "chunks", fn), "w", encoding="utf-8").write(s)
        chunk_sizes.append(len(s.encode("utf-8")))
        for b in bl:
            chunk_index[nodes[b]["id"]] = fn
            file_of[b] = fn
    core_obj = {"nodes": {nd["id"]: node_json(nd, file_of.get(nd["pos"])) for nd in sorted(core_nodes, key=lambda x: (x["p"], x["id"]))},
                "edges": [edge_json(e) for e in sorted(core_edges, key=lambda e: (e["fply"], e["fid"], -e["N"]))]}
    s = sep(core_obj)
    open(os.path.join(a.out, "core.json"), "w", encoding="utf-8").write(s)
    core_size = len(s.encode("utf-8"))
    json.dump(chunk_index, open(os.path.join(a.out, "chunks.json"), "w"), separators=(",", ":"))
    total = core_size + sum(chunk_sizes) + os.path.getsize(os.path.join(a.out, "chunks.json"))
    print("core.json %.2f MB (%d nodes, %d edges) | %d chunk files, total %.2f MB, max %.2f MB | all %.2f MB  %.0fs" % (
        core_size / 1e6, len(core_obj["nodes"]), len(core_obj["edges"]), len(groups), sum(chunk_sizes) / 1e6,
        max(chunk_sizes) / 1e6 if chunk_sizes else 0, total / 1e6, time.time() - t0), flush=True)
    # debugging aid for the manifest / docs
    json.dump({"core_min": a.core_min, "chunk_min": a.chunk_min, "early_floor": a.early_floor, "early_ply": a.early_ply,
               "chunk_cap": a.chunk_cap, "core_bytes": core_size, "chunk_bytes": chunk_sizes, "n_boundary": len(boundary),
               "collisions": collisions, "named_nodes": named, "nodes": len(nodes), "edges": len(edges)},
              open(os.path.join(a.work, "select_summary.json"), "w"))


if __name__ == "__main__":
    main()
