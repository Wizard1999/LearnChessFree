import { describe, expect, it } from 'vitest'
import { applyReach, doneText, isDone, liveStars, normalise, parOf, reachDests, reachMoves, reachRounds, solveReach, starRating, startState } from './reach'
import type { ReachStepSpec } from '../types'

// The same positions and pars as tools/test_reach.py, so the app's solver and the validator's agree.
const ROOK = '7k/8/8/8/8/8/8/R3K3 w - - 0 1' // white rook a1, kings e1 and h8
const round = (fen: string, stars: string[], order: 'any' | 'in-order' = 'any', par?: number) => reachRounds({ fen, stars, order, par } as ReachStepSpec)[0]
const solvedPar = (fen: string, stars: string[], order: 'any' | 'in-order' = 'any') => solveReach(round(fen, stars, order))?.length ?? null

describe('reachRounds', () => {
  it('makes round 1 from the step and further rounds from `rounds`, taking the step fen and order when a round leaves them out', () => {
    const rs = reachRounds({ fen: ROOK, stars: ['a5'], order: 'in-order', par: 1, rounds: [{ stars: ['c3'] }, { fen: '7k/8/8/8/8/8/8/1N2K3 w - - 0 1', stars: ['d5'], order: 'any' }] })
    expect(rs).toHaveLength(3)
    expect(rs[1].fen).toBe(ROOK)
    expect(rs[1].order).toBe('in-order')
    expect(rs[2].order).toBe('any')
    expect(rs.every(r => !r.error)).toBe(true)
  })
  it('normalises the start: the learner to move, no castling or en passant', () => {
    expect(round('r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 4 9', ['a4']).fen).toBe('r3k2r/8/8/8/8/8/8/R3K2R b - - 0 1')
    expect(round('r3k3/8/8/8/8/8/8/7K b - - 0 1', ['a4']).color).toBe('black')
  })
  it('reports a bad position, a bad square and a star on an own piece instead of throwing', () => {
    expect(round('nonsense', ['a5']).error).toBeDefined()
    expect(round(ROOK, ['z9']).error).toMatch(/not a square/)
    expect(round(ROOK, ['e1']).error).toMatch(/own pieces/)
    expect(round(ROOK, []).error).toBeDefined()
  })
})

describe('reachMoves', () => {
  it('offers the rook, not the king, and never a move that gives check', () => {
    const fen = normalise('4k3/8/8/8/8/8/8/R5K1 w - - 0 1', 'w')
    const moves = reachMoves(fen)
    expect(moves.every(m => m.from === 'a1')).toBe(true)
    expect(moves.some(m => m.to === 'a7')).toBe(true)
    expect(moves.some(m => m.to === 'a8')).toBe(false) // a8 would check the king on e8
    expect(moves.some(m => m.to === 'e1')).toBe(false) // e1 would check along the e-file
    expect(reachDests(fen).get('a1')).toContain('a7')
  })
  it('moves the king when it is the only piece', () => {
    expect(reachMoves(normalise('7k/8/8/8/8/8/8/K7 w - - 0 1', 'w')).every(m => m.from === 'a1')).toBe(true)
  })
})

