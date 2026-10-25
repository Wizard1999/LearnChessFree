import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChessBoard } from './ChessBoard'
import { ItemPlayer, type ItemResult } from './ItemPlayer'
import { LinePlayer } from './LinePlayer'
import { db, type AttemptSource } from '../db'
import { itemsByTags, stepItemIds, useContent, useContentFull, usePracticeReady } from '../lib/content'
import { pickFresh } from '../lib/select'
import { useAttempts } from '../lib/progress'
import { sideToMove } from '../lib/play'
import type { Item, Lesson, LessonStep, ReflectField } from '../types'
import type { LoopLevel } from '../lib/loop'

const NO_ITEMS: Item[] = []

/** Renders **bold** and line breaks only. Cards are plain text by design (no HTML from content). */
export function RichText({ text }: { text: string }) {
  return <>{text.split('\n').map((line, i) => (
    <p key={i}>{line.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).map((part, j) => part.startsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : /^\*[^*]+\*$/.test(part) ? <em key={j}>{part.slice(1, -1)}</em> : <span key={j}>{part}</span>)}</p>
  ))}</>
}

interface SequenceProps { items: Item[]; source: AttemptSource; silent?: boolean; onComplete: (results: ItemResult[]) => void; intro?: string; loopShown?: LoopLevel; askConfidence?: boolean }

/**
 * Items one after another, with a progress line. It starts again only when the SET of exercises changes (not whenever a caller builds a
 * new array of the same exercises), by remounting: a stale index into a shorter list would crash the page.
 */
export function ItemSequence(props: SequenceProps) {
  return <ItemSequenceRun key={props.items.map(x => x.id).join('|')} {...props} />
}

function ItemSequenceRun({ items, source, silent, onComplete, intro, loopShown, askConfidence }: SequenceProps) {
  const [i, setI] = useState(0)
  const [results, setResults] = useState<ItemResult[]>([])
  if (items.length === 0) return <p className="muted">No exercises available here yet.</p>
  const item = items[i]
  return (
    <div>
      <p className="muted small">{intro ? `${intro} · ` : ''}Exercise {i + 1} of {items.length}</p>
      <ItemPlayer key={item.id + ':' + i} item={item} source={source} silent={silent} loopShown={silent ? undefined : loopShown} askConfidence={askConfidence} nextLabel={i + 1 < items.length ? 'Next exercise' : 'Finish'}
        onDone={r => { const all = [...results, r]; setResults(all); if (i + 1 < items.length) setI(i + 1); else onComplete(all) }} />
    </div>
  )
}

function ReflectStep({ step, lessonId, onNext }: { step: Extract<LessonStep, { type: 'reflect' }>; lessonId: string; onNext: () => void }) {
  const fields: ReflectField[] = step.fields && step.fields.length ? step.fields
    : step.kind === 'confidence' ? [{ id: 'confidence', label: 'Your answer', options: ['low', 'medium', 'high'] }]
    : [{ id: 'answer', label: 'Your answer' }]
  const [vals, setVals] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  async function save() {
    try { await db.reflections.add({ kind: step.kind, lessonId, data: vals, ts: Date.now() }) } catch { /* ignore */ }
    setSaved(true)
  }
  const checked = (f: ReflectField) => {
    if (!saved || f.answer === undefined) return null
    const n = Number(String(vals[f.id] ?? '').replace(',', '.'))
    if (!Number.isFinite(n) || String(vals[f.id] ?? '').trim() === '') return <span className="muted small"> The answer is {f.answer}.</span>
    const ok = Math.abs(n - f.answer) <= (f.tolerance ?? 0)
    return <span className={ok ? 'small ok-text' : 'small warn-text'}> {ok ? 'Right.' : `Not quite: the answer is ${f.answer}.`}</span>
  }
  return (
    <section className="card reflect">
      <h3>Pause and note</h3>
      <p>{step.prompt}</p>
      {fields.map(f => (
        <label key={f.id} className="field">
          <span className="small muted">{f.label}</span>
          {f.options
            ? <span className="options">{f.options.map(o => <button type="button" key={o} className={vals[f.id] === o ? 'chip on' : 'chip'} onClick={() => setVals(v => ({ ...v, [f.id]: o }))}>{o}</button>)}</span>
            : f.type === 'number'
              ? <input type="number" inputMode="decimal" value={vals[f.id] ?? ''} onChange={e => setVals(v => ({ ...v, [f.id]: e.target.value }))} style={{ maxWidth: 140 }} />
              : <textarea rows={2} value={vals[f.id] ?? ''} onChange={e => setVals(v => ({ ...v, [f.id]: e.target.value }))} />}
          {checked(f)}
        </label>
      ))}
      <p className="muted small">Saved only on this device. You can skip this.</p>
      <div className="row">
        {!saved && <button type="button" onClick={save} disabled={Object.values(vals).every(v => !v)}>Save note</button>}
        <button type="button" className="primary" onClick={onNext}>Continue</button>
      </div>
    </section>
  )
}

