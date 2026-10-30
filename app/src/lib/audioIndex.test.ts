import { describe, expect, it, vi } from 'vitest'
import { AudioQueue, hashChunk, loadAudioIndex, parseAudioIndex, planAudio, resetAudioIndexForTests } from './audioIndex'
import type { AudioLike } from './audioIndex'
import { createHash } from 'node:crypto'

const index = parseAudioIndex({ voice: 'v', files: { abc: {}, def: {} } })!

describe('audio index', () => {
  it('parses and rejects junk', () => {
    expect(index.voice).toBe('v')
    expect(parseAudioIndex(null)).toBeNull()
    expect(parseAudioIndex({ files: [] })).toBeNull()
  })
  it('loads once and returns null on failure', async () => {
    resetAudioIndexForTests()
    const f = vi.fn(async () => ({ ok: true, json: async () => ({ voice: 'x', files: { a: {} } }) })) as unknown as typeof fetch
    const a = await loadAudioIndex(f, './'); const b = await loadAudioIndex(f, './')
    expect(a).toBe(b); expect(f).toHaveBeenCalledTimes(1)
    expect(f).toHaveBeenCalledWith('./audio/index.json')
    resetAudioIndexForTests()
    expect(await loadAudioIndex((async () => { throw new Error('x') }) as unknown as typeof fetch, './')).toBeNull()
    resetAudioIndexForTests()
    expect(await loadAudioIndex((async () => ({ ok: false })) as unknown as typeof fetch, './')).toBeNull()
    resetAudioIndexForTests()
  })
  it('hashes like the build tool (sha1, 12 hex)', async () => {
    const t = 'Knight takes e 5 check.'
    expect(await hashChunk(t, crypto.subtle)).toBe(createHash('sha1').update(t).digest('hex').slice(0, 12))
    expect(await hashChunk(t, null as unknown as SubtleCrypto)).toBeNull()
  })
})

describe('planAudio', () => {
  const map: Record<string, string> = { one: 'abc', two: 'def', three: 'zzz' }
  const h = async (t: string) => map[t] ?? null
  it('returns urls when every chunk is recorded', async () => {
    const u = await planAudio(['one', 'two'], index, h)
    expect(u).toHaveLength(2); expect(u![0]).toMatch(/audio\/abc\.ogg$/)
  })
  it('returns null (whole text uses the browser voice) when any chunk is missing, no index, no hash or no chunks', async () => {
    expect(await planAudio(['one', 'three'], index, h)).toBeNull()
    expect(await planAudio(['one'], null, h)).toBeNull()
    expect(await planAudio(['one'], index, async () => null)).toBeNull()
    expect(await planAudio([], index, h)).toBeNull()
  })
})

class FakeAudio implements AudioLike {
  src = ''; playbackRate = 1; preservesPitch = false
  onended: (() => void) | null = null; onerror: (() => void) | null = null
  paused = false; plays = 0
  play() { this.plays++; this.paused = false }
  pause() { this.paused = true }
}

describe('AudioQueue', () => {
  const setup = (urls: string[], rate = 1.25) => {
    const made: FakeAudio[] = []
    const cb = { onEnd: vi.fn(), onError: vi.fn() }
    const q = new AudioQueue(urls, rate, () => { const a = new FakeAudio(); made.push(a); return a }, cb)
    return { q, made, cb }
  }
  it('plays in order at the chosen speed and then ends', () => {
    const { q, made, cb } = setup(['a', 'b'])
    q.start()
    expect(made[0].src).toBe('a'); expect(made[0].playbackRate).toBe(1.25); expect(made[0].preservesPitch).toBe(true)
    made[0].onended!()
    expect(made[1].src).toBe('b')
    made[1].onended!()
    expect(cb.onEnd).toHaveBeenCalledTimes(1)
  })
  it('pauses and resumes the current chunk', () => {
    const { q, made } = setup(['a'])
    q.start(); q.pause(); expect(made[0].paused).toBe(true)
    q.resume(); expect(made[0].paused).toBe(false); expect(made[0].plays).toBe(2)
  })
  it('stop silences and ignores late events', () => {
    const { q, made, cb } = setup(['a', 'b'])
    q.start(); const first = made[0]; q.stop(); first.onended?.()
    expect(made).toHaveLength(1); expect(cb.onEnd).not.toHaveBeenCalled(); expect(first.paused).toBe(true)
  })
  it('reports errors, noting whether anything played', () => {
    const r1 = setup(['a']); r1.q.start(); r1.made[0].onerror!()
    expect(r1.cb.onError).toHaveBeenCalledWith(false)
    const r2 = setup(['a', 'b']); r2.q.start(); r2.made[0].onended!(); r2.made[1].onerror!()
    expect(r2.cb.onError).toHaveBeenCalledWith(true)
  })
  it('treats a rejected play() as an error', async () => {
    const cb = { onEnd: vi.fn(), onError: vi.fn() }
    const a = new FakeAudio(); a.play = () => Promise.reject(new Error('blocked')) as unknown as void
    new AudioQueue(['a'], 1, () => a, cb).start()
    await Promise.resolve(); await Promise.resolve()
    expect(cb.onError).toHaveBeenCalledWith(false)
  })
  it('changes speed mid-way', () => {
    const { q, made } = setup(['a']); q.start(); q.setRate(0.8); expect(made[0].playbackRate).toBe(0.8)
  })
})
