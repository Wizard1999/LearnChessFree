import { Crest } from '../components/Crest'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent, useContentFull } from '../lib/content'
import { independence, masteryMap, useAttempts, useLessonProgress, usePlacement, NO_PLACEMENT } from '../lib/progress'
import { buildDaily, dateKey, NO_EXTRAS, type Block, type Extras } from '../lib/daily'
import { challengeSeed, planChallenge } from '../lib/missions'
import { useMissionData } from '../lib/useMissions'
import { ItemSequence, LessonPlayer, RichText } from '../components/LessonPlayer'
import { db, kvGet, kvSet } from '../db'
import { describeMastery } from '../lib/mastery'
import { buildCards, dueCards, type DrillState, type RepLine } from '../lib/drill'
import { useStorageStatus } from '../lib/persist'

const NONE: never[] = []

export function Today() {
  const content = useContent()
  const full = useContentFull()
  const attempts = useAttempts()
  const progress = useLessonProgress()
  const placementQ = usePlacement()
  const day = dateKey()
  const [doneIds, setDoneIds] = useState<string[]>([])
  // The block being worked on is a snapshot: finishing a lesson changes what 'the next lesson' is, and the screen must not switch under the learner.
  const [active, setActive] = useState<Block | null>(null)
  const [extras, setExtras] = useState<Extras>(NO_EXTRAS)
  const missionData = useMissionData()
  const storage = useStorageStatus()
  const [lastChallenge, setLastChallenge] = useState<number | null | undefined>(undefined)
  useEffect(() => { void kvGet<number | null>('challenge:last', null).then(setLastChallenge) }, [])
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
        games: games.length, analysedGames: games.filter(g => g.analysis).length, labUses, hasPlan: plans.length > 0, repDue, challenge: null,
      })
    })()
  }, [])

  const placement = placementQ ?? NO_PLACEMENT
  // If the browser will not open storage at all, the learner is treated as new (and told so) instead of waiting for ever.
  const storageDead = storage?.works === false
  const A = attempts ?? NONE, P = progress ?? NONE
  const ready = storageDead || (attempts !== undefined && progress !== undefined && placementQ !== undefined)
  const fresh = ready && A.length === 0 && P.length === 0 && !placement.done
  // A returning learner's plan draws on the whole exercise bank; a new learner only needs the first lesson, so the start screen does not wait.
  const planReady = ready && (full || fresh)
  const challenge = useMemo(() => {
    if (!missionData.ctx || !missionData.attempts || lastChallenge === undefined) return null
    const p = planChallenge(missionData.overall.nodes, content.items, missionData.attempts, lastChallenge, Date.now(), challengeSeed(missionData.overall.strand, lastChallenge))
    return p.unlocked ? { skills: p.picks.map(x => x.node.title) } : null
  }, [missionData.ctx, missionData.attempts, missionData.overall, lastChallenge, content.items, day])
  const blocks = useMemo<Block[]>(() => planReady ? buildDaily(content, A, placement, P, day, { ...extras, challenge }) : [], [planReady, content, A, placement, P, day, extras, challenge])
  const ind = useMemo(() => independence(attempts ?? []), [attempts])
  const masteries = useMemo(() => masteryMap(attempts ?? [], Date.now(), content.cuedOnly), [attempts, content.cuedOnly])

  async function saveIntention(text: string | null) {
    setIntention(text); await kvSet(`daily:${day}:intention`, text)
    if (text) await db.reflections.add({ kind: 'intention', data: { text }, ts: Date.now() })
  }
  async function complete(id: string) {
    const next = [...new Set([...doneIds, id])]
    setDoneIds(next); setActive(null); await kvSet(`daily:${day}:done`, next)
  }
  if (!ready) return <main className="page"><p className="muted">Loading…</p></main>

  const activeBlock = active
  const firstLesson = fresh ? blocks.find(b => b.kind === 'lesson') : undefined
  // the placement offer is a quiet link, never the main card; the main card is the next lesson or review
  const startBlock = blocks.find(b => b.kind === 'start' && !doneIds.includes(b.id))
  const upNext = blocks.find(b => !doneIds.includes(b.id) && b.kind !== 'start') ?? startBlock
  const others = blocks.filter(b => b !== upNext && b !== startBlock)
  const learning = [...masteries.entries()].filter(([, m]) => m.state !== 'unseen').sort((a, b) => b[1].n - a[1].n).slice(0, 6)

  const inProgress = (b: Block) => b.kind === 'lesson' && (progress ?? []).some(p => p.lessonId === b.lessonId && !p.done && p.step > 0)
  const action = (b: Block, big = false, label?: string) => {
    const cls = big ? 'primary big' : 'primary'
    const done = doneIds.includes(b.id)
    if (b.kind === 'start') return <Link className={`button ${cls}`} to="/placement">Start placement</Link>
    if (b.kind === 'link' && b.to) return <Link className={`button ${cls}`} to={b.to}>{b.cta ?? 'Open'}</Link>
    if (b.kind === 'lesson' && b.lessonId) return <button type="button" className={cls} onClick={() => setActive(b)}>{label ?? (done ? 'Review lesson' : inProgress(b) ? 'Continue lesson' : 'Start lesson')}</button>
    return <button type="button" className={cls} onClick={() => setActive(b)}>{done ? 'Do it again' : 'Start'}</button>
  }

  if (firstLesson && !activeBlock) {
    return (
      <main className="page startpage">
        <h1>Learn chess, starting now</h1>
        <p className="lede">No sign-up and nothing to set up. Your progress is saved in this browser as you go. A private or incognito window deletes it when you close it, so use a normal window (or export a file from Settings).</p>
        {storageDead && <p className="warn-text" role="alert">This browser is not storing anything (blocked site data does this), so your progress will be lost when you close the tab.</p>}
        <section className="card hero">
          <div className="herocrest" aria-hidden="true"><Crest /></div>
          <p className="eyebrow">First lesson · about {firstLesson.minutes} min</p>
          <h2>{firstLesson.title}</h2>
          <p>Lessons run in order from the beginning, and each one has you try things on a real board. Already know the basics? Skip ahead below.</p>
          <div className="row">{action(firstLesson, true, 'Start learning')}</div>
        </section>
        <p className="small">Already play? <Link to="/placement">Find your starting level</Link> (about 15 minutes, optional). Or <Link to="/course">see the whole course</Link>.</p>
        <details className="small howitworks">
          <summary>How this school works</summary>
          <ul>
            <li><strong>Test first, then learn.</strong> Most practice here does not tell you which idea to use, because in a real game nobody does. Lessons come with labelled examples; practice does not.</li>
            <li><strong>Help is allowed and counted.</strong> Hints and prompts are there when you need them. They lower the credit an answer earns, so what the app thinks you know stays honest.</li>
            <li><strong>You steer.</strong> You can say what you want to work on, and later make your own training plans and test whether they worked.</li>
            <li><strong>Every position is checked by software</strong> (rules, a chess engine, endgame tablebases).</li>
            <li><strong>Your data stays on this device.</strong> Back it up or move it from Settings whenever you like.</li>
          </ul>
        </details>
      </main>
    )
  }

  return (
    <main className="page">
      <h1>Today</h1>
      {!activeBlock && (
        <>
          {!planReady ? (
            <section className="card hero"><p className="muted">Preparing today's plan…</p></section>
          ) : upNext ? (
            <section className="card hero">
              <p className="eyebrow">Up next · about {upNext.minutes} min</p>
              <h2>{upNext.title}</h2>
              <p className="why"><strong>Why this:</strong> {inProgress(upNext) ? 'You started this lesson. It picks up where you left off.' : upNext.why}</p>
              <div className="row">{action(upNext, true)}</div>
            </section>
          ) : blocks.length > 0 ? (
            <section className="card hero">
              <h2>Today's plan is done</h2>
              <p>You can stop here, or keep going with <Link to="/practice">more practice</Link>.</p>
            </section>
          ) : (
            <section className="card hero">
              <h2>Nothing is planned yet</h2>
              <p>Open the <Link to="/course">course</Link> to pick something, or try <Link to="/practice">some practice</Link>.</p>
            </section>
          )}
          {startBlock && upNext !== startBlock && <p className="small">Already play? <Link to="/placement">Find your starting point</Link> (optional, about {startBlock.minutes} minutes).</p>}
          <details className="card aimcard" open={!!intention}>
            <summary>Set your own aim for today <span className="muted small">· optional</span></summary>
            {intention === undefined ? <p className="muted">Loading…</p> : intention === null ? (
              <p className="muted">You skipped this today. <button type="button" className="link" onClick={() => void saveIntention('')}>Set one now</button></p>
            ) : intention !== '' ? (
              <p>{intention} <button type="button" className="link" onClick={() => { setDraft(intention); void saveIntention('') }}>Change</button></p>
            ) : (
              <>
                <p className="small muted">What would you like to work on today, and why? One line. Deciding for yourself, even badly, is a skill you are building here. "No idea" is a fine answer.</p>
                <div className="row"><input type="text" value={draft} onChange={e => setDraft(e.target.value)} placeholder="e.g. Stop hanging pieces. I lost two games to it this week." aria-label="Your aim for today" />
                  <button type="button" className="primary" disabled={!draft.trim()} onClick={() => { void saveIntention(draft.trim()); setDraft('') }}>Save</button>
                  <button type="button" onClick={() => void saveIntention(null)}>Skip</button></div>
              </>
            )}
          </details>
          {others.length > 0 && <details className="moreplan"><summary>More for today ({others.length})</summary>
          {others.map(b => (
            <section key={b.id} className={doneIds.includes(b.id) ? 'card done' : 'card'}>
              <h2>{b.title} <span className="muted small">· about {b.minutes} min</span></h2>
              <p className="why"><strong>Why this:</strong> {b.why}</p>
              <div className="row">
                {action(b)}
                {doneIds.includes(b.id) && <span className="muted small">Done today</span>}
              </div>
            </section>
          ))}
          {others.length > 0 && <p className="small muted">The plan is a suggestion, not a requirement. Skip anything, or do something else from Practice.</p>}
          </details>}
          <details className="card evidencecard">
            <summary>What the evidence says right now</summary>
            {learning.length === 0 ? <p className="muted">Nothing yet. Evidence appears here as you answer exercises where the idea is not named.</p> : (
              <ul className="plain">{learning.map(([k, m]) => <li key={k}><strong>{content.skillById.get(k.slice(0, k.lastIndexOf('.')))?.title ?? k}</strong> <span className="muted small">({k.slice(k.lastIndexOf('.') + 1)})</span>: {describeMastery(m)}</li>)}</ul>
            )}
            <p className="muted small">Independence (last {ind.counted} first attempts): {ind.hintRate === null ? 'no unlabeled exercises yet.' : `hints used on ${Math.round(ind.hintRate * 100)}% of unlabeled exercises; ${ind.unpromptedAccuracy === null ? '' : `${Math.round(ind.unpromptedAccuracy * 100)}% correct without hints.`}`}
              {ind.calibrationError !== null && ` Confidence vs. correctness gap: ${ind.calibrationError.toFixed(2)} (lower is better calibrated).`}</p>
          </details>
        </>
      )}
      {activeBlock && (
        <>
          <p><button type="button" onClick={() => setActive(null)}>← Back</button></p>
          <h2>{activeBlock.title}</h2>
          {activeBlock.kind === 'lesson' && activeBlock.lessonId && (() => { const l = content.lessonById.get(activeBlock.lessonId); return l ? <LessonPlayer lesson={l} onExit={() => setActive(null)} /> : <p>Lesson not found.</p> })()}
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
