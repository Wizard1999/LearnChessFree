import type { MasterRow } from './masters'

/** One display row of the top-level-games table. Counts are games, never evaluations. */
export interface MasterDisplayRow {
  uci: string
  san: string
  games: number
  /** Share of all games from this position that continued with this move, 0-100. */
  sharePct: number
  /** White / draw / Black percentages of this move's games; they always add to 100. */
  whitePct: number
  drawPct: number
  blackPct: number
  /** White's score (wins plus half the draws) as a percentage. */
  scorePct: number
  avgElo: number
  years: string
}

export interface MasterSummary {
  rows: MasterDisplayRow[]
  /** Games from this position across every continuation stored (not only the rows shown). */
  totalGames: number
  /** Continuations not shown because of the row limit, and the games in them. */
  hiddenMoves: number
  hiddenGames: number
}

export function yearSpan(first: number, last: number): string {
  if (!first && !last) return ''
  if (!first || first === last) return String(last || first)
  return `${first}–${last}`
}

/** Sort by games, cap the list, and turn counts into whole percentages that add to 100. */
export function summariseMasters(rows: MasterRow[], limit = 8): MasterSummary {
  const sorted = [...rows].sort((a, b) => b.games - a.games)
  const totalGames = sorted.reduce((s, r) => s + r.games, 0)
  const shown = sorted.slice(0, limit)
  const hidden = sorted.slice(limit)
  return {
    rows: shown.map(r => {
      const tot = r.white + r.draw + r.black
      const whitePct = tot ? Math.round((100 * r.white) / tot) : 0
      const blackPct = tot ? Math.round((100 * r.black) / tot) : 0
      const drawPct = tot ? Math.max(0, 100 - whitePct - blackPct) : 0
      return {
        uci: r.uci,
        san: r.san,
        games: r.games,
        sharePct: totalGames ? Math.round((100 * r.games) / totalGames) : 0,
        whitePct,
        drawPct,
        blackPct,
        scorePct: tot ? Math.round((100 * (r.white + r.draw / 2)) / tot) : 0,
        avgElo: r.avgElo,
        years: yearSpan(r.first, r.last),
      }
    }),
    totalGames,
    hiddenMoves: hidden.length,
    hiddenGames: hidden.reduce((s, r) => s + r.games, 0),
  }
}
