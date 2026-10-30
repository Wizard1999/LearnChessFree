import { describe, expect, it } from 'vitest'
import { bestVoice, isOnline, rankedVoices } from './voices'

const V = (name: string, lang = 'en-US', localService = true) => ({ name, lang, localService })

describe('voice ranking', () => {
  it('prefers natural and neural voices over the old desktop voices', () => {
    const vs = [V('Microsoft David Desktop - English (United States)'), V('Microsoft Aria Online (Natural) - English (United States)', 'en-US', false), V('Microsoft Zira Desktop')]
    expect(bestVoice(vs)?.name).toContain('Natural')
  })
  it('prefers the right language first', () => {
    expect(bestVoice([V('Google Deutsch', 'de-DE'), V('Samantha', 'en-US')])?.name).toBe('Samantha')
  })
  it('puts espeak last and keeps ties in browser order', () => {
    const vs = [V('eSpeak English'), V('Alex'), V('Fred')]
    expect(rankedVoices(vs).map(v => v.name)).toEqual(['Alex', 'Fred', 'eSpeak English'])
  })
  it('knows which voices are online', () => {
    expect(isOnline(V('x', 'en', false))).toBe(true)
    expect(isOnline(V('x'))).toBe(false)
  })
})
