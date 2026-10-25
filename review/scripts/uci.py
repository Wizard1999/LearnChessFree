"""Minimal UCI driver for the npm stockfish build (node subprocess)."""
import subprocess, sys, re, threading, queue

import os
SF = os.environ.get("STOCKFISH_JS", r"node_modules\stockfish\bin\stockfish-19-lite-single.js")  # npm i stockfish@19.0.1 (GPL-3.0)

class Engine:
    def __init__(self):
        self.p = subprocess.Popen(["node", SF], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                  stderr=subprocess.STDOUT, text=True, bufsize=1)
        self.q = queue.Queue()
        threading.Thread(target=self._rd, daemon=True).start()
        self.send("uci"); self.wait("uciok")
        self.id = []
    def _rd(self):
        for line in self.p.stdout:
            self.q.put(line.rstrip())
    def send(self, s):
        self.p.stdin.write(s + "\n"); self.p.stdin.flush()
    def wait(self, token, timeout=600):
        out = []
        while True:
            l = self.q.get(timeout=timeout)
            out.append(l)
            if l.startswith(token): return out
    def banner(self):
        self.send("uci")
        return [l for l in self.wait("uciok") if l.startswith("id ") or l.startswith("option name Hash") or l.startswith("option name Threads")]
    def analyse(self, fen, multipv=1, depth=None, nodes=None, movetime=None, moves=None):
        self.send("ucinewgame"); self.send("setoption name MultiPV value %d" % multipv)
        self.send("isready"); self.wait("readyok")
        self.send("position fen " + fen + ((" moves " + " ".join(moves)) if moves else ""))
        if depth: self.send("go depth %d" % depth)
        elif nodes: self.send("go nodes %d" % nodes)
        else: self.send("go movetime %d" % movetime)
        out = self.wait("bestmove")
        # keep last info per multipv
        last = {}
        for l in out:
            m = re.search(r"info depth (\d+) .*?multipv (\d+) score (cp|mate) (-?\d+).*? pv (.*)", l)
            if m:
                d, mp, kind, val, pv = m.groups()
                last[int(mp)] = (int(d), kind, int(val), pv.split())
        return last, out[-1]
    def quit(self):
        try: self.send("quit")
        except Exception: pass

if __name__ == "__main__":
    e = Engine()
    print("\n".join(e.banner()))
    last, bm = e.analyse(chess_fen := "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", depth=12)
    print(last, bm)
    e.quit()

