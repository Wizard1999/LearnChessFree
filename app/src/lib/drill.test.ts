import { describe, expect, it } from 'vitest'
import { buildCards, dueCards, grade } from './drill'

const DAY = 86400000

describe('buildCards', () => {
  it('makes one card per position where the learner is to move', () => {
    const cards = buildCards({ a: { note: 'solid', side: 'white', san: ['e4', 'e5', 'Nf3', 'Nc6'] } })
    expect(cards.map(c => c.expected)).toEqual(['e4', 'Nf3'])
    expect(cards[1].before).toEqual(['e4', 'e5'])
  })
  it('uses Black plies for a Black repertoire', () => {
    const cards = buildCards({ a: { note: '', side: 'black', san: ['e4', 'c5', 'Nf3', 'd6'] } })
    expect(cards.map(c => c.expected)).toEqual(['c5', 'd6'])
  })
  it('merges lines that reach the same position', () => {
    const cards = buildCards({
      a: { note: '', side: 'white', san: ['e4', 'e5', 'Nf3', 'Nc6'] },
      b: { note: '', side: 'white', san: ['e4', 'e5', 'Nf3', 'Nf6'] },
    })
    expect(cards).toHaveLength(2)
  })
  it('stops at an unreadable move instead of throwing', () => {
    expect(() => buildCards({ a: { note: '', side: 'white', san: ['e4', 'e5', 'Zz9', 'Nc6'] } })).not.toThrow()
  })
})

describe('grade and dueCards', () => {
  it('moves a correct card one box out and a missed card back to tomorrow', () => {
    const now = 1_000_000 * DAY
    const first = grade(undefined, true, now)
    expect(first).toMatchObject({ box: 1, seen: 1, ok: 1 })
    expect(first.due).toBe(now + DAY)
    const second = grade(first, true, now + DAY)
    expect(second.box).toBe(2)
    expect(second.due).toBe(now + DAY + 2 * DAY)
    const missed = grade(second, false, now + 3 * DAY)
    expect(missed.box).toBe(0)
    expect(missed.due).toBe(now + 4 * DAY)
  })
  it('lists unseen cards and cards whose time has come', () => {
    const cards = buildCards({ a: { note: '', side: 'white', san: ['e4', 'e5', 'Nf3', 'Nc6'] } })
    const now = 5 * DAY
    const state = { [cards[0].key]: { box: 1, due: now + DAY, seen: 1, ok: 1 } }
    expect(dueCards(cards, state, now).map(c => c.expected)).toEqual(['Nf3'])
    expect(dueCards(cards, state, now + 2 * DAY)).toHaveLength(2)
  })
})
