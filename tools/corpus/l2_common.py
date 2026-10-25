"""Corpus extension "lp2": shared definitions for the second Lichess-puzzle tranche (nodes with no items so far).

Everything here is seeded and rerunnable. It reuses tools/corpus/common.py (paths, reader, seeds, rating bins) and
adds: puzzle quality classes, per-bucket predicates over the puzzle (cheap python-chess features), and the exclusion
of puzzles / positions that already exist in content/items (so ids and FENs never collide).

Bucket = one (node, selection rule) pair. A puzzle may qualify for several buckets; the rarest bucket picks first.
Predicates are rules-level facts about the puzzle (python-chess), never engine claims: the engine and the tablebase
are consulted later in l2_verify.py, and only claims that the project validator passes reach an item.
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json
import chess
from common import *

L2_SEED = 20261031
L2_OUT = OUT / "l2"
L2_OUT.mkdir(exist_ok=True)
PREFIX = "lp2-"
EXTRA_FILES = ("lp2-stalemate-1.json", "lp2-ini-1.json")     # written by l2_stalemate_gen.py and l2_comp.py, not by l2_build.py

VAL = {chess.PAWN: 1, chess.KNIGHT: 3, chess.BISHOP: 3, chess.ROOK: 5, chess.QUEEN: 9, chess.KING: 0}
MOTIFS = {"fork", "pin", "skewer", "discoveredAttack", "doubleCheck", "backRankMate", "hangingPiece", "trappedPiece",
          "deflection", "attraction", "clearance", "intermezzo", "xRayAttack", "interference", "capturingDefender",
          "sacrifice", "quietMove", "smotheredMate", "anastasiaMate", "arabianMate", "hookMate", "dovetailMate"}
MATE_PATTERNS = {   # lichess theme -> label shown ONLY in cue-1 siblings (label comes from Lichess's detector [S])
    "anastasiaMate": "Anastasia's mate", "arabianMate": "Arabian mate", "bodenMate": "Boden's mate",
    "doubleBishopMate": "mate with two bishops", "hookMate": "hook mate", "smotheredMate": "smothered mate",
    "dovetailMate": "dovetail mate", "operaMate": "opera mate", "pillsburysMate": "Pillsbury's mate",
    "epauletteMate": "epaulette mate", "cornerMate": "corner mate", "morphysMate": "Morphy's mate",
    "triangleMate": "triangle mate", "vukovicMate": "Vukovic mate", "balestraMate": "Balestra mate",
    "killBoxMate": "kill-box mate", "blindSwineMate": "blind swine mate", "swallowstailMate": "swallow's tail mate"}
ATTACK_THEMES = {"kingsideAttack", "queensideAttack"}


# ------------------------------------------------------------------------------------------------------------------
# quality classes of a Lichess row
# ------------------------------------------------------------------------------------------------------------------
def quality(rating, rd, plays, pop):
    """2 = strict (same filter as the first corpus), 1 = relaxed (rare themes only), 0 = rejected."""
    if rd <= 80 and plays >= 500 and pop >= 85 and 800 <= rating < 2200:
        return 2
    if rd <= 200 and plays >= 30 and pop >= 0 and 500 <= rating < 2500:
        return 1
    return 0


def tier_l2(r):
    return 2 if r < 1200 else 3 if r < 1500 else 4 if r < 1800 else 5 if r < 2200 else 6


def grade_of(rd, plays):
    return "G1" if rd <= 80 and plays >= 500 else "G0"


# ------------------------------------------------------------------------------------------------------------------
# features
# ------------------------------------------------------------------------------------------------------------------
class Feat:
    """Lazy python-chess facts about a puzzle. `b` is the position shown to the learner (after Moves[0])."""

    def __init__(self, rec):
        self.rec = rec
        self.themes = set(rec["themes"])
        b0 = chess.Board(rec["fen"])
        self.m0 = chess.Move.from_uci(rec["moves"][0])
        self.pre_board = b0.copy(stack=False)
        b0.push(self.m0)
        self.b = b0
        self.mover = b0.turn
        self.sol = rec["moves"][1:]
        self._moves = None

    @property
    def moves(self):
        if self._moves is None:
            self._moves = [chess.Move.from_uci(u) for u in self.sol]
        return self._moves

    def boards(self):
        """[board before sol[0], after sol[0], ...]"""
        out = [self.b.copy(stack=False)]
        for mv in self.moves:
            bb = out[-1].copy(stack=False)
            if mv not in bb.legal_moves:
                return None
            bb.push(mv)
            out.append(bb)
        return out

    def count(self, color, ptype):
        return len(self.b.pieces(ptype, color))

    def npieces(self):
        return len(self.b.piece_map())

    def only_pawns_kings(self):
        return all(p.piece_type in (chess.PAWN, chess.KING) for p in self.b.piece_map().values())

    def no_queens_rooks(self):
        return not any(p.piece_type in (chess.QUEEN, chess.ROOK) for p in self.b.piece_map().values())

    def sig(self):
        """Material signature like 'KQP v KRP' with the mover first."""
        def s(c):
            out = "K"
            for t, ch in ((chess.QUEEN, "Q"), (chess.ROOK, "R"), (chess.BISHOP, "B"), (chess.KNIGHT, "N"), (chess.PAWN, "P")):
                out += ch * len(self.b.pieces(t, c))
            return out
        return s(self.mover) + " v " + s(not self.mover)

    def first_is_capture(self):
        return self.b.is_capture(self.moves[0])

    def first_gives_check(self):
        return self.b.gives_check(self.moves[0])

    def first_piece(self):
        return self.b.piece_type_at(self.moves[0].from_square)


def ncore(themes):
    return len([t for t in themes if t not in LENGTH_PHASE])


def n_motifs(themes):
    return len([t for t in themes if t in MOTIFS])


# ------------------------------------------------------------------------------------------------------------------
# buckets
# ------------------------------------------------------------------------------------------------------------------
BUCKETS = {}


def bucket(key, node, label, n_c3, n_c1=8, q=2, kind="find", mode="win", theme=None, order=50, use="find", plies=None, over=None, off=False):
    """Decorator: register a predicate fn(F) -> None | priority-tuple-element (lower = preferred). The rare buckets
    (small `order`) choose their puzzles first. off=True keeps the bucket registered (its old verdicts stay readable and
    reported) but nothing is selected, verified or built for it any more."""
    def deco(fn):
        BUCKETS[key] = dict(key=key, node=node, label=label, n_c3=n_c3, n_c1=n_c1, q=q, kind=kind, mode=mode, use=use, plies=plies, over=over,
                            theme=theme or key.split(":")[0].split(".")[-1], order=order, fn=fn, off=off)
        return fn
    return deco


def _mate_theme(t):
    return "mate" in t or any(x.startswith("mateIn") for x in t)


def _not_trivial(F):
    return "oneMove" not in F.themes and "mateIn1" not in F.themes and len(F.sol) >= 1


# --- attack ---------------------------------------------------------------------------------------------------------
@bucket("ATK.CASTLED:k", "ATK.CASTLED", "attack on the castled king", 34, 6, order=60, theme="kingsideAttack")
def b_castled_k(F):
    if "kingsideAttack" in F.themes and _not_trivial(F) and "exposedKing" not in F.themes and "attackingF2F7" not in F.themes:
        return 0


@bucket("ATK.CASTLED:q", "ATK.CASTLED", "attack on the castled king", 12, 3, order=40, theme="queensideAttack")
def b_castled_q(F):
    if "queensideAttack" in F.themes and _not_trivial(F):
        return 0


@bucket("ATK.CENTER", "ATK.CENTER", "attack on a king in the centre", 36, 8, order=45, theme="exposedKing")
def b_center(F):
    if not (F.themes & {"exposedKing", "attackingF2F7"}) or not _not_trivial(F):
        return None
    if not (F.themes & {"opening", "middlegame"}):
        return None
    ek = F.b.king(not F.mover)
    f, r = chess.square_file(ek), chess.square_rank(ek)
    on_back = (r in (0, 1)) if (not F.mover) == chess.WHITE else (r in (6, 7))
    if 3 <= f <= 5 and on_back and F.count(not F.mover, chess.QUEEN) + F.count(F.mover, chess.QUEEN) >= 1:
        return 0 if "attackingF2F7" in F.themes else 1


@bucket("ATK.COMMIT", "ATK.COMMIT", "direct attack that must be carried through", 32, 7, order=55, theme="commitAttack")
def b_commit(F):
    if (F.themes & (ATTACK_THEMES | {"exposedKing"})) and "sacrifice" in F.themes and len(F.sol) >= 4 and _not_trivial(F):
        return 0 if (F.themes & ATTACK_THEMES) else 1


@bucket("ATK.PACE", "ATK.PACE", "quiet strengthening move in an attack", 32, 7, order=52, theme="attackQuietMove")
def b_pace(F):
    if not (F.themes & (ATTACK_THEMES | {"exposedKing"})) or not _not_trivial(F):
        return None
    if F.first_is_capture() or F.first_gives_check() or F.moves[0].promotion:
        return None
    if F.first_piece() == chess.KING:
        return None
    return 0 if "quietMove" in F.themes else 1


@bucket("ATK.PAWNSTORM", "ATK.PAWNSTORM", "pawn lever against the enemy king", 30, 7, order=35, theme="pawnStorm")
def b_pawnstorm(F):
    if not (F.themes & {"middlegame", "opening"}) or not _not_trivial(F) or "endgame" in F.themes:
        return None
    wk, bk = F.b.king(chess.WHITE), F.b.king(chess.BLACK)
    fw, fb = chess.square_file(wk), chess.square_file(bk)
    opposite = (fw <= 2 and fb >= 5) or (fw >= 5 and fb <= 2)
    if not opposite:
        return None
    m = F.moves[0]
    if F.first_piece() != chess.PAWN or F.first_is_capture() or F.first_gives_check():
        return None
    ek = F.b.king(not F.mover)
    if abs(chess.square_file(m.to_square) - chess.square_file(ek)) > 2:
        return None
    rel = chess.square_rank(m.to_square) if F.mover == chess.WHITE else 7 - chess.square_rank(m.to_square)
    if rel < 3:
        return None
    return 0 if F.themes & ATTACK_THEMES else 1


def _greek_move(b, m):
    """Mover's bishop captures the h7 / h2 pawn with check."""
    if b.piece_type_at(m.from_square) != chess.BISHOP or not b.is_capture(m):
        return False
    tgt = chess.H7 if b.turn == chess.WHITE else chess.H2
    return m.to_square == tgt and b.gives_check(m)


