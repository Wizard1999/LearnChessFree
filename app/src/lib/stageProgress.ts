// Progress by stage of the recommended path. Two separate measures, never merged:
// 'lessons finished' (completed a lesson, or marked it done) and 'shown in exercises' (evidence at Level one or better).
import type { Lesson } from '../types'
import type { Mastery } from './mastery'
import { PATH_STAGES } from './pathStages'

export interface StageProgress {
  id: string
  title: string
  milestone: string
  /** 1-based position among the stages. */
  index: number
  lessons: number
  finished: number
  /** Of the finished ones, how many were marked done without doing them. */
  skipped: number
  skills: number
  /** Skills of the stage with a depth shown reliable in exercises (Level one or better). */
  shown: number
  /** The first stage with an unfinished lesson. */
  current: boolean
}

interface Prog { lessonId: string; done: boolean; skipped?: boolean }

export function stageProgress(lessons: readonly Lesson[], lessonProgress: readonly Prog[], masteries: ReadonlyMap<string, Mastery>): StageProgress[] {
  const done = new Map(lessonProgress.filter(p => p.done).map(p => [p.lessonId, p]))
  const reliable = new Set<string>()
  for (const [key, m] of masteries) if (m.state === 'reliable' || m.state === 'refresh') reliable.add(key.slice(0, key.lastIndexOf('.')))
  const out: StageProgress[] = PATH_STAGES.map((s, i) => {
    const ls = lessons.filter(l => l.stage === s.id)
    const skills = new Set(ls.map(l => l.skill))
    const fin = ls.filter(l => done.has(l.id))
    return {
      id: s.id, title: s.title, milestone: s.milestone, index: i + 1, lessons: ls.length, finished: fin.length,
      skipped: fin.filter(l => done.get(l.id)?.skipped).length, skills: skills.size, shown: [...skills].filter(k => reliable.has(k)).length, current: false,
    }
  })
  const cur = out.find(s => s.lessons > s.finished)
  if (cur) cur.current = true
  return out
}

/** The one quiet line for Today, or null when the path has no lessons or is complete. */
export function stageLine(stages: readonly StageProgress[]): string | null {
  const cur = stages.find(s => s.current)
  if (!cur) return null
  return `Stage ${cur.index} of ${stages.length}: ${cur.title}. ${cur.finished} of ${cur.lessons} lessons finished.`
}
