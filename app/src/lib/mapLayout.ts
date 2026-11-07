// Radial layout for the curriculum map (docs/map-radial-design.md, decision D42): the first node in the centre, one ring (a band) per stage of the
// recommended path, one wedge per strand. Inside a stage the distance from the centre follows the prerequisite chain, and a crowded wedge spills outward
// into further tracks, so nodes never overlap. Pure function of the skill list and the stage of each skill; no randomness, so the map looks the same every time.
import type { Skill } from '../types'
import { PATH_STAGES } from './pathStages'
import { tierStage } from './skillStages'

/** ring is the stage index (0 = Stage 1); sub is the track inside the stage (0 = the innermost). */
export interface MapNode { id: string; strand: string; ring: number; stage: number; sub: number; angle: number; x: number; y: number; tier: number }
export interface MapEdge { from: string; to: string }
/** The band of one stage: from inner to outer radius; mid is where its ghost markers sit. */
export interface MapStage { index: number; inner: number; outer: number; mid: number }
export interface MapLayout { nodes: MapNode[]; edges: MapEdge[]; rings: number; stages: MapStage[]; wedges: { strand: string; from: number; to: number }[]; radius: number }

const SUB_STEP = 62 // distance between tracks inside a stage, in map units
const EDGE_PAD = 52 // from a stage's edge to its first and last track
const CENTRE_CLEAR = 76 // nearest a track may come to the centre node
const SPACING = 54 // least distance between neighbours along a track
const EMPTY_STAGE = 70

/** Skill-level prerequisite edges: a skill depends on every other skill named in any of its depths' prerequisites. */
export function skillEdges(skills: Skill[]): MapEdge[] {
  const ids = new Set(skills.map(s => s.id))
  const seen = new Set<string>(); const out: MapEdge[] = []
  for (const s of skills) for (const d of Object.values(s.depths)) for (const p of d.prereqs ?? []) {
    const i = p.lastIndexOf('.'); const from = p.slice(0, i)
    if (from !== s.id && ids.has(from) && !seen.has(`${from}>${s.id}`)) { seen.add(`${from}>${s.id}`); out.push({ from, to: s.id }) }
  }
  return out
}

export function layoutMap(skills: Skill[], stageOf?: ReadonlyMap<string, number>): MapLayout {
  const edges = skillEdges(skills)
  const parents = new Map<string, string[]>()
  for (const e of edges) parents.set(e.to, [...(parents.get(e.to) ?? []), e.from])
  const nStages = PATH_STAGES.length
  const stage = new Map<string, number>()
  for (const s of skills) { const v = stageOf?.get(s.id) ?? tierStage(s.tier, s.strand); stage.set(s.id, Math.max(0, Math.min(nStages - 1, Math.trunc(v)))) }
  // chain depth (longest prerequisite chain, cycle-safe) orders the placing so that a skill is placed after what it builds on
  const chain = new Map<string, number>()
  const depth = (id: string, path: Set<string>): number => {
    const known = chain.get(id); if (known !== undefined) return known
    if (path.has(id)) return 0
    path.add(id)
    const r = Math.max(-1, ...(parents.get(id) ?? []).map(p => depth(p, path))) + 1
    path.delete(id); chain.set(id, r); return r
  }
  for (const s of skills) depth(s.id, new Set())
  const strands = [...new Set(skills.map(s => s.strand))].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))
  // wedge width proportional to the strand's size, so big strands get room
  const total = skills.length
  const wedges: MapLayout['wedges'] = []
  let a0 = -Math.PI / 2
  for (const st of strands) { const w = (2 * Math.PI * skills.filter(s => s.strand === st).length) / total; wedges.push({ strand: st, from: a0, to: a0 + w }); a0 += w }
  const wedgeOf = new Map(wedges.map(w => [w.strand, w]))
  const centreId = skills.find(s => s.id === 'FND.BOARD')?.id ?? null
  const byId = new Map(skills.map(s => [s.id, s]))

  const nodes: MapNode[] = []
  const stages: MapStage[] = []
  let inner = 0
  for (let si = 0; si < nStages; si++) {
    const here = skills.filter(s => stage.get(s.id) === si && s.id !== centreId)
      .sort((a, b) => chain.get(a.id)! - chain.get(b.id)! || a.id.localeCompare(b.id))
    const first = inner + EDGE_PAD
    const trackRadius = (t: number) => Math.max(first, si === 0 && centreId ? CENTRE_CLEAR : 0) + t * SUB_STEP
    // each skill takes the innermost track that is beyond its same-stage prerequisites and still has room for it in its wedge
    const sub = new Map<string, number>()
    const used = new Map<string, number>() // `${strand}|${track}` -> nodes placed
    for (const s of here) {
      let t = 0
      for (const p of parents.get(s.id) ?? []) if (stage.get(p) === si && sub.has(p)) t = Math.max(t, sub.get(p)! + 1)
      const w = wedgeOf.get(s.strand)!
      for (;;) {
        const cap = Math.max(1, Math.floor((trackRadius(t) * (w.to - w.from)) / SPACING))
        if ((used.get(`${s.strand}|${t}`) ?? 0) < cap) break
        t++
      }
      sub.set(s.id, t); used.set(`${s.strand}|${t}`, (used.get(`${s.strand}|${t}`) ?? 0) + 1)
    }
    const tracks = here.length ? Math.max(...sub.values()) + 1 : 0
    const outer = tracks ? trackRadius(tracks - 1) + EDGE_PAD : inner + EMPTY_STAGE
    stages.push({ index: si, inner, outer, mid: (inner + outer) / 2 })
    // spread each (strand, track) group evenly over its wedge
    const groups = new Map<string, Skill[]>()
    for (const s of here) groups.set(`${s.strand}|${sub.get(s.id)}`, [...(groups.get(`${s.strand}|${sub.get(s.id)}`) ?? []), s])
    for (const group of groups.values()) {
      group.sort((x, y) => x.id.localeCompare(y.id))
      group.forEach((s, i) => {
        const w = wedgeOf.get(s.strand)!, t = sub.get(s.id)!
        const angle = w.from + ((i + 0.5) / group.length) * (w.to - w.from), rad = trackRadius(t)
        nodes.push({ id: s.id, strand: s.strand, ring: si, stage: si, sub: t, angle, x: Math.cos(angle) * rad, y: Math.sin(angle) * rad, tier: s.tier })
      })
    }
    inner = outer
  }
  if (centreId) {
    const s = byId.get(centreId)!, w = wedgeOf.get(s.strand)!, si = stage.get(centreId)!
    nodes.push({ id: s.id, strand: s.strand, ring: si, stage: si, sub: 0, angle: (w.from + w.to) / 2, x: 0, y: 0, tier: s.tier })
  }
  return { nodes, edges, rings: nStages, stages, wedges, radius: inner + 40 }
}

/** Where a faint "this skill also lives here" marker goes: on the middle of another stage's band, at the same angle as the skill itself. */
export function ghostPosition(layout: MapLayout, id: string, stageIndex: number): { x: number; y: number } | null {
  const n = layout.nodes.find(x => x.id === id), st = layout.stages[stageIndex]
  if (!n || !st) return null
  return { x: Math.cos(n.angle) * st.mid, y: Math.sin(n.angle) * st.mid }
}
