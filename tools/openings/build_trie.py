"""Stage 2: sequence-prefix counts (a trie) with DuckDB.

Input : <work>/games/*.parquet   (band, res, n, moves)       from scan.py
Output: <work>/trie/E_01.parquet .. E_16.parquet with columns (ply, anc, parent, child, san, n0..n7, w0..w7, d0..d7)
        one row per distinct move-prefix of length `ply` (1..16) that occurs >= c0 times;
        parent/child are 64-bit hashes of the prefix; anc = hash of the 3-ply ancestor (0 for ply<=3).
        n_b = games of rating band b through this prefix, w_b = of which white won, d_b = drawn.
        <work>/games.duckdb is also kept (table g with the move columns and prefix hashes).

Prefix hash:  h_k = hash(CAST(h_{k-1} AS VARCHAR) || m_k),  h_0 = 0   (DuckDB hash(), 64 bit).
Collision check: for every ply the number of distinct (parent, child) must equal the number of distinct child.

    python -I build_trie.py --work <dir> [--c0 2] [--threads 4] [--mem 12GB]
"""
import argparse, os, sys, time
import duckdb

MAXPLY = 16
NB = 8


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--work", required=True)
    ap.add_argument("--c0", type=int, default=2, help="keep a prefix only if it occurs at least this often")
    ap.add_argument("--threads", type=int, default=4)
    ap.add_argument("--mem", default="12GB")
    a = ap.parse_args()
    w = a.work
    t0 = time.time()
    for f in ("games.duckdb",):
        p = os.path.join(w, f)
        if os.path.exists(p):
            os.remove(p)
    con = duckdb.connect(os.path.join(w, "games.duckdb"))
    con.execute("SET threads=%d; SET memory_limit='%s'; SET temp_directory='%s'" % (a.threads, a.mem, os.path.join(w, "duck_tmp").replace("\\", "/")))
    parts = os.path.join(w, "games", "*.parquet").replace("\\", "/")
    con.execute("CREATE TABLE raw AS SELECT band, res, moves FROM read_parquet('%s')" % parts)
    ngames = con.execute("SELECT count(*) FROM raw").fetchone()[0]
    print("games", ngames, "%.0fs" % (time.time() - t0), flush=True)
    mcols = ", ".join("l[%d] AS m%d" % (k, k) for k in range(1, MAXPLY + 1))
    con.execute("CREATE TABLE g0 AS SELECT band, res, %s FROM (SELECT band, res, string_split(moves, ' ') AS l FROM raw)" % mcols)
    con.execute("DROP TABLE raw")
    q = "SELECT band, res, " + ", ".join("m%d" % k for k in range(1, MAXPLY + 1)) + ", hash(m1) AS h1 FROM g0"
    for k in range(2, MAXPLY + 1):
        q = "SELECT *, hash(CAST(h%d AS VARCHAR) || m%d) AS h%d FROM (%s)" % (k - 1, k, k, q)
    con.execute("CREATE TABLE g AS " + q)
    con.execute("DROP TABLE g0")
    print("hashes done %.0fs" % (time.time() - t0), flush=True)

    out_parquet = os.path.join(w, "trie")
    os.makedirs(out_parquet, exist_ok=True)
    sums = []
    for b in range(NB):
        sums.append("count(*) FILTER (WHERE band=%d) AS n%d" % (b, b))
    for b in range(NB):
        sums.append("count(*) FILTER (WHERE band=%d AND res=2) AS w%d" % (b, b))
    for b in range(NB):
        sums.append("count(*) FILTER (WHERE band=%d AND res=1) AS d%d" % (b, b))
    sums = ", ".join(sums)
    summary = []
    for k in range(1, MAXPLY + 1):
        parent = "0::UBIGINT" if k == 1 else "h%d" % (k - 1)
        anc = "any_value(h3)" if k >= 4 else "0::UBIGINT"
        q = """COPY (SELECT %d AS ply, %s AS anc, %s AS parent, h%d AS child, any_value(m%d) AS san, %s
               FROM g WHERE m%d IS NOT NULL GROUP BY %s, h%d HAVING count(*) >= %d)
               TO '%s' (FORMAT PARQUET, COMPRESSION ZSTD)""" % (
            k, anc, parent, k, k, sums, k, parent, k, a.c0, os.path.join(out_parquet, "E_%02d.parquet" % k).replace("\\", "/"))
        con.execute(q)
        # collision check + stats from the parquet we just wrote
        r = con.execute("""SELECT count(*), count(DISTINCT child), count(DISTINCT (parent, child)), sum(%s)
                           FROM read_parquet('%s')""" % ("+".join("n%d" % b for b in range(NB)),
                                                         os.path.join(out_parquet, "E_%02d.parquet" % k).replace("\\", "/"))).fetchone()
        tot_k = con.execute("SELECT count(*) FROM g WHERE m%d IS NOT NULL" % k).fetchone()[0]
        summary.append((k, r[0], r[1], r[2], r[3], tot_k))
        print("ply %2d: games reaching %9d | distinct prefixes kept %8d (child %d, pairs %d) | games covered by kept prefixes %9d (%.2f%%) %.0fs" % (
            k, tot_k, r[0], r[1], r[2], r[3], 100.0 * (r[3] or 0) / max(tot_k, 1), time.time() - t0), flush=True)
        if r[1] != r[2]:
            print("WARNING: hash collision(s) at ply %d: %d vs %d" % (k, r[1], r[2]), flush=True)
    # band totals for the root
    tot = con.execute("SELECT band, res, count(*) FROM g GROUP BY band, res ORDER BY band, res").fetchall()
    import json
    json.dump({"games": ngames, "c0": a.c0, "by_ply": summary, "band_res": tot}, open(os.path.join(w, "trie_summary.json"), "w"))
    print("done %.0fs" % (time.time() - t0), flush=True)


if __name__ == "__main__":
    main()
