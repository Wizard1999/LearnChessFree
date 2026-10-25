import os, sys, re, chess
sys.path.insert(0, r"O:\_Chessteaching\review\scripts")
os.environ["STOCKFISH_JS"] = r"C:\Users\Ender\AppData\Local\Temp\claude\C--Users-Ender--claude-spares-spare-ra2zlm\e16b15b1-8492-4ca5-a694-c6ad6fab5663\scratchpad\sf_node\node_modules\stockfish\bin\stockfish-19-lite-single.js"
from uci import Engine
e = Engine()
base = chess.Board("4k3/5ppp/q7/3N4/8/8/5PPP/6K1 w - - 0 1")
cases = {"q a6->a8": "q3k3/5ppp/8/3N4/8/8/5PPP/6K1 w - - 0 1"}
for sq in ("a5","c5","a7","b7"):
    b = base.copy(); b.set_piece_at(chess.parse_square(sq), chess.Piece(chess.PAWN, chess.BLACK)); cases["add p@"+sq] = b.fen()
for name, fen in cases.items():
    for d in (12, 24):
        last, bm = e.analyse(fen, multipv=1, depth=d)
        _, kind, val, pv = last[1]
        print(f"{name:10s} depth {d:2d}: best {kind} {val:+d}  pv {' '.join(pv[:6])}")
e.quit()
