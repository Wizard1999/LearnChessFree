"""Stage 4: position-keyed graph (transpositions merged), pruning, names, chunking, JSON output.

    python -I build_graph.py prep   --work <dir>
    python -I build_graph.py select --work <dir> --out <outdir> --core-min 120 --chunk-min 60 [--early-floor 8] ...

prep   : joins the trie (E) with the replay (R) into duckdb tables  TE (trie edge + positions),
         NODE (one row per position: min ply, n per band), PE (one row per (parent position, move)),
         FE (forward edges: ply(to) == ply(from)+1).  Back edges (repeat of an earlier position, e.g.
         Nf3 Nf6 Ng1 Ng8) are dropped from the edge list but their visits stay in the node counts.
select : level-by-level reachability from the root with the count thresholds, node paths, EPDs, names,
         ids, chunking, JSON.
"""
import argparse, bisect, collections, hashlib, json, os, sys, time
import duckdb

NB = 8
BANDS = [("u900", "Below 900", 0, 899), ("b900", "900-1100", 900, 1099), ("b1100", "1100-1300", 1100, 1299),
         ("b1300", "1300-1500", 1300, 1499), ("b1500", "1500-1700", 1500, 1699), ("b1700", "1700-1900", 1700, 1899),
         ("b1900", "1900-2100", 1900, 2099), ("b2100", "2100+ (online)", 2100, 9999)]
CORE_PLY = 8
MAXPLY = 16


def P(path):
    return path.replace("\\", "/")


def connect(work, readonly=False):
    con = duckdb.connect(os.path.join(work, "graph.duckdb"), read_only=readonly)
    con.execute("SET threads=4; SET memory_limit='14GB'; SET temp_directory='%s'" % P(os.path.join(work, "duck_tmp")))
    return con


# ------------------------------------------------------------------------------------------------ prep
def prep(work):
    t0 = time.time()
    dbp = os.path.join(work, "graph.duckdb")
    if os.path.exists(dbp):
        os.remove(dbp)
    con = connect(work)
    root_key = json.load(open(os.path.join(work, "replay", "root.json")))["root_key"]
    cols = ", ".join(["n%d" % b for b in range(NB)] + ["w%d" % b for b in range(NB)] + ["d%d" % b for b in range(NB)])
    ecols = ", ".join("E." + c for c in ["n%d" % b for b in range(NB)] + ["w%d" % b for b in range(NB)] + ["d%d" % b for b in range(NB)])
    con.execute("""CREATE TABLE TE AS
        SELECT E.ply, E.child, E.parent, E.san, R.uci, R.ppos, R.pos, %s
        FROM read_parquet('%s') E JOIN read_parquet('%s') R USING (child)""" % (
        ecols, P(os.path.join(work, "trie", "E_*.parquet")), P(os.path.join(work, "replay", "R_*.parquet"))))
    n_te = con.execute("SELECT count(*) FROM TE").fetchone()[0]
    n_e = con.execute("SELECT count(*) FROM read_parquet('%s')" % P(os.path.join(work, "trie", "E_*.parquet"))).fetchone()[0]
    print("TE rows %d (trie rows %d, missing from replay %d)  %.0fs" % (n_te, n_e, n_e - n_te, time.time() - t0), flush=True)
    sums = ", ".join("sum(n%d)::BIGINT AS n%d" % (b, b) for b in range(NB))
    con.execute("CREATE TABLE NODE AS SELECT pos, min(ply)::INT AS ply, %s FROM TE GROUP BY pos" % sums)
    # root: n = games of the band (+ any revisits of the start position)
    summ = json.load(open(os.path.join(work, "trie_summary.json")))
    tot = [0] * NB
    for band, res, c in summ["band_res"]:
        tot[band] += c
    row = con.execute("SELECT * FROM NODE WHERE pos = %d" % root_key).fetchone()
    if row:
        con.execute("DELETE FROM NODE WHERE pos = %d" % root_key)
        tot = [tot[b] + row[2 + b] for b in range(NB)]
    con.execute("INSERT INTO NODE VALUES (%d, 0, %s)" % (root_key, ", ".join(str(x) for x in tot)))
    esums = ", ".join(["sum(n%d)::BIGINT AS n%d" % (b, b) for b in range(NB)] +
                      ["sum(w%d)::BIGINT AS w%d" % (b, b) for b in range(NB)] +
                      ["sum(d%d)::BIGINT AS d%d" % (b, b) for b in range(NB)])
    con.execute("""CREATE TABLE PE AS SELECT ppos AS f, pos AS t, any_value(san) AS san, uci, %s,
                   (%s) AS N FROM TE GROUP BY ppos, pos, uci""" % (esums, "+".join("sum(n%d)" % b for b in range(NB))))
    con.execute("""CREATE TABLE FE AS SELECT PE.*, nf.ply AS fply FROM PE
                   JOIN NODE nf ON PE.f = nf.pos JOIN NODE nt ON PE.t = nt.pos WHERE nt.ply = nf.ply + 1""")
    n_pe = con.execute("SELECT count(*), sum(N) FROM PE").fetchone()
    n_fe = con.execute("SELECT count(*), sum(N) FROM FE").fetchone()
    n_nodes = con.execute("SELECT count(*) FROM NODE").fetchone()[0]
    print("positions %d | position edges %d (visits %d) | forward edges %d (visits %d) -> back edges dropped: %d edges, %d visits (%.4f%%)  %.0fs" % (
        n_nodes, n_pe[0], n_pe[1], n_fe[0], n_fe[1], n_pe[0] - n_fe[0], n_pe[1] - n_fe[1],
        100.0 * (n_pe[1] - n_fe[1]) / max(n_pe[1], 1), time.time() - t0), flush=True)
    json.dump({"root_key": root_key, "te": n_te, "nodes": n_nodes, "pe": n_pe[0], "fe": n_fe[0],
               "pe_visits": int(n_pe[1]), "fe_visits": int(n_fe[1])}, open(os.path.join(work, "graph_prep.json"), "w"))
    con.close()


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["prep"])
    ap.add_argument("--work", required=True)
    a = ap.parse_args()
    if a.cmd == "prep":
        prep(a.work)
