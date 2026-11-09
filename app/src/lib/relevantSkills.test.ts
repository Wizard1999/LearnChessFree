import { describe, expect, it } from 'vitest'
import { readCatalog, readSkills } from './shippedContent'
import { isCoreLesson } from './coreLessons'
import { relevantCoreSkills } from './relevantSkills'

describe('relevant skills to know first (D80)', () => {
  const lessons = readCatalog(), skills = new Map(readSkills().map(s => [s.id, s]))
  const electives = lessons.filter(l => l.course)
  it('every elective lesson names at least one core skill, each linked to a core lesson', () => {
    const bad: string[] = []
    for (const l of electives) {
      const r = relevantCoreSkills(l, lessons, skills)
      if (r.length === 0) bad.push(`${l.id}: none`)
      for (const x of r) if (!x.lesson || !isCoreLesson(x.lesson)) bad.push(`${l.id}: ${x.skillId} has no core lesson`)
    }
    expect(bad.slice(0, 20)).toEqual([])
  })
  it('lists the lesson\'s own skill and is capped', () => {
    const l = electives[0]
    const r = relevantCoreSkills(l, lessons, skills)
    expect(r.map(x => x.skillId)).toContain(l.skill)
    expect(r.length).toBeLessThanOrEqual(8)
    expect(new Set(r.map(x => x.skillId)).size).toBe(r.length)
  })
})

describe('stage checks are core (D81)', () => {
  const lessons = readCatalog()
  it('the five stage checks are core assessments, at the end of their stage, not electives', () => {
    const checks = lessons.filter(l => /^L-SC-S\d-1$/.test(l.id))
    expect(checks.map(l => l.id).sort()).toEqual(['L-SC-S2-1', 'L-SC-S3-1', 'L-SC-S4-1', 'L-SC-S5-1', 'L-SC-S6-1'])
    for (const c of checks) { expect(c.course).toBeUndefined(); expect(c.role).toBe('assessment'); expect(isCoreLesson(c)).toBe(true) }
    for (const c of checks) {
      const inStage = lessons.filter(l => l.stage === c.stage && !l.course)
      expect(Math.max(...inStage.map(l => l.order ?? 0))).toBe(c.order)
    }
  })
  it('exactly the nine deep dives with a shared position link to their core lessons; famous games states its real count', () => {
    const shared = lessons.filter(l => l.samePosition?.length)
    expect(shared.length).toBe(9)
    for (const l of shared) { expect(l.course).toBe('opening-deep-dives'); for (const id of l.samePosition!) expect(isCoreLesson(lessons.find(x => x.id === id)!)).toBe(true) }
  })
})
