"""Spike: can we auto-generate engine-verified 'minimal pair' counterexamples with grounded reasons?
Idea under test: take a position + thematic move; make every single-piece edit within a small radius;
ask the engine whether the thematic move still works; explain WHY from deterministic board facts."""
import chess, sys, time, os, itertools
sys.path.insert(0, r"O:\_Chessteaching\review\scripts")  # uci.py driver; set STOCKFISH_JS env var to the npm stockfish build
os.environ["STOCKFISH_JS"] = r"C:\Users\Ender\AppData\Local\Temp\claude\C--Users-Ender--claude-spares-spare-ra2zlm\e16b15b1-8492-4ca5-a694-c6ad6fab5663\scratchpad\sf_node\node_modules\stockfish\bin\stockfish-19-lite-single.js"
import re
from uci import Engine

VAL = {chess.PAWN:1, chess.KNIGHT:3, chess.BISHOP:3, chess.ROOK:5, chess.QUEEN:9, chess.KING:100}
DEPTH = int(os.environ.get("DEPTH", "12"))
eng = Engine()

def cp_of(kind, val):  # white-to-move POV score -> comparable number
    return (10000 - abs(val)) * (1 if val > 0 else -1) if kind == "mate" else val

def search(board, searchmove=None):
    eng.send("ucinewgame"); eng.send("isready"); eng.wait("readyok")
    eng.send("position fen " + board.fen())
    eng.send("go depth %d%s" % (DEPTH, (" searchmoves " + searchmove.uci()) if searchmove else ""))
    out = eng.wait("bestmove"); last = None
    for l in out:
        m = re.search(r"score (cp|mate) (-?\d+)", l)
        if m: last = (m.group(1), int(m.group(2)))
    return cp_of(*last) if last else None

def facts(board, move):
    """Deterministic, human-concept facts about what `move` does. (The seed of a concept detector.)"""
    b = board.copy(); mover = b.turn
    piece = b.piece_at(move.from_square); b.push(move)
    sq = move.to_square
    targets = [(chess.square_name(t), b.piece_at(t).symbol()) for t in b.attacks(sq)
               if b.piece_at(t) and b.piece_at(t).color != mover and b.piece_at(t).piece_type != chess.KING]
    gives_check = b.is_check()
    capturers = [b.piece_at(a).piece_type for a in b.attackers(not mover, sq)]
    cheapest_capturer = min((VAL[p] for p in capturers), default=None)
    defenders = len(b.attackers(mover, sq))
    # high-value targets = valued at least as much as the attacker, or undefended
    return dict(check=gives_check, targets=targets, capturers=capturers,
                cheapest_capturer=cheapest_capturer, defenders=defenders, mover_piece=piece.symbol(),
                landing=chess.square_name(sq))

def width(f): return (1 if f["check"] else 0) + len(f["targets"])
def why_broken(f0, f1):
    r = []
    if width(f1) < 2 <= width(f0): r.append("the knight no longer attacks two things at once (now: %s%s)" % ("check" if f1["check"] else "no check", "".join(", "+p+"@"+s for s,p in f1["targets"])))
    if f0["check"] and not f1["check"]: r.append("the move no longer gives check")
    if len(f1["targets"]) < len(f0["targets"]): r.append("the knight now attacks %d target(s) instead of %d (%s)" % (len(f1["targets"]), len(f0["targets"]), ", ".join(f"{p}@{s}" for s,p in f1["targets"]) or "none"))
    if f1["cheapest_capturer"] is not None and f0["cheapest_capturer"] is None: r.append("the landing square %s can now be captured by a piece worth %d" % (f1["landing"], f1["cheapest_capturer"]))
    return r

def edits(board, move, radius=2):
    """All single edits within `radius` of the squares involved: remove a piece, relocate a piece, add a Black pawn."""
    keep_sq = {move.from_square}
    involved = [move.to_square] + [s for s in chess.SQUARES if board.piece_at(s)]
    near = lambda a, b: max(abs(chess.square_file(a)-chess.square_file(b)), abs(chess.square_rank(a)-chess.square_rank(b))) <= radius
    for s in chess.SQUARES:
        p = board.piece_at(s)
        if not p or s in keep_sq: continue
        if p.piece_type != chess.KING:
            b = board.copy(); b.remove_piece_at(s); yield ("remove %s@%s" % (p.symbol(), chess.square_name(s)), b)
        for t in chess.SQUARES:
            if t == s or board.piece_at(t) or not near(s, t): continue
            if p.piece_type == chess.PAWN and chess.square_rank(t) in (0, 7): continue
            b = board.copy(); b.remove_piece_at(s); b.set_piece_at(t, p)
            yield ("move %s %s->%s" % (p.symbol(), chess.square_name(s), chess.square_name(t)), b)
    for t in chess.SQUARES:
        if board.piece_at(t) or chess.square_rank(t) in (0, 7) or not near(move.to_square, t): continue
        b = board.copy(); b.set_piece_at(t, chess.Piece(chess.PAWN, chess.BLACK))
        yield ("add p@%s" % chess.square_name(t), b)

def run(fen, uci, label):
    base = chess.Board(fen); mv = chess.Move.from_uci(uci)
    assert mv in base.legal_moves
    t0 = time.time()
    s_move0, s_best0 = search(base, mv), search(base)
    f0 = facts(base, mv)
    print(f"\n##### {label}\nFEN {fen}\nthematic move {base.san(mv)}: eval {s_move0:+d} (best {s_best0:+d}) | facts {f0}")
    keeps, breaks, skipped = [], [], 0
    for name, b in edits(base, mv):
        b.turn = base.turn; b.castling_rights = 0; b.ep_square = None
        if not b.is_valid() or mv not in b.legal_moves: skipped += 1; continue
        sm, sb = search(b, mv), search(b)
        f1 = facts(b, mv)
        row = (name, b.fen(), sm, sb, f1)
        if sm >= 0.6 * s_move0 and sm >= sb - 60: keeps.append(row)   # idea still wins about as much as before
        elif sm <= 0.25 * s_move0:               breaks.append(row)   # idea no longer wins (another resource may)
    print(f"edits tried: {len(keeps)+len(breaks)+skipped}  skipped(illegal/invalid): {skipped}  keeps: {len(keeps)}  breaks: {len(breaks)}  [{time.time()-t0:.0f}s, depth {DEPTH}]")
    print("-- minimal pairs where the idea BREAKS (engine-verified), with reason from board facts:")
    explained = [r for r in breaks if why_broken(f0, r[4])]
    print(f"   breaks with a deterministic reason: {len(explained)}/{len(breaks)}; unexplained edits: {[r[0] for r in breaks if not why_broken(f0, r[4])][:10]}")
    for name, fen1, sm, sb, f1 in explained[:14]:
        print(f"  {name:22s} move-eval {sm:+5d} best {sb:+5d} | {'; '.join(why_broken(f0, f1))}\n      {fen1}")
    print("-- sample edits where the idea SURVIVES (irrelevant changes):")
    for name, fen1, sm, sb, f1 in keeps[:5]:
        print(f"  {name:22s} move-eval {sm:+5d} best {sb:+5d}")

if __name__ == "__main__":
    # Royal fork: Nc7+ forks Ke8 and Ra8
    run("4k3/5ppp/q7/3N4/8/8/5PPP/6K1 w - - 0 1", "d5c7", "Knight fork Nc7+ (king + queen)")
    eng.quit()


