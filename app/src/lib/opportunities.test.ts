import { describe, expect, it } from 'vitest'
import { Chess } from 'chess.js'
import { momentFor, tacticsOfMove } from './opportunities'

describe('tacticsOfMove', () => {
  it('tags a working knight fork', () => {
    // White knight on d5 can jump to c7 with check, attacking the rook on a8
    expect(tacticsOfMove('r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1', 'd5c7')).toContain('fork')
  })
  it('returns nothing for a quiet king move', () => {
    expect(tacticsOfMove('r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1', 'e1e2')).toEqual([])
  })
  it('returns nothing, without throwing, for an illegal move', () => {
    expect(tacticsOfMove('r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1', 'a1a8')).toEqual([])
  })
})

describe('momentFor', () => {
  it('reports the missed tactic when the engine preferred a fork and the player did something else', () => {
    const fenBefore = 'r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1'
    const m = momentFor({ ply: 1, san: 'Ke2', played: 'e1e2', loss: 500, fenBefore, fenAfter: 'r3k3/8/8/3N4/8/8/4K3/8 b - - 1 1', bestBefore: 'd5c7', bestReply: undefined })
    expect(m.missed?.san).toBe('Nc7+')
    expect(m.missed?.concepts).toContain('fork')
    expect(m.allowed).toBeNull()
  })
  it('does not call it missed when the player played the engine move', () => {
    const fenBefore = 'r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1'
    const m = momentFor({ ply: 1, san: 'Nc7+', played: 'd5c7', loss: 0, fenBefore, fenAfter: 'r3k3/2N5/8/8/8/8/8/4K3 b - - 1 1', bestBefore: 'd5c7' })
    expect(m.missed).toBeNull()
  })
})

describe('tag gating (docs/detectors.md section 6)', () => {
  const game = ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nd4', 'Nxe5', 'Qg5', 'Nxf7', 'Qxg2', 'Rf1', 'Qxe4+']
  const c = new Chess()
  for (const m of game) c.move(m)
  it('does not tag the interposition Be2 as creating a trapped piece (the trap already existed)', () => {
    expect(tacticsOfMove(c.fen(), 'Be2')).not.toContain('trappedPiece')
  })
  it('does not show skewer or relative-pin tags', () => {
    const all = tacticsOfMove('4k3/8/8/8/8/8/4q3/R3K3 w - - 0 1', 'a1a8')
    expect(all).not.toContain('skewer')
  })
})
