"""Builds content/lessons/L-HI-ENGINES-HUMANS-4.json and content/items/lesson-hi-l-hi-engines-humans-4.json.
Every position is made by replaying real move sequences with python-chess (provenance: the prefix strings below) or is a FEN copied from the
engine study of January 2013 Lichess games (see README.md). Lines are replayed and checked for legality here; claims are checked by
tools/validate_lessons.py and tools/validate.py. Run: ./tools/.venv/Scripts/python.exe -I tools/analysis/hi_engines4/build_lesson.py
"""
import json
from pathlib import Path
import chess

ROOT = Path(__file__).resolve().parents[3]
ID = "L-HI-ENGINES-HUMANS-4"


def fen_of(spec):
    if "/" in spec:
        return chess.Board(spec).fen()
    b = chess.Board()
    for t in spec.split():
        b.push_san(t)
    return b.fen()


def line(spec, moves):
    b = chess.Board(fen_of(spec))
    out = []
    for san, say in moves:
        mv = b.parse_san(san)
        out.append({"move": mv.uci(), "say": say})
        b.push(mv)
    return out


def uci(spec, san):
    return chess.Board(fen_of(spec)).parse_san(san).uci()


def C(i, t, statement, **p):
    return {"id": f"C{i}", "type": t, "params": p, "statement": statement}


def card(text):
    return {"type": "card", "text": text}


def board(spec, caption, moves=None, claims=None, highlight=None, arrows=None):
    s = {"type": "board", "fen": fen_of(spec), "caption": caption}
    if moves:
        s["line"] = line(spec, moves)
    if arrows:
        s["arrows"] = [{"from": a, "to": b} for a, b in arrows]
    if highlight:
        s["highlight"] = highlight
    s["claims"] = claims or []
    return s


def reflect(prompt, fields, kind="expect"):
    return {"type": "reflect", "kind": kind, "prompt": prompt, "fields": [{"id": a, "label": b} for a, b in fields]}


def best(spec, san_list, within=40, text=None):
    return C(1, "best_move_in", text or "The engine (depth 16) prefers this move.", moves=[uci(spec, m) for m in san_list], within_cp=within)


def loses(i, spec, san, cp, text=None):
    return C(i, "move_loses", text or f"{san} is at least {cp} centipawns worse than the best move.", move=uci(spec, san), cp=cp)


# ---------------------------------------------------------------- positions
HOOK = "e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5"
HOOK_B = HOOK + " Na5 Bb5+"
FL1 = HOOK + " Nxd5 Nxf7"            # Black to move after the knight sacrifice
FL2 = FL1 + " Kxf7 Qf3+"              # Black to move, king in check
FL3 = FL2 + " Ke6 Nc3"                # Black to move
D4TRAP = "e4 e5 d4 Nc6 d5"
QF6 = "e4 e5 Nf3 Qf6 Nc3"
PR0 = "rn2kb1r/pp3ppp/2p1pn2/q6b/2BP4/2N2N1P/PPP2PP1/R1BQ1RK1 w kq - 1 9"
PR_BD2 = "rn2kb1r/pp3ppp/2p1pn2/q6b/2BP4/2N2N1P/PPPB1PP1/R2Q1RK1 b kq - 2 9"
PR_G4 = "rn2kb1r/pp3ppp/2p1pn2/q6b/2BP2P1/2N2N1P/PPP2P2/R1BQ1RK1 b kq - 0 9"
NG3 = "r1b1r1k1/1pp2pp1/p1n1p2p/2b2q2/P1B1N3/4PN2/2Q2PPP/1R1R2K1 w - - 2 21"
RXD7 = "2kr1r2/pppQ2pp/8/4p3/1PP1P3/P2P3P/1N4P1/5R1K b - - 0 22"
QB7 = "rnR5/5k1p/p3p1p1/4p3/2Np4/3P4/2PKNP2/7q b - - 7 28"
QB7_AFTER = fen_of(QB7)
_b = chess.Board(QB7_AFTER); _b.push_san("Qb7"); QB7_AFTER = _b.fen()
T1 = "d4 d5 c4 dxc4 Nc3 Nc6 d5"
T2 = "e4 d5 exd5 Qxd5 Nc3 Qe6+ Be2 Nc6 Nf3"
T3 = "e4 e5 Nf3 f6 Nc3"
# classification items: (fen, played san, kind)
CLS = [
    ("1n2k2r/p4ppp/3pb3/4p3/3P4/5N2/q2BQPPP/2R3K1 b k - 0 17", "Nc6", "loose"),
    ("r3kb1r/ppp2pp1/2n2n1p/8/3q4/6PB/PP1P1P1P/RNBQ1RK1 w kq - 0 10", "b3", "loose"),
    ("r2qk3/2p5/p1npp3/1p2p1rR/4P3/N1PP1Q2/PP3PP1/2KR4 b q - 0 19", "Qe7", "missed"),
    ("rn1k3r/pp4pp/4b3/3p1p2/2P5/5N2/PP3PPP/3RKB1R b - - 0 14", "Nc6", "quiet"),
]
BEST = {7: "g5h5", 8: "h8e8"}
PIECE = {7: "R"}

