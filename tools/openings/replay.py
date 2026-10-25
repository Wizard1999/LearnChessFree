"""Stage 3: replay every retained distinct prefix ONCE (DFS with push/pop) to get its position.

Input : <work>/trie/E_*.parquet   (from build_trie.py)
Output: <work>/replay/R_*.parquet  columns (child, pos, ppos, uci)
          child = trie node (prefix hash), pos = 64-bit key of the position AFTER the last move of the prefix,
          ppos = key of the position BEFORE it (the parent position), uci = the last move in UCI.
        <work>/replay/root.json    {"root_key": ..}
Position key = first 8 bytes of blake2b(EPD)  (EPD = python-chess board.epd(), i.e. piece placement, side to
move, castling rights, en-passant square only when a legal capture exists; no move counters).

The ply<=3 part of the trie is replayed in the parent process; every ply-3 node is the root of one
independent subtree, subtrees are spread over NBUCKET buckets handled by a process pool.

    python -I replay.py --work <dir> [--procs 6]
"""
import argparse, concurrent.futures as cf, hashlib, json, os, sys, time
from collections import defaultdict

NBUCKET = 48


def pkey(epd):
    return int.from_bytes(hashlib.blake2b(epd.encode(), digest_size=8).digest(), "big")


def dfs(board, adj, node, ppos_key, out_child, out_pos, out_ppos, out_uci, errs):
    """visit children of trie node `node`; board is at the position of `node`; ppos_key = key of that position"""
    kids = adj.get(node)
    if not kids:
        return
    for child, san in kids:
        try:
            mv = board.push_san(san)
        except Exception:
            errs.append((child, san))
            continue
        pos = pkey(board.epd())
        out_child.append(child)
        out_pos.append(pos)
        out_ppos.append(ppos_key)
        out_uci.append(mv.uci())
        dfs(board, adj, child, pos, out_child, out_pos, out_ppos, out_uci, errs)
        board.pop()


def work_bucket(args):
    work, b, top_paths = args
    import chess
    import pyarrow as pa, pyarrow.parquet as pq
    import duckdb
    con = duckdb.connect()
    rows = con.execute("SELECT anc, parent, child, san FROM read_parquet('%s') WHERE ply>=4 AND anc %% %d = %d" % (
        os.path.join(work, "trie", "E_*.parquet").replace("\\", "/"), NBUCKET, b)).fetchall()
    con.close()
    adj = defaultdict(list)
    ancs = set()
    for anc, parent, child, san in rows:
        adj[parent].append((child, san))
        ancs.add(anc)
    oc, op, opp, ou, errs = [], [], [], [], []
    root = chess.Board()
    for anc in ancs:
        path = top_paths[anc]
        board = chess.Board()
        for san in path:
            board.push_san(san)
        pos = pkey(board.epd())
        dfs(board, adj, anc, pos, oc, op, opp, ou, errs)
    tbl = pa.table({"child": pa.array(oc, pa.uint64()), "pos": pa.array(op, pa.uint64()),
                    "ppos": pa.array(opp, pa.uint64()), "uci": pa.array(ou, pa.string())})
    pq.write_table(tbl, os.path.join(work, "replay", "R_%02d.parquet" % b), compression="zstd")
    return b, len(oc), len(errs)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--work", required=True)
    ap.add_argument("--procs", type=int, default=6)
    a = ap.parse_args()
    w = a.work
    t0 = time.time()
    import chess
    import duckdb
    import pyarrow as pa, pyarrow.parquet as pq
    os.makedirs(os.path.join(w, "replay"), exist_ok=True)
    for f in os.listdir(os.path.join(w, "replay")):
        os.remove(os.path.join(w, "replay", f))
    con = duckdb.connect()
    top = con.execute("SELECT ply, parent, child, san FROM read_parquet('%s') WHERE ply<=3 ORDER BY ply" % (
        os.path.join(w, "trie", "E_*.parquet").replace("\\", "/"))).fetchall()
    adj = defaultdict(list)
    for ply, parent, child, san in top:
        adj[parent].append((child, san))
    # ply<=3 replay in this process; remember path (SAN list) of every ply-3 node
    board = chess.Board()
    root_key = pkey(board.epd())
    oc, op, opp, ou, errs = [], [], [], [], []
    top_paths = {}

    def visit(node, ppos, path, depth):
        for child, san in adj.get(node, ()):
            try:
                mv = board.push_san(san)
            except Exception:
                errs.append((child, san))
                continue
            pos = pkey(board.epd())
            oc.append(child); op.append(pos); opp.append(ppos); ou.append(mv.uci())
            if depth == 2:
                top_paths[child] = path + [san]
            else:
                visit(child, pos, path + [san], depth + 1)
            board.pop()

    # ply-3 nodes: we need the board at depth 3 -> push, record, pop; their subtrees are done by workers.
    visit(0, root_key, [], 0)
    print("top part: %d nodes, %d ply-3 roots, %d errors, %.1fs" % (len(oc), len(top_paths), len(errs), time.time() - t0), flush=True)
    tbl = pa.table({"child": pa.array(oc, pa.uint64()), "pos": pa.array(op, pa.uint64()),
                    "ppos": pa.array(opp, pa.uint64()), "uci": pa.array(ou, pa.string())})
    pq.write_table(tbl, os.path.join(w, "replay", "R_top.parquet"), compression="zstd")
    json.dump({"root_key": root_key}, open(os.path.join(w, "replay", "root.json"), "w"))
    total = len(oc)
    nerr = len(errs)
    with cf.ProcessPoolExecutor(a.procs) as pool:
        futs = [pool.submit(work_bucket, (w, b, top_paths)) for b in range(NBUCKET)]
        for f in cf.as_completed(futs):
            b, n, e = f.result()
            total += n
            nerr += e
    print("replayed %d trie nodes (%d illegal-SAN subtrees skipped) in %.0fs" % (total, nerr, time.time() - t0), flush=True)


if __name__ == "__main__":
    main()
