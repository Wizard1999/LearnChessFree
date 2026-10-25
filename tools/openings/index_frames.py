"""Walk the chain of pzstd frames of the Lichess dump without downloading the frames.

The file is  [12-byte skippable header][zstd frame] [12-byte skippable header][zstd frame] ...
Each skippable header is  50 2A 4D 18 | 04 00 00 00 | <u32 LE size of the following zstd frame>
so frame i+1 starts at  b_i + 12 + S_i.  We hop through the whole file with 12-byte Range requests
(local reads while inside the already-downloaded head file) and write an index of (offset, size).

    python -I index_frames.py --head <head.zst> --out frames_index.json
"""
import argparse, json, os, struct, sys, time
import requests

URL = "https://database.lichess.org/standard/lichess_db_standard_rated_2026-09.pgn.zst"
TOTAL = 29_224_520_887
PACE = 1.3


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--head", default=None)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    frames = []
    b = 0
    if os.path.exists(a.out):
        d = json.load(open(a.out))
        frames = d["frames"]
        if frames:
            b = frames[-1][0] + 12 + frames[-1][1]
    head_size = os.path.getsize(a.head) if a.head else 0
    hf = open(a.head, "rb") if a.head else None
    sess = requests.Session()
    t0 = time.time()
    net_bytes = 0
    n_net = 0
    while b < TOTAL:
        if hf and b + 12 <= head_size:
            hf.seek(b)
            h = hf.read(12)
        else:
            for attempt in range(30):
                try:
                    r = sess.get(URL, headers={"Range": "bytes=%d-%d" % (b, b + 11)}, timeout=(15, 30))
                    if r.status_code == 429:
                        wait = float(r.headers.get("Retry-After", 0) or 0)
                        time.sleep(max(wait, 10 + 5 * attempt))
                        raise RuntimeError("HTTP 429 (rate limited; backing off)")
                    if r.status_code != 206:
                        raise RuntimeError("HTTP %d" % r.status_code)
                    h = r.content
                    net_bytes += len(h) + 600  # rough header overhead
                    n_net += 1
                    time.sleep(PACE)  # be polite: the server rate-limits bursts of tiny requests
                    break
                except Exception as e:
                    print("retry", b, repr(e), flush=True)
                    time.sleep(min(30, 2 + attempt))
            else:
                sys.exit("giving up at %d" % b)
        if len(h) != 12:
            sys.exit("short header at %d: %r" % (b, h))
        magic, sz, S = struct.unpack("<III", h)
        if magic != 0x184D2A50 or sz != 4:
            sys.exit("bad skippable header at %d: %s" % (b, h.hex()))
        frames.append([b, S])
        b = b + 12 + S
        if len(frames) % 50 == 0:
            json.dump({"total": TOTAL, "frames": frames}, open(a.out, "w"))
            print("frames %d  offset %.3f GB  %.1fs  net hops %d" % (len(frames), b / 1e9, time.time() - t0, n_net), flush=True)
    json.dump({"total": TOTAL, "frames": frames, "end": b}, open(a.out, "w"))
    print("DONE frames", len(frames), "end", b, "total", TOTAL, "net hops", n_net, "approx net bytes", net_bytes, flush=True)


if __name__ == "__main__":
    main()
