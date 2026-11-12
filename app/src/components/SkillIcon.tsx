import { iconUrl, useSkillIcons } from '../lib/skillIcons'

const MIN_ICON = 32

/** The skill's concept icon beside its name. Decorative (the name is always written next to it); never below 32 px (smaller, the painted detail is lost); a picture shared by many skills is drawn a little smaller but still at least 32 px. */
export function SkillIcon({ skill, size = 40, className }: { skill: string; size?: number; className?: string }) {
  const t = useSkillIcons()
  const i = t?.[skill]
  if (!i) return null
  const px = Math.max(MIN_ICON, i.shared > 4 ? Math.round(size * 0.85) : size)
  return <img className={`skillicon${i.shared > 4 ? ' shared' : ''}${className ? ' ' + className : ''}`} src={iconUrl(i.file)} alt="" width={px} height={px} loading="lazy" decoding="async" draggable={false} />
}
