import { useEffect, useRef } from 'react'
import { useMissionData } from '../lib/useMissions'
import { playSound, useSoundPrefs, initSound, type SoundId } from '../lib/sound'
import type { Level } from '../lib/missions'

/** The sound for the best level a skill has just reached in a set of changes (Guided, Independent, Mastered), or null when none rose to one of those. Pure. */
export function levelUpSound(before: ReadonlyMap<string, Level>, after: ReadonlyMap<string, Level>): SoundId | null {
  let best = 0
  for (const [id, lv] of after) { const b = before.get(id); if (b !== undefined && lv > b && lv >= 2 && lv > best) best = lv }
  return best === 4 ? 'levelMastered' : best === 3 ? 'levelIndependent' : best === 2 ? 'levelGuided' : null
}

function Watch() {
  const { overall } = useMissionData()
  const nodes = overall.nodes
  const seen = useRef<Map<string, Level> | null>(null)
  useEffect(() => {
    if (nodes.length === 0) return
    const now = new Map<string, Level>(nodes.map(m => [m.id, m.level]))
    const was = seen.current
    seen.current = now
    // the first reading after page load only records where things stand: no sound until a level really changes during this visit
    if (!was) return
    const id = levelUpSound(was, now)
    if (id) playSound(id)
  }, [nodes])
  return null
}

/** Starts the audio engine's first-gesture unlock and listens for real level changes while reward sounds are on. Renders nothing. */
export function SoundEvents() {
  const p = useSoundPrefs()
  useEffect(() => { initSound() }, [])
  return p.on && p.rewards ? <Watch /> : null
}
