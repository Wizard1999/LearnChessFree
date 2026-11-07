import { describe, expect, it } from 'vitest'
import { findStrength, followUpLesson, gameContext, pickCritical, resultOf, safeguard, looseCapture, explainDrop, moveNumberOf } from './postGame'
import { plyList } from './pgn'
import type { LessonMeta } from '../types'

const game = (moves: string, fen?: string) => plyList((fen ? `[SetUp "1"]\n[FEN "${fen}"]\n\n` : '') + moves)

describe('findStrength', () => {
  it('finds a capture of a piece nothing was protecting', () => {
    const plies = game('1. Qxd5', '4k3/8/8/3n4/8/8/8/3QK3 w - - 0 1')
    expect(looseCapture(plies[0])).toMatchObject({ piece: 'knight', reason: 'undefended' })
    const s = findStrength(plies, 'white')
    expect(s?.kind).toBe('looseCapture')
    expect(s?.text).toContain('knight')
    expect(s?.text).toContain('move 1')
  })
  it('does not call a pawn capture a loose-piece capture', () => {
    expect(looseCapture(game('1. Qxd5', '4k3/8/8/3p4/8/8/8/3QK3 w - - 0 1')[0])).toBeNull()
  })
  it('finds a piece that was in danger and made safe', () => {
    const plies = game('1. Ra2', '4k3/8/8/8/8/1n6/8/R3K3 w - - 0 1')
    expect(safeguard(plies[0])).toEqual({ piece: 'rook' })
    expect(findStrength(plies, 'white')?.kind).toBe('safeguard')
  })
  it('does not call a move a safeguard if something is still loose', () => {
    // the rook stays attacked by the knight after the king move
    expect(safeguard(game('1. Kd1', '4k3/8/8/8/8/1n6/8/R3K3 w - - 0 1')[0])).toBeNull()
  })
  it('finds castling and an early knight, for the right side only', () => {
    const plies = game('1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. O-O Nf6')
    expect(findStrength(plies, 'white')?.kind).toBe('castled')
    expect(findStrength(plies, 'white')?.text).toContain('move 4')
    expect(findStrength(plies, 'black')?.kind).toBe('knightOut')
  })
  it('finds a check when nothing else stands out', () => {
    const plies = game('1. Ra8+', '4k3/8/8/8/8/8/8/R3K3 w - - 0 1')
    expect(findStrength(plies, 'white')?.kind).toBe('check')
  })
  it('says nothing when no detector fires (no invented praise)', () => {
    expect(findStrength(game('1. a3 a6 2. h3 h6'), 'white')).toBeNull()
    expect(findStrength([], 'white')).toBeNull()
  })
  it('reads the move number from the position', () => {
    expect(moveNumberOf(game('1. e4 e5 2. Nf3')[2])).toBe(2)
  })
})

describe('pickCritical', () => {
  const plies = game('1. e4 e5 2. Nf3 Nc6')
  const ev = (...loss: number[]) => ({ evals: loss.map(l => ({ before: 0, after: -l, loss: l })) })
  it('picks the learner\'s biggest drop, not the opponent\'s', () => {
    const c = pickCritical(plies, ev(20, 900, 300, 0), 'white')
    expect(c?.k).toBe(2)
    expect(c?.loss).toBe(300)
    expect(c?.san).toBe('Nf3')
    expect(pickCritical(plies, ev(20, 900, 300, 0), 'black')?.k).toBe(1)
  })
  it('returns null when nothing lost a pawn, and when there is no analysis yet', () => {
    expect(pickCritical(plies, ev(20, 50, 99, 0), 'white')).toBeNull()
    expect(pickCritical(plies, null, 'white')).toBeNull()
  })
  it('names a pattern the opponent could use, and the skill for it', () => {
    // after 1. h3 the knight on d4 can play Nc2+, forking the king and the rook
    const g = game('1. h3 Nc2+', '4k3/8/8/8/3n4/8/7P/R3K3 w - - 0 1')
    const c = pickCritical(g, { evals: [{ before: 0, after: -500, loss: 500 }, { before: 0, after: 0, loss: 0 }], bests: ['a1b1', 'd4c2', ''] }, 'white')
    expect(c?.concept).toBe('fork')
    expect(c?.skill).toBe('TAC.FORK')
    expect(c?.explanation).toContain('fork')
    expect(c?.explanation).toContain('Nc2+')
  })
  it('is honest when the pattern cannot be named', () => {
    const e = explainDrop({ loss: 250, allowed: null, missed: { san: 'Nf3', concepts: [] } })
    expect(e.concept).toBeNull()
    expect(e.text).toContain('2.5 pawns')
    expect(e.text).toContain('not a pattern')
  })
})

const meta = (id: string, skill: string, order: number, role: LessonMeta['role'] = 'intro') => ({ id, skill, order, role, title: id, depth: 'D1' }) as unknown as LessonMeta
describe('followUpLesson', () => {
  const lessons = [meta('L-A', 'TAC.FORK', 5), meta('L-B', 'TAC.PIN', 3), meta('L-C', 'TAC.FORK', 9, 'application')]
  it('uses the introduction of the pattern\'s skill', () => {
    expect(followUpLesson(lessons, 'TAC.FORK', () => false)).toEqual({ lesson: lessons[0], reason: 'skill' })
  })
  it('falls back to the next lesson on the path', () => {
    expect(followUpLesson(lessons, null, () => false)).toEqual({ lesson: lessons[1], reason: 'path' })
    expect(followUpLesson(lessons, 'TAC.FORK', id => id === 'L-A')).toEqual({ lesson: lessons[1], reason: 'path' })
  })
  it('is null when everything is finished', () => { expect(followUpLesson(lessons, null, () => true)).toBeNull() })
})

describe('result and context', () => {
  it('writes the result from the learner\'s side', () => {
    expect(resultOf('win', 'white')).toBe('1-0'); expect(resultOf('win', 'black')).toBe('0-1')
    expect(resultOf('loss', 'white')).toBe('0-1'); expect(resultOf('draw', 'black')).toBe('1/2-1/2'); expect(resultOf('resigned', 'white')).toBe('*')
  })
  it('marks a stopped game as not completed', () => {
    const base = { startFen: 'x', opponent: 'stockfish' as const, level: 'Beginner', color: 'white' as const }
    expect(gameContext({ ...base, outcome: 'loss' }).completed).toBe(true)
    expect(gameContext({ ...base, outcome: 'resigned' }).completed).toBe(false)
    expect(gameContext({ ...base, outcome: 'win', lessonId: 'L-X' }).lessonId).toBe('L-X')
    expect('lessonId' in gameContext({ ...base, outcome: 'win' })).toBe(false)
  })
})
