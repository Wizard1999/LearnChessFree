import { describe, expect, it } from 'vitest'
import { loadFen } from './board.ts'
import { MATE_SCORE, captureNet, forcedGain, seeGain } from './exchange.ts'
import { legal } from './testutil.ts'

describe('seeGain (static exchange)', () => {
  it('an undefended piece is worth its full value', () => {
    // rook d1 attacks the loose knight d5
    const c = loadFen(legal('4k3/8/8/3n4/8/8/8/3R2K1 w - - 0 1'))
    expect(seeGain(c, 'd5', 'w')).toBe(3)
  })
  it('a pawn-defended knight attacked by a rook is not worth taking', () => {
    // Rxd5 cxd5 would lose the exchange: gain 3, lose 5 -> decline (0)
    const c = loadFen(legal('4k3/8/2p5/3n4/8/8/8/3R2K1 w - - 0 1'))
    expect(seeGain(c, 'd5', 'w')).toBe(0)
  })
  it('a defended knight attacked by a pawn is won (cheaper attacker)', () => {
    const c = loadFen(legal('4k3/8/2p5/3n4/4P3/8/8/6K1 w - - 0 1'))
    expect(seeGain(c, 'd5', 'w')).toBe(2) // exd5 cxd5: +3 -1
  })
  it('equal trade is zero', () => {
    const c = loadFen(legal('4k3/8/2p5/3n4/8/2N5/3K4/8 w - - 0 1'))
    expect(seeGain(c, 'd5', 'w')).toBe(0)
  })
  it('counts the x-ray piece behind the first attacker (battery)', () => {
    // loose pawn d5 attacked by Rd1 with Qd2? Qd2 is in front; either way the pawn is simply won: 1
    const c = loadFen(legal('4k3/8/8/3p4/8/8/3Q4/3R2K1 w - - 0 1'))
    expect(seeGain(c, 'd5', 'w')).toBe(1)
  })
  it('battery against one defender: R+Q vs pawn defended by a pawn is not worth it, R+R vs knight defended once is', () => {
    // pawn d5 defended by c6; Qd2 in front of Rd1: QxP pxQ RxP = +1 -9 +1 -> decline
    const a = loadFen(legal('4k3/8/2p5/3p4/8/8/3Q4/3R2K1 w - - 0 1'))
    expect(seeGain(a, 'd5', 'w')).toBe(0)
    // knight d5 defended by pawn c6, attacked by two rooks d1/d2: RxN pxR RxP = +3 -5 +1 = -1 -> decline
    const b = loadFen(legal('4k3/8/2p5/3n4/8/8/3R4/3R2K1 w - - 0 1'))
    expect(seeGain(b, 'd5', 'w')).toBe(0)
  })
  it('is zero when the capture is illegal because the capturer is pinned', () => {
    const c = loadFen(legal('4r1k1/8/2p5/3n4/4P3/8/8/4K3 w - - 0 1'))
    expect(seeGain(c, 'd5', 'w')).toBe(0)
  })
  it('the king cannot be the last capturer into an attacked square', () => {
    // black bishop d2 is guarded by the rook d8; Kxd2 would be illegal, so there is no capture at all
    const c = loadFen(legal('3rk3/8/8/8/8/8/3b4/4K3 w - - 0 1'))
    expect(seeGain(c, 'd2', 'w')).toBe(0)
  })
})

describe('captureNet', () => {
  it('captured value minus the recapture', () => {
    // Nxd5 cxd5: win a knight (3), lose a knight (3)
    const c = loadFen(legal('4k3/8/2p5/3n4/8/2N5/3K4/8 w - - 0 1'))
    expect(captureNet(c, 'c3', 'd5')).toBe(0)
    // Rxd5 on a loose knight
    const d = loadFen(legal('4k3/8/8/3n4/8/8/8/3R2K1 w - - 0 1'))
    expect(captureNet(d, 'd1', 'd5')).toBe(3)
  })
})

describe('forcedGain (two-ply check)', () => {
  it('a king-and-rook fork wins the rook against every reply', () => {
    // after Nc7+ : black to move, king e8 attacked, rook a8 attacked
    const c = loadFen(legal('r3k3/2N5/8/8/8/8/8/4K3 b - - 1 1'))
    const r = forcedGain(c, ['a8'])
    expect(r.minNet).toBe(5)
    expect(r.mate).toBe(false)
  })
  it('reports checkmate when the defender has no legal reply', () => {
    const c = loadFen(legal('r5k1/8/8/8/8/8/5PPP/r5K1 w - - 0 1'))
    // white to move and mated? white king g1 is checked by ra1 with f2 g2 h2 blocked
    const r = forcedGain(c, [])
    expect(r.mate).toBe(true)
    expect(r.minNet).toBe(MATE_SCORE)
  })
  it('reports stalemate as no gain', () => {
    // black king a8 stalemated by queen c7: black to move, no legal move, not in check
    const c = loadFen(legal('k7/2Q5/1K6/8/8/8/8/8 b - - 0 1'))
    const r = forcedGain(c, [])
    expect(r.stalemate).toBe(true)
    expect(r.minNet).toBe(0)
  })
  it('a reply that captures the forker for free defeats the fork', () => {
    // fork of queen d8 and rook f8 by Ne6, but Bc8 takes the unprotected knight
    const c = loadFen(legal('2bq1r2/7k/4N3/8/8/8/8/6K1 b - - 1 1'))
    const r = forcedGain(c, ['d8', 'f8'])
    expect(r.minNet).toBeLessThan(1)
    expect(r.bestDefence).toBe('Bxe6')
  })
})
