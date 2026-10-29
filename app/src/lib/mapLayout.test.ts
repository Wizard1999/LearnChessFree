import { describe, expect, it } from 'vitest'
import { layoutMap, skillEdges } from './mapLayout'
import type { Skill } from '../types'

const sk = (id: string, strand: string, prereqs: string[] = []): Skill => ({ id, title: id, strand, tier: 0, depths: { D1: { outcome: '', prereqs } } })

describe('map layout', () => {
  const skills = [sk('FND.BOARD', 'S1'), sk('FND.PAWN', 'S1', ['FND.BOARD.D1']), sk('TAC.FORK', 'S3', ['FND.PAWN.D1']), sk('TAC.PIN', 'S3', ['FND.BOARD.D1', 'TAC.FORK.D1'])]
  it('puts every skill on a ring further out than everything it builds on', () => {
    const l = layoutMap(skills); const ring = new Map(l.nodes.map(n => [n.id, n.ring]))
    for (const e of l.edges) expect(ring.get(e.to)!).toBeGreaterThan(ring.get(e.from)!)
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
    expect(layoutMap(skills)).toEqual(layoutMap(skills))
  })
  it('finds skill-level edges and ignores unknown prerequisites', () => {
    expect(skillEdges([sk('A.X', 'S1', ['Z.Q.D1', 'A.X.D2'])])).toEqual([])
  })
})
