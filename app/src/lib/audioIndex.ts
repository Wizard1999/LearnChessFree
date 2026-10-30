// Pre-recorded read-aloud. The recordings are made once at build time (tools/make_audio.py) and shipped as plain static files in
// public/audio/, listed in public/audio/index.json by a 12-hex SHA-1 of the exact spoken chunk. The learner's device only plays files:
// no service, no account, nothing sent anywhere. Pure logic lives here so it can be tested; readAloud.ts wires it to the page.

export interface AudioIndex { voice: string; files: Record<string, unknown> }

export function parseAudioIndex(json: unknown): AudioIndex | null {
  if (!json || typeof json !== 'object') return null
  const o = json as { voice?: unknown; files?: unknown }
  if (!o.files || typeof o.files !== 'object' || Array.isArray(o.files)) return null
  return { voice: typeof o.voice === 'string' ? o.voice : '', files: o.files as Record<string, unknown> }
}

export function audioBase(): string {
  const b = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? './'
  return b.endsWith('/') ? b : `${b}/`
}
export const audioFileUrl = (hash: string, base = audioBase()) => `${base}audio/${hash}.ogg`

let indexPromise: Promise<AudioIndex | null> | null = null
/** Loads the index once; null when it is missing or unreadable (the browser voice is used then). */
export function loadAudioIndex(fetchFn: typeof fetch = fetch, base = audioBase()): Promise<AudioIndex | null> {
  if (!indexPromise) {
    indexPromise = (async () => {
      try {
        const r = await fetchFn(`${base}audio/index.json`)
        if (!r.ok) return null
        return parseAudioIndex(await r.json())
      } catch { return null }
    })()
  }
  return indexPromise
}
export function resetAudioIndexForTests() { indexPromise = null }

/** First 12 hex characters of the SHA-1 of the UTF-8 text; null when SubtleCrypto is not available (insecure page, old browser). */
export async function hashChunk(text: string, subtle: SubtleCrypto | undefined = (typeof crypto !== 'undefined' ? crypto.subtle : undefined)): Promise<string | null> {
  if (!subtle) return null
  try {
    const buf = await subtle.digest('SHA-1', new TextEncoder().encode(text))
    return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('').slice(0, 12)
  } catch { return null }
}

/** Urls for every chunk, or null when any chunk has no recording (then the whole text uses the browser voice, never a mix). */
export async function planAudio(chunks: string[], index: AudioIndex | null, hash: (t: string) => Promise<string | null> = t => hashChunk(t)): Promise<string[] | null> {
  if (!index || chunks.length === 0) return null
  const urls: string[] = []
  for (const c of chunks) {
    const h = await hash(c)
    if (!h || !Object.prototype.hasOwnProperty.call(index.files, h)) return null
    urls.push(audioFileUrl(h))
  }
  return urls
}

/** The slice of HTMLAudioElement the queue uses (so tests can mock it). */
export interface AudioLike {
  src: string; playbackRate: number; preservesPitch?: boolean
  onended: ((ev: Event) => unknown) | null; onerror: ((ev: Event | string) => unknown) | null
  play(): Promise<void> | void; pause(): void
}

/** Plays urls one after another. Pause/resume keep the position; stop drops everything. */
export class AudioQueue {
  private k = 0
  private cur: AudioLike | null = null
  private dead = false
  private played = 0
  private urls: string[]
  private rate: number
  private make: () => AudioLike
  private cb: { onEnd: () => void; onError: (playedAny: boolean) => void }
  constructor(urls: string[], rate: number, make: () => AudioLike, cb: { onEnd: () => void; onError: (playedAny: boolean) => void }) {
    this.urls = urls; this.rate = rate; this.make = make; this.cb = cb
  }
  start() { this.next() }
  private next() {
    if (this.dead) return
    if (this.k >= this.urls.length) { this.dead = true; this.cb.onEnd(); return }
    const a = this.make()
    this.cur = a
    a.src = this.urls[this.k]
    a.playbackRate = this.rate
    a.preservesPitch = true
    const fail = () => { if (this.dead || this.cur !== a) return; this.stop(); this.cb.onError(this.played > 0) }
    a.onended = () => { if (this.cur !== a || this.dead) return; this.k++; this.played++; this.next() }
    a.onerror = fail
    try {
      const p = a.play()
      if (p && typeof (p as Promise<void>).catch === 'function') (p as Promise<void>).catch(fail)
    } catch { fail() }
  }
  pause() { this.cur?.pause() }
  resume() { const p = this.cur?.play(); if (p && typeof (p as Promise<void>).catch === 'function') (p as Promise<void>).catch(() => {}) }
  setRate(r: number) { this.rate = r; if (this.cur) this.cur.playbackRate = r }
  stop() {
    this.dead = true
    const a = this.cur
    this.cur = null
    if (a) { a.onended = null; a.onerror = null; try { a.pause() } catch { /* already gone */ } }
  }
}
