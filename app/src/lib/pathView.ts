// The Path view (D60, D61): the recommended route as stages of tiles. Pure, so it can be tested; components/PathView.tsx draws it.
// Locked is information, never a lock: every tile opens its lesson. The missing prerequisite is named so the learner knows why a lesson is marked.
import type { LessonProgress } from '../db'
import type { ContentBundle, LessonMeta } from '../types'
import { splitSkillKey } from '../types'
import type { Mastery } from './mastery'
import { PATH_STAGES } from './pathStages'
import { prereqMet, statusOf, type Placement } from './progress'

export type TileState = 'locked' | 'available' | 'next' | 'progress' | 'done'

export interface PathTile {
  lesson: LessonMeta
  /** The subject strand of the lesson's skill (S1..S11), for the rim colour. */
  strand?: string
  state: TileState
  /** The word shown with the icon, so colour is never the only cue. */
  word: string
  /** Locked only: the prerequisite skill the learner has not shown yet. */
  missing?: { skillId: string; title: string }
  /** Done only: the learner skipped it rather than doing it. */
  skipped?: boolean
}

export interface PathStageView {
  id: string
  number: number
  title: string
  milestone: string
  tiles: PathTile[]
  doneCount: number
  /** The stage check lesson, if the stage has one. */
  checkId?: string
  checkDone: boolean
  /** The gate at the end of the stage: open once every lesson of the stage is finished or skipped. Visual only. */
  gateOpen: boolean
  status: 'complete' | 'current' | 'ahead'
}

/** The lessons the Path shows: the core route (courses are Electives and never appear on the Path). */
export const isPathLesson = (l: LessonMeta): boolean => !l.course && l.order !== undefined && !!l.stage

export interface PathInput {
  content: ContentBundle
  masteries: Map<string, Mastery>
  placement: Placement
  progress: LessonProgress[]
  /** The lesson the Continue strip offers; the Next tile. When absent, the first open lesson in path order. */
  nextId?: string
}

export function buildPath({ content, masteries, placement, progress, nextId }: PathInput): { stages: PathStageView[]; nextId?: string } {
  const byId = new Map(progress.map(p => [p.lessonId, p]))
  const doneSkills = new Set<string>(), lessonSkills = new Set<string>()
  for (const l of content.lessons) for (const s of [l.skill, ...(l.also ?? [])]) { lessonSkills.add(s); if (byId.get(l.id)?.done) doneSkills.add(s) }
  const core = content.lessons.filter(isPathLesson).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const missingFor = (l: LessonMeta): PathTile['missing'] => {
    const pre = content.skillById.get(l.skill)?.depths?.[l.depth]?.prereqs ?? []
    for (const key of pre) {
      if (prereqMet(key, content.skillById, masteries, placement, k => content.depthsWithItems.has(k), s => doneSkills.has(s), s => lessonSkills.has(s))) continue
      const { skill } = splitSkillKey(key)
      return { skillId: skill, title: content.skillById.get(skill)?.title ?? skill }
    }
    return undefined
  }

  // Next: the Continue strip's lesson when it is on the Path, else the first unfinished lesson whose prerequisites are shown.
  const open = (l: LessonMeta) => !byId.get(l.id)?.done
  let next = nextId && core.some(l => l.id === nextId && open(l)) ? nextId : undefined
  const missing = new Map<string, PathTile['missing']>()
  for (const l of core) if (open(l)) missing.set(l.id, missingFor(l))
  if (!next) next = core.find(l => open(l) && !missing.get(l.id))?.id

  const stages: PathStageView[] = PATH_STAGES.map((st, i) => {
    const tiles: PathTile[] = core.filter(l => l.stage === st.id).map((l): PathTile => {
      const strand = content.skillById.get(l.skill)?.strand
      const p = byId.get(l.id)
      if (p?.done) {
        const st2 = statusOf(`${l.skill}.${l.depth}`, content.skillById, masteries, placement)
        const word = p.skipped ? 'Skipped' : st2 === 'reliable' || st2 === 'refresh' ? 'Mastered' : 'Finished'
        return { lesson: l, strand, state: 'done' as const, word, skipped: !!p.skipped }
      }
      if (l.id === next) return { lesson: l, strand, state: 'next' as const, word: p && p.step > 0 ? 'Next, in progress' : 'Next' }
      if (p && p.step > 0) return { lesson: l, strand, state: 'progress' as const, word: 'In progress' }
      const m = missing.get(l.id)
      if (m) return { lesson: l, strand, state: 'locked' as const, word: `Locked, needs ${m.title}`, missing: m }
      return { lesson: l, strand, state: 'available' as const, word: 'Open' }
    })
    const doneCount = tiles.filter(t => t.state === 'done').length
    const check = content.lessonById.get(`L-SC-${st.id}-1`) // the stage check for this stage (a course lesson, so not a tile)
    return { id: st.id, number: i + 1, title: st.title, milestone: st.milestone, tiles, doneCount, checkId: check?.id, checkDone: !!(check && byId.get(check.id)?.done), gateOpen: tiles.length > 0 && doneCount === tiles.length, status: 'ahead' as const }
  }).filter(s => s.tiles.length > 0)

  const current = stages.findIndex(s => s.doneCount < s.tiles.length)
  stages.forEach((s, i) => { s.status = current < 0 || i < current ? 'complete' : i === current ? 'current' : 'ahead' })
  return { stages, nextId: next }
}
