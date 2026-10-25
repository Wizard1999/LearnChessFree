"""Content validator: structural checks + machine verification of every claim.

    python tools/validate.py [content/items/foo.json ...]    (default: all item files)

Writes generated evidence to content/_evidence/<item-file>.evidence.json. Exit code 1 if anything fails.

Claim types: see docs/content-schema.md. `after_moves` (a list of UCI moves, played in order) is the sequence form of `after_move`. Structure claims (pawn_set, pawn_islands, open_files, holes, outposts, bishop_pair,
pawn_colours, mobility, king_pawn_shield, space, rooks_connected, piece_on, king_wing, moves_where) are computed exactly by
tools/structure.py (their definitions are in that module's docstring and in `check_structure_claim` below). They, and
`attackers` / `loose_pieces`, accept an optional `after_move` (UCI): the claim is then evaluated on the position after that legal
move. `material_after_move`, `quiet_position` and `move_is_not_mate` accept `null_move_first` (the side to move passes, so the claim
is about what the OPPONENT could do: "what is threatened?").
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))  # allow `python -I tools/<script>.py`
import hashlib, json, sys, datetime
from pathlib import Path
import chess
from engine import Engine, ROOT
import structure

VAL = {chess.PAWN: 1, chess.KNIGHT: 3, chess.BISHOP: 3, chess.ROOK: 5, chess.QUEEN: 9, chess.KING: 0}
DEPTH = 16


def material(board, color):
    return sum(VAL[p.piece_type] for p in board.piece_map().values() if p.color == color)


def quiet_end_delta(board, pv, mover, max_plies=12):
    """Play the engine's best-defence line for up to `max_plies`; return the mover's net material change
    measured right after the LAST capture in that line (so trailing quiet moves, and quiet replies to a check
    that precede a capture, do not distort it). Returns (None, ply) if the line contains an illegal move."""
    b = board.copy()
    start = material(b, mover) - material(b, not mover)
    delta = 0
    for i, uci in enumerate(pv[:max_plies]):
        mv = chess.Move.from_uci(uci)
        if mv not in b.legal_moves:
            return None, i
        cap = b.is_capture(mv)
        b.push(mv)
        if cap or b.is_checkmate():
            delta = (material(b, mover) - material(b, not mover)) - start
    return delta, b



import urllib.parse, urllib.request, time, os, atexit, contextlib
TB_CACHE_PATH = ROOT / "library" / "cache" / "tablebase.json"
_TB = None          # in-memory view of the cache (disk contents at last load/flush plus our own new entries)
_TB_NEW = {}        # entries fetched by THIS process and not yet merged into the file
TB_FLUSH_EVERY = 10


@contextlib.contextmanager
def _tb_file_lock(timeout=120):
    """Exclusive cross-process lock (msvcrt on Windows, fcntl elsewhere) on <cache>.lock, so parallel validator runs
    never interleave their read-merge-write of the shared cache."""
    lock_path = TB_CACHE_PATH.with_name(TB_CACHE_PATH.name + ".lock")
    lock_path.parent.mkdir(parents=True, exist_ok=True)
    f = open(lock_path, "a+b")
    LOCK_AT = 1 << 20          # lock one byte far from the (empty) file's content: Windows byte-range locks also block READS of the range
    try:
        deadline = time.time() + timeout
        while True:
            try:
                f.seek(LOCK_AT)
                if os.name == "nt":
                    import msvcrt; msvcrt.locking(f.fileno(), msvcrt.LK_NBLCK, 1)
                else:
                    import fcntl; fcntl.flock(f.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
                break
            except OSError:
                if time.time() > deadline: raise TimeoutError("tablebase cache lock busy for too long")
                time.sleep(0.05)
        try:
            yield
        finally:
            try:
                f.seek(LOCK_AT)
                if os.name == "nt":
                    import msvcrt; msvcrt.locking(f.fileno(), msvcrt.LK_UNLCK, 1)
                else:
                    import fcntl; fcntl.flock(f.fileno(), fcntl.LOCK_UN)
            except OSError:
                pass
    finally:
        f.close()


def _tb_read_disk():
    """Read the cache file; a corrupt file is moved aside (never silently discarded) and treated as empty."""
    if not TB_CACHE_PATH.exists(): return {}
    try:
        d = json.loads(TB_CACHE_PATH.read_text(encoding="utf-8"))
        if isinstance(d, dict): return d
        raise ValueError("cache is not a JSON object")
    except Exception:
        aside = TB_CACHE_PATH.with_name(TB_CACHE_PATH.name + f".corrupt-{int(time.time())}-{os.getpid()}")
        try: os.replace(TB_CACHE_PATH, aside)
        except OSError: pass
        return {}


def _tb_replace(tmp, dst, tries=100):
    for i in range(tries):                       # Windows refuses to replace a file another process has open for a moment
        try: os.replace(tmp, dst); return
        except PermissionError:
            if i == tries - 1: raise
            time.sleep(0.05)


def tb_flush():
    """Merge this process's new entries into the shared file: lock, re-read the file (other runs may have added entries),
    merge, write to a temp file in the same folder, then atomically replace. Safe to call at any time."""
    global _TB
    if not _TB_NEW: return
    with _tb_file_lock():
        disk = _tb_read_disk()
        disk.update(_TB_NEW)
        tmp = TB_CACHE_PATH.with_name(f"{TB_CACHE_PATH.name}.tmp-{os.getpid()}")
        tmp.write_text(json.dumps(disk), encoding="utf-8")
        _tb_replace(tmp, TB_CACHE_PATH)
    _TB = disk
    _TB_NEW.clear()


atexit.register(lambda: tb_flush() if _TB_NEW else None)


def _tb_store(fen, d):
    _TB[fen] = d; _TB_NEW[fen] = d
    if len(_TB_NEW) >= TB_FLUSH_EVERY: tb_flush()


def tb_query(fen):
    """Lichess tablebase (<=7 pieces). Cached on disk (atomic, locked, merged writes). Returns parsed JSON or None."""
    global _TB
    if _TB is None:
        with _tb_file_lock():
            _TB = _tb_read_disk()
    if fen in _TB: return _TB[fen]
    url = "https://tablebase.lichess.ovh/standard?fen=" + urllib.parse.quote(fen.replace(" ", "_"), safe="/_-")
    for attempt in range(4):
        try:
            d = json.load(urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "chess-school-validator"}), timeout=40))
            _tb_store(fen, d); time.sleep(0.15); return d
        except Exception:
            time.sleep(1.5 * (attempt + 1))
    return None

def white_pov(kind, value, stm_white):
    v = (100000 - abs(value)) * (1 if value > 0 else -1) if kind == "mate" else value
    return v if stm_white else -v


STRUCT_TYPES = {"pawn_set", "pawn_islands", "open_files", "holes", "outposts", "bishop_pair", "pawn_colours", "mobility",
                "king_pawn_shield", "space", "rooks_connected", "piece_on", "king_wing", "moves_where", "piece_attacks", "pawn_attackers", "wing_pawns"}
AFTER_MOVE_TYPES = STRUCT_TYPES | {"attackers", "loose_pieces"}
NULL_FIRST_TYPES = {"material_after_move", "quiet_position", "move_is_not_mate"}


def _fail(reason, **kw):
    return dict(result="fail", reason=reason, measured=kw.get("measured"), settings=None, pv=None, score=None)


def _cmp_set(got, p, key="squares"):
    """Exact set equality when `key` is given; `includes` (subset) and `excludes` (disjoint) are extra, weaker checks."""
    got = sorted(set(got)); used = False; ok = True
    if key in p: used = True; ok = ok and got == sorted(set(p[key]))
    if "includes" in p: used = True; ok = ok and set(p["includes"]) <= set(got)
    if "excludes" in p: used = True; ok = ok and not (set(p["excludes"]) & set(got))
    if not used: raise ValueError(f"claim needs `{key}` (exact), `includes` or `excludes`")
    return ok, got


def check_claim(eng, pos, claim):
    board = chess.Board(pos["fen"])
    t = claim["type"]; p = claim.get("params", {})
    if p.get("null_move_first") and t in NULL_FIRST_TYPES:        # the side to move passes: claims below are about the OPPONENT's options
        if board.is_check(): return _fail("side to move is in check: a null move is not meaningful")
        board = board.copy(); board.push(chess.Move.null())
    if "after_move" in p and t in AFTER_MOVE_TYPES:
        mv0 = chess.Move.from_uci(p["after_move"])
        if mv0 not in board.legal_moves: return _fail("after_move is illegal in this position")
        board = board.copy(stack=False); board.push(mv0)
    if "after_moves" in p and t in AFTER_MOVE_TYPES:             # a whole sequence, e.g. a capture and its recapture
        board = board.copy(stack=False)
        for u in p["after_moves"]:
            mvs = chess.Move.from_uci(u)
            if mvs not in board.legal_moves: return _fail(f"after_moves: {u} is illegal in the sequence")
            board.push(mvs)
    if t in STRUCT_TYPES:
        return check_structure_claim(board, t, p)
    if t == "legal_move":
        ok = chess.Move.from_uci(p["move"]) in board.legal_moves
        return dict(result="pass" if ok else "fail", measured=None, settings=None, pv=None, score=None)
    if t == "material_after_move":
        mv = chess.Move.from_uci(p["move"])
        if mv not in board.legal_moves:
            return dict(result="fail", reason="illegal move", measured=None, settings=None, pv=None, score=None)
        mover = board.turn
        after = board.copy(); after.push(mv)
        if after.is_game_over():                              # e.g. the move delivers mate: nothing left to search
            delta, _ = quiet_end_delta(board, [mv.uci()], mover)
            ok = delta >= p.get("min", -999) and delta <= p.get("max", 999)
            if ok and not after.is_checkmate() and p.get("min", -999) > 0:   # "wins material" must not end in a dead draw
                return dict(result="fail", reason="material is won but the game is a draw (insufficient material/stalemate)", measured=dict(net_material=delta, game_over=True), settings=None, pv=[mv.uci()], score=None)
            return dict(result="pass" if ok else "fail", measured=dict(net_material=delta, game_over=True), settings=None, pv=[mv.uci()], score=None)
        res = eng.search(after.fen(), depth=DEPTH)[1]       # best defence for the opponent
        line = [mv.uci()] + res["pv"]
        delta, final = quiet_end_delta(board, line, mover)
        ok = delta is not None and delta >= p.get("min", -999) and delta <= p.get("max", 999)
        if ok and p.get("min", -999) > 0 and hasattr(final, "is_insufficient_material") and final.is_insufficient_material():
            return dict(result="fail", reason="material is won but the resulting position is a dead draw", measured=dict(net_material=delta), settings=eng.settings(DEPTH), pv=line[:12], score=None)
        score = dict(kind=res["kind"], value=res["value"], side="opponent after the move")
        return dict(result="pass" if ok else "fail", measured=dict(net_material=delta), settings=eng.settings(DEPTH), pv=line[:12], score=score)
    if t == "legal_destinations":      # exact set of squares the piece on `from` can legally move to
        sq = chess.parse_square(p["from"])
        got = sorted({chess.square_name(m.to_square) for m in board.legal_moves if m.from_square == sq})   # a set: a promotion square occurs once, not once per promotion piece
        return dict(result="pass" if got == sorted(set(p["to"])) else "fail", measured=dict(got=got), settings=None, pv=None, score=None)
    if t == "game_state":              # checkmate / stalemate / check / ongoing for the side to move
        state = "checkmate" if board.is_checkmate() else "stalemate" if board.is_stalemate() else "check" if board.is_check() else "ongoing"
        return dict(result="pass" if state == p["state"] else "fail", measured=dict(state=state), settings=None, pv=None, score=None)
    if t == "illegal_move":
        mv = chess.Move.from_uci(p["move"])
        return dict(result="pass" if mv not in board.legal_moves else "fail", measured=None, settings=None, pv=None, score=None)
    if t == "move_is_not_mate":        # the move is legal and does not deliver checkmate (with null_move_first: legal for the OPPONENT after a pass)
        mv = chess.Move.from_uci(p["move"])
        if mv not in board.legal_moves: return _fail("illegal move")
        after = board.copy(stack=False); gives = board.gives_check(mv); after.push(mv)
        return dict(result="fail" if after.is_checkmate() else "pass", measured=dict(checkmate=after.is_checkmate(), gives_check=gives), settings=None, pv=None, score=None)
    if t == "mate_in":
        if p.get("null_move_first"):   # "what does the opponent threaten?": give the opponent a free move first
            board = board.copy(); board.push(chess.Move.null())
        mv = chess.Move.from_uci(p["move"])
        after = board.copy(); after.push(mv)
        if after.is_checkmate():
            return dict(result="pass", measured=dict(mate=0), settings=None, pv=[mv.uci()], score=None)
        res = eng.search(after.fen(), depth=DEPTH)[1]
        # "mate in n" counts the mover's moves including this one; after it the opponent is "mated in n-1" (negative score)
        ok = res["kind"] == "mate" and res["value"] < 0 and (-res["value"]) <= p["n"] - 1
        return dict(result="pass" if ok else "fail", measured=dict(mate=res["value"]), settings=eng.settings(DEPTH), pv=[mv.uci()] + res["pv"][:10], score=dict(kind=res["kind"], value=res["value"]))
    if t == "attackers":               # number of pieces of `color` attacking `square`
        n = len(board.attackers(chess.WHITE if p["color"] == "white" else chess.BLACK, chess.parse_square(p["square"])))
        return dict(result="pass" if n == p["count"] else "fail", measured=dict(count=n), settings=None, pv=None, score=None)
    if t == "loose_pieces":            # pieces (not kings) of `color` that are attacked by the enemy and defended by nobody
        col = chess.WHITE if p["color"] == "white" else chess.BLACK
        got = sorted(chess.square_name(s) for s, pc in board.piece_map().items()
                     if pc.color == col and pc.piece_type != chess.KING and board.attackers(not col, s) and not board.attackers(col, s))
        return dict(result="pass" if got == sorted(p["squares"]) else "fail", measured=dict(got=got), settings=None, pv=None, score=None)
    if t == "legal_moves_set":         # exact set of legal moves (UCI) for the side to move
        got = sorted(m.uci() for m in board.legal_moves)
        return dict(result="pass" if got == sorted(p["moves"]) else "fail", measured=dict(got=got), settings=None, pv=None, score=None)
    if t == "eval_range":              # engine evaluation from WHITE's point of view, in centipawns
        res = eng.search(board.fen(), depth=p.get("depth", DEPTH))[1]
        v = white_pov(res["kind"], res["value"], board.turn)
        ok = v >= p.get("min", -10**9) and v <= p.get("max", 10**9)
        return dict(result="pass" if ok else "fail", measured=dict(eval_white_cp=v), settings=eng.settings(p.get("depth", DEPTH)), pv=res["pv"][:8], score=dict(kind=res["kind"], value=res["value"], side="mover"))
    if t == "best_move_in":            # engine's best move is in the accepted set; every accepted move is within within_cp of best
        k = max(len(p["moves"]) + 2, 4)
        res = eng.search(board.fen(), depth=DEPTH, multipv=min(k, board.legal_moves.count()))
        def sc(r): return (100000 - abs(r["value"])) * (1 if r["value"] > 0 else -1) if r["kind"] == "mate" else r["value"]
        best = sc(res[1]); top = {r["pv"][0]: sc(r) for r in res.values()}
        within = p.get("within_cp", 40)
        missing = [m for m in p["moves"] if m not in top or best - top[m] > within]
        ok = res[1]["pv"][0] in p["moves"] and not missing
        return dict(result="pass" if ok else "fail", measured=dict(best_move=res[1]["pv"][0], accepted_scores={m: top.get(m) for m in p["moves"]}, best_cp=best, not_within=missing), settings=eng.settings(DEPTH, k), pv=res[1]["pv"][:8], score=dict(kind=res[1]["kind"], value=res[1]["value"], side="mover"))
    if t == "move_loses":              # the move is worse than the best move by at least `cp` (mover's POV)
        mv = chess.Move.from_uci(p["move"])
        if mv not in board.legal_moves: return dict(result="fail", reason="illegal move", measured=None, settings=None, pv=None, score=None)
        best = eng.search(board.fen(), depth=DEPTH)[1]; mine = eng.search(board.fen(), depth=DEPTH, searchmoves=[mv.uci()])[1]
        def sc(r): return (100000 - abs(r["value"])) * (1 if r["value"] > 0 else -1) if r["kind"] == "mate" else r["value"]
        loss = sc(best) - sc(mine)
        return dict(result="pass" if loss >= p["cp"] else "fail", measured=dict(loss_cp=loss, best_move=best["pv"][0]), settings=eng.settings(DEPTH), pv=mine["pv"][:8], score=dict(kind=mine["kind"], value=mine["value"], side="mover"))
    if t == "tablebase":               # exact result for the MOVER (side to move at the position), optionally after `move`
        pieces = len(board.piece_map())
        if pieces > 7: return dict(result="fail", reason=f"{pieces} pieces: outside 7-man tablebases", measured=None, settings=None, pv=None, score=None)
        d = tb_query(board.fen())
        if d is None: return dict(result="fail", reason="tablebase service unavailable", measured=None, settings=None, pv=None, score=None)
        def mover_view(cat, after_move):    # categories are for the side to move in the queried position
            m = {"win": "win", "cursed-win": "draw", "draw": "draw", "blessed-loss": "draw", "loss": "loss", "maybe-win": "win", "syzygy-win": "win", "maybe-loss": "loss", "syzygy-loss": "loss"}.get(cat, cat)
            if after_move: m = {"win": "loss", "loss": "win", "draw": "draw"}.get(m, m)
            return m
        if "move" in p:
            mv = board.copy(); uci = p["move"]
            row = next((x for x in d["moves"] if x["uci"] == uci), None)
            if row is None: return dict(result="fail", reason="move not in tablebase move list (illegal?)", measured=None, settings=None, pv=None, score=None)
            got = mover_view(row["category"], True)
        else:
            got = mover_view(d["category"], False)
        return dict(result="pass" if got == p["result"] else "fail", measured=dict(result_for_mover=got, dtz=d.get("dtz"), dtm=d.get("dtm")), settings=dict(source="lichess tablebase", pieces=pieces), pv=None, score=None)
    if t == "quiet_position":
        res = eng.search(board.fen(), depth=DEPTH)[1]
        mover = board.turn
        delta, _ = quiet_end_delta(board, res["pv"], mover)
        ok = delta is not None and delta <= p.get("max", 1)
        return dict(result="pass" if ok else "fail", measured=dict(best_line_net_material=delta), settings=eng.settings(DEPTH), pv=res["pv"][:12], score=dict(kind=res["kind"], value=res["value"], side="mover"))
    raise ValueError(f"unknown claim type {t}")


def check_structure_claim(board, t, p):
    """Exact structure claims (no engine). Definitions (full text in tools/structure.py); `color` is "white" or "black".
    pawn_set {kind, color, squares|includes|excludes}: kind in passed (no enemy pawn ahead on the same or an adjacent file), isolated
      (no own pawn on an adjacent file), doubled (every pawn on a file with 2+ own pawns), backward (not isolated, every neighbouring own
      pawn strictly ahead, stop square attacked by an enemy pawn), connected (own pawn on an adjacent file within one rank), protected
      (defended by an own pawn), protected_passed, connected_passed, blockaded_passed (passed, stop square holds an enemy non-pawn piece),
      chain_base (defends an own pawn, defended by none), hanging_pair (two side-by-side own pawns on the 4th or 5th relative rank, alone on their files and flanks, no
      enemy pawn on either file), majority_side (own pawns on every wing a-d / e-h where the colour has strictly more pawns than the opponent).
    pawn_islands {color, count?, islands?}: maximal runs of adjacent files holding own pawns (islands as strings such as "ab","d","fgh").
    open_files {open?, half_open_white?, half_open_black?}: exact lists of file letters (open: no pawns at all; half-open for a colour: none of
      its own pawns but at least one enemy pawn).
    holes {color, squares|includes|excludes}: squares on that colour's relative ranks 3-5 with no pawn of that colour on them that no own pawn
      attacks now or can attack by advancing.
    outposts {color, occupied: any|empty|own|not_own, squares|includes|excludes}: squares on relative ranks 4-6, defended by an own pawn, attacked
      by no enemy pawn now nor by any enemy pawn that could advance to attack them (pawn captures that change file are ignored), holding no pawn
      of either colour; `occupied` filters by what stands on the square (own = an own non-pawn piece, not_own = no own piece).
    bishop_pair {holders: ["white"|"black", ...]}: colours owning a light-squared AND a dark-squared bishop (exact list).
    pawn_colours {color, light?, dark?}: counts of own pawns on light and dark squares.
    mobility {square, mode: legal|squares, count}: distinct destination squares of the piece's legal moves (as if its colour were to move) or
      squares it attacks that are not held by an own piece.
    king_pawn_shield {color, squares|includes|excludes}: own pawns on the three files centred on the king, on the two ranks in front of it.
    space {color, mode: pawn_attacks|pawn_controlled, count?, squares?, region?}: squares in the opponent's half (or in `region`) attacked by an
      own pawn (controlled: and by no enemy pawn).
    piece_attacks {square, squares|includes|excludes}: the squares the piece on `square` attacks (own-occupied squares included; pins ignored).
    rooks_connected {color, value}: two own rooks on one rank or file with nothing between them.
    piece_on {square, piece}: the piece symbol ("N", "p" ...) or "empty". king_wing {color, wing}: queenside (a-c), centre (d-e), kingside (f-h).
    wing_pawns {color, wing: queenside|kingside, count}: the colour's pawns on files a-d (queenside) or e-h (kingside).
    pawn_attackers {square, color, count}: how many pawns of that colour attack the square (pieces do not count).
    moves_where {property, moves, square?}: the EXACT set of legal moves with a property: connects_rooks, to_outpost (knight/bishop lands on an outpost
      square), rook_to_open_file, rook_to_half_open_file, rook_to_seventh, blockades_passed, pawn_move_attacks (needs `square`: a pawn move after which the moved pawn attacks it)."""
    S = structure
    def res(ok, **measured): return dict(result="pass" if ok else "fail", measured=measured, settings=None, pv=None, score=None)
    if t == "pawn_set":
        c = S.colour(p["color"]); kind = p["kind"]
        if kind not in S.PAWN_KINDS: raise ValueError(f"unknown pawn kind {kind}")
        ok, got = _cmp_set(S.pawn_set(board, kind, c), p)
        extra = dict(wings=S.wing_counts(board, c)) if kind == "majority_side" else {}
        return res(ok, got=got, **extra)
    if t == "pawn_islands":
        c = S.colour(p["color"]); isl = S.pawn_islands(board, c); ok = True
        if "count" in p: ok = ok and len(isl) == p["count"]
        if "islands" in p: ok = ok and isl == list(p["islands"])
        if "count" not in p and "islands" not in p: raise ValueError("pawn_islands needs count or islands")
        return res(ok, islands=isl)
    if t == "open_files":
        got = S.open_files(board); keys = [k for k in ("open", "half_open_white", "half_open_black") if k in p]
        if not keys: raise ValueError("open_files needs open, half_open_white or half_open_black")
        return res(all(sorted(got[k]) == sorted(p[k]) for k in keys), **got)
    if t == "holes":
        ok, got = _cmp_set(S.hole_squares(board, S.colour(p["color"])), p)
        return res(ok, got=got)
    if t == "outposts":
        if "occupied" not in p: raise ValueError("outposts needs `occupied` (any|empty|own|not_own)")
        ok, got = _cmp_set(S.outpost_squares(board, S.colour(p["color"]), p["occupied"]), p)
        return res(ok, got=got)
    if t == "bishop_pair":
        got = S.bishop_pair_holders(board)
        return res(sorted(got) == sorted(p["holders"]), holders=got)
    if t == "pawn_colours":
        got = S.pawn_colours(board, S.colour(p["color"])); keys = [k for k in ("light", "dark") if k in p]
        if not keys: raise ValueError("pawn_colours needs light and/or dark")
        return res(all(got[k] == p[k] for k in keys), **got)
    if t == "mobility":
        n = S.mobility(board, chess.parse_square(p["square"]), p["mode"])
        return res(n == p["count"], count=n)
    if t == "king_pawn_shield":
        ok, got = _cmp_set(S.king_pawn_shield(board, S.colour(p["color"])), p)
        return res(ok, got=got)
    if t == "space":
        c = S.colour(p["color"]); sq = S.space_squares(board, c, p["mode"], p.get("region")); ok = True
        if "count" in p: ok = ok and len(sq) == p["count"]
        if "squares" in p: ok = ok and sq == sorted(p["squares"])
        if "count" not in p and "squares" not in p: raise ValueError("space needs count or squares")
        return res(ok, count=len(sq), squares=sq)
    if t == "wing_pawns":
        n = S.wing_pawn_count(board, S.colour(p["color"]), p["wing"])
        return res(n == p["count"], count=n)
    if t == "pawn_attackers":
        n = S.pawn_attackers(board, chess.parse_square(p["square"]), S.colour(p["color"]))
        return res(n == p["count"], count=n)
    if t == "piece_attacks":
        ok, got = _cmp_set(S.attacked_squares(board, chess.parse_square(p["square"])), p)
        return res(ok, got=got)
    if t == "rooks_connected":
        got = S.rooks_connected(board, S.colour(p["color"]))
        return res(got == bool(p["value"]), connected=got)
    if t == "piece_on":
        got = S.piece_symbol(board, chess.parse_square(p["square"])) or "empty"
        return res(got == p["piece"], piece=got)
    if t == "king_wing":
        got = S.king_wing(board, S.colour(p["color"]))
        return res(got == p["wing"], wing=got)
    if t == "moves_where":
        if p["property"] not in S.MOVE_PROPS: raise ValueError(f"unknown move property {p['property']}")
        got = S.moves_where(board, p["property"], p.get("square"))
        return res(got == sorted(p["moves"]), got=got)
    raise ValueError(f"unknown structure claim {t}")


def validate_file(path, eng):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    errors, evidence = [], []
    positions = {x["id"]: x for x in data["positions"]}
    seen_ids = set()
    for pid, pos in positions.items():
        b = chess.Board(pos["fen"])
        if not b.is_valid():
            errors.append(f"{pid}: invalid position ({b.status().name})")
        for k in ("kind", "licence"):
            if k not in pos.get("provenance", {}):
                errors.append(f"{pid}: provenance.{k} missing")
        if "family" not in pos:
            errors.append(f"{pid}: family missing")
    for item in data["items"]:
        iid = item["id"]
        if iid in seen_ids: errors.append(f"{iid}: duplicate id")
        seen_ids.add(iid)
        if item["position"] not in positions: errors.append(f"{iid}: unknown position"); continue
        if item["cue"] not in (1, 2, 3, 4): errors.append(f"{iid}: bad cue level")
        if not item.get("claims"): errors.append(f"{iid}: no claims (every item needs a machine check)")
        if "tags" in item and not (isinstance(item["tags"], list) and all(isinstance(x, str) for x in item["tags"])): errors.append(f"{iid}: tags must be a list of strings")
        if "hints" in item and not (isinstance(item["hints"], list) and all(isinstance(x, str) for x in item["hints"])): errors.append(f"{iid}: hints must be a list of strings")
        if "explain" in item and not isinstance(item["explain"], str): errors.append(f"{iid}: explain must be a string")
        if item.get("review", {}).get("status") not in ("machine-only", "needs-human", "human-reviewed"): errors.append(f"{iid}: review.status must be machine-only | needs-human | human-reviewed")
        pos = positions[item["position"]]
        h = hashlib.sha256(json.dumps([item, pos], sort_keys=True).encode()).hexdigest()[:16]
        for claim in item.get("claims", []):
            try:
                r = check_claim(eng, pos, claim)
            except Exception as ex:
                r = dict(result="fail", reason=f"error: {ex}")
            rec = dict(item=iid, claim=claim["id"], type=claim["type"], content_hash=h,
                       checked_at=datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"), **r)
            evidence.append(rec)
            tag = "ok " if r["result"] == "pass" else "FAIL"
            print(f"  [{tag}] {iid} / {claim['id']} ({claim['type']}) measured={r.get('measured')} score={r.get('score')}")
            if r["result"] != "pass":
                errors.append(f"{iid}/{claim['id']}: claim failed ({r.get('reason', r.get('measured'))})")
    out = ROOT / "content" / "_evidence" / (Path(path).stem + ".evidence.json")
    out.write_text(json.dumps(evidence, indent=1), encoding="utf-8")
    return errors


def main():
    files = [Path(a) for a in sys.argv[1:]] or sorted((ROOT / "content" / "items").glob("*.json"))
    eng = Engine()
    print(f"engine: {eng.name}  depth={DEPTH}")
    all_errors = []
    try:
        for f in files:
            print(f"\n{f.name}")
            all_errors += [f"{f.name}: {e}" for e in validate_file(f, eng)]
    finally:
        eng.close()
    print("\n" + ("ALL CHECKS PASSED" if not all_errors else f"{len(all_errors)} PROBLEM(S):\n  " + "\n  ".join(all_errors)))
    sys.exit(1 if all_errors else 0)


if __name__ == "__main__":
    main()
