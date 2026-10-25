"""Download the first N bytes of the Lichess monthly dump (zstd stream) to a local file.

The Lichess .pgn.zst is one zstd stream, so only a *prefix* of the file is usable;
a truncated prefix decodes fine up to the cut.  We fetch it with HTTP Range requests,
resume automatically after connection drops, and stop at --bytes (default 4.0e9).

    python -I download_head.py --out <file> --bytes 4000000000
"""
import argparse, os, sys, time
import requests

URL = "https://database.lichess.org/standard/lichess_db_standard_rated_2026-09.pgn.zst"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--bytes", type=int, default=4_000_000_000)
    ap.add_argument("--url", default=URL)
    a = ap.parse_args()
    have = os.path.getsize(a.out) if os.path.exists(a.out) else 0
    t0 = time.time(); start_have = have; last = t0
    fails = 0
    with open(a.out, "ab") as f:
        while have < a.bytes:
            try:
                r = requests.get(a.url, headers={"Range": f"bytes={have}-{a.bytes-1}"}, stream=True, timeout=(20, 60))
                if r.status_code not in (200, 206):
                    raise RuntimeError(f"HTTP {r.status_code}")
                if r.status_code == 200 and have > 0:
                    raise RuntimeError("server ignored Range")
                for blk in r.iter_content(1 << 20):
                    if not blk: break
                    f.write(blk); have += len(blk)
                    now = time.time()
                    if now - last > 15:
                        last = now
                        rate = (have - start_have) / (now - t0) / 1e6
                        print(f"{have/1e9:.3f} GB  {rate:.1f} MB/s", flush=True)
                fails = 0
            except Exception as e:
                fails += 1
                print(f"drop/err after {have} bytes: {e!r}; retry {fails}", flush=True)
                f.flush()
                if fails > 40: sys.exit(2)
                time.sleep(min(60, 3 * fails))
    f.close()
    print("done", have, flush=True)

if __name__ == "__main__":
    main()
