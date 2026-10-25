import { describe, expect, it } from 'vitest'
import { detectConcepts } from './detectors/index.ts'
import { explainFacts } from './explain.ts'
import { legal } from './testutil.ts'

const EVALUATIVE = /\b(strong|weak|good|bad|winning|losing|better|worse|best|worst|dangerous|excellent|clearly|obviously|brilliant|blunder|mistake|advantage|crushing|decisive)\b/i

describe('explainFacts', () => {
  it('states a working fork as a verified fact with its checking depth', () => {
    const f = detectConcepts(legal('r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1'), 'Nc7+')
    const e = explainFacts(f, { only: ['fork'] })
    expect(e).toHaveLength(1)
    expect(e[0].works).toBe(true)
    expect(e[0].text).toBe(
      'The knight on c7 attacks the king on e8 and the rook on a8. Whatever Black replies, White can then win at least 5 points of counted material (checked one reply deep).',
    )
  })

  it('says why a look-alike fork fails, using only the facts', () => {
    const f = detectConcepts(legal('4k3/1rp5/8/8/2N5/8/8/4K3 w - - 0 1'), 'Nd6+')
    const e = explainFacts(f, { only: ['fork'] })
    expect(e[0].works).toBe(false)
    expect(e[0].text).toContain('The knight on d6 attacks the king on e8 and the rook on b7.')
    expect(e[0].text).toContain('can be captured by the pawn on c7, which is worth less')
  })

  it('can leave failed tactics out', () => {
    const f = detectConcepts(legal('4k3/1rp5/8/8/2N5/8/8/4K3 w - - 0 1'), 'Nd6+')
    expect(explainFacts(f, { only: ['fork'], includeFailed: false })).toEqual([])
  })

  it('describes an absolute pin and its defenders', () => {
    const f = detectConcepts(legal('4k3/1p6/2n5/1B6/8/8/8/4K3 w - - 0 1'))
    const e = explainFacts(f, { only: ['pin'] })
    expect(e[0].text).toContain('The bishop on b5 pins the knight on c6 to the king on e8: the knight cannot legally leave the line.')
    expect(e[0].text).toContain('The knight on c6 is attacked once and defended once.')
    expect(e[0].works).toBe(false)
  })

  it('describes a hanging piece without evaluating it', () => {
    const f = detectConcepts(legal('4k3/8/8/3n4/8/8/8/3R2K1 w - - 0 1'))
    const e = explainFacts(f, { only: ['hangingPiece'] })
    expect(e[0].text).toBe("Black's knight on d5 is attacked by the rook on d1 and no Black piece defends it.")
  })

  it('counts material and nothing else', () => {
    const f = detectConcepts(legal('4k3/8/8/3n4/8/8/8/3R2K1 w - - 0 1'))
    const e = explainFacts(f, { only: [], includeMaterial: true })
    expect(e).toHaveLength(1)
    expect(e[0].text).toBe(
      'Counted material (pawn 1, knight 3, bishop 3, rook 5, queen 9): White 5 (0 queens, 1 rook, 0 bishops, 0 knights, 0 pawns); Black 3 (0 queens, 0 rooks, 0 bishops, 1 knight, 0 pawns). White has 2 points more.',
    )
  })

  it('describes structure facts (passed pawn, open file, outpost, bishop pair, isolated pawn)', () => {
    const passed = explainFacts(detectConcepts(legal('4k3/pp6/8/3P4/8/8/8/4K3 w - - 0 1')), { only: ['passedPawn'] })
    expect(passed.some(x => x.text.startsWith('The White pawn on d5 is a passed pawn'))).toBe(true)
    const file = explainFacts(detectConcepts(legal('4k3/pp3ppp/8/8/8/8/1P3PPP/3RK3 w - - 0 1')), { only: ['openFile'] })
    expect(file.some(x => x.text.startsWith('The d-file is open: there is no pawn on it. Rooks and queens on it: White rook on d1.'))).toBe(true)
    const outpost = explainFacts(detectConcepts(legal('4k3/ppp3pp/8/4N3/3P4/8/8/4K3 w - - 0 1')), { only: ['outpost'] })
    expect(outpost[0].text).toBe('The knight on e5 stands on an outpost: a White pawn on d4 defends it, and no Black pawn can ever attack e5.')
    const pair = explainFacts(detectConcepts(legal('4k3/1b6/8/8/8/8/8/2B1KB2 w - - 0 1')), { only: ['bishopPair'] })
    expect(pair[0].text).toContain('White has the bishop pair')
    expect(pair[0].text).toContain('Black has no bishop pair')
    const iso = explainFacts(detectConcepts(legal('4k3/8/8/8/3P4/8/PP3P1P/4K3 w - - 0 1')), { only: ['isolatedDoubled'] })
    expect(iso.some(x => x.text.includes('The White pawn on d4 is isolated'))).toBe(true)
  })

  it('says "The move is checkmate." when the analysed move is itself mate', () => {
    // smothered mate: Ne5-f7# attacks Kh8 and Qd8
    const f = detectConcepts(legal('3q2rk/6pp/8/4N3/8/8/8/4K3 w - - 0 1'), 'Nf7#')
    expect(f.move?.isCheckmate).toBe(true)
    const e = explainFacts(f, { only: ['fork'] })
    expect(e[0].text).toBe('The knight on f7 attacks the king on h8 and the queen on d8. The move is checkmate.')
  })

  it('never uses evaluative words', () => {
    const fens: Array<[string, string?]> = [
      ['r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1', 'Nc7+'],
      ['4k3/1rp5/8/8/2N5/8/8/4K3 w - - 0 1', 'Nd6+'],
      ['4k3/1p6/2n5/1B6/8/8/8/4K3 w - - 0 1'],
      ['3qk3/8/5n2/4P1B1/8/8/8/4K3 w - - 0 1'],
      ['4r3/8/8/4k3/8/8/6K1/R7 w - - 0 1', 'Re1+'],
      ['4k3/q7/8/4N3/8/8/8/4R2K w - - 0 1', 'Nc6+'],
      ['r5k1/B1p5/1p6/8/8/8/8/6K1 w - - 0 1'],
      ['r5k1/8/8/8/8/8/5PPP/6K1 b - - 0 1', 'Ra1'],
      ['4k3/ppp3pp/8/4N3/3P4/8/8/4K3 w - - 0 1'],
      ['4k3/ppp2ppp/8/4N3/3P4/8/8/4K3 w - - 0 1'],
    ]
    for (const [fen, move] of fens) {
      const e = explainFacts(detectConcepts(legal(fen), move), { includeMaterial: true })
      expect(e.length).toBeGreaterThan(0)
      for (const x of e) expect(x.text, x.text).not.toMatch(EVALUATIVE)
    }
  })
})
