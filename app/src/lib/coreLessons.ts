import { useMemo } from 'react'
import { useContent } from './content'
import type { LessonMeta } from '../types'

/**
 * The core curriculum is every lesson that is not an elective course lesson (D80). Electives are optional study beyond the core: they have their own
 * page and totals, and never count toward the core's lessons, minutes, stages, "n of m done" or the first-game invitation. (tools/build_path.py still
 * gives course lessons a stage so they sort; the app ignores that for counting.)
 */
export const isCoreLesson = (l: LessonMeta): boolean => !l.course
export const coreLessonsOf = (lessons: readonly LessonMeta[]): LessonMeta[] => lessons.filter(isCoreLesson)

/** The core lessons of the loaded content, memoised. */
export function useCoreLessons(): LessonMeta[] {
  const { lessons } = useContent()
  return useMemo(() => coreLessonsOf(lessons), [lessons])
}
