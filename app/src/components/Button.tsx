import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { Icon, type IconName } from './Icon'
import { Tooltip } from './Tooltip'

/** Visual roles. Words are required on primary, secondary and danger; quiet is a small outlined word button for tidy secondary actions. */
export type Variant = 'primary' | 'secondary' | 'quiet' | 'danger'

export const btnClass = (variant: Variant, extra = '', pressed?: boolean) => `btn btn-${variant}${pressed ? ' is-on' : ''}${extra ? ' ' + extra : ''}`

type Common = { variant?: Variant; icon?: IconName; tip?: string; shortcut?: string }

/** A word button (optionally with a leading icon). `tip` adds a tooltip that explains the action; the label stays the name. */
export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & Common & { children: ReactNode }>(
  function Button({ variant = 'secondary', icon, tip, shortcut, className, children, type = 'button', ...rest }, ref) {
    const b = (
      <button ref={ref} type={type} className={btnClass(variant, className, rest['aria-pressed'] === true || rest['aria-pressed'] === 'true')} aria-keyshortcuts={shortcut} {...rest}>
        {icon && <Icon name={icon} size={18} />}<span className="btn-label">{children}</span>
      </button>
    )
    return tip ? <Tooltip label={tip} shortcut={shortcut}>{b}</Tooltip> : b
  })

/** A symbol-only button. `label` is the accessible name and the tooltip text; `shortcut` shows the key where one exists. */
export const IconButton = forwardRef<HTMLButtonElement, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> & { icon: IconName; label: string; shortcut?: string; pressed?: boolean; variant?: Variant; size?: 'md' | 'lg' }>(
  function IconButton({ icon, label, shortcut, pressed, variant = 'secondary', size = 'md', className, type = 'button', ...rest }, ref) {
    return (
      <Tooltip label={label} shortcut={shortcut}>
        <button ref={ref} type={type} className={btnClass(variant, `btn-icon btn-${size}${className ? ' ' + className : ''}`, pressed)} aria-label={label} aria-pressed={pressed} aria-keyshortcuts={shortcut} {...rest}>
          <Icon name={icon} size={size === 'lg' ? 24 : 20} />
        </button>
      </Tooltip>
    )
  })

/** A router link drawn as a button (navigation that looks like an action, e.g. the Back bar). */
export function LinkButton({ variant = 'quiet', icon, className, children, ...rest }: LinkProps & Common & { children: ReactNode }) {
  return <Link className={btnClass(variant, className)} {...rest}>{icon && <Icon name={icon} size={18} />}<span className="btn-label">{children}</span></Link>
}
