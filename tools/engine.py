"""UCI driver for the Stockfish build that also ships in the app (npm stockfish@19.0.1, lite, single thread).
Engine output is evidence under recorded settings. It is never a lesson explanation."""
import os, re, subprocess, threading, queue
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SF_JS = Path(os.environ.get("STOCKFISH_JS", ROOT / "app" / "node_modules" / "stockfish" / "bin" / "stockfish-19-lite-single.js"))


class Engine:
    def __init__(self, hash_mb=16):
        self.p = subprocess.Popen(["node", str(SF_JS)], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                  stderr=subprocess.STDOUT, text=True, bufsize=1)
        self.q = queue.Queue()
        threading.Thread(target=self._reader, daemon=True).start()
        self._send("uci")
        out = self._wait("uciok")
        self.name = next((l[8:] for l in out if l.startswith("id name ")), "unknown engine")
        self._send(f"setoption name Hash value {hash_mb}")
        self.hash_mb = hash_mb

    def _reader(self):
        for line in self.p.stdout:
            self.q.put(line.rstrip())

    def _send(self, s):
        self.p.stdin.write(s + "\n"); self.p.stdin.flush()

    def _wait(self, token, timeout=900):
        out = []
        while True:
            line = self.q.get(timeout=timeout)
            out.append(line)
            if line.startswith(token):
                return out

    def search(self, fen, depth=16, multipv=1, searchmoves=None):
        """Returns {rank: dict(depth, kind, value, pv)} from the side to move's point of view."""
        self._send("ucinewgame"); self._send(f"setoption name MultiPV value {multipv}")
        self._send("isready"); self._wait("readyok")
        self._send(f"position fen {fen}")
        self._send(f"go depth {depth}" + (f" searchmoves {' '.join(searchmoves)}" if searchmoves else ""))
        out = self._wait("bestmove")
        last = {}
        for l in out:
            m = re.search(r"info depth (\d+) .*?multipv (\d+) score (cp|mate) (-?\d+).*? pv (.*)", l) or \
                re.search(r"info depth (\d+) .*?()score (cp|mate) (-?\d+).*? pv (.*)", l)
            if m:
                d, mp, kind, val, pv = m.groups()
                last[int(mp) if mp else 1] = dict(depth=int(d), kind=kind, value=int(val), pv=pv.split())
        return last

    def settings(self, depth, multipv=1):
        return dict(engine=self.name, hash_mb=self.hash_mb, threads=1, depth=depth, multipv=multipv, tablebase=False)

    def close(self):
        try: self._send("quit")
        except Exception: pass
