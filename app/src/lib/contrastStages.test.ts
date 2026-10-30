import { describe, expect, it } from 'vitest'
import { contrastStageLabel, contrastStages, guessEcho, nextContrastStage } from './contrastStages'

describe('contrast stages', () => {
  it('runs predict, working, failing, then irrelevant when present', () => {
    expect(contrastStages(true)).toEqual(['predict', 'working', 'failing', 'irrelevant'])
    expect(contrastStages(false)).toEqual(['predict', 'working', 'failing'])
  })
  it('advances one stage at a time and ends with null', () => {
    expect(nextContrastStage('predict', true)).toBe('working')
    expect(nextContrastStage('working', true)).toBe('failing')
    expect(nextContrastStage('failing', true)).toBe('irrelevant')
    expect(nextContrastStage('irrelevant', true)).toBeNull()
  })
  it('skips the irrelevant stage when the data has none', () => {
    expect(nextContrastStage('failing', false)).toBeNull()
    expect(nextContrastStage('irrelevant', false)).toBeNull()
  })
  it('labels every stage and echoes guesses', () => {
    for (const s of contrastStages(true)) expect(contrastStageLabel(s).length).toBeGreaterThan(0)
    expect(guessEcho('works')).toContain('survive')
    expect(guessEcho('fails')).toContain('break')
    expect(guessEcho(null)).toContain('No guess')
  })
})
