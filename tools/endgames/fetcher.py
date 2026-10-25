"""Background daemon: drains cache/queue.jsonl into cache/tb.jsonl, politely.

    ./tools/.venv/Scripts/python.exe -I tools/endgames/fetcher.py       # runs until the queue stays empty for an hour

One request at a time. After a success wait OK_PAUSE seconds; after HTTP 429 wait BACKOFF seconds (the public service limits one IP
hard and other agents share it). Items are served round-robin by tag, lowest prio number first, so a partial run still touches every
node. Progress is appended to cache/fetcher.log.
"""
import json, sys, time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import tb

OK_PAUSE = 1.1
BACKOFF = 20
IDLE_EXIT_AFTER = 3600


def read_queue():
    items = []
    if tb.QUEUE_FILE.exists():
        for line in tb.QUEUE_FILE.read_text(encoding="utf-8").splitlines():
            try:
                items.append(json.loads(line))
            except Exception:
                pass
    return items


def next_batch():
    tb.reload()
    todo = [x for x in read_queue() if tb.get(x["fen"]) is None]
    by_tag = {}
    for x in sorted(todo, key=lambda x: x.get("prio", 5)):
        by_tag.setdefault(x["tag"], []).append(x)
    order = []
    tags = sorted(by_tag)
    i = 0
    while any(by_tag.values()):
        t = tags[i % len(tags)]
        if by_tag[t]:
            order.append(by_tag[t].pop(0))
        i += 1
    return order


def main():
    log = open(tb.CACHE_DIR / "fetcher.log", "a", encoding="utf-8")

    def say(s):
        log.write(time.strftime("%H:%M:%S ") + s + "\n")
        log.flush()
    idle = 0
    ok = bad = 0
    t0 = time.time()
    say("fetcher started")
    while True:
        batch = next_batch()
        if not batch:
            time.sleep(10)
            idle += 10
            if idle > IDLE_EXIT_AFTER:
                break
            continue
        idle = 0
        for x in batch[:40]:
            if tb.get(x["fen"]) is not None:
                continue
            while True:
                st, d = tb.fetch_once(x["fen"])
                if st == 200:
                    tb.store(x["fen"], d)
                    ok += 1
                    time.sleep(OK_PAUSE)
                    break
                if st == 429:
                    bad += 1
                    time.sleep(BACKOFF)
                    continue
                if st == 400:
                    tb.store(x["fen"], {"category": "unknown", "moves": [], "error": 400})
                    break
                time.sleep(5)
            if ok % 10 == 0:
                say(f"ok={ok} 429s={bad} elapsed={int(time.time()-t0)}s batch={len(batch)}")
    say("idle exit")


if __name__ == "__main__":
    main()
