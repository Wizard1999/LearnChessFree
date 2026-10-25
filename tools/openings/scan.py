"""Stage 1: stratified sample of single zstd frames from the Lichess monthly dump
-> parquet parts of (band, result, nplies, first-16-ply SAN).

Facts about the file (verified, see docs/openings-data.md):
  * it is NOT one zstd frame: it is a chain of  [12-byte skippable header][zstd frame]  pairs (pzstd layout);
    the header is  50 2A 4D 18 | 04 00 00 00 | u32 LE = compressed size S of the frame that follows;
  * every frame decodes independently to exactly 32 MiB of PGN (~14k games, ~4.7 MB compressed),
    cutting games in the middle.
So frames can be fetched with HTTP Range requests anywhere in the file.  We cut the file into F equal byte
strata and decode ONE random frame (an ~11 minute window of play) per stratum: a stratified random sample
spread over every day and hour of the month, instead of "the first N games".

Locating frame boundaries without reading the whole file:
  * frames whose start is in the (partial) frame index (made by index_frames.py) are fetched with exact ranges;
  * beyond that, the boundary is *predicted* from the last exact boundary and the running mean frame size,
    a window of ~2.5 MB around the prediction is streamed until the 8-byte skippable signature shows up, and
    the header gives the exact size.  Typical waste is ~5 % of the bytes.

    python -I scan.py run --work <dir> --index frames_index.json --head <head zst> --f 540 --seed 20260924
"""
import argparse, bisect, concurrent.futures as cf, json, os, random, struct, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pgnscan

URL = "https://database.lichess.org/standard/lichess_db_standard_rated_2026-09.pgn.zst"
TOTAL_BYTES = 29_224_520_887
SIG = b"\x50\x2a\x4d\x18\x04\x00\x00\x00"
FRAME_UNCOMP = 33554432
PACE = 0.4  # seconds between HTTP requests (the server rate-limits request bursts)


def log(*a):
    print(*a, flush=True)


# ----------------------------------------------------------------------------------------------- HTTP
class Http:
    def __init__(self):
        import requests
        self.s = requests.Session()
        self.net = 0
        self.last = 0.0

    def stream(self, lo, hi):
        """yield chunks of bytes lo..hi (inclusive) lazily; caller may stop early (counts bytes read)."""
        wait = PACE - (time.time() - self.last)
        if wait > 0:
            time.sleep(wait)
        for attempt in range(12):
            r = self.s.get(URL, headers={"Range": "bytes=%d-%d" % (lo, hi)}, stream=True, timeout=(20, 60))
            self.last = time.time()
            if r.status_code == 429:
                r.close()
                time.sleep(max(float(r.headers.get("Retry-After", 0) or 0), 10 + 5 * attempt))
                continue
            if r.status_code != 206:
                r.close()
                raise RuntimeError("HTTP %d" % r.status_code)
            break
        else:
            raise RuntimeError("rate limited too long")
        try:
            for b in r.iter_content(262144):
                if b:
                    self.net += len(b)
                    yield b
        finally:
            r.close()

    def read_exact(self, lo, n):
        out = bytearray()
        for b in self.stream(lo, lo + n - 1):
            out += b
            if len(out) >= n:
                break
        if len(out) < n:
            raise RuntimeError("short read")
        return bytes(out[:n])


def decode_frame(data):
    import zstandard
    d = zstandard.ZstdDecompressor().decompressobj()
    out = d.decompress(data)
    if not d.eof:
        raise RuntimeError("frame did not decode cleanly (eof=%s, %d bytes)" % (d.eof, len(out)))
    return out


