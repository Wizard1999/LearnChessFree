"""Reproduces the counts on the "One pattern, from real games" card of L-HI-ENGINES-HUMANS-3.

    ./tools/.venv/Scripts/python.exe -I tools/analysis/count_guard_left.py

Source: library/data/lichess_db_puzzle.csv.zst (Lichess puzzle database, CC0). In that file the FIRST move is the move that creates the
puzzle (the mistake, played by the opponent of the solver); the second move is the solver's reply. Counted here:
  total puzzles; puzzles tagged hangingPiece; of those, first move is a capture; of those, the reply captures a piece that is NOT the
  piece just moved and that the moving piece had been defending before it moved ("guard left").
Puzzles are chosen because a tactic exists, so these counts are a catalogue of mistakes, not a frequency in play.
"""
import csv, io, sys
from pathlib import Path
import chess, zstandard

SRC = Path(__file__).resolve().parent.parent.parent / "library" / "data" / "lichess_db_puzzle.csv.zst"


def main():
    total = hang = cap = guard = 0
    with open(SRC, "rb") as fh:
        rd = csv.DictReader(io.TextIOWrapper(zstandard.ZstdDecompressor().stream_reader(fh), encoding="utf-8"))
        for row in rd:
            total += 1
            if "hangingPiece" not in row["Themes"].split(): continue
            hang += 1
            b = chess.Board(row["FEN"]); mv = row["Moves"].split()
            m0 = chess.Move.from_uci(mv[0])
            if not b.is_capture(m0): continue
            cap += 1
            me = b.turn; frm = m0.from_square
            guarded = {s for s in chess.SquareSet(b.occupied_co[me]) if s != frm and frm in b.attackers(me, s)}
            b.push(m0)
            if len(mv) < 2: continue
            m1 = chess.Move.from_uci(mv[1])
            if b.is_capture(m1) and m1.to_square != m0.to_square and m1.to_square in guarded: guard += 1
    print(f"puzzles {total:,}; hangingPiece {hang:,}; first move a capture {cap:,}; reply takes a different piece the mover had been guarding {guard:,} ({100*guard/hang:.1f}% of hangingPiece)")


if __name__ == "__main__":
    main()
