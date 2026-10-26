"""Coverage audit: does the skill graph have a home for each topic a standard chess syllabus covers?

    python tools/coverage_audit.py

The topic list below is a plain list of topic names written from memory of what beginner-to-advanced courses, club curricula and
classic texts cover [R: recalled, not copied from any one source]. Each topic is matched by keywords against skill titles and depth
outcomes. A topic with no match is a candidate gap to read by hand: a keyword miss is not proof of a missing skill."""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import json
from engine import ROOT

TOPICS = {
 "Rules and basics": ["notation", "castl", "en passant", "promot", "stalemate", "draw"],
 "Piece values and trades": ["value", "exchange", "trade"],
 "Basic mates": ["queen", "rook", "bishop and knight", "two bishops", "back rank", "smothered"],
 "Tactics": ["fork", "pin", "skewer", "discover", "double check", "deflect", "decoy", "overload", "remove the defender", "interfere", "x-ray", "zwischenzug", "intermezzo", "clearance", "trapped", "desperado", "perpetual"],
 "Opening principles": ["development", "center", "tempo", "castle early", "traps", "repertoire", "transposition", "pawn structure"],
 "Middlegame strategy": ["outpost", "open file", "seventh rank", "weak square", "bishop pair", "good and bad bishop", "knight versus bishop", "space", "initiative", "prophylaxis", "restrain", "plan", "minority attack", "pawn break", "isolated", "backward", "doubled", "hanging pawns", "passed pawn", "pawn majority", "blockade", "overprotect", "exchange sacrifice", "compensation", "dynamic"],
 "Attack and defence": ["king attack", "castled king", "pawn storm", "greek gift", "sacrifice", "defend", "counter", "fortress", "shelter"],
 "Calculation": ["candidate", "visual", "tree", "blindfold", "depth", "forcing"],
 "Pawn endgames": ["opposition", "key square", "square of the pawn", "triangulation", "outside passed", "breakthrough", "pawn race", "zugzwang", "rook pawn"],
 "Rook endgames": ["lucena", "philidor", "rook behind", "active rook", "cut off", "rook and pawn"],
 "Minor-piece and other endgames": ["wrong bishop", "bishop endgame", "knight endgame", "queen versus pawn", "queen versus rook", "two knights", "opposite-colour", "tablebase"],
 "Practical play": ["time", "clock", "pressure", "resign", "blunder", "converting", "technique", "simplif"],
 "Study methods": ["game review", "analysis", "own games", "opening preparation", "notebook", "error log", "plan"],
 "Famous-game and history study": ["famous game", "classic game", "master game", "history"],
}
skills = [json.loads(f.read_text(encoding="utf-8")) for f in sorted((ROOT / "content" / "skills").glob("*.json"))]
lessons = [json.loads(f.read_text(encoding="utf-8")) for f in sorted((ROOT / "content" / "lessons").glob("*.json"))]
hay = []
for s in skills: hay.append((s["id"], (s["title"] + " " + " ".join(d.get("outcome", "") for d in s.get("depths", {}).values())).lower()))
for l in lessons: hay.append((l["id"], l["title"].lower()))
gaps = 0
for area, topics in TOPICS.items():
    miss = [t for t in topics if not any(t in h for _, h in hay)]
    gaps += len(miss)
    print(f"{area}: {len(topics) - len(miss)}/{len(topics)} matched" + (f"; no match for: {', '.join(miss)}" if miss else ""))
print(f"{gaps} topics with no keyword match (candidates to read by hand)")
