import { describe, expect, it } from 'vitest'
import { ancestorEdges, edgeStrength, edgesToDraw, prereqShare, starNodes } from './mapEdges'

// A -> C, B -> C, C -> D, D -> E
const edges = [{ from: 'A', to: 'C' }, { from: 'B', to: 'C' }, { from: 'C', to: 'D' }, { from: 'D', to: 'E' }]
const ids = ['A', 'B', 'C', 'D', 'E']
const lv = (m: Record<string, number>) => (id: string) => m[id] ?? 0

describe('map edges', () => {
  it('new learner: every line drawn, faint (power 0)', () => {
    const d = edgesToDraw(edges, lv({}), null)
    expect(d).toHaveLength(4)
    expect(d.every(x => x.power === 0 && x.kind === 'quiet')).toBe(true)
    expect(starNodes(ids, edges, lv({})).size).toBe(0)
  })
  it('partway: power is the share of the target prerequisites completed', () => {
    const l = lv({ A: 2 })
    expect(prereqShare(edges, l).get('C')).toBe(0.5)
    const toC = edgesToDraw(edges, l, null).filter(x => x.to === 'C')
    expect(toC.map(x => x.power)).toEqual([0.5, 0.5])
    const full = edgesToDraw(edges, lv({ A: 3, B: 2 }), null).find(x => x.to === 'C')!
    expect(full.power).toBe(1)
  })
  it('level "Seen" (1) is not completed', () => {
    expect(prereqShare(edges, lv({ A: 1, B: 1 })).get('C')).toBe(0)
  })
  it('lines between two completed skills are not drawn; a finished skill beside unfinished ones keeps its frontier line', () => {
    const d = edgesToDraw(edges, lv({ A: 2, B: 2, C: 2 }), null).map(x => `${x.from}>${x.to}`)
    expect(d).toEqual(['C>D', 'D>E'])
  })
  it('mostly done: stars draw no lines, only the frontier is lit', () => {
    const l = lv({ A: 4, B: 4, C: 4, D: 2 })
    expect(edgesToDraw(edges, l, null).map(x => `${x.from}>${x.to}`)).toEqual(['D>E'])
    const stars = starNodes(ids, edges, l)
    expect([...stars].sort()).toEqual(['A', 'B', 'C'])
    expect(stars.has('D')).toBe(false) // D still leads to an unfinished skill
  })
  it('all done: nothing drawn, everything a star', () => {
    const l = lv({ A: 2, B: 2, C: 2, D: 2, E: 2 })
    expect(edgesToDraw(edges, l, null)).toHaveLength(0)
    expect(starNodes(ids, edges, l).size).toBe(5)
  })
  it('the chosen skill keeps all its links at full strength, told apart by direction, even between completed skills', () => {
    const l = lv({ A: 4, B: 4, C: 4, D: 4, E: 4 })
    const d = edgesToDraw(edges, l, 'C')
    expect(d.map(x => `${x.kind}:${x.from}>${x.to}:${x.power}`).sort()).toEqual(['next:C>D:1', 'pre:A>C:1', 'pre:B>C:1'])
  })
})

describe('the trail into a skill', () => {
  it('finds every line on a chain of prerequisites ending at the skill, and nothing else', () => {
    const t = ancestorEdges(edges, 'D').map(e => `${e.from}>${e.to}`).sort()
    expect(t).toEqual(['A>C', 'B>C', 'C>D'])
    expect(ancestorEdges(edges, 'A')).toEqual([])
    expect(ancestorEdges(edges, null)).toEqual([])
  })
  it('does not loop on a cycle', () => { expect(ancestorEdges([{ from: 'X', to: 'Y' }, { from: 'Y', to: 'X' }], 'X')).toHaveLength(2) })
})

describe('line strength (constellations forming)', () => {
  const strength = (m: Record<string, number>) => edgeStrength(edges, lv(m))
  it('is 0 with nothing done and 1 when the source and every prerequisite are Guided', () => {
    expect(strength({})('A', 'C')).toBe(0)
    expect(strength({ A: 2, B: 2 })('A', 'C')).toBe(1)
  })
  it('only ever rises as the source or the other prerequisites progress', () => {
    let last = -1
    for (const [a, b] of [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]]) { const v = strength({ A: a, B: b })('A', 'C'); expect(v).toBeGreaterThanOrEqual(last); last = v }
    expect(strength({ A: 1 })('A', 'C')).toBeGreaterThan(strength({})('A', 'C'))
    expect(strength({ A: 1, B: 1 })('A', 'C')).toBeGreaterThan(strength({ A: 1 })('A', 'C'))
  })
  it('has many distinct levels, not a handful', () => {
    const seen = new Set<number>()
    for (const a of [0, 1, 2, 3]) for (const b of [0, 1, 2, 3]) seen.add(+strength({ A: a, B: b })('A', 'C').toFixed(4))
    expect(seen.size).toBeGreaterThanOrEqual(5)
  })
  it('stays within 0 and 1', () => { for (const a of [0, 4, 9]) { const v = strength({ A: a, B: 9 })('A', 'C'); expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(1) } })
})
