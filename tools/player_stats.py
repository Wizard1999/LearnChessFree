"""Measured style statistics for named players from the local game archives (The Week in Chess zips and Lichess broadcasts).

Every number is a count over a stated sample of games, so a lesson may say "in 1,234 games in our data, X played 1.e4 as White 71% of the time"
and nothing that is an opinion. Output: docs/player-stats.json (and a printed summary). Run: ./tools/.venv/Scripts/python.exe -I tools/player_stats.py
Measures, per player and colour: games, years covered, results; first moves as White (1.e4, 1.d4, 1.Nf3, 1.c4, other); replies as Black to 1.e4 and 1.d4;
average game length in moves; share of games with the queens still on the board at move 30; castling side; average opponent rating.
Games with both ratings below 2400 are ignored; duplicates (the same game in two archives) are dropped by a hash of players, date and first moves.
"""
import hashlib, io, json, re, sys, time, zipfile
from collections import Counter, defaultdict
from pathlib import Path

import chess
import chess.pgn
import zstandard

ROOT = Path(__file__).resolve().parent.parent
GAMES = ROOT / "library" / "data" / "games"
# display name -> regex matched against the PGN name tag ("Surname, Given")
PLAYERS = {
    "Garry Kasparov": r"^Kasparov,\s?G", "Anatoly Karpov": r"^Karpov,\s?Ana", "Viswanathan Anand": r"^Anand,\s?V", "Vladimir Kramnik": r"^Kramnik,\s?V",
    "Magnus Carlsen": r"^Carlsen,\s?M", "Veselin Topalov": r"^Topalov,\s?V", "Fabiano Caruana": r"^Caruana,\s?F", "Hikaru Nakamura": r"^Nakamura,\s?H",
    "Levon Aronian": r"^Aronian,\s?L", "Ian Nepomniachtchi": r"^Nepomniachtchi,\s?I", "Ding Liren": r"^Ding,\s?L", "Alireza Firouzja": r"^Firouzja,\s?A",
    "Gukesh Dommaraju": r"^(Gukesh|Dommaraju)", "Maxime Vachier-Lagrave": r"^Vachier", "Peter Svidler": r"^Svidler,\s?P", "Boris Gelfand": r"^Gelfand,\s?B",
}
FLOOR = 2400
sys.stdout.reconfigure(encoding="utf-8")


def streams():
    for z in sorted((GAMES / "twic").glob("twic*g.zip")):
        with zipfile.ZipFile(z) as zf:
            for n in zf.namelist():
                if n.lower().endswith(".pgn"): yield z.name, zf.read(n).decode("utf-8", "replace")
    for f in sorted((GAMES / "lichess-broadcast").glob("*.pgn.zst")):
        with open(f, "rb") as fh: yield f.name, zstandard.ZstdDecompressor().stream_reader(fh).read().decode("utf-8", "replace")


