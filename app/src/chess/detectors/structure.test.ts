import { describe, expect, it } from 'vitest'
import { detectAttackCount } from './attackCount.ts'
import { detectBishopPair } from './bishopPair.ts'
import { detectIsolatedDoubled } from './isolatedDoubled.ts'
import { detectMaterialCount } from './materialCount.ts'
import { detectOpenFile } from './openFile.ts'
import { detectOutpost } from './outpost.ts'
import { detectPassedPawn } from './passedPawn.ts'
import { legal } from '../testutil.ts'

describe('detectPassedPawn', () => {
  it('a pawn with no enemy pawn in front on its own or neighbouring files is passed', () => {
    const r = detectPassedPawn(legal('4k3/pp6/8/3P4/8/8/8/4K3 w - - 0 1'))
    const d = r.details.find(x => x.pawn.square === 'd5')
    expect(d).toBeDefined()
    expect(d?.stepsToPromotion).toBe(3)
    expect(d?.protectedByPawn).toBe(false)
  })

  it('FAILING LOOK-ALIKE: an enemy pawn on a neighbouring file in front means not passed', () => {
    const r = detectPassedPawn(legal('4k3/4p3/8/3P4/8/8/8/4K3 w - - 0 1'))
    expect(r.details.find(x => x.pawn.square === 'd5')).toBeUndefined()
    expect(r.found).toBe(false)
  })

  it('an enemy pawn BEHIND the pawn does not stop it from being passed (both pawns are passed here)', () => {
    const r = detectPassedPawn(legal('4k3/8/8/3P4/4p3/8/8/4K3 w - - 0 1'))
    expect(r.details.map(d => d.pawn.square).sort()).toEqual(['d5', 'e4'])
  })

  it('reports support, a blockader, and the other side\'s passed pawn', () => {
    const r = detectPassedPawn(legal('4k3/1p3p2/3n4/3P4/2P5/8/8/4K3 w - - 0 1'))
    const d = r.details.find(x => x.pawn.square === 'd5')!
    expect(d.protectedByPawn).toBe(true)
    expect(d.blockedBy).toMatchObject({ square: 'd6', type: 'n', color: 'b' })
    expect(r.details.find(x => x.pawn.square === 'f7')?.pawn.color).toBe('b')
    expect(r.details.find(x => x.pawn.square === 'c4')).toBeUndefined() // the b7 pawn stands in front on a neighbouring file
  })

  it('move mode: a pawn capture can create a passed pawn', () => {
    // d5xe6 removes the only black pawn, so the pawn on e6 is passed
    const fen = legal('4k3/8/4p3/3P4/8/8/8/4K3 w - - 0 1')
    expect(detectPassedPawn(fen).details.find(d => d.pawn.square === 'd5')).toBeUndefined()
    const r = detectPassedPawn(fen, 'dxe6')
    expect(r.found).toBe(true)
    expect(r.created.map(d => d.pawn.square)).toEqual(['e6'])
  })
})

describe('detectOpenFile', () => {
  it('open and half-open files', () => {
    // no a-pawn for White: the a-file is half-open for White (Black has a7); c, d, e carry no pawns
    const r = detectOpenFile(legal('4k3/pp3ppp/8/8/8/8/1P3PPP/4K3 w - - 0 1'))
    expect(r.details.filter(d => d.kind === 'open').map(d => d.file)).toEqual(['c', 'd', 'e'])
    expect(r.details.filter(d => d.kind === 'half-open')).toEqual([expect.objectContaining({ file: 'a', forColor: 'w' })])
  })

  it('lists rooks and queens standing on a file', () => {
    const r = detectOpenFile(legal('4k3/pp3ppp/8/8/8/8/1P3PPP/3RK3 w - - 0 1'))
    const d = r.details.find(x => x.file === 'd')!
    expect(d.heavyPieces).toEqual([{ square: 'd1', type: 'r', color: 'w' }])
  })

  it('move mode: a pawn capture opens a file, and a rook move onto a file that is half-open for it is reported', () => {
    const fen = legal('4k3/8/8/3p4/4P3/8/8/R5K1 w - - 0 1')
    const cap = detectOpenFile(fen, 'exd5')
    expect(cap.created.some(c => c.file === 'e' && c.kind === 'open')).toBe(true)
    const rook = detectOpenFile(fen, 'Rd1')
    expect(rook.rookMovedTo).toMatchObject({ file: 'd', kind: 'half-open', forColor: 'w' })
  })
})