@bucket("ATK.GREEKGIFT:works", "ATK.GREEKGIFT", "bishop sacrifice on h7 (Greek gift)", 30, 0, order=20, kind="find", theme="greekGift")
def b_greek_works(F):
    if _greek_move(F.b, F.moves[0]) and not (F.themes & {"mateIn1", "oneMove"}):
        return 0


@bucket("ATK.GREEKGIFT:fails", "ATK.GREEKGIFT", "bishop sacrifice on h7 (Greek gift)", 30, 0, order=21, kind="foil", theme="greekGift")
def b_greek_fails(F):
    if "endgame" in F.themes or _greek_move(F.b, F.moves[0]):
        return None
    for m in F.b.legal_moves:
        if _greek_move(F.b, m):
            return 0


# --- tactics that had no items ----------------------------------------------------------------------------------------
@bucket("TAC.UNDERPROMOTE", "TAC.UNDERPROMOTE", "underpromotion", 34, 8, q=1, order=10, mode="under", theme="underPromotion")
def b_under(F):
    m = F.moves[0]
    if m.promotion and m.promotion != chess.QUEEN:
        return 0


@bucket("TAC.PERPETUAL", "TAC.PERPETUAL", "perpetual check", 34, 8, q=1, order=12, mode="draw", theme="perpetual")
def b_perp(F):
    if "equality" not in F.themes or len(F.sol) < 3:
        return None
    bs = F.boards()
    if not bs or bs[-1].is_stalemate():
        return None
    solver_moves = [bs[i].gives_check(F.moves[i]) for i in range(0, len(F.moves), 2)]
    if len(solver_moves) >= 2 and all(solver_moves):
        return 0


