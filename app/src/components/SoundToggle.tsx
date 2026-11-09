import { Icon } from './Icon'
import { Tooltip } from './Tooltip'
import { btnClass } from './Button'
import { playSound, saveSoundPrefs, unlockAudio, useSoundPrefs } from '../lib/sound'

/** The header's sound switch: an icon-only button, pressed while sound is on. The state is in its name and its picture (speaker or crossed speaker); the tooltip also says where the rest of the sound options are. */
export function SoundToggle() {
  const p = useSoundPrefs()
  const name = p.on ? 'Sound on: turn sound off' : 'Sound off: turn sound on'
  return (
    <Tooltip label={`${name}. Sound settings are in Settings.`}>
      <button type="button" className={btnClass('secondary', 'btn-icon btn-md soundbtn', p.on)} aria-label={name} aria-pressed={p.on}
        onClick={() => { const next = !p.on; saveSoundPrefs({ on: next }); if (next) { unlockAudio(); playSound('right') } }}>
        <Icon name={p.on ? 'speaker' : 'mute'} size={20} />
      </button>
    </Tooltip>
  )
}
