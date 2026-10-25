# Openings explorer data (static JSON, computed by us from CC0 Lichess games)

Output: `app/public/openings/` (contract in `app/public/openings/README.md`; the app loads it in `app/src/lib/openingsData.ts`). Pipeline: `tools/openings/` (run notes in `tools/openings/RUNNING.md`). Evidence labels: **[V]** measured here, **[I]** inference, **[R]** recalled, not checked.

## What it is

A position-keyed graph: a node is a **position** (EPD from python-chess, id = first 10 hex of sha1(EPD)), an edge is (parent position, move) with games, White wins and draws per rating band. Move orders that transpose merge into one node with several parents. Names come from `lichess-org/chess-openings` (CC0, 3,865 lines, 3,865 distinct final positions [V]), matched when a node's position equals the final position of a named line. Lichess games are CC0; both licences allow shipping derived counts.

## Source and exact sampling [V unless noted]

* File: `lichess_db_standard_rated_2026-09.pgn.zst`, 29,224,520,887 bytes. **It is not one zstd stream.** It is a chain of `[12-byte skippable header][zstd frame]` pairs (pzstd layout); the header holds the compressed size (50 2A 4D 18, 04 00 00 00, u32), every frame is independent, decodes to exactly 32 MiB of PGN (about 14,400 games, 3 to 15 minutes of play depending on the hour) and cuts games in the middle. So frames can be fetched with HTTP Range requests anywhere in the file.
* Instead of "the first N games" (which would be the first ~4 days of the month: the first 4 GB of the file covers roughly 1 to 4 September) we took a **stratified random sample of single frames**: the file was cut into 520 equal byte strata and one frame was drawn at random (seed 20260924) inside each. The sample therefore spans 2026-09-01 00:00 to 2026-09-30 22:40 UTC, all 30 days (229,470 to 273,818 games per day in the sample, weekday shares 12.6 to 16.9 %, Tue/Wed higher only because September 2026 has five of each) and every hour of the day (hour shares 1.6 % to 6.5 %, following Lichess traffic). Frame boundaries beyond the head of the file were found by predicting from the last exact boundary and reading a short window until the 8-byte skippable signature appeared (469 frames), the first 51 frames came from an exact index of the chain (`index_frames.py`). The first and last (cut) game of every frame is dropped.
* Scanned: **7,503,458 games** in the 520 frames. Event speed: Blitz 3,451,953, Bullet 2,654,805, Rapid 1,274,476, UltraBullet 67,841, Classical 46,734, Correspondence 7,649. **Used (Blitz + Rapid + Classical, numeric ratings, decisive or drawn, at least one move): 4,752,291** (63.3 % of scanned). Dropped for no moves 9,820 and for unfinished result 11,052. Results of used games: White 2,361,260, draws 210,368, Black 2,180,663.
* Parsing (`pgnscan.py`, no python-chess): comments `{...}` stripped, move numbers and results dropped, `!?` glyphs stripped, first 16 SAN tokens kept. Event words seen: "Rated X game", "Rated X tournament …", and "X swiss …" (no "Rated" prefix) were all handled.
* Band = average of WhiteElo and BlackElo (half-open on the real-valued average; the top band is 2100 and above, max written as 9999).

| band | id | games used | share |
|---|---|---:|---:|
| Below 900 | u900 | 177,947 | 3.7 % |
| 900-1100 | b900 | 366,802 | 7.7 % |
| 1100-1300 | b1100 | 584,692 | 12.3 % |
| 1300-1500 | b1300 | 812,466 | 17.1 % |
| 1500-1700 | b1500 | 977,309 | 20.6 % |
| 1700-1900 | b1700 | 925,796 | 19.5 % |
| 1900-2100 | b1900 | 593,223 | 12.5 % |
| 2100+ (online) | b2100 | 314,056 | 6.6 % |

**Biases and limits (read before trusting a number).** (1) Online games between Lichess users, not master or over-the-board data; the top band is 2100+ online (Glicko-2 ratings run higher than FIDE/USCF at the same strength [R]). (2) Bullet, UltraBullet and Correspondence excluded by rule; they would change opening choice. (3) One 3 to 15 minute contiguous window per stratum: the same players recur inside a window, and busy hours carry more games (proportional to traffic). Frames are fixed 32 MiB, so each frame has about the same number of games and every frame has the same chance of selection [I]. (4) One month; September 2026 only. (5) Lines are counted by games, not by distinct players; a heavy player of one line inflates it. (6) White score is not engine-evaluated strength: it reflects who plays the line at what rating. (7) Counts for the lowest bands are small (u900 has 178k games): deep nodes have 0 to a few games in that band, see "Using it".

