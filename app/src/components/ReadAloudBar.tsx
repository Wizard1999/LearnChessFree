import { Button, IconButton } from './Button'
import { pauseSpeech, resumeSpeech, savePrefs, stopSpeech, useSpeech } from '../lib/readAloud'

/** Lesson-header control for read-aloud. Renders nothing when the browser has no speech voices. */
export function ReadAloudBar() {
  const { prefs, available, playing, source } = useSpeech()
  if (!available) return null
  return (
    <div className="readaloud" role="group" aria-label="Read aloud">
      <Button icon="speaker" aria-pressed={prefs.on} tip="Have each step read to you" onClick={() => savePrefs({ on: !prefs.on })}>
        {prefs.on ? 'Read aloud: on' : 'Read aloud'}
      </Button>
      {prefs.on && (
        <>
          {playing === 'paused'
            ? <IconButton icon="play" label="Resume reading" onClick={resumeSpeech} />
            : <IconButton icon="pause" label="Pause reading" onClick={pauseSpeech} disabled={playing !== 'speaking'} />}
          <IconButton icon="stop" label="Stop reading" onClick={stopSpeech} disabled={playing === 'idle'} />
        </>
      )}
      {prefs.on && source === 'browser' && playing !== 'idle' && <span className="voicenote" role="status">Voice: your browser's built-in voice, not the recorded one.</span>}
    </div>
  )
}
