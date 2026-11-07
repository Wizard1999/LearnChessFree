import { describe, expect, it } from 'vitest'
import { betai, describeMastery, masteryOf, probAtLeast } from './mastery'
import { isDue, nextDue } from './schedule'
import type { Attempt } from '../db'

const DAY = 86400000
const T0 = 1_700_000_000_000
const att = (over: Partial<Attempt>): Attempt => ({ family: over.family ?? over.itemId ?? 'i', // families follow the item id unless a test sets one
  itemId: 'i', skillKey: 'X.D1', cue: 3, correct: true, firstAttempt: true, hints: 0, timeMs: 1000, source: 'practice', ts: T0, unprompted: true, ...over,
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
  it('different exercises from one family count half', () => {
    const fam = Array.from({ length: 10 }, (_, i) => att({ itemId: `i${i}`, family: 'same', ts: T0 + i }))
    const m = masteryOf(fam, { now: T0 + 100 })
    expect(m.unlabeledWeight).toBeCloseTo(1 + 9 * 0.5, 9); expect(m.state).toBe('practising') // ten near-duplicates are not enough
    const few = fam.slice(0, 5)
    expect(masteryOf(few, { now: T0 + 100 }).unlabeledWeight).toBeCloseTo(1 + 4 * 0.5, 9)
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

describe('independent evidence only (roadmap 2h)', () => {
  const guided = (n: number) => Array.from({ length: n }, (_, i) => att({ itemId: `g${i}`, cue: i % 2 ? 1 : 2, ts: T0 + i }))
  const indep = (n: number, over: Partial<Attempt> = {}, off = 1000) => Array.from({ length: n }, (_, i) => att({ itemId: `i${i}`, ts: T0 + off + i, ...over }))
  it('100 guided successes plus 5 independent successes is not reliable, and the old Beta(56,1) cannot arise', () => {
    const m = masteryOf([...guided(100), ...indep(5)], { now: T0 + 5000 })
    expect(m.state).toBe('practising'); expect(m.reliableNow).toBe(false)
    expect(m.a).toBeCloseTo(6, 9); expect(m.b).toBeCloseTo(1, 9)
    expect(m.pReliable).toBeLessThan(0.85)
    expect(m.guidedN).toBe(100); expect(m.n).toBe(5)
  })
  it('guided attempts never change the reliability probability, only the counts', () => {
    const base = masteryOf(indep(6), { now: T0 + 5000 })
    const withGuided = masteryOf([...guided(50), ...indep(6)], { now: T0 + 5000 })
    expect(withGuided.pReliable).toBeCloseTo(base.pReliable, 12); expect(withGuided.state).toBe(base.state)
  })
  it('guided failures do not lower the reliable state either', () => {
    const bad = Array.from({ length: 20 }, (_, i) => att({ itemId: `bad${i}`, cue: 1, correct: false, ts: T0 + i }))
    expect(masteryOf([...bad, ...indep(10)], { now: T0 + 5000 }).state).toBe('reliable')
  })
  it('repeated families and repeated exercises count less, even across guided and independent', () => {
    const fam = Array.from({ length: 12 }, (_, i) => att({ itemId: `f${i}`, family: 'one', ts: T0 + i }))
    expect(masteryOf(fam, { now: T0 + 100 }).state).toBe('practising')
    const seenGuided = [att({ itemId: 'x', cue: 1, ts: T0 }), att({ itemId: 'x', cue: 3, ts: T0 + 1 })]
    expect(masteryOf(seenGuided, { now: T0 + 10 }).unlabeledWeight).toBeCloseTo(0.25, 9)
  })
  it('hinted answers do not count as success and count against the posterior', () => {
    const m = masteryOf(indep(12, { hints: 1 }), { now: T0 + 5000 })
    expect(m.ok).toBe(0); expect(m.state).toBe('practising'); expect(m.lastIndependentSuccess).toBeNull()
  })
  it('a lesson answer is guided even at cue 3, also in a depth that has only cued exercises', () => {
    const lesson = Array.from({ length: 10 }, (_, i) => att({ itemId: `l${i}`, cue: 3, source: 'lesson', ts: T0 + i }))
    expect(masteryOf(lesson, { now: T0 + 100 }).state).toBe('introduced')
    expect(masteryOf(lesson, { now: T0 + 100, cuedOnly: true }).state).toBe('introduced')
  })
  it('long inactivity: reliable turns to refresh, with the accomplishment date kept', () => {
    const m = masteryOf(indep(10), { now: T0 + 1000 + 60 * DAY })
    expect(m.state).toBe('refresh'); expect(m.wasReliableOn).not.toBeNull()
    expect(describeMastery(m)).toMatch(/^Was reliable on \d{4}-\d\d-\d\d/)
  })
  it('a recent failed attempt does not refresh the clock: old record + recent miss shows "was reliable, recent check missed"', () => {
    const old = indep(10)
    const miss = att({ itemId: 'late', correct: false, ts: T0 + 1000 + 39 * DAY })
    const m = masteryOf([...old, miss], { now: T0 + 1000 + 40 * DAY })
    expect(m.lastIndependentSuccess).toBe(T0 + 1000 + 9)
    expect(m.recentMiss).toBe(true); expect(m.state).toBe('refresh')
    expect(describeMastery(m)).toContain('Was reliable on'); expect(describeMastery(m)).toContain('recent check was missed')
  })
  it('a fresh success after the old record keeps it reliable and restarts the clock', () => {
    const m = masteryOf([...indep(10), att({ itemId: 'again', ts: T0 + 1000 + 39 * DAY })], { now: T0 + 1000 + 40 * DAY })
    expect(m.state).toBe('reliable'); expect(m.lastIndependentSuccess).toBe(T0 + 1000 + 39 * DAY)
  })
  it('describes counts and dates, never a probability', () => {
    const r = masteryOf(indep(10), { now: T0 + 5000 })
    const text = describeMastery(r)
    expect(text).toMatch(/Demonstrated in independent checks \(10 counted, last on \d{4}-\d\d-\d\d\)/)
    expect(text).not.toMatch(/%|probab/i)
    expect(describeMastery(masteryOf([...guided(3), ...indep(2)], { now: T0 + 5000 }))).not.toMatch(/%|probab/i)
  })
  it('placement results count like any other independent attempt, and a wrong warm-up answer is left out upstream', () => {
    const placed = Array.from({ length: 6 }, (_, i) => att({ itemId: `p${i}`, source: 'placement', ts: T0 + i }))
    expect(masteryOf(placed, { now: T0 + 100 }).n).toBe(6)
  })
})

describe('spacing', () => {
  // local-calendar dates: due dates follow the learner's day, not UTC midnight
  const at = (y: number, mo: number, d: number, h = 12) => new Date(y, mo, d, h).getTime()
  const midnight = (y: number, mo: number, d: number) => new Date(y, mo, d).getTime()
  it('a failed day is due the next local day', () => {
    expect(nextDue([att({ ts: at(2026, 5, 1, 23), correct: false })])).toBe(midnight(2026, 5, 2))
  })
  it('a late-evening answer belongs to that evening, whatever UTC says', () => {
    const lateOk = [att({ ts: at(2026, 5, 1, 23, ) })]
    expect(nextDue(lateOk)).toBe(midnight(2026, 5, 2))
  })
  it('intervals grow with consecutive good days', () => {
    const list = [1, 2, 4].map((d, k) => att({ itemId: `d${k}`, ts: at(2026, 5, d) }))
    expect(nextDue(list)).toBe(midnight(2026, 5, 4 + 4))
  })
  it('isDue compares with now', () => {
    const list = [att({ ts: at(2026, 5, 1) })]
    expect(isDue(list, at(2026, 5, 1, 23))).toBe(false)
    expect(isDue(list, at(2026, 5, 3))).toBe(true)
  })
  it('assisted repetition is not a fresh demonstration', () => {
    const first = att({ itemId: 'a', ts: at(2026, 5, 1), correct: false })
    const repeatOk = att({ itemId: 'a', ts: at(2026, 5, 2), correct: true }) // same exercise again: memory, not skill
    const inLesson = att({ itemId: 'b', ts: at(2026, 5, 2), source: 'lesson', correct: true })
    expect(nextDue([first, repeatOk, inLesson])).toBe(midnight(2026, 5, 2)) // still the failed day
    const fresh = att({ itemId: 'c', ts: at(2026, 5, 2), correct: true })
    expect(nextDue([first, fresh])).toBe(midnight(2026, 5, 3))
  })
})
