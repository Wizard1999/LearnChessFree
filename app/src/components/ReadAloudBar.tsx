import { pauseSpeech, resumeSpeech, savePrefs, stopSpeech, useSpeech } from '../lib/readAloud'

/** Lesson-header control for read-aloud. Renders nothing when the browser has no speech voices. */
export function ReadAloudBar() {
  const { prefs, available, playing } = useSpeech()
  if (!available) return null
  return (
    <div className="readaloud" role="group" aria-label="Read aloud">
      <button type="button" className={prefs.on ? 'chip on' : 'chip'} aria-pressed={prefs.on} onClick={() => savePrefs({ on: !prefs.on })}>
        {prefs.on ? 'Read aloud: on' : 'Read aloud'}
      </button>
      {prefs.on && (
        <>
          {playing === 'paused'
            ? <button type="button" className="small" onClick={resumeSpeech}>Resume</button>
            : <button type="button" className="small" onClick={pauseSpeech} disabled={playing !== 'speaking'}>Pause</button>}
          <button type="button" className="small" onClick={stopSpeech} disabled={playing === 'idle'}>Stop</button>
        </>
      )}
    </div>
  )
}
