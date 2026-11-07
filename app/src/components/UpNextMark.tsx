// "Up next" is a colour, not a button (D46): the recommended skill, lesson, course or set carries a persimmon edge, and the words "Up next"
// appear on hover, focus or when the same skill is pointed at in another window. One component for every view, so it looks identical everywhere.
// With a skillId it joins the linked hover (lib/linkedHover.ts, D44): pointing at it highlights the same skill in every open window.
import { createElement, type HTMLAttributes, type ReactNode } from 'react'
import { linkedHoverHandlers, useLinkedHover } from '../lib/linkedHover'

export interface UpNextMarkProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  as?: 'div' | 'li' | 'section' | 'article'
  /** The skill this item stands for; omit for items that are not a skill (a practice set). */
  skillId?: string
  children?: ReactNode
}

export function UpNextMark({ as = 'div', skillId, className, children, ...rest }: UpNextMarkProps) {
  const linked = useLinkedHover()
  const handlers = skillId ? linkedHoverHandlers(skillId) : {}
  const cls = ['upnext-mark', skillId && linked === skillId ? 'linked' : '', className ?? ''].filter(Boolean).join(' ')
  // The label is real text (read by a screen reader in place); it is only shown to sighted users on hover, focus or linked hover.
  return createElement(as, { ...rest, ...handlers, className: cls, 'data-upnext': 'true' }, <span className="upnext-label">Up next</span>, children)
}
