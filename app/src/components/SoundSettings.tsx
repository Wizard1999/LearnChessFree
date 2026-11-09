import { useState } from 'react'
import { Button } from './Button'
import { playTestSound, saveSoundPrefs, unlockAudio, useSoundPrefs } from '../lib/sound'

/** The Sound section of Settings. Saved on this device only. */
export function SoundSettings() {
  const p = useSoundPrefs()
  const [note, setNote] = useState('')
  const test = () => {
    unlockAudio()
    // the first call after a click can arrive just before the browser finishes starting audio, so try once more shortly after
    if (!playTestSound()) setTimeout(() => { setNote(playTestSound() ? '' : 'No sound could be played here. Your browser may be blocking audio or have the volume off.') }, 150)
    else setNote('')
  }
  return (
    <section className="card" aria-labelledby="sound-h">
      <h2 id="sound-h">Sound</h2>
      <p className="small muted">Small sounds for moves, answers and progress. They are made on your device as you go; nothing is downloaded or sent anywhere. Every sound also has something to read on screen, so nothing depends on hearing. Sound stays quiet while the read-aloud voice is speaking and while this tab is in the background.</p>
      <div className="soundrow">
        <label><input type="checkbox" checked={p.on} onChange={e => saveSoundPrefs({ on: e.target.checked })} /> Sound on</label>
        <label className="field"><span className="small muted">Volume: {Math.round(p.volume * 100)}%</span>
          <input type="range" min={0} max={1} step={0.05} value={p.volume} disabled={!p.on} aria-label="Volume" onChange={e => saveSoundPrefs({ volume: Number(e.target.value) })} /></label>
      </div>
      <fieldset className="appearance">
        <legend className="small muted">Which sounds</legend>
        <div className="soundrow">
          <label><input type="checkbox" checked={p.moves} disabled={!p.on} onChange={e => saveSoundPrefs({ moves: e.target.checked })} /> Piece moves (a soft tap; a bell for check)</label>
          <label><input type="checkbox" checked={p.feedback} disabled={!p.on} onChange={e => saveSoundPrefs({ feedback: e.target.checked })} /> Right and wrong answers</label>
          <label><input type="checkbox" checked={p.rewards} disabled={!p.on} onChange={e => saveSoundPrefs({ rewards: e.target.checked })} /> Progress (lessons, skill levels, challenge, first game)</label>
        </div>
      </fieldset>
      <div className="row"><Button onClick={test} icon="speaker">Play a test sound</Button></div>
      {note && <p className="small muted" role="status">{note}</p>}
    </section>
  )
}
