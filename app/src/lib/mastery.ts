// Evidence-weighted mastery estimate per skill-depth (docs/council-synthesis.md CD-9, CD-13; replaces the 8-of-10 gate).
// Two ledgers, kept apart on purpose (independent review of 31 Oct 2026, roadmap 2h):
//  - INDEPENDENT evidence: first attempts at cue >= 3 outside lessons (in a depth with nothing above cue 2: its own exercises outside
//    lessons). Only this feeds the Beta(a,b) reliability posterior and the 'reliable' state.
//  - GUIDED evidence: cue 1-2 answers and everything answered inside a lesson (the idea has just been named). It feeds the
//    'introduced' state, the counts shown to the learner and recommendations, never the reliable probability.
// Hint-assisted successes do not count as success; repeats and same-family exercises count less (they show memory of a position).
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
  /** Independent-evidence posterior only. */
  a: number
  b: number
  /** Posterior mean of the independent evidence (0.5 with none). */
  mean: number
  /** Mean over ALL weighted evidence, guided included. Only for "does the record contradict an assumed placement", never for reliability. */
  allMean: number
  pReliable: number
  unlabeledWeight: number // weighted independent evidence
  /** The depth has no exercise at cue 3 or above, so its own exercises count as independent evidence and "reliable" means reliable when the idea is named or cued. */
  cuedOnly: boolean
  n: number // independent first attempts counted
  ok: number // of those, how many were right with no hint
  guidedN: number // guided first attempts counted (cue 1-2, lessons): shown to the learner, never part of the reliability posterior
  lastTs: number | null // last attempt of any kind
  /** Last SUCCESSFUL independent attempt: the freshness clock. A failed attempt never refreshes it. */
  lastIndependentSuccess: number | null
  /** The most recent independent attempt was missed. */
  recentMiss: boolean
  /** Latest moment the independent record met the reliable bar, or null if it never has: what the learner once showed. */
  wasReliableOn: number | null
  /** Whether the independent record meets the reliable bar right now. */
  reliableNow: boolean
  state: MasteryState
}

export function masteryOf(attempts: Attempt[], opts?: { now?: number; refreshAfterDays?: number; cuedOnly?: boolean }): Mastery {
  const now = opts?.now ?? Date.now()
  const cuedOnly = !!opts?.cuedOnly
  let ia = 1, ib = 1 // independent posterior
  let ga = 1, gb = 1 // everything, for allMean only
  let unl = 0, n = 0, ok = 0, guidedN = 0
  let last: number | null = null
  let lastSuccess: number | null = null
  let wasReliableOn: number | null = null
  let recentMiss = false
  const presented = new Map<string, number>()
  const families = new Set<string>()
  const ordered = [...attempts].sort((x, y) => x.ts - y.ts) // stable: equal timestamps keep their given order
  for (const t of ordered) {
    last = t.ts
    if (!t.firstAttempt) continue
    // Inside a lesson the idea has just been named, so a lesson answer is never evidence about an unnamed position: it is guided.
    const cue = t.source === 'lesson' ? Math.min(t.cue, 2) : t.cue
    const independent = t.source !== 'lesson' && (cue >= 3 || cuedOnly)
    // The first time an exercise is answered counts in full; the second adds a quarter; later ones add nothing (they show memory of the position).
    // A guided presentation counts too: seeing a position with help makes a later unaided answer partly memory.
    const times = presented.get(t.itemId) ?? 0
    presented.set(t.itemId, times + 1)
    // A different exercise from a family already answered is a near-duplicate of that position: it counts half (an outside review flagged that same-family items overstate independence).
    const sameFamily = times === 0 && families.has(t.family)
    families.add(t.family)
    const w = (independent && cuedOnly ? 1 : (CUE_WEIGHT[cue] ?? 1)) * (times === 0 ? (sameFamily ? FAMILY_WEIGHT : 1) : times === 1 ? REPEAT_WEIGHT : 0)
    if (w === 0) continue
    const right = t.correct && t.hints === 0
    if (right) ga += w
    else gb += t.correct ? 0.5 * w : w
    if (!independent) { guidedN++; continue }
    n++; unl += w
    if (right) { ia += w; ok++; lastSuccess = lastSuccess === null ? t.ts : Math.max(lastSuccess, t.ts) }
    else ib += t.correct ? 0.5 * w : w // right but with a hint counts as half a miss
    recentMiss = !right
    if (unl >= MIN_UNLABELED_WEIGHT && probAtLeast(ia, ib, RELIABLE_P) >= RELIABLE_CERTAINTY) wasReliableOn = t.ts
  }
  const pReliable = probAtLeast(ia, ib, RELIABLE_P)
  const reliableNow = pReliable >= RELIABLE_CERTAINTY && unl >= MIN_UNLABELED_WEIGHT
  let state: MasteryState = 'unseen'
  if (attempts.length > 0) state = 'introduced'
  if (unl > 0) state = 'practising'
  if (reliableNow) state = 'reliable'
  const refreshAfter = (opts?.refreshAfterDays ?? 21) * 86400000
  // The freshness clock runs only from a successful independent attempt. Someone who was reliable and has since missed, or has not been
  // checked for three weeks, shows "refresh": the earlier accomplishment stays on record, the current state is separate.
  const stale = lastSuccess === null || now - lastSuccess > refreshAfter
  if (wasReliableOn !== null && (stale || !reliableNow)) state = 'refresh'
  return { a: ia, b: ib, mean: ia / (ia + ib), allMean: ga / (ga + gb), pReliable, unlabeledWeight: unl, cuedOnly, n, ok, guidedN, lastTs: last,
    lastIndependentSuccess: lastSuccess, recentMiss, wasReliableOn, reliableNow, state }
}

/** The learner's local calendar day as YYYY-MM-DD. */
export function fmtDay(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Plain-language statement of what the evidence supports: counts and dates, never a bare score or a probability (CD-14). */
export function describeMastery(m: Mastery): string {
  if (m.state === 'unseen') return 'Not started.'
  const guided = m.guidedN > 0 ? ` ${m.guidedN} guided answer${m.guidedN === 1 ? '' : 's'} (with labels, or inside lessons) are shown but not counted as independent.` : ''
  if (m.state === 'introduced') return (m.cuedOnly ? 'Seen; no independent checks counted yet.' : 'Seen with hints or labels; not yet tested when the idea is not named.') + guided
  const checks = m.cuedOnly ? 'named or cued checks' : 'independent checks'
  if (m.state === 'practising') return `Practising. ${m.ok} of ${m.n} ${checks} right so far, with no hints. That is not yet enough to call it demonstrated.${guided}`
  const lastOn = m.lastIndependentSuccess !== null ? fmtDay(m.lastIndependentSuccess) : 'unknown'
  if (m.state === 'reliable') return `Demonstrated in ${checks} (${m.n} counted, last on ${lastOn}).${m.cuedOnly ? ' This depth has no unlabeled exercises yet, so that is the best evidence it can give.' : ' Not yet shown in your own games unless you import some.'}`
  const was = m.wasReliableOn !== null ? fmtDay(m.wasReliableOn) : 'unknown'
  if (m.recentMiss) return `Was reliable on ${was}; a recent check was missed. A short refresher is suggested.`
  return `Was reliable on ${was}; the last successful check was on ${lastOn}. A short refresher is suggested.`
}
