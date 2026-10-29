"""Fetch top-level game archives into library/data/games/ (gitignored; moves are facts, the files are not redistributed by us).

Sources, newest first:
  lichess-broadcast : monthly PGN of official broadcasts of top events, database.lichess.org/broadcast/ (Lichess states its database exports are CC0)
  twic              : The Week in Chess weekly PGN zips, theweekinchess.com/zips/twic<N>g.zip (issue 1 in 1994 to now). Used locally for statistics only;
                      the site's terms were not read in full [H], so these files are never committed or shipped.
Resumable and polite (one request at a time, a pause between requests, descriptive User-Agent). Skips what is already on disk.
Usage: python -I tools/fetch_games.py [lichess|twic] [--max N]
"""
import re, sys, time, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "library" / "data" / "games"
UA = {"User-Agent": "scholarmate-games-fetch/1.0 (research use; github.com/Wizard1999/LearnChessFree)"}
PAUSE = 0.8


def get(url: str, dest: Path) -> int:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=120) as r, open(str(dest) + ".part", "wb") as f:
        n = 0
        while chunk := r.read(1 << 20):
            f.write(chunk); n += len(chunk)
    Path(str(dest) + ".part").replace(dest)
    return n


def lichess(limit: int) -> None:
    d = OUT / "lichess-broadcast"; d.mkdir(parents=True, exist_ok=True)
    html = urllib.request.urlopen(urllib.request.Request("https://database.lichess.org/broadcast/", headers=UA), timeout=60).read().decode("utf8", "replace")
    names = sorted(set(re.findall(r"lichess_db_broadcast_\d{4}-\d{2}\.pgn\.zst", html)), reverse=True)
    print(f"lichess broadcasts: {len(names)} monthly files listed", flush=True)
    done = 0
    for nm in names:
        if done >= limit: break
        if (d / nm).exists(): continue
        try: n = get(f"https://database.lichess.org/broadcast/{nm}", d / nm); print(f"  {nm} {n // 1024} KB", flush=True); done += 1
        except Exception as e: print(f"  {nm} failed: {e}", flush=True)
        time.sleep(PAUSE)


def twic(limit: int) -> None:
    d = OUT / "twic"; d.mkdir(parents=True, exist_ok=True)
    # find the newest issue by probing upward from a known recent one
    top = 1500
    while True:
        try: urllib.request.urlopen(urllib.request.Request(f"https://www.theweekinchess.com/zips/twic{top + 10}g.zip", headers=UA, method="HEAD"), timeout=30); top += 10
        except Exception: break
        time.sleep(0.3)
    while True:
        try: urllib.request.urlopen(urllib.request.Request(f"https://www.theweekinchess.com/zips/twic{top + 1}g.zip", headers=UA, method="HEAD"), timeout=30); top += 1
        except Exception: break
        time.sleep(0.3)
    print(f"twic: newest issue found {top}", flush=True)
    done = 0
    for n in range(top, 0, -1):
        if done >= limit: break
        f = d / f"twic{n}g.zip"
        if f.exists() or (d / f"twic{n}g.missing").exists(): continue
        try: b = get(f"https://www.theweekinchess.com/zips/twic{n}g.zip", f); print(f"  twic{n} {b // 1024} KB", flush=True); done += 1
        except urllib.error.HTTPError as e:
            if e.code == 404: (d / f"twic{n}g.missing").write_text("404")
            else: print(f"  twic{n} HTTP {e.code}", flush=True)
        except Exception as e: print(f"  twic{n} failed: {e}", flush=True)
        time.sleep(PAUSE)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    lim = int(sys.argv[sys.argv.index("--max") + 1]) if "--max" in sys.argv else 10**9
    which = [a for a in args if a in ("lichess", "twic")] or ["lichess", "twic"]
    if "lichess" in which: lichess(lim)
    if "twic" in which: twic(lim)
