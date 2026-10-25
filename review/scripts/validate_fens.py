import chess

samples = {
 "L1-A": ("4k3/4n3/8/8/8/8/8/4R1K1 b - - 0 1", []),
 "L1-B": ("4q1k1/4n3/8/8/8/8/8/4R1K1 b - - 0 1", []),
 "L2":   ("7k/ppp5/8/PPP5/8/8/8/7K w - - 0 1", []),
 "L3":   ("4k3/8/r7/4K3/4P3/8/8/R7 b - - 0 1", []),
}
for name,(fen,_) in samples.items():
    b = chess.Board(fen)
    print(name, "valid:", b.is_valid(), "status:", b.status().name if b.status() else "OK",
          "turn:", "W" if b.turn else "B", "check:", b.is_check())

print("\n== L1-A: Black legal moves ==")
b = chess.Board(samples["L1-A"][0])
print(sorted(m.uci() for m in b.legal_moves))
print("Knight moves (pseudo):", sorted(m.uci() for m in b.pseudo_legal_moves if b.piece_at(m.from_square).piece_type==chess.KNIGHT))
print("Knight legal:", sorted(m.uci() for m in b.legal_moves if b.piece_at(m.from_square).piece_type==chess.KNIGHT))
print("Kf8 legal?", chess.Move.from_uci("e8f8") in b.legal_moves, " Is checkmate?", b.is_checkmate())
print("Is knight pinned (absolute)?", b.is_pinned(chess.BLACK, chess.E7))

print("\n== L1-B ==")
b = chess.Board(samples["L1-B"][0])
print("Nc8 legal?", chess.Move.from_uci("e7c8") in b.legal_moves)
print("knight legal moves:", sorted(m.uci() for m in b.legal_moves if b.piece_at(m.from_square).piece_type==chess.KNIGHT))
print("Knight absolutely pinned?", b.is_pinned(chess.BLACK, chess.E7))
print("(Note: Qe8 is attacked by Re1 only if Ne7 moves; queen stays shielded.)")

print("\n== L2 line checks ==")
def play(fen, sans):
    b = chess.Board(fen)
    for s in sans:
        try:
            b.push_san(s)
        except Exception as e:
            print("  ILLEGAL:", s, e); return b
    return b
b1 = play(samples["L2"][0], ["b6","axb6","c6","bxc6","a6"])
print("line1 final:\n", b1)
b2 = play(samples["L2"][0], ["b6","cxb6","a6","bxa6","c6"])
print("line2 final:\n", b2)
# note: in L2, black pawns on a7 b7 c7, white a5 b5 c5; kings h1,h8.

print("\n== L3 line checks ==")
b = play(samples["L3"][0], ["Rh6","Kf5","Rb6","e5","Rb1"])
print(b)
