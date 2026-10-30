// Choosing the most natural browser voice. Browsers list many voices; the old robotic ones are first on some systems. A voice's name says a lot:
// "Natural", "Neural", "Premium", "Enhanced" and "Siri" voices are the modern ones; "Google" network voices are decent; "eSpeak" and plain
// "Microsoft David/Zira/Mark" desktop voices are the robotic ones. Ranking is a plain name rule, not a measurement of quality [H].
export interface VoiceLike { name: string; lang: string; localService?: boolean; voiceURI?: string }

export function voiceScore(v: VoiceLike, preferLang = 'en'): number {
  const n = v.name.toLowerCase()
  let s = 0
  if (v.lang.toLowerCase().startsWith(preferLang)) s += 100
  if (/natural|neural|premium|enhanced|siri|studio|wavenet/.test(n)) s += 60
  else if (/google/.test(n)) s += 30
  if (/espeak|festival|\bmbrola\b/.test(n)) s -= 80
  if (/microsoft (david|zira|mark|hazel|george|james|susan|catherine)\b(?!.*online)/.test(n) && !/online|natural/.test(n)) s -= 25
  if (/en-us|en-gb|en-au/.test(v.lang.toLowerCase())) s += 5
  return s
}

/** The best-ranked voice for the language; ties keep the browser's order. */
export function bestVoice<T extends VoiceLike>(voices: T[], preferLang = 'en'): T | undefined {
  let best: T | undefined, top = -Infinity
  for (const v of voices) { const s = voiceScore(v, preferLang); if (s > top) { top = s; best = v } }
  return best
}

/** Voices ordered best first, for the picker. */
export function rankedVoices<T extends VoiceLike>(voices: T[], preferLang = 'en'): T[] {
  return voices.map((v, i) => ({ v, i, s: voiceScore(v, preferLang) })).sort((a, b) => b.s - a.s || a.i - b.i).map(x => x.v)
}

/** A voice that is not on this device is processed by the browser maker's service. */
export const isOnline = (v: VoiceLike) => v.localService === false
