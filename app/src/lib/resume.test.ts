import { describe, expect, it } from 'vitest'
import { finishedEarlierVersion, indexOfSid, placeOf, planResume } from './resume'

const lesson = (sids: string[], revision = 'r2') => ({ stepRefs: sids.map(sid => ({ sid })), revision })

describe('planResume', () => {
  it('starts at the beginning with nothing saved, a finished lesson or step 0', () => {
    expect(planResume(undefined, lesson(['a', 'b']))).toEqual({ kind: 'start' })
    expect(planResume({ step: 3, done: true, revision: 'r2' }, lesson(['a', 'b', 'c', 'd']))).toEqual({ kind: 'start' })
    expect(planResume({ step: 0, revision: 'r2' }, lesson(['a', 'b']))).toEqual({ kind: 'start' })
  })
  it('resumes by step id when the revision is the same', () => {
    expect(planResume({ step: 2, sid: 'c', revision: 'r2' }, lesson(['a', 'b', 'c', 'd']))).toEqual({ kind: 'resume', step: 2, how: 'sid', mapped: false })
  })
  it('falls back to the index when the id is missing and the revision is the same', () => {
    expect(planResume({ step: 1, revision: 'r2' }, lesson(['a', 'b', 'c']))).toEqual({ kind: 'resume', step: 1, how: 'index', mapped: false })
    expect(planResume({ step: 9, sid: 'zz', revision: 'r2' }, lesson(['a', 'b']))).toEqual({ kind: 'start' })
  })
  it('maps by step id after a rewrite that added steps before the place', () => {
    expect(planResume({ step: 2, sid: 'c', revision: 'r1' }, lesson(['a', 'new1', 'new2', 'b', 'c', 'd']))).toEqual({ kind: 'resume', step: 4, how: 'sid', mapped: true })
  })
  it('maps by step id after steps were reordered, and starts over if the place became the first step', () => {
    expect(planResume({ step: 5, sid: 'f', revision: 'r1' }, lesson(['f', 'a', 'b']))).toEqual({ kind: 'start' })
    expect(planResume({ step: 5, sid: 'f', revision: 'r1' }, lesson(['a', 'f', 'b']))).toEqual({ kind: 'resume', step: 1, how: 'sid', mapped: true })
  })
  it('asks when the step was renamed or removed and the lesson changed', () => {
    expect(planResume({ step: 3, sid: 'gone', revision: 'r1' }, lesson(['a', 'b', 'c', 'd', 'e']))).toEqual({ kind: 'ask', near: 3 })
    expect(planResume({ step: 3, revision: 'r1' }, lesson(['a', 'b', 'c', 'd']))).toEqual({ kind: 'ask', near: 3 })
  })
  it('clamps "near where you were" into the shorter lesson', () => {
    expect(planResume({ step: 30, sid: 'gone', revision: 'r1' }, lesson(['a', 'b', 'c']))).toEqual({ kind: 'ask', near: 2 })
  })
  it('treats places saved before revisions existed as before: by index, within range', () => {
    expect(planResume({ step: 2 }, lesson(['a', 'b', 'c', 'd']))).toEqual({ kind: 'resume', step: 2, how: 'index', mapped: false })
    expect(planResume({ step: 12 }, lesson(['a', 'b']))).toEqual({ kind: 'start' })
  })
})

describe('placeOf and indexOfSid', () => {
  it('records the step id and revision with the index', () => {
    expect(placeOf(lesson(['a', 'b']), 1)).toEqual({ step: 1, sid: 'b', revision: 'r2' })
    expect(placeOf({ stepRefs: [] }, 0)).toEqual({ step: 0 })
  })
  it('finds nothing without an id', () => {
    expect(indexOfSid(lesson(['a']).stepRefs, undefined)).toBe(-1)
    expect(indexOfSid(lesson(['a', 'b']).stepRefs, 'b')).toBe(1)
  })
})

describe('finishedEarlierVersion', () => {
  it('flags a completion made on a different revision', () => {
    expect(finishedEarlierVersion({ done: true, revision: 'r1' }, { revision: 'r2' })).toBe(true)
    expect(finishedEarlierVersion({ done: true, revision: 'r2' }, { revision: 'r2' })).toBe(false)
  })
  it('does not flag skipped, unfinished or unrecorded completions', () => {
    expect(finishedEarlierVersion({ done: true, skipped: true, revision: 'r1' }, { revision: 'r2' })).toBe(false)
    expect(finishedEarlierVersion({ done: false, revision: 'r1' }, { revision: 'r2' })).toBe(false)
    expect(finishedEarlierVersion({ done: true }, { revision: 'r2' })).toBe(false)
    expect(finishedEarlierVersion(undefined, { revision: 'r2' })).toBe(false)
  })
})
