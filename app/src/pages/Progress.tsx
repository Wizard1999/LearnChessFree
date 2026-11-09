import { hueOfStage } from '../lib/hue'
import { ArtEmblem, ArtScene } from '../components/art'
import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { db } from '../db'
import { useContent } from '../lib/content'
import { describeMastery } from '../lib/mastery'
import { independenceSentence } from '../lib/labels'
import { independence, masteryMap, MIN_BAND_SAMPLES, useAttempts, useLessonProgress } from '../lib/progress'
import { stageProgress } from '../lib/stageProgress'
import { Achievements } from './Achievements'
import { AimCard } from '../components/AimCard'
import { ResultMark } from '../components/ResultMark'
import type { ResultKind } from '../lib/resultText'

const DAY = 86400000
const pct = (x: number | null) => (x === null ? '—' : `${Math.round(x * 100)}%`)

/** The Learning record: hints and independence, confidence, evidence per skill, mistake diagnoses, notes, badges and the path by stage. A standalone page under More (D76); #/progress redirects to it. */
export function ProgressReport() {
  const content = useContent()
  const attempts = useAttempts()
  const reflections = useLiveQuery(() => db.reflections.orderBy('ts').reverse().toArray(), [])
  const firsts = useMemo(() => (attempts ?? []).filter(a => a.firstAttempt), [attempts])
  const masteries = useMemo(() => masteryMap(attempts ?? [], Date.now(), content.cuedOnly), [attempts, content.cuedOnly])

  const weekly = useMemo(() => {
    const m = new Map<number, { n: number; cued: number; hints: number; ok: number; unp: number }>()
    for (const a of firsts) {
      const wk = Math.floor(a.ts / (7 * DAY))
      const r = m.get(wk) ?? { n: 0, cued: 0, hints: 0, ok: 0, unp: 0 }
      r.n++
      if (a.cue >= 3) { r.cued++; if (a.hints > 0) r.hints++; else { r.unp++; if (a.correct) r.ok++ } }
      m.set(wk, r)
    }
    return [...m.entries()].sort((a, b) => b[0] - a[0]).slice(0, 8)
  }, [firsts])

  const lessonProg = useLessonProgress()
  const stages = useMemo(() => stageProgress(content.lessons, lessonProg ?? [], masteries), [content.lessons, lessonProg, masteries])

  const diag = useMemo(() => { const m = new Map<string, number>(); for (const r of reflections ?? []) if (r.kind === 'diagnosis') m.set(r.data.cause, (m.get(r.data.cause) ?? 0) + 1); return [...m.entries()].sort((a, b) => b[1] - a[1]) }, [reflections])
  // First answers by outcome: the same three marks as in the exercises (correct, sound alternative, unsuccessful).
  const outcomes = useMemo(() => { const t: Record<ResultKind, number> = { correct: 0, 'sound-alternative': 0, unsuccessful: 0 }; for (const a of firsts) t[a.result ?? (a.correct ? 'correct' : 'unsuccessful')]++; return t }, [firsts])
  const ind = independence(attempts ?? [])
  const rows = useMemo(() => [...masteries.entries()].sort((a, b) => b[1].n - a[1].n), [masteries])

  if (!attempts) return <p className="muted">Loading…</p>
  return (
    <div className="progressreport">
      <p className="small muted">Evidence that you can do things on your own. Nothing here is a rating.</p>
      <AimCard />
      {stages.some(s => s.lessons > 0) && (
        <section className="card pathstages">
          <h2>Your path</h2>
          <p className="small muted">Eight stages, in order. "Lessons finished" counts lessons you completed or marked done. "Shown in exercises" counts skills where your answers, without hints, reached Level one or better. A finished lesson is not proof that you can use the idea.</p>
          <ol className="pathlist">{stages.map(s => (
            <li key={s.id} data-hue={hueOfStage(s.index)} className={s.current ? 'pathstage current' : 'pathstage'} aria-current={s.current ? 'step' : undefined}>
              <h3><ArtEmblem seed={s.id} />Stage {s.index}: {s.title}{s.current && <span className="badge here">You are here</span>}</h3>
              <p className="small">{s.milestone}</p>
              <p className="small muted">Lessons finished: <strong>{s.finished} of {s.lessons}</strong>{s.skipped > 0 && ` (${s.skipped} marked done without doing)`} · Shown in exercises: <strong>{s.shown} of {s.skills}</strong> skills</p>
            </li>))}
          </ol>
        </section>
      )}
      {firsts.length === 0 ?<section className="card"><ArtScene kind="attempts" /><p>No exercises answered yet. <Link to="/course">Start with the next lesson</Link>.</p></section> : (
        <>
          <section className="card">
            <h2>Hints and independence</h2>
            <p className="resultlegend" aria-label="First answers by outcome">{(['correct', 'sound-alternative', 'unsuccessful'] as ResultKind[]).map(k => <ResultMark key={k} kind={k} count={outcomes[k]} />)}</p>
            <p>{independenceSentence(ind.counted, ind.hintRate, ind.unpromptedAccuracy)} <strong>Success looks like hint use falling while accuracy holds.</strong> Needing more help on harder material is normal.</p>
            <p className="small muted">Unlabeled means the exercise does not tell you which idea to use.</p>
            <details><summary>Week by week</summary><div className="tablewrap"><table className="table small"><thead><tr><th>Week of</th><th>Exercises</th><th>Unlabeled</th><th>With hints</th><th>Right without hints</th></tr></thead>
              <tbody>{weekly.map(([wk, r]) => <tr key={wk}><td>{new Date(wk * 7 * DAY).toLocaleDateString()}</td><td>{r.n}</td><td>{r.cued}</td><td>{pct(r.cued ? r.hints / r.cued : null)}</td><td>{pct(r.unp ? r.ok / r.unp : null)} <span className="muted">({r.ok}/{r.unp})</span></td></tr>)}</tbody></table></div></details>
          </section>
          <section className="card">
            <h2>Does your confidence match your results?</h2>
            <p className="small muted">Before answering unlabeled exercises you can mark how sure you are. If "high" is right far more often than "low", your sense of what you know is trustworthy; if not, that is useful to learn. A percentage is shown only for a band with at least {MIN_BAND_SAMPLES} answers; fewer than that says nothing yet.</p>
            <div className="tablewrap"><table className="table small"><thead><tr><th>You said</th><th>Answers</th><th>Right</th></tr></thead>
              <tbody>{ind.confidenceBands.map(c => <tr key={c.band}><td>{c.band}</td><td>{c.n}</td><td>{c.accuracy !== null ? `${Math.round(c.accuracy * 100)}%` : 'too few to say'} <span className="muted">({c.correct}/{c.n})</span></td></tr>)}</tbody></table></div>
            {ind.confidenceScore.score !== null && <p className="small">Confidence score over {ind.confidenceScore.n} answers: {ind.confidenceScore.score.toFixed(2)} <span className="muted">(Brier score: 0 is perfect, 0.25 is what always saying "50-50" earns; honest confidence scores best, overconfidence does not pay)</span></p>}
            {ind.highMisses.length > 0 && (
              <><p className="small">Recent answers you were sure of and missed. These are the most useful ones to look at again:</p>
                <ul className="plain small">{ind.highMisses.map(m => <li key={`${m.itemId}:${m.ts}`}>{new Date(m.ts).toLocaleDateString()} · {content.skillById.get(m.skillKey.slice(0, m.skillKey.lastIndexOf('.')))?.title ?? m.skillKey} <span className="muted">({m.skillKey.slice(m.skillKey.lastIndexOf('.') + 1)})</span></li>)}</ul></>)}
          </section>
          <section className="card">
            <h2>What the evidence says per skill</h2>
            <div className="tablewrap"><table className="table small"><thead><tr><th>Skill</th><th>Independent checks</th><th>Status</th></tr></thead>
              <tbody>{rows.map(([k, m]) => <tr key={k}><td>{content.skillById.get(k.slice(0, k.lastIndexOf('.')))?.title ?? k} <span className="muted">({k.slice(k.lastIndexOf('.') + 1)})</span></td><td>{m.n}</td><td>{describeMastery(m)}</td></tr>)}</tbody></table></div>
          </section>
          <section className="card">
            <h2>Why mistakes happen (your own diagnoses)</h2>
            {diag.length === 0 ? <p className="muted small">Review a game on <Link to="/games">Games review</Link> and say what was behind your biggest drops. A pattern across several games is stronger evidence than one.</p> : (
              <ul className="plain">{diag.map(([k, n]) => <li key={k}>{k}: <strong>{n}</strong></li>)}</ul>
            )}
          </section>
          <section className="card">
            <h2>Your notes</h2>
            {(reflections ?? []).length === 0 ? <p className="muted small">None yet.</p> : (
              <ul className="plain small">{(reflections ?? []).filter(r => Object.values(r.data).some(v => v && v.length > 3)).slice(0, 12).map(r => <li key={r.id}><span className="muted">{new Date(r.ts).toLocaleDateString()} · {r.kind}:</span> {Object.entries(r.data).filter(([k]) => !['game', 'ply'].includes(k)).map(([, v]) => v).filter(Boolean).join(' · ')}</li>)}</ul>
            )}
          </section>
        </>
      )}
      <Achievements />
    </div>
  )
}

/** The standalone page at #/record. Named for what it is, a record of evidence, so it is not mistaken for the mission progress on the Curriculum page. */
export function LearningRecord() {
  return (
    <main className="page wide">
      <h1>Learning record</h1>
      <ProgressReport />
    </main>
  )
}