# ---------------------------------------------------------------- steps
S = []
A = S.append

# hook
A(board(HOOK,
        "Black to move after five moves of a well-known opening. Black can take the pawn back with the knight on f6, or send the other knight to a5. Which do most players choose, and which does the engine prefer? Decide first.",
        claims=[best(HOOK, ["Na5"], text="The engine (depth 16) prefers the knight retreat to a5."),
                loses(2, HOOK, "Nxd5", 70, "Taking the pawn back is at least 70 centipawns worse than the best move.")],
        highlight=["f6", "c6", "d5", "a5"]))
A(reflect("Before the numbers: out of every 100 Black players rated under 1500, how many took the pawn back on d5?",
          [("pct", "My guess (0 to 100):")]))
S[-1]["fields"][0].update({"type": "number", "answer": 64, "tolerance": 12})
A(card("**Same position, three rating groups** [V]. In our January 2013 Lichess file (online games, not master chess), Black took the pawn back in 69 of 107 games under 1500, and in 71 of 128 between 1500 and 1899. At 1900 and up, 23 of 28 played the retreat; one took the pawn. The top group is small. [I] The capture looks like a free recapture: the choice of someone who looks one move ahead."))
A(board(HOOK,
        "The popular move, and what it allows. White does not need the pawn; White offers a piece to pull Black's king out.",
        [("Nxd5", "Black wins the pawn back: the choice of 69 of 107 players under 1500."),
         ("Nxf7", "White offers the knight: if the king takes, it leaves its shelter."),
         ("Kxf7", "The king takes. The next boards show that refusing is worse."),
         ("Qf3+", "The queen checks and joins the attack at once."),
         ("Ke6", "The king steps forward: the engine's choice."),
         ("Nc3", "White adds another piece to the attack.")],
        claims=[loses(1, HOOK, "Nxd5", 70, "Taking the pawn back is at least 70 centipawns worse than the best move.")],
        arrows=[("f6", "d5")]))
A(board(HOOK,
        "The engine's move. Black does not take the pawn back at once; first the knight attacks the bishop.",
        [("Na5", "The knight attacks the bishop on c4 and leaves the pawn on d5 for later."),
         ("Bb5+", "White checks."),
         ("c6", "Black blocks the check with a pawn."),
         ("dxc6", "White takes."),
         ("bxc6", "Black recaptures, opening the b-file."),
         ("Be2", "The bishop retreats."),
         ("h6", "The pawn asks the knight on g5 to leave."),
         ("Nf3", "The knight goes back, and Black can push the central pawn.")],
        claims=[best(HOOK, ["Na5"], text="The engine (depth 16) prefers Na5.")],
        arrows=[("c6", "a5")]))
A(board(HOOK_B,
        "After the retreat and the check, Black has two good replies. A position with several good moves is forgiving: a small slip costs little here.",
        claims=[best(HOOK_B, ["c6", "Bd7"], text="Both c6 and Bd7 are within 40 centipawns of the best move."),
                loses(2, HOOK_B, "Nd7", 100, "Nd7 is at least 100 centipawns worse than the best move.")],
        highlight=["b5", "e8", "c7", "c8"]))
A(card("**The question.** Engines show the best move. People choose by habit, by what looks safe, by what they saw last week. This lesson asks three things: what does a *human-like* player look like, how does practical play differ from perfect play, and where do club players actually lose games? At the end you name your own two most common kinds of error."))

# perfect vs practical
A(card("**Perfect versus practical.** *Objective* play asks what happens if both sides play perfectly. *Practical* play asks how hard the next move is to find and how likely an error is. [H] A move that is slightly worse on the engine scale but leaves the opponent exactly one good reply can be the better choice against a person. The engine does not count how hard a move is."))
A(board(FL1,
        "Black to move after the knight sacrifice. The engine says White is only about one pawn better, not winning. Count how many accurate moves Black needs in a row.",
        [("Kxf7", "The engine's choice; other tries, such as the queen to h4, lose far more."),
         ("Qf3+", "White's queen checks."),
         ("Ke6", "The king must walk forward again."),
         ("Nc3", "White brings another piece."),
         ("Ncb4", "Black attacks c2 and keeps the knight on d5 defended."),
         ("Bb3", "The bishop retreats to b3 and still eyes d5.")],
        claims=[best(FL1, ["Kxf7"], text="Taking the knight is the engine's choice."),
                loses(2, FL1, "Qh4", 250, "Moving the queen to h4 instead is at least 250 centipawns worse."),
                C(3, "eval_range", "White's edge is modest: between +0.6 and +1.8 at depth 16.", min=60, max=180)],
        arrows=[("f7", "e6")]))
