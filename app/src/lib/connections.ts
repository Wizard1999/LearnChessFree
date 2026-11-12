// Interlinking instead of overlap: every lesson shows where it builds on, what it leads to, and where the skill is used in a course.
// Nothing is taught twice; a lesson that needs an idea links to the lesson that teaches it. Derived from the skill graph, so it cannot drift.
import type { LessonMeta, Skill } from '../types'

export interface Connections { buildsOn: LessonMeta[]; leadsTo: LessonMeta[]; usedIn: LessonMeta[]; uses: LessonMeta[] }

const nodeOf = (key: string) => key.slice(0, key.lastIndexOf('.'))

export function connectionsFor(lesson: LessonMeta, lessons: LessonMeta[], skillById: Map<string, Skill>): Connections {
  const teaches = (l: LessonMeta) => new Set([l.skill, ...(l.also ?? [])])
  const byNode = (node: string) => lessons.filter(l => l.id !== lesson.id && teaches(l).has(node))
  const uniq = (ls: LessonMeta[]) => [...new Map(ls.map(l => [l.id, l])).values()]
  // prerequisite skills of this lesson's depth (and of any skill it teaches)
  const preNodes = new Set<string>()
  for (const n of teaches(lesson)) for (const p of skillById.get(n)?.depths?.[lesson.depth]?.prereqs ?? []) if (nodeOf(p) !== n) preNodes.add(nodeOf(p))
  const buildsOn = uniq([...preNodes].flatMap(byNode)).filter(l => !l.course && l.role !== 'assessment')
  const mine = teaches(lesson)
  // A lesson that needs this one directly: one of its own depth's prerequisites is a skill this lesson teaches (and it does not teach that skill itself).
  const needs = (l: LessonMeta, skills: Set<string>) => [...teaches(l)].some(n => (skillById.get(n)?.depths?.[l.depth]?.prereqs ?? []).some(p => skills.has(nodeOf(p)) && !teaches(l).has(nodeOf(p))))
  const direct = lessons.filter(l => l.id !== lesson.id && !l.course && l.role !== 'assessment' && needs(l, teaches(lesson)))
  // Several lessons that need the same skill are one step, not many: a split lesson shows as its first part, and a lesson that also needs one of the
  // others (so it comes after it) is left out, leaving only the next steps rather than everything downstream.
  const series = (l: LessonMeta) => l.title.replace(/ \(part \d+ of \d+\)$/, '')
  const own = series(lesson)
  const firsts = [...new Map(direct.filter(l => series(l) !== own && !/\(part ([2-9]|\d\d+) of \d+\)$/.test(l.title)).map(l => [series(l), l])).values()]
  const leadsTo = firsts.filter(l => !firsts.some(m => m !== l && needs(l, teaches(m))))
  const usedIn = uniq(lessons.filter(l => l.id !== lesson.id && l.course && (l.uses ?? []).some(u => mine.has(u))))
  const uses = uniq((lesson.uses ?? []).flatMap(byNode)).filter(l => !l.course && l.role !== 'assessment')
  return { buildsOn, leadsTo, usedIn, uses }
}
