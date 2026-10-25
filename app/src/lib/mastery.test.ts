import { describe, expect, it } from 'vitest'
import { betai, masteryOf, probAtLeast } from './mastery'
import { isDue, nextDue } from './schedule'
import type { Attempt } from '../db'

const DAY = 86400000
const T0 = 1_700_000_000_000
const att = (over: Partial<Attempt>): Attempt => ({
  itemId: 'i', skillKey: 'X.D1', cue: 3, family: 'F', correct: true, firstAttempt: true, hints: 0, timeMs: 1000, source: 'practice', ts: T0, unprompted: true, ...over,
})

describe('beta function', () => {
  it('matches known values', () => {
    expect(betai(2, 3, 0.5)).toBeCloseTo(0.6875, 6)
    expect(probAtLeast(7, 1, 0.8)).toBeCloseTo(1 - Math.pow(0.8, 7), 6)
    expect(betai(1, 1, 0.3)).toBeCloseTo(0.3, 9)
  })
})

describe('mastery', () => {
  it('is unseen with no evidence', () => expect(masteryOf([]).state).toBe('unseen'))
  it('cued evidence alone never makes a skill reliable', () => {
    const at = Array.from({ length: 30 }, (_, i) => att({ itemId: `i${i}`, cue: 1, ts: T0 + i }))
    expect(masteryOf(at, { now: T0 + 100 }).state).toBe('introduced')
  })
  it('needs enough unlabeled successes', () => {
    const few = Array.from({ length: 4 }, (_, i) => att({ itemId: `i${i}`, ts: T0 + i }))
    expect(masteryOf(few, { now: T0 + 10 }).state).toBe('practising')
    const many = Array.from({ length: 10 }, (_, i) => att({ itemId: `i${i}`, ts: T0 + i }))
    expect(masteryOf(many, { now: T0 + 100 }).state).toBe('reliable')
  })
  it('hint-assisted successes do not count as independent', () => {
    const hinted = Array.from({ length: 12 }, (_, i) => att({ itemId: `i${i}`, hints: 1, ts: T0 + i }))
    expect(masteryOf(hinted, { now: T0 + 100 }).state).toBe('practising')
  })
  it('retries are ignored as evidence', () => {
    const base = Array.from({ length: 10 }, (_, i) => att({ itemId: `i${i}`, ts: T0 + i }))
    const noisy = [...base, ...Array.from({ length: 20 }, (_, i) => att({ correct: false, firstAttempt: false, ts: T0 + 50 + i }))]
    expect(masteryOf(noisy, { now: T0 + 100 }).state).toBe('reliable')
  })
  it('turns to refresh after a long gap', () => {
    const many = Array.from({ length: 10 }, (_, i) => att({ itemId: `i${i}`, ts: T0 + i }))
    expect(masteryOf(many, { now: T0 + 40 * DAY }).state).toBe('refresh')
  })
  it('the same exercise answered again adds a quarter of the evidence, and later times add nothing', () => {
    const eight = Array.from({ length: 8 }, (_, i) => att({ itemId: `i${i}`, ts: T0 + i }))
    expect(masteryOf(eight, { now: T0 + 100 }).state).toBe('reliable')
    const oneRepeated = Array.from({ length: 8 }, (_, i) => att({ ts: T0 + i })) // eight presentations of one exercise
    const m = masteryOf(oneRepeated, { now: T0 + 100 })
    expect(m.state).not.toBe('reliable')
    expect(m.unlabeledWeight).toBeCloseTo(1.25, 9)
  })
  it('answers given inside a lesson count at cue 2 at most: the lesson has just named the idea', () => {
    const inLesson = Array.from({ length: 10 }, (_, i) => att({ itemId: `i${i}`, cue: 3, source: 'lesson', ts: T0 + i }))
    expect(masteryOf(inLesson, { now: T0 + 100 }).state).toBe('introduced')
  })
  it('a depth with only cued exercises can become reliable on cued evidence, and says so', () => {
    const cued = Array.from({ length: 10 }, (_, i) => att({ itemId: `i${i}`, cue: 1, ts: T0 + i }))
    expect(masteryOf(cued, { now: T0 + 100 }).state).toBe('introduced')
    const m = masteryOf(cued, { now: T0 + 100, cuedOnly: true })
    expect(m.state).toBe('reliable'); expect(m.cuedOnly).toBe(true)
    expect(masteryOf(cued.slice(0, 2), { now: T0 + 100, cuedOnly: true }).state).toBe('practising') // enough to count as started
  })
  it('the refresher clock runs from the last answer that counts, not from a cue-1 lesson answer', () => {
    const real = Array.from({ length: 10 }, (_, i) => att({ itemId: `i${i}`, ts: T0 + i }))
    const lesson = att({ itemId: 'lesson-q', cue: 1, source: 'lesson', ts: T0 + 39 * DAY })
    expect(masteryOf([...real, lesson], { now: T0 + 40 * DAY }).state).toBe('refresh')
  })
  it('mixed results keep it from being reliable', () => {
    const mixed = Array.from({ length: 12 }, (_, i) => att({ itemId: `i${i}`, correct: i % 2 === 0, ts: T0 + i }))
    expect(masteryOf(mixed, { now: T0 + 100 }).state).not.toBe('reliable')
  })
})

describe('spacing', () => {
  const base = 20000 * DAY
  it('a failed day is due the next day', () => {
    expect(nextDue([att({ ts: base, correct: false })])).toBe(base + DAY)
  })
  it('intervals grow with consecutive good days', () => {
    const at = [0, 1, 3].map(k => att({ ts: base + k * DAY }))
    expect(nextDue(at)! - (base + 3 * DAY)).toBe(4 * DAY)
  })
  it('isDue compares with now', () => {
    const at = [att({ ts: base })]
    expect(isDue(at, base + 12 * 3600000)).toBe(false)
    expect(isDue(at, base + 2 * DAY)).toBe(true)
  })
})
