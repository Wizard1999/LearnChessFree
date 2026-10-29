import { describe, expect, it } from 'vitest'
import { controlMap, describe as say } from './control'

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
describe('control map', () => {
  it('counts attackers of a square for both sides', () => {
    const m = controlMap(START)
    expect(m.get('f3')!.white.length).toBe(3) // knight g1, pawns e2 and g2
    expect(m.get('f3')!.black.length).toBe(0)
    expect(m.get('f6')!.black.length).toBe(3)
    expect(m.get('e4')!.net).toBe(0)
  })
  it('for an occupied square the same-colour attackers are its defenders', () => {
    const m = controlMap(START)
    expect(m.get('e1')!.white.length).toBeGreaterThan(0) // the king is defended by queen, bishop, knight
    expect(say(m.get('e1')!)).toContain('defended by')
  })
  it('uses exact rules: a rook sees along an open file and stops at the first piece', () => {
    const m = controlMap('4k3/8/8/8/8/8/4P3/R3K3 w - - 0 1')
    expect(m.get('a8')!.white.length).toBe(1)
    expect(m.get('e8')!.white.length).toBe(0)
  })
})
