import { describe, expect, it } from 'vitest'
import { parsePgn, writePgn, START_FEN, type Tree } from './pgnTree'

const sans = (t: Tree, id = 0, out: string[] = []): string[] => { for (const k of t.nodes[id].kids) { out.push(t.nodes[k].san); } return out }

describe('pgn tree', () => {
  it('parses variations, comments and NAGs', () => {
    const t = parsePgn('1. e4 {the king pawn} e5 (1... c5 $1 2. Nf3) 2. Nf3 Nc6 3. Bb5?! a6 *') as Tree
    expect(typeof t).toBe('object')
    const e4 = t.nodes[0].kids[0]
    expect(t.nodes[e4].comment).toBe('the king pawn')
    expect(t.nodes[e4].kids.map(k => t.nodes[k].san)).toEqual(['e5', 'c5'])
    const c5 = t.nodes[e4].kids[1]
    expect(t.nodes[c5].nag).toBe(1)
    expect(t.nodes[c5].kids.map(k => t.nodes[k].san)).toEqual(['Nf3'])
    expect(sans(t)).toEqual(['e4'])
  })
  it('round-trips through writePgn', () => {
    const src = '1. e4 {a} e5 (1... c5 2. Nf3) 2. Nf3 Nc6 3. Bb5 a6 *'
    const t = parsePgn(src) as Tree
    const again = parsePgn(writePgn(t)) as Tree
    expect(again.nodes.length).toBe(t.nodes.length)
    expect(again.nodes.map(n => n.san)).toEqual(t.nodes.map(n => n.san))
    expect(again.nodes[t.nodes[0].kids[0]].comment).toBe('a')
  })
  it('keeps a custom start position and numbers black-to-move starts correctly', () => {
    const fen = '4k3/8/8/8/8/8/4P3/4K3 b - - 0 20'
    const t = parsePgn(`[SetUp "1"]\n[FEN "${fen}"]\n\n20... Kd7 21. e4 *`) as Tree
    expect(t.nodes[0].fen).toBe(fen)
    expect(writePgn(t)).toContain('20... Kd7 21. e4')
  })
  it('rejects text that is not a game', () => {
    expect(typeof parsePgn('hello world')).toBe('string')
    expect(START_FEN).toContain('rnbqkbnr')
  })
})
