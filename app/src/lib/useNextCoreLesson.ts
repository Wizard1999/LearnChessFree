import { useMemo } from 'react'
import { useContent } from './content'
import { masteryMap, nextLessons, useAttempts, useLessonProgress, usePlacement, NO_PLACEMENT } from './progress'
import { PATH_STAGES } from './pathStages'
import type { LessonMeta } from '../types'

/**
 * The next lesson on the learner's path: among the open, unfinished core lessons (prerequisites met), the first in stage order, then in the
 * path's own order within the stage. It never depends on how the list is grouped, so "Grouped by subject" cannot change the answer (D74).
 * Lessons with no stage or path position come last.
 */
export function pickNextOnPath(open: readonly LessonMeta[]): LessonMeta | undefined {
  const stage = (l: LessonMeta) => { const i = PATH_STAGES.findIndex(s => s.id === l.stage); return i < 0 ? 99 : i }
  return open.map((l, i) => ({ l, i })).sort((a, b) => stage(a.l) - stage(b.l) || (a.l.order ?? 1e9) - (b.l.order ?? 1e9) || a.i - b.i)[0]?.l
}

/** The next lesson on the core route (courses are Electives and never offered here), or undefined when there is none. Shared by the Next lesson button and the list's "Next" label. */
export function useNextCoreLesson(): LessonMeta | undefined {
  const content = useContent()
  const attempts = useAttempts()
  const progress = useLessonProgress()
  const placement = usePlacement() ?? NO_PLACEMENT
  return useMemo(() => {
    if (!attempts || !progress) return undefined
    return pickNextOnPath(nextLessons(content, masteryMap(attempts, Date.now(), content.cuedOnly), placement, progress, 1000).filter(l => !l.course))
  }, [attempts, progress, placement, content])
}
