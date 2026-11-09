import { useState } from 'react'
import { kvGet, kvSet } from '../db'
import type { Attempt } from '../db'
import { Icon } from './Icon'
import { Tooltip } from './Tooltip'
import { WarmupRun } from './WarmupRun'
import type { Mission } from '../lib/missions'
import type { Placement, StrandWarmup } from '../lib/progress'
import type { Item } from '../types'

/**
 * The section warm-up (test out what you know) on the Curriculum list (D76): a button, the last result in plain words, and the run itself.
 * It moved here from the Map's side panel. A conclusive result is saved with the placement under the section; a too-short one is shown, not saved.
 */
export function SectionWarmup({ mission, placement, items, attempts }: { mission: Mission; placement: Placement; items: Item[]; attempts: Attempt[] }) {
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState<StrandWarmup | null>(null)
  const saved = placement.byStrand?.[mission.strand]
  const w = done ?? saved

  async function finish(r: StrandWarmup) {
    if (r.conclusive !== false) {
      const cur = await kvGet<Placement>('placement', placement)
      await kvSet('placement', { ...cur, byStrand: { ...(cur.byStrand ?? {}), [mission.strand]: r } })
    }
    setDone(r); setRunning(false)
  }

  if (running) {
    return (
      <section className="card challenge" aria-label={`Warm-up: ${mission.name}`}>
        <h2>Warm-up: {mission.name}</h2>
        <WarmupRun mission={mission} items={items} attempts={attempts} onFinish={r => void finish(r)} onCancel={() => setRunning(false)} />
      </section>
    )
  }
  const shown = w ? Object.entries(w.byTier).map(([t, b]) => `tier ${t}: ${b.ok} of ${b.n}`).join(', ') : ''
  const superseded = !!w && !done && placement.done && !placement.skipped && placement.ts > w.ts // a newer placement replaced it (progress.ts frontierFor)
  const assumedHere = mission.nodes.filter(n => n.levelWithAssumed > n.level).length
  return (
    <section className="card">
      <h2>Warm-up: test out what you know</h2>
      {w ? (
        <p role="status">Taken {new Date(w.ts).toLocaleDateString()} ({shown}).{' '}
          {w.conclusive === false ? 'It was too short to vouch for any tier, so nothing was changed.'
            : superseded ? `A newer placement (${new Date(placement.ts).toLocaleDateString()}) replaced this result.`
            : assumedHere > 0 ? `${assumedHere} skills in tiers below ${w.frontierTier} show as assumed (hatched) until mixed practice and challenges confirm them. A wrong answer on something you had not practiced at that level was not held against you.`
            : 'Nothing in this section is assumed from it.'}</p>)
        : <p>About ten unlabeled exercises, easiest tier first, no hints. A wrong answer on something you have not practiced at that level is not held against you (once you have practiced it, every answer counts). It stops early if two tiers in a row go badly. If you do well, the early skills in this section show as assumed, and their lessons (except the tier just below the line) are left out of Continue; you can still open any lesson. Assumed skills are not counted as progress until you show them.</p>}
      <div className="row">
        <Tooltip label="Warm-up: test out what you already know in this section (no penalty on skills you have not practised)">
          <button type="button" className={`btn btn-icon btn-md ${w ? 'btn-secondary' : 'btn-primary'}`} aria-label={`Warm-up: test out ${mission.strand} ${mission.name}${w ? ' (take it again)' : ''}`} onClick={() => { setDone(null); setRunning(true) }}><Icon name="play" size={20} /></button>
        </Tooltip>
      </div>
    </section>
  )
}
