# Running the openings pipeline

All paths relative to `O:\_Chessteaching`; `PY=tools/.venv/Scripts/python.exe`; always `-I`.
Work directory (gitignored, ~15 GB): `library/data/openings-work/<name>/`.

```
# 0. frame index of the head of the file (optional, exact ranges for the first ~0.6 GB of frames; polite, 1 req/1.3 s)
$PY -I tools/openings/index_frames.py --head <head.zst> --out <work>/frames_index.json
# 1. stratified sample of single zstd frames -> <work>/games/*.parquet, <work>/clusters/*.json
$PY -I tools/openings/scan.py run --work <work> --index <work>/frames_index.json --head <head.zst> --f 520 --procs 6
# 2. prefix counts (trie) with DuckDB                        -> <work>/trie/E_*.parquet
$PY -I tools/openings/build_trie.py --work <work> --c0 2 --threads 4
# 3. replay each distinct prefix once with python-chess      -> <work>/replay/R_*.parquet
$PY -I tools/openings/replay.py --work <work> --procs 6
# 4. position-keyed tables (TE, NODE, PE, FE) in graph.duckdb
$PY -I tools/openings/build_graph.py prep --work <work>
# 5. thresholds, names, ids, chunks, JSON
$PY -I tools/openings/select_graph.py --work <work> --out app/public/openings --core-min .. --chunk-min .. --early-floor ..
$PY -I tools/openings/finalize.py --work <work> --out app/public/openings
# 6. validation (also: selftest_pipeline.py = brute-force recount of the whole pipeline on a few thousand games)
$PY -I tools/openings/validate_openings.py --out app/public/openings --work <work> --json <work>/validation.json
```

The exact parameters of the shipped build are in `docs/openings-data.md`.
