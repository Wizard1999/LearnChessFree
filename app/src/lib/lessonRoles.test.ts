/// <reference types="node" />
import { describe, expect, it } from 'vitest'
import type { Lesson } from '../types'
import { readCatalog, readManifest, readSkills } from './shippedContent'
import { lessonsForSkill, openingLesson, primaryLesson } from './lessonRoles'

const L = (id: string, skill: string, role: Lesson['role'], order: number, extra: Partial<Lesson> = {}): Lesson =>
  ({ id, skill, role, order, depth: 'D1', title: id, steps: [], stepCount: 0, stepRefs: [], review: { status: 'x' }, ...extra })

describe('lesson roles', () => {
  const ls = [L('cont', 'T.A', 'continuation', 5), L('check', 'T.A', 'assessment', 1, { course: 'stage-checks' }), L('intro', 'T.A', 'intro', 9), L('app', 'T.A', 'application', 2, { course: 'c' })]
  it('offers the introduction first even when a check or application comes earlier on the path', () => {
    expect(primaryLesson(ls, 'T.A')?.id).toBe('intro')
  })
  it('moves on to the continuation once the introduction is finished, never to a check', () => {
    expect(primaryLesson(ls, 'T.A', id => id === 'intro')?.id).toBe('cont')
    expect(primaryLesson(ls, 'T.A', id => id === 'intro' || id === 'cont')).toBeNull()
  })
  it('lists applications and checks separately', () => {
    const s = lessonsForSkill(ls, 'T.A')
    expect(s.teaching.map(l => l.id)).toEqual(['intro', 'cont'])
    expect(s.appears.map(l => l.id)).toEqual(['app'])
    expect(s.checks.map(l => l.id)).toEqual(['check'])
  })
  it('never starts a skill with only an application or check', () => {
    expect(primaryLesson([L('a', 'T.B', 'application', 1, { course: 'c' })], 'T.B')).toBeNull()
  })
  it('falls back to a teaching lesson that lists the skill under also', () => {
    const x = [L('o', 'T.C', 'intro', 1, { also: ['T.B'] })]
    expect(primaryLesson(x, 'T.B')?.id).toBe('o')
  })
  it('openingLesson still gives a lesson when all are finished', () => {
    expect(openingLesson(ls, 'T.A', () => true)?.id).toBe('intro')
  })
  it('lessons without a role default by course membership', () => {
    const x = [{ ...L('p', 'T.D', undefined, 1) }, { ...L('q', 'T.D', undefined, 2, { course: 'c' }) }]
    expect(lessonsForSkill(x, 'T.D').appears.map(l => l.id)).toEqual(['q'])
  })
})

describe('shipped lessons: the primary lesson of every skill is its introduction', () => {
  const lessons = readCatalog()
  it('has lessons to check', () => { expect(lessons.length).toBeGreaterThan(0) })
  it('every skill with lessons starts on a role-intro lesson, and no check or application is ever primary', () => {
    const skills = new Set(lessons.flatMap(l => [l.skill, ...(l.also ?? [])]))
    const bad: string[] = []
    for (const s of skills) {
      const p = primaryLesson(lessons, s)
      if (!p) { bad.push(`${s}: no primary`); continue }
      if (p.role !== 'intro') bad.push(`${s}: primary ${p.id} is ${p.role}`)
    }
    expect(bad.slice(0, 20)).toEqual([])
  })
})

describe('Up next never starts a skill on a course application or a check', () => {
  it('with nothing finished, every offered lesson is an introduction or a continuation', async () => {
    const { nextLessons, NO_PLACEMENT } = await import('./progress')
    const { masteryMap } = await import('./progress')
    const skills = readSkills(), lessons = readCatalog(), manifest = readManifest()
    const bundle: import('../types').ContentBundle = {
      manifest, skills, items: [], lessons, verified: {}, courses: [],
      skillById: new Map(skills.map(s => [s.id, s])), itemById: new Map(), lessonById: new Map(lessons.map(l => [l.id, l])),
      cuedOnly: new Set(), depthsWithItems: new Set(manifest.depths_with_items ?? []),
    }
    const next = nextLessons(bundle, masteryMap([], Date.now(), bundle.cuedOnly), NO_PLACEMENT, [], 200)
    expect(next.length).toBeGreaterThan(0)
    expect(next.filter(l => l.role === 'application' || l.role === 'assessment').map(l => l.id)).toEqual([])
  })
})