describe('applyReach', () => {
  it('collects a star when the piece lands on it, gives the turn straight back and counts moves', () => {
    const r = round(ROOK, ['a5', 'd5'], 'any', 2)
    const a = applyReach(r, startState(r), { from: 'a1', to: 'a5' })!
    expect(a.collected).toBe('a5')
    expect(a.state.fen.split(' ')[1]).toBe('w')
    expect(a.state.moves).toBe(1)
    const b = applyReach(r, a.state, { from: 'a5', to: 'd5' })!
    expect(b.collected).toBe('d5')
    expect(isDone(r, b.state)).toBe(true)
    expect(applyReach(r, b.state, { from: 'd5', to: 'd6' })).toBeNull() // nothing after the end
  })
  it('refuses an illegal move, a king move and a move that gives check', () => {
    const r = round('4k3/8/8/8/8/8/8/R5K1 w - - 0 1', ['a5'])
    const s = startState(r)
    expect(applyReach(r, s, { from: 'a1', to: 'b2' })).toBeNull()
    expect(applyReach(r, s, { from: 'g1', to: 'g2' })).toBeNull()
    expect(applyReach(r, s, { from: 'a1', to: 'e1' })).toBeNull()
  })
  it('in order, only the next star counts', () => {
    const r = round(ROOK, ['d5', 'a5'], 'in-order')
    const a = applyReach(r, startState(r), { from: 'a1', to: 'a5' })!
    expect(a.collected).toBeNull()
    expect(liveStars(r, a.state.got)).toEqual(['d5'])
  })
  it('captures an enemy piece on a star', () => {
    const r = round('7k/8/8/3p4/8/8/8/R3K3 w - - 0 1', ['d5'])
    const a = applyReach(r, startState(r), { from: 'a1', to: 'd1' })!
    const b = applyReach(r, a.state, { from: 'd1', to: 'd5' })!
    expect(b.collected).toBe('d5')
    expect(b.state.fen.startsWith('7k/8/8/3R4/')).toBe(true)
  })
})

describe('solveReach and par (same answers as tools/test_reach.py)', () => {
  it('finds the fewest moves', () => {
    expect(solvedPar(ROOK, ['a5', 'd5'])).toBe(2)
    expect(solvedPar(ROOK, ['d5', 'a5'], 'in-order')).toBe(3)
    expect(solvedPar('7k/8/8/3p4/8/8/8/R3K3 w - - 0 1', ['d5'])).toBe(2)
    expect(solvedPar('7k/8/8/8/8/8/8/1N2K3 w - - 0 1', ['d5'])).toBe(2)
    expect(solvedPar('7k/8/8/8/8/8/4P3/K7 w - - 0 1', ['e4'])).toBe(1)
    expect(solvedPar('7k/8/8/8/8/8/4P3/K7 w - - 0 1', ['e3', 'e4'])).toBe(2)
    expect(solvedPar('r3k3/8/8/8/8/8/8/7K b - - 0 1', ['a4'])).toBe(1)
  })
  it('returns null when the stars cannot all be collected', () => {
    expect(solvedPar('7k/8/8/8/8/8/8/2B1K3 w - - 0 1', ['c2'])).toBeNull() // a dark-squared bishop and a light square
    expect(solvedPar('7k/8/4p3/8/8/8/4P3/K7 w - - 0 1', ['e4', 'e3'], 'in-order')).toBeNull() // a pawn cannot go back
  })
  it('the solution replays to the end from the current state', () => {
    const r = round(ROOK, ['a5', 'd5', 'd7'])
    let s = applyReach(r, startState(r), { from: 'a1', to: 'b1' })!.state
    const path = solveReach(r, s)!
    for (const mv of path) s = applyReach(r, s, mv)!.state
    expect(isDone(r, s)).toBe(true)
  })
  it('parOf trusts the authored par and computes it when absent', () => {
    expect(parOf(round(ROOK, ['a5', 'd5'], 'any', 7))).toBe(7)
    expect(parOf(round(ROOK, ['a5', 'd5']))).toBe(2)
  })
})

describe('starRating and doneText', () => {
  it('3 at par or better, 2 one over, 1 otherwise', () => {
    expect(starRating(2, 2)).toBe(3)
    expect(starRating(1, 2)).toBe(3)
    expect(starRating(3, 2)).toBe(2)
    expect(starRating(9, 2)).toBe(1)
    expect(starRating(9, null)).toBe(3)
  })
  it('says how many moves and the best', () => {
    expect(doneText(3, 2)).toBe('Done in 3 moves (best 2).')
    expect(doneText(1, 1)).toBe('Done in 1 move (best 1).')
  })
})
