"""Write manifest.json and README.md into the output directory (after select_graph.py).

    python -I finalize.py --work <dir> --out <app/public/openings>
"""
import argparse, collections, datetime, glob, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_graph import BANDS, NB

URL = "https://database.lichess.org/standard/lichess_db_standard_rated_2026-09.pgn.zst"


def scan_summary(work):
    cl = [json.load(open(f)) for f in sorted(glob.glob(os.path.join(work, "clusters", "c*.json")))]
    stats = collections.Counter()
    for c in cl:
        stats.update(c["stats"])
    hours = collections.Counter()
    days = collections.Counter()
    for c in cl:
        for k, v in c["hours"].items():
            hours[k[11:13]] += v
            days[k[:10]] += v
    first = min(c["first_ts"] for c in cl)
    last = max(c["last_ts"] for c in cl)
    modes = collections.Counter(c["mode"] for c in cl)
    return cl, stats, hours, days, first, last, modes


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--work", required=True)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    cl, stats, hours, days, first, last, modes = scan_summary(a.work)
    sel = json.load(open(os.path.join(a.work, "select_summary.json")))
    root_n = json.load(open(os.path.join(a.out, "core.json"), encoding="utf-8"))["nodes"]
    root = [v for v in root_n.values() if v["p"] == 0][0]["n"]
    nfr = len(cl)
    ndays = len(days)
    games_used = int(stats["used"])
    band_games = [int(stats["band:%d" % b]) for b in range(NB)]
    sampling = (
        "Stratified random sample of %d complete zstd frames of the monthly file (the file is a chain of independent "
        "32 MiB frames, ~14,400 consecutive games each, 3-15 minutes of play): the 29.2 GB file was cut into %d equal byte "
        "strata and one frame was drawn at random (seed 20260924) in each, so the sample spans %s to %s UTC "
        "(%d distinct days, every hour of the day) instead of only the first days of the month. Bias: online games by "
        "Lichess players, not master or over-the-board data; bullet/ultrabullet/correspondence excluded; one short contiguous "
        "window per stratum, so the same players recur and busy hours are over-represented in proportion to traffic; the "
        "first and last (cut) game of every frame is dropped; byte-position sampling gives each frame an equal chance "
        "(frames are ~equal in games)."
        % (nfr, nfr, first, last, ndays))
    bands = []
    for b, (bid, label, lo, hi) in enumerate(BANDS):
        bands.append({"id": bid, "label": label, "min": lo, "max": hi, "games": band_games[b]})
    manifest = {
        "version": 1,
        "source": {"name": "Lichess standard rated games (CC0)", "month": "2026-09", "url": URL,
                   "games_scanned": int(stats["games"]), "games_used": games_used,
                   "speeds": ["blitz", "rapid", "classical"], "sampling": sampling,
                   "generated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")},
        "bands": bands,
        "bandRule": "average of white and black rating",
        "maxPly": 16,
        "minCountCore": sel["core_min"],
        "minCountChunk": sel["chunk_min"],
        "core": "core.json",
        "chunkIndex": "chunks.json",
        "dir": "chunks/",
    }
    json.dump(manifest, open(os.path.join(a.out, "manifest.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    print("manifest written: games_scanned %d, games_used %d, bands %s" % (stats["games"], games_used, band_games))
    json.dump({"frames": nfr, "first": first, "last": last, "days": dict(days), "hours": dict(hours), "modes": dict(modes),
               "stats": dict(stats), "root_n": root, "band_games": band_games},
              open(os.path.join(a.work, "scan_summary.json"), "w"), indent=1)
    # README text lives next to this script (README.template.md); fill in the numbers
    tpl = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "README.template.md"), encoding="utf-8").read()
    repl = {"{{GAMES_USED}}": "{:,}".format(games_used), "{{CORE_MIN}}": str(sel["core_min"]), "{{CHUNK_MIN}}": str(sel["chunk_min"]),
            "{{EARLY_FLOOR}}": str(sel["early_floor"]), "{{EARLY_PLY}}": str(sel["early_ply"]), "{{FRAMES}}": str(nfr),
            "{{FIRST}}": first, "{{LAST}}": last}
    for k, v in repl.items():
        tpl = tpl.replace(k, v)
    open(os.path.join(a.out, "README.md"), "w", encoding="utf-8").write(tpl)


if __name__ == "__main__":
    main()
