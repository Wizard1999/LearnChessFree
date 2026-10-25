import { describe, expect, it } from 'vitest'
import { detectBackRank } from './backrank.ts'
import { legal, legalSans } from '../testutil.ts'

describe('detectBackRank', () => {
  it('position mode: a boxed-in king with an enemy rook has a back-rank mate in one', () => {
    // White Kg1 with pawns f2 g2 h2; Black to move can play Ra8-a1#
    const r = detectBackRank(legal('r5k1/8/8/8/8/8/5PPP/6K1 b - - 0 1'))
    expect(r.found).toBe(true)
    expect(r.works).toBe(true)
    expect(r.details).toHaveLength(1)
    const d = r.details[0]
    expect(d.color).toBe('w')
    expect(d.king).toBe('g1')
    expect(d.blockers.map(b => b.square).sort()).toEqual(['f2', 'g2', 'h2'])
    expect(d.mateInOne?.san).toBe('Ra1#')
  })

  it('move mode: Ra1 is a back-rank mate', () => {
    const r = detectBackRank(legal('r5k1/8/8/8/8/8/5PPP/6K1 b - - 0 1'), 'Ra1')
    expect(r.found).toBe(true)
    expect(r.details[0]).toMatchObject({ mate: true, color: 'w', king: 'g1' })
  })

  it('FAILING LOOK-ALIKE: with luft on h2 the king is not boxed in and Ra1+ is not mate', () => {
    const fen = legal('r5k1/8/8/8/8/7P/5PP1/6K1 b - - 0 1')
    expect(detectBackRank(fen).found).toBe(false)
    expect(detectBackRank(fen, 'Ra1+').found).toBe(false)
  })

  it('no enemy rook or queen: the boxed-in king is not reported', () => {
    expect(detectBackRank(legal('6k1/8/8/8/8/8/5PPP/6K1 w - - 0 1')).found).toBe(false)
  })

  it('FAILING LOOK-ALIKE: a mate on the back rank where the flight squares are covered by pieces, not blocked by the king\'s own men, is not counted', () => {
    // Rd1-d8#: g7 and h7 are covered by the queen on h6, f7 by the pawn e6; the black king has no pieces of its own in front
    const fen = legal('6k1/8/4P2Q/8/8/8/8/3RK3 w - - 0 1')
    expect(legalSans(fen)).toContain('Rd8#')
    const r = detectBackRank(fen, 'Rd8')
    expect(r.found).toBe(false)
  })
})
