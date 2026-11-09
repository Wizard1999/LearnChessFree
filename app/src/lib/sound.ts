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
}

const note = (n: Partial<Note> & Pick<Note, 'freq' | 'start' | 'dur' | 'gain'>): Note => ({ wave: 'sine', env: 'decay', attack: 0.008, release: 0.04, ...n })

/** A struck bell or glass chime: the pitch plus two quiet, shorter overtones. */
export function bell(freq: number, start: number, dur: number, gain: number): Note[] {
  return [
    note({ freq, start, dur, gain }),
    note({ freq: freq * 2, start, dur: dur * 0.6, gain: gain * 0.28 }),
    note({ freq: freq * 2.76, start, dur: dur * 0.25, gain: gain * 0.1 }),
  ]
}
/** A soft wooden tap: a short filtered noise burst on top of a low thud. `depth` below 1 is deeper. */
export function tap(start: number, depth: number, gain: number): Note[] {
  return [
    note({ wave: 'noise', freq: 1100 * depth, start, dur: 0.05, gain: gain * 0.9, q: 0.9, attack: 0.002, release: 0.03 }),
    note({ freq: 190 * depth, endFreq: 110 * depth, start, dur: 0.11, gain, attack: 0.003, release: 0.05 }),
  ]
}

// Pitches (equal temperament, A4 = 440), from a major pentatonic so any two can sound together.
const G4 = 392, C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880, C6 = 1046.5, E6 = 1318.5, G6 = 1568

const DESCRIPTORS: Record<SoundId, () => Note[]> = {
  move: () => tap(0, 1, 0.3),
  capture: () => [...tap(0, 0.8, 0.3), ...tap(0.045, 0.7, 0.1)],
  check: () => [...tap(0, 1, 0.22), ...bell(A5, 0.03, 0.55, 0.16)],
  castle: () => [...tap(0, 1, 0.26), ...tap(0.11, 0.85, 0.3)],
  promote: () => [...bell(G5, 0, 0.35, 0.16), ...bell(C6, 0.09, 0.35, 0.16), ...bell(E6, 0.18, 0.55, 0.15)],
  right: () => [...bell(G5, 0, 0.3, 0.2), ...bell(C6, 0.11, 0.55, 0.2)],
  // soft, neutral, low: a single quiet note, never a buzzer and never falling in a mocking way
  wrong: () => [note({ wave: 'triangle', freq: 196, start: 0, dur: 0.38, gain: 0.2, attack: 0.02, release: 0.1 })],
  lessonDone: () => [...bell(C5, 0, 0.6, 0.18), ...bell(E5, 0.17, 0.6, 0.18), ...bell(G5, 0.34, 0.8, 0.2)],
  levelGuided: () => bell(G5, 0, 0.8, 0.22),
  levelIndependent: () => [...bell(C6, 0, 0.9, 0.2), ...bell(G5, 0, 0.9, 0.1)],
  levelMastered: () => [...bell(C5, 0, 0.7, 0.16), ...bell(E5, 0.1, 0.7, 0.16), ...bell(G5, 0.2, 0.8, 0.16), ...bell(C6, 0.3, 0.85, 0.18)],
  challengePassed: () => [
    ...bell(G4, 0, 0.3, 0.17), ...bell(C5, 0.12, 0.3, 0.17), ...bell(E5, 0.24, 0.3, 0.17),
    ...bell(G5, 0.38, 0.8, 0.2), ...bell(C6, 0.38, 0.8, 0.12),
  ],
  firstGame: () => [
    ...bell(C5, 0, 0.7, 0.16), ...bell(G5, 0.2, 0.7, 0.16), ...bell(E5, 0.4, 0.7, 0.16), ...bell(C6, 0.6, 0.9, 0.17),
    ...bell(D5, 1.05, 0.6, 0.09), ...bell(G5, 1.05, 0.6, 0.09), ...bell(G6, 1.25, 1.2, 0.12),
    ...bell(C5, 1.25, 1.2, 0.08), ...bell(E6, 1.25, 1.2, 0.08),
  ],
}

/** The notes of a sound. */
export function describeSound(id: SoundId): Note[] { return DESCRIPTORS[id]() }
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
export interface SoundPrefs { on: boolean; volume: number; moves: boolean; rewards: boolean; feedback: boolean }
export const DEFAULT_SOUND: SoundPrefs = { on: true, volume: 0.6, moves: true, rewards: true, feedback: true }
const KEY = 'cs-sound'
export const clampVolume = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : DEFAULT_SOUND.volume)
const bool = (v: unknown, d: boolean) => (typeof v === 'boolean' ? v : d)

export function loadSoundPrefs(): SoundPrefs {
  try {
    const r = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<Record<string, unknown>> | null
    const p = r && typeof r === 'object' ? r : {}
    return { on: bool(p.on, true), volume: clampVolume(p.volume), moves: bool(p.moves, true), rewards: bool(p.rewards, true), feedback: bool(p.feedback, true) }
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
      master.connect(ctx.destination)
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

/** Schedules notes on a context starting at `t0` into `dest`. Returns how many sources were started. Exported so a test can pass a stand-in context. */
export function scheduleNotes(c: AudioContext, dest: AudioNode, notes: readonly Note[], t0: number): number {
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
    g.connect(dest)
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
  return scheduleNotes(c, master, describeSound(id), c.currentTime + 0.01) > 0
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
export function resetSoundEngine() { ctx = null; master = null; noise = null; wired = false; limiter = createLimiter() }
