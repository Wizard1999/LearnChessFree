import Dexie, { type Table } from 'dexie'

export type AttemptSource = 'lesson' | 'practice' | 'placement' | 'warmup' | 'review' | 'daily' | 'challenge' | 'game'
export interface Attempt {
  id?: number
  itemId: string
  skillKey: string // SKILL.Dn
  cue: number
  family: string
  correct: boolean
  firstAttempt: boolean
  hints: number
  timeMs: number
  confidence?: 'low' | 'medium' | 'high'
  source: AttemptSource
  ts: number
  /** The learner was not prompted to use the idea: cue>=3 and no hints (feeds the independence ledger). */
  unprompted: boolean
  silent?: boolean
  /** Thinking-loop prompt levels the learner opened for this item (V1 scan, V2 forcing moves, V3 candidates). */
  scan?: string[]
  /** The answer was not in the item's accepted set but the engine rated it as sound (find-the-move items at cue 3+). */
  alt?: boolean
  /** Aids used besides the numbered hints, for example 'controlMap' (counted as one hint). */
  aids?: string[]
}
export interface Reflection { id?: number; kind: string; lessonId?: string; data: Record<string, string>; ts: number }
export interface LessonProgress { lessonId: string; step: number; done: boolean; ts: number; /** Marked done by the learner without doing it. */ skipped?: boolean }
export interface GameRec { id?: number; source: string; white: string; black: string; result: string; date?: string; pgn: string; ts: number; analysis?: unknown; me?: 'white' | 'black' }
export interface KV { key: string; value: unknown }
/** A reviewer's report on a lesson or an exercise. Stored on the reviewer's device, exported as a file, optionally posted to the project's feedback address. */
export interface Feedback {
  id?: number
  targetType: 'lesson' | 'item'
  targetId: string
  ts: number
  /** Answers to the checklist: key -> 'yes' | 'no' | 'unsure' or a difficulty word. */
  checks: Record<string, string>
  step?: number
  kind?: string
  text: string
  build: string
}

class AppDB extends Dexie {
  attempts!: Table<Attempt, number>
  reflections!: Table<Reflection, number>
  lessonProgress!: Table<LessonProgress, string>
  games!: Table<GameRec, number>
  kv!: Table<KV, string>
  feedback!: Table<Feedback, number>
  constructor() {
    super('chess-school')
    this.version(1).stores({
      attempts: '++id,itemId,skillKey,family,ts,source',
      reflections: '++id,kind,ts',
      lessonProgress: 'lessonId',
      games: '++id,ts',
      kv: 'key',
    })
    this.version(2).stores({
      attempts: '++id,itemId,skillKey,family,ts,source',
      reflections: '++id,kind,ts',
      lessonProgress: 'lessonId',
      games: '++id,ts',
      kv: 'key',
      feedback: '++id,targetType,targetId,ts',
    })
  }
}
export const db = new AppDB()

export async function kvGet<T>(key: string, fallback: T): Promise<T> {
  try { const r = await db.kv.get(key); return (r ? r.value : fallback) as T } catch { return fallback }
}
export async function kvSet(key: string, value: unknown): Promise<void> {
  try { await db.kv.put({ key, value }) } catch { /* storage may be unavailable (private mode); the app still works for the session */ }
}

/** Everything the learner owns, as one JSON object (the 'succession portfolio': readable without the app). */
export async function exportAll() {
  return {
    format: 'chess-school-export', version: 1, exportedAt: new Date().toISOString(),
    attempts: await db.attempts.toArray(), reflections: await db.reflections.toArray(),
    lessonProgress: await db.lessonProgress.toArray(), games: await db.games.toArray(), kv: await db.kv.toArray(), feedback: await db.feedback.toArray(),
  }
}
export async function importAll(obj: Awaited<ReturnType<typeof exportAll>>) {
  if (obj.format !== 'chess-school-export') throw new Error('Not a Chess School export file')
  await db.transaction('rw', [db.attempts, db.reflections, db.lessonProgress, db.games, db.kv, db.feedback], async () => {
    await Promise.all([db.attempts.clear(), db.reflections.clear(), db.lessonProgress.clear(), db.games.clear(), db.kv.clear(), db.feedback.clear()])
    await db.feedback.bulkAdd((obj.feedback ?? []).map(a => ({ ...a, id: undefined })))
    await db.attempts.bulkAdd(obj.attempts.map(a => ({ ...a, id: undefined })))
    await db.reflections.bulkAdd(obj.reflections.map(a => ({ ...a, id: undefined })))
    await db.lessonProgress.bulkPut(obj.lessonProgress)
    await db.games.bulkAdd(obj.games.map(a => ({ ...a, id: undefined })))
    await db.kv.bulkPut(obj.kv)
  })
}
export async function resetAll() { await db.delete(); await db.open() }
