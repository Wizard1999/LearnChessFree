"""Worker for the tablebase-cache concurrency selftest: python -I tb_cache_worker.py <cache path> <prefix> <n>
Stores n fake entries through the validator's own cache writer (no network), flushing every few entries so that the
writers genuinely interleave, then exits."""
import sys, time, random
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import validate

cache, prefix, n = Path(sys.argv[1]), sys.argv[2], int(sys.argv[3])
validate.TB_CACHE_PATH = cache
validate.TB_FLUSH_EVERY = 3
validate._TB = None
with validate._tb_file_lock():
    validate._TB = validate._tb_read_disk()
rng = random.Random(prefix)
for i in range(n):
    validate._tb_store(f"{prefix}-{i}", {"v": i, "pad": "x" * 2000})
    time.sleep(rng.random() * 0.01)
validate.tb_flush()
