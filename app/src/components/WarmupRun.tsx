import { useMemo, useState } from 'react'
import { ItemPlayer, type ItemResult } from './ItemPlayer'
import type { Attempt } from '../db'
import type { Mission } from '../lib/missions'
import type { StrandWarmup } from '../lib/progress'
import { concludeWarmup, planWarmup, plannedPerTier, shouldStop, type TierResult } from '../lib/warmup'
import type { Item } from '../types'

/** The warm-up questions for one mission, one at a time, silent and unpenalized; stops early when two tiers in a row go badly. */
export function WarmupRun({ mission, items, attempts, onFinish, onCancel }: { mission: Mission; items: Item[]; attempts: Attempt[]; onFinish: (r: StrandWarmup) => void; onCancel: () => void }) {
  const [seed] = useState(() => String(Date.now()))
  // The plan is fixed when the warm-up starts. Each answer adds an attempt, and re-planning from the new attempts would shift the questions under the index.
  const [plan] = useState(() => planWarmup(mission, items, attempts, seed))
  const planned = useMemo(() => plannedPerTier(plan), [plan])
  const [idx, setIdx] = useState(0)
  const [results, setResults] = useState<TierResult[]>([])
  if (plan.items.length === 0) return <div><p className="muted">There are no unlabeled exercises in this section yet, so a warm-up is not possible.</p><button type="button" onClick={onCancel}>Back</button></div>
  const it = plan.items[idx]
  const done = (r: ItemResult) => {
    const next = [...results, { tier: plan.tierOf.get(it.id) ?? 0, ok: r.correct }]
    setResults(next)
    if (idx + 1 >= plan.items.length || shouldStop(next, planned)) onFinish(concludeWarmup(next, Date.now()))
    else setIdx(idx + 1)
  }
  return (
    <div>
      <p className="muted small">Warm-up · exercise {idx + 1} of up to {plan.items.length}. No hints. A wrong answer on something you have not practiced at that level is not held against you; once you have practiced it, every answer counts.</p>
      <ItemPlayer key={it.id} item={it} source="warmup" silent nextLabel={idx + 1 >= plan.items.length ? 'See result' : 'Next exercise'} onDone={done} />
      <div className="row">
        {results.length >= 3 && <button type="button" onClick={() => onFinish(concludeWarmup(results, Date.now()))}>Stop here and use my answers so far</button>}
        <button type="button" onClick={onCancel}>Leave the warm-up</button>
      </div>
    </div>
  )
}
