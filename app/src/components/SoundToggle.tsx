import { IconButton } from './Button'
import { playSound, saveSoundPrefs, unlockAudio, useSoundPrefs } from '../lib/sound'

/** The header's sound switch: an icon-only button, pressed while sound is on. The state is also in its name and its picture (speaker or crossed speaker). */
export function SoundToggle() {
  const p = useSoundPrefs()
  return (
    <IconButton
      className="soundbtn"
      icon={p.on ? 'speaker' : 'mute'}
      label={p.on ? 'Sound on: turn sound off' : 'Sound off: turn sound on'}
      pressed={p.on}
      onClick={() => { const next = !p.on; saveSoundPrefs({ on: next }); if (next) { unlockAudio(); playSound('right') } }}
    />
  )
}