/** `onExit`: called when the learner leaves from the lesson-complete card (a page that embeds the player uses it to close the lesson). */
export function LessonPlayer({ lesson, onExit }: { lesson: Lesson; onExit?: () => void }) {
  const content = useContent()
  const full = useContentFull()
  const practiceReady = usePracticeReady()
  const attempts = useAttempts()
  const [i, setI] = useState(0)
  const steps = lesson.steps
  const step = steps[i]
  const done = i >= steps.length

  // Pick up where the learner left off in an unfinished lesson. Nothing is written until the saved step has been read.
  const [restoredFor, setRestoredFor] = useState<string | null>(null)
  const restored = restoredFor === lesson.id // derived, so switching lessons on one mounted player cannot write the old step to the new lesson
  const [resumedAt, setResumedAt] = useState<number | null>(null)
  const finishedBefore = useRef(false) // re-reading a finished lesson must not mark it unfinished
  useEffect(() => {
    let live = true
    setI(0); setResumedAt(null); finishedBefore.current = false
    void db.lessonProgress.get(lesson.id).then(p => {
      if (!live) return
      if (p?.done) finishedBefore.current = true
      if (p && !p.done && p.step > 0 && p.step < lesson.steps.length) { setI(p.step); setResumedAt(p.step) }
    }).catch(() => undefined).finally(() => { if (live) setRestoredFor(lesson.id) })
    return () => { live = false }
  }, [lesson.id, lesson.steps.length])
  useEffect(() => {
    if (!restored) return
    if (!done) { if (!finishedBefore.current) void db.lessonProgress.put({ lessonId: lesson.id, step: i, done: false, ts: Date.now() }).catch(() => undefined) }
    else void db.lessonProgress.put({ lessonId: lesson.id, step: steps.length, done: true, ts: Date.now() }).catch(() => undefined)
  }, [restored, i, done, lesson.id, steps.length])

  const next = () => setI(x => x + 1)
  const loopLevel = (/^LOOP\.(V[1-3])$/.exec(lesson.skill)?.[1] ?? undefined) as LoopLevel | undefined
  // A practice set is picked once per step and kept: answering an exercise changes `attempts` (and, on first load, the exercise bank
  // grows), and re-picking then would swap the set under the learner.
  const picked = useRef(new Map<string, Item[]>())

  // While only the first-visit exercises have arrived, a lesson that needs others (named exercises, or a practice set drawn from a tag)
  // waits for the whole bank rather than start with a different set. (The set is picked only after this check, so it is never picked early.)
  const waiting = !full && steps.some(s => stepItemIds(s).some(id => !content.itemById.has(id)) || (s.type === 'practice' && !practiceReady(s.tags)))
  if (!restored) return null
  if (waiting) return <p className="muted">Loading the exercises for this lesson…</p>

  let practice: Item[] = NO_ITEMS
  if (step && step.type === 'practice' && attempts !== undefined) {
    const key = `${lesson.id}:${i}`
    let set = picked.current.get(key)
    if (!set) { set = pickFresh(itemsByTags(content.items, step.tags), attempts, step.n, `${key}:${attempts.length > 0}`); picked.current.set(key, set) }
    practice = set
  }

  if (done) {
    const sk = content.skillById.get(lesson.skill)
    return (
      <section className="card">
        <h2>Lesson complete</h2>
        <p>You finished <strong>{lesson.title}</strong>.</p>
        {lesson.outcomes && <><p className="small muted">What you should now be able to do:</p><ul>{lesson.outcomes.map(o => <li key={o}>{o}</li>)}</ul></>}
        <p className="muted small">Finishing a lesson only means you have <em>seen</em> the idea. It counts as <strong>reliable</strong> only after you solve fresh positions where nobody names it. Those come back as mixed practice{sk ? ` (skill: ${sk.title})` : ''}.</p>
        <div className="row"><Link className="button primary" to="/" onClick={onExit}>Back to today</Link><Link className="button" to="/practice">Practise mixed positions</Link></div>
      </section>
    )
  }

  return (
    <div className="lesson">
      {resumedAt !== null && i === resumedAt && <p className="small muted">Picked up where you left off. <button type="button" className="link" onClick={() => { setI(0); setResumedAt(null) }}>Start from the beginning</button></p>}
      <div className="progress" aria-label={`Step ${i + 1} of ${steps.length}`}>
        {steps.map((_, k) => <span key={k} className={k < i ? 'dot done' : k === i ? 'dot now' : 'dot'} />)}
      </div>
      {step.type === 'card' && (
        <section className="card">{step.title && <h3>{step.title}</h3>}<RichText text={step.text} />
          <div className="row"><button type="button" className="primary" onClick={next}>Continue</button></div></section>
      )}
      {step.type === 'board' && (
        step.line && step.line.length > 0
          ? <section className="card"><LinePlayer fen={step.fen} line={step.line} caption={step.caption} arrows={step.arrows} highlight={step.highlight} />
              <div className="row"><button type="button" className="primary" onClick={next}>Continue</button></div></section>
          : <section className="card"><ChessBoard fen={step.fen} orientation={sideToMove(step.fen)} shapes={(step.arrows ?? []).map(a => ({ from: a.from, to: a.to }))} highlight={step.highlight} />
              {step.caption && <p className="caption">{step.caption}</p>}
              <div className="row"><button type="button" className="primary" onClick={next}>Continue</button></div></section>
      )}
      {step.type === 'item' && (() => {
        const it = content.itemById.get(step.item)
        return it ? <ItemSequence items={[it]} source="lesson" silent={step.silent} askConfidence={step.ask_confidence} loopShown={loopLevel} onComplete={next} /> : <p className="warn">Missing exercise {step.item}.</p>
      })()}
      {step.type === 'practice' && <ItemSequence items={practice} source="lesson" silent={step.silent} askConfidence={step.ask_confidence} loopShown={loopLevel} onComplete={next} intro="Practice set" />}
      {step.type === 'contrast' && <ContrastStep step={step} onNext={next} />}
      {step.type === 'reflect' && <ReflectStep step={step} lessonId={lesson.id} onNext={next} />}
    </div>
  )
}

