// Mission warm-up: a short, no-penalty test-out inside one strand (docs/missions-design.md). It asks a few unlabelled questions per
// tier, easiest tier first, and stops early once two tiers in a row go badly. The result is a per-strand "frontier": skills in
// tiers below it show as "assumed" (the same mechanism as the placement test), to be confirmed by mixed practice and challenges.
import type { Attempt } from '../db'
import type { Item } from '../types'
import type { Mission, NodeProgress } from './missions'
import type { StrandWarmup } from './progress'
import { pickFresh } from './select'

export const WARMUP_PASS = 0.66 // two of three right passes (0.67 would fail 2 of 3 by a hair)
export const WARMUP_MAX_ITEMS = 12

export interface WarmupPlan { items: Item[]; tierOf: Map<string, number> }

/** One unlabelled question per node, spread over distinct nodes in each tier, ascending by tier, at most WARMUP_MAX_ITEMS. */
export function planWarmup(mission: Mission, items: Item[], attempts: Attempt[], seed: string): WarmupPlan {
  const tiers = mission.tiers.filter(t => t.nodes.some(n => !n.noExercises))
  const perTier = tiers.length > 4 ? 2 : 3
  const bySkill = new Map<string, Item[]>()
  for (const i of items) if (i.cue >= 3) bySkill.set(i.skill, [...(bySkill.get(i.skill) ?? []), i])
  const out: Item[] = []
  const tierOf = new Map<string, number>()
  const used = new Set<string>()
  for (const t of tiers) {
    const nodes = t.nodes.filter(n => !n.noExercises && n.level < 4).sort((a, b) => a.level - b.level)
    let picked = 0
    for (const n of nodes) {
      if (picked >= perTier || out.length >= WARMUP_MAX_ITEMS) break
      const pool = depthPool(n, bySkill)
      const it = pickFresh(pool, attempts, 1, `${seed}:${n.id}`, { exclude: used })[0]
      if (!it) continue
      used.add(it.id); out.push(it); tierOf.set(it.id, t.tier); picked++
    }
  }
  return { items: out, tierOf }
}

/** Prefer the unlabelled depth (D2), then D1, then whatever has exercises. */
function depthPool(n: NodeProgress, bySkill: Map<string, Item[]>): Item[] {
  for (const d of ['D2', 'D1', 'D3']) { const p = bySkill.get(`${n.id}.${d}`); if (p && p.length) return p }
  return []
}

export interface TierResult { tier: number; ok: boolean }

/** How many questions the plan asks in each tier. */
export function plannedPerTier(plan: WarmupPlan): Map<number, number> {
  const m = new Map<number, number>()
  for (const t of plan.tierOf.values()) m.set(t, (m.get(t) ?? 0) + 1)
  return m
}

/** After each answer: stop when two finished tiers in a row were below the pass mark (nothing is gained by harder questions). */
export function shouldStop(results: TierResult[], planned: Map<number, number>): boolean {
  const tiers = [...planned.keys()].sort((a, b) => a - b)
  const finished = tiers.filter(t => results.filter(r => r.tier === t).length >= (planned.get(t) ?? 1))
  const weak = (t: number) => { const r = results.filter(x => x.tier === t); return r.length > 0 && r.filter(x => x.ok).length / r.length < WARMUP_PASS }
  for (let k = 1; k < finished.length; k++) if (weak(finished[k]) && weak(finished[k - 1]) && tiers.indexOf(finished[k]) === tiers.indexOf(finished[k - 1]) + 1) return true
  return false
}

/** The frontier: skills in tiers below it are "assumed". It is the first tier that was not comfortable, or the top tier tested. */
export function concludeWarmup(results: TierResult[], now: number): StrandWarmup {
  const tiers = [...new Set(results.map(r => r.tier))].sort((a, b) => a - b)
  const byTier: StrandWarmup['byTier'] = {}
  for (const r of results) { const b = byTier[r.tier] ?? { n: 0, ok: 0 }; b.n++; if (r.ok) b.ok++; byTier[r.tier] = b }
  let frontier = tiers.length ? tiers[0] : 0
  for (const t of tiers) {
    const b = byTier[t]
    if (b.ok / b.n >= WARMUP_PASS) frontier = t + 1
    else break
  }
  if (tiers.length) frontier = Math.min(frontier, tiers[tiers.length - 1]) // never assume the top tier that was tested
  return { frontierTier: frontier, ts: now, byTier }
}
