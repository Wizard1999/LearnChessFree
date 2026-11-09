// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { SoundToggle } from './SoundToggle'
import { SoundSettings } from './SoundSettings'
import { getSoundPrefs, resetSoundEngine, saveSoundPrefs } from '../lib/sound'

afterEach(() => { cleanup(); vi.unstubAllGlobals(); resetSoundEngine() })
beforeEach(() => { localStorage.clear(); saveSoundPrefs({ on: true, volume: 0.6, moves: true, rewards: true, feedback: true }) })

describe('SoundToggle', () => {
  it('is an icon-only button with a name and a pressed state that follow the setting', () => {
    render(<SoundToggle />)
    const b = screen.getByRole('button', { name: /sound on/i })
    expect(b.getAttribute('aria-pressed')).toBe('true')
    expect(b.textContent).toBe('')
    expect(b.querySelector('svg')).not.toBeNull()
    fireEvent.click(b)
    const off = screen.getByRole('button', { name: /sound off/i })
    expect(off.getAttribute('aria-pressed')).toBe('false')
    expect(getSoundPrefs().on).toBe(false)
  })
})

describe('SoundSettings', () => {
  it('says plainly that nothing is sent anywhere and has the controls', () => {
    render(<SoundSettings />)
    expect(document.body.textContent).toMatch(/nothing is downloaded or sent anywhere/)
    expect(screen.getByRole('checkbox', { name: /sound on/i })).toBeTruthy()
    expect(screen.getByRole('slider', { name: 'Volume' })).toBeTruthy()
    for (const re of [/piece moves/i, /right and wrong/i, /progress/i]) expect(screen.getByRole('checkbox', { name: re })).toBeTruthy()
  })
  it('turning a kind off is saved', () => {
    render(<SoundSettings />)
    fireEvent.click(screen.getByRole('checkbox', { name: /piece moves/i }))
    expect(getSoundPrefs().moves).toBe(false)
  })
  it('the test button asks the engine for a sound', () => {
    const created = vi.fn()
    const startSpy = vi.fn()
    const param = { value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, setTargetAtTime() {} }
    class Ctx {
      state = 'running'; currentTime = 0; sampleRate = 8000; destination = {}
      resume = async () => undefined
      constructor() { created() }
      createGain() { return { connect() {}, disconnect() {}, gain: param } }
      createOscillator() { return { connect() {}, disconnect() {}, frequency: param, start: startSpy, stop() {} } }
    }
    vi.stubGlobal('AudioContext', Ctx)
    render(<SoundSettings />)
    fireEvent.click(screen.getByRole('button', { name: /play a test sound/i }))
    expect(created).toHaveBeenCalled()
    expect(startSpy).toHaveBeenCalled()
  })
})