## Method (tools/openings)

1. `scan.py`: stratified frame sample, parse, one parquet part per 6 MB block: (band, result, nplies, SAN string). about 35 minutes in two runs (6 worker processes, ~5 MB of network per frame).
2. `build_trie.py` (DuckDB, 24 s): hash every move prefix (64-bit), count games, White wins, draws per band for prefixes of 1..16 plies; keep prefixes occurring **at least twice** (c0 = 2; 3,113,909 distinct prefixes kept). No hash collisions (distinct child hashes = distinct (parent, child) pairs at every ply).
3. `replay.py` (63 s on 6 processes): each retained prefix replayed once with python-chess (DFS push/pop; the ply-3 subtrees are spread over 48 buckets) -> position key (blake2b-8 of the EPD) and UCI. 0 illegal-SAN records.
4. `build_graph.py prep`: join into tables NODE (1,489,146 distinct positions from 3,113,909 prefixes: merging removes 52 % of the nodes), PE (1,727,286 (position, move) edges), FE (forward edges). A node's `p` is its minimum ply; **only edges from ply p to p+1 are kept**. Moves that return to an earlier position (Nf3 Nf6 Ng1 Ng8) are dropped from the edge list: 2,473 edges, 13,987 visits = 0.028 % of visits. Their visits stay in node counts, so the graph is acyclic and the UI cannot loop.
5. `select_graph.py`: level-by-level reachability from the root with the thresholds below; for every kept node the most common move order of length p (min-ply prefix with most games, followed up the trie) as `path`; EPD by replaying the path (position-key check: 0 mismatches over 107,723 nodes); name; id = sha1(EPD)[:10] (0 collisions, extension rule in place); chunking.
6. `finalize.py` writes the manifest and README; `validate_openings.py` the checks below; `selftest_pipeline.py` an independent recount.

### Thresholds (what "least common line kept" means)

* Plies 6 to 8 (core): edge kept if total games over bands **>= 130** (`minCountCore`), i.e. one game in about 36,000.
* Edges out of nodes at ply <= 4 (target plies 1 to 5): kept if **>= 80** games. This replaces "keep ALL edges out of ply<=4 nodes": literally all would have meant ~50,000 ply-5 edges of 2 to 80 games each, far over the 6 MB core budget. Ply 1 is complete (all 20 moves, min 529 games), ply 2 has 248 of the 390 observed replies (min 82).
* Plies 9 to 16 (chunks): **>= 17** games (`minCountChunk`), one in about 280,000. Median kept deep edge: 35 games, 65 % have fewer than 50 total, so in a single band most deep counts are tiny (share of deep edges with at least 10 games in one band: u900 1.9 %, 1500-1700 40.4 %, 2100+ 16.1 %; with at least 30: 0.3 %, 11.3 %, 5.0 %). The UI should hide percentages when the band's node count is small.
* Tuned to the budget: core 130/80 gives core.json 5.82 MB; chunk 17 gives 50.6 MB of chunks (chunk 15 gives 63 MB in total, over budget).

## Result

| | |
|---|---|
| nodes / edges | 107,723 / 123,580 (core: 16,840 nodes, 20,633 edges, plies 0-8; deep: ply 9-16) |
| core.json | 5.82 MB raw |
| chunks | 35 files, 50.64 MB total, largest 1.50 MB, mean 1.45 MB (+ chunks.json 98 KB) |
| app/public/openings total | 56.56 MB raw (limit 60), manifest + README small |
| boundary nodes (ply 8 with deeper lines) | 3,753, mapped to the 35 chunks |
| nodes per ply 0..16 | 1, 20, 248, 858, 1,978, 3,186, 3,174, 3,622, 3,753, 12,748, 17,582, 17,611, 15,228, 11,438, 7,902, 5,104, 3,270 |
| named nodes | 2,195 (2.0 % of nodes; positions equal to the end of a named line) |

