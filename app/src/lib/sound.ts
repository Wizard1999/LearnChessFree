// Sound (docs/design-feel.md, decision D85). Every sound is made on the device with the Web Audio API: no audio files, nothing fetched, nothing sent.
// The mood is ours: warm, wooden and chime-like for the small things, short rising motifs for success. Nothing imitates a specific recording or melody (rule 4).
// On by default; fully mutable. Settings are kept per device in localStorage, guarded like lib/appearance.ts. The engine never throws: no AudioContext,
// a blocked context or a tab in the background simply means silence, and nothing in the app depends on a sound being heard (every sound has a visible equivalent).
import { useSyncExternalStore } from 'react'
import { speechIsActive } from './readAloud'

// ---- the sounds, described as plain data so they can be tested without audio hardware ----
export type SoundId =
  | 'move' | 'capture' | 'check' | 'castle' | 'promote'
  | 'right' | 'wrong'
  | 'lessonDone' | 'levelGuided' | 'levelIndependent' | 'levelMastered' | 'challengePassed' | 'firstGame'
export type SoundKind = 'moves' | 'feedback' | 'rewards'
export const SOUND_KINDS: readonly SoundKind[] = ['moves', 'rewards', 'feedback']
export const SOUND_IDS: readonly SoundId[] = ['move', 'capture', 'check', 'castle', 'promote', 'right', 'wrong', 'lessonDone', 'levelGuided', 'levelIndependent', 'levelMastered', 'challengePassed', 'firstGame']

export const KIND_OF: Record<SoundId, SoundKind> = {
  move: 'moves', capture: 'moves', check: 'moves', castle: 'moves', promote: 'moves',
  right: 'feedback', wrong: 'feedback',
  lessonDone: 'rewards', levelGuided: 'rewards', levelIndependent: 'rewards', levelMastered: 'rewards', challengePassed: 'rewards', firstGame: 'rewards',
}

export type Wave = 'sine' | 'triangle' | 'noise'
export interface Note {
  /** Pitch in Hz (the centre of the band for noise). */
  freq: number
  /** Optional pitch at the end of the note (a gentle glide). */
  endFreq?: number
  /** Seconds from the start of the sound. */
  start: number
  dur: number
  wave: Wave
  /** Peak gain 0..1 before the master volume. */
  gain: number
  /** 'decay' rings out like a struck bell or wooden bar; 'hold' stays level then fades. */
  env: 'decay' | 'hold'
  attack: number
  release: number
  /** Noise only: band-pass Q (higher is more pitched). */
  q?: number
  /** High-pass corner in Hz (keeps low mud out of taps). */
  hp?: number
  /** Low-pass corner in Hz (softens a note). */
  lp?: number
  /** How much of this note is sent to the small reverb (an absolute send gain, already scaled by the character). */
  wet?: number
  /** A wooden tap: humanisation spreads its pitch a little more. */
  tap?: boolean
}

// ---- sound character: named presets of the tunables, switchable in Settings so they can be compared by ear ----
export type CharacterId = 'warm' | 'bright'
export const CHARACTER_IDS: readonly CharacterId[] = ['warm', 'bright']
export interface Character {
  label: string
  /** Multiplies every bell pitch (2 = an octave up; melodies keep their intervals). */
  oct: number
  /** Multiplies note lengths: below 1 is tighter, less smear. */
  decay: number
  /** Multiplies the gaps between notes of a phrase, so they articulate. */
  space: number
  /** How much the upper (inharmonic) partials of a bell sound: more is more sparkle. */
  shimmer: number
  /** How many bell partials sound (fewer is rounder). */
  partials: number
  /** Multiplies the length of the upper partials: below 1 they die faster (a crisper sparkle). */
  upperLen: number
  /** Multiplies the loudness of the wooden taps. */
  tapGain: number
  /** Adds a very short high click at the start of a tap (a sharper attack). */
  click: boolean
  /** Reverb send for reward phrases, 0..~0.2 (taps get a quarter of it, answers about half). */
  wet: number
  /** Overall level of the set (before the learner's volume). */
  level: number
  /** High-pass corner for the wooden taps, Hz. */
  tapHp: number
  /** Low-pass corner of the wrong-answer note, Hz. */
  wrongLp: number
}
export const CHARACTERS: Record<CharacterId, Character> = {
  // mellow and round: the lower register, three quiet partials, a little more room, softer taps with a lower high-pass
  warm: { label: 'Warm', oct: 2, decay: 0.9, space: 1.2, shimmer: 0.6, partials: 3, upperLen: 1, tapGain: 0.85, click: false, wet: 0.2, level: 0.8, tapHp: 180, wrongLp: 1500 },
  // crisp and sparkly: one more octave up, stronger upper partials that die faster, nearly dry, sharper taps with a click
  bright: { label: 'Bright', oct: 4, decay: 0.75, space: 1.15, shimmer: 1.8, partials: 4, upperLen: 0.7, tapGain: 1, click: true, wet: 0.04, level: 0.6, tapHp: 450, wrongLp: 2200 },
}
export const DEFAULT_CHARACTER: CharacterId = 'warm'

