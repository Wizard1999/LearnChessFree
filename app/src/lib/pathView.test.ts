import { describe, expect, it } from 'vitest'
import type { LessonProgress } from '../db'
import type { ContentBundle, LessonMeta, Skill } from '../types'
import { NO_PLACEMENT } from './progress'
import { buildPath, isPathLesson } from './pathView'

const skill = (id: string, prereqs: string[] = []): Skill => ({ id, title: `Skill ${id}`, strand: 'S1', tier: 1, depths: { D1: { prereqs } } as unknown as Skill['depths'] })
const lesson = (id: string, sk: string, order: number, stage: string, extra: Partial<LessonMeta> = {}): LessonMeta =>
  ({ id, skill: sk, depth: 'D1', title: id, order, stage, stepCount: 1, stepRefs: [], review: { status: 'x' }, role: 'intro', ...extra })
const prog = (lessonId: string, done: boolean, step = 0, skipped = false): LessonProgress => ({ lessonId, step, done, ts: 1, skipped })

function bundle(lessons: LessonMeta[], skills: Skill[], withItems: string[] = []): ContentBundle {
  return { lessons, skills, skillById: new Map(skills.map(s => [s.id, s])), lessonById: new Map(lessons.map(l => [l.id, l])), depthsWithItems: new Set(withItems), cuedOnly: new Set() } as unknown as ContentBundle
}

describe('path view', () => {
  const skills = [skill('A'), skill('B', ['A.D1'])]
  const ls = [lesson('a', 'A', 1, 'S0'), lesson('b', 'B', 2, 'S0'), lesson('c', 'A', 3, 'S1'), lesson('x', 'A', 4, 'S1', { course: 'extras' }), lesson('L-SC-S0-1', 'A', 5, 'S1', { course: 'stage-checks', role: 'assessment' })]
  const run = (progress: LessonProgress[], nextId?: string) => buildPath({ content: bundle(ls, skills, ['A.D1']), masteries: new Map(), placement: NO_PLACEMENT, progress, nextId })

  it('shows only the core route, never course lessons', () => {
    expect(ls.filter(isPathLesson).map(l => l.id)).toEqual(['a', 'b', 'c'])
    expect(run([]).stages.flatMap(s => s.tiles.map(t => t.lesson.id))).toEqual(['a', 'b', 'c'])
  })
  it('marks the first open lesson Next, names the missing prerequisite on a locked one, and never hides a lesson', () => {
    const p = run([])
    expect(p.nextId).toBe('a')
    const [a, b] = p.stages[0].tiles
    expect([a.state, a.word]).toEqual(['next', 'Next'])
    expect(b.state).toBe('locked')
    expect(b.missing?.title).toBe('Skill A')
    expect(b.word).toContain('Skill A')
  })
  it('gives each of the five states a word, and a finished lesson counts as done', () => {
    const p = run([prog('a', true)], 'b')
    expect(p.stages[0].tiles.map(t => t.state)).toEqual(['done', 'next'])
    expect(p.stages[0].tiles[0].word).toBe('Finished')
    const q = run([prog('a', true), prog('b', false, 2)], 'c')
    expect(q.stages[0].tiles[1].state).toBe('progress')
    expect(q.stages[1].tiles[0].state).toBe('next')
    expect(run([prog('a', true, 0, true)]).stages[0].tiles[0].word).toBe('Skipped')
  })
  it('opens a stage gate only when every lesson of the stage is done, and tracks stage status', () => {
    const p = run([prog('a', true), prog('b', true)], 'c')
    expect(p.stages.map(s => s.gateOpen)).toEqual([true, false])
    expect(p.stages.map(s => s.status)).toEqual(['complete', 'current'])
    expect(p.stages[0].checkId).toBe('L-SC-S0-1')
  })
  it('falls back to the first open lesson when the strip lesson is not on the path', () => {
    expect(run([], 'x').nextId).toBe('a')
  })
})
