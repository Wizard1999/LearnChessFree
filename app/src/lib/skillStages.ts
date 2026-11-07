// Which stage of the recommended path a skill belongs to, for the map (D42, roadmap 2f). A skill sits on the ring of the stage of its FIRST lesson;
// its other lessons live in other stages and are shown as "where this skill returns". Pure functions of the skill and lesson lists.
import type { LessonMeta, Skill } from '../types'
import { lessonsForSkill } from './lessonRoles'
import { PATH_STAGES } from './pathStages'

/** Stage index (0 = S0) by skill tier for the first, second and later depth: the same table as STAGE_BY_TIER in tools/build_path.py. */
const STAGE_BY_TIER: Record<number, [number, number, number]> = { 0: [1, 1, 1], 1: [2, 3, 3], 2: [3, 4, 4], 3: [4, 5, 5], 4: [5, 6, 6], 5: [6, 6, 7], 6: [7, 7, 7], 7: [7, 7, 7] }

/** The stage a lesson of this skill would get from the tier rule of tools/build_path.py (used for skills that have no lesson yet). */
export function tierStage(tier: number | undefined, strand: string, depthIndex = 0): number {
  const t = Math.max(0, Math.min(tier ?? 7, 7))
  let st = STAGE_BY_TIER[t][Math.max(0, Math.min(depthIndex, 2))]
  if (strand === 'S7' && tier === 1) st += 1 // endgame technique starts once the game is playable
  return Math.min(st, PATH_STAGES.length - 1)
}

const stageIndexOf = (id: string | undefined): number => PATH_STAGES.findIndex(s => s.id === id)

/** The stage index (0..7) of the skill's first lesson; for a skill without a lesson, the stage the tier rule gives its first depth. */
export function skillHomeStage(skill: Skill, lessons: LessonMeta[]): number {
  const sl = lessonsForSkill(lessons, skill.id)
  const first = sl.teaching[0] ?? sl.alsoTeaching[0]
  const i = stageIndexOf(first?.stage)
  return i >= 0 ? i : tierStage(skill.tier, skill.strand)
}

/** Home stage of every skill. */
export function skillHomeStages(skills: Skill[], lessons: LessonMeta[]): Map<string, number> {
  return new Map(skills.map(s => [s.id, skillHomeStage(s, lessons)]))
}

export type ReturnKind = 'deeper level' | 'application' | 'check'
export interface SkillReturn { stageIndex: number; stageId: string; kind: ReturnKind; lessonId: string; title: string; /** What the stage adds, in words for the learner. */ adds: string }
export interface StageReturns { stageIndex: number; stageId: string; items: SkillReturn[] }

/** The skill's lessons that live in a stage other than its home stage, grouped by stage in path order. Nothing is hidden: each group says what that stage adds. */
export function skillReturns(skill: Skill, lessons: LessonMeta[]): StageReturns[] {
  const home = skillHomeStage(skill, lessons)
  const sl = lessonsForSkill(lessons, skill.id)
  const rows: { l: LessonMeta; kind: ReturnKind }[] = [
    ...sl.teaching.slice(1).map(l => ({ l, kind: 'deeper level' as const })),
    ...sl.appears.map(l => ({ l, kind: 'application' as const })),
    ...sl.checks.map(l => ({ l, kind: 'check' as const })),
  ]
  const by = new Map<number, SkillReturn[]>()
  for (const { l, kind } of rows) {
    const i = stageIndexOf(l.stage)
    if (i < 0 || i === home) continue
    const adds = kind === 'deeper level' ? `a deeper level (${l.depth})` : kind === 'application' ? 'using it in a course lesson' : 'a check of what you learned'
    by.set(i, [...(by.get(i) ?? []), { stageIndex: i, stageId: PATH_STAGES[i].id, kind, lessonId: l.id, title: l.title, adds }])
  }
  return [...by.entries()].sort((a, b) => a[0] - b[0]).map(([stageIndex, items]) => ({ stageIndex, stageId: PATH_STAGES[stageIndex].id, items }))
}

/** "Stage 3 · First wins" for a stage index. */
export function stageSentence(stageIndex: number): string {
  const s = PATH_STAGES[stageIndex]
  return s ? `Stage ${stageIndex + 1} · ${s.title}` : ''
}

/** The learner's current stage index: the first stage with an unfinished lesson (the same rule as the Progress page); null when the path is finished or has no lessons. */
export function currentStageIndex(lessons: readonly LessonMeta[], doneIds: ReadonlySet<string>): number | null {
  for (let i = 0; i < PATH_STAGES.length; i++) {
    const ls = lessons.filter(l => l.stage === PATH_STAGES[i].id)
    if (ls.some(l => !doneIds.has(l.id))) return i
  }
  return null
}
