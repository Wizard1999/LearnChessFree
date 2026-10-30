#!/usr/bin/env python3
"""Finds lesson cards that carry a chain of chess moves in prose instead of showing them on a board.

    ./tools/.venv/Scripts/python.exe -I tools/check_text_notation.py [--list N] [--strict]

A learner should not have to play moves in their head (review of 30 Oct 2026). A card is flagged when its text holds MOVES_LIMIT or more
move-like tokens (piece moves such as Nf3, Bxe6+, captures such as exd5, castling, or numbered moves such as "9.Qd8+"). Bare square
names (e4, f7) are not counted. The fix is a board step with the line and one sentence per move, so the prose can talk about ideas.
Informational (exit 0) unless --strict.
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import json, re, sys, collections
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MOVES_LIMIT = 4
SAN = re.compile(r"(?<![A-Za-z])(?:O-O(?:-O)?|[KQRBN][a-h]?[1-8]?x?[a-h][1-8]|[a-h]x[a-h][1-8]|[a-h][1-8]=[QRBN])[+#]?(?![A-Za-z0-9])")
NUMBERED = re.compile(r"\b\d{1,2}\.(?:\.\.)?\s?(?:O-O|[KQRBN]?[a-h]?x?[a-h]?[1-8])")


def card_moves(text):
    return len(SAN.findall(text)) + len(NUMBERED.findall(text))


def main():
    rows = []
    per_lesson = collections.Counter(); cards = collections.Counter()
    for f in sorted((ROOT / "content" / "lessons").glob("*.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        for n, s in enumerate(d.get("steps", []), 1):
            cards[d["id"]] += s.get("type") == "card"
            if s.get("type") != "card": continue
            k = card_moves(s.get("text", ""))
            if k >= MOVES_LIMIT:
                rows.append((k, d["id"], n)); per_lesson[d["id"]] += 1
    lessons = len(list((ROOT / "content" / "lessons").glob("*.json")))
    print(f"{len(rows)} cards in {len(per_lesson)} of {lessons} lessons carry {MOVES_LIMIT} or more moves in prose")
    lim = int(sys.argv[sys.argv.index("--list") + 1]) if "--list" in sys.argv else 15
    for k, lid, n in sorted(rows, reverse=True)[:lim]: print(f"  {k:3d} moves  {lid} step {n}")
    raise SystemExit(1 if rows and "--strict" in sys.argv else 0)


if __name__ == "__main__":
    main()
