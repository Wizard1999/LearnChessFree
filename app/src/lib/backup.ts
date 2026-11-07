// Backups: validate an export file, say what is in it before anything is changed, merge it with what is on this device or replace
// what is on this device, and decide when to remind the learner to back up. Pure functions only; the browser parts are in backupIO.ts.
import type { Attempt, Feedback, GameRec, KV, LessonProgress, Reflection } from '../db'

export interface ExportFile {
  format: 'chess-school-export'; version: number; exportedAt?: string
  attempts: Attempt[]; reflections: Reflection[]; lessonProgress: LessonProgress[]; games: GameRec[]; kv: KV[]; feedback: Feedback[]
}
export interface Scope {
  exportedAt?: string
  attempts: number; reflections: number; lessonProgress: number; lessonsFinished: number; games: number; kv: number; feedback: number
  /** First and last attempt, ms since 1970, when there are attempts. */
  firstTs?: number; lastTs?: number
}
export type Validation = { ok: true; file: ExportFile; scope: Scope } | { ok: false; error: string }

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x)
const LISTS = ['attempts', 'reflections', 'lessonProgress', 'games', 'kv', 'feedback'] as const
type ListName = typeof LISTS[number]

/** Check that a parsed file is a Chess School export of a shape the app can read. Old files may lack the smaller lists. */
export function validateExport(raw: unknown): Validation {
  if (!isObj(raw)) return { ok: false, error: 'This is not a Chess School export file (it does not hold a data object).' }
  if (raw.format !== 'chess-school-export') return { ok: false, error: 'This is not a Chess School export file (its format label is missing).' }
  if (typeof raw.version !== 'number' || raw.version > 1) return { ok: false, error: 'This file was made by a newer version of the app than this one. Open the newer version and export again, or update this one.' }
  const file: Record<string, unknown> = { ...raw }
  for (const k of LISTS) {
    if (file[k] === undefined && (k === 'feedback' || k === 'kv' || k === 'games' || k === 'reflections')) file[k] = []
    if (!Array.isArray(file[k])) return { ok: false, error: `The "${k}" part of the file is missing or damaged.` }
  }
  const bad = (k: ListName, ok: (r: Record<string, unknown>) => boolean): string | null => {
    const i = (file[k] as unknown[]).findIndex(r => !isObj(r) || !ok(r))
    return i < 0 ? null : `Row ${i + 1} of "${k}" is damaged, so nothing was changed.`
  }
  const str = (r: Record<string, unknown>, k: string) => typeof r[k] === 'string'
  const num = (r: Record<string, unknown>, k: string) => typeof r[k] === 'number' && Number.isFinite(r[k] as number)
  const err =
    bad('attempts', r => str(r, 'itemId') && str(r, 'skillKey') && num(r, 'ts') && typeof r.correct === 'boolean') ??
    bad('lessonProgress', r => str(r, 'lessonId') && num(r, 'step') && typeof r.done === 'boolean') ??
    bad('reflections', r => str(r, 'kind') && num(r, 'ts')) ??
    bad('games', r => str(r, 'pgn') && num(r, 'ts')) ??
    bad('kv', r => str(r, 'key')) ??
    bad('feedback', r => str(r, 'targetId') && num(r, 'ts'))
  if (err) return { ok: false, error: err }
  const f = file as unknown as ExportFile
  return { ok: true, file: f, scope: scopeOf(f) }
}

export function scopeOf(f: ExportFile): Scope {
  const ts = f.attempts.map(a => a.ts)
  return {
    exportedAt: f.exportedAt,
    attempts: f.attempts.length, reflections: f.reflections.length, lessonProgress: f.lessonProgress.length,
    lessonsFinished: f.lessonProgress.filter(p => p.done).length, games: f.games.length, kv: f.kv.length, feedback: f.feedback.length,
    ...(ts.length ? { firstTs: Math.min(...ts), lastTs: Math.max(...ts) } : {}),
  }
}

const plural = (c: number, one: string, many = one + 's') => `${c} ${c === 1 ? one : many}`

