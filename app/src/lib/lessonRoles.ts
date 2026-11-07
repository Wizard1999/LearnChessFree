import type { LessonMeta } from '../types'

/**
 * Which lesson a skill offers first. Every lesson has a role (derived in tools/build_content.py): the skill's introduction,
 * a continuation, a course lesson that applies the skill, or a stage check. Only introductions and continuations are ever
 * offered as "the lesson for this skill"; applications and checks are listed separately and never start a skill.
 */
export type LessonRole = NonNullable<LessonMeta['role']>

export const roleOf = (l: LessonMeta): LessonRole => l.role ?? (l.course ? 'application' : 'continuation')
const isTeaching = (l: LessonMeta) => { const r = roleOf(l); return r === 'intro' || r === 'continuation' }
const touches = (l: LessonMeta, skill: string) => l.skill === skill || (l.also ?? []).includes(skill)
const rank = (l: LessonMeta) => (roleOf(l) === 'intro' ? 0 : 1)
const byOrder = (a: LessonMeta, b: LessonMeta) => rank(a) - rank(b) || (a.order ?? 9999) - (b.order ?? 9999) || a.depth.localeCompare(b.depth) || a.id.localeCompare(b.id)

export interface SkillLessons {
  /** The skill's own teaching lessons: the introduction first, then continuations. */
  teaching: LessonMeta[]
  /** Teaching lessons of other skills that also cover this one (only used when the skill has none of its own). */
  alsoTeaching: LessonMeta[]
  /** Course lessons that use the skill: "Where else this appears". */
  appears: LessonMeta[]
  /** Stage checks: "Check yourself". */
  checks: LessonMeta[]
}

export function lessonsForSkill(lessons: LessonMeta[], skill: string): SkillLessons {
  const mine = lessons.filter(l => touches(l, skill))
  const own = mine.filter(l => l.skill === skill && isTeaching(l)).sort(byOrder)
  const alsoT = mine.filter(l => l.skill !== skill && isTeaching(l)).sort(byOrder)
  const byPath = (a: LessonMeta, b: LessonMeta) => (a.order ?? 9999) - (b.order ?? 9999) || a.id.localeCompare(b.id)
  return {
    teaching: own,
    alsoTeaching: alsoT,
    appears: mine.filter(l => roleOf(l) === 'application').sort(byPath),
    checks: mine.filter(l => roleOf(l) === 'assessment').sort(byPath),
  }
}

/** The lesson to offer for a skill: the first unfinished of intro then continuation(s); null when none is left (or none exists). */
export function primaryLesson(lessons: LessonMeta[], skill: string, isDone: (id: string) => boolean = () => false): LessonMeta | null {
  const s = lessonsForSkill(lessons, skill)
  const pool = s.teaching.length ? s.teaching : s.alsoTeaching
  return pool.find(l => !isDone(l.id)) ?? null
}

/** The lesson to open from a link that is not about finishing things (a map tooltip, a search hit): the first of the pool, finished or not. */
export function openingLesson(lessons: LessonMeta[], skill: string, isDone: (id: string) => boolean = () => false): LessonMeta | null {
  const s = lessonsForSkill(lessons, skill)
  const pool = s.teaching.length ? s.teaching : s.alsoTeaching
  return primaryLesson(lessons, skill, isDone) ?? pool[0] ?? null
}