function ContrastStep({ step, onNext }: { step: Extract<LessonStep, { type: 'contrast' }>; onNext: () => void }) {
  const { itemById } = useContent()
  const working = itemById.get(step.working)
  const failing = itemById.get(step.failing)
  const [stage, setStage] = useState<'working' | 'predict'>('working')
  if (!working || !failing) return <p className="warn">Missing contrast items.</p>
  // The arrow shows the move that works. For a find-the-move item that is its answer; for other tasks no single move is "the idea", and the first
  // claim carrying a move can be one that loses (a review caught arrows on a losing king move), so draw nothing.
  const claimMove = (working.claims.find(c => typeof (c.params as { move?: string }).move === 'string')?.params as { move?: string } | undefined)?.move
  const wMove = working.task === 'find_move' ? (working.answer.moves?.[0] ?? claimMove) : undefined
  return (
    <section className="card contrast">
      <h3>{step.title ?? 'Same idea, one change'}</h3>
      {stage === 'working' ? (
        <>
          <p>Here the idea <strong>works</strong>.</p>
          <ChessBoard fen={working.fen} orientation={sideToMove(working.fen)} shapes={wMove ? [{ from: wMove.slice(0, 2), to: wMove.slice(2, 4) }] : []} label="The working position" />
          <div className="row"><button type="button" className="primary" onClick={() => setStage('predict')}>Now change one thing</button></div>
        </>
      ) : (
        <ItemSequence items={[failing]} source="lesson" intro="Predict first" silent={step.silent} askConfidence={step.ask_confidence} onComplete={onNext} />
      )}
      {stage === 'predict' && step.prompt && <p className="muted small">{step.prompt}</p>}
    </section>
  )
}
