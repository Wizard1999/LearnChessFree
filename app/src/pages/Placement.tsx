import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../lib/content'
import { useAttempts, usePlacement, type Placement as PlacementT } from '../lib/progress'
import { shuffled } from '../lib/select'
import { ItemPlayer, type ItemResult } from '../components/ItemPlayer'
import { kvSet } from '../db'
import type { Item } from '../types'

const PER_TIER = 5
const MAX_TIER = 4

export function Placement() {
  const content = useContent()
  const attempts = useAttempts()
  const existing = usePlacement()
  const [seed] = useState(() => String(Date.now()))
  const [idx, setIdx] = useState(0)
  const [results, setResults] = useState<{ tier: number; ok: boolean }[]>([])
  const [outcome, setOutcome] = useState<PlacementT | null>(null)
  const [started, setStarted] = useState(false)

  const tierOf = (i: Item): number => {
    const t = (i.tags ?? []).find(x => x.startsWith('tier.'))
    if (t) return Number(t.slice(5))
    return content.skillById.get(i.skill.slice(0, i.skill.lastIndexOf('.')))?.tier ?? 9
  }
  const plan = useMemo(() => {
    const out: Item[] = []
    for (let t = 0; t <= MAX_TIER; t++) {
      const pool = content.items.filter(i => i.cue >= 3 && tierOf(i) === t)
      const seen = new Set<string>(); const picks: Item[] = []
      for (const it of shuffled(pool, `${seed}:${t}`)) { if (seen.has(it.family)) continue; seen.add(it.family); picks.push(it); if (picks.length >= PER_TIER) break }
      out.push(...picks)
    }
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.items, seed])

  function conclude(rs: { tier: number; ok: boolean }[]) {
    const byTier: PlacementT['byTier'] = {}
    for (const r of rs) { const b = byTier[r.tier] ?? { n: 0, ok: 0 }; b.n++; if (r.ok) b.ok++; byTier[r.tier] = b }
    let frontier = 0
    for (let t = 0; t <= MAX_TIER; t++) {
      const b = byTier[t]
      if (!b || b.n === 0) break
      if (b.ok / b.n >= 0.67) frontier = t + 1
      else break
    }
    const p: PlacementT = { ...(existing ?? {}), done: true, frontierTier: Math.min(frontier, MAX_TIER), ts: Date.now(), byTier }
    void kvSet('placement', p)
    setOutcome(p)
  }

  function skip() {
    const p: PlacementT = { ...(existing ?? {}), done: true, frontierTier: 0, ts: Date.now(), byTier: {}, skipped: true }
    void kvSet('placement', p)
    setOutcome(p)
  }

  function onDone(r: ItemResult) {
    const it = plan[idx]
    const rs = [...results, { tier: tierOf(it), ok: r.correct }]
    setResults(rs)
    const tier = tierOf(it)
    const tierDone = rs.filter(x => x.tier === tier).length >= Math.min(PER_TIER, plan.filter(p => tierOf(p) === tier).length)
    const prevTierOk = (() => { const prev = rs.filter(x => x.tier === tier - 1); return prev.length === 0 || prev.filter(x => x.ok).length / prev.length >= 0.5 })()
    const thisOk = rs.filter(x => x.tier === tier).filter(x => x.ok).length / rs.filter(x => x.tier === tier).length
    // stop early after two weak tiers in a row (nothing is gained by showing harder positions)
    if ((tierDone && thisOk < 0.5 && !prevTierOk) || idx + 1 >= plan.length) conclude(rs)
    else setIdx(idx + 1)
  }

  if (!started && !outcome) return (
    <main className="page">
      <h1>Placement</h1>
      <section className="card">
        <p className="lede">About 15 minutes. You will see positions from easy to harder levels. <strong>Nothing tells you which idea applies</strong>, and some positions have no tactic. Please do not use outside help; the point is to learn what you can do on your own.</p>
        <ul><li>Hints are off during placement.</li><li>You can stop at any time; a short placement still helps.</li><li>Placement does not mark anything as mastered. It only skips the order of lessons you probably do not need, and you can always open any lesson from the Course page.</li></ul>
        {existing?.done && <p className="muted small">Last placement: highest comfortable tier {existing.frontierTier} ({new Date(existing.ts).toLocaleDateString()}). Taking it again is fine.</p>}
        {plan.length === 0 && <p className="warn">There are not enough unlabeled exercises in the content yet to run a placement. Try again after more content is built.</p>}
        <div className="row">
          <button type="button" className="primary" disabled={plan.length === 0} onClick={() => setStarted(true)}>Begin ({plan.length} positions)</button>
          <button type="button" onClick={skip}>Skip the placement</button>
        </div>
        <p className="muted small">New to chess, or just not in the mood for a test? Skipping is fine. Nothing is assumed about what you know, and the course starts from the beginning. You can take the placement later from the Course page.</p>
      </section>
    </main>
  )

  if (outcome) return (
    <main className="page">
      <h1>Placement result</h1>
      <section className="card">
        {outcome.skipped ? (
          <p>You skipped the placement. Nothing is assumed: the course starts from the beginning, and the daily plan will pick lessons and practice for you. If you find the early lessons easy, take the placement later and the app will skip ahead.</p>
        ) : (
          <>
            <p>Your comfortable level is <strong>tier {outcome.frontierTier}</strong>. Lessons below that tier are marked <em>assumed</em>, not mastered, and will be tested by mixed practice instead of taught again.</p>
            <table className="table"><thead><tr><th>Tier</th><th>Right</th><th>Shown</th></tr></thead>
              <tbody>{Object.entries(outcome.byTier).map(([t, b]) => <tr key={t}><td>{t}</td><td>{b.ok}</td><td>{b.n}</td></tr>)}</tbody></table>
            <p className="muted small">This is a rough starting point from a handful of positions, not a rating. {(attempts?.length ?? 0) > 0 ? '' : 'Your history starts here.'}</p>
          </>
        )}
        <div className="row"><Link className="button primary" to="/">See today's plan</Link><Link className="button" to="/course">Open the course map</Link></div>
      </section>
    </main>
  )

  const it = plan[idx]
  return (
    <main className="page">
      <h1>Placement</h1>
      <p className="muted small">Position {idx + 1} of up to {plan.length}</p>
      <ItemPlayer key={it.id} item={it} source="placement" silent nextLabel={idx + 1 >= plan.length ? 'See result' : 'Next position'} onDone={onDone} />
      <div className="row">
        {results.length >= 3 && <button type="button" onClick={() => conclude(results)}>Stop here and use my answers so far</button>}
        <button type="button" onClick={skip}>These are too hard: skip the placement</button>
      </div>
    </main>
  )
}
