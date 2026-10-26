// "Too easy for me": a skill-depth the learner clearly has down is shown less in practice, so an advanced learner's time is not wasted.
// Two signals: automatic (the last five first attempts were right, unhinted and quick) and manual (a button on an answered exercise).
import { kvGet, kvSet, type Attempt } from '../db'

export const TRIVIAL_STREAK = 5
export const TRIVIAL_MAX_MS = 10_000

export function autoTrivial(attempts: Attempt[]): Set<string> {
  const by = new Map<string, Attempt[]>()
  for (const a of attempts) if (a.firstAttempt && a.cue >= 3) by.set(a.skillKey, [...(by.get(a.skillKey) ?? []), a])
  const out = new Set<string>()
  for (const [k, list] of by) {
    const last = list.sort((x, y) => x.ts - y.ts).slice(-TRIVIAL_STREAK)
    if (last.length === TRIVIAL_STREAK && new Set(last.map(a => a.itemId)).size === TRIVIAL_STREAK && last.every(a => a.correct && a.hints === 0 && a.timeMs <= TRIVIAL_MAX_MS)) out.add(k)
  }
  return out
}

const KEY = 'trivial:manual'
export const loadTrivial = () => kvGet<string[]>(KEY, [])
export async function addTrivial(key: string) { const cur = await loadTrivial(); if (!cur.includes(key)) await kvSet(KEY, [...cur, key]); await kvSet('trivial:never', (await kvGet<string[]>('trivial:never', [])).filter(k => k !== key)) }
export const clearTrivial = () => kvSet(KEY, [])

// "Show it again" overrides the automatic signal (which would otherwise mark the skill trivial again at once). Marking it too easy again clears the override.
const NEVER = 'trivial:never'
export const loadNever = () => kvGet<string[]>(NEVER, [])
export async function showAgain(key: string) {
  await kvSet(KEY, (await loadTrivial()).filter(k => k !== key))
  const n = await loadNever(); if (!n.includes(key)) await kvSet(NEVER, [...n, key])
}
export async function markTrivialAgain(key: string) {
  await kvSet(NEVER, (await loadNever()).filter(k => k !== key))
  await addTrivial(key)
}
/** Skill-depths currently left out of mixed practice. */
export function effectiveTrivial(attempts: Attempt[], manual: string[], never: string[]): Set<string> {
  const out = new Set([...autoTrivial(attempts), ...manual])
  for (const k of never) out.delete(k)
  return out
}
