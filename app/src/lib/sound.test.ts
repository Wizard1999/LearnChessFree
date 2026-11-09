// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_SOUND, KIND_OF, LIMITS, SOUND_IDS, clampVolume, createLimiter, describeSound, getSoundPrefs, initSound, loadSoundPrefs, peakOverlap, playSound, playTestSound, resetSoundEngine, saveSoundPrefs, scheduleNotes, soundLength, type SoundId } from './sound'
import { moveSoundFor } from './moveSound'
import { levelUpSound } from '../components/SoundEvents'

const RARE = new Set<SoundId>(['firstGame'])

describe('sound descriptors', () => {
  it('every sound has valid notes: finite numbers, sensible gains, no clipping, short', () => {
    for (const id of SOUND_IDS) {
      const notes = describeSound(id)
      expect(notes.length, id).toBeGreaterThan(0)
      for (const n of notes) {
        for (const v of [n.freq, n.start, n.dur, n.gain, n.attack, n.release]) expect(Number.isFinite(v), `${id} has NaN`).toBe(true)
        expect(n.freq).toBeGreaterThan(20); expect(n.freq).toBeLessThan(6000)
        expect(n.start).toBeGreaterThanOrEqual(0); expect(n.dur).toBeGreaterThan(0)
        expect(n.gain).toBeGreaterThan(0); expect(n.gain).toBeLessThanOrEqual(0.4)
        expect(n.attack).toBeGreaterThan(0); expect(n.attack).toBeLessThan(n.dur)
      }
      expect(peakOverlap(notes), `${id} too loud`).toBeLessThanOrEqual(0.9) // a conservative straight sum; the master gain brings it far lower
      expect(soundLength(notes), `${id} too long`).toBeLessThanOrEqual(RARE.has(id) ? 2.5 : 1.2)
    }
  })
  it('keeps the tiers in order: the first game is the longest, and the wrong-answer note is one quiet low note', () => {
    const len = (id: SoundId) => soundLength(describeSound(id))
    expect(len('firstGame')).toBeGreaterThan(len('challengePassed'))
    expect(len('levelMastered')).toBeGreaterThan(len('levelGuided') - 0.2)
    expect(len('move')).toBeLessThan(0.3)
    const wrong = describeSound('wrong')
    expect(wrong).toHaveLength(1)
    expect(wrong[0].freq).toBeLessThan(300)
    expect(wrong[0].endFreq).toBeUndefined() // no falling "failure" slide
  })
  it('every sound belongs to a kind the learner can switch', () => {
    for (const id of SOUND_IDS) expect(['moves', 'rewards', 'feedback']).toContain(KIND_OF[id])
  })
})

describe('settings', () => {
  beforeEach(() => localStorage.clear())
  it('default to on, volume 0.6, every kind on', () => {
    expect(loadSoundPrefs()).toEqual(DEFAULT_SOUND)
    expect(DEFAULT_SOUND).toMatchObject({ on: true, volume: 0.6, moves: true, rewards: true, feedback: true })
  })
  it('fall back on bad data, keeping what is valid', () => {
    localStorage.setItem('cs-sound', '{not json')
    expect(loadSoundPrefs()).toEqual(DEFAULT_SOUND)
    localStorage.setItem('cs-sound', JSON.stringify({ on: 'yes', volume: 99, moves: false, rewards: 3 }))
    expect(loadSoundPrefs()).toEqual({ ...DEFAULT_SOUND, volume: 1, moves: false })
    localStorage.setItem('cs-sound', 'null')
    expect(loadSoundPrefs()).toEqual(DEFAULT_SOUND)
    expect(clampVolume(NaN)).toBe(0.6); expect(clampVolume(-1)).toBe(0)
  })
  it('are saved and read back', () => {
    saveSoundPrefs({ on: false, volume: 0.3 })
    expect(JSON.parse(localStorage.getItem('cs-sound')!)).toMatchObject({ on: false, volume: 0.3 })
    expect(loadSoundPrefs().on).toBe(false)
    saveSoundPrefs({ on: true, volume: 0.6 })
  })
  it('survive blocked storage', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    expect(() => saveSoundPrefs({ moves: false })).not.toThrow()
    expect(getSoundPrefs().moves).toBe(false)
    spy.mockRestore(); saveSoundPrefs({ moves: true })
  })
})

