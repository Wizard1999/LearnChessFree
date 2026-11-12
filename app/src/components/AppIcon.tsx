import { iconUrl, useSkillIcons } from '../lib/skillIcons'

/** A picture for a part of the school itself (Practice, Review, a reward), not a skill; see APP_ICONS in tools/build_icons.py. Decorative: the name is always written beside it. */
export function AppIcon({ name, size = 40, className }: { name: string; size?: number; className?: string }) {
  const i = useSkillIcons()?.[`app:${name}`]
  if (!i) return null
  const px = Math.max(32, size)
  return <img className={`skillicon${className ? ' ' + className : ''}`} src={iconUrl(i.file)} alt="" width={px} height={px} loading="lazy" decoding="async" draggable={false} />
}
