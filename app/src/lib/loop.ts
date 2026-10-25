// Thinking Loop prompts (LOOP.V1-V3): printed beside the board in the loop lessons, offered on request in mixed practice,
// and retired once the learner has solved RETIRE_AFTER mixed items in a row without opening them. Support fades on evidence.
// RETIRE_AFTER = 5 is a first guess (the lessons say so); it is a constant here so it can be changed in one place.
import { kvGet, kvSet } from '../db'

export type LoopLevel = 'V1' | 'V2' | 'V3'
export const LOOP_LEVELS: LoopLevel[] = ['V1', 'V2', 'V3']
export const RETIRE_AFTER = 5

export const LOOP_INFO: Record<LoopLevel, { title: string; lessonId: string; lines: string[]; candidateBox?: boolean }> = {
  V1: {
    title: 'Safety scan', lessonId: 'L-LOOP-V1-1',
    lines: ["What did my opponent's last move attack or open?", 'Which of my pieces are loose (attacked and not defended), or attacked by something cheaper?'],
  },
  V2: {
    title: 'Forcing moves first', lessonId: 'L-LOOP-V2-1',
    lines: ['List the checks, then the captures, then the threats, yours first and then theirs. Look at quiet moves only after that.'],
  },
  V3: {
    title: 'Candidate moves', lessonId: 'L-LOOP-V3-1',
    lines: ['Write two to four candidate moves, forcing ones first.', 'Follow each for about three plies: my move, their best reply, my next move. Drop the ones that clearly fail.'],
    candidateBox: true,
  },
}

export interface LoopState { retired: Partial<Record<LoopLevel, boolean>>; streak: Partial<Record<LoopLevel, number>> }
export const EMPTY_LOOP: LoopState = { retired: {}, streak: {} }

/** Levels offered in mixed practice: the learner has finished that level's lesson and has not yet retired its prompt. */
export function offeredLevels(state: LoopState, doneLessons: ReadonlySet<string>): LoopLevel[] {
  return LOOP_LEVELS.filter(l => doneLessons.has(LOOP_INFO[l].lessonId) && !state.retired[l])
}

/**
 * Update the fade counters after a mixed-practice item. A solve (first try, no hints) with the prompt closed adds one to each
 * offered level's streak; opening the prompt or getting it wrong resets the streak; reaching RETIRE_AFTER retires the level.
 */
export function afterMixedItem(state: LoopState, levels: LoopLevel[], solved: boolean, opened: boolean): LoopState {
  const streak = { ...state.streak }
  const retired = { ...state.retired }
  for (const l of levels) {
    if (solved && !opened) {
      streak[l] = (streak[l] ?? 0) + 1
      if (streak[l]! >= RETIRE_AFTER) retired[l] = true
    } else streak[l] = 0
  }
  return { retired, streak }
}

export const loadLoop = () => kvGet<LoopState>('loop', EMPTY_LOOP)
export const saveLoop = (s: LoopState) => kvSet('loop', s)