def _safe_square(b, piece_color, ptype, sq):
    """After a piece of `ptype` lands on `sq` (board b with that move made), is it safe from loss? Safe = not attacked, or
    attacked only by pieces worth at least as much while defended."""
    enemy = not piece_color
    atk = b.attackers(enemy, sq)
    if not atk:
        return True
    cheaper = any(VAL[b.piece_type_at(s)] < VAL[ptype] for s in atk)
    return (not cheaper) and bool(b.attackers(piece_color, sq))


@bucket("TAC.DESPERADO", "TAC.DESPERADO", "desperado", 30, 7, q=1, order=25, theme="desperado")
def b_desp(F):
    """A piece that has no safe square (it is attacked and every retreat is also attacked) captures something before it falls,
    is recaptured, and the line goes on to a further capture."""
    if len(F.sol) < 3:
        return None
    m0, m1, m2 = F.moves[0], F.moves[1], F.moves[2]
    b = F.b
    pc = b.piece_at(m0.from_square)
    if pc is None or pc.piece_type in (chess.PAWN, chess.KING) or not b.is_capture(m0) or m1.to_square != m0.to_square:
        return None
    victim = b.piece_type_at(m0.to_square)
    if victim is None or VAL[victim] > VAL[pc.piece_type]:
        return None      # taking something worth MORE is just a good capture, not a desperado
    enemy = not F.mover
    atk = b.attackers(enemy, m0.from_square)
    if not atk:
        return None
    # the piece is in trouble where it stands: undefended, or attacked by a cheaper piece
    defended = bool(b.attackers(F.mover, m0.from_square))
    cheaper = any(VAL[b.piece_type_at(s)] < VAL[pc.piece_type] for s in atk)
    if defended and not cheaper:
        return None
    # no safe retreat: every other legal move of the piece (captures included) lands on an unsafe square
    for mv in b.legal_moves:
        if mv.from_square != m0.from_square or mv == m0:
            continue
        b.push(mv)
        safe = _safe_square(b, F.mover, pc.piece_type, mv.to_square)
        b.pop()
        if safe:
            return None
    bs = F.boards()
    if not bs or not bs[1].is_capture(m1) or not bs[2].is_capture(m2):
        return None
    return 0


@bucket("TAC.OVERLOAD", "TAC.OVERLOAD", "overloaded defender", 34, 8, q=1, order=15, theme="overload")
def b_overload(F):
    if len(F.sol) < 3:
        return None
    b = F.b
    m0, m1, m2 = F.moves[0], F.moves[1], F.moves[2]
    enemy = not F.mover
    if not b.is_capture(m0) or m1.to_square != m0.to_square:
        return None
    bs = F.boards()
    if not bs or not bs[1].is_capture(m1) or not bs[2].is_capture(m2):
        return None
    d0 = m1.from_square
    s2 = m2.to_square
    if s2 == m0.to_square:
        return None
    t2 = b.piece_at(s2)
    if t2 is None or t2.color != enemy or t2.piece_type == chess.KING:
        return None
    # D defended s2 from d0 and was its only defender; after D recaptured on s1 nobody defends s2
    if set(b.attackers(enemy, s2)) != {d0} or d0 not in b.attackers(enemy, m0.to_square):
        return None
    if VAL[t2.piece_type] < 3:
        return None
    if bs[2].attackers(enemy, s2):
        return None
    if b.piece_type_at(d0) in (chess.KING, chess.PAWN):
        return None
    return 0


@bucket("TAC.COMBO", "TAC.COMBO", "multi-motif combination", 36, 8, order=70, theme="combination")
def b_combo(F):
    nm = len(F.themes & (MOTIFS - {"sacrifice", "quietMove"}))
    if nm < 2 or len(F.sol) < 5 or not (F.themes & {"mate", "crushing", "advantage"}):
        return None
    if ncore(F.themes) > 8:
        return None
    return -nm


