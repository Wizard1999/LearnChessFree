// Opening statistics from top-level over-the-board games (built by tools/build_master_stats.py from The Week in Chess and Lichess
// broadcast archives; see docs). Loaded on demand; if the file is not part of this build, the Analysis page simply shows no card.
export interface MasterRow { uci: string; san: string; games: number; white: number; draw: number; black: number; avgElo: number; first: number; last: number }
export interface MasterInfo { games: number; minElo: number; maxPly: number; built: string }

let table: Promise<{ info: MasterInfo; tree: Record<string, (string | number)[][]> } | null> | null = null

export function loadMasters() {
  if (!table) {
    table = fetch(`${import.meta.env.BASE_URL}masters/stats.json`).then(r => (r.ok ? r.json() : null)).catch(() => null)
  }
  return table
}

export async function mastersFor(epd: string): Promise<{ info: MasterInfo; rows: MasterRow[] } | null> {
  const t = await loadMasters()
  if (!t) return null
  const rows = (t.tree[epd] ?? []).map(r => ({ uci: r[0] as string, san: r[1] as string, games: r[2] as number, white: r[3] as number, draw: r[4] as number, black: r[5] as number, avgElo: r[6] as number, first: r[7] as number, last: r[8] as number }))
  return { info: t.info, rows }
}
