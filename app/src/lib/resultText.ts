import type { Claim } from '../types'

/** The three outcomes stored with each attempt, in plain words. */
export type ResultKind = 'correct' | 'sound-alternative' | 'unsuccessful'

export const RESULT_LABEL: Record<ResultKind, string> = {
  correct: 'correct for this task',
  'sound-alternative': 'sound alternative',
  unsuccessful: 'unsuccessful',
}

export function resultKind(correct: boolean, alternative: boolean): ResultKind {
  return !correct ? 'unsuccessful' : alternative ? 'sound-alternative' : 'correct'
}

/** The first line of the feedback: the result in words. */
export function resultHeadline(kind: ResultKind, wrongsBefore: number): string {
  if (kind === 'sound-alternative') return 'A sound alternative.'
  if (kind === 'unsuccessful') return 'Unsuccessful this time.'
  return wrongsBefore === 0 ? 'Correct for this task.' : 'Correct for this task, after a second look.'
}

const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9+\-# ]/g, ' ').split(/\s+/).filter(w => w.length > 2)
const ENGINE_TALK = /\b(depth\s*\d+|centipawns?|cp|stockfish|syzygy|tablebase|engine|eval(?:uation)?|[+-]\d+\.\d+)\b/gi

/**
 * Whether an exercise's own explanation says something in words. It does not when it is empty, very short, mostly engine numbers,
 * or just repeats one of the machine-checked claims (then it is evidence, not an explanation).
 */
export function explanationIsReal(explain: string | undefined, claims: Pick<Claim, 'statement'>[]): boolean {
  const e = (explain ?? '').trim()
  if (words(e).length < 4) return false
  if ((e.match(ENGINE_TALK) ?? []).length >= 2) return false
  const ew = new Set(words(e))
  for (const c of claims) {
    const cw = new Set(words(c.statement ?? ''))
    if (cw.size < 3) continue
    const shared = [...ew].filter(w => cw.has(w)).length
    if (shared / ew.size >= 0.8 && shared / cw.size >= 0.6) return false // restates the check
  }
  return true
}

/** What to show first: the author's explanation, or one neutral line when there is none (never engine numbers dressed as an explanation). */
export function leadText(explain: string | undefined, claims: Pick<Claim, 'statement'>[]): { text: string; written: boolean } {
  return explanationIsReal(explain, claims)
    ? { text: (explain ?? '').trim(), written: true }
    : { text: 'This exercise has no written explanation yet. Open "How this was checked" to see what was verified.', written: false }
}
