import { useMemo } from 'react'
import { useContent } from './content'
import type { LessonMeta } from '../types'

/**
 * The core curriculum is every lesson that is not an elective course lesson (D80). Electives are optional study beyond the core: they have their own
 * page and totals, and never count toward the core's lessons, minutes, stages, "n of m done" or the first-game invitation. (tools/build_path.py still
 * gives course lessons a stage so they sort; the app ignores that for counting.)
 */
export const isCoreLesson = (l: LessonMeta): boolean => !l.course
/** A stage check (D81): a core lesson that tests, not teaches. It counts in the core's lessons, minutes and stages, but never credits a skill as taught or learned. */
export const isAssessment = (l: Pick<LessonMeta, 'role'>): boolean => l.role === 'assessment'
/** Core lessons that teach (everything core except the stage checks): what skill credit and "lesson seen" are drawn from. */
export const teachingCoreOf = (lessons: readonly LessonMeta[]): LessonMeta[] => lessons.filter(l => isCoreLesson(l) && !isAssessment(l))
export const coreLessonsOf = (lessons: readonly LessonMeta[]): LessonMeta[] => lessons.filter(isCoreLesson)

/** The core lessons of the loaded content, memoised. */
export function useCoreLessons(): LessonMeta[] {
  const { lessons } = useContent()
  return useMemo(() => coreLessonsOf(lessons), [lessons])
}