A(board(FL2,
        "Black in check. Several moves are legal, and the engine prefers one by a wide margin: the other king move and the queen block cost at least a pawn more.",
        claims=[best(FL2, ["Ke6"], text="Ke6 is the engine's choice."),
                loses(2, FL2, "Ke8", 100, "Ke8 is at least 100 centipawns worse."),
                loses(3, FL2, "Qf6", 100, "Qf6 is at least 100 centipawns worse.")],
        highlight=["f7", "e6", "e8", "f6"]))
A(board(FL3,
        "Black to move, the third accurate move in a row: king capture, king walk, and now this. The natural-looking knight move is much worse.",
        claims=[best(FL3, ["Ncb4"], text="Ncb4 is the engine's choice."),
                loses(2, FL3, "Nd4", 80, "Nd4 is at least 80 centipawns worse.")],
        highlight=["c6", "b4", "d4"]))
A(reflect("[H] The sacrifice is only worth about one pawn on the engine scale, yet it asks three exact moves of the defender. Would you play it as White against a 1200 player? Against a 2200 player? Give a reason that is not the engine number.",
          [("a", "Against 1200:"), ("b", "Against 2200:")]))

# practical choice
A(board(PR0,
        "White to move. Two moves are almost equal on the engine scale: a calm developing move, and a pawn push that attacks the bishop on h5. Which one asks Black the harder question?",
        claims=[best(PR0, ["g4", "Bd2"], text="The pawn push and the developing move are both within 40 centipawns of the best move."),
                C(2, "piece_on", "Black's bishop stands on h5.", square="h5", piece="b")],
        highlight=["g2", "g4", "c1", "d2", "h5"]))
A(board(PR_BD2,
        "After the calm move, Black has many reasonable replies. At least four keep the balance, so a casual choice is fine.",
        claims=[best(PR_BD2, ["Qc7", "Qd8", "Nbd7", "Bb4"], within=40, text="Four different replies are within 40 centipawns of the best.")]))
A(board(PR_G4,
        "After the pawn push, Black must find one reply. The two natural tries lose at least 1.0 and 1.5 pawns more. The bishop has to step back.",
        [("Bg6", "The engine's move: the bishop keeps its diagonal and the balance."),
         ("Re1", "White develops a rook.")],
        claims=[best(PR_G4, ["Bg6"], text="Bg6 is the engine's choice."),
                loses(2, PR_G4, "b5", 100, "b5 is at least 100 centipawns worse."),
                loses(3, PR_G4, "Nxg4", 150, "Nxg4 is at least 150 centipawns worse.")],
        highlight=["h5", "g6"]))
S.append({"type": "contrast", "title": "How many good replies does the position leave?",
          "prompt": "Predict first: in which of the two positions can Black afford a careless move? Then check.",
          "working": "IHI-LHIENGINESHUMANS4-3", "failing": "IHI-LHIENGINESHUMANS4-4"})
A(card("**Choosing a practical move** [H]. When two moves are within a few hundredths of a pawn on the engine scale, count the replies that keep the balance after each. One reply means a real question. *Conditions:* both moves must be sound by the engine, the pawn push must not weaken your own king, and you must be able to meet the best defence. Against a strong opponent the extra difficulty buys little."))

# Maia
A(card("**The Maia idea** [S]. Reid McIlroy-Young, Siddhartha Sen, Jon Kleinberg and Ashton Anderson (KDD 2020, arXiv 2006.01855) trained a neural network on online human games to predict the move a person would choose, not the best move. Their abstract says it predicts human moves much better than standard engines and can be tuned to a skill level. I read only the abstract, which gives no accuracy figures."))
A(board(D4TRAP,
        "A position from our data. Under 1500, 40 of 70 Black players played a knight to d4. The engine says this loses at least 3.5 pawns. Step the line.",
        [("Nd4", "The knight lands on a central square: the choice of 40 of 70 players under 1500."),
         ("c3", "A pawn attacks the knight."),
         ("Qh4", "Black counterattacks with the queen."),
         ("cxd4", "White takes the knight."),
         ("Qxe4+", "Black takes a pawn with check, but has lost a knight for a pawn."),
         ("Ne2", "White blocks the check with the knight.")],
        claims=[best(D4TRAP, ["Nce7"], text="Nce7 is the engine's choice."),
                loses(2, D4TRAP, "Nd4", 350, "Nd4 is at least 350 centipawns worse than the best move.")],
        highlight=["c6", "d4", "e7"], arrows=[("c6", "d4")]))
A(board(D4TRAP,
        "The repair: the knight retreats to e7, a square no white pawn attacks, and the position stays playable.",
        [("Nce7", "The knight goes to a square White's pawns do not attack."),
         ("Nf3", "White develops."),
         ("Ng6", "The knight comes back into play on the other side.")],
        claims=[best(D4TRAP, ["Nce7"], text="Nce7 is the engine's choice.")]))