const note = (n: Partial<Note> & Pick<Note, 'freq' | 'start' | 'dur' | 'gain'>): Note => ({ wave: 'sine', env: 'decay', attack: 0.0025, release: 0.025, ...n })

/** Partials of a struck bell: ratio, relative gain and relative length. The upper ones are inharmonic and die away faster, so the sound shimmers then settles. */
export const BELL_PARTIALS: readonly (readonly [number, number, number])[] = [[1, 1, 1], [2.0, 0.3, 0.6], [2.76, 0.16, 0.38], [5.4, 0.06, 0.18]]
const MAX_PARTIAL_HZ = 9000

/** A struck bell or glass chime (pitch before the character's octave shift). Quiet overtones are skipped above 9 kHz. */
export function bell(c: Character, freq: number, start: number, dur: number, gain: number, wet = 1): Note[] {
  const f0 = freq * c.oct, t = start * c.space, d = dur * c.decay
  const out: Note[] = []
  BELL_PARTIALS.slice(0, c.partials).forEach(([ratio, g, len], k) => {
    const f = f0 * ratio
    if (f > MAX_PARTIAL_HZ) return
    out.push(note({ freq: f, start: t, dur: d * len * (k === 0 ? 1 : c.upperLen), gain: gain * c.level * (k === 0 ? 1 : g * c.shimmer), wet: wet * c.wet, attack: k === 0 ? 0.003 : 0.002 }))
  })
  return out
}
/** A soft wooden tap: a short noise burst and a brief, light thud, both high-passed so nothing booms. `depth` below 1 is a little deeper. */
export function tap(c: Character, start: number, depth: number, gain: number): Note[] {
  const hp = c.tapHp * depth
  gain *= c.tapGain
  return [
    ...(c.click ? [note({ wave: 'noise' as const, freq: 4500, start, dur: 0.012, gain: gain * 0.6, q: 0.7, hp: hp * 2, attack: 0.001, release: 0.008, tap: true })] : []),
    note({ wave: 'noise', freq: 1500 * depth, start, dur: 0.04, gain: gain * 0.9, q: 0.9, hp, release: 0.02, wet: 0.25 * c.wet, tap: true }),
    note({ freq: 280 * depth, endFreq: 190 * depth, start, dur: 0.065, gain: gain * 0.5, hp, release: 0.03, wet: 0.25 * c.wet, tap: true }),
  ]
}

// Pitches before the octave shift (equal temperament, A4 = 440), from a major pentatonic so any two can sound together.
// They are written an octave up (C5 and so on) and halved below, so the shift in the character decides where they finally sit.
const G4 = 392, C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880, C6 = 1046.5, E6 = 1318.5, G6 = 1568

