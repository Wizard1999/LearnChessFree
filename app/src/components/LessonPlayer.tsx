import { useEffect, useRef, useState } from 'react'
import { ArtScene } from './art'
import { Link } from 'react-router-dom'
import { ChessBoard } from './ChessBoard'
import { ItemPlayer, type ItemResult } from './ItemPlayer'
import { LinePlayer } from './LinePlayer'
import { GuidedGame } from './GuidedGame'
import { ReachStep } from './ReachStep'
import { db, type AttemptSource } from '../db'
import { planResume, finishedEarlierVersion, placeOf, REWRITTEN_QUESTION } from '../lib/resume'
import { saveStep, saveFinished } from '../lib/lessonSave'
import { StepTimer, worthRecording } from '../lib/measuredTime'
import { safeWrite } from '../lib/saveStatus'
import { chaptersOf, chapterIndexAt, startsLaterChapter } from '../lib/chapters'
import { BackupNudge } from './BackupNudge'
import { itemsByTags, LessonLoading, stepItemIds, useContent, useContentFull, useLesson, usePracticeReady } from '../lib/content'
import { pickFresh } from '../lib/select'
import { useAttempts } from '../lib/progress'
import { sideToMove } from '../lib/play'
import { leadText } from '../lib/resultText'
import type { Item, Lesson, LessonMeta, LessonStep, ReflectField } from '../types'
import type { LoopLevel } from '../lib/loop'
import { ReadAloudBar } from './ReadAloudBar'
import { useSpokenText } from '../lib/readAloud'
import { contrastStageLabel, describeChange, GUESS_LABEL, guessEcho, nextContrastStage, type ContrastGuess, type ContrastStage } from '../lib/contrastStages'

const NO_ITEMS: Item[] = []

/** Renders **bold** and line breaks only. Cards are plain text by design (no HTML from content). */
export function RichText({ text }: { text: string }) {
  return <>{text.split('\n').map((line, i) => (
    <p key={i}>{line.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).map((part, j) => part.startsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : /^\*[^*]+\*$/.test(part) ? <em key={j}>{part.slice(1, -1)}</em> : <span key={j}>{part}</span>)}</p>
  ))}</>
}

interface SequenceProps { items: Item[]; source: AttemptSource; silent?: boolean; onComplete: (results: ItemResult[]) => void; intro?: string; loopShown?: LoopLevel; askConfidence?: boolean; /** Keeps the board the same way round across the positions of one step. */ orientation?: 'white' | 'black' }

/**
 * Items one after another, with a progress line. It starts again only when the SET of exercises changes (not whenever a caller builds a
 * new array of the same exercises), by remounting: a stale index into a shorter list would crash the page.
 */
export function ItemSequence(props: SequenceProps) {
  return <ItemSequenceRun key={props.items.map(x => x.id).join('|')} {...props} />
}