A(board(QF6,
        "Another popular choice from our data: after an early queen move, 20 of 43 players under 1500 and 47 of 54 between 1500 and 1899 played the pawn to c6. Step through what it allows.",
        [("c6", "The pawn takes a square from the knight on b8."),
         ("d4", "White strikes at the centre."),
         ("exd4", "Black takes a pawn."),
         ("Bg5", "The bishop attacks the queen and develops at once."),
         ("Qd6", "The queen retreats."),
         ("Nxd4", "White recaptures with a lead in development.")],
        claims=[best(QF6, ["Nc6"], text="Nc6 is the engine's choice."),
                loses(2, QF6, "c6", 100, "c6 is at least 100 centipawns worse than the best move.")],
        highlight=["b8", "c6", "c7"]))
A(board(QF6,
        "The engine's way: develop the knight first and let the queen move later.",
        [("Nc6", "The knight takes its natural square."),
         ("Nd5", "White attacks the queen with a knight."),
         ("Qd8", "The queen steps back."),
         ("d4", "White takes the centre."),
         ("d6", "Black supports the e5 pawn.")],
        claims=[best(QF6, ["Nc6"], text="Nc6 is the engine's choice.")]))
A(card("**Why a human-like model can work** [I]. The errors here are not random. A free pawn hides a sacrifice; a knight lands where a pawn attacks it next; a pawn blocks a knight. [I] The same *kinds* of position produce the same *kinds* of mistake across thousands of players, a pattern a network can learn. This is my inference; I did not test it."))
A(card("**What a human-like opponent offers.** This app has one: on the Play page, choose the Maia opponent and a rating. It is a free network from the Maia Chess project that plays the move a person of that rating would play, mistakes included [V: the option exists in this app]. [H] That makes it better practice than an engine with its strength turned down, which makes moves no person would make."))
A(reflect("[H] Play one game against the Maia opponent at your own level. Afterwards write one mistake it made that you recognise from human games.",
          [("m", "A mistake that looked human:")]))

# data
A(card("**How club players lose: the method** [V]. I took 600 games from the January 2013 Lichess file with both players rated 1000 to 1499, and 142 with both at 2000 or more. An engine rated each position at depth 8, a rough setting. An error is a drop of 200 centipawns or more in the mover's evaluation. Online, old and rough: read the numbers as shape, not truth."))
A(reflect("Predict: in which phase do 1000 to 1499 players make the most errors per move: the opening, the middlegame or the endgame?",
          [("phase", "My prediction:")]))
A(card("**Errors per 1,000 moves, by phase** [V]\nOpening ▇▇▇ 60\nMiddlegame ▇▇▇▇▇▇▇▇ 156\nEndgame ▇▇▇▇ 77\nAll phases: 104 for the 1000 to 1499 group (3,853 errors in 36,871 moves). The 2000-plus group: 46 (459 in 9,925): opening 7, middlegame 70, endgame 43."))
A(card("**Kinds of error, 1000 to 1499** [V] (depth 8; my classes, they overlap in real play)\nPiece left capturable ▇▇▇▇▇▇▇▇ 31 percent\nQuiet slip, nothing hangs ▇▇▇▇▇▇▇ 28 percent\nMissed capture or check ▇▇▇▇▇▇ 24 percent\nLost a pawn ▇▇▇ 14 percent\nAllowed mate ▇ 4 percent\nPredict which one fits your games best, then test it on the next boards."))

# patterns
A(board(NG3,
        "Pattern one, from a real game in our sample (both players under 1500): moving a piece that stands in the way. White to move. The two queens are on one diagonal with White's knight between them. Predict what happens if the knight moves.",
        [("Ng3", "The knight attacks the queen, but it was blocking the line between the two queens."),
         ("Qxc2", "Black takes the white queen: nothing defended it.")],
        claims=[best(NG3, ["Bd3"], text="Bd3 is the engine's choice."),
                loses(2, NG3, "Ng3", 700, "Ng3 is at least 700 centipawns worse than the best move."),
                C(3, "loose_pieces", "After Ng3 the queen on c2 is loose and White has no other loose piece.", color="white", squares=["c2"], after_move=uci(NG3, "Ng3"))],
        highlight=["e4", "c2", "f5", "g3"], arrows=[("f5", "c2")]))
A(board(NG3,
        "The repair: put the bishop on d3 first. Now when the knight moves, the bishop is the piece behind it, and the queen defends it.",
        [("Bd3", "The bishop defends the knight and stands between the queens."),
         ("Be7", "Black retreats the bishop."),
         ("Nd6", "The knight leaves the diagonal and opens the bishop's line to the black queen."),
         ("Bxd6", "Black takes the knight."),
         ("Bxf5", "The bishop takes the queen."),
         ("exf5", "Black recaptures the bishop.")],
        claims=[best(NG3, ["Bd3"], text="Bd3 is the engine's choice.")]))
