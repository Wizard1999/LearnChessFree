"""Generator driver and generic contrast-pair builder shared by the gen_*.py modules."""
import random
from collections import Counter

import chess
import pcommon as C
from pcommon import mk

YN = ["yes", "no"]


def random_for(rec, salt=""):
    return random.Random(f"{rec['g']}-{rec['p']}-{salt}")


class Driver:
    """Runs a template over a list of candidate index records until its quota is met. At most `per_game` items per game."""

    def __init__(self, B):
        self.B = B
        self.used = Counter()
        self.made = Counter()

    def run(self, name, recs, quota, make, per_game=2):
        """make(rec, board) -> list of (board, item, provenance, label) or None"""
        for rec in recs:
            if self.made[name] >= quota:
                break
            if self.used[rec["g"]] >= per_game:
                continue
            board = chess.Board(rec["fen"])
            out = make(rec, board)
            if not out:
                continue
            ids = []
            for (b, item, prov, label) in out:
                ids.append(self.B.add(b, C.fam(rec), item, prov, label=label))
            if ids and ids[0]:
                self.made[name] += 1
                self.used[rec["g"]] += 1
            if len(out) == 2 and (ids[0] is None) != (ids[1] is None):
                self.B.items[-1].pop("contrast_group", None)       # an orphan: its sibling was rejected


def pair_make(name, cands_fn, feature_fn, kinds, q_text, skill, cl_for, why_for, nodes, hints, cue=1, extra_tags=(), edit_ok=None, edit_fn=None):
    """Near-miss pair: the base position has feature(board, c, s) true; a one-pawn edit (push or sideways shift) of another pawn makes it
    false while the pawn (or square) s stays. Both items ask the same yes/no question; base answers yes, the edit answers no.
      cands_fn(rec, board) -> [(colour, square_name)]; feature_fn(board, colour, square_name) -> bool
      q_text(c, s) -> prompt; cl_for(board, c, s) -> Cl; why_for(board, c, s, yes) -> str; hints(c, s) -> list of 3
      edit_ok(base, edited, c, s) -> bool (optional extra condition on the edit)
      edit_fn(board, c, s) -> iterable of (description, edited_board) replaces the default one-pawn edits (e.g. a piece swap)"""
    def make(rec, board):
        rng = random_for(rec, name)
        cands = list(cands_fn(rec, board))
        rng.shuffle(cands)
        for c, s in cands[:6]:
            if not feature_fn(board, c, s):
                continue
            edits = ((d_, nb_) for (d_, _a, _b, nb_) in C.pawn_edits(board, avoid=[s] if s else [], kinds=kinds)) if edit_fn is None else edit_fn(board, c, s)
            for desc, nb in edits:
                if s:
                    sq = chess.parse_square(s)
                    if nb.piece_at(sq) != board.piece_at(sq):
                        continue
                if feature_fn(nb, c, s):
                    continue
                if edit_ok and not edit_ok(board, nb, c, s):
                    continue
                cg = f"CG-PP-{name}-{rec['g']}-{rec['p']}"
                text = q_text(c, s)
                ia = mk(skill, cue, "predict_outcome", text, {"outcome": "yes"}, cl_for(board, c, s), nodes, hints(c, s),
                        why_for(board, c, s, True), C.fam(rec), options=YN, tpl=f"pair-{name}", contrast_group=cg,
                        extra=("contrast.working",) + tuple(extra_tags))
                ib = mk(skill, cue, "predict_outcome", text, {"outcome": "no"}, cl_for(nb, c, s), nodes, hints(c, s),
                        why_for(nb, c, s, False), C.fam(rec), options=YN, tpl=f"pair-{name}", contrast_group=cg,
                        extra=("contrast.failing",) + tuple(extra_tags))
                return [(board, ia, C.prov(rec), f"pair-{name}"), (nb, ib, C.edit_prov(rec, desc), f"pair-{name}")]
        return None
    return make


def number_options(rng, correct, lo=0, hi=12, k=4):
    """k distinct integer options around `correct`, sorted ascending, as strings"""
    pool = [x for x in range(max(lo, correct - 3), min(hi, correct + 3) + 1) if x != correct]
    rng.shuffle(pool)
    vals = sorted([correct] + pool[:k - 1])
    return [str(v) for v in vals]