def _make_pattern_bucket(theme, label):
    def fn(F):
        pats = [t for t in F.themes if t in MATE_PATTERNS]
        if theme in F.themes and len(pats) <= 2 and "mateIn1" not in F.themes and len(F.sol) >= 3:
            return 0 if len(pats) == 1 else 1
    return fn


for _th, _lb in MATE_PATTERNS.items():
    _q = 2 if _th in ("anastasiaMate", "arabianMate", "hookMate", "smotheredMate", "dovetailMate", "operaMate", "pillsburysMate") else 1
    _n = {"anastasiaMate": 5, "arabianMate": 5, "bodenMate": 4, "doubleBishopMate": 4, "hookMate": 5, "smotheredMate": 5,
          "dovetailMate": 4, "operaMate": 4, "pillsburysMate": 4, "epauletteMate": 3, "cornerMate": 3, "morphysMate": 3}.get(_th, 0)
    if _n:
        bucket("TAC.MATE-PATTERNS:" + _th, "TAC.MATE-PATTERNS", _lb, _n, 1, q=_q, order=8, mode="mate", theme=_th)(_make_pattern_bucket(_th, _lb))


# --- endgames --------------------------------------------------------------------------------------------------------
@bucket("END.ZUGZWANG", "END.ZUGZWANG", "zugzwang", 36, 8, order=14, theme="zugzwang", mode="tb")
def b_zz(F):
    if "zugzwang" in F.themes and "endgame" in F.themes and F.npieces() <= 14 and "mateIn1" not in F.themes:
        return 0 if F.npieces() <= 7 else 1


@bucket("END.BREAKTHROUGH", "END.BREAKTHROUGH", "pawn breakthrough", 32, 7, order=16, theme="breakthrough", mode="tb")
def b_breakthrough(F):
    if not F.only_pawns_kings() or len(F.sol) < 3:
        return None
    m0, m1 = F.moves[0], F.moves[1]
    b = F.b
    if F.first_piece() != chess.PAWN or F.first_is_capture() or b.piece_type_at(m0.from_square) != chess.PAWN:
        return None
    bs = F.boards()
    if not bs or not bs[1].is_capture(m1) or m1.to_square != m0.to_square:
        return None
    if bs[1].piece_type_at(m0.to_square) is None:
        return None
    # the pushed pawn is taken by a pawn (a sacrifice), and the line goes on to promote or to a capture by a pawn
    if b.piece_type_at(m1.from_square) != chess.PAWN:
        return None
    npa = len(b.pieces(chess.PAWN, chess.WHITE)) + len(b.pieces(chess.PAWN, chess.BLACK))
    if npa < 4:
        return None
    return 0 if "promotion" in F.themes else 1


def _qp_signature(F):
    for c in (chess.WHITE, chess.BLACK):
        o = not c
        if (len(F.b.pieces(chess.QUEEN, c)) == 1 and not F.b.pieces(chess.ROOK, c) and not F.b.pieces(chess.BISHOP, c)
                and not F.b.pieces(chess.KNIGHT, c) and len(F.b.pieces(chess.PAWN, c)) <= 1
                and not F.b.pieces(chess.QUEEN, o) and not F.b.pieces(chess.ROOK, o) and not F.b.pieces(chess.BISHOP, o)
                and not F.b.pieces(chess.KNIGHT, o) and len(F.b.pieces(chess.PAWN, o)) in (1, 2)):
            for s in F.b.pieces(chess.PAWN, o):
                rel = chess.square_rank(s) if o == chess.WHITE else 7 - chess.square_rank(s)
                if rel >= 5:
                    return True
    return False


@bucket("END.QUEEN-PAWN", "END.QUEEN-PAWN", "queen against an advanced pawn", 36, 8, q=1, order=13, theme="queenVsPawn", mode="tb")
def b_qp(F):
    if _qp_signature(F) and not (F.themes & {"mateIn1", "oneMove"}):
        return 0


def _qvr_signature(F):
    for c in (chess.WHITE, chess.BLACK):
        o = not c
        if (len(F.b.pieces(chess.QUEEN, c)) == 1 and not F.b.pieces(chess.ROOK, c) and not F.b.pieces(chess.BISHOP, c) and not F.b.pieces(chess.KNIGHT, c)
                and len(F.b.pieces(chess.ROOK, o)) == 1 and not F.b.pieces(chess.QUEEN, o) and not F.b.pieces(chess.BISHOP, o) and not F.b.pieces(chess.KNIGHT, o)
                and len(F.b.pieces(chess.PAWN, c)) + len(F.b.pieces(chess.PAWN, o)) <= 2):
            return True
    return False


@bucket("END.THEORY.QvR", "END.THEORY.QvR", "queen against rook", 30, 7, q=1, order=17, theme="queenVsRook", mode="tb")
def b_qvr(F):
    if _qvr_signature(F) and not (F.themes & {"mateIn1", "oneMove"}):
        return 0


@bucket("END.MINOR", "END.MINOR", "minor-piece ending", 36, 8, order=65, theme="minorEnding", mode="tb")
def b_minor(F):
    if not (F.themes & {"bishopEndgame", "knightEndgame"}) or "mateIn1" in F.themes:
        return None
    if not F.no_queens_rooks():
        return None
    return 0 if F.npieces() <= 7 else 1