function ItemSequenceRun({ items, source, silent, onComplete, intro, loopShown, askConfidence, orientation }: SequenceProps) {
  const [i, setI] = useState(0)
  const [results, setResults] = useState<ItemResult[]>([])
  if (items.length === 0) return <p className="muted">No exercises available here yet.</p>
  const item = items[i]
  return (
    <div>
      <p className="muted small">{intro ? `${intro} · ` : ''}Exercise {i + 1} of {items.length}</p>
      <ItemPlayer key={item.id + ':' + i} item={item} source={source} silent={silent} loopShown={silent ? undefined : loopShown} askConfidence={askConfidence} orientation={orientation} nextLabel={i + 1 < items.length ? 'Next exercise' : 'Finish'}
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
  const [failed, setFailed] = useState(false)
  async function save() {
    // "Saved" is shown only when the write really happened.
    const ok = await safeWrite(() => db.reflections.add({ kind: step.kind, lessonId, data: vals, ts: Date.now() }))
    setSaved(ok); setFailed(!ok)
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
      {failed ? <p className="small warn-text" role="status">This note could not be saved on this device. You can still continue.</p> : saved ? <p className="muted small" role="status">Saved on this device.</p> : <p className="muted small">Saved only on this device. You can skip this.</p>}
      <div className="row actionbar">
        {!saved && <button type="button" onClick={save} disabled={Object.values(vals).every(v => !v)}>Save note</button>}
        <button type="button" className="primary" onClick={onNext}>Continue</button>
      </div>
    </section>
  )
}

/** `onExit`: called when the learner leaves from the lesson-complete card (a page that embeds the player uses it to close the lesson). */
/** A lesson known only by its catalog entry: fetches the body, then plays it. */
export function LessonById({ meta, onExit }: { meta: LessonMeta; onExit?: () => void }) {
  const { lesson, failed, retry } = useLesson(meta)
  return lesson ? <LessonPlayer lesson={lesson} onExit={onExit} /> : <LessonLoading failed={failed} retry={retry} title={meta.title} />
}

export function LessonPlayer({ lesson, onExit }: { lesson: Lesson; onExit?: () => void }) {
  const content = useContent()
  const full = useContentFull()
  const practiceReady = usePracticeReady()
  const attempts = useAttempts()
  const [i, setI] = useState(0)
  const steps = lesson.steps
  const step = steps[i]
  const done = i >= steps.length

  // Pick up where the learner left off in an unfinished lesson. Nothing is written until the saved place has been read. The place is
  // found by the step's stable id and the lesson revision (lib/resume.ts); a rewritten lesson whose old place cannot be found asks.
  const [restoredFor, setRestoredFor] = useState<string | null>(null)
  const restored = restoredFor === lesson.id // derived, so switching lessons on one mounted player cannot write the old step to the new lesson
  const [resumedAt, setResumedAt] = useState<{ step: number; mapped: boolean } | null>(null)
  const [asking, setAsking] = useState<{ near: number } | null>(null)
  const [earlierVersion, setEarlierVersion] = useState(false)
  const finishedBefore = useRef(false) // re-reading a finished lesson must not mark it unfinished
  useEffect(() => {
    let live = true
    setI(0); setResumedAt(null); setAsking(null); setEarlierVersion(false); finishedBefore.current = false
    void db.lessonProgress.get(lesson.id).then(p => {
      if (!live) return
      if (p?.done) { finishedBefore.current = true; setEarlierVersion(finishedEarlierVersion(p, lesson)) }
      const plan = planResume(p, lesson)
      if (plan.kind === 'resume') { setI(plan.step); setResumedAt({ step: plan.step, mapped: plan.mapped }) }
      else if (plan.kind === 'ask') setAsking({ near: plan.near })
    }).catch(() => undefined).finally(() => { if (live) setRestoredFor(lesson.id) })
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the saved place is read once per lesson (and once per revision of it)
  }, [lesson.id, lesson.revision, lesson.steps.length])
  useEffect(() => {
    if (!restored || asking) return
    if (!done) { if (!finishedBefore.current) void saveStep(db.lessonProgress, lesson, i) }
    else void saveFinished(db.lessonProgress, lesson)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `lesson` is identified by id and revision below
  }, [restored, asking, i, done, lesson.id, lesson.revision, steps.length])

  // Time on each step, for the learner's own pace estimate: a step is timed from when it is shown to when the learner moves on from it.
  // Idle stretches count for at most 90 seconds and time with the page hidden does not count (lib/measuredTime.ts). Jumping about is not timed.
  const timer = useRef<StepTimer | null>(null)
  const timing = restored && !asking && !done
  useEffect(() => {
    if (!timing) { timer.current = null; return }
    const t = new StepTimer(Date.now(), typeof document === 'undefined' || !document.hidden)
    timer.current = t
    const poke = () => t.tick(Date.now())
    const vis = () => t.setVisible(Date.now(), !document.hidden)
    const evs = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const
    evs.forEach(e => window.addEventListener(e, poke, { passive: true }))
    document.addEventListener('visibilitychange', vis)
    return () => { evs.forEach(e => window.removeEventListener(e, poke)); document.removeEventListener('visibilitychange', vis) }
  }, [timing, i, lesson.id])
  function recordStep() {
    const t = timer.current, s = steps[i]
    if (!t || !s) return
    const ms = t.stop(Date.now())
    const sid = placeOf(lesson, i).sid
    if (sid && worthRecording(ms)) void safeWrite(() => db.stepTimes.add({ lessonId: lesson.id, sid, type: s.type, ms, ts: Date.now() }))
  }
  const next = () => { recordStep(); setI(x => x + 1) }
  const loopLevel = (/^LOOP\.(V[1-3])$/.exec(lesson.skill)?.[1] ?? undefined) as LoopLevel | undefined
  // A practice set is picked once per step and kept: answering an exercise changes `attempts` (and, on first load, the exercise bank
  // grows), and re-picking then would swap the set under the learner.
  const picked = useRef(new Map<string, Item[]>())

  // While only the first-visit exercises have arrived, a lesson that needs others (named exercises, or a practice set drawn from a tag)
  // waits for the whole bank rather than start with a different set. (The set is picked only after this check, so it is never picked early.)
  const waiting = !full && steps.some(s => stepItemIds(s).some(id => !content.itemById.has(id)) || (s.type === 'practice' && !practiceReady(s.tags)))
  // Read aloud (off unless the learner turned it on): a card's title and text, or a plain board's caption. A board with a line is
  // read by the line player, move by move. Speech stops on every step change and on leaving.
  const spoken = !restored || waiting || done || !step ? ''
    : step.type === 'card' ? [step.title, step.text].filter(Boolean).join('. ')
    : step.type === 'board' && !(step.line && step.line.length > 0) ? step.caption ?? '' : ''
  useSpokenText(spoken)
  if (!restored) return null
  if (waiting) return <p className="muted">Loading the exercises for this lesson…</p>

  let practice: Item[] = NO_ITEMS
  if (step && step.type === 'practice' && attempts !== undefined) {
    const key = `${lesson.id}:${i}`
    let set = picked.current.get(key)
    if (!set) { set = pickFresh(itemsByTags(content.items, step.tags), attempts, step.n, `${key}:${attempts.length > 0}`, { strictFamilies: lesson.role === 'assessment' }); picked.current.set(key, set) }
    practice = set
  }

  if (asking) {
    return (
      <section className="card" role="group" aria-label="This lesson has changed">
        <h2>{lesson.title}</h2>
        <p>{REWRITTEN_QUESTION}</p>
        <div className="row">
          <button type="button" className="primary" onClick={() => { setI(0); setAsking(null) }}>Start the revised lesson from the beginning</button>
          <button type="button" onClick={() => { const n = asking.near; setI(n); setResumedAt({ step: n, mapped: false }); setAsking(null) }}>Continue near where I was (step {asking.near + 1} of {steps.length})</button>
        </div>
      </section>
    )
  }

  if (done) {
    const sk = content.skillById.get(lesson.skill)
    return (
      <section className="card">
        <ArtScene kind="done" />
        <h2>Lesson complete</h2>
        <p>You finished <strong>{lesson.title}</strong>.</p>
        {lesson.outcomes && <><p className="small muted">What you should now be able to do:</p><ul>{lesson.outcomes.map(o => <li key={o}>{o}</li>)}</ul></>}
        <p className="muted small">Finishing a lesson only means you have <em>seen</em> the idea. It counts as <strong>reliable</strong> only after you solve fresh positions where nobody names it. Those come back as mixed practice{sk ? ` (skill: ${sk.title})` : ''}.</p>
        <div className="row"><Link className="button primary" to="/course" onClick={onExit}>Back to Curriculum</Link><Link className="button" to="/practice">Practice mixed positions</Link></div>
        <BackupNudge />
      </section>
    )
  }

  return (
    <div className="lesson">
      <ReadAloudBar />
      {earlierVersion && <p className="small muted">You finished an earlier version of this lesson. This is the revised version; your earlier completion is kept.</p>}
      {resumedAt !== null && i === resumedAt.step && <p className="small muted">{resumedAt.mapped ? 'This lesson was updated; picked up at the same step. ' : 'Picked up where you left off. '}<button type="button" className="link" onClick={() => { setI(0); setResumedAt(null) }}>Start from the beginning</button></p>}
      <ChapterBar steps={steps} i={i} onJump={k => { setI(k); setResumedAt(null) }} />
      <div className="progress" aria-label={`Step ${i + 1} of ${steps.length}`}>
        {steps.map((_, k) => <span key={k} className={k < i ? 'dot done' : k === i ? 'dot now' : 'dot'} />)}
      </div>
      {step.type === 'card' && (
        <section className="card">{step.title && <h3>{step.title}</h3>}<RichText text={step.text} />
          <div className="row actionbar"><button type="button" className="primary" onClick={next}>Continue</button></div></section>
      )}
      {step.type === 'board' && (
        step.line && step.line.length > 0
          ? <section className="card"><LinePlayer fen={step.fen} line={step.line} caption={step.caption} arrows={step.arrows} highlight={step.highlight} readAloud />
              <div className="row actionbar"><button type="button" className="primary" onClick={next}>Continue</button></div></section>
          : <section className="card"><ChessBoard fen={step.fen} orientation={sideToMove(step.fen)} shapes={(step.arrows ?? []).map(a => ({ from: a.from, to: a.to }))} highlight={step.highlight} controlMap />
              {step.caption && <p className="caption">{step.caption}</p>}
              <div className="row actionbar"><button type="button" className="primary" onClick={next}>Continue</button></div></section>
      )}
      {step.type === 'item' && (() => {
        const it = content.itemById.get(step.item)
        return it ? <ItemSequence items={[it]} source="lesson" silent={step.silent} askConfidence={step.ask_confidence} loopShown={loopLevel} onComplete={next} /> : <p className="warn">Missing exercise {step.item}.</p>
      })()}
      {step.type === 'practice' && lesson.role === 'assessment' && practice.length < step.n && <p className="muted small">This check has {practice.length} exercise{practice.length === 1 ? '' : 's'} instead of {step.n}: a check never repeats a position family, and there are not enough different ones yet. A shorter honest check is better than a padded one.</p>}
      {step.type === 'practice' && <ItemSequence items={practice} source="lesson" silent={step.silent} askConfidence={step.ask_confidence} loopShown={loopLevel} onComplete={next} intro="Practice set" />}
      {step.type === 'contrast' && <ContrastStep key={`${lesson.id}:${i}`} step={step} lessonId={lesson.id} onNext={next} />}
      {step.type === 'reflect' && <ReflectStep step={step} lessonId={lesson.id} onNext={next} />}
      {step.type === 'guided' && <GuidedGame key={`${lesson.id}:${i}`} fen={step.fen} moves={step.moves ?? []} title={step.title} end={step.end} onDone={next} playedKey={`${lesson.id}:${placeOf(lesson, i).sid ?? i}`} />}
      {step.type === 'reach' && <ReachStep key={`${lesson.id}:${i}`} step={step} onDone={next} />}
      {step.type === 'finale' && (
        <section className="card">
          <h3>Play it out</h3>
          <p>{step.prompt ?? 'Play a game from the position this lesson taught.'} <span className="muted small">Optional.</span></p>
          <div className="row actionbar">
            <Link className="button" to={`/play?fen=${encodeURIComponent(step.fen)}&lesson=${encodeURIComponent(lesson.id)}${step.color === 'white' || step.color === 'black' ? `&color=${step.color}` : ''}`}>Play this position</Link>
            <button type="button" className="primary" onClick={next}>Continue</button>
          </div>
        </section>
      )}
    </div>
  )
}

/** Chapter name and a compact list in the header of a lesson whose steps carry chapter names, and a quiet stopping-point line where a new chapter starts. */
function ChapterBar({ steps, i, onJump }: { steps: LessonStep[]; i: number; onJump: (step: number) => void }) {
  const chapters = chaptersOf(steps)
  if (chapters.length === 0) return null
  const k = chapterIndexAt(chapters, i)
  const stop = startsLaterChapter(chapters, i)
  return (
    <div className="chapterbar">
      <details>
        <summary><span className="small muted">Chapter {k + 1} of {chapters.length}:</span> <strong>{chapters[k]?.name}</strong></summary>
        <ol className="plain small chapterlist">
          {chapters.map((c, n) => <li key={c.name + n}>{c.start <= i ? <button type="button" className={n === k ? 'link current' : 'link'} aria-current={n === k ? 'step' : undefined} onClick={() => onJump(c.start)}>{c.name}</button> : <span className="muted">{c.name}</span>}</li>)}
        </ol>
      </details>
      {stop && <p className="small muted stoppoint">You finished the chapter "{stop.finished}". You can stop here; you will resume at the start of "{stop.next}".</p>}
    </div>
  )
}

function ContrastStep({ step, lessonId, onNext }: { step: Extract<LessonStep, { type: 'contrast' }>; lessonId: string; onNext: () => void }) {
  const { itemById } = useContent()
  const working = itemById.get(step.working)
  const failing = itemById.get(step.failing)
  const irrelevant = step.irrelevant ? itemById.get(step.irrelevant) : undefined
  const [stage, setStage] = useState<ContrastStage>('original')
  const [guess, setGuess] = useState<ContrastGuess | null>(null)
  const [wantsExample, setWantsExample] = useState(false)
  if (!working || !failing) return <p className="warn">Missing contrast items.</p>
  const hasIrr = !!irrelevant
  const advance = () => { const n = nextContrastStage(stage, hasIrr); if (n) setStage(n); else onNext() }
  async function startAsking() {
    if (guess || wantsExample) await safeWrite(() => db.reflections.add({ kind: 'contrast-predict', lessonId, data: { guess: guess ?? '', needExample: wantsExample ? 'yes' : 'no', prompt: step.prompt ?? '' }, ts: Date.now() }))
    advance()
  }
  // The arrow shows the move that works. For a find-the-move item that is its answer; for other tasks no single move is "the idea", and the first
  // claim carrying a move can be one that loses (a review caught arrows on a losing king move), so draw nothing.
  const claimMove = (working.claims.find(c => typeof (c.params as { move?: string }).move === 'string')?.params as { move?: string } | undefined)?.move
  const wMove = working.task === 'find_move' ? (working.answer.moves?.[0] ?? claimMove) : undefined
  // one orientation for every position of this step, so the change is seen on the same board
  const orient: 'white' | 'black' = working.orientation && working.orientation !== 'auto' ? working.orientation : sideToMove(working.fen)
  const changeTo = stage === 'irrelevant' && irrelevant ? irrelevant : failing
  const change = describeChange(working.fen, changeTo.fen)
  const workedLine = working.reveal_pv && working.reveal_pv.length > 0 ? working.reveal_pv.slice(0, 8).map(m => ({ move: m })) : wMove ? [{ move: wMove }] : null
  const lead = leadText(working.explain, working.claims)
  return (
    <section className="card contrast">
      <h3>{step.title ?? 'Same idea, one change'}</h3>
      <p className="muted small contrast-stage">{contrastStageLabel(stage)}</p>
      {stage === 'original' && (
        <>
          <p>Here is a position where the idea <strong>works</strong>.{working.task === 'predict_outcome' && working.answer.outcome ? <> The result: <strong>{working.answer.outcome}</strong>.</> : null}</p>
          <ChessBoard fen={working.fen} orientation={orient} shapes={wMove ? [{ from: wMove.slice(0, 2), to: wMove.slice(2, 4) }] : []} label="The original position, where the idea works" />
          {lead.written && <p>{lead.text}</p>}
          <div className="row actionbar"><button type="button" className="primary" onClick={advance}>Now change one thing</button></div>
        </>
      )}
      {stage === 'predict' && (
        <>
          <p><strong>The one change.</strong> {change ?? 'The next position differs from this one in one small way.'}</p>
          <ChessBoard fen={working.fen} orientation={orient} shapes={wMove ? [{ from: wMove.slice(0, 2), to: wMove.slice(2, 4) }] : []} label="The original position again" />
          <p>{step.prompt ?? 'Will the idea still work after that change?'}</p>
          <div className="options" role="group" aria-label="Your prediction">
            {(['works', 'fails', 'unsure'] as ContrastGuess[]).map(g => <button type="button" key={g} className={guess === g ? 'chip on' : 'chip'} aria-pressed={guess === g} onClick={() => setGuess(g)}>{GUESS_LABEL[g]}</button>)}
            <button type="button" className={wantsExample ? 'chip on' : 'chip'} aria-pressed={wantsExample} onClick={() => setWantsExample(w => !w)}>I need an example first</button>
          </div>
          {wantsExample && (
            <div className="workedexample" role="region" aria-label="A worked example">
              <p className="small muted">A guess without an example only shows what is missing, so here is the idea played out in the original position.</p>
              {workedLine ? <LinePlayer fen={working.fen} line={workedLine} orientation={orient} title="The idea, move by move" /> : null}
              <p>{lead.written ? lead.text : 'Look at the arrow on the original board: that is the move the idea is built on.'}</p>
            </div>
          )}
          <div className="row actionbar"><button type="button" className="primary" onClick={() => void startAsking()}>{guess ? 'Show the changed position' : wantsExample ? 'I have seen it: show the changed position' : 'Skip the guess and look'}</button></div>
        </>
      )}
      {stage === 'failing' && (
        <>
          <p className="muted small">{guessEcho(guess)}</p>
          {change && <p className="small"><strong>The change:</strong> {change}</p>}
          <ItemSequence items={[failing]} source="lesson" intro="The changed position" silent={step.silent} askConfidence={step.ask_confidence} orientation={orient} onComplete={advance} />
        </>
      )}
      {stage === 'irrelevant' && irrelevant && (
        <>
          {change && <p className="small"><strong>The change:</strong> {change}</p>}
          <ItemSequence items={[irrelevant]} source="lesson" intro="A change that should not matter" silent={step.silent} askConfidence={step.ask_confidence} orientation={orient} onComplete={advance} />
        </>
      )}
    </section>
  )
}