const DESCRIPTORS: Record<SoundId, (c: Character) => Note[]> = {
  move: c => tap(c, 0, 1, 0.3),
  capture: c => [...tap(c, 0, 0.85, 0.3), ...tap(c, 0.04, 0.75, 0.1)],
  check: c => [...tap(c, 0, 1, 0.2), ...bell(c, A5 / 2, 0.04, 0.5, 0.16, 0.3)],
  castle: c => [...tap(c, 0, 1, 0.24), ...tap(c, 0.12, 0.9, 0.28)],
  promote: c => [...bell(c, G5 / 2, 0, 0.32, 0.16, 0.6), ...bell(c, C6 / 2, 0.1, 0.32, 0.16, 0.6), ...bell(c, E6 / 2, 0.2, 0.5, 0.15, 0.8)],
  right: c => [...bell(c, G5 / 2, 0, 0.28, 0.2, 0.5), ...bell(c, C6 / 2, 0.12, 0.5, 0.2, 0.5)],
  // soft, neutral, low: a single quiet note with the edges taken off, never a buzzer and never falling in a mocking way
  wrong: c => [note({ wave: 'triangle', freq: 247, start: 0, dur: 0.3, gain: 0.18 * c.level / 0.8, attack: 0.012, release: 0.1, lp: c.wrongLp })],
  lessonDone: c => [...bell(c, C5 / 2, 0, 0.55, 0.18), ...bell(c, E5 / 2, 0.17, 0.55, 0.18), ...bell(c, G5 / 2, 0.34, 0.75, 0.2)],
  levelGuided: c => bell(c, G5 / 2, 0, 0.75, 0.22),
  levelIndependent: c => [...bell(c, C6 / 2, 0, 0.85, 0.2), ...bell(c, G5 / 2, 0, 0.85, 0.1)],
  levelMastered: c => [...bell(c, C5 / 2, 0, 0.65, 0.16), ...bell(c, E5 / 2, 0.1, 0.65, 0.16), ...bell(c, G5 / 2, 0.2, 0.75, 0.16), ...bell(c, C6 / 2, 0.3, 0.85, 0.18)],
  challengePassed: c => [
    ...bell(c, G4 / 2, 0, 0.28, 0.17), ...bell(c, C5 / 2, 0.12, 0.28, 0.17), ...bell(c, E5 / 2, 0.24, 0.28, 0.17),
    ...bell(c, G5 / 2, 0.38, 0.75, 0.2), ...bell(c, C6 / 2, 0.38, 0.75, 0.12),
  ],
  firstGame: c => [
    ...bell(c, C5 / 2, 0, 0.65, 0.16), ...bell(c, G5 / 2, 0.2, 0.65, 0.16), ...bell(c, E5 / 2, 0.4, 0.65, 0.16), ...bell(c, C6 / 2, 0.6, 0.85, 0.17),
    ...bell(c, D5 / 2, 1.0, 0.55, 0.09), ...bell(c, G5 / 2, 1.0, 0.55, 0.09), ...bell(c, G6 / 2, 1.2, 1.1, 0.12),
    ...bell(c, C5 / 2, 1.2, 1.1, 0.08), ...bell(c, E6 / 2, 1.2, 1.1, 0.08),
  ],
}

/** The notes of a sound. */
export function describeSound(id: SoundId, character: CharacterId = prefs.character): Note[] { return DESCRIPTORS[id](CHARACTERS[character] ?? CHARACTERS[DEFAULT_CHARACTER]) }

/** A tiny per-play variation so repeated sounds are not mechanical: pitch within 5 cents (taps within 40), gain within 8%. The melody is untouched. */
export function humanise(notes: readonly Note[], rand: () => number = Math.random): Note[] {
  const pitch = rand() * 2 - 1, loud = 1 + (rand() * 2 - 1) * 0.08
  return notes.map(n => {
    const cents = n.tap ? (rand() * 2 - 1) * 40 : pitch * 5
    const m = Math.pow(2, cents / 1200)
    return { ...n, freq: n.freq * m, endFreq: n.endFreq ? n.endFreq * m : undefined, gain: n.gain * loud }
  })
}
/** Total length in seconds, including each note's tail. */
export function soundLength(notes: readonly Note[]): number { return notes.reduce((m, n) => Math.max(m, n.start + n.dur), 0) }
/** The largest sum of note gains sounding at the same moment (a rough loudness ceiling; kept low so nothing is loud). */
export function peakOverlap(notes: readonly Note[]): number {
  let peak = 0
  for (const a of notes) {
    let sum = 0
    for (const b of notes) if (b.start <= a.start + 1e-9 && b.start + b.dur > a.start + 1e-9) sum += b.gain
    peak = Math.max(peak, sum)
  }
  return peak
}

// ---- preferences, per device ----
export interface SoundPrefs { on: boolean; volume: number; moves: boolean; rewards: boolean; feedback: boolean; character: CharacterId }
export const DEFAULT_SOUND: SoundPrefs = { on: true, volume: 0.6, moves: true, rewards: true, feedback: true, character: DEFAULT_CHARACTER }
const KEY = 'cs-sound'
export const clampVolume = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : DEFAULT_SOUND.volume)
const bool = (v: unknown, d: boolean) => (typeof v === 'boolean' ? v : d)