@bucket("END.ROOK-ACTIVE", "END.ROOK-ACTIVE", "rook ending", 36, 8, order=66, theme="rookEnding", mode="tb")
def b_rook(F):
    if "rookEndgame" not in F.themes or "mateIn1" in F.themes:
        return None
    if any(p.piece_type in (chess.QUEEN, chess.BISHOP, chess.KNIGHT) for p in F.b.piece_map().values()):
        return None
    return 0 if F.npieces() <= 7 else 1


def _rp_signature(F):
    """K+R v K+R+P with the mover the side WITHOUT the pawn (in the Lichess data the solver is always that side).
    Returns the pawn's relative rank (0-based from the pawn side's first rank), or None."""
    w = F.b
    if F.npieces() != 5 or len(w.pieces(chess.ROOK, WHITE)) != 1 or len(w.pieces(chess.ROOK, BLACK)) != 1:
        return None
    for c in (chess.WHITE, chess.BLACK):
        if len(w.pieces(chess.PAWN, c)) == 1 and not w.pieces(chess.PAWN, not c) and c != F.mover:
            (ps,) = list(w.pieces(chess.PAWN, c))
            return chess.square_rank(ps) if c == chess.WHITE else 7 - chess.square_rank(ps)
    return None


WHITE, BLACK = chess.WHITE, chess.BLACK


# END.LUCENA and END.PHILIDOR: switched off after the tablebase stage. In the Lichess data the solver in K+R v K+R+P positions
# always wins by a tactic (a skewer or fork that takes the rook): 95 of 96 selected puzzles were tablebase WINS for the side to move,
# not the defensive Lucena / Philidor technique the node teaches. The puzzle database cannot supply those positions [V, measured here].
@bucket("END.LUCENA", "END.LUCENA", "rook and pawn on the seventh (defending side)", 30, 7, q=1, order=18, theme="lucena", mode="tbhold", off=True)
def b_lucena(F):
    if "mateIn1" in F.themes or "rookEndgame" not in F.themes:
        return None
    if _rp_signature(F) == 6:
        return 0


@bucket("END.PHILIDOR", "END.PHILIDOR", "rook ending defence", 30, 7, q=1, order=19, theme="philidor", mode="tbhold", off=True)
def b_phil(F):
    if "mateIn1" in F.themes or "rookEndgame" not in F.themes:
        return None
    if _rp_signature(F) in (4, 5):
        return 0


@bucket("END.KING-ACTIVE", "END.KING-ACTIVE", "active king in an ending", 34, 8, order=68, theme="kingActive", mode="tb")
def b_kact(F):
    if "endgame" not in F.themes or "mateIn1" in F.themes or not F.no_queens_rooks():
        return None
    if F.first_piece() != chess.KING or F.npieces() > 12 or len(F.sol) < 3:
        return None
    return 0 if F.npieces() <= 7 else 1


# --- defence ----------------------------------------------------------------------------------------------------------
@bucket("DEF.RESOURCES", "DEF.RESOURCES", "defensive resource", 34, 8, q=1, order=75, mode="hold", theme="defensiveMove")
def b_defres(F):
    if "defensiveMove" in F.themes and "equality" not in F.themes and _not_trivial(F):
        return 0


@bucket("DEF.RESOURCES:eq", "DEF.RESOURCES", "defensive resource", 30, 7, q=1, order=30, mode="hold", theme="equality")
def b_defeq(F):
    if "equality" in F.themes and _not_trivial(F) and len(F.sol) >= 1:
        bs = F.boards()
        if bs and not bs[-1].is_stalemate():
            return 0


@bucket("DEF.COUNTER", "DEF.COUNTER", "counter-attack", 32, 7, order=28, theme="counterAttack", mode="win")
def b_counter(F):
    """The opponent would mate in one if the mover passed, and the mover's best answer is a forcing counter (it checks)."""
    if not F.first_gives_check() or len(F.sol) < 2:
        return None
    b = F.b
    if b.is_check():
        return None
    nb = b.copy(stack=False)
    nb.push(chess.Move.null())
    for m in nb.legal_moves:
        nb.push(m)
        mated = nb.is_checkmate()
        nb.pop()
        if mated:
            return 0
    return None


def _trade(F):
    m = F.moves[0]
    b = F.b
    if not b.is_capture(m):
        return False
    a = b.piece_type_at(m.from_square)
    c = b.piece_type_at(m.to_square)
    if c is None or a in (chess.KING, chess.PAWN):
        return False
    return VAL[a] == VAL[c] and VAL[a] >= 3


@bucket("DEF.TRADES", "DEF.TRADES", "defensive exchange", 34, 8, q=1, order=60, mode="hold", theme="defensiveTrade")
def b_trades(F):
    if not (F.themes & {"defensiveMove", "equality"}) or len(F.sol) < 2 or "endgame" in F.themes:
        return None
    if _trade(F) and F.moves[1].to_square == F.moves[0].to_square:
        return 0


# DEF.FORTRESS (first version, off): selected "equality or defensiveMove" endgames; the tablebase stage showed that all 48 puzzles
# picked (strict quality class first, so the tag "defensiveMove" + "crushing") were WINS for the side to move, not draws. Replaced by
# DEF.FORTRESS:eq below, which requires the Lichess tag "equality" (the solver's line holds the balance).
@bucket("DEF.FORTRESS", "DEF.FORTRESS", "holding a draw while behind in material", 30, 7, q=1, order=22, mode="tbdraw", theme="fortress", off=True)
def b_fortress(F):
    if "endgame" not in F.themes or F.npieces() > 7 or not (F.themes & {"equality", "defensiveMove"}):
        return None
    def mat(c):
        return sum(VAL[p.piece_type] for p in F.b.piece_map().values() if p.color == c)
    if mat(F.mover) <= mat(not F.mover) - 2 and "mateIn1" not in F.themes and not F.first_is_capture() and not F.moves[0].promotion:
        return 0


