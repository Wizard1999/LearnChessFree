// Concept icons (D89, docs/icons/README.md): a picture for a skill, only where Andrew approved both the art and the assignment. The lookup is built by
// tools/build_icons.py (app/public/icons/skill-icons.json); a skill that has none simply shows nothing.
import { useEffect, useState } from 'react'

export interface SkillIconInfo { icon: string; label: string; file: string; /** how many skills use this same picture */ shared: number }
type Table = Record<string, SkillIconInfo>

const base = import.meta.env.BASE_URL
let table: Promise<Table> | null = null
export const iconUrl = (file: string) => `${base}icons/${file}`
export function loadSkillIcons(): Promise<Table> {
  table ??= fetch(`${base}icons/skill-icons.json`).then(r => (r.ok ? (r.json() as Promise<Table>) : {})).catch(() => ({}))
  return table
}
export function useSkillIcons(): Table | null {
  const [t, setT] = useState<Table | null>(null)
  useEffect(() => { let live = true; void loadSkillIcons().then(v => { if (live) setT(v) }); return () => { live = false } }, [])
  return t
}
/** Lists show icons from Stage 3 on (stage ids S2 and later): the first two stages and the first game stay free of art (D55, D56, D89). */
export const stageShowsIcons = (stage?: string) => !!stage && Number(stage.slice(1)) >= 2