A(card("**Why it happens** [I]. A piece that blocks a line is easy to forget. Before moving any piece, ask what it stands in front of. *Conditions:* the line opens only when the piece leaves, and the piece behind it has no defender. [S] Jacob Aagaard, as summarised by a reviewer of *Excelling at Chess Calculation* (2004), says serious errors often start when a key candidate move is overlooked at the beginning of the calculation."))
A(board(RXD7,
        "Pattern two, also from our sample: capturing with the wrong piece. White's queen has just checked on d7, and Black can take it two ways. The rook on d8 is defending the rook on f8. Predict which capture is wrong.",
        [("Rxd7", "The rook takes, and the rook on f8 loses its defender."),
         ("Rxf8+", "White takes the rook with check."),
         ("Rd8", "Black blocks."),
         ("Rxd8+", "White takes the second rook."),
         ("Kxd8", "Black recaptures: both of Black's rooks are gone, for a queen and a rook.")],
        claims=[best(RXD7, ["Kxd7"], text="Kxd7 is the engine's choice."),
                loses(2, RXD7, "Rxd7", 700, "Rxd7 is at least 700 centipawns worse than the best move."),
                C(3, "attackers", "One black piece (the rook on d8) defends the rook on f8.", square="f8", color="black", count=1),
                C(4, "attackers", "One white piece (the rook on f1) attacks the rook on f8.", square="f8", color="white", count=1)],
        highlight=["d7", "d8", "f8", "c8"], arrows=[("d8", "d7"), ("c8", "d7")]))
A(board(RXD7,
        "The right capture. Same queen, same file, different piece. Before taking, ask what the capturing piece is doing now.",
        [("Kxd7", "The king takes the queen, and the rook on d8 still defends the rook on f8."),
         ("Rxf8", "White takes the rook on f8 anyway."),
         ("Rxf8", "Black recaptures: Black has taken a queen and a rook for one rook.")],
        claims=[best(RXD7, ["Kxd7"], text="Kxd7 is the engine's choice.")]))
A(board(QB7,
        "Pattern three, also from our sample: a won position, then one careless move. Black is far ahead and the engine agrees. The knight on b8 is attacked. Predict the natural move, then step what it allows.",
        [("Qb7", "The queen defends the attacked knight and attacks the rook."),
         ("Nd6+", "A knight fork of the king and the queen."),
         ("Kg7", "The king steps aside."),
         ("Nxb7", "The knight takes the queen.")],
        claims=[best(QB7, ["Nd7", "Ke7", "Qh2"], within=110, text="Nd7, Ke7 and Qh2 are all within 110 centipawns of the best move."),
                loses(2, QB7, "Qb7", 900, "Qb7 is at least 900 centipawns worse than the best move."),
                C(3, "eval_range", "Before Qb7, Black stands at least +4 on the engine scale (White's view -4 or lower).", min=-3000, max=-400)],
        highlight=["b8", "c8", "b7", "d6"], arrows=[("h1", "b7")]))
A(board(QB7_AFTER,
        "After the careless move: White to move. The knight check is the engine's move, and the evaluation has swung from Black far ahead to White far ahead.",
        claims=[best(QB7_AFTER, ["Nd6+"], text="Nd6+ is the engine's choice."),
                C(2, "eval_range", "After Qb7 White stands at least +2 on the engine scale.", min=200, max=3000)],
        highlight=["c4", "d6", "b7", "f7"]))
A(card("**Winning positions lose too** [V]. In the 1000 to 1499 sample a side stood at +3 or better 849 times (a side in a game): it won 575 (68 percent), drew 36, lost 238. In 567 of the 600 games one side made a 300-centipawn error first; that side lost 360 times (63 percent). [S] Capablanca's examples (citable-views 12.2) show a side ahead giving the win away by small slips."))
A({"type": "item", "item": "IHI-LHIENGINESHUMANS4-5", "silent": True})
A({"type": "item", "item": "IHI-LHIENGINESHUMANS4-6", "silent": True})
A({"type": "item", "item": "IHI-LHIENGINESHUMANS4-7", "silent": True})
A({"type": "item", "item": "IHI-LHIENGINESHUMANS4-8", "silent": True})
A(card("**Time pressure: what the data cannot say.** The 2013 file records the time control, not the clock on each move [V]. Fast games (under 3 minutes of estimated play) against slow ones (8 minutes or more) at the same ratings: 102 against 106 errors per 1,000 moves. [H] Time pressure probably matters, but a game-level label cannot show it. [S] Alexander Kotov described time trouble leading to blunders (citable-views 12.12)."))
A(reflect("[H] In your last three losses, how much time was on your clock when the key mistake happened? If you do not know, what would you need to record to find out?",
          [("t", "My answer:")], kind="unsure"))
