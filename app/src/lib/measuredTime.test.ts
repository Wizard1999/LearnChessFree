import { describe, expect, it } from 'vitest'
import { IDLE_CAP_MS, MIN_SAMPLES, StepTimer, measuredMinutes, median, paceText, typeMedians, worthRecording } from './measuredTime'
import type { LessonStep } from '../types'

describe('StepTimer', () => {
  it('counts plain time', () => { const t = new StepTimer(0); expect(t.stop(30_000)).toBe(30_000) })
  it('caps a long idle stretch at 90 seconds', () => { const t = new StepTimer(0); expect(t.stop(10 * 60_000)).toBe(IDLE_CAP_MS) })
  it('counts activity that breaks the idle stretch', () => {
    const t = new StepTimer(0); t.tick(60_000); t.tick(120_000); expect(t.stop(130_000)).toBe(130_000)
  })
  it('does not count time while the page is hidden', () => {
    const t = new StepTimer(0); t.setVisible(20_000, false); t.setVisible(500_000, true); expect(t.stop(510_000)).toBe(30_000)
  })
  it('never goes negative when the clock steps back', () => { const t = new StepTimer(1000); expect(t.stop(500)).toBe(0) })
})

describe('median and typeMedians', () => {
  it('takes the middle value', () => { expect(median([3, 1, 2])).toBe(2); expect(median([1, 2, 3, 4])).toBe(2.5); expect(median([])).toBeNull() })
  it('needs enough samples per type', () => {
    const rows = [...Array(MIN_SAMPLES).fill(0).map((_, i) => ({ type: 'card', ms: 10_000 + i })), ...Array(5).fill({ type: 'board', ms: 5000 })]
    const m = typeMedians(rows)
    expect(m.has('card')).toBe(true)
    expect(m.has('board')).toBe(false)
  })
  it('ignores bad values', () => { expect(typeMedians([{ type: 'card', ms: NaN }, { type: 'card', ms: -4 }], 1).size).toBe(0) })
})

describe('measuredMinutes', () => {
  const steps = [{ type: 'card', text: 'one two three' }, { type: 'item', item: 'I-1' }, { type: 'item', item: 'I-2' }] as unknown as LessonStep[]
  it('is null when nothing is measured', () => { expect(measuredMinutes(steps, new Map())).toBeNull(); expect(paceText(steps, new Map())).toBeNull() })
  it('swaps in the learner median for measured types and keeps the plan for the rest', () => {
    // two items at 3 minutes each, the card still planned (about 0.015 min)
    expect(measuredMinutes(steps, new Map([['item', 180_000]]))).toBe(6)
    expect(paceText(steps, new Map([['item', 180_000]]))).toBe('about 6 min at your pace')
  })
  it('handles lessons that are not loaded', () => { expect(paceText(undefined, new Map([['item', 1]]))).toBeNull() })
})

describe('worthRecording', () => {
  it('skips very short steps', () => { expect(worthRecording(400)).toBe(false); expect(worthRecording(4000)).toBe(true); expect(worthRecording(NaN)).toBe(false) })
})
