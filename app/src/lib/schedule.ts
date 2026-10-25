// Concept-level spacing (CD-9): schedule the SKILL, not the diagram. Each review draws a fresh item from the skill's pool.
import type { Attempt } from '../db'

const DAY = 86400000
export const INTERVAL_DAYS = [1, 2, 4, 8, 16, 32]
const dayKey = (ts: number) => Math.floor(ts / DAY)

/** Next review time for a skill-depth, from its first attempts at cue >= minCue (default 2: cue 1 only shows the idea was seen; use 1 for a depth that has nothing but cue 1 exercises). */
export function nextDue(attempts: Attempt[], minCue = 2): number | null {
  const usable = attempts.filter(a => a.firstAttempt && a.cue >= minCue)
  if (usable.length === 0) return null
  const byDay = new Map<number, { ok: number; n: number }>()
  for (const t of usable) {
    const k = dayKey(t.ts)
    const r = byDay.get(k) ?? { ok: 0, n: 0 }
    r.n++
    if (t.correct && t.hints === 0) r.ok++
    byDay.set(k, r)
  }
  const days = [...byDay.entries()].sort((x, y) => x[0] - y[0])
  let streak = 0
  for (let i = days.length - 1; i >= 0; i--) {
    const { ok, n } = days[i][1]
    if (ok / n >= 0.75) streak++
    else break
  }
  const last = days[days.length - 1]
  const lastOk = last[1].ok / last[1].n >= 0.75
  if (!lastOk) return (last[0] + 1) * DAY // a failed day: due tomorrow
  const interval = INTERVAL_DAYS[Math.min(streak - 1, INTERVAL_DAYS.length - 1)]
  return (last[0] + interval) * DAY
}

export const isDue = (attempts: Attempt[], now = Date.now(), minCue = 2) => {
  const d = nextDue(attempts, minCue)
  return d !== null && d <= now
}
