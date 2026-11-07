import { describe, expect, it } from 'vitest'
import { contrastStageLabel, contrastStages, describeChange, GUESS_LABEL, guessEcho, nextContrastStage, promptRefersToChange } from './contrastStages'

describe('contrast stages', () => {
  it('shows the original first, then asks, then shows the changed position', () => {
    expect(contrastStages(true)).toEqual(['original', 'predict', 'failing', 'irrelevant'])
    expect(contrastStages(false)).toEqual(['original', 'predict', 'failing'])
  })
  it('never asks about a position before it has been shown: the original comes before every stage that carries a question', () => {
    for (const hasIrr of [true, false]) {
      const s = contrastStages(hasIrr)
      expect(s.indexOf('original')).toBe(0)
      expect(s.indexOf('predict')).toBeGreaterThan(s.indexOf('original'))
    }
  })
  it('advances one stage at a time and ends with null', () => {
    expect(nextContrastStage('original', true)).toBe('predict')
    expect(nextContrastStage('predict', true)).toBe('failing')
    expect(nextContrastStage('failing', true)).toBe('irrelevant')
    expect(nextContrastStage('irrelevant', true)).toBeNull()
  })
  it('skips the irrelevant stage when the data has none', () => {
    expect(nextContrastStage('failing', false)).toBeNull()
    expect(nextContrastStage('irrelevant', false)).toBeNull()
  })
  it('labels every stage and echoes guesses', () => {
    for (const s of contrastStages(true)) expect(contrastStageLabel(s).length).toBeGreaterThan(0)
    expect(Object.keys(GUESS_LABEL)).toHaveLength(3)
    expect(guessEcho('works')).toContain('survive')
    expect(guessEcho('fails')).toContain('break')
    expect(guessEcho(null)).toContain('No guess')
  })
})

describe('naming the single change', () => {
  const A = '4k3/8/8/8/8/8/8/4K2R w - - 0 1'
  it('a moved piece', () => {
    expect(describeChange(A, '3k4/8/8/8/8/8/8/4K2R w - - 0 1')).toBe('The black king moves from e8 to d8.')
  })
  it('a removed and an added piece', () => {
    expect(describeChange(A, '4k3/8/8/8/8/8/8/4K3 w - - 0 1')).toBe('The white rook on h1 is taken off the board.')
    expect(describeChange('4k3/8/8/8/8/8/8/4K3 w - - 0 1', A)).toBe('A white rook is added on h1.')
  })
  it('a replaced piece', () => {
    expect(describeChange(A, '4k3/8/8/8/8/8/8/4K2Q w - - 0 1')).toBe('The white rook on h1 is replaced by a white queen.')
  })
  it('only the turn, or nothing', () => {
    expect(describeChange(A, A.replace(' w ', ' b '))).toMatch(/whose turn/)
    expect(describeChange(A, A)).toBeNull()
  })
  it('detects prompts that refer to a changed square or piece', () => {
    expect(promptRefersToChange('The king now stands on d8. Does the fork still work?')).toBe(true)
    expect(promptRefersToChange('Will it still work after a small change?')).toBe(false)
  })
})