@bucket("DEF.FORTRESS:eq", "DEF.FORTRESS", "holding a draw while behind in material", 30, 7, q=1, order=22, mode="tbdraw", theme="fortress")
def b_fortress_eq(F):
    """Endgame with 7 pieces or fewer, Lichess tag 'equality' (the solver holds the balance), the solver at least two points behind."""
    if "endgame" not in F.themes or "equality" not in F.themes or F.npieces() > 7:
        return None
    def mat(c):
        return sum(VAL[p.piece_type] for p in F.b.piece_map().values() if p.color == c)
    if mat(F.mover) <= mat(not F.mover) - 2 and "mateIn1" not in F.themes and not F.first_is_capture() and not F.moves[0].promotion:
        return 0


# --- initiative -------------------------------------------------------------------------------------------------------
@bucket("INI.INITIATIVE", "INI.INITIATIVE", "keeping the initiative", 34, 8, order=62, theme="initiative", mode="win")
def b_init(F):
    if len(F.sol) < 5 or not (F.themes & {"advantage", "crushing"}) or "mate" in F.themes or _mate_theme(F.themes):
        return None
    if not (F.themes & {"middlegame", "opening"}):
        return None
    bs = F.boards()
    if not bs:
        return None
    # the initiative is carried by checks: at least half of the solver's moves give check, and there are at least three of them
    nsm = (len(F.moves) + 1) // 2
    checks = sum(1 for i in range(0, len(F.moves), 2) if bs[i].gives_check(F.moves[i]))
    if nsm >= 3 and checks * 2 >= nsm and not bs[-1].is_checkmate():
        return 0 if checks >= 3 else 1


# --- sacrifice (extra) ------------------------------------------------------------------------------------------------
@bucket("SAC.TYPES", "SAC.TYPES", "sacrifice", 34, 8, order=58, theme="sacrifice")
def b_sac(F):
    if "sacrifice" in F.themes and _not_trivial(F) and not (F.themes & ATTACK_THEMES):
        return 0 if ncore(F.themes) <= 5 else 1


# --- castling puzzles (FND.SPECIAL) -----------------------------------------------------------------------------------
@bucket("FND.SPECIAL", "FND.SPECIAL", "castling is the move", 25, 6, q=1, order=9, theme="castling")
def b_castling(F):
    if "castling" in F.themes and F.b.is_castling(F.moves[0]):
        return 0


# --- stalemate tricks: filled by l2_stale_scan.py (engine principal variations), registered here for selection ---------------
@bucket("TAC.STALEMATE-TRICK", "TAC.STALEMATE-TRICK", "stalemate as a resource", 30, 6, q=1, order=11, mode="draw", theme="stalemateTrick")
def b_stale(F):
    return None


# --- decision items built from the same puzzle machinery: "is this the best move?" ------------------------------------------
def _tempting(F):
    return (F.first_is_capture() or F.first_gives_check()) and len(F.sol) >= 2 and not (F.themes & {"mateIn1", "oneMove"})


@bucket("ATK.SUPERIORITY", "ATK.SUPERIORITY", "attack now or not", 30, 0, order=61, use="predict", theme="attackDecision", over=2.4)
def b_sup(F):
    if (F.themes & ATTACK_THEMES) and _tempting(F) and ncore(F.themes) <= 6:
        return 0


@bucket("SAC.TYPES:p", "SAC.TYPES", "sacrifice: does it work", 26, 0, order=59, use="predict", theme="sacrifice", over=2.4)
def b_sacp(F):
    if "sacrifice" in F.themes and not (F.themes & ATTACK_THEMES) and _tempting(F) and ncore(F.themes) <= 6:
        return 0


TACTICAL = {"fork", "pin", "skewer", "discoveredAttack", "hangingPiece", "trappedPiece", "deflection", "attraction", "clearance",
            "intermezzo", "xRayAttack", "interference", "capturingDefender", "doubleCheck"}


@bucket("CAL.DEFENSE", "CAL.DEFENSE", "does the first-choice move survive the best defence", 36, 0, order=63, use="predict", theme="bestDefence", over=2.4)
def b_caldef(F):
    if (F.themes & TACTICAL) and (F.themes & {"advantage", "crushing"}) and _tempting(F) and ncore(F.themes) <= 5:
        return 0


@bucket("CAL.COMPARE", "CAL.COMPARE", "which of two moves is better", 30, 0, order=64, use="compare", theme="compareMoves", over=2.4)
def b_calcmp(F):
    if (F.themes & TACTICAL) and (F.themes & {"advantage", "crushing"}) and _tempting(F) and ncore(F.themes) <= 5:
        return 0


# --- whole-line entry (mode.variation) ----------------------------------------------------------------------------------------
def _line_ok(F, plies):
    if len(F.sol) != plies or (F.themes & {"oneMove", "mateIn1"}):
        return False
    return bool(F.themes & {"mate", "crushing", "advantage"})


@bucket("CAL.CANDIDATES", "CAL.CANDIDATES", "line of three plies", 30, 6, order=70, use="line", plies=3, theme="line3", over=2.2)
def b_line3(F):
    if _line_ok(F, 3):
        return 0 if "mate" in F.themes else 1


