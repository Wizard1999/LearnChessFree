import { describe, expect, it } from 'vitest'
import { stageLine, stageProgress } from './stageProgress'
import type { Lesson } from '../types'
import type { Mastery } from './mastery'

const L = (id: string, skill: string, stage?: string) => ({ id, skill, stage, title: id, depth: 'D1', steps: [], review: { status: 'x' } }) as unknown as Lesson
const M = (state: Mastery['state']) => ({ state }) as Mastery
const lessons = [L('a', 'k1', 'S0'), L('b', 'k2', 'S0'), L('c', 'k3', 'S1'), L('d', 'k3', 'S1'), L('x', 'k9')]

describe('stageProgress', () => {
  it('counts finished and skipped lessons separately from skills shown in exercises', () => {
    const r = stageProgress(lessons, [{ lessonId: 'a', done: true }, { lessonId: 'b', done: true, skipped: true }, { lessonId: 'c', done: false }], new Map([['k1.D1', M('reliable')], ['k2.D1', M('practising')]]))
    expect(r).toHaveLength(8)
    expect(r[0]).toMatchObject({ lessons: 2, finished: 2, skipped: 1, skills: 2, shown: 1, current: false })
    expect(r[1]).toMatchObject({ lessons: 2, finished: 0, skills: 1, shown: 0, current: true })
  })
  it('ignores lessons without a stage and counts a refresher-due skill as shown', () => {
    const r = stageProgress(lessons, [], new Map([['k3.D2', M('refresh')]]))
    expect(r[1].shown).toBe(1)
    expect(r.reduce((n, s) => n + s.lessons, 0)).toBe(4)
  })
  it('marks the first unfinished stage and writes the line', () => {
    const r = stageProgress(lessons, [], new Map())
    expect(r[0].current).toBe(true)
    expect(stageLine(r)).toBe('Stage 1 of 8: Moves and the board. 0 of 2 lessons finished.')
  })
  it('has no line when everything is finished', () => {
    const r = stageProgress(lessons, lessons.map(l => ({ lessonId: l.id, done: true })), new Map())
    expect(r.some(s => s.current)).toBe(false)
    expect(stageLine(r)).toBeNull()
  })
})
