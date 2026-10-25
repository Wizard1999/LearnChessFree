import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { kvGet, kvSet } from '../db'
import { useContent } from '../lib/content'
import { useAttempts } from '../lib/progress'
import { pickFresh } from '../lib/select'
import { ItemSequence } from '../components/LessonPlayer'
import type { Item } from '../types'

interface Plan {
  id: string; created: number
  focus: string        // skill key, e.g. TAC.FORK.D2
  goal: string         // in the learner's words
  days: number
  activities: string   // what the learner will do
  successLooksLike: string
  baseline?: { ts: number; ok: number; n: number; itemIds: string[] }
  check?: { ts: number; ok: number; n: number }
  decision?: string
}

// Wilson 95% interval for a proportion: honest about how little a handful of items shows.
function wilson(ok: number, n: number): [number, number] {
  if (n === 0) return [0, 1]
  const z = 1.96, p = ok / n, d = 1 + (z * z) / n
  const c = p + (z * z) / (2 * n), r = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))
  return [Math.max(0, (c - r) / d), Math.min(1, (c + r) / d)]
}
const pc = (x: number) => `${Math.round(x * 100)}%`

export function PlanPage() {
  const content = useContent()
  const attempts = useAttempts()
  const [plans, setPlans] = useState<Plan[]>([])
  const [mode, setMode] = useState<{ plan: string; kind: 'baseline' | 'check' } | null>(null)
  const [draft, setDraft] = useState({ focus: '', goal: '', days: 14, activities: '', successLooksLike: '' })

  useEffect(() => { void kvGet<Plan[]>('plans', []).then(setPlans) }, [])
  const save = async (next: Plan[]) => { setPlans(next); await kvSet('plans', next) }
  const skillKeys = useMemo(() => [...new Set(content.items.filter(i => i.cue >= 3).map(i => i.skill))].sort(), [content.items])

  const active = mode ? plans.find(p => p.id === mode.plan) : undefined
  const testItems = useMemo<Item[]>(() => {
    if (!mode || !active || !attempts) return []
    const pool = content.items.filter(i => i.skill === active.focus && i.cue >= 3)
    const exclude = new Set(mode.kind === 'check' ? active.baseline?.itemIds ?? [] : [])
    // families already used at baseline are excluded too, so the check measures transfer to new positions, not memory
    const baseFamilies = new Set((active.baseline?.itemIds ?? []).map(id => content.itemById.get(id)?.family))
    const filtered = mode.kind === 'check' ? pool.filter(i => !exclude.has(i.id) && !baseFamilies.has(i.family)) : pool
    return pickFresh(filtered, attempts, 8, `plan:${active.id}:${mode.kind}`)
  }, [mode, active, attempts, content])

  if (mode && active) {
    return (
      <main className="page">
        <h1>{mode.kind === 'baseline' ? 'Baseline' : 'Check'}: {active.focus}</h1>
        <p className="muted small">{mode.kind === 'baseline' ? 'Silent: no hints. This records where you start so the later check means something.' : 'Silent again, on positions you have not seen. If you improved, it should show here.'}</p>
        <ItemSequence items={testItems} source="practice" silent intro={mode.kind} onComplete={async r => {
          const ok = r.filter(x => x.correct).length
          const next = plans.map(p => p.id !== active.id ? p : mode.kind === 'baseline' ? { ...p, baseline: { ts: Date.now(), ok, n: r.length, itemIds: testItems.map(i => i.id) } } : { ...p, check: { ts: Date.now(), ok, n: r.length } })
          await save(next); setMode(null)
        }} />
      </main>
    )
  }

  return (
    <main className="page">
      <h1>My training plan</h1>
      <p className="lede">This is where you take charge. Pick something you want to get better at, say what you will do, measure where you start, train, and check again on positions you have not seen. The point is to learn what works <em>for you</em>, including finding out that a plan did not work.</p>
      {plans.map(p => {
        const dueTs = p.baseline ? p.baseline.ts + p.days * 86400000 : null
        const dueIn = dueTs ? Math.ceil((dueTs - Date.now()) / 86400000) : null
        return (
          <section className="card" key={p.id}>
            <h2>{p.goal || p.focus}</h2>
            <p className="small muted">Focus: {p.focus} · {p.days} days · started {new Date(p.created).toLocaleDateString()}</p>
            <p><strong>What I will do:</strong> {p.activities || '—'}</p>
            <p><strong>Success would look like:</strong> {p.successLooksLike || '—'}</p>
            <ol className="plain">
              <li>1. Baseline: {p.baseline ? <>done, {p.baseline.ok} of {p.baseline.n} right (rough range {pc(wilson(p.baseline.ok, p.baseline.n)[0])} to {pc(wilson(p.baseline.ok, p.baseline.n)[1])})</> : <button type="button" className="primary" onClick={() => setMode({ plan: p.id, kind: 'baseline' })}>Take the baseline</button>}</li>
              <li>2. Train: {p.baseline ? <>do your plan. {dueIn !== null && (dueIn > 0 ? `Check in about ${dueIn} day${dueIn === 1 ? '' : 's'}.` : 'It is time to check.')} Useful starting points: <Link to={`/practice?skill=${p.focus}&go=1&n=8`}>practice this skill</Link>, <Link to="/course">the lessons</Link>, <Link to="/games">review a game</Link>.</> : 'after the baseline'}</li>
              <li>3. Check on unseen positions: {p.baseline && !p.check ? <button type="button" className="primary" onClick={() => setMode({ plan: p.id, kind: 'check' })}>Run the check</button> : p.check ? <>{p.check.ok} of {p.check.n} right (rough range {pc(wilson(p.check.ok, p.check.n)[0])} to {pc(wilson(p.check.ok, p.check.n)[1])})</> : 'after training'}</li>
            </ol>
            {p.baseline && p.check && (
              <>
                <p>{p.check.ok / p.check.n > p.baseline.ok / p.baseline.n ? 'Your score went up.' : p.check.ok / p.check.n < p.baseline.ok / p.baseline.n ? 'Your score went down.' : 'Your score did not change.'} With only {p.baseline.n} and {p.check.n} positions the ranges overlap a lot, so this is a hint, not proof. What you did and how it felt matter as much as the number.</p>
                <label className="field"><span className="small muted">What will you do next: continue, adjust, or replace this plan? Why?</span>
                  <textarea rows={2} defaultValue={p.decision ?? ''} onBlur={e => void save(plans.map(x => x.id === p.id ? { ...x, decision: e.target.value } : x))} /></label>
              </>
            )}
            <div className="row"><button type="button" onClick={() => void save(plans.filter(x => x.id !== p.id))}>Delete plan</button></div>
          </section>
        )
      })}
      <section className="card">
        <h2>Start a new plan</h2>
        <label className="field"><span className="small muted">Skill to work on</span>
          <select value={draft.focus} onChange={e => setDraft({ ...draft, focus: e.target.value })}><option value="">Choose…</option>{skillKeys.map(k => <option key={k} value={k}>{content.skillById.get(k.slice(0, k.lastIndexOf('.')))?.title ?? k} ({k.slice(k.lastIndexOf('.') + 1)})</option>)}</select></label>
        <label className="field"><span className="small muted">Your goal, in your words</span><input type="text" value={draft.goal} onChange={e => setDraft({ ...draft, goal: e.target.value })} placeholder="e.g. Stop missing forks in my games" /></label>
        <label className="field"><span className="small muted">What will you do, and how often?</span><textarea rows={2} value={draft.activities} onChange={e => setDraft({ ...draft, activities: e.target.value })} placeholder="e.g. 10 minutes of silent practice on 4 days a week and one game review" /></label>
        <label className="field"><span className="small muted">What would tell you it worked?</span><input type="text" value={draft.successLooksLike} onChange={e => setDraft({ ...draft, successLooksLike: e.target.value })} /></label>
        <label className="field"><span className="small muted">Days before the check</span><select value={draft.days} onChange={e => setDraft({ ...draft, days: Number(e.target.value) })}>{[7, 14, 21, 28].map(d => <option key={d} value={d}>{d}</option>)}</select></label>
        <div className="row"><button type="button" className="primary" disabled={!draft.focus} onClick={async () => { await save([{ id: String(Date.now()), created: Date.now(), ...draft }, ...plans]); setDraft({ focus: '', goal: '', days: 14, activities: '', successLooksLike: '' }) }}>Create plan</button></div>
        <p className="muted small">Early on, the system suggests plans and you can just follow them. As you get more independent, this page is where you lead and the system checks your reasoning.</p>
      </section>
    </main>
  )
}
