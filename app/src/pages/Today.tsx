import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../lib/content'
import { independence, masteryMap, useAttempts, useLessonProgress, usePlacement, NO_PLACEMENT } from '../lib/progress'
import { buildDaily, dateKey, NO_EXTRAS, type Block, type Extras } from '../lib/daily'
import { ItemSequence, LessonPlayer, RichText } from '../components/LessonPlayer'
import { db, kvGet, kvSet } from '../db'
import { describeMastery } from '../lib/mastery'
import { buildCards, dueCards, type DrillState, type RepLine } from '../lib/drill'

export function Today() {
  const content = useContent()
  const attempts = useAttempts()
  const progress = useLessonProgress()
  const placementQ = usePlacement()
  const day = dateKey()
  const [doneIds, setDoneIds] = useState<string[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [extras, setExtras] = useState<Extras>(NO_EXTRAS)
  const [intention, setIntention] = useState<string | null | undefined>(undefined) // undefined = loading, '' = not set yet, null = skipped
  const [draft, setDraft] = useState('')
  useEffect(() => { void kvGet<string[]>(`daily:${day}:done`, []).then(setDoneIds) }, [day])
  useEffect(() => { void kvGet<string | null>(`daily:${day}:intention`, '').then(v => setIntention(v)) }, [day])
  useEffect(() => {
    void (async () => {
      const plans = await kvGet<{ created: number; days: number; baseline?: { ts: number }; check?: unknown }[]>('plans', [])
      const games = await db.games.toArray()
      const labUses = await db.reflections.where('kind').equals('lab').count()
      const rep = await kvGet<Record<string, RepLine>>('repertoire', {})
      const drillState = await kvGet<Record<string, DrillState>>('drill', {})
      const repDue = dueCards(buildCards(rep), drillState).length
      setExtras({
        plans: plans.map(p => ({ created: p.created, checked: !!p.check, due: !!p.baseline && Date.now() >= p.baseline.ts + p.days * 86400000 })),
        games: games.length, analysedGames: games.filter(g => g.analysis).length, labUses, hasPlan: plans.length > 0, repDue,
      })
    })()
  }, [])

  const placement = placementQ ?? NO_PLACEMENT
  const ready = attempts !== undefined && progress !== undefined && placementQ !== undefined
  const blocks = useMemo<Block[]>(() => ready ? buildDaily(content, attempts, placement, progress, day, extras) : [], [ready, content, attempts, placement, progress, day, extras])
  const ind = useMemo(() => independence(attempts ?? []), [attempts])
  const masteries = useMemo(() => masteryMap(attempts ?? []), [attempts])

  async function saveIntention(text: string | null) {
    setIntention(text); await kvSet(`daily:${day}:intention`, text)
    if (text) await db.reflections.add({ kind: 'intention', data: { text }, ts: Date.now() })
  }
  async function complete(id: string) {
    const next = [...new Set([...doneIds, id])]
    setDoneIds(next); setActive(null); await kvSet(`daily:${day}:done`, next)
  }
  if (!ready) return <main className="page"><p className="muted">Loading…</p></main>

  const activeBlock = blocks.find(b => b.id === active)
  const learning = [...masteries.entries()].filter(([, m]) => m.state !== 'unseen').sort((a, b) => b[1].n - a[1].n).slice(0, 6)

  return (
    <main className="page">
      <h1>Today</h1>
      {!activeBlock && (
        <>
          {(attempts ?? []).length === 0 && !placement.done && (
            <section className="card welcome">
              <h2>Welcome. How this school works</h2>
              <ul className="small">
                <li><strong>Test first, then learn.</strong> Most practice here does not tell you which idea to use, because in a real game nobody does. Lessons come with labelled examples; practice does not.</li>
                <li><strong>Help is allowed and counted.</strong> Hints and prompts are there when you need them. They lower the credit an answer earns, so what the app thinks you know stays honest.</li>
                <li><strong>You steer.</strong> Each day you can say what you want to work on before you see my suggestion. Later you make your own training plans and test whether they worked.</li>
                <li><strong>Every position is checked by software</strong> (rules, a chess engine, endgame tablebases). A strong human player has not yet reviewed the explanations; the app says so on each exercise.</li>
                <li><strong>Your data stays on this device.</strong> No account. Export it from Settings whenever you like.</li>
              </ul>
              <p className="small muted">Good first step: the placement check below, about 15 minutes. You can skip it (it has a Skip button): the course then starts from the beginning.</p>
            </section>
          )}
          <section className="card">
            <h2>Your own aim for today</h2>
            {intention === undefined ? <p className="muted">Loading…</p> : intention === null ? (
              <p className="muted">You skipped this today. <button type="button" className="link" onClick={() => void saveIntention('')}>Set one now</button></p>
            ) : intention !== '' ? (
              <p>{intention} <button type="button" className="link" onClick={() => { setDraft(intention); void saveIntention('') }}>Change</button></p>
            ) : (
              <>
                <p className="small muted">Before you read my suggestions: what would you like to work on today, and why? One line. Deciding first, even badly, is a skill you are building here. "No idea" is a fine answer.</p>
                <div className="row"><input type="text" value={draft} onChange={e => setDraft(e.target.value)} placeholder="e.g. Stop hanging pieces. I lost two games to it this week." aria-label="Your aim for today" />
                  <button type="button" className="primary" disabled={!draft.trim()} onClick={() => { void saveIntention(draft.trim()); setDraft('') }}>Save</button>
                  <button type="button" onClick={() => void saveIntention(null)}>Skip</button></div>
              </>
            )}
          </section>
          <p className="lede">Here is what I would suggest today, and why. {intention ? 'Compare it with your own aim; you decide which to follow. ' : ''}You can skip, reorder, or do something else on the Practice page. The plan is a suggestion, not a requirement.</p>
          {blocks.map(b => (
            <section key={b.id} className={doneIds.includes(b.id) ? 'card done' : 'card'}>
              <h2>{b.title} <span className="muted small">· about {b.minutes} min</span></h2>
              <p className="why"><strong>Why this:</strong> {b.why}</p>
              <div className="row">
                {b.kind === 'start' && <Link className="button primary" to="/placement">Start placement</Link>}
                {b.kind === 'link' && b.to && <Link className="button primary" to={b.to}>{b.cta ?? 'Open'}</Link>}
                {b.kind === 'lesson' && b.lessonId && <button type="button" className="primary" onClick={() => setActive(b.id)}>{doneIds.includes(b.id) ? 'Review lesson' : 'Start lesson'}</button>}
                {(b.kind === 'review' || b.kind === 'mixed' || b.kind === 'reflect') && <button type="button" className="primary" onClick={() => setActive(b.id)}>{doneIds.includes(b.id) ? 'Do it again' : 'Start'}</button>}
                {doneIds.includes(b.id) && <span className="muted small">Done today</span>}
              </div>
            </section>
          ))}
          <section className="card">
            <h2>What the evidence says right now</h2>
            {learning.length === 0 ? <p className="muted">Nothing yet. Evidence appears here as you answer exercises where the idea is not named.</p> : (
              <ul className="plain">{learning.map(([k, m]) => <li key={k}><strong>{content.skillById.get(k.slice(0, k.lastIndexOf('.')))?.title ?? k}</strong> <span className="muted small">({k.slice(k.lastIndexOf('.') + 1)})</span>: {describeMastery(m)}</li>)}</ul>
            )}
            <p className="muted small">Independence (last {ind.counted} first attempts): {ind.hintRate === null ? 'no unlabeled exercises yet.' : `hints used on ${Math.round(ind.hintRate * 100)}% of unlabeled exercises; ${ind.unpromptedAccuracy === null ? '' : `${Math.round(ind.unpromptedAccuracy * 100)}% correct without hints.`}`}
              {ind.calibrationError !== null && ` Confidence vs. correctness gap: ${ind.calibrationError.toFixed(2)} (lower is better calibrated).`}</p>
          </section>
        </>
      )}
      {activeBlock && (
        <>
          <p><button type="button" onClick={() => setActive(null)}>← Back to today's plan</button></p>
          <h2>{activeBlock.title}</h2>
          {activeBlock.kind === 'lesson' && activeBlock.lessonId && (() => { const l = content.lessonById.get(activeBlock.lessonId); return l ? <LessonPlayer lesson={l} /> : <p>Lesson not found.</p> })()}
          {(activeBlock.kind === 'review' || activeBlock.kind === 'mixed') && (
            <ItemSequence items={(activeBlock.itemIds ?? []).map(id => content.itemById.get(id)!).filter(Boolean)} source={activeBlock.kind === 'review' ? 'review' : 'daily'} onComplete={() => void complete(activeBlock.id)} intro={activeBlock.title} />
          )}
          {activeBlock.kind === 'reflect' && <ReflectToday intention={intention || null} onDone={() => void complete('reflect')} />}
        </>
      )}
    </main>
  )
}

function ReflectToday({ onDone, intention }: { onDone: () => void; intention: string | null }) {
  const [t, setT] = useState('')
  const [other, setOther] = useState('')
  return (
    <section className="card">
      {intention && <p className="small muted">This morning you aimed to: {intention}</p>}
      <RichText text={(intention ? 'Did you do what you aimed to do? ' : '') + 'Which exercise today felt least clear, and what did you expect to happen?\nOne or two sentences is enough. This stays on your device.'} />
      <textarea rows={3} value={t} onChange={e => setT(e.target.value)} aria-label="Your note" />
      <label className="field"><span className="small muted">Any other chess today outside this app (games, reading, videos)? Optional. It helps tell what is working.</span>
        <input type="text" value={other} onChange={e => setOther(e.target.value)} /></label>
      <div className="row"><button type="button" className="primary" onClick={async () => { if (t.trim() || other.trim()) { await db.reflections.add({ kind: 'daily', data: { answer: t, other }, ts: Date.now() }) } onDone() }}>Save and finish</button></div>
    </section>
  )
}
