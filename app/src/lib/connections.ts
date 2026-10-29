// Interlinking instead of overlap: every lesson shows where it builds on, what it leads to, and where the skill is used in a course.
// Nothing is taught twice; a lesson that needs an idea links to the lesson that teaches it. Derived from the skill graph, so it cannot drift.
import type { Lesson, Skill } from '../types'

export interface Connections { buildsOn: Lesson[]; leadsTo: Lesson[]; usedIn: Lesson[]; uses: Lesson[] }

const nodeOf = (key: string) => key.slice(0, key.lastIndexOf('.'))

export function connectionsFor(lesson: Lesson, lessons: Lesson[], skillById: Map<string, Skill>): Connections {
  const teaches = (l: Lesson) => new Set([l.skill, ...(l.also ?? [])])
  const byNode = (node: string) => lessons.filter(l => l.id !== lesson.id && teaches(l).has(node))
  const uniq = (ls: Lesson[]) => [...new Map(ls.map(l => [l.id, l])).values()]
  // prerequisite skills of this lesson's depth (and of any skill it teaches)
  const preNodes = new Set<string>()
  for (const n of teaches(lesson)) for (const p of skillById.get(n)?.depths?.[lesson.depth]?.prereqs ?? []) if (nodeOf(p) !== n) preNodes.add(nodeOf(p))
  const buildsOn = uniq([...preNodes].flatMap(byNode)).filter(l => !l.course)
  const mine = teaches(lesson)
  const needsMine = (l: Lesson) => [...teaches(l)].some(n => Object.values(skillById.get(n)?.depths ?? {}).some(d => (d.prereqs ?? []).some(p => mine.has(nodeOf(p)) && !teaches(l).has(nodeOf(p)))))
  const leadsTo = uniq(lessons.filter(l => l.id !== lesson.id && !l.course && needsMine(l)))
  const usedIn = uniq(lessons.filter(l => l.id !== lesson.id && l.course && (l.uses ?? []).some(u => mine.has(u))))
  const uses = uniq((lesson.uses ?? []).flatMap(byNode)).filter(l => !l.course)
  return { buildsOn, leadsTo, usedIn, uses }
}