describe('detectOutpost', () => {
  it('a knight on e5 supported by pawn d4 that no Black pawn can attack is an outpost', () => {
    const r = detectOutpost(legal('4k3/ppp3pp/8/4N3/3P4/8/8/4K3 w - - 0 1'))
    expect(r.found).toBe(true)
    expect(r.details).toHaveLength(1)
    expect(r.details[0]).toMatchObject({ square: 'e5', color: 'w', supportedBy: ['d4'], challengedBy: [] })
    expect(r.details[0].piece?.type).toBe('n')
  })

  it('FAILING LOOK-ALIKE: the f7 pawn can advance to f6 and attack e5, so it is not an outpost', () => {
    const r = detectOutpost(legal('4k3/ppp2ppp/8/4N3/3P4/8/8/4K3 w - - 0 1'))
    expect(r.found).toBe(false)
    expect(r.challengeable).toHaveLength(1)
    expect(r.challengeable[0]).toMatchObject({ square: 'e5', challengedBy: ['f7'] })
  })

  it('FAILING LOOK-ALIKE: no pawn support means no outpost', () => {
    const r = detectOutpost(legal('4k3/ppp3pp/8/4N3/8/8/8/4K3 w - - 0 1'))
    expect(r.found).toBe(false)
    expect(r.challengeable).toEqual([])
  })

  it('works for Black (mirrored ranks)', () => {
    const r = detectOutpost(legal('4k3/8/8/4p3/3n4/8/PP3PPP/4K3 w - - 0 1'))
    expect(r.details).toHaveLength(1)
    expect(r.details[0]).toMatchObject({ square: 'd4', color: 'b', supportedBy: ['e5'] })
  })

  it('an empty supported square that no pawn can attack is listed as vacant', () => {
    const r = detectOutpost(legal('4k3/ppp3pp/8/8/3P4/8/8/4K3 w - - 0 1'))
    expect(r.vacant.map(v => v.square)).toContain('e5')
    expect(r.vacant.map(v => v.square)).not.toContain('c5') // the b7 pawn can still attack c5
    expect(r.found).toBe(false)
  })
})

describe('detectBishopPair', () => {
  it('two bishops on opposite colours are a pair; the other side has one bishop', () => {
    const r = detectBishopPair(legal('4k3/1b6/8/8/8/8/8/2B1KB2 w - - 0 1'))
    expect(r.found).toBe(true)
    expect(r.after.w).toBe(true)
    expect(r.after.b).toBe(false)
    expect(r.after.advantage).toBe('w')
  })

  it('FAILING LOOK-ALIKE: two bishops on same-coloured squares are not a pair', () => {
    // c1 and e3 are both dark squares
    const r = detectBishopPair(legal('4k3/8/8/8/8/4B3/8/2B1K3 w - - 0 1'))
    expect(r.found).toBe(false)
    expect(r.after.w).toBe(false)
  })

  it('move mode: capturing one bishop of the pair changes the status', () => {
    const r = detectBishopPair(legal('2b2bk1/8/3N4/8/8/8/8/4K3 w - - 0 1'), 'Nxc8')
    expect(r.found).toBe(true)
    expect(r.before?.b).toBe(true)
    expect(r.after.b).toBe(false)
  })
})

