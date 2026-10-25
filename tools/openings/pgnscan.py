"""Fast first-16-ply scanner for Lichess standard PGN text.

No python-chess here (speed).  A block of PGN text (starting at an '[Event "' header,
ending at a game boundary) goes in; a list of (band, result, nplies, "san san san ...")
rows plus counters come out.

Counting rules (see docs/openings-data.md):
  * Event must be Blitz, Rapid or Classical  (Bullet, UltraBullet, Correspondence dropped)
  * band = average of WhiteElo and BlackElo (both must be numeric)
  * result: 2 = white wins, 1 = draw, 0 = black wins   ('*' games are dropped)
  * only the first MAXPLY = 16 plies are kept
"""
import re
from collections import Counter

MAXPLY = 16

# band edges on the SUM of the two ratings (avg < 900  <=>  sum < 1800, etc.)
BAND_IDS = ["u900", "b900", "b1100", "b1300", "b1500", "b1700", "b1900", "b2100"]
BAND_LABELS = ["Below 900", "900-1100", "1100-1300", "1300-1500", "1500-1700", "1700-1900", "1900-2100", "2100+ (online)"]
BAND_MIN = [0, 900, 1100, 1300, 1500, 1700, 1900, 2100]
BAND_MAX = [899, 1099, 1299, 1499, 1699, 1899, 2099, 4000]
_SUM_EDGES = [1800, 2200, 2600, 3000, 3400, 3800, 4200]


def band_of_sum(s):
    # linear scan over 7 edges is faster than bisect for such a short list
    for i, e in enumerate(_SUM_EDGES):
        if s < e:
            return i
    return 7


_COMMENT = re.compile(r"\{[^}]*\}")
_RESULTS = frozenset(("1-0", "0-1", "1/2-1/2", "*"))
_OKSPEED = frozenset(("Blitz", "Rapid", "Classical"))


def parse_block(text):
    """text: str starting with '[Event "' (complete games only).

    returns (rows, stats) where rows = list of (band, res, n, moves_str)
    """
    rows = []
    c = Counter()
    hours = Counter()
    first_ts = None
    last_ts = None
    parts = text.split('[Event "')
    for g in parts:
        if not g:
            continue
        c["games"] += 1
        q = g.find('"')
        ev = g[:q]
        sp = ev.split(" ", 2)
        # "Rated Blitz game", "Rated Blitz tournament https://...", or (swiss) "Blitz swiss https://..."
        speed = sp[1] if (sp[0] == "Rated" and len(sp) > 1) else sp[0]
        # timestamp bookkeeping (all speeds): "2026.09.01" + hour
        i = g.find('[UTCDate "')
        j = g.find('[UTCTime "')
        if i >= 0 and j >= 0:
            d = g[i + 10:i + 20]
            t = g[j + 10:j + 18]
            hours[d + " " + t[:2]] += 1
            ts = d + " " + t
            if first_ts is None or ts < first_ts:
                first_ts = ts
            if last_ts is None or ts > last_ts:
                last_ts = ts
        c["speed:" + speed] += 1
        if speed not in _OKSPEED:
            continue
        i = g.find('[WhiteElo "')
        j = g.find('[BlackElo "')
        if i < 0 or j < 0:
            c["drop:noelo"] += 1
            continue
        we = g[i + 11:g.find('"', i + 11)]
        be = g[j + 11:g.find('"', j + 11)]
        if not (we.isdigit() and be.isdigit()):
            c["drop:noelo"] += 1
            continue
        i = g.find('[Result "')
        r = g[i + 9:i + 12]
        if r == "1-0":
            res = 2
        elif r == "0-1":
            res = 0
        elif r == "1/2":
            res = 1
        else:
            c["drop:result"] += 1
            continue
        k = g.find("\n\n")
        mt = g[k + 2:k + 2 + 2400]
        mt = _COMMENT.sub("", mt)
        toks = []
        for tok in mt.split():
            if tok[-1] == "." or tok in _RESULTS or tok[0] == "$":
                continue
            tok = tok.rstrip("!?")
            if tok:
                toks.append(tok)
                if len(toks) == MAXPLY:
                    break
        if not toks:
            c["drop:nomoves"] += 1
            continue
        band = band_of_sum(int(we) + int(be))
        c["used"] += 1
        c["band:%d" % band] += 1
        c["res:%d" % res] += 1
        rows.append((band, res, len(toks), " ".join(toks)))
    return rows, dict(c), dict(hours), first_ts, last_ts


def split_blocks(text, target=8_000_000):
    """Cut text (which starts at '[Event "') into pieces of ~target chars, at game starts."""
    out = []
    n = len(text)
    pos = 0
    while pos < n:
        end = pos + target
        if end >= n:
            out.append(text[pos:])
            break
        k = text.find('\n[Event "', end)
        if k < 0:
            out.append(text[pos:])
            break
        out.append(text[pos:k + 1])
        pos = k + 1
    return out
