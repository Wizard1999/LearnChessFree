"""End-to-end self-test of build_trie -> replay -> build_graph prep against a brute-force python-chess recount.

Takes a handful of parquet parts (games), runs the real pipeline with c0=1 (no pruning), then replays EVERY game
with python-chess, ply by ply, and compares for every position:  visits per band  (NODE.n*)  and for every
(parent position, move):  n/w/d per band  (PE).  Prints PASS/FAIL.

    python -I selftest_pipeline.py --parts <dir with parquet parts> --work <scratch dir> [--max-parts 3]
"""
import argparse, glob, os, shutil, subprocess, sys, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import chess, duckdb, pyarrow.parquet as pq
from replay import pkey

HERE = os.path.dirname(os.path.abspath(__file__))
PY = sys.executable


def run(*args):
    r = subprocess.run([PY, "-I"] + list(args), capture_output=True, text=True)
    if r.returncode:
        print(r.stdout[-2000:], r.stderr[-2000:])
        raise SystemExit("step failed: %s" % " ".join(args))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--parts", required=True)
    ap.add_argument("--work", required=True)
    ap.add_argument("--max-parts", type=int, default=3)
    a = ap.parse_args()
    if os.path.exists(a.work):
        shutil.rmtree(a.work)
    os.makedirs(os.path.join(a.work, "games"))
    parts = sorted(glob.glob(os.path.join(a.parts, "*.parquet")))[:a.max_parts]
    for p in parts:
        shutil.copy(p, os.path.join(a.work, "games"))
    run(os.path.join(HERE, "build_trie.py"), "--work", a.work, "--c0", "1", "--threads", "2")
    run(os.path.join(HERE, "replay.py"), "--work", a.work, "--procs", "2")
    run(os.path.join(HERE, "build_graph.py"), "prep", "--work", a.work)

    # brute force
    node = collections.defaultdict(lambda: [0] * 8)
    edge = collections.defaultdict(lambda: [[0] * 8, [0] * 8, [0] * 8])  # (ppos,pos,uci) -> n,w,d
    root = chess.Board()
    root_key = pkey(root.epd())
    ngames = 0
    for p in parts:
        t = pq.read_table(p).to_pydict()
        for band, res, moves in zip(t["band"], t["res"], t["moves"]):
            ngames += 1
            b = chess.Board()
            ppos = root_key
            node[root_key][band] += 1
            for san in moves.split(" "):
                mv = b.push_san(san)
                pos = pkey(b.epd())
                node[pos][band] += 1
                e = edge[(ppos, pos, mv.uci())]
                e[0][band] += 1
                if res == 2:
                    e[1][band] += 1
                elif res == 1:
                    e[2][band] += 1
                ppos = pos
    print("brute force: %d games, %d positions, %d edges" % (ngames, len(node), len(edge)))
    con = duckdb.connect(os.path.join(a.work, "graph.duckdb"), read_only=True)
    bad = 0
    got = {r[0]: list(r[1:]) for r in con.execute("SELECT pos, n0,n1,n2,n3,n4,n5,n6,n7 FROM NODE").fetchall()}
    if set(got) != set(node):
        print("FAIL: position sets differ: %d vs %d" % (len(got), len(node)))
        bad += 1
    for k, v in node.items():
        if got.get(k) != v:
            bad += 1
            if bad < 5:
                print("FAIL node", k, got.get(k), v)
    ge = {}
    for r in con.execute("SELECT f, t, uci, " + ",".join("n%d" % i for i in range(8)) + "," + ",".join("w%d" % i for i in range(8)) + "," + ",".join("d%d" % i for i in range(8)) + " FROM PE").fetchall():
        ge[(r[0], r[1], r[2])] = [list(r[3:11]), list(r[11:19]), list(r[19:27])]
    if set(ge) != set(edge):
        print("FAIL: edge sets differ: %d vs %d" % (len(ge), len(edge)))
        bad += 1
    for k, v in edge.items():
        if ge.get(k) != v:
            bad += 1
            if bad < 5:
                print("FAIL edge", k, ge.get(k), v)
    print("PASS" if not bad else "FAIL (%d problems)" % bad)
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