export function loadSoundPrefs(): SoundPrefs {
  try {
    const r = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<Record<string, unknown>> | null
    const p = r && typeof r === 'object' ? r : {}
    return { on: bool(p.on, true), volume: clampVolume(p.volume), moves: bool(p.moves, true), rewards: bool(p.rewards, true), feedback: bool(p.feedback, true), character: (CHARACTER_IDS as readonly unknown[]).includes(p.character) ? (p.character as CharacterId) : DEFAULT_CHARACTER }
  } catch { return { ...DEFAULT_SOUND } }
}

let prefs: SoundPrefs = loadSoundPrefs()
const listeners = new Set<() => void>()
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l) } }
export const getSoundPrefs = (): SoundPrefs => prefs
export function saveSoundPrefs(patch: Partial<SoundPrefs>) {
  prefs = { ...prefs, ...patch, volume: clampVolume(patch.volume ?? prefs.volume) }
  try { localStorage.setItem(KEY, JSON.stringify(prefs)) } catch { /* blocked storage: the choice lasts for this visit */ }
  listeners.forEach(l => l())
}
/** The current sound settings, live. */
export function useSoundPrefs(): SoundPrefs { return useSyncExternalStore(subscribe, getSoundPrefs, getSoundPrefs) }

// ---- rate limiting: rapid events never stack ----
export interface LimitRule { gap: number; max?: number; window?: number }
/** Moves: at least 140 ms apart and at most 5 in any 2 seconds (holding an arrow key through a game is nearly silent). Feedback and rewards are spaced further. */
export const LIMITS: Record<SoundKind, LimitRule> = {
  moves: { gap: 140, max: 5, window: 2000 },
  feedback: { gap: 250 },
  rewards: { gap: 1500 },
}
export function createLimiter(rules: Record<SoundKind, LimitRule> = LIMITS) {
  const times: Record<SoundKind, number[]> = { moves: [], feedback: [], rewards: [] }
  return {
    /** True (and the time is recorded) when a sound of this kind may play now. */
    allow(kind: SoundKind, now: number): boolean {
      const r = rules[kind], t = times[kind]
      if (r.window) while (t.length && now - t[0] > r.window) t.shift()
      if (t.length && now - t[t.length - 1] < r.gap) return false
      if (r.max && t.length >= r.max) return false
      t.push(now)
      if (t.length > 20) t.shift()
      return true
    },
  }
}

// ---- the player: maps notes to oscillators and gain envelopes ----
const MASTER = 0.55 // every sound is quiet by design; the learner's volume scales this
let ctx: AudioContext | null = null
let master: GainNode | null = null
let reverb: AudioNode | null = null
let noise: AudioBuffer | null = null
let limiter = createLimiter()

function makeContext(): AudioContext | null {
  try {
    const g = globalThis as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }
    const Ctor = g.AudioContext ?? g.webkitAudioContext
    return Ctor ? new Ctor() : null
  } catch { return null }
}

/** Creates the context if it does not exist and asks it to run. Browsers allow this only after a gesture, so it is also tried at the first click, tap or key. */
export function unlockAudio(): AudioContext | null {
  try {
    if (!ctx) {
      ctx = makeContext()
      if (!ctx) return null
      master = ctx.createGain()
      master.gain.value = prefs.volume * MASTER
      // a gentle compressor so overlapping sounds do not build up into mud; skipped where the browser has none
      try {
        const comp = ctx.createDynamicsCompressor()
        comp.threshold.value = -20; comp.knee.value = 12; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.2
        master.connect(comp); comp.connect(ctx.destination)
      } catch { master.connect(ctx.destination) }
    }
    if (ctx.state === 'suspended') void Promise.resolve(ctx.resume()).catch(() => undefined)
    return ctx
  } catch { return null }
}

let wired = false
const GESTURES = ['pointerdown', 'keydown', 'touchend']
/** Listens for the first user gestures to start audio (browsers block it before then). Safe to call more than once and without a window. */
export function initSound() {
  if (wired || typeof window === 'undefined') return
  wired = true
  const go = () => {
    unlockAudio()
    if (ctx && ctx.state === 'running') for (const e of GESTURES) window.removeEventListener(e, go, true)
  }
  for (const e of GESTURES) window.addEventListener(e, go, true)
}