@bucket("CAL.TREE", "CAL.TREE", "line of five plies", 30, 6, order=71, use="line", plies=5, theme="line5", over=2.2)
def b_line5(F):
    if _line_ok(F, 5):
        return 0 if "mate" in F.themes else 1


@bucket("CAL.BLIND", "CAL.BLIND", "blindfold line", 30, 0, order=72, use="line", plies=5, theme="blind", over=2.2)
def b_blind(F):
    if _line_ok(F, 5) or _line_ok(F, 7):
        return 0 if "mate" in F.themes else 1


@bucket("CAL.ENDURANCE", "CAL.ENDURANCE", "long line", 26, 0, order=73, use="line", plies=9, theme="longLine", over=2.4)
def b_line9(F):
    if _line_ok(F, 7) or _line_ok(F, 9):
        return 0 if "mate" in F.themes else 1


# --- how deep (find_move on long forced mates; the claim is mate_in n at the engine's depth) --------------------------------------
def _mate_n(F, n):
    return f"mateIn{n}" in F.themes and len(F.sol) == 2 * n - 1 and ncore(F.themes) <= 5 and "endgame" not in F.themes


@bucket("CAL.DEPTH:4", "CAL.DEPTH", "forced mate in four moves", 18, 4, order=69, mode="mate", theme="mateIn4")
def b_depth4(F):
    if _mate_n(F, 4):
        return 0


@bucket("CAL.DEPTH:5", "CAL.DEPTH", "forced mate in five moves", 12, 3, order=69, mode="mate", theme="mateIn5")
def b_depth5(F):
    if _mate_n(F, 5):
        return 0


# --- visualisation drills (rules only; no engine): positions where a hidden piece changes a piece's reach -------------------------
def viz_candidates(b, min_relevant=1):
    """[(from_square, dests, [relevant hidden squares])] for the mover's bishops, rooks, queens and knights."""
    out = []
    if b.is_check():
        return out
    for sq, pc in b.piece_map().items():
        if pc.color != b.turn or pc.piece_type not in (chess.BISHOP, chess.ROOK, chess.QUEEN, chess.KNIGHT):
            continue
        if b.is_pinned(b.turn, sq):
            continue
        S = sorted(chess.square_name(m.to_square) for m in b.legal_moves if m.from_square == sq)
        if not (3 <= len(S) <= 12):
            continue
        rel = []
        for h, hp in b.piece_map().items():
            if h == sq or hp.piece_type == chess.KING:
                continue
            b2 = b.copy(stack=False)
            b2.remove_piece_at(h)
            if not b2.is_valid():
                continue
            S2 = sorted(chess.square_name(m.to_square) for m in b2.legal_moves if m.from_square == sq)
            if S2 != S:
                rel.append(chess.square_name(h))
        if len(rel) >= min_relevant:
            out.append((chess.square_name(sq), S, rel))
    return out


@bucket("CAL.VISUALIZE", "CAL.VISUALIZE", "reach with hidden pieces", 30, 0, order=74, kind="viz", use="viz", theme="visualise", over=1.6)
def b_viz(F):
    if "middlegame" in F.themes and 14 <= F.npieces() <= 28 and viz_candidates(F.b):
        return 0


# ------------------------------------------------------------------------------------------------------------------
# string-level prefilters (so that python-chess runs only on plausible rows)
# ------------------------------------------------------------------------------------------------------------------
def hash_frac(pid):
    import hashlib
    return int(hashlib.md5((str(L2_SEED) + pid).encode()).hexdigest()[:8], 16) / 0xFFFFFFFF


def _fen_rank(fen, i):
    return fen.split()[0].split("/")[i]


def _pre_greek_fails(r):
    return "middlegame" in r["themes"] or "opening" in r["themes"]


