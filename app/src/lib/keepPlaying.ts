// The playing culture (D79): play lots of games, bring one recent lesson into each, and notice afterwards whether it showed up.
// Everything here is local and deterministic: no AI, no accounts, nothing sent anywhere. The lines name the learner's own recent lessons and make no chess claim of their own.
import type { LessonProgress, Reflection } from '../db'
import type { LessonMeta } from '../types'

/** The lessons finished most recently (a lesson marked finished without doing it does not count), newest first. */
export function recentFinishedLessons(progress: LessonProgress[], lessonById: ReadonlyMap<string, LessonMeta>, n = 3): LessonMeta[] {
  return [...progress].filter(p => p.done && !p.skipped).sort((a, b) => b.ts - a.ts)
    .map(p => lessonById.get(p.lessonId)).filter((l): l is LessonMeta => !!l).slice(0, n)
}

/** "What to try this game": one line drawn from the most recent lesson, or a general one when nothing is finished yet. */
export function tryThisGame(recent: LessonMeta | undefined): string {
  return recent
    ? `Last lesson: ${recent.title}. Look for it in your own moves, and try to spot it in your opponent's.`
    : 'Pick one thing to look for this game: is every piece you move safe, and is every piece of theirs?'
}

export const GAME_TAGS = [
  { id: 'used', label: 'I used it' },
  { id: 'late', label: 'I saw it, but too late' },
  { id: 'against', label: 'My opponent used it on me' },
  { id: 'none', label: 'It did not come up' },
] as const
export type GameTagId = (typeof GAME_TAGS)[number]['id']

/** The reflection saved for one tag: kept on this device, shown in the Learning record notes. */
export function gameLessonReflection(tag: GameTagId, lesson: Pick<LessonMeta, 'id' | 'title'>, gameId: number, now = Date.now()): Omit<Reflection, 'id'> {
  const label = GAME_TAGS.find(t => t.id === tag)?.label ?? tag
  return { kind: 'game-lesson', lessonId: lesson.id, ts: now, data: { game: String(gameId), tag, lesson: lesson.title, label } }
}

/** How often each tag was chosen across games: a small honest summary (counts, never a score). */
export function tagCounts(reflections: Reflection[]): Record<GameTagId, number> {
  const c: Record<GameTagId, number> = { used: 0, late: 0, against: 0, none: 0 }
  for (const r of reflections) if (r.kind === 'game-lesson' && r.data.tag in c) c[r.data.tag as GameTagId]++
  return c
}