A({"type": "item", "item": "IHI-LHIENGINESHUMANS4-1", "silent": True})
A({"type": "item", "item": "IHI-LHIENGINESHUMANS4-2", "silent": True})
A({"type": "item", "item": "IHI-LHIENGINESHUMANS4-12", "silent": True})
A({"type": "practice", "tags": ["node.SAF.THREAT", "cue.3", "kind.game"], "n": 6, "silent": True})
A(card("**Common mistakes about engines and your errors.** First: believing every red mark means you are bad at chess. [I] Most players have two or three recurring error types, and a long list of flagged moves hides them. Second: ignoring the errors that repeat and studying the one-off blunders. [H] Fixing the top two repeating types probably gains more than learning a new opening. Test it: after ten games, count again."))
A(reflect("Teach it back. Describe your own top two error types from the kinds on the cards. For each: where it happens, what you looked at, what you missed.",
          [("e1", "Error type 1 and a position where it happens:"), ("e2", "Error type 2 and a position where it happens:"), ("fix", "One question I will ask before each move:")]))
A(card("**Self-check, then recap.** Did you name the phase where you lose most, separate a piece left capturable from a quiet slip, give a position for each, and write one question for every move?\n**Remember:** players of different strength choose differently [V]; difficulty matters [H]; errors repeat by kind [I]; the middlegame holds most errors [V]; winning positions get lost [V]; review the first big error."))
A(reflect("Which line of the recap changes what you will do in your next game? Write the one change.", [("change", "My one change:")], kind="confidence"))

# ---------------------------------------------------------------- items
POS = {}
ITEMS = []
SK = "GAME.HISTORY.D1"


def pos(n, spec, ref):
    pid = f"PHI-LHIENGINESHUMANS4-{n}"
    POS[pid] = {"id": pid, "fen": fen_of(spec), "family": f"FAM-HI-ENGINES4-{n}",
                "provenance": {"kind": "authored", "ref": ref, "licence": "project"}}
    return pid


def item(n, task, position, prompt, answer, claims, hints, explain, orientation, skill=SK, cue=3, extra_tags=(), fbm=None):
    it = {"id": f"IHI-LHIENGINESHUMANS4-{n}", "skill": skill, "cue": cue, "task": task, "position": position,
          "prompt": prompt, "answer": answer, "claims": claims,
          "tags": ["lang.en", "kind.authored", f"cue.{cue}", "node.GAME.HISTORY"] + list(extra_tags),
          "hints": hints, "explain": explain, "orientation": orientation,
          "review": {"status": "needs-human", "reviewer": None}}
    if fbm:
        it["feedback_by_move"] = fbm
    ITEMS.append(it)


p1 = pos(1, T1, "replayed move sequence 1.d4 d5 2.c4 dxc4 3.Nc3 Nc6 4.d5 with python-chess; popularity counted in the January 2013 Lichess file")
item(1, "find_move", p1, "Black to move. In our data 14 of 27 players under 1500 jumped the knight to b4 here, and 12 chose another square. Find a good square for the attacked knight.",
     {"moves": [uci(T1, "Nb8"), uci(T1, "Ne5")]},
     [best(T1, ["Nb8", "Ne5"], text="Nb8 and Ne5 are within 40 centipawns of the best move."),
      loses(2, T1, "Nb4", 250, "Nb4 is at least 250 centipawns worse.")],
     ["The knight on c6 is attacked by a pawn.", "A check on a4 can follow a jump to b4.", "Retreat to b8 or jump to e5."],
     "Nb4 meets a queen check and loses material; the retreat or the jump to e5 keeps the balance.", "black", extra_tags=["theme.human-error"],
     fbm={uci(T1, "Nb4"): "The knight steps to a square where a queen check wins time and material. Chosen by 14 of 27 players under 1500 in our data [V]."})
p2 = pos(2, T2, "replayed move sequence 1.e4 d5 2.exd5 Qxd5 3.Nc3 Qe6+ 4.Be2 Nc6 5.Nf3 with python-chess; popularity counted in the January 2013 Lichess file")
item(2, "find_move", p2, "Black to move. Queen on e6, White's pieces developing. In our data 18 of 44 players under 1500 moved the queen to g6. Find the engine's choice.",
     {"moves": [uci(T2, "Qd7")]},
     [best(T2, ["Qd7"], text="Qd7 is the engine's choice."),
      loses(2, T2, "Qg6", 100, "Qg6 is at least 100 centipawns worse.")],
     ["Which square keeps the queen safe from a pawn push?", "A white pawn push to d4 will gain time against a queen on e6 or g6.", "Retreat the queen to d7."],
     "Qg6 gives away at least 100 centipawns; Qd7 is the engine's choice.", "black", extra_tags=["theme.human-error"],
     fbm={uci(T2, "Qg6"): "The queen goes to a square where it can be harassed. Chosen by 18 of 44 players under 1500 in our data [V]."})
p3 = pos(3, PR_G4, "authored: one-step edit of a Lichess game position (January 2013 study) by replaying g2g4 in python-chess")
item(3, "find_move", p3, "Black to move. The bishop on h5 is attacked by a pawn. Find the only reply that keeps the balance.",
     {"moves": [uci(PR_G4, "Bg6")]},
     [best(PR_G4, ["Bg6"], text="Bg6 is the engine's choice at depth 16."),
      loses(2, PR_G4, "b5", 100, "b5 is at least 100 centipawns worse."),
      loses(3, PR_G4, "Nxg4", 150, "Nxg4 is at least 150 centipawns worse.")],
     ["Count the squares the bishop can go to safely.", "Capturing on g4 loses material to a recapture.", "The bishop retreats along its diagonal."],
     "Bg6 is the only reply within 100 centipawns of the best; b5 and Nxg4 cost much more.", "black", cue=2, extra_tags=["mode.only-move"])
