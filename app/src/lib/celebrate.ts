// Celebrations (docs/design-feel.md, D86): a tiny event bus between the places that notice a real change in the evidence (a skill rising a level, a
// finished game, a finished stage) and the layer that shows it. Visual celebrations work whatever the sound settings say. Milestones are shown once
// per device (stored in the kv table); the daily counters behind the Today line are kept there too. Nothing here ever throws or blocks.
import { useLiveQuery } from 'dexie-react-hooks'
import { kvGet, kvSet } from '../db'
import type { Level } from './missions'
import { todaySummary } from './encourage'

export type CelebrationArt = 'glass' | 'star' | 'crest'
export interface Celebration {
  id: number
  art: CelebrationArt
  /** For the glass: the level the water rises from and to (0 Not started .. 4 Mastered). */
  fromLevel: Level
  toLevel: Level
  title: string
  body: string
  /** A milestone card stays until dismissed; a toast fades by itself. */
  sticky: boolean
  next?: { to: string; label: string }
}

let seq = 0
const listeners = new Set<(c: Celebration) => void>()
export const subscribeCelebrations = (l: (c: Celebration) => void) => { listeners.add(l); return () => { listeners.delete(l) } }
export function celebrate(c: Omit<Celebration, 'id'>) { const full = { ...c, id: ++seq }; listeners.forEach(l => l(full)) }

// ---- once per milestone ----
const mkey = (k: string) => `milestone:${k}`
/** True the first time a milestone is claimed on this device (and records it); false afterwards or if storage fails. */
export async function claimMilestone(key: string): Promise<boolean> {
  try {
    if (await kvGet<boolean>(mkey(key), false)) return false
    await kvSet(mkey(key), true)
    return true
  } catch { return false }
}
/** Records milestones as already seen without showing anything (for what a learner had reached before this feature existed). */
export async function claimSilently(keys: readonly string[]): Promise<void> { for (const k of keys) await claimMilestone(k) }
export const MILESTONES_READY_KEY = 'milestones:ready'

// ---- the day's counts, for the "Today you finished..." line ----
export const dayKey = (d = new Date()) => `today:${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export interface DayCounts { lessons: number; ups: number }
export async function bumpToday(field: keyof DayCounts, n = 1): Promise<void> {
  if (n <= 0) return
  const k = dayKey()
  const cur = await kvGet<DayCounts>(k, { lessons: 0, ups: 0 })
  await kvSet(k, { ...cur, [field]: (cur[field] ?? 0) + n })
}
/** The Today line (null while nothing has happened today). Updates live. */
export function useTodaySummary(): string | null {
  const k = dayKey()
  const c = useLiveQuery(() => kvGet<DayCounts>(k, { lessons: 0, ups: 0 }), [k])
  return c ? todaySummary(c.lessons ?? 0, c.ups ?? 0) : null
}

// ---- what changed between two readings of every skill's level ----
export interface Rise { id: string; from: Level; to: Level }
/** Skills whose level went up between two readings. A skill missing from the earlier reading is not a change. */
export function levelRises(before: ReadonlyMap<string, Level>, after: ReadonlyMap<string, Level>): Rise[] {
  const out: Rise[] = []
  for (const [id, to] of after) { const from = before.get(id); if (from !== undefined && to > from) out.push({ id, from, to }) }
  return out
}
/** The rise to celebrate: the highest level reached, then the biggest jump. */
export function topRise(rises: readonly Rise[]): Rise | null {
  return rises.reduce<Rise | null>((b, r) => (!b || r.to > b.to || (r.to === b.to && r.to - r.from > b.to - b.from) ? r : b), null)
}

// ---- stages ----
/** The ids of the stages whose lessons are all finished (a stage with no lessons never counts). Skipped lessons count as finished, as everywhere else. */
export function completedStages(lessons: readonly { id: string; stage?: string }[], doneIds: ReadonlySet<string>): Set<string> {
  const total = new Map<string, number>(), done = new Map<string, number>()
  for (const l of lessons) { if (!l.stage) continue; total.set(l.stage, (total.get(l.stage) ?? 0) + 1); if (doneIds.has(l.id)) done.set(l.stage, (done.get(l.stage) ?? 0) + 1) }
  return new Set([...total].filter(([s, n]) => n > 0 && done.get(s) === n).map(([s]) => s))
}
