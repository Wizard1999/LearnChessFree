import Dexie, { type Table } from 'dexie'
import { safeWrite } from './lib/saveStatus'

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
  /** How the attempt ended, in the app's three words: correct for this task, sound alternative, unsuccessful. */
  result?: 'correct' | 'sound-alternative' | 'unsuccessful'
  /** Aids used besides the numbered hints, for example 'controlMap' (counted as one hint). */
  aids?: string[]
}
export interface Reflection { id?: number; kind: string; lessonId?: string; data: Record<string, string>; ts: number }
export interface LessonProgress {
  lessonId: string; step: number; done: boolean; ts: number
  /** Marked done by the learner without doing it. */
  skipped?: boolean
  /** The stable id of the step the learner is on (or was on): a saved place survives a rewrite that moves steps about (D43). */
  sid?: string
  /** The lesson revision this place or completion applies to (a hash of the lesson's steps made at build time). */
  revision?: string
  /** 1 = written before step ids and revisions were recorded (stamped by the version 3 migration); 2 = current. */
  format?: 1 | 2
}
/** The version 3 migration for one row: mark rows that carry no revision as the old format. Rows are otherwise left exactly as they were. */
export function stampLegacyProgress(p: LessonProgress): void { if (p.revision === undefined && p.format === undefined) p.format = 1 }
/** How a game played in the app came about (set for games against the practice opponent). */
export interface GameContext { startFen: string; opponent: 'stockfish' | 'maia'; level: string; color: 'white' | 'black'; completed: boolean; lessonId?: string }
export interface GameRec { id?: number; source: string; white: string; black: string; result: string; date?: string; pgn: string; ts: number; analysis?: unknown; me?: 'white' | 'black'; context?: GameContext }
/** Time on one lesson step, for the learner's own pace estimate (lib/measuredTime.ts). Stays on this device. */
export interface StepTimeRow { id?: number; lessonId: string; sid: string; type: string; ms: number; ts: number }
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
  stepTimes!: Table<StepTimeRow, number>
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
    // Version 3: lesson progress also records the step id and the lesson revision. No index changes; existing rows are stamped as the old format.
    this.version(3).stores({
      attempts: '++id,itemId,skillKey,family,ts,source',
      reflections: '++id,kind,ts',
      lessonProgress: 'lessonId',
      games: '++id,ts',
      kv: 'key',
      feedback: '++id,targetType,targetId,ts',
    }).upgrade(tx => tx.table('lessonProgress').toCollection().modify(stampLegacyProgress))
    // Version 4: time per lesson step (new table; nothing else changes).
    this.version(4).stores({
      attempts: '++id,itemId,skillKey,family,ts,source',
      reflections: '++id,kind,ts',
      lessonProgress: 'lessonId',
      games: '++id,ts',
      kv: 'key',
      feedback: '++id,targetType,targetId,ts',
      stepTimes: '++id,type,lessonId,ts',
    })
  }
}
export const db = new AppDB()

export async function kvGet<T>(key: string, fallback: T): Promise<T> {
  try { const r = await db.kv.get(key); return (r ? r.value : fallback) as T } catch { return fallback }
}
export async function kvSet(key: string, value: unknown): Promise<void> {
  // The app keeps working when storage is unavailable, but the failure is reported (one calm notice per session), never hidden.
  await safeWrite(() => db.kv.put({ key, value }))
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