describe('detectIsolatedDoubled', () => {
  it('isolated pawns have no friendly pawn on neighbouring files', () => {
    const r = detectIsolatedDoubled(legal('4k3/8/8/8/3P4/8/PP3P1P/4K3 w - - 0 1'))
    expect(r.details.isolated.map(p => p.square).sort()).toEqual(['d4', 'f2', 'h2'])
    expect(r.details.doubled).toEqual([])
  })

  it('doubled pawns share a file; the pawns next to the pair are not isolated', () => {
    const r = detectIsolatedDoubled(legal('4k3/8/8/8/8/2P5/PPP4P/4K3 w - - 0 1'))
    expect(r.details.doubled).toEqual([{ color: 'w', file: 'c', squares: ['c2', 'c3'] }])
    expect(r.details.isolated.map(p => p.square)).toEqual(['h2'])
  })

  it('move mode: exd5 creates doubled and isolated d-pawns', () => {
    const r = detectIsolatedDoubled(legal('4k3/8/8/3n4/3PP3/8/8/4K3 w - - 0 1'), 'exd5')
    expect(r.found).toBe(true)
    expect(r.created.doubled).toEqual([{ color: 'w', file: 'd', squares: ['d4', 'd5'] }])
    expect(r.created.isolated.map(p => p.square).sort()).toEqual(['d4', 'd5'])
  })

  it('FAILING LOOK-ALIKE: a capture that joins two isolated pawns creates no new weakness', () => {
    // before: c3 and e4 are both isolated; after exd5 the pawns c3 and d5 are neighbours
    const r = detectIsolatedDoubled(legal('4k3/8/8/3n4/4P3/2P5/8/4K3 w - - 0 1'), 'exd5')
    expect(r.created.doubled).toEqual([])
    expect(r.created.isolated).toEqual([])
    expect(r.found).toBe(false)
  })
})

describe('detectMaterialCount', () => {
  it('counts the starting position as equal', () => {
    const r = detectMaterialCount(legal('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'))
    const m = r.details[0]
    expect(m.w.total).toBe(39)
    expect(m.b.total).toBe(39)
    expect(m.balance).toBe(0)
    expect(m.ahead).toBeNull()
    expect(m.w).toMatchObject({ pawns: 8, knights: 2, bishops: 2, rooks: 2, queens: 1 })
  })

  it('reports the balance before and after a capture in move mode', () => {
    const r = detectMaterialCount(legal('4k3/8/8/3n4/8/8/8/3R2K1 w - - 0 1'), 'Rxd5')
    expect(r.before?.balance).toBe(2) // rook 5 against knight 3
    expect(r.details[0].balance).toBe(5)
    expect(r.change).toBe(3)
    expect(r.capturedValue).toBe(3)
  })

  it('a side with only a king has nothing counted', () => {
    const r = detectMaterialCount(legal('4k3/8/8/8/8/8/PPPP4/R3K3 w - - 0 1'))
    expect(r.details[0].b.total).toBe(0)
    expect(r.details[0].balance).toBe(9)
    expect(r.details[0].ahead).toBe('w')
  })
})

describe('detectAttackCount', () => {
  it('counts attackers and defenders of a piece', () => {
    // Nd5 attacked by Rd1 and Bf3, defended by pc6
    const r = detectAttackCount(legal('4k3/8/2p5/3n4/8/5B2/8/3RK3 w - - 0 1'))
    const d = r.details.find(x => x.piece.square === 'd5')!
    expect([...d.attackers].sort()).toEqual(['d1', 'f3'])
    expect(d.defenders).toEqual(['c6'])
    expect(d.outnumbered).toBe(true)
    expect(r.control.d5).toEqual({ w: 2, b: 1 })
  })

  it('FAILING LOOK-ALIKE: an attacked piece with as many defenders as attackers is not outnumbered', () => {
    const r = detectAttackCount(legal('4k3/8/2p5/3n4/8/8/8/3RK3 w - - 0 1'))
    const d = r.details.find(x => x.piece.square === 'd5')!
    expect(d.attackers).toEqual(['d1'])
    expect(d.outnumbered).toBe(false)
  })

  it('reports the squares around a king that the enemy attacks', () => {
    const quiet = detectAttackCount(legal('4k3/8/8/8/8/8/8/6K1 w - - 0 1'))
    expect(quiet.kingZone.w).toEqual({ attackedSquares: 0, attackingPieces: 0 })
    // the rook on h2 attacks h1, g2 and f2 next to the king on g1
    const busy = detectAttackCount(legal('4k3/8/8/8/8/8/7r/6K1 w - - 0 1'))
    expect(busy.kingZone.w).toEqual({ attackedSquares: 3, attackingPieces: 1 })
  })
})
