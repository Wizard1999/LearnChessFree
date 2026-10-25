import { describe, expect, it } from 'vitest'
import type { EngineLine } from '../engine'
import { isAlsoSound } from './altmove'

const cp = (value: number): EngineLine => ({ rank: 1, depth: 14, kind: 'cp', value, pv: ['e2e4'] })
const mate = (value: number): EngineLine => ({ rank: 1, depth: 14, kind: 'mate', value, pv: ['e2e4'] })

describe('isAlsoSound', () => {
  it('accepts a move within tolerance and rejects one clearly worse', () => {
    expect(isAlsoSound(cp(60), cp(45)).fine).toBe(true)
    expect(isAlsoSound(cp(60), cp(20)).fine).toBe(false)
  })
  it('accepts any move that also keeps a decisive advantage', () => {
    expect(isAlsoSound(cp(900), cp(520)).fine).toBe(true)
    expect(isAlsoSound(cp(900), cp(300)).fine).toBe(false)
  })
  it('requires an equally fast mate when the best move mates', () => {
    expect(isAlsoSound(mate(2), mate(2)).fine).toBe(true)
    expect(isAlsoSound(mate(2), mate(3)).fine).toBe(false)
    expect(isAlsoSound(mate(2), cp(800)).fine).toBe(false)
  })
  it('accepts a mating move when the best move is only a pawn up, and rejects a move that allows mate', () => {
    expect(isAlsoSound(cp(100), mate(4)).fine).toBe(true)
    expect(isAlsoSound(cp(100), mate(-3)).fine).toBe(false)
  })
  it('says no when the engine returned nothing', () => {
    expect(isAlsoSound(undefined, cp(0)).fine).toBe(false)
  })
})
