import { describe, expect, it } from 'vitest'
import { GAME_TAGS, gameLessonReflection, recentFinishedLessons, tagCounts, tryThisGame } from './keepPlaying'
import { FIRST_GAME_TIPS, PLAY_SITES } from './playSites'
import type { LessonMeta } from '../types'
import type { LessonProgress } from '../db'

const L = (id: string, title: string) => ({ id, title, skill: 'X' } as unknown as LessonMeta)
const byId = new Map([L('a', 'Forks'), L('b', 'Pins'), L('c', 'Skewers'), L('d', 'Mates')].map(l => [l.id, l]))
const P = (lessonId: string, ts: number, over: Partial<LessonProgress> = {}): LessonProgress => ({ lessonId, step: 3, done: true, ts, ...over })

describe('the playing culture (D79)', () => {
  it('takes the most recent finished lessons, newest first, and skips lessons marked done without doing them', () => {
    const r = recentFinishedLessons([P('a', 1), P('b', 4), P('c', 3, { skipped: true }), P('d', 2), P('x', 9, { done: false })], byId, 3)
    expect(r.map(l => l.id)).toEqual(['b', 'd', 'a'])
  })
  it('draws the "What to try this game" line from the last lesson, with no chess claim of its own', () => {
    expect(tryThisGame(byId.get('a'))).toBe("Last lesson: Forks. Look for it in your own moves, and try to spot it in your opponent's.")
    expect(tryThisGame(undefined)).toMatch(/every piece you move safe/)
  })
  it('saves a tag as a local reflection that names the lesson and the game, and counts them', () => {
    const r = gameLessonReflection('late', byId.get('a')!, 7, 123)
    expect(r).toMatchObject({ kind: 'game-lesson', lessonId: 'a', ts: 123, data: { game: '7', tag: 'late', lesson: 'Forks', label: 'I saw it, but too late' } })
    expect(GAME_TAGS).toHaveLength(4)
    expect(tagCounts([r, gameLessonReflection('late', byId.get('b')!, 8), gameLessonReflection('used', byId.get('b')!, 8), { kind: 'note', data: {}, ts: 1 }])).toEqual({ used: 1, late: 2, against: 0, none: 0 })
  })
  it('lists only checked sites, every claim labelled, with plain links (no referral or tracking parameters)', () => {
    expect(PLAY_SITES.map(s => s.id)).toEqual(['lichess', 'chesscom'])
    for (const s of PLAY_SITES) {
      expect(new URL(s.url).search).toBe('')
      expect(new URL(s.url).protocol).toBe('https:')
      expect(s.notChecked.length).toBeGreaterThan(0) // what was not checked is said, not hidden
      for (const c of [...s.offers, ...s.safety]) expect(['V', 'I']).toContain(c.label)
      expect(s.safety.some(c => /parent/i.test(c.text))).toBe(true)
    }
    expect(FIRST_GAME_TIPS.some(t => /15\+10/.test(t.text))).toBe(true)
  })
})