p4 = pos(4, PR_BD2, "authored: replaying Bd2 in the same Lichess game position with python-chess")
item(4, "find_move", p4, "Black to move. Name any one reply that keeps the position balanced.",
     {"moves": [uci(PR_BD2, "Qc7"), uci(PR_BD2, "Qd8"), uci(PR_BD2, "Nbd7"), uci(PR_BD2, "Bb4")]},
     [best(PR_BD2, ["Qc7", "Qd8", "Nbd7", "Bb4"], text="Four replies are within 40 centipawns of the best.")],
     ["There is not just one answer.", "Think about developing or moving the queen.", "The knight on b8 or the queen can move."],
     "Four different replies are all within 40 centipawns of the best, so Black can afford a loose move here.", "black", cue=2, extra_tags=["mode.many-moves"])
for n, (fen, san, kind) in enumerate(CLS, start=5):
    b = chess.Board(fen)
    mv = b.parse_san(san)
    pid = pos(n, fen, f"FEN from the January 2013 engine study (tools/analysis/hi_engines4); the move {san} was played in the game")
    opts = ["left a piece loose", "missed a winning capture", "quiet slip"]
    me = "white" if b.turn else "black"
    after = b.copy(); after.push(mv)
    L = sorted(chess.square_name(s) for s, p in after.piece_map().items() if p.color == b.turn and p.piece_type != 6 and after.attackers(not b.turn, s) and not after.attackers(b.turn, s))
    cl = [C(1, "loose_pieces", f"After {san} the {me} loose pieces are exactly these.", color=me, squares=L, after_move=mv.uci()),
          C(2, "move_loses", f"{san} is at least 250 centipawns worse than the best move.", move=mv.uci(), cp=250)]
    cls = {"loose": "left a piece loose", "missed": "missed a winning capture", "quiet": "quiet slip"}[kind]
    ex = {"loose": f"After {san}, a piece is left attacked and undefended, and the move loses at least 250 centipawns.",
          "missed": f"After {san} nothing is left loose, but the engine's best move is a capture, and the played move loses at least 250 centipawns.",
          "quiet": f"After {san} nothing is left loose and the engine's best move is quiet, but the move still loses at least 250 centipawns."}[kind]
    if kind in ("missed", "quiet"):
        bm = BEST[n]
        cl.append(C(3, "best_move_in", "The engine's choice is " + ("a capture." if kind == "missed" else "a quiet move."), moves=[bm], within_cp=40))
        cl.append(C(4, "piece_on", "The best move's target square holds " + ("an enemy piece (a capture)." if kind == "missed" else "nothing (a quiet move)."), square=bm[2:4], piece=(PIECE[n] if kind == "missed" else "empty")))
    item(n, "classify_position", pid, f"{me.capitalize()} just chose {san} here. What kind of mistake is it?",
         {"class": cls, "options": opts}, cl,
         ["Look at what is attacked after the move.", "Check whether a capture was available that the move ignores.", "If neither applies, the mistake is quieter."],
         ex, me, extra_tags=["theme.error-kind"])
p9 = pos(9, NG3, "FEN from the January 2013 engine study (tools/analysis/hi_engines4)")
item(9, "find_move", p9, "White to move. The black queen attacks along the diagonal through your knight. Find a safe move.",
     {"moves": [uci(NG3, "Bd3")]},
     [best(NG3, ["Bd3"], text="Bd3 is the engine's choice."), loses(2, NG3, "Ng3", 700, "Ng3 is at least 700 centipawns worse.")],
     ["What is the knight standing in front of?", "The white queen has no defender on its square.", "Block the diagonal with another piece."],
     "Ng3 uncovers the black queen's attack on the undefended white queen; Bd3 blocks it.", "white", skill="SAF.LOOSE.D2")
p10 = pos(10, RXD7, "FEN from the January 2013 engine study (tools/analysis/hi_engines4)")
item(10, "find_move", p10, "Black to move; White's queen has just checked on d7. Find the capture that keeps both rooks defended.",
     {"moves": [uci(RXD7, "Kxd7")]},
     [best(RXD7, ["Kxd7"], text="Kxd7 is the engine's choice."), loses(2, RXD7, "Rxd7", 700, "Rxd7 is at least 700 centipawns worse.")],
     ["Two pieces can take the queen. What is the rook doing now?", "The rook on d8 defends the rook on f8.", "Capture with the king."],
     "Rxd7 removes the defender of the rook on f8; the king capture keeps both rooks defended.", "black", skill="SAF.LOOSE.D2")
