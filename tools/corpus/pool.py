"""Tiny multiprocessing helper: N worker processes, each owning one Stockfish (tools/engine.py) and the validator module.

    results = run_pool(func, jobs, workers=6, log=print)      # func(job, eng, V) -> dict ; results in completion order
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import multiprocessing as mp, time
from common import *

_ENG = None
_V = None
_FUNC = None


def _init(func):
    global _ENG, _V, _FUNC
    import validate as V
    from engine import Engine
    _V = V; _ENG = Engine(); _FUNC = func


def _call(job):
    try:
        return _FUNC(job, _ENG, _V)
    except Exception as ex:
        return dict(job=job if isinstance(job, (str, int, dict)) else str(job), error=f"{type(ex).__name__}: {ex}", ok=False)


def run_pool(func, jobs, workers=6, log=print, every=25):
    t0 = time.time(); out = []
    with mp.Pool(workers, initializer=_init, initargs=(func,)) as pool:
        for i, r in enumerate(pool.imap_unordered(_call, jobs, chunksize=1), 1):
            out.append(r)
            if log and i % every == 0:
                log(f"  {i}/{len(jobs)} done, {time.time() - t0:.0f}s", flush=True)
    return out


def sc(r):
    """Engine score (mover's point of view) as a single number; mate scores become +-(100000 - distance)."""
    return (100000 - abs(r["value"])) * (1 if r["value"] > 0 else -1) if r["kind"] == "mate" else r["value"]
