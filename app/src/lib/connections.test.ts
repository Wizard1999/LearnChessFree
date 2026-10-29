import { describe, expect, it } from 'vitest'
import type { Lesson, Skill } from '../types'
import { connectionsFor } from './connections'

const sk = (id: string, pre: string[] = []) => ({ id, title: id, strand: 'S1', tier: 0, depths: { D1: { outcome: 'x', prereqs: pre } } } as unknown as Skill)
const ls = (id: string, skill: string, extra: Partial<Lesson> = {}) => ({ id, title: id, skill, depth: 'D1', steps: [], review: { status: 'x' }, ...extra } as unknown as Lesson)
describe('connections', () => {
  const skills = new Map([sk('A'), sk('B', ['A.D1']), sk('C', ['B.D1'])].map(s => [s.id, s]))
  const lessons = [ls('LA', 'A'), ls('LB', 'B'), ls('LC', 'C'), ls('FG', 'C', { course: 'games', uses: ['B'] })]
  it('builds on the lessons of prerequisite skills, and leads to the ones that need it', () => {
    const c = connectionsFor(lessons[1], lessons, skills)
    expect(c.buildsOn.map(l => l.id)).toEqual(['LA']); expect(c.leadsTo.map(l => l.id)).toEqual(['LC'])
  })
  it('lists the course lessons that use the skill, and what a course lesson uses', () => {
    expect(connectionsFor(lessons[1], lessons, skills).usedIn.map(l => l.id)).toEqual(['FG'])
    expect(connectionsFor(lessons[3], lessons, skills).uses.map(l => l.id)).toEqual(['LB'])
  })
})