# --------------------------------------------------------------------------------------- frame locator
class Locator:
    def __init__(self, index_path, head_path):
        d = json.load(open(index_path))
        self.frames = d["frames"]  # [[offset_of_skippable_header, S], ...]
        self.starts = [f[0] for f in self.frames]
        last = self.frames[-1]
        self.anchor_b = last[0] + 12 + last[1]  # exact boundary of the first non-indexed frame
        self.head_path = head_path
        self.head_size = os.path.getsize(head_path) if head_path and os.path.exists(head_path) else 0
        sizes = [f[1] + 12 for f in self.frames[-200:]]
        self.mu = sum(sizes) / len(sizes)
        self.http = None
        self.last_b = None  # last exact boundary (state for prediction)

    def get_frame(self, T):
        """frame 'containing' byte T.  returns (b, S, frame_bytes, mode, info)"""
        if T < self.anchor_b:  # exact index
            i = bisect.bisect_right(self.starts, T) - 1
            b, S = self.frames[i]
            mode = "index"
            fb = self._read(b + 12, S)
            self.last_b = b
            return b, S, fb, mode, {"frame_index": i}
        return self._predicted(T)

    def _read(self, lo, n):
        if lo + n <= self.head_size:
            with open(self.head_path, "rb") as f:
                f.seek(lo)
                return f.read(n)
        if self.http is None:
            self.http = Http()
        return self.http.read_exact(lo, n)

    def _predicted(self, T):
        if self.http is None:
            self.http = Http()
        # state: last exact boundary at or before T
        base = self.last_b if (self.last_b is not None and self.last_b >= self.anchor_b) else self.anchor_b
        # but never start from a base that is already beyond T
        if base > T:
            base = self.anchor_b
        d = int((T - base) // self.mu)
        pred = int(base + d * self.mu)
        for width_before in (450_000, 3_000_000):
            lo = max(self.anchor_b, pred - width_before)
            hi = min(TOTAL_BYTES - 1, pred + 2_600_000 + 5_000_000)
            buf = bytearray()
            found = None
            net0 = self.http.net
            for chunk in self.http.stream(lo, hi):
                buf += chunk
                if found is None:
                    p = buf.find(SIG)
                    if p >= 0 and len(buf) >= p + 12:
                        found = p
                        S = struct.unpack("<I", bytes(buf[p + 8:p + 12]))[0]
                if found is not None and len(buf) >= found + 12 + S:
                    break
                if found is None and len(buf) > 2 * (pred - lo) + 2_700_000:
                    break  # looked far past the prediction: no boundary where expected
            if found is None or len(buf) < found + 12 + S:
                continue
            b = lo + found
            if b - pred > 2_400_000 and width_before == 450_000:
                continue  # we probably skipped the true boundary (it lies before the window): widen
            fb = bytes(buf[found + 12:found + 12 + S])
            err = b - pred
            if d > 0 and abs(err) < 400_000:
                self.mu = 0.5 * self.mu + 0.5 * ((b - base) / d)
            self.last_b = b
            return b, S, fb, "predicted", {"pred_err": err, "d": d, "net": self.http.net - net0}
        raise RuntimeError("could not locate a frame boundary near %d" % T)


# ------------------------------------------------------------------------------------------- workers
def parse_task(args):
    text, part_path = args
    import pyarrow as pa, pyarrow.parquet as pq
    rows, c, hours, first_ts, last_ts = pgnscan.parse_block(text)
    tbl = pa.table({
        "band": pa.array([r[0] for r in rows], pa.uint8()),
        "res": pa.array([r[1] for r in rows], pa.uint8()),
        "n": pa.array([r[2] for r in rows], pa.uint8()),
        "moves": pa.array([r[3] for r in rows], pa.string()),
    })
    pq.write_table(tbl, part_path, compression="zstd")
    return c, hours, first_ts, last_ts


def merge_counts(a, b):
    for k, v in b.items():
        a[k] = a.get(k, 0) + v


def run(work, index_path, head, nstrata, seed, procs, span=None, limit=None):
    for d in ("clusters", "games"):
        os.makedirs(os.path.join(work, d), exist_ok=True)
    rnd = random.Random(seed)
    width = (span or TOTAL_BYTES) / nstrata
    targets = [int(rnd.uniform(j * width, (j + 1) * width)) for j in range(nstrata)]
    json.dump({"seed": seed, "strata": nstrata, "total_bytes": TOTAL_BYTES, "targets": targets},
              open(os.path.join(work, "plan.json"), "w"))
    loc = Locator(index_path, head)
    t0 = time.time()
    used = 0
    net_prev = 0
    pending = []  # (j, b, S, mode, info, futs)
    seen = set()

    def collect(item):
        nonlocal used
        j, b, S, mode, info, futs = item
        stats, hours = {}, {}
        first_ts = last_ts = None
        for f in futs:
            c, h, fts, lts = f.result()
            merge_counts(stats, c)
            merge_counts(hours, h)
            if fts and (first_ts is None or fts < first_ts): first_ts = fts
            if lts and (last_ts is None or lts > last_ts): last_ts = lts
        out = {"idx": j, "target": targets[j], "offset": b, "size": S, "mode": mode, "info": info,
               "stats": stats, "hours": hours, "first_ts": first_ts, "last_ts": last_ts}
        json.dump(out, open(os.path.join(work, "clusters", "c%04d.json" % j), "w"))
        used += stats.get("used", 0)
        log("[%d/%d] stratum %d  %s .. %s  games %d used %d | total used %d, net %.3f GB, %.0fs  (%s %s)" % (
            j + 1, nstrata, j, first_ts, last_ts, stats.get("games", 0), stats.get("used", 0), used,
            (loc.http.net if loc.http else 0) / 1e9, time.time() - t0, mode, info))

    with cf.ProcessPoolExecutor(procs) as pool:
        for j in range(limit or nstrata):
            marker = os.path.join(work, "clusters", "c%04d.json" % j)
            if os.path.exists(marker):
                m = json.load(open(marker))
                loc.last_b = m["offset"]
                seen.add(m["offset"])
                used += m["stats"].get("used", 0)
                continue
            for f_ in os.listdir(os.path.join(work, "games")):  # stale parts of an interrupted run
                if f_.startswith("c%04d_" % j):
                    os.remove(os.path.join(work, "games", f_))
            for attempt in range(8):
                try:
                    b, S, fb, mode, info = loc.get_frame(targets[j])
                    if b in seen:  # two strata landed in the same frame: redraw inside this stratum
                        log("stratum %d: frame at %d already sampled, redrawing" % (j, b))
                        targets[j] = int(rnd.uniform(j * width, (j + 1) * width))
                        continue
                    raw = decode_frame(fb)
                    seen.add(b)
                    break
                except Exception as e:
                    log("stratum %d attempt %d failed: %r" % (j, attempt, e))
                    time.sleep(5 + 5 * attempt)
            else:
                raise RuntimeError("stratum %d failed" % j)
            del fb
            a = raw.find(b'\n[Event "')
            e = raw.rfind(b'\n[Event "')
            text = raw[a + 1:e + 1].decode("utf-8", "replace")
            del raw
            futs = []
            for i, blk in enumerate(pgnscan.split_blocks(text, 6_000_000)):
                futs.append(pool.submit(parse_task, (blk, os.path.join(work, "games", "c%04d_%03d.parquet" % (j, i)))))
            del text
            pending.append((j, b, S, mode, info, futs))
            while len(pending) > 3:
                collect(pending.pop(0))
        for item in pending:
            collect(item)
    log("DONE used", used, "net bytes", loc.http.net if loc.http else 0, "elapsed", round(time.time() - t0))


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["run"])
    ap.add_argument("--work", required=True)
    ap.add_argument("--index", required=True)
    ap.add_argument("--head", default=None)
    ap.add_argument("--f", type=int, default=540, help="number of strata (= frames sampled)")
    ap.add_argument("--seed", type=int, default=20260924)
    ap.add_argument("--procs", type=int, default=8)
    ap.add_argument("--span", type=float, default=None, help="dev: sample only the first SPAN bytes of the file")
    ap.add_argument("--limit", type=int, default=None, help="dev: stop after this many strata")
    a = ap.parse_args()
    run(a.work, a.index, a.head, a.f, a.seed, a.procs, a.span, a.limit)
