import chess, sys
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from uci import Engine

e = Engine()
DEPTH = 40

def show(fen, label, depth=DEPTH):
    b = chess.Board(fen)
    n = b.legal_moves.count()
    last, bm = e.analyse(fen, multipv=n, depth=depth)
    print(f"\n=== {label} | {fen} | legal moves: {n} | depth {depth} ===")
    rows = []
    for mp, (d, kind, val, pv) in sorted(last.items()):
        san = b.san(chess.Move.from_uci(pv[0]))
        rows.append((mp, san, f"{kind} {val}", d))
    for r in rows: print("  ", r)
    return last

# Lesson 2, root
show("7k/ppp5/8/PPP5/8/8/8/7K w - - 0 1", "L2 root (White to move)")
# After 1.b6: Black's replies
show("7k/ppp5/1P6/P1P5/8/8/8/7K b - - 0 1", "L2 after 1.b6 (Black to move)")
# After 1.b6 axb6 : White options
show("7k/1pp5/1p6/P1P5/8/8/8/7K w - - 0 1", "L2 after 1.b6 axb6 (White to move)")
# After 1.b6 cxb6
show("7k/pp6/1p6/P1P5/8/8/8/7K w - - 0 1", "L2 after 1.b6 cxb6 (White to move)")

# Lesson 3 as given
fen3 = "4k3/8/r7/4K3/4P3/8/8/R7 b - - 0 1"
show(fen3, "L3 as given (Black to move)")
# The lesson's claimed line: 1...Rh6 2.Kf5 Rb6 3.e5 Rb1
print("\nL3 claimed line, engine score after each ply (side-to-move perspective):")
b = chess.Board(fen3)
for san in ["Rh6", "Kf5", "Rb6", "e5", "Rb1"]:
    b.push_san(san)
    last, _ = e.analyse(b.fen(), multipv=1, depth=30)
    d, kind, val, pv = last[1]
    print(f"  after {san:4s}: stm={'W' if b.turn else 'B'} {kind} {val}  pv={' '.join(pv[:4])}")
e.quit()

