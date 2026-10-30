// Evidence-weighted mastery estimate per skill-depth (docs/council-synthesis.md CD-9, CD-13; replaces the 8-of-10 gate).
// We keep a Beta(a,b) posterior over "probability of succeeding on a fresh, unlabeled item of this skill-depth".
// Only FIRST attempts count as independent evidence; hint-assisted successes do not count as success; evidence from
// cued items is down-weighted because it does not show the idea can be used when nobody names it.
import type { Attempt } from '../db'

export const CUE_WEIGHT: Record<number, number> = { 1: 0.2, 2: 0.5, 3: 1, 4: 1.5 }
export const RELIABLE_P = 0.8 // "reliable" = probably succeeds on >= 80% of fresh unlabeled items (a pilot decision, not a research result)
export const RELIABLE_CERTAINTY = 0.85 // required posterior probability that the true rate is >= RELIABLE_P
export const MIN_UNLABELED_WEIGHT = 5 // and at least this much weighted evidence at cue >= 3
export const FAMILY_WEIGHT = 0.5 // a new exercise from a family already seen
export const REPEAT_WEIGHT = 0.25 // a later presentation of an exercise already answered adds a quarter of the evidence: it shows memory of the position more than skill

function lnGamma(x: number): number {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]
  let y = x
  let tmp = x + 5.5
  tmp -= (x + 0.5) * Math.log(tmp)
  let ser = 1.000000000190015
  for (const cj of c) ser += cj / ++y
  return -tmp + Math.log((2.5066282746310005 * ser) / x)
}

function betacf(a: number, b: number, x: number): number {
  const MAXIT = 300
  const EPS = 3e-12
  const FPMIN = 1e-300
  const qab = a + b
  const qap = a + 1
  const qam = a - 1
  let c = 1
  let d = 1 - (qab * x) / qap
  if (Math.abs(d) < FPMIN) d = FPMIN
  d = 1 / d
  let h = d
  for (let m = 1; m <= MAXIT; m++) {
    const m2 = 2 * m
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2))
    d = 1 + aa * d
    if (Math.abs(d) < FPMIN) d = FPMIN
    c = 1 + aa / c
    if (Math.abs(c) < FPMIN) c = FPMIN
    d = 1 / d
    h *= d * c
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2))
    d = 1 + aa * d
    if (Math.abs(d) < FPMIN) d = FPMIN
    c = 1 + aa / c
    if (Math.abs(c) < FPMIN) c = FPMIN
    d = 1 / d
    const del = d * c
    h *= del
    if (Math.abs(del - 1) < EPS) break
  }
  return h
}

/** Regularized incomplete beta function I_x(a,b). */
export function betai(a: number, b: number, x: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const bt = Math.exp(lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x))
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b
}

/** P(true rate >= x) under Beta(a,b). */
export const probAtLeast = (a: number, b: number, x: number) => 1 - betai(a, b, x)

export type MasteryState = 'unseen' | 'introduced' | 'practising' | 'reliable' | 'refresh'
export interface Mastery {
  a: number
  b: number
  mean: number
  pReliable: number
  unlabeledWeight: number // weighted evidence at cue >= 3 (at any cue where the depth has no unlabeled exercise: see cuedOnly)
  /** The depth has no exercise at cue 3 or above, so evidence at the cue it has counts in full and "reliable" means reliable when the idea is named or cued. */
  cuedOnly: boolean
  n: number // independent first attempts counted
  ok: number // of those, how many were right with no hint
  lastTs: number | null
  state: MasteryState
}

export function masteryOf(attempts: Attempt[], opts?: { now?: number; refreshAfterDays?: number; cuedOnly?: boolean }): Mastery {
  const now = opts?.now ?? Date.now()
  const cuedOnly = !!opts?.cuedOnly
  let a = 1
  let b = 1
  let unl = 0
  let n = 0
  let ok = 0
  let last: number | null = null
  let lastEvidence: number | null = null // the refresher clock runs from the last first attempt that counts toward "reliable"
  const presented = new Map<string, number>()
  const families = new Set<string>()
  for (const t of attempts) {
    last = last === null ? t.ts : Math.max(last, t.ts)
    if (!t.firstAttempt) continue
    // Inside a lesson the idea has just been named, so a lesson answer is never evidence about an unnamed position: cap it at cue 2.
    const cue = t.source === 'lesson' ? Math.min(t.cue, 2) : t.cue
    const counts = cue >= 3 || cuedOnly
    // The first time an exercise is answered counts in full; the second adds a quarter; later ones add nothing (they show memory of the position).
    const times = presented.get(t.itemId) ?? 0
    presented.set(t.itemId, times + 1)
    // A different exercise from a family already answered is a near-duplicate of that position: it counts half (an outside review flagged that same-family items overstate independence).
    const sameFamily = times === 0 && families.has(t.family)
    families.add(t.family)
    const w = (cuedOnly ? 1 : (CUE_WEIGHT[cue] ?? 1)) * (times === 0 ? (sameFamily ? FAMILY_WEIGHT : 1) : times === 1 ? REPEAT_WEIGHT : 0)
    if (w === 0) continue
    if (counts) lastEvidence = lastEvidence === null ? t.ts : Math.max(lastEvidence, t.ts)
    n++
    if (t.correct && t.hints === 0) { a += w; ok++ }
    else if (t.correct) b += 0.5 * w // right, but not independently
    else b += w
    if (counts) unl += w
  }
  const mean = a / (a + b)
  const pReliable = probAtLeast(a, b, RELIABLE_P)
  let state: MasteryState = 'unseen'
  if (attempts.length > 0) state = 'introduced'
  if (unl > 0) state = 'practising'
  if (pReliable >= RELIABLE_CERTAINTY && unl >= MIN_UNLABELED_WEIGHT) state = 'reliable'
  const refreshAfter = (opts?.refreshAfterDays ?? 21) * 86400000
  const clock = lastEvidence ?? last
  if (state === 'reliable' && clock !== null && now - clock > refreshAfter) state = 'refresh'
  return { a, b, mean, pReliable, unlabeledWeight: unl, cuedOnly, n, ok, lastTs: last, state }
}

/** Plain-language statement of what the evidence supports, never a bare score (CD-14). */
export function describeMastery(m: Mastery): string {
  if (m.state === 'unseen') return 'Not started.'
  if (m.state === 'introduced') return m.cuedOnly ? 'Seen; no first attempts counted yet.' : 'Seen with hints or labels; not yet tested when the idea is not named.'
  const pct = Math.round(m.mean * 100)
  if (m.state === 'practising' && m.n < 6) return `Practising. ${m.ok} of ${m.n} right on the first try without hints so far. That is too few to say how reliable it is.`
  if (m.state === 'practising') return `Practising. About ${pct}% on ${m.cuedOnly ? 'named or cued' : 'fresh unlabeled'} items so far (${m.n} counted); not enough evidence to call it reliable.`
  if (m.state === 'reliable' && m.cuedOnly) return `Reliable when the idea is named or cued (about ${pct}%, ${m.n} counted). This depth has no unlabeled exercises yet, so that is the best evidence it can give.`
  if (m.state === 'reliable') return `Reliable on fresh unlabeled items (about ${pct}%, ${m.n} counted). Not yet shown in your own games unless you import some.`
  return 'Was reliable; it has been a while. A short refresher will confirm it.'
}
