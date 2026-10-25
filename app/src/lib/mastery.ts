// Evidence-weighted mastery estimate per skill-depth (docs/council-synthesis.md CD-9, CD-13; replaces the 8-of-10 gate).
// We keep a Beta(a,b) posterior over "probability of succeeding on a fresh, unlabeled item of this skill-depth".
// Only FIRST attempts count as independent evidence; hint-assisted successes do not count as success; evidence from
// cued items is down-weighted because it does not show the idea can be used when nobody names it.
import type { Attempt } from '../db'

export const CUE_WEIGHT: Record<number, number> = { 1: 0.2, 2: 0.5, 3: 1, 4: 1.5 }
export const RELIABLE_P = 0.8 // "reliable" = probably succeeds on >= 80% of fresh unlabeled items (a pilot decision, not a research result)
export const RELIABLE_CERTAINTY = 0.85 // required posterior probability that the true rate is >= RELIABLE_P
export const MIN_UNLABELED_WEIGHT = 5 // and at least this much weighted evidence at cue >= 3

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
  unlabeledWeight: number // weighted evidence at cue >= 3
  n: number // independent first attempts counted
  ok: number // of those, how many were right with no hint
  lastTs: number | null
  state: MasteryState
}

export function masteryOf(attempts: Attempt[], opts?: { now?: number; refreshAfterDays?: number }): Mastery {
  const now = opts?.now ?? Date.now()
  let a = 1
  let b = 1
  let unl = 0
  let n = 0
  let ok = 0
  let last: number | null = null
  for (const t of attempts) {
    last = last === null ? t.ts : Math.max(last, t.ts)
    if (!t.firstAttempt) continue
    const w = CUE_WEIGHT[t.cue] ?? 1
    n++
    if (t.correct && t.hints === 0) { a += w; ok++ }
    else if (t.correct) b += 0.5 * w // right, but not independently
    else b += w
    if (t.cue >= 3) unl += w
  }
  const mean = a / (a + b)
  const pReliable = probAtLeast(a, b, RELIABLE_P)
  let state: MasteryState = 'unseen'
  if (attempts.length > 0) state = 'introduced'
  if (unl > 0) state = 'practising'
  if (pReliable >= RELIABLE_CERTAINTY && unl >= MIN_UNLABELED_WEIGHT) state = 'reliable'
  const refreshAfter = (opts?.refreshAfterDays ?? 21) * 86400000
  if (state === 'reliable' && last !== null && now - last > refreshAfter) state = 'refresh'
  return { a, b, mean, pReliable, unlabeledWeight: unl, n, ok, lastTs: last, state }
}

/** Plain-language statement of what the evidence supports, never a bare score (CD-14). */
export function describeMastery(m: Mastery): string {
  if (m.state === 'unseen') return 'Not started.'
  if (m.state === 'introduced') return 'Seen with hints or labels; not yet tested when the idea is not named.'
  const pct = Math.round(m.mean * 100)
  if (m.state === 'practising' && m.n < 6) return `Practising. ${m.ok} of ${m.n} right on the first try without hints so far. That is too few to say how reliable it is.`
  if (m.state === 'practising') return `Practising. About ${pct}% on fresh unlabeled items so far (${m.n} counted); not enough evidence to call it reliable.`
  if (m.state === 'reliable') return `Reliable on fresh unlabeled items (about ${pct}%, ${m.n} counted). Not yet shown in your own games unless you import some.`
  return 'Was reliable; it has been a while. A short refresher will confirm it.'
}
