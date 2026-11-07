import { describe, expect, it } from 'vitest'
import { GENTLE_PLAY_PATH, colorFromParams, helpFromParams, inviteSlot, isExplicitPlay, opponentFromParams, rulesDone, showInvite } from './firstGame'
import { DEFAULT_OPPONENT } from './maia'

const L = (id: string, stage?: string) => ({ id, stage })
const lessons = [L('a', 'S0'), L('b', 'S0'), L('c', 'S1'), L('d', 'S2')]
const done = (...ids: string[]) => ids.map(lessonId => ({ lessonId, done: true }))

describe('rulesDone', () => {
  it('needs every lesson of S0 and S1', () => {
    expect(rulesDone(lessons, done('a', 'b'))).toBe(false)
    expect(rulesDone(lessons, done('a', 'b', 'c'))).toBe(true)
  })
  it('does not count unfinished rows', () => { expect(rulesDone(lessons, [...done('a', 'b'), { lessonId: 'c', done: false }])).toBe(false) })
  it('is false when the path has no lessons for the stage (a rebuilt path)', () => {
    expect(rulesDone([L('a', 'S0'), L('d', 'S2')], done('a', 'd'))).toBe(false)
    expect(rulesDone([], [])).toBe(false)
    expect(rulesDone(lessons, done('a', 'b', 'c'), 'S99')).toBe(false)
  })
})

describe('showInvite', () => {
  const base = { lessons, progress: done('a', 'b', 'c'), hasPlayed: false, dismissedUntil: null, now: 1000 }
  it('shows once the rules are done', () => { expect(showInvite(base)).toBe(true) })
  it('hides after a game was played', () => { expect(showInvite({ ...base, hasPlayed: true })).toBe(false) })
  it('hides until the pause is over after Not yet, then returns', () => {
    expect(showInvite({ ...base, dismissedUntil: 5000 })).toBe(false)
    expect(showInvite({ ...base, dismissedUntil: 5000, now: 5000 })).toBe(true)
  })
  it('hides before the rules are done', () => { expect(showInvite({ ...base, progress: done('a') })).toBe(false) })
})

describe('inviteSlot', () => {
  it('goes before the first later stage', () => { expect(inviteSlot(['S0', 'S1', 'S2', 'S3'])).toBe(2); expect(inviteSlot(['S1', 'S3'])).toBe(1) })
  it('goes at the end when nothing comes after', () => { expect(inviteSlot(['S0', 'S1'])).toBe(2); expect(inviteSlot([])).toBe(0) })
})

describe('play parameters', () => {
  const q = (s: string) => new URLSearchParams(s)
  const bots = ['b1', 'b2', 'b3', 'b4', 'b5']
  it('the invitation link spells out the gentle game', () => {
    const p = q(GENTLE_PLAY_PATH.split('?')[1])
    expect(isExplicitPlay(p)).toBe(true)
    const o = opponentFromParams(p, { ...DEFAULT_OPPONENT, botId: 'b4' }, bots)
    expect(o.kind).toBe('stockfish')
    expect(o.botId).toBe('b1')
    expect(colorFromParams(p)).toBe('white')
    expect(helpFromParams(p)).toBe(true)
  })
  it('without parameters the last choice is kept', () => {
    const stored = { ...DEFAULT_OPPONENT, botId: 'b4' }
    expect(opponentFromParams(q(''), stored, bots)).toBe(stored)
    expect(colorFromParams(q(''))).toBeNull()
  })
  it('falls back to Beginner for an unknown bot', () => { expect(opponentFromParams(q('from=invite&bot=zzz'), DEFAULT_OPPONENT, bots).botId).toBe('b1') })
  it('help can be turned off by the link', () => { expect(helpFromParams(q('help=0'))).toBe(false) })
  it('the first-ever default opponent is Beginner, never Club', () => { expect(DEFAULT_OPPONENT.botId).toBe('b1') })
})
