import { describe, expect, it } from 'vitest'
import { summariseMasters, yearSpan } from './mastersRows'
import type { MasterRow } from './masters'

const row = (uci: string, games: number, white: number, draw: number, black: number, first = 2000, last = 2020): MasterRow =>
  ({ uci, san: uci, games, white, draw, black, avgElo: 2600, first, last })

describe('yearSpan', () => {
  it('formats ranges and single years', () => {
    expect(yearSpan(2001, 2020)).toBe('2001–2020')
    expect(yearSpan(2020, 2020)).toBe('2020')
    expect(yearSpan(0, 0)).toBe('')
  })
})

describe('summariseMasters', () => {
  it('sorts by games, sums totals and keeps percentages at 100', () => {
    const s = summariseMasters([row('d2d4', 30, 10, 10, 10), row('e2e4', 70, 33, 34, 3)])
    expect(s.rows.map(r => r.uci)).toEqual(['e2e4', 'd2d4'])
    expect(s.totalGames).toBe(100)
    expect(s.rows[0].sharePct).toBe(70)
    for (const r of s.rows) expect(r.whitePct + r.drawPct + r.blackPct).toBe(100)
    expect(s.rows[1].scorePct).toBe(50)
  })
  it('reports moves hidden by the limit', () => {
    const s = summariseMasters([row('a', 10, 5, 0, 5), row('b', 5, 5, 0, 0), row('c', 2, 0, 2, 0)], 1)
    expect(s.rows).toHaveLength(1)
    expect(s.hiddenMoves).toBe(2)
    expect(s.hiddenGames).toBe(7)
  })
  it('handles empty input and zero-result rows', () => {
    expect(summariseMasters([]).totalGames).toBe(0)
    const z = summariseMasters([row('a', 0, 0, 0, 0)]).rows[0]
    expect(z.whitePct + z.drawPct + z.blackPct).toBe(0)
  })
})
