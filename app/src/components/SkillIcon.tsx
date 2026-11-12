import { iconUrl, useSkillIcons } from '../lib/skillIcons'

/** The skill's concept icon beside its name. Decorative (the name is always written next to it); a picture shared by many skills is drawn smaller. */
export function SkillIcon({ skill, size = 28, className }: { skill: string; size?: number; className?: string }) {
  const t = useSkillIcons()
  const i = t?.[skill]
  if (!i) return null
  const px = i.shared > 4 ? Math.round(size * 0.78) : size
  return <img className={`skillicon${i.shared > 4 ? ' shared' : ''}${className ? ' ' + className : ''}`} src={iconUrl(i.file)} alt="" width={px} height={px} loading="lazy" decoding="async" draggable={false} />
}
