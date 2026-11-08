import type { Attempt } from '../db'
import type { Item } from '../types'

/** Small deterministic PRNG so a day's session is stable across reloads. */
export function rng(seed: string) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19) }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}
export function shuffled<T>(xs: readonly T[], seed: string): T[] {
  const r = rng(seed)
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

/**
 * Pick n items from a pool preferring FRESH ones: families the learner has not seen, then least recently attempted.
 * One item per family per pick, so a set never contains two variations of the same position (leakage guard).
 * By default a set that cannot be filled from distinct families is topped up from families already chosen. `strictFamilies` never
 * does that: the set comes back shorter instead (use it wherever the set is a check of independence: mastery challenges, stage
 * checks, warm-ups), and the caller says so to the learner.
 */
export function pickFresh(pool: Item[], attempts: Attempt[], n: number, seed: string, opts: { exclude?: ReadonlySet<string>; minCue?: number; strictFamilies?: boolean; excludeFamilies?: ReadonlySet<string> } = {}): Item[] {
  const lastByItem = new Map<string, number>()
  const seenFamily = new Set<string>()
  for (const a of attempts) {
    lastByItem.set(a.itemId, Math.max(lastByItem.get(a.itemId) ?? 0, a.ts))
    seenFamily.add(a.family)
  }
  const cands = pool.filter(i => !opts.exclude?.has(i.id) && !opts.excludeFamilies?.has(i.family) && (opts.minCue === undefined || i.cue >= opts.minCue))
  const order = shuffled(cands, seed)
  order.sort((x, y) => {
    const fx = seenFamily.has(x.family) ? 1 : 0
    const fy = seenFamily.has(y.family) ? 1 : 0
    if (fx !== fy) return fx - fy
    return (lastByItem.get(x.id) ?? 0) - (lastByItem.get(y.id) ?? 0)
  })
  const out: Item[] = []
  const fams = new Set<string>()
  for (const it of order) {
    if (fams.has(it.family)) continue
    fams.add(it.family); out.push(it)
    if (out.length >= n) break
  }
  if (out.length < n && !opts.strictFamilies) for (const it of order) { if (!out.includes(it)) out.push(it); if (out.length >= n) break }
  return out
}

/**
 * The silent set for a training plan (pages/Plan.tsx). Both the baseline and the later check are measurements, so neither repeats a
 * family; the check also leaves out every exercise and family used at baseline, so it measures transfer, not memory. May be shorter than n.
 */
export function planTestSet(pool: Item[], attempts: Attempt[], kind: 'baseline' | 'check', baseline: { itemIds: string[] } | undefined,
  familyOf: (id: string) => string | undefined, n: number, seed: string): Item[] {
  const usedIds = new Set(kind === 'check' ? baseline?.itemIds ?? [] : [])
  const usedFamilies = new Set<string>()
  if (kind === 'check') for (const id of baseline?.itemIds ?? []) { const f = familyOf(id); if (f !== undefined) usedFamilies.add(f) }
  return pickFresh(pool, attempts, n, seed, { exclude: usedIds, excludeFamilies: usedFamilies, strictFamilies: true })
}

/** Interleave several lists round-robin so unlike skills alternate (CD-9: interleave after the initial block). */
export function interleave<T>(lists: T[][]): T[] {
  const out: T[] = []
  const max = Math.max(0, ...lists.map(l => l.length))
  for (let i = 0; i < max; i++) for (const l of lists) if (i < l.length) out.push(l[i])
  return out
}