Chunks are packed by sorting boundary nodes by `path` and filling files up to 1.5 MB, so related lines share a file. Deep positions reachable from several chunks are **duplicated** in each (identical entries): 61,965 duplicated node entries and 65,521 duplicated edge entries, roughly 40 % of the chunk bytes. A smarter packing (cluster boundary nodes by shared descendants) would shrink this and allow a lower `minCountChunk`; not done.

## Validation [V] (`library/data/openings-work/full/validation.txt`)

* **Structure:** 0 problems: every edge endpoint exists, every edge goes p -> p+1, w+d <= n on every edge, core nodes have p <= 8, chunk nodes 9..16, `chunks.json` agrees with the `c` fields, all ids equal sha1(EPD) prefixes.
* **(1) Ply-1 sanity.** e4 **61.4 %** overall, d4 25.3 %, Nf3 3.1 %, c4 2.9 %, e3 1.6 %, g3 1.1 %, f4 1.1 %, b3 1.0 %. This is **above** the 45 to 55 % expected in the brief. By band e4 falls steadily with rating: 66.3 / 66.4 / 65.7 / 64.3 / 62.3 / 59.8 / 56.0 / 50.0 % (u900 to 2100+), d4 rises 19.8 -> 31.4 %, Nf3 2.8 -> 7.4 %, c4 1.3 -> 5.5 %. Cross-check by an independent regex on one raw frame (no pipeline code): e4 60.3 % of 9,026 qualifying games. We read this as a property of the population (the bulk of games are 900-1900 players, who play e4 most) and not as a parsing error; the 2100+ band (50 % e4, 31 % d4) looks like strong online play [I]. The expectation of 45-55 % may suit master/OTB or high-rated data, not this mixture [I]. White's score after 1.e4 is 51.3 to 52.8 % in every band, after 1.d4 52.3 to 52.8 % [V].
* **(2) Conservation.** For all 64,971 nodes with outgoing edges, sum(out n) <= node n in every band: **0 violations**; equality in all bands for 3,986 nodes. Overall the shown edges carry 88.4 % of the visits of non-final nodes; 8.7 % of the retained continuations (edges existing at the prefix level) were pruned by the thresholds (core plies 0-7: 6.9 % pruned, 92.5 % of visits shown); the rest of the missing mass (3.2 % of visits) is games that ended, were cut at 16 plies, or lines occurring once (below the c0 = 2 floor). The pruned share grows with depth: nodes at ply 9 show 81.6 % of visits, ply 12 62.6 %, ply 15 57.9 %.
* **(3) Transpositions.** 13,793 of 107,723 nodes (12.8 %) have more than one parent. The 15 nodes with the most parents at plies 4-8 (full list in the validation file) include: Pirc Classical (B08, ply 7, 4 orders: e4 d6 d4 Nf6 Nc3 g6 Nf3 [4,911 games], e4 d6 Nf3 Nf6 Nc3 g6 d4 [3,603], e4 d6 Nf3 Nf6 d4 g6 Nc3 [462], d4 d6 Nf3 Nf6 Nc3 g6 e4 [339]); Modern Defense Two Knights (B06, 4 orders incl. a 1.d4 route); Three Knights (C46: e4 e5 Nf3 Nc6 Nc3 [58,470] | e4 e5 Nc3 Nc6 Nf3 [13,246] | Nc3 e5 Nf3 Nc6 e4 [756]); Four Knights (C47: Nc6 first or Nf6 first, 36,671 vs 18,638); Caro-Kann Advance (B12), French Advance (C02); QGD-type positions after d4 d5 c4 e6 e3 Nf6 Nf3 (4 orders, n 5,053); a King's Indian / Modern type setup reached from 1.d4 and from 1.e4 g6 (n 1,987); a London System position with 4 orders. Reti/King's Indian Attack style transpositions appear at plies 7-8 (e.g. Nf3 d5 g3 Nc6 Bg2 e5 d3 Nf6, reached from 1.Nf3 and from 1.g3, with ...Nc6 or ...e5 first).
* **(4) Names.** Of the top 500 nodes by count, 272 (54.4 %) have an exact name; **all 500 (100 %) have a name on the node or an ancestor on the path**. Overall 2.0 % of nodes are named (named positions end at ply 4 for 9.1 % of ply-4 nodes, 4.4 % at ply 8). The app's `nameOf` (nearest named ancestor) is therefore essential. Biggest unnamed nodes: e4 d5 exd5 (198,116 games), e4 d5 exd5 Qxd5 Nc3 (101,222), e4 c6 Nf3 (70,323).
* **(5) Round trip.** 20 random edges (seed 7) rebuilt from the start position by replaying `path` and the UCI with python-chess: 20/20 ok (EPD, id, SAN of the move). All 107,723 ids equal sha1(EPD) prefixes.
* **(6) Independent recount of the whole pipeline.** `selftest_pipeline.py` runs trie -> replay -> position tables with no pruning on 90,862 real games and compares every position's visits per band and every (position, move) edge's n/w/d per band with a brute-force python-chess replay of every game: 653,873 positions and 686,309 edges, **PASS (exact equality)** [V]. (Thresholds and chunking are not covered by this test; they are covered by 1-5.)