function noiseBuffer(c: AudioContext): AudioBuffer {
  if (noise && noise.sampleRate === c.sampleRate) return noise
  const len = Math.max(1, Math.floor(c.sampleRate * 0.25))
  const b = c.createBuffer(1, len, c.sampleRate)
  const d = b.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  noise = b
  return b
}

/** A small room: about 0.55 s of decaying noise, generated here (no file). Made once, only when a reverb is first wanted; null where ConvolverNode is unavailable. */
function reverbBus(c: AudioContext, dest: AudioNode): AudioNode | null {
  if (reverb) return reverb
  try {
    const len = Math.floor(c.sampleRate * 0.55)
    const ir = c.createBuffer(2, len, c.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch)
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3)
    }
    const conv = c.createConvolver()
    conv.buffer = ir
    conv.connect(dest)
    reverb = conv
    return conv
  } catch { return null }
}

/** Schedules notes on a context starting at `t0` into `dest` (a note's `wet` goes to the reverb when `wetDest` is given). Returns how many sources were started. Exported so a test can pass a stand-in context. */
export function scheduleNotes(c: AudioContext, dest: AudioNode, notes: readonly Note[], t0: number, wetDest: AudioNode | null = null): number {
  let started = 0
  for (const n of notes) {
    const t = t0 + n.start, end = t + n.dur
    const g = c.createGain()
    const peak = Math.max(0.0002, n.gain)
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(peak, t + n.attack)
    if (n.env === 'decay') g.gain.exponentialRampToValueAtTime(0.0001, end)
    else { g.gain.setValueAtTime(peak, Math.max(t + n.attack, end - n.release)); g.gain.linearRampToValueAtTime(0, end) }
    g.gain.setValueAtTime(0, end + 0.01)
    let tail: AudioNode = g
    let src: AudioScheduledSourceNode
    if (n.wave === 'noise') {
      const s = c.createBufferSource()
      s.buffer = noiseBuffer(c)
      const f = c.createBiquadFilter()
      f.type = 'bandpass'; f.frequency.value = n.freq; f.Q.value = n.q ?? 1
      s.connect(f); f.connect(g)
      src = s
    } else {
      const o = c.createOscillator()
      o.type = n.wave
      o.frequency.setValueAtTime(n.freq, t)
      if (n.endFreq) o.frequency.exponentialRampToValueAtTime(n.endFreq, end)
      o.connect(g)
      src = o
    }
    // optional filters after the envelope: a high-pass against low mud, a low-pass to soften
    if (n.hp) { const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = n.hp; tail.connect(f); tail = f }
    if (n.lp) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = n.lp; tail.connect(f); tail = f }
    tail.connect(dest)
    if (wetDest && n.wet && n.wet > 0.001) { const w = c.createGain(); w.gain.value = n.wet; tail.connect(w); w.connect(wetDest) }
    src.onended = () => { try { src.disconnect(); g.disconnect() } catch { /* already gone */ } }
    src.start(t)
    src.stop(end + 0.05)
    started++
  }
  return started
}

function blocked(): boolean {
  if (typeof document !== 'undefined' && document.hidden) return true // quiet when the tab is in the background
  return speechIsActive() // never over the read-aloud voice
}

function start(id: SoundId): boolean {
  const c = unlockAudio()
  if (!c || !master || c.state !== 'running') return false
  master.gain.setTargetAtTime(prefs.volume * MASTER, c.currentTime, 0.01)
  return scheduleNotes(c, master, humanise(describeSound(id)), c.currentTime + 0.01, reverbBus(c, master)) > 0
}

/** Plays a sound if the learner's settings, the rate limit and the page allow it. Never throws. Returns whether anything was scheduled. */
export function playSound(id: SoundId): boolean {
  try {
    if (!prefs.on || !prefs[KIND_OF[id]]) return false
    if (blocked()) return false
    if (!limiter.allow(KIND_OF[id], Date.now())) return false
    return start(id)
  } catch { return false }
}

/** The Settings "Play a test sound" button: plays one sound even if sound is off, so the learner can hear the volume. */
export function playTestSound(): boolean {
  try { return start('right') } catch { return false }
}

/** Test hook: forget the context so a stand-in can be used. */
export function resetSoundEngine() { ctx = null; master = null; noise = null; reverb = null; wired = false; limiter = createLimiter() }
