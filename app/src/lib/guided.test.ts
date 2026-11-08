import { describe, expect, it } from 'vitest'
import { judgeGuided, markedMoveText, nextPly, opponentDelay, planGuided, STANDARD_START } from './guided'

const italian = [
  { move: 'e4', by: 'learner' as const, say: 'The pawn claims the centre.' },
  { move: 'e5', by: 'opponent' as const, say: 'Black does the same.' },
  { move: 'Nf3', by: 'learner' as const, say: 'The knight jumps out and attacks the pawn on e5.', hint: 'The knight next to your king.' },
  { move: 'Nc6', by: 'opponent' as const },
]

describe('planGuided', () => {
  it('starts from the standard position by default and turns SAN into squares', () => {
    const p = planGuided(undefined, italian)
    expect(p.start).toBe(STANDARD_START)
    expect(p.error).toBeUndefined()
    expect(p.learner).toBe('white')
    expect(p.plies.map(x => [x.from, x.to])).toEqual([['e2', 'e4'], ['e7', 'e5'], ['g1', 'f3'], ['b8', 'c6']])
    expect(p.plies[2].piece).toBe('knight')
    expect(p.plies[3].before).toBe(p.plies[2].after)
  })
  it('stops at an illegal move and says which', () => {
    const p = planGuided(undefined, [{ move: 'e4', by: 'learner' }, { move: 'Ke3', by: 'opponent' }])
    expect(p.plies).toHaveLength(1)
    expect(p.error).toMatch(/Move 2/)
  })
  it('the learner can be Black, with the opponent moving first', () => {
    const p = planGuided(undefined, [{ move: 'd4', by: 'opponent' }, { move: 'd5', by: 'learner' }])
    expect(p.learner).toBe('black')
  })
  it('reports a bad start position instead of throwing', () => { expect(planGuided('not a fen', italian).error).toBeDefined() })
  it('accepts a custom start position', () => {
    const p = planGuided('4k3/8/8/8/8/8/4P3/4K3 w - - 0 1', [{ move: 'e4', by: 'learner' }])
    expect(p.plies[0].to).toBe('e4')
  })
})

describe('judgeGuided', () => {
  const p = planGuided(undefined, italian)
  it('accepts the marked move', () => { expect(judgeGuided(p, 0, 'e2', 'e4')).toBe('accept') })
  it('a different legal move is "other" and does not count', () => {
    expect(judgeGuided(p, 0, 'd2', 'd4')).toBe('other')
    expect(judgeGuided(p, 2, 'b1', 'c3')).toBe('other')
  })
  it('a move that is not legal is "illegal"', () => { expect(judgeGuided(p, 0, 'e2', 'e5')).toBe('illegal') })
  it('nothing is the learner\'s on the opponent\'s ply or after the end', () => {
    expect(judgeGuided(p, 1, 'e7', 'e5')).toBe('not-learner')
    expect(judgeGuided(p, 9, 'e2', 'e4')).toBe('not-learner')
  })
  it('a promotion made by dragging (no piece chosen) counts as the marked one; another piece is "other"', () => {
    const q = planGuided('8/4P3/8/8/8/8/k7/4K3 w - - 0 1', [{ move: 'e8=Q', by: 'learner' }])
    expect(judgeGuided(q, 0, 'e7', 'e8')).toBe('accept')
    expect(judgeGuided(q, 0, 'e7', 'e8', 'q')).toBe('accept')
    expect(judgeGuided(q, 0, 'e7', 'e8', 'n')).toBe('other')
  })
})

describe('nextPly and the words', () => {
  const p = planGuided(undefined, italian)
  it('says when the opponent replies and when the story ends', () => {
    expect(nextPly(p, 0)).toEqual({ index: 1, opponentNext: true, finished: false })
    expect(nextPly(p, 1)).toEqual({ index: 2, opponentNext: false, finished: false })
    expect(nextPly(p, 3)).toEqual({ index: 4, opponentNext: false, finished: true })
  })
  it('spells the marked move out', () => {
    expect(markedMoveText(p.plies[2])).toBe('Your move: the knight from g1 to f3.')
    const q = planGuided('8/4P3/8/8/8/8/k7/4K3 w - - 0 1', [{ move: 'e8=Q', by: 'learner' }])
    expect(markedMoveText(q.plies[0])).toMatch(/becomes a queen/)
  })
  it('waits less when motion is reduced', () => { expect(opponentDelay(true)).toBeLessThan(opponentDelay(false)) })
})
