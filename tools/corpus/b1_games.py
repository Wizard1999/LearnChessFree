"""Tasks B and C, step 1: candidate positions from real games (Lichess 2013-01 CC0 sample), rules-only (no engine).

Games: both players rated >= 1600 (and < 2500), result decided or not (no filter), at least 62 plies.
Per game: up to PER_GAME seeded-random plies in 16..60 whose last move was neither a capture nor a check, and where the
side to move is not in check. For each candidate position we record cheap rule features:
  loose      the side-to-move's non-king pieces that are attacked and undefended (squares)
  mate1      opponent's mating moves if the side to move passed (null move)  -> mate-in-1 threats
  loose_threat details for a single loose piece attacked exactly once (threat capture legal after a null move)
Games are split by hash parity: even -> Task B (quiet / classify), odd -> Task C (threat / none), so the same game never
feeds both tasks.

Output: out/game_candidates.jsonl
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import re, json, random, hashlib, time
import chess
from common import *

PER_GAME = 8
MAX_GAMES = int(sys.argv[1]) if len(sys.argv) > 1 else 10**9
VAL = {chess.PAWN: 1, chess.KNIGHT: 3, chess.BISHOP: 3, chess.ROOK: 5, chess.QUEEN: 9, chess.KING: 0}
RESULTS = {"1-0", "0-1", "1/2-1/2", "*"}


def iter_games(path):
    hdr, mt, state = {}, [], "h"
    with open_zst_text(path) as fh:
        for line in fh:
            line = line.rstrip("\n")
            if state == "h":
                if line.startswith("["):
                    m = re.match(r'\[(\w+) "(.*)"\]', line)
                    if m: hdr[m.group(1)] = m.group(2)
                elif line.strip() == "" and hdr:
                    state = "m"
            elif state == "m":
                if line.strip() == "":
                    if mt:
                        yield hdr, " ".join(mt)
                        hdr, mt, state = {}, [], "h"
                else:
                    mt.append(line)
    if hdr and mt:
        yield hdr, " ".join(mt)


def sans(movetext):
    t = re.sub(r"\{[^}]*\}", " ", movetext)
    t = re.sub(r"\([^)]*\)", " ", t)
    out = []
    for tok in t.split():
        if tok in RESULTS or re.fullmatch(r"\d+\.+", tok) or tok.startswith("$"):
            continue
        tok = re.sub(r"^\d+\.+", "", tok)
        if tok: out.append(tok)
    return out


def loose_of(board, color):
    res = []
    for s, pc in board.piece_map().items():
        if pc.color == color and pc.piece_type != chess.KING and board.attackers(not color, s) and not board.attackers(color, s):
            res.append(chess.square_name(s))
    return sorted(res)


def main():
    out = open(OUT / "game_candidates.jsonl", "w", encoding="utf-8")
    t0 = time.time(); n_games = n_qual = n_cand = 0
    for hdr, mt in iter_games(GAMES_PGN):
        n_games += 1
        if n_games > MAX_GAMES: break
        try:
            we, be = int(hdr.get("WhiteElo", 0)), int(hdr.get("BlackElo", 0))
        except ValueError:
            continue
        if not (1600 <= we < 2500 and 1600 <= be < 2500):
            continue
        site = hdr.get("Site", "")
        gid = site.rsplit("/", 1)[-1]
        mv = sans(mt)
        if len(mv) < 62:
            continue
        n_qual += 1
        rng = random.Random(f"{SEED}-game-{gid}")
        plies = list(range(16, 61)); rng.shuffle(plies)
        want = set(plies[: PER_GAME * 2])           # look at 16 random plies, keep up to PER_GAME quiet ones
        b = chess.Board(); kept = 0
        try:
            for i, san in enumerate(mv[:61]):
                m = b.parse_san(san)
                cap = b.is_capture(m); chk = b.gives_check(m)
                b.push(m)
                p = i + 1                      # plies played
                if p not in want or kept >= PER_GAME:
                    continue
                if cap or chk or b.is_check() or b.is_game_over():
                    continue
                side = b.turn
                lo = loose_of(b, side)
                nb = b.copy(); nb.push(chess.Move.null())
                mates = []
                for mm in nb.legal_moves:
                    nb.push(mm)
                    if nb.is_checkmate(): mates.append(mm.uci())
                    nb.pop()
                rec = dict(gid=gid, ply=p, fen=b.fen(), white_elo=we, black_elo=be, last=m.uci(),
                           stm="white" if side else "black", loose=lo, mate1=mates,
                           pieces=len(b.piece_map()), task="B" if int(hashlib.sha1(gid.encode()).hexdigest(), 16) % 2 == 0 else "C")
                # single-loose-piece capture threat
                if len(lo) == 1:
                    sq = chess.parse_square(lo[0])
                    att = list(b.attackers(not side, sq))
                    rec["loose_attackers"] = len(att)
                    if len(att) == 1:
                        caps = [mm.uci() for mm in nb.legal_moves if mm.to_square == sq and mm.from_square == att[0]]
                        rec["loose_capture"] = caps
                        rec["loose_value"] = VAL[b.piece_at(sq).piece_type]
                out.write(json.dumps(rec) + "\n"); kept += 1; n_cand += 1
        except Exception as ex:
            continue
        if n_games % 5000 == 0:
            print(f"games {n_games}, qualifying {n_qual}, candidates {n_cand}, {time.time() - t0:.0f}s", flush=True)
    out.close()
    print(f"games {n_games}, qualifying {n_qual}, candidates {n_cand}, {time.time() - t0:.0f}s")


if __name__ == "__main__":
    main()