## Using it (for the app)

* Probability of a move in band b: `edge.n[b] / node.n[b]`; hide it when `node.n[b]` is small (suggest < 30). Win/draw/loss: `w`, `d`, `n-w-d` (White's point of view).
* Total games at the root = `bands[].games` summed = 4,752,291. A node's `n` counts all visits, including through pruned edges, so shown moves do not always add up to 100 % (the gap is the "other moves" share).
* Chunks: `core.json` nodes of ply 8 with `c` need a chunk; a chunk file also contains edges leaving that boundary node and deeper nodes; duplicated entries across chunks are identical (merge by id and by `f`+`u`, as `mergeInto` does).

## Cost and deviations from the brief (stated plainly)

* **Download.** Production sampling transferred about 2.94 GB (first run 1.76 GB until a restart that cut the per-frame overhead, then 1.18 GB). Before the structure of the file was known, an exploratory prefix of 1.45 GB was downloaded (26 of its frames are in the sample). Total network use ≈ **4.4 GB**, about 10 % over the 4 GB budget if the exploratory prefix is counted, within it if only the production run is. The unused prefix and all intermediate data are in `library/data/openings-work/` (gitignored, ~15 GB; deletable, the output is already in `app/public/openings/`).
* **Games: 4.75 M used, below the 6-10 M target.** The cap and the 36.7 % bullet/other share limit it; more is possible by rerunning `scan.py` with more strata (about 5 MB and 9,100 usable games per frame).
* **Sampling:** frames over the whole month instead of the first N games (an improvement on time coverage; same bias class otherwise).
* **Thresholds:** the "all edges out of ply <= 4" rule became a floor of 80 games; the manifest's `minCountCore` (130) applies to plies 6-8, `minCountChunk` (17) to 9-16.
* **Chunks:** nodes are duplicated across chunk files (~40 % of chunk bytes), see above. Core.json is 5.82 MB (limit 6).
* **Lines with fewer than 2 occurrences** at the prefix level are never counted (c0 = 2): a position that is reached by many different move orders, each occurring once, loses those visits. At ply 16 only 9.3 % of games lie on a prefix that occurs twice or more.

## Rerun

```
PY=tools/.venv/Scripts/python.exe     # always -I
W=library/data/openings-work/full
$PY -I tools/openings/index_frames.py --head <head.zst> --out $W/frames_index.json   # optional, polite: ~1 request / 1.3 s
$PY -I tools/openings/scan.py run --work $W --index $W/frames_index.json --head <head.zst> --f 520 --procs 6
$PY -I tools/openings/build_trie.py --work $W --c0 2 --threads 5
$PY -I tools/openings/replay.py --work $W --procs 6
$PY -I tools/openings/build_graph.py prep --work $W
$PY -I tools/openings/select_graph.py --work $W --out app/public/openings --core-min 130 --chunk-min 17 --early-floor 80 --procs 6
$PY -I tools/openings/finalize.py --work $W --out app/public/openings
$PY -I tools/openings/validate_openings.py --out app/public/openings --work $W --json $W/validation.json
$PY -I tools/openings/selftest_pipeline.py --parts $W/games --work library/data/openings-work/mini --max-parts 60
```
The sample is reproducible from seed 20260924 only if the same dump file is used (the file at database.lichess.org is the 2026-09 month; its ETag was 6ac08d73-6cdeaccb7 when fetched).
