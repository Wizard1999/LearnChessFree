import chess, sys
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from uci import Engine
e = Engine()

def single(fen, label, depth=36):
    last, bm = e.analyse(fen, multipv=1, depth=depth)
    d, kind, val, pv = last[1]
    print(f"{label:38s} stm={'W' if chess.Board(fen).turn else 'B'} {kind} {val:>6}  d={d}  pv={' '.join(pv[:8])}")

root = "7k/ppp5/8/PPP5/8/8/8/7K w - - 0 1"
b = chess.Board(root)
print("L2: single-PV re-search of each White first move (score is from side-to-move = Black after the move; negative = good for White if 'mate -N')")
for m in b.legal_moves:
    c = b.copy(); san = c.san(m); c.push(m)
    single(c.fen(), "after 1." + san)

print("\nAfter 1.b6 axb6 2.c6 : every Black reply")
c = chess.Board(root)
for s in ["b6","axb6","c6"]: c.push_san(s)
for m in c.legal_moves:
    d = c.copy(); san = d.san(m); d.push(m)
    single(d.fen(), "  2..." + san)

print("\nAfter 1.b6 cxb6 2.a6 : every Black reply")
c = chess.Board(root)
for s in ["b6","cxb6","a6"]: c.push_san(s)
for m in c.legal_moves:
    d = c.copy(); san = d.san(m); d.push(m)
    single(d.fen(), "  2..." + san)

# Counterexample variants the lesson proposes ("change a pawn's rank or bring the black king closer")
print("\nCounterexample probes (White to move):")
for fen,label in [
  ("7k/ppp5/8/PPP5/8/8/8/7K w - - 0 1", "original"),
  ("1k6/ppp5/8/PPP5/8/8/8/7K w - - 0 1", "Black king on b8"),
  ("3k4/ppp5/8/PPP5/8/8/8/7K w - - 0 1", "Black king on d8"),
  ("7k/ppp5/8/1PP5/P7/8/8/7K w - - 0 1", "a-pawn back to a4"),
  ("7k/ppp5/8/PPP5/8/8/8/K7 w - - 0 1", "White king on a1"),
]:
    single(fen, label, depth=36)
e.quit()


