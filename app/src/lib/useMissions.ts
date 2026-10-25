import { useMemo } from 'react'
import { useContent } from './content'
import { buildMissions, overallMission, type MissionContext } from './missions'
import { masteryMap, useAttempts, useLessonProgress, usePlacement, NO_PLACEMENT } from './progress'
import { splitSkillKey } from '../types'

/** Everything the mission views need, computed once from the learner's evidence. `ctx` is null until storage has loaded. */
export function useMissionData() {
  const content = useContent()
  const attempts = useAttempts()
  const progress = useLessonProgress()
  const placementQ = usePlacement()
  const placement = placementQ ?? NO_PLACEMENT
  const ctx = useMemo<MissionContext | null>(() => {
    if (!attempts || !progress) return null
    const itemDepths = new Map<string, string[]>()
    for (const i of content.items) { const { skill, depth } = splitSkillKey(i.skill); const l = itemDepths.get(skill) ?? []; if (!l.includes(depth)) l.push(depth); itemDepths.set(skill, l) }
    const doneIds = new Set(progress.filter(p => p.done).map(p => p.lessonId))
    const lessonDone = new Set<string>(), hasLesson = new Set<string>()
    for (const l of content.lessons) for (const node of [l.skill, ...(l.also ?? [])]) { hasLesson.add(node); if (doneIds.has(l.id)) lessonDone.add(node) }
    return { masteries: masteryMap(attempts, Date.now(), content.cuedOnly), placement, skillById: content.skillById, itemDepths, lessonDone, hasLesson, cuedOnly: content.cuedOnly }
  }, [attempts, progress, placement, content])
  const missions = useMemo(() => (ctx ? buildMissions(content.skills, ctx) : []), [ctx, content.skills])
  const overall = useMemo(() => overallMission(missions), [missions])
  return { content, attempts, progress, placement, ctx, missions, overall }
}
