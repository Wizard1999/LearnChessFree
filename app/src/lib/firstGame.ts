// The invitation to play a first game, and the explicit defaults of a game opened from it. Pure functions (the component is
// components/FirstGameInvite.tsx). The invitation is a quiet offer, never a gate: nothing in the app waits for it.
import type { LessonMeta } from '../types'
import { PATH_STAGES } from './pathStages'
import type { OpponentChoice } from './maia'

/**
 * The path stage that teaches the basic rules (S1, "Legal play"). When the learner has finished L-FND-CHECK-1 or any lesson of this stage, the
 * invitation appears (rulesStarted). The path is being rebuilt: if neither exists any more the invitation simply does not appear.
 */
export const RULES_STAGE_ID = 'S1'
export const INVITE_PAUSE_MS = 7 * 86_400_000
export const INVITE_DISMISS_KEY = 'firstGame:dismissedUntil'

/** The explicit gentle game: Stockfish Beginner, the learner plays White, the hint button on. Written into the link, not read from the last setting. */
export const GENTLE_PLAY_PATH = '/play?from=invite&kind=stockfish&bot=b1&color=white&help=1'

const stageIdsThrough = (stage: string): string[] => {
  const i = PATH_STAGES.findIndex(s => s.id === stage)
  return i < 0 ? [] : PATH_STAGES.slice(0, i + 1).map(s => s.id)
}

export interface Done { lessonId: string; done: boolean }

/** True when there are lessons in the rules stage and every lesson of it and of the stages before it is finished or skipped. (The stricter, older condition; the invitation now uses rulesStarted.) */
export function rulesDone(lessons: readonly Pick<LessonMeta, 'id' | 'stage'>[], progress: readonly Done[], stage = RULES_STAGE_ID): boolean {
  const ids = new Set(stageIdsThrough(stage))
  const mine = lessons.filter(l => l.stage && ids.has(l.stage))
  if (mine.length === 0 || !mine.some(l => l.stage === stage)) return false
  const done = new Set(progress.filter(p => p.done).map(p => p.lessonId))
  return mine.every(l => done.has(l.id))
}

/** The lesson that teaches check: finishing it is enough for the invitation (D55: a legal game about an hour after starting). */
export const CHECK_LESSON_ID = 'L-FND-CHECK-1'

/**
 * True once the learner has finished L-FND-CHECK-1 or any lesson of the rules stage (S1, "Legal play"). Deliberately early (D55, D56): the
 * invitation is an offer, not a certificate, and the special rules come after the first game. Skipped lessons count as finished.
 */
export function rulesStarted(lessons: readonly Pick<LessonMeta, 'id' | 'stage'>[], progress: readonly Done[], stage = RULES_STAGE_ID): boolean {
  const done = new Set(progress.filter(p => p.done).map(p => p.lessonId))
  if (done.has(CHECK_LESSON_ID)) return true
  return lessons.some(l => l.stage === stage && done.has(l.id))
}

/** True once any lesson is finished: from then on the Today card offers a quiet "Play now" (never a gate). */
export const anyLessonDone = (progress: readonly Done[]): boolean => progress.some(p => p.done)

/**
 * The first lesson in path order that has a guided-game step, and that step's id (step ids of guided steps start with "g": tools/build_content.py
 * step_key). The start screen opens this game first (D56: a board and a move in front of the learner within seconds). Null when no lesson has one.
 */
export function firstGuided(lessons: readonly Pick<LessonMeta, 'id' | 'order' | 'stepRefs' | 'course'>[], within = 3): { lessonId: string; sid: string } | null {
  const path = lessons.filter(l => l.order !== undefined && !l.course).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, within)
  for (const l of path) {
    const r = (l.stepRefs ?? []).find(x => x.sid.startsWith('g'))
    if (r) return { lessonId: l.id, sid: r.sid }
  }
  return null
}

export interface InviteInput {
  lessons: readonly Pick<LessonMeta, 'id' | 'stage'>[]
  progress: readonly Done[]
  /** The learner has already finished a game against the practice opponent. */
  hasPlayed: boolean
  dismissedUntil: number | null
  now: number
  stage?: string
}
export function showInvite(i: InviteInput): boolean {
  if (i.hasPlayed) return false
  if (i.dismissedUntil !== null && i.now < i.dismissedUntil) return false
  return rulesStarted(i.lessons, i.progress, i.stage)
}

/** Where in a list of stage groups (sorted by stage) the invitation goes: before the first group that comes after the rules stage, else at the end. */
export function inviteSlot(groupIds: readonly string[], stage = RULES_STAGE_ID): number {
  const order = PATH_STAGES.map(s => s.id)
  const at = order.indexOf(stage)
  const idx = groupIds.findIndex(g => order.indexOf(g) > at)
  return idx < 0 ? groupIds.length : idx
}

type Params = Pick<URLSearchParams, 'get'>

/** True when the page was opened from the invitation (or any link that spells the opponent out). */
export const isExplicitPlay = (p: Params): boolean => p.get('from') === 'invite' || p.get('bot') !== null || p.get('kind') !== null

/** The opponent for the Play page: explicit link parameters win; otherwise the last choice. */
export function opponentFromParams(p: Params, stored: OpponentChoice, knownBots: readonly string[]): OpponentChoice {
  if (!isExplicitPlay(p)) return stored
  const kind = p.get('kind') === 'maia' ? 'maia' : 'stockfish'
  const bot = p.get('bot')
  const botId = bot && knownBots.includes(bot) ? bot : 'b1'
  return { ...stored, kind, botId }
}
export const colorFromParams = (p: Params): 'white' | 'black' | null => (p.get('color') === 'black' ? 'black' : p.get('color') === 'white' ? 'white' : null)
/** The hint button is on unless the link says otherwise. */
export const helpFromParams = (p: Params): boolean => p.get('help') !== '0'