describe('rate limiter', () => {
  it('drops a move sound that comes too soon and caps bursts', () => {
    const l = createLimiter()
    expect(l.allow('moves', 1000)).toBe(true)
    expect(l.allow('moves', 1050)).toBe(false) // inside the gap
    expect(l.allow('moves', 1200)).toBe(true)
    expect(l.allow('moves', 1400)).toBe(true); expect(l.allow('moves', 1600)).toBe(true); expect(l.allow('moves', 1800)).toBe(true)
    expect(l.allow('moves', 1950)).toBe(false) // 5 in the window already
    expect(l.allow('moves', 3300)).toBe(true) // the window has passed
  })
  it('keeps kinds apart and spaces rewards widely', () => {
    const l = createLimiter()
    expect(l.allow('rewards', 0)).toBe(true)
    expect(l.allow('rewards', LIMITS.rewards.gap - 1)).toBe(false)
    expect(l.allow('feedback', 10)).toBe(true)
    expect(l.allow('rewards', LIMITS.rewards.gap + 1)).toBe(true)
  })
  it('plays nearly nothing when keys are held down', () => {
    const l = createLimiter()
    let played = 0
    for (let t = 0; t < 3000; t += 30) if (l.allow('moves', t)) played++
    expect(played).toBeLessThanOrEqual(10)
  })
})

describe('moveSoundFor', () => {
  const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  it('names the sound a move makes', () => {
    expect(moveSoundFor(START, 'e2', 'e4')).toBe('move')
    expect(moveSoundFor('rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', 'e4', 'd5')).toBe('capture')
    expect(moveSoundFor('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1', 'e1', 'g1')).toBe('castle')
    expect(moveSoundFor('8/P7/8/8/7k/8/8/K7 w - - 0 1', 'a7', 'a8')).toBe('promote')
    expect(moveSoundFor('4k3/8/8/8/8/8/8/4K2R w - - 0 1', 'h1', 'h8')).toBe('check')
  })
  it('is silent for an illegal move (a jump to an unrelated position)', () => {
    expect(moveSoundFor(START, 'e2', 'e5')).toBeNull()
    expect(moveSoundFor('garbage', 'e2', 'e4')).toBeNull()
  })
})

describe('levelUpSound', () => {
  const m = (o: Record<string, number>) => new Map(Object.entries(o)) as Map<string, 0 | 1 | 2 | 3 | 4>
  it('sounds only for a real rise to Guided, Independent or Mastered, and picks the highest', () => {
    expect(levelUpSound(m({ a: 0 }), m({ a: 1 }))).toBeNull() // Seen: the lesson sound covers it
    expect(levelUpSound(m({ a: 1 }), m({ a: 2 }))).toBe('levelGuided')
    expect(levelUpSound(m({ a: 2, b: 1 }), m({ a: 3, b: 2 }))).toBe('levelIndependent')
    expect(levelUpSound(m({ a: 3, b: 1 }), m({ a: 4, b: 2 }))).toBe('levelMastered')
    expect(levelUpSound(m({ a: 3 }), m({ a: 2 }))).toBeNull() // a fall is silent
    expect(levelUpSound(m({}), m({ a: 4 }))).toBeNull() // a skill new to the list is not a change
  })
})

// A stand-in for the Web Audio API that records what is scheduled.
function fakeAudio(state = 'running') {
  const made = { osc: 0, noise: 0, gains: 0, started: 0 }
  const param = () => ({ value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), setTargetAtTime: vi.fn() })
  const node = () => ({ connect: vi.fn(), disconnect: vi.fn() })
  class Ctx {
    state = state; currentTime = 1; sampleRate = 8000; destination = node()
    resume = vi.fn(async () => { await Promise.resolve(); this.state = 'running' })
    createGain() { made.gains++; return { ...node(), gain: param() } }
    createOscillator() { made.osc++; return { ...node(), type: '', frequency: param(), start: () => { made.started++ }, stop: vi.fn(), onended: null } }
    createBufferSource() { made.noise++; return { ...node(), buffer: null, start: () => { made.started++ }, stop: vi.fn(), onended: null } }
    createBiquadFilter() { return { ...node(), type: '', frequency: param(), Q: param() } }
    createBuffer(_c: number, len: number) { return { sampleRate: 8000, getChannelData: () => new Float32Array(len) } }
  }
  return { Ctx, made }
}

