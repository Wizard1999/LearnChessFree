"""Task B audit: can a learner tell 'quiet' from 'tactic' by cheap surface features alone?

For every classify item in content/items/quiet-*.json compute rules-only features of the position and report, per feature,
the AUC for separating tactic-exists from no-tactic (0.5 = no information, 1.0/0.0 = perfectly separable). Features that
a good player legitimately uses (loose enemy pieces, available captures/checks) are *expected* to carry some signal;
ply and material are matched by construction and should sit near 0.5.
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json, statistics
import chess
from common import *

VAL = {chess.PAWN: 1, chess.KNIGHT: 3, chess.BISHOP: 3, chess.ROOK: 5, chess.QUEEN: 9, chess.KING: 0}


def feats(fen):
    b = chess.Board(fen); me = b.turn
    mat = lambda c: sum(VAL[p.piece_type] for p in b.piece_map().values() if p.color == c)
    caps = sum(1 for m in b.legal_moves if b.is_capture(m))
    checks = sum(1 for m in b.legal_moves if b.gives_check(m))
    def loose(c): return sum(1 for s, p in b.piece_map().items() if p.color == c and p.piece_type != chess.KING and b.attackers(not c, s) and not b.attackers(c, s))
    def attacked(c): return sum(1 for s, p in b.piece_map().items() if p.color == c and p.piece_type != chess.KING and b.attackers(not c, s))
    return dict(ply=b.ply(), pieces=len(b.piece_map()), material_total=mat(True) + mat(False), material_diff_abs=abs(mat(me) - mat(not me)),
                legal_moves=b.legal_moves.count(), captures_available=caps, checks_available=checks,
                loose_enemy=loose(not me), loose_own=loose(me), attacked_enemy=attacked(not me), attacked_own=attacked(me))


def auc(pos, neg):
    """P(pos > neg) + 0.5 P(tie)."""
    s = 0.0
    for a in pos:
        for b in neg:
            s += 1.0 if a > b else 0.5 if a == b else 0.0
    return s / (len(pos) * len(neg))


def main():
    rows = {"tactic": [], "quiet": []}
    for f in sorted(ITEMS_DIR.glob("quiet-*.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        pos = {p["id"]: p for p in d["positions"]}
        for it in d["items"]:
            cls = "quiet" if it["answer"]["class"].startswith("No tactic") else "tactic"
            rows[cls].append(feats(pos[it["position"]]["fen"]))
    print(f"n quiet {len(rows['quiet'])}, n tactic {len(rows['tactic'])}")
    print("| feature | mean quiet | mean tactic | AUC(tactic > quiet) |")
    print("|---|---|---|---|")
    out = {}
    for k in rows["quiet"][0]:
        q = [r[k] for r in rows["quiet"]]; t = [r[k] for r in rows["tactic"]]
        a = auc(t, q)
        out[k] = dict(mean_quiet=statistics.fmean(q), mean_tactic=statistics.fmean(t), auc=a)
        print(f"| {k} | {statistics.fmean(q):.2f} | {statistics.fmean(t):.2f} | {a:.2f} |")
    write_json(OUT / "quiet_audit.json", out)


if __name__ == "__main__":
    main()
