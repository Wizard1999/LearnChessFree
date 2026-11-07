import type { Course, LessonMeta } from '../types'
import { lessonMinutes } from './lessonTime'

/** Marks in content titles that are for authors, not learners: "Opening principles (stub: outcomes only, no items yet)". */
export function cleanTitle(t: string): string {
  return t.replace(/\s*\((?:stub|draft|todo|wip|outcomes only)[^)]*\)\s*$/i, '').trim()
}

const NUMBER_WORDS = 'one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty'
const LEADING_COUNT = new RegExp('^(?:' + NUMBER_WORDS + '|[0-9]+)[ ]+', 'i')

/**
 * A count typed into course text goes stale (a summary said "eight" games when nineteen lessons existed). Counts are shown from the
 * data instead, so a leading typed count is dropped from the summary: "Eight celebrated games in ..." reads "Celebrated games in ...".
 */
export function withoutTypedCount(summary: string): string {
  const s = summary.trim()
  if (!LEADING_COUNT.test(s)) return s
  const r = s.replace(LEADING_COUNT, '')
  return r.charAt(0).toUpperCase() + r.slice(1)
}

/** "19 lessons · about 3 h 10 min", computed from the course's lesson list. */
export function courseFacts(course: Pick<Course, 'lessons'>, byId: ReadonlyMap<string, LessonMeta>): string {
  const ls = course.lessons.map(id => byId.get(id)).filter((l): l is LessonMeta => !!l)
  const min = ls.reduce((t, l) => t + lessonMinutes(l), 0)
  const time = min >= 60 ? `${Math.floor(min / 60)} h ${Math.round(min % 60)} min` : `${Math.round(min)} min`
  return `${ls.length} lesson${ls.length === 1 ? '' : 's'}${ls.length ? ` · about ${time}` : ''}`
}

export interface PlannedCourse { id: string; title: string; note: string }
/** Courses promised but not written. A planned entry disappears the moment a course with its id exists, so none is both available and planned. */
export function plannedCourses(promised: readonly PlannedCourse[], courses: readonly Pick<Course, 'id'>[]): PlannedCourse[] {
  const have = new Set(courses.map(c => c.id))
  return promised.filter(p => !have.has(p.id))
}