/** One plain sentence on what the file holds. */
export function describeScope(s: Scope): string {
  const day = (t: number) => new Date(t).toISOString().slice(0, 10)
  const parts = [plural(s.attempts, 'answer'), `${plural(s.lessonsFinished, 'finished lesson')} (${plural(s.lessonProgress, 'lesson record')})`, plural(s.reflections, 'note'), plural(s.games, 'game')]
  const span = s.firstTs !== undefined && s.lastTs !== undefined ? `, answers from ${day(s.firstTs)} to ${day(s.lastTs)}` : ''
  return `${parts.join(', ')}${span}${s.exportedAt ? `. Exported ${s.exportedAt.slice(0, 10)}` : ''}.`
}

// ---- merge ----------------------------------------------------------------------------------------------------------------------

const keyAttempt = (a: Attempt) => `${a.itemId}|${a.ts}|${a.source}`
const keyReflection = (r: Reflection) => `${r.kind}|${r.ts}|${r.lessonId ?? ''}`
const keyGame = (g: GameRec) => `${g.ts}|${g.pgn.length}|${g.pgn.slice(0, 80)}`
const keyFeedback = (f: Feedback) => `${f.targetType}|${f.targetId}|${f.ts}`

/** Of two records for the same lesson keep the finished one; if both or neither are finished, the more recently written. */
export function betterProgress(a: LessonProgress, b: LessonProgress): LessonProgress {
  if (a.done !== b.done) return a.done ? a : b
  return b.ts > a.ts ? b : a
}

export interface MergePlan {
  attempts: Attempt[]; reflections: Reflection[]; games: GameRec[]; feedback: Feedback[]
  /** Progress rows to write (new lessons, or the file's row where it is better than the one here). */
  lessonProgress: LessonProgress[]
  /** Settings the file has that this device lacks. Settings already on this device are kept. */
  kv: KV[]
}
function newOnes<T>(have: T[], add: T[], key: (x: T) => string): T[] {
  const seen = new Set(have.map(key))
  return add.filter(x => { const k = key(x); if (seen.has(k)) return false; seen.add(k); return true })
}
/** What a merge would add to `current`. Nothing here is ever removed or overwritten with older data. */
export function planMerge(current: ExportFile, incoming: ExportFile): MergePlan {
  const here = new Map(current.lessonProgress.map(p => [p.lessonId, p]))
  const progress: LessonProgress[] = []
  for (const p of incoming.lessonProgress) {
    const mine = here.get(p.lessonId)
    if (!mine || (mine !== p && betterProgress(mine, p) === p)) progress.push(p)
  }
  const haveKv = new Set(current.kv.map(k => k.key))
  return {
    attempts: newOnes(current.attempts, incoming.attempts, keyAttempt), reflections: newOnes(current.reflections, incoming.reflections, keyReflection),
    games: newOnes(current.games, incoming.games, keyGame), feedback: newOnes(current.feedback, incoming.feedback, keyFeedback),
    lessonProgress: progress, kv: incoming.kv.filter(k => !haveKv.has(k.key)),
  }
}
export function describeMerge(p: MergePlan): string {
  return `Merging would add ${plural(p.attempts.length, 'answer')}, ${plural(p.lessonProgress.length, 'lesson record')}, ${plural(p.reflections.length, 'note')} and ${plural(p.games.length, 'game')} that are not on this device yet. Nothing here would be removed.`
}

// ---- when to remind ---------------------------------------------------------------------------------------------------------------

export const WEEK_MS = 7 * 24 * 3600 * 1000
export interface NudgeInput {
  now: number
  /** Lessons finished (not skipped) on this device. */
  finished: number
  /** Time of the newest answer or lesson record. */
  latestProgressTs: number
  /** When the learner last exported, and when a reminder was last acted on (either may be missing). */
  lastBackupTs?: number
  lastNudgeTs?: number
}
/** After the first finished lesson once; after that at most once a week, and only when there is progress newer than the last backup or reminder. */
export function shouldNudgeBackup(i: NudgeInput): boolean {
  if (i.finished < 1) return false
  const last = Math.max(i.lastBackupTs ?? 0, i.lastNudgeTs ?? 0)
  if (last === 0) return true
  return i.now - last >= WEEK_MS && i.latestProgressTs > last
}
