import { useMemo } from 'react'
import { useContent } from './content'
import { masteryMap, nextLessons, useAttempts, useLessonProgress, usePlacement, NO_PLACEMENT } from './progress'
import type { LessonMeta } from '../types'

/** The next lesson on the core route (courses are Electives and never offered here), or undefined when there is none. Shared by the header button and the Path's Next tile. */
export function useNextCoreLesson(): LessonMeta | undefined {
  const content = useContent()
  const attempts = useAttempts()
  const progress = useLessonProgress()
  const placement = usePlacement() ?? NO_PLACEMENT
  return useMemo(() => {
    if (!attempts || !progress) return undefined
    return nextLessons(content, masteryMap(attempts, Date.now(), content.cuedOnly), placement, progress, 400).find(l => !l.course)
  }, [attempts, progress, placement, content])
}
