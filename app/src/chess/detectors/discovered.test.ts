import { describe, expect, it } from 'vitest'
import { detectDiscovered, detectDoubleCheck } from './discovered.ts'
import { legal } from '../testutil.ts'

describe('detectDiscovered', () => {
  it('discovered check where the moving knight also attacks the queen: works', () => {
    // Ne5-c6+ unmasks Re1 on Ke8 and the knight attacks Qa7
    const fen = legal('4k3/q7/8/4N3/8/8/8/4R2K w - - 0 1')
    const r = detectDiscovered(fen, 'Nc6+')
    expect(r.found).toBe(true)
    expect(r.works).toBe(true)
    const d = r.details[0]
    expect(d.kind).toBe('executed')
    expect(d.check).toBe(true)
    expect(d.slider).toMatchObject({ square: 'e1', type: 'r' })
    expect(d.unmasker).toMatchObject({ square: 'e5', type: 'n' })
    expect(d.target).toMatchObject({ square: 'e8', type: 'k', reason: 'king' })
    expect(d.moverTargets.map(t => t.square)).toEqual(['a7'])
    expect(d.guaranteedGain).toBeGreaterThanOrEqual(9)
  })

  it('FAILING LOOK-ALIKE: discovered check, but the moving knight threatens nothing', () => {
    const fen = legal('4k3/8/8/4N3/8/8/8/4R2K w - - 0 1')
    const r = detectDiscovered(fen, 'Ng6+')
    expect(r.found).toBe(true)
    expect(r.details[0].check).toBe(true)
    expect(r.details[0].moverTargets).toEqual([])
    expect(r.works).toBe(false)
  })

  it('position mode lists the battery: the knight stands between the rook and the king', () => {
    const fen = legal('4k3/8/8/4N3/8/8/8/4R2K w - - 0 1')
    const r = detectDiscovered(fen)
    expect(r.found).toBe(true)
    expect(r.details[0]).toMatchObject({ kind: 'battery', check: true })
    expect(r.details[0].unmasker.square).toBe('e5')
    expect(r.details[0].slider.square).toBe('e1')
  })

  it('NOT a discovered attack: a move by another piece', () => {
    const fen = legal('4k3/8/8/4N3/8/8/8/4R2K w - - 0 1')
    expect(detectDiscovered(fen, 'Kg1').found).toBe(false)
  })

  it('NOT a discovered attack: the blocker moves along the line (the line stays closed)', () => {
    // Re4 shields Re1 from the queen on e8; Re4-e6 stays on the file, so Re1 still attacks nothing new
    const fen = legal('4q1k1/8/8/8/4R3/8/8/4R2K w - - 0 1')
    expect(detectDiscovered(fen, 'Re6').details.filter(d => d.kind === 'executed')).toEqual([])
  })
})

describe('detectDoubleCheck', () => {
  it('finds two checkers in a position', () => {
    const fen = legal('4k3/8/5N2/8/8/8/8/4R2K b - - 0 1')
    const r = detectDoubleCheck(fen)
    expect(r.found).toBe(true)
    expect(r.details[0].checkers.map(c => c.square).sort()).toEqual(['e1', 'f6'])
  })

  it('a pawn capture that discovers a rook check is a double check (move mode)', () => {
    // exf7+ : the pawn f7 checks e8 and the rook e1 sees e8 along the opened e-file
    const fen = legal('4k3/5b2/4P3/8/8/8/8/4R2K w - - 0 1')
    const r = detectDoubleCheck(fen, 'exf7+')
    expect(r.found).toBe(true)
    expect(r.details[0].checkers.map(c => c.square).sort()).toEqual(['e1', 'f7'])
    const d = detectDiscovered(fen, 'exf7+')
    expect(d.details[0]).toMatchObject({ check: true, doubleCheck: true })
  })

  it('NOT a double check: a single check', () => {
    const fen = legal('4k3/8/8/8/8/8/8/4R2K b - - 0 1')
    expect(detectDoubleCheck(fen).found).toBe(false)
  })
})
