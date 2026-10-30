import { describe, expect, it, vi } from 'vitest'
import type { EngineLine } from '../engine'
import { askAboutSquare, captureMoves, evalChange, evalWords, formatVerdict, sanOf, SQUARE_ASK_CAUTION, type Analyse, type SquareAnswer } from './squareAsk'

const line = (value: number, pv: string[], kind: 'cp' | 'mate' = 'cp', depth = 12): EngineLine => ({ rank: 1, depth, kind, value, pv })
// White can take the d5 pawn with the rook or with the knight
const FEN = '4k3/8/8/3p4/8/2N5/8/3RK3 w - - 0 1'

describe('captureMoves', () => {
  it('lists every legal capture on the square', () => {
    expect(captureMoves(FEN, 'd5').sort()).toEqual(['c3d5', 'd1d5'])
  })
  it('is empty when nothing can capture there', () => {
    expect(captureMoves(FEN, 'a5')).toEqual([])
    expect(captureMoves('not a fen', 'd5')).toEqual([])
  })
  it('counts en passant', () => {
    expect(captureMoves('4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1', 'd6')).toEqual(['e5d6'])
  })
})

describe('sanOf', () => {
  it('writes standard notation and survives nonsense', () => {
    expect(sanOf(FEN, 'c3d5')).toBe('Nxd5')
    expect(sanOf(FEN, 'a1a2')).toBeNull()
    expect(sanOf(FEN, undefined)).toBeNull()
  })
})

describe('evalWords and evalChange', () => {
  it('uses pawns and signs', () => {
    expect(evalWords(line(35, ['e2e4']))).toBe('+0.35 pawns')
    expect(evalWords(line(-120, ['e2e4']))).toBe('-1.20 pawns')
    expect(evalWords(line(3, ['e2e4'], 'mate'))).toContain('mate in 3')
  })
  it('gives the change, or null with a mate', () => {
    expect(evalChange(line(100, []), line(40, []))).toBeCloseTo(-0.6)
    expect(evalChange(line(100, []), line(5, [], 'mate'))).toBeNull()
  })
})

describe('askAboutSquare', () => {
  it('runs one search for the top move and one limited to the captures', async () => {
    const analyse = vi.fn<Analyse>(async (_f, o) => (o.searchmoves ? [line(20, ['c3d5'])] : [line(80, ['d1d5'])]))
    const a = await askAboutSquare(FEN, 'd5', analyse)
    expect(analyse).toHaveBeenCalledTimes(2)
    expect(analyse.mock.calls[0][1]).toMatchObject({ depth: 12, multipv: 1 })
    expect([...(analyse.mock.calls[1][1].searchmoves ?? [])].sort()).toEqual(['c3d5', 'd1d5'])
    expect(a?.best?.san).toBe('Rxd5')
    expect(a?.capture?.san).toBe('Nxd5')
    expect(a?.mover).toBe('White')
  })
  it('skips the capture search when there is no capture', async () => {
    const analyse = vi.fn<Analyse>(async () => [line(10, ['e1e2'])])
    const a = await askAboutSquare(FEN, 'a5', analyse)
    expect(analyse).toHaveBeenCalledTimes(1)
    expect(a?.capture).toBeNull()
  })
  it('stops when cancelled and never starts the second search', async () => {
    let cancelled = false
    const analyse = vi.fn<Analyse>(async () => { cancelled = true; return [line(10, ['d1d5'])] })
    const a = await askAboutSquare(FEN, 'd5', analyse, () => cancelled)
    expect(a).toBeNull()
    expect(analyse).toHaveBeenCalledTimes(1)
  })
})

describe('formatVerdict', () => {
  const base = (over: Partial<SquareAnswer>): SquareAnswer => ({
    mover: 'White', square: 'd5', depth: 12,
    best: { san: 'Rxd5', uci: 'd1d5', line: line(80, ['d1d5']) },
    capture: { san: 'Nxd5', uci: 'c3d5', line: line(20, ['c3d5']) }, ...over,
  })
  it('names the top move, the change in pawns and the depth', () => {
    const t = formatVerdict(base({})).join(' ')
    expect(t).toContain('Rxd5')
    expect(t).toContain('-0.60 pawns')
    expect(t).toContain('worse by 0.60')
    expect(t).toContain('at depth 12')
  })
  it('says so when the capture is the top move', () => {
    const t = formatVerdict(base({ capture: { san: 'Rxd5', uci: 'd1d5', line: line(80, ['d1d5']) } })).join(' ')
    expect(t).toContain('also the engine')
  })
  it('says so when there is no capture or no move', () => {
    expect(formatVerdict(base({ capture: null })).join(' ')).toContain('no capture on d5')
    expect(formatVerdict(base({ best: null, capture: null }))[0]).toContain('no move')
  })
  it('handles mate and near-equal changes', () => {
    expect(formatVerdict(base({ capture: { san: 'Nxd5', uci: 'c3d5', line: line(2, ['c3d5'], 'mate') } })).join(' ')).toContain('mate in 2')
    expect(formatVerdict(base({ capture: { san: 'Nxd5', uci: 'c3d5', line: line(78, ['c3d5']) } })).join(' ')).toContain('almost nothing')
  })
  it('keeps the caution about sacrifices and tactics', () => {
    expect(SQUARE_ASK_CAUTION).toMatch(/sacrifices and tactics/)
  })
})
