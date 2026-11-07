import { describe, expect, it } from 'vitest'
import { labelText, mapScale, planLabels, toScreen, type LabelNode } from './mapLabels'

const R = 1000, W = 800, H = 600
const view = { x: 0, y: 0, k: 1 }
const node = (id: string, x: number, y: number, priority = 10, title = id): LabelNode => ({ id, x, y, title, priority })

describe('map labels', () => {
  it('maps map units to screen pixels with the centre in the middle', () => {
    const s = mapScale(R, 1, W, H)
    expect(s).toBeCloseTo(600 / 2000)
    expect(toScreen({ x: 0, y: 0 }, view, s, W, H)).toEqual({ sx: 400, sy: 300 })
  })
  it('puts every name in the same place relative to its node, whatever else is shown', () => {
    const nodes = Array.from({ length: 30 }, (_, i) => node(`n${i}`, (i % 6) * 30 - 80, Math.floor(i / 6) * 30 - 60, 100, `Skill ${i}`))
    const all = planLabels(nodes, { x: 0, y: 0, k: 2 }, R, W, H)
    const one = planLabels(nodes.slice(7, 8), { x: 0, y: 0, k: 2 }, R, W, H)
    const same = all.find(p => p.id === 'n7')!
    expect(one[0].box).toEqual(same.box)
    const { sx, sy } = toScreen(nodes[7], { x: 0, y: 0, k: 2 }, mapScale(R, 2, W, H), W, H)
    expect(same.box.x + same.box.w / 2).toBeCloseTo(sx)
    expect(same.box.y).toBeGreaterThan(sy)
  })
  it('marks the chosen name as forced and lists it first', () => {
    const nodes = [node('low', 0, 0, 10), node('chosen', 5, 5, 1000), node('started', 60, 0, 100)]
    const placed = planLabels(nodes, view, R, W, H)
    expect(placed.find(p => p.id === 'chosen')?.forced).toBe(true)
    expect(placed[0].id).toBe('chosen')
  })
  it('leaves out low priority names when asked', () => {
    const nodes = [node('a', 0, 0, 10), node('b', 300, 0, 100)]
    expect(planLabels(nodes, view, R, W, H, { minPriority: 100 }).map(p => p.id)).toEqual(['b'])
  })
  it('leaves out nodes that are off screen', () => {
    expect(planLabels([node('far', 5000, 0, 100)], view, R, W, H)).toEqual([])
  })
  it('shortens very long titles with an ellipsis', () => {
    expect(labelText('Short')).toBe('Short')
    expect(labelText('x'.repeat(50)).endsWith('…')).toBe(true)
  })
})
