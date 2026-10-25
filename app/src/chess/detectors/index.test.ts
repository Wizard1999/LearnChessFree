import { describe, expect, it } from 'vitest'
import { Chess } from 'chess.js'
import { detectConcepts, findTacticalMoves } from './index.ts'
import { explainFacts } from '../explain.ts'
import { legal } from '../testutil.ts'

describe('detectConcepts', () => {
  it('move mode returns the move description and the tags of what it does', () => {
    const f = detectConcepts(legal('r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1'), 'Nc7+')
    expect(f.move).toMatchObject({ san: 'Nc7+', uci: 'd5c7', from: 'd5', to: 'c7', piece: 'n', color: 'w', isCheck: true, isCheckmate: false })
    expect(f.sideToMove).toBe('w')
    expect(f.concepts).toContainEqual({ concept: 'fork', works: true })
    expect(f.fork.details[0].forker.square).toBe('c7')
    expect(f.material.before?.balance).toBe(-2) // knight 3 against rook 5
  })

  it('accepts a UCI move as well as SAN', () => {
    const a = detectConcepts(legal('r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1'), 'd5c7')
    expect(a.move?.san).toBe('Nc7+')
  })

  it('position mode has no move and lists structural concepts', () => {
    const f = detectConcepts(legal('4k3/ppp3pp/8/4N3/3P4/8/8/4K3 w - - 0 1'))
    expect(f.move).toBeNull()
    expect(f.concepts.map(c => c.concept)).toContain('outpost')
    expect(f.concepts.map(c => c.concept)).not.toContain('fork')
  })

  it('throws on an invalid FEN and on an illegal move', () => {
    expect(() => detectConcepts('nonsense')).toThrow(/Invalid FEN/)
    expect(() => detectConcepts(legal('4k3/8/8/8/8/8/8/4K3 w - - 0 1'), 'Qd4')).toThrow(/Illegal/)
  })
})

describe('findTacticalMoves', () => {
  it('finds the working knight fork among the legal moves', () => {
    const moves = findTacticalMoves(legal('r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1'))
    const fork = moves.find(m => m.move.san === 'Nc7+')
    expect(fork).toBeDefined()
    expect(fork?.concepts.map(c => c.concept)).toContain('fork')
  })

  it('does not list a fork that the checks show to fail (forker capturable by a pawn)', () => {
    const moves = findTacticalMoves(legal('4k3/1rp5/8/8/2N5/8/8/4K3 w - - 0 1'))
    expect(moves.find(m => m.move.san === 'Nd6+')).toBeUndefined()
  })

  it('lists capturing a hanging piece', () => {
    const moves = findTacticalMoves(legal('4k3/8/8/3n4/8/8/8/3R2K1 w - - 0 1'), ['hangingPiece'])
    expect(moves.map(m => m.move.san)).toEqual(['Rxd5'])
  })

  it('lists a back-rank mate in one', () => {
    const moves = findTacticalMoves(legal('r5k1/8/8/8/8/8/5PPP/6K1 b - - 0 1'), ['backRank'])
    expect(moves.map(m => m.move.san)).toEqual(['Ra1#'])
  })
})

describe('robustness', () => {
  const positions = [
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // start
    'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1', // castling both ways
    '4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1', // en passant
    '4k3/P7/8/8/8/8/8/4K3 w - - 0 1', // promotion with check
    '1k6/8/1K6/8/8/8/8/7R w - - 0 1', // quiet endgame
    'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', // Qxf7# available
  ]
  it('runs every detector on every legal move without throwing', () => {
    for (const fen of positions) {
      legal(fen)
      detectConcepts(fen)
      for (const san of new Chess(fen).moves()) detectConcepts(fen, san)
    }
  })
  it('handles checkmated and stalemated positions in position mode', () => {
    detectConcepts('r5k1/8/8/8/8/8/5PPP/r5K1 w - - 0 1') // White is checkmated
    detectConcepts('k7/2Q5/1K6/8/8/8/8/8 b - - 0 1') // Black is stalemated
  })
  it('Qxf7# captures a pawn the king cannot recapture (two attackers), and is not a back-rank mate', () => {
    const f = detectConcepts('r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', 'Qxf7#')
    expect(f.move?.isCheckmate).toBe(true)
    // the king "defends" f7, but a king may not recapture into a square the bishop also attacks, so f7 counts as undefended
    expect(f.hanging.capturedHanging?.piece).toMatchObject({ square: 'f7', type: 'p' })
    expect(f.hanging.capturedHanging?.reason).toBe('undefended')
    expect(f.backRank.found).toBe(false)
  })
})

describe('regression: the Italian-game trap 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nd4 4.Nxe5 Qg5 5.Nxf7 Qxg2 6.Rf1 Qxe4+ 7.Be2 Nf3#', () => {
  const san = 'e4 e5 Nf3 Nc6 Bc4 Nd4 Nxe5 Qg5 Nxf7 Qxg2 Rf1 Qxe4+ Be2 Nf3#'.split(' ')
  const fenBefore = (ply: number) => {
    const c = new Chess()
    for (const s of san.slice(0, ply)) c.move(s)
    return c.fen()
  }
  it('the pin on the mating move is real: the queen on e4 pins Be2 to Ke1, so the bishop cannot take the knight', () => {
    const f = detectConcepts(fenBefore(13), 'Nf3#')
    expect(f.move?.isCheckmate).toBe(true)
    const d = f.pin.details.find(x => x.pinned.square === 'e2')
    expect(d).toMatchObject({ kind: 'absolute', shieldsMovedPiece: true })
    expect(d?.pinner.square).toBe('e4')
    expect(explainFacts(f, { only: ['pin'] })[0].text).toContain('The move is checkmate.')
  })
  it('7.Be2 only answers the check: it does not create the trapped rook (that was 5.Nxf7)', () => {
    expect(detectConcepts(fenBefore(12), 'Be2').trapped.found).toBe(false)
    const f = detectConcepts(fenBefore(8), 'Nxf7')
    const t = f.trapped.details.find(x => x.piece.square === 'h8')
    expect(t).toBeDefined()
    expect(t?.rescuable).toBe(true) // Kxf7 captures the attacker, so it is not a working trap
    expect(f.trapped.works).toBe(false)
  })
})
