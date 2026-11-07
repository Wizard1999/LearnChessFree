import { describe, expect, it } from 'vitest'
import { explanationIsReal, leadText, resultHeadline, resultKind, RESULT_LABEL } from './resultText'

describe('result vocabulary', () => {
  it('maps an attempt to one of three outcomes', () => {
    expect(resultKind(true, false)).toBe('correct')
    expect(resultKind(true, true)).toBe('sound-alternative')
    expect(resultKind(false, true)).toBe('unsuccessful')
    expect(RESULT_LABEL.correct).toBe('correct for this task')
    expect(RESULT_LABEL['sound-alternative']).toBe('sound alternative')
  })
  it('words the headline', () => {
    expect(resultHeadline('correct', 0)).toBe('Correct for this task.')
    expect(resultHeadline('correct', 2)).toMatch(/second look/)
    expect(resultHeadline('sound-alternative', 0)).toMatch(/sound alternative/i)
    expect(resultHeadline('unsuccessful', 1)).toMatch(/Unsuccessful/)
  })
})

describe('explanation first', () => {
  const claims = [{ statement: 'Nxe5 wins the pawn and keeps the knight protected' }]
  it('keeps a real explanation', () => {
    expect(explanationIsReal('The knight forks the king and rook, so one of them must fall next move.', claims)).toBe(true)
  })
  it('rejects empty, tiny and engine-only text', () => {
    expect(explanationIsReal('', claims)).toBe(false)
    expect(explanationIsReal('Good move.', claims)).toBe(false)
    expect(explanationIsReal('Stockfish at depth 20 gives +3.4 for this move.', claims)).toBe(false)
  })
  it('rejects text that only restates a checked claim', () => {
    expect(explanationIsReal('Nxe5 wins the pawn and keeps the knight protected.', claims)).toBe(false)
  })
  it('gives a neutral one-line lead when there is nothing written', () => {
    const l = leadText(undefined, claims)
    expect(l.written).toBe(false)
    expect(l.text).not.toMatch(/depth|centipawn|\d/)
    expect(leadText('The rook leaves its post, so the back rank is open.', claims).written).toBe(true)
  })
})