def main():
    pat = {k: re.compile(v) for k, v in PLAYERS.items()}
    quick = re.compile("|".join(v for v in PLAYERS.values()).replace("^", r'"'), re.M)
    stat = {k: {"white": defaultdict(Counter), "black": defaultdict(Counter), "years": set(), "opp": [0, 0], "lengths": [], "queens30": [0, 0], "castle": Counter()} for k in PLAYERS}
    seen = set(); t0 = time.time(); n_read = 0
    for name, text in streams():
        for blk in re.split(r"\n(?=\[Event )", text):
            mw, mb = re.search(r'\[White "([^"]*)"\]', blk), re.search(r'\[Black "([^"]*)"\]', blk)
            if not mw or not mb: continue
            who = [(k, "white") for k, p in pat.items() if p.search(mw.group(1))] + [(k, "black") for k, p in pat.items() if p.search(mb.group(1))]
            if not who: continue
            ew, eb = re.search(r'\[WhiteElo "(\d+)"\]', blk), re.search(r'\[BlackElo "(\d+)"\]', blk)
            res = re.search(r'\[Result "([^"]*)"\]', blk)
            if not ew or not eb or int(ew.group(1)) < FLOOR or int(eb.group(1)) < FLOOR or not res or res.group(1) not in ("1-0", "0-1", "1/2-1/2"): continue
            if re.search(r'\[(FEN|Variant)', blk): continue
            try: game = chess.pgn.read_game(io.StringIO(blk))
            except Exception: continue
            if game is None: continue
            moves = [m for m in game.mainline_moves()]
            if len(moves) < 10: continue
            date = re.search(r'\[Date "(\d{4})', blk)
            key = hashlib.md5(f"{mw.group(1)}|{mb.group(1)}|{date.group(1) if date else ''}|{''.join(m.uci() for m in moves[:12])}".encode()).hexdigest()
            if key in seen: continue
            seen.add(key); n_read += 1
            board = chess.Board(); first = None; reply = None; castles = {}
            q30 = None
            for i, m in enumerate(moves):
                san = board.san(m)
                if i == 0: first = san
                if i == 1: reply = san
                if san.startswith("O-O") and board.turn not in castles: castles[board.turn] = "short" if san == "O-O" else "long"
                board.push(m)
                if i == 59: q30 = len(board.pieces(chess.QUEEN, True)) + len(board.pieces(chess.QUEEN, False)) > 0
            for k, colour in who:
                s = stat[k]; c = s[colour]
                c["games"]["n"] += 1; s["years"].add(int(date.group(1)) if date else 0)
                outcome = res.group(1); won = (outcome == "1-0") == (colour == "white") and outcome != "1/2-1/2"
                c["result"]["win" if won else "draw" if outcome == "1/2-1/2" else "loss"] += 1
                if colour == "white": c["first"][first if first in ("e4", "d4", "Nf3", "c4") else "other"] += 1
                else:
                    if first == "e4": c["vs_e4"][reply if reply in ("e5", "c5", "e6", "c6") else "other"] += 1
                    elif first == "d4": c["vs_d4"][reply if reply in ("d5", "Nf6") else "other"] += 1
                s["opp"][0] += int(eb.group(1) if colour == "white" else ew.group(1)); s["opp"][1] += 1
                s["lengths"].append(len(moves) // 2)
                if q30 is not None: s["queens30"][0] += 1 if q30 else 0; s["queens30"][1] += 1
                if (chess.WHITE if colour == "white" else chess.BLACK) in castles: s["castle"][castles[chess.WHITE if colour == "white" else chess.BLACK]] += 1
        print(f"{name}: {n_read} games kept, {time.time() - t0:.0f}s", flush=True)
    out = {}
    for k, s in stat.items():
        total = sum(s[c]["games"]["n"] for c in ("white", "black"))
        if total < 200: continue
        out[k] = {"games": total, "years": [min(y for y in s["years"] if y), max(s["years"])], "white_games": s["white"]["games"]["n"], "black_games": s["black"]["games"]["n"],
                  "as_white": {"results": dict(s["white"]["result"]), "first_move": dict(s["white"]["first"])},
                  "as_black": {"results": dict(s["black"]["result"]), "vs_e4": dict(s["black"]["vs_e4"]), "vs_d4": dict(s["black"]["vs_d4"])},
                  "avg_length_moves": round(sum(s["lengths"]) / len(s["lengths"]), 1), "avg_opponent_rating": round(s["opp"][0] / s["opp"][1]),
                  "queens_on_at_move_30": {"games_reaching_move_30": s["queens30"][1], "with_queens": s["queens30"][0]}, "castling": dict(s["castle"])}
    doc = {"built": time.strftime("%Y-%m-%d"), "floor": FLOOR, "sample": "both players rated 2400+, standard games, de-duplicated, The Week in Chess issues 920+ and Lichess broadcasts 2020+", "players": out}
    (ROOT / "docs" / "player-stats.json").write_text(json.dumps(doc, indent=1, ensure_ascii=False), encoding="utf8")
    for k, v in out.items(): print(k, v["games"], v["years"], v["as_white"]["first_move"])


main()
