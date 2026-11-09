import { NavLink } from 'react-router-dom'
import { Icon } from './Icon'
import { Tooltip } from './Tooltip'
import { btnClass } from './Button'

/** The header's Settings gear (desktop): an icon-only link to the Settings page, lit while that page is open. The phone header keeps its Settings button. */
export function SettingsLink() {
  return (
    <Tooltip label="Settings">
      <NavLink to="/settings" aria-label="Settings" className={({ isActive }) => btnClass('secondary', `btn-icon btn-md gearbtn${isActive ? ' on' : ''}`, isActive)}>
        <Icon name="settings" size={20} />
      </NavLink>
    </Tooltip>
  )
}
