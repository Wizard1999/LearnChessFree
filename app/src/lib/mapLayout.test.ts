/// <reference types="node" />
import { describe, expect, it } from 'vitest'
import { ghostPosition, layoutMap, skillEdges } from './mapLayout'
import { readCatalog, readSkills } from './shippedContent'
import { skillHomeStages } from './skillStages'
import type { Skill } from '../types'

const sk = (id: string, strand: string, prereqs: string[] = [], tier = 0): Skill => ({ id, title: id, strand, tier, depths: { D1: { outcome: '', prereqs } } })

describe('map layout', () => {
  const skills = [sk('FND.BOARD', 'S1'), sk('FND.PAWN', 'S1', ['FND.BOARD.D1']), sk('TAC.FORK', 'S3', ['FND.PAWN.D1'], 3), sk('TAC.PIN', 'S3', ['FND.BOARD.D1', 'TAC.FORK.D1'], 3)]
  it('puts a skill on the ring of the stage it is given, and every band outside the one before', () => {
    const stages = new Map([['FND.BOARD', 0], ['FND.PAWN', 1], ['TAC.FORK', 3], ['TAC.PIN', 5]])
    const l = layoutMap(skills, stages)
    for (const n of l.nodes) {
      const st = l.stages[stages.get(n.id)!]
      expect(n.stage).toBe(stages.get(n.id))
      const r = Math.hypot(n.x, n.y)
      if (n.id !== 'FND.BOARD') { expect(r).toBeGreaterThan(st.inner); expect(r).toBeLessThan(st.outer) }
    }
    l.stages.forEach((s, i) => { expect(s.outer).toBeGreaterThan(s.inner); if (i) expect(s.inner).toBe(l.stages[i - 1].outer) })
    expect(l.stages).toHaveLength(8)
  })
  it('follows the prerequisite chain inside a stage', () => {
    const l = layoutMap(skills, new Map(skills.map(s => [s.id, 2] as const)))
    const at = new Map(l.nodes.map(n => [n.id, n]))
    expect(at.get('TAC.FORK')!.sub).toBeGreaterThan(at.get('FND.PAWN')!.sub)
    expect(Math.hypot(at.get('TAC.PIN')!.x, at.get('TAC.PIN')!.y)).toBeGreaterThan(Math.hypot(at.get('TAC.FORK')!.x, at.get('TAC.FORK')!.y))
  })
  it('falls back to the tier rule when no stage is given', () => {
    const l = layoutMap(skills)
    expect(l.nodes.find(n => n.id === 'TAC.FORK')!.stage).toBe(4)
  })
  it('places the first node at the centre and the rest around it', () => {
    const l = layoutMap(skills)
    const board = l.nodes.find(n => n.id === 'FND.BOARD')!
    expect(Math.hypot(board.x, board.y)).toBe(0)
    expect(l.nodes.filter(n => n.id !== 'FND.BOARD').every(n => Math.hypot(n.x, n.y) > 0)).toBe(true)
  })
  it('is deterministic and survives a prerequisite cycle', () => {
    const cyc = [sk('A.X', 'S1', ['B.Y.D1']), sk('B.Y', 'S1', ['A.X.D1'])]
    expect(layoutMap(cyc)).toEqual(layoutMap(cyc))
    expect(layoutMap(cyc).nodes).toHaveLength(2)
    expect(layoutMap(skills)).toEqual(layoutMap(skills))
  })
  it('finds skill-level edges and ignores unknown prerequisites', () => {
    expect(skillEdges([sk('A.X', 'S1', ['Z.Q.D1', 'A.X.D2'])])).toEqual([])
  })
  it('puts a ghost marker on another stage band at the same angle', () => {
    const l = layoutMap(skills, new Map([['FND.BOARD', 0], ['FND.PAWN', 1], ['TAC.FORK', 3], ['TAC.PIN', 5]]))
    const n = l.nodes.find(x => x.id === 'TAC.FORK')!, g = ghostPosition(l, 'TAC.FORK', 5)!
    expect(Math.atan2(g.y, g.x)).toBeCloseTo(Math.atan2(n.y, n.x), 6)
    expect(Math.hypot(g.x, g.y)).toBeCloseTo(l.stages[5].mid, 6)
    expect(ghostPosition(l, 'NOPE', 2)).toBeNull()
    expect(ghostPosition(l, 'TAC.FORK', 12)).toBeNull()
  })
  it('spills a crowded wedge outward instead of overlapping', () => {
    const many = Array.from({ length: 40 }, (_, i) => sk(`TAC.S${String(i).padStart(2, '0')}`, 'S3', [], 3))
    const l = layoutMap([sk('FND.BOARD', 'S1'), ...many], new Map(many.map(s => [s.id, 3] as const)))
    expect(Math.max(...l.nodes.map(n => n.sub))).toBeGreaterThan(0)
    expectNoOverlap(l.nodes)
  })
})

function expectNoOverlap(nodes: { id: string; x: number; y: number }[]) {
  const close: string[] = []
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
    const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y)
    if (d < 46) close.push(`${nodes[i].id} ~ ${nodes[j].id}: ${d.toFixed(1)}`)
  }
  expect(close).toEqual([])
}

describe('map layout of the shipped curriculum', () => {
  const skills = readSkills(), lessons = readCatalog()
  const home = skillHomeStages(skills, lessons)
  const l = layoutMap(skills, home)
  it('places every skill exactly once, on the ring of its stage', () => {
    expect(l.nodes).toHaveLength(skills.length)
    expect(new Set(l.nodes.map(n => n.id)).size).toBe(skills.length)
    for (const n of l.nodes) expect(n.stage).toBe(home.get(n.id))
  })
  it('keeps every node inside the band of its stage (the centre node excepted)', () => {
    for (const n of l.nodes) { if (n.id === 'FND.BOARD') continue; const r = Math.hypot(n.x, n.y), st = l.stages[n.stage]; expect(r, n.id).toBeGreaterThan(st.inner); expect(r, n.id).toBeLessThan(st.outer) }
  })
  it('has no two nodes overlapping', () => { expectNoOverlap(l.nodes) })
  it('puts a skill beyond its prerequisites of the same stage', () => {
    const at = new Map(l.nodes.map(n => [n.id, n]))
    for (const e of l.edges) { const a = at.get(e.from)!, b = at.get(e.to)!; if (a.stage === b.stage && a.id !== 'FND.BOARD') expect(b.sub, `${e.from}>${e.to}`).toBeGreaterThan(a.sub) }
  })
})
