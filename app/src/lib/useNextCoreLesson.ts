import { useMemo } from 'react'
import { useContent } from './content'
import { useLessonProgress } from './progress'
import { PATH_STAGES } from './pathStages'
import type { LessonMeta } from '../types'

/**
 * The next lesson on the learner's path: among the unfinished core lessons, the first in stage order, then in the path's own order within the
 * stage. It never depends on how the list is grouped, so "Grouped by subject" cannot change the answer (D74), and it is the same lesson the list
 * marks "Up next" in its stage (nothing is locked: the path order was already checked against the prerequisites, so evidence-based gating must
 * not skip past the lesson the learner sees at the top of their stage). Lessons with no stage or path position come last.
 */
export function pickNextOnPath(open: readonly LessonMeta[]): LessonMeta | undefined {
  const stage = (l: LessonMeta) => { const i = PATH_STAGES.findIndex(s => s.id === l.stage); return i < 0 ? 99 : i }
  return open.map((l, i) => ({ l, i })).sort((a, b) => stage(a.l) - stage(b.l) || (a.l.order ?? 1e9) - (b.l.order ?? 1e9) || a.i - b.i)[0]?.l
}

/** The next lesson on the core route (courses are Electives and never offered here), or undefined when there is none. Shared by the Next lesson button and the list's "Next" label. */
export function useNextCoreLesson(): LessonMeta | undefined {
  const content = useContent()
  const progress = useLessonProgress()
  return useMemo(() => {
    if (!progress) return undefined
    const done = new Set(progress.filter(p => p.done).map(p => p.lessonId))
    return pickNextOnPath(content.lessons.filter(l => !l.course && !done.has(l.id)))
  }, [progress, content])
}
