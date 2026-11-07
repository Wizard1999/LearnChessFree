/// <reference types="node" />
import { describe, expect, it } from 'vitest'
import type { Course, LessonMeta } from '../types'
import { readCatalog, readCourses } from './shippedContent'
import { cleanTitle, courseFacts, plannedCourses, withoutTypedCount } from './displayText'
import { PATH_STAGES, stageLabel, stageNumber } from './pathStages'

describe('display text derived from content', () => {
  it('removes author-only marks from titles', () => {
    expect(cleanTitle('Opening principles (stub: outcomes only, no items yet)')).toBe('Opening principles')
    expect(cleanTitle('Forks (double attack)')).toBe('Forks (double attack)')
  })
  it('drops a typed leading count from a summary', () => {
    expect(withoutTypedCount('Eight celebrated games in the order they were played.')).toBe('Celebrated games in the order they were played.')
    expect(withoutTypedCount('Eighteen openings, one plan at a time')).toBe('Openings, one plan at a time')
    expect(withoutTypedCount('How the rules came to be.')).toBe('How the rules came to be.')
  })
  it('counts a course from its own lesson list', () => {
    const byId = new Map<string, LessonMeta>(['a', 'b'].map(id => [id, { id, skill: 'X.Y', depth: 'D1', title: id, stepCount: 0, stepRefs: [], review: { status: 'x' }, minutes: 10 }]))
    expect(courseFacts({ lessons: ['a', 'b', 'missing'] }, byId)).toMatch(/^2 lessons · about /)
    expect(courseFacts({ lessons: [] }, byId)).toBe('0 lessons')
  })
  it('never lists a course as planned once it exists', () => {
    const promised = [{ id: 'a', title: 'A', note: '' }, { id: 'b', title: 'B', note: '' }]
    expect(plannedCourses(promised, [{ id: 'a' }]).map(p => p.id)).toEqual(['b'])
  })
  it('shows stages as Stage 1 to Stage 8 everywhere', () => {
    expect(PATH_STAGES.map(s => stageNumber(s.id))).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(stageLabel('S0')).toBe('Stage 1')
    expect(stageLabel('S7')).toBe('Stage 8')
  })
})

describe('shipped courses: counts come from the data', () => {
  const courses: Course[] = readCourses()
  it('every course lesson id exists', () => {
    const ids = new Set(readCatalog().map(l => l.id))
    expect(courses.flatMap(c => c.lessons.filter(id => !ids.has(id)))).toEqual([])
  })
})