p11 = pos(11, QB7, "FEN from the January 2013 engine study (tools/analysis/hi_engines4)")
item(11, "find_move", p11, "Black to move and well ahead. The knight on b8 is attacked. Find a safe move that keeps the advantage.",
     {"moves": [uci(QB7, "Nd7"), uci(QB7, "Ke7"), uci(QB7, "Qh2")]},
     [best(QB7, ["Nd7", "Ke7", "Qh2"], within=110, text="Nd7, Ke7 and Qh2 are within 110 centipawns of the best."),
      loses(2, QB7, "Qb7", 900, "Qb7 is at least 900 centipawns worse.")],
     ["Where can the white knight on c4 jump with check?", "A queen on b7 stands on a square that a knight fork reaches.", "Move the knight out of attack, or move the king."],
     "Qb7 allows a knight check that forks the king and the queen; the three listed moves keep the advantage.", "black", skill="SAF.THREAT.D2")
p12 = pos(12, T3, "replayed move sequence 1.e4 e5 2.Nf3 f6 3.Nc3 with python-chess; popularity counted in the January 2013 Lichess file")
item(12, "find_move", p12, "Black to move after 1.e4 e5 2.Nf3 f6 3.Nc3. In our data the pawn to c6 was the most common choice under 1500 (14 of 42). Find the engine's choice.",
     {"moves": [uci(T3, "Nc6")]},
     [best(T3, ["Nc6"], text="Nc6 is the engine's choice."), loses(2, T3, "c6", 60, "c6 is at least 60 centipawns worse.")],
     ["Which piece can defend the e5 pawn?", "The pawn on c7 blocks the knight's best square.", "Develop the knight to c6."],
     "c6 loses at least 60 centipawns and allows a strong knight capture on e5; Nc6 defends the pawn.", "black", extra_tags=["theme.human-error"],
     fbm={uci(T3, "c7c6"): "The pawn takes the knight's natural square and leaves e5 weak. Chosen by 14 of 42 players under 1500 in our data [V]."})

# ---------------------------------------------------------------- write
lesson = {
    "id": ID, "course": "history-and-meta", "series": "engines",
    "title": "Engines and humans 4: how people actually play and lose",
    "skill": "GAME.HISTORY", "depth": "D1", "uses": ["SAF.THREAT", "SAF.LOOSE", "CAL.CANDIDATES"], "minutes": 35,
    "outcomes": [
        "Explains why a model trained on human games can predict human moves, and names one limit of the claim",
        "Tells the best move, the popular wrong move and the practical move apart in a position, with an engine check",
        "Counts the good replies a move leaves the opponent and says why that is not the same as the evaluation",
        "Names the kinds of error in his own games (piece left capturable, missed capture, quiet slip) and the phase where he makes most",
        "States what the January 2013 sample can show and cannot show (no clocks, depth 8, online play)",
    ],
    "steps": S,
    "review": {"status": "needs-human", "reviewer": None},
    "sources": [
        "McIlroy-Young, Sen, Kleinberg, Anderson, 'Aligning Superhuman AI with Human Behavior: Chess as a Model System', KDD 2020, arXiv 2006.01855; abstract read on 30 Oct 2026 (no accuracy figures stated in the abstract) [S]",
        "Maia Chess project (CSSLab, University of Toronto) as described on the app's Play page; the Maia opponent option exists in this app [V]",
        "Own data: library/data/lichess_db_standard_rated_2013-01.pgn.zst (a month of online games, not master chess); counts and engine study by tools/analysis/hi_engines4/*.py; Stockfish 19 lite, depth 8 for the study, depth 16 for the shown positions; depth-limited numbers are evidence under recorded settings, not proofs [V]",
        "Positions: opening lines replayed with python-chess; other positions copied from the January 2013 games; all claims in this lesson are checked by tools/validate_lessons.py [V]",
        "Jacob Aagaard, Excelling at Chess Calculation (2004): serious errors often start when a key candidate is overlooked (paraphrase), docs/citable-views.md 10.7, via a reviewer's account [S]",
        "Capablanca on the leader who stops thinking (paraphrase), docs/citable-views.md 12.2 [V-sheet]; Kotov on time trouble (paraphrase), docs/citable-views.md 12.12 [S]",
        "Conjecture marked [H] or [I] in the text is ours; not tested [H]",
        "Not available: clock times per move (the 2013 file has none); app/public/masters/stats.json (top-level games 2500+) was not used for any number on these cards [V]",
    ],
}
(ROOT / "content" / "lessons" / f"{ID}.json").write_text(json.dumps(lesson, indent=1, ensure_ascii=False), encoding="utf-8")
(ROOT / "content" / "items" / "lesson-hi-l-hi-engines-humans-4.json").write_text(
    json.dumps({"positions": list(POS.values()), "items": ITEMS}, indent=1, ensure_ascii=False), encoding="utf-8")
print("steps", len(S), "boards", sum(1 for s in S if s["type"] in ("board", "contrast")), "items", len(ITEMS))
