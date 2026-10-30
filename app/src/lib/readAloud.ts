// Read-aloud with the browser's built-in speech synthesis: free, local, no service, nothing sent anywhere.
// Off by default. The choices (on/off, voice, speed) are kept per device in localStorage, guarded like the appearance settings.
import { bestVoice } from './voices'
import { useEffect, useSyncExternalStore } from 'react'
import { chunkForSpeech, speakable } from './speech'

export interface SpeechPrefs { on: boolean; voice: string; rate: number }
export const DEFAULT_SPEECH: SpeechPrefs = { on: false, voice: '', rate: 1 }
export const RATE_MIN = 0.6
export const RATE_MAX = 1.6
const KEY = 'cs-speech'

export function clampRate(r: unknown): number {
  const n = typeof r === 'number' && Number.isFinite(r) ? r : 1
  return Math.min(RATE_MAX, Math.max(RATE_MIN, n))
}

export function loadSpeechPrefs(): SpeechPrefs {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<SpeechPrefs>
    return { on: p.on === true, voice: typeof p.voice === 'string' ? p.voice : '', rate: clampRate(p.rate ?? 1) }
  } catch { return DEFAULT_SPEECH }
}

type Playing = 'idle' | 'speaking' | 'paused'
interface State { prefs: SpeechPrefs; voices: SpeechSynthesisVoice[]; playing: Playing }

const synth = (): SpeechSynthesis | null => (typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined' ? window.speechSynthesis : null)

let state: State = { prefs: loadSpeechPrefs(), voices: [], playing: 'idle' }
const listeners = new Set<() => void>()
function set(patch: Partial<State>) { state = { ...state, ...patch }; listeners.forEach(l => l()) }
function subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l) } }

let voicesWired = false
function readVoices() {
  const s = synth()
  if (!s) return
  const v = s.getVoices()
  if (v.length !== state.voices.length) set({ voices: v })
}
function wireVoices() {
  const s = synth()
  if (!s || voicesWired) return
  voicesWired = true
  readVoices()
  s.addEventListener?.('voiceschanged', readVoices)
}

export function savePrefs(patch: Partial<SpeechPrefs>) {
  const prefs = { ...state.prefs, ...patch, rate: clampRate(patch.rate ?? state.prefs.rate) }
  try { localStorage.setItem(KEY, JSON.stringify(prefs)) } catch { /* blocked storage: the choice lasts for this visit */ }
  set({ prefs })
  if (patch.on === false) stopSpeech()
}

let token = 0
export function stopSpeech() {
  token++
  const s = synth()
  if (s && (s.speaking || s.pending || s.paused)) s.cancel()
  if (state.playing !== 'idle') set({ playing: 'idle' })
}

export function pauseSpeech() { const s = synth(); if (s && state.playing === 'speaking') { s.pause(); set({ playing: 'paused' }) } }
export function resumeSpeech() { const s = synth(); if (s && state.playing === 'paused') { s.resume(); set({ playing: 'speaking' }) } }

/** Speak lesson text (markers stripped, notation expanded). Replaces anything already being spoken. Says nothing without a voice. */
export function speakText(raw: string) {
  const s = synth()
  if (!s || state.voices.length === 0) return
  stopSpeech()
  const chunks = chunkForSpeech(speakable(raw))
  if (chunks.length === 0) return
  const mine = token
  // the chosen voice, else the most natural English one the browser has (lib/voices.ts)
  const voice = state.voices.find(v => v.voiceURI === state.prefs.voice) ?? bestVoice(state.voices)
  chunks.forEach((c, k) => {
    const u = new SpeechSynthesisUtterance(c)
    if (voice) { u.voice = voice; u.lang = voice.lang }
    u.rate = state.prefs.rate
    const finish = () => { if (mine === token && k === chunks.length - 1) set({ playing: 'idle' }) }
    u.onend = finish
    u.onerror = finish
    s.speak(u)
  })
  set({ playing: 'speaking' })
}

export function useSpeech() {
  useEffect(wireVoices, [])
  const st = useSyncExternalStore(subscribe, () => state)
  return {
    ...st,
    /** Speech is offered only when the browser has it and at least one voice. */
    available: synth() !== null && st.voices.length > 0,
  }
}

/** Speak `text` whenever it changes while read-aloud is on; stop on change and on leaving. Pass '' to stay silent. */
export function useSpokenText(text: string, enabled = true) {
  const { prefs, available } = useSpeech()
  const on = enabled && prefs.on && available
  useEffect(() => {
    if (!on || !text) return
    speakText(text)
    return () => stopSpeech()
  }, [on, text])
}