describe('engine', () => {
  beforeEach(() => { localStorage.clear(); resetSoundEngine(); saveSoundPrefs({ on: true, volume: 0.6, moves: true, rewards: true, feedback: true }) })
  afterEach(() => { vi.unstubAllGlobals(); resetSoundEngine() })

  it('never throws and plays nothing without an AudioContext (jsdom has none)', () => {
    expect(() => { for (const id of SOUND_IDS) playSound(id); playTestSound(); initSound() }).not.toThrow()
    expect(playSound('right')).toBe(false)
    expect(playTestSound()).toBe(false)
  })
  it('never throws when the context constructor itself throws', () => {
    vi.stubGlobal('AudioContext', class { constructor() { throw new Error('no audio') } })
    expect(() => playSound('move')).not.toThrow()
    expect(playSound('move')).toBe(false)
  })
  it('schedules one source per note, with a gain envelope each', () => {
    const { Ctx, made } = fakeAudio()
    vi.stubGlobal('AudioContext', Ctx)
    expect(playSound('right')).toBe(true)
    const notes = describeSound('right').length
    expect(made.osc).toBe(notes); expect(made.started).toBe(notes); expect(made.gains).toBeGreaterThanOrEqual(notes)
  })
  it('uses a noise source for a wooden tap', () => {
    const { Ctx, made } = fakeAudio()
    vi.stubGlobal('AudioContext', Ctx)
    playSound('move')
    expect(made.noise).toBe(1); expect(made.osc).toBe(1)
  })
  it('plays nothing when sound is off, a kind is off, or the tab is hidden', () => {
    const { Ctx, made } = fakeAudio()
    vi.stubGlobal('AudioContext', Ctx)
    saveSoundPrefs({ on: false }); expect(playSound('right')).toBe(false)
    saveSoundPrefs({ on: true, feedback: false }); expect(playSound('wrong')).toBe(false)
    saveSoundPrefs({ feedback: true })
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    expect(playSound('right')).toBe(false)
    hidden.mockRestore()
    expect(made.osc).toBe(0)
  })
  it('stays quiet while the read-aloud voice speaks', () => {
    const { Ctx, made } = fakeAudio()
    vi.stubGlobal('AudioContext', Ctx)
    vi.stubGlobal('speechSynthesis', { speaking: true })
    expect(playSound('lessonDone')).toBe(false)
    expect(made.osc).toBe(0)
  })
  it('does not stack the same kind of sound when events come at once', () => {
    const { Ctx, made } = fakeAudio()
    vi.stubGlobal('AudioContext', Ctx)
    playSound('move'); playSound('capture'); playSound('check')
    expect(made.noise).toBe(1) // only the first tap
  })
  it('the test sound plays even when sound is off, and a suspended context is asked to resume and skipped', async () => {
    const { Ctx, made } = fakeAudio('suspended')
    vi.stubGlobal('AudioContext', Ctx)
    saveSoundPrefs({ on: false })
    expect(playTestSound()).toBe(false) // suspended: resume requested, nothing scheduled yet
    await new Promise(r => setTimeout(r, 0))
    expect(playTestSound()).toBe(true)
    expect(made.osc).toBeGreaterThan(0)
  })
  it('scheduleNotes starts every note it is given', () => {
    const { Ctx, made } = fakeAudio()
    const c = new Ctx() as unknown as AudioContext
    expect(scheduleNotes(c, c.destination, describeSound('firstGame'), 0)).toBe(describeSound('firstGame').length)
    expect(made.started).toBe(describeSound('firstGame').length)
  })
})
