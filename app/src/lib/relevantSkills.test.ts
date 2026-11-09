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