PRE = {
    "ATK.CASTLED:k": lambda r: "kingsideAttack" in r["themes"],
    "ATK.CASTLED:q": lambda r: "queensideAttack" in r["themes"],
    "ATK.CENTER": lambda r: bool(r["themes"] & {"exposedKing", "attackingF2F7"}),
    "ATK.COMMIT": lambda r: "sacrifice" in r["themes"] and bool(r["themes"] & (ATTACK_THEMES | {"exposedKing"})),
    "ATK.PACE": lambda r: bool(r["themes"] & (ATTACK_THEMES | {"exposedKing"})),
    "ATK.PAWNSTORM": lambda r: "middlegame" in r["themes"] and bool(r["themes"] & {"advantage", "crushing", "mate"}),
    "ATK.GREEKGIFT:works": lambda r: r["moves"][1][2:4] in ("h7", "h2"),
    "ATK.GREEKGIFT:fails": lambda r: ("middlegame" in r["themes"] or "opening" in r["themes"]) and (_fen_rank(r["fen"], 1).endswith("p") or _fen_rank(r["fen"], 6).endswith("P")),
    "TAC.UNDERPROMOTE": lambda r: "underPromotion" in r["themes"] or len(r["moves"][1]) == 5,
    "TAC.PERPETUAL": lambda r: "equality" in r["themes"],
    "TAC.DESPERADO": lambda r: len(r["moves"]) >= 4 and r["moves"][1][2:4] == r["moves"][2][2:4],
    "TAC.OVERLOAD": lambda r: len(r["moves"]) >= 4 and r["moves"][1][2:4] == r["moves"][2][2:4],
    "TAC.COMBO": lambda r: len(r["themes"] & (MOTIFS - {"sacrifice", "quietMove"})) >= 2 and len(r["moves"]) >= 6,
    "END.ZUGZWANG": lambda r: "zugzwang" in r["themes"] and "endgame" in r["themes"],
    "END.BREAKTHROUGH": lambda r: "pawnEndgame" in r["themes"],
    "END.QUEEN-PAWN": lambda r: "queenEndgame" in r["themes"] or "endgame" in r["themes"],
    "END.THEORY.QvR": lambda r: "queenRookEndgame" in r["themes"] or "endgame" in r["themes"],
    "END.MINOR": lambda r: bool(r["themes"] & {"bishopEndgame", "knightEndgame"}),
    "END.ROOK-ACTIVE": lambda r: "rookEndgame" in r["themes"],
    "END.LUCENA": lambda r: "rookEndgame" in r["themes"],
    "END.PHILIDOR": lambda r: "rookEndgame" in r["themes"],
    "END.KING-ACTIVE": lambda r: "endgame" in r["themes"],
    "DEF.RESOURCES": lambda r: "defensiveMove" in r["themes"],
    "DEF.RESOURCES:eq": lambda r: "equality" in r["themes"],
    "DEF.COUNTER": lambda r: bool(r["themes"] & {"mate", "advantage", "crushing"}) and len(r["moves"]) >= 3 and hash_frac(r["id"]) < 0.35,
    "DEF.TRADES": lambda r: bool(r["themes"] & {"defensiveMove", "equality"}),
    "DEF.FORTRESS": lambda r: "endgame" in r["themes"] and bool(r["themes"] & {"equality", "defensiveMove"}),
    "INI.INITIATIVE": lambda r: bool(r["themes"] & {"advantage", "crushing"}) and len(r["moves"]) >= 6 and "mate" not in r["themes"],
    "SAC.TYPES": lambda r: "sacrifice" in r["themes"],
    "FND.SPECIAL": lambda r: "castling" in r["themes"],
}
_ATTACK = lambda r: bool(r["themes"] & ATTACK_THEMES)
_TACT = lambda r: bool(r["themes"] & {"fork", "pin", "skewer", "discoveredAttack", "hangingPiece", "trappedPiece", "deflection", "attraction", "clearance", "intermezzo", "xRayAttack", "interference", "capturingDefender", "doubleCheck"})
PRE.update({
    "TAC.STALEMATE-TRICK": lambda r: False,
    # the predict / compare / line / viz pools are huge and uniform: a seeded 5-15 % sample of the database is plenty
    "ATK.SUPERIORITY": lambda r: bool(r["themes"] & ATTACK_THEMES) and hash_frac(r["id"]) < 0.15,
    "SAC.TYPES:p": lambda r: "sacrifice" in r["themes"] and not (r["themes"] & ATTACK_THEMES) and hash_frac(r["id"]) < 0.15,
    "CAL.DEFENSE": lambda r: _TACT(r) and hash_frac(r["id"]) < 0.06,
    "CAL.COMPARE": lambda r: _TACT(r) and hash_frac(r["id"] + "c") < 0.06,
    "CAL.CANDIDATES": lambda r: len(r["moves"]) == 4 and hash_frac(r["id"]) < 0.04,
    "CAL.TREE": lambda r: len(r["moves"]) == 6 and hash_frac(r["id"]) < 0.06,
    "CAL.BLIND": lambda r: len(r["moves"]) in (6, 8) and hash_frac(r["id"]) < 0.06,
    "CAL.ENDURANCE": lambda r: len(r["moves"]) in (8, 10) and hash_frac(r["id"]) < 0.12,
    "CAL.VISUALIZE": lambda r: "middlegame" in r["themes"] and hash_frac(r["id"]) < 0.01,
    "DEF.FORTRESS:eq": lambda r: "endgame" in r["themes"] and "equality" in r["themes"],
    "CAL.DEPTH:4": lambda r: "mateIn4" in r["themes"] and hash_frac(r["id"]) < 0.3,
    "CAL.DEPTH:5": lambda r: "mateIn5" in r["themes"] and hash_frac(r["id"]) < 0.5,
})
for _th in MATE_PATTERNS:
    PRE["TAC.MATE-PATTERNS:" + _th] = (lambda th: (lambda r: th in r["themes"]))(_th)


def bin7(r):
    for i in range(1, len(BIN_EDGES) - 1):
        if r < BIN_EDGES[i]:
            return i - 1
    return 6


# ------------------------------------------------------------------------------------------------------------------
# what already exists in content/items (so ids and positions never collide)
# ------------------------------------------------------------------------------------------------------------------
def existing_content():
    puzzle_ids, item_ids, pos_ids, fen_keys = set(), set(), set(), set()
    for p in sorted(ITEMS_DIR.glob("*.json")):
        if p.name.startswith(PREFIX):
            continue
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            continue
        for ps in d.get("positions", []):
            pos_ids.add(ps["id"])
            fen_keys.add(" ".join(ps["fen"].split()[:4]))
            if ps["id"].startswith("PL-"):
                puzzle_ids.add(ps["id"][3:])
        for it in d.get("items", []):
            item_ids.add(it["id"])
            s = it.get("source") or {}
            if s.get("kind") == "lichess_puzzle" and s.get("id"):
                puzzle_ids.add(s["id"])
    return puzzle_ids, item_ids, pos_ids, fen_keys
