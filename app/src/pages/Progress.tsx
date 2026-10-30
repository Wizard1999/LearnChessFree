import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { db } from '../db'
import { useContent } from '../lib/content'
import { describeMastery } from '../lib/mastery'
import { independenceSentence } from '../lib/labels'
import { independence, masteryMap, useAttempts, useLessonProgress } from '../lib/progress'
import { stageProgress } from '../lib/stageProgress'
import { Achievements } from './Achievements'

const DAY = 86400000
const pct = (x: number | null) => (x === null ? '—' : `${Math.round(x * 100)}%`)

export function Progress() {
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

  const calib = useMemo(() => {
    const out = (['low', 'medium', 'high'] as const).map(c => { const xs = firsts.filter(a => a.confidence === c); return { c, n: xs.length, ok: xs.filter(a => a.correct).length } })
    return out
  }, [firsts])
  const diag = useMemo(() => { const m = new Map<string, number>(); for (const r of reflections ?? []) if (r.kind === 'diagnosis') m.set(r.data.cause, (m.get(r.data.cause) ?? 0) + 1); return [...m.entries()].sort((a, b) => b[1] - a[1]) }, [reflections])
  const ind = independence(attempts ?? [])
  const rows = useMemo(() => [...masteries.entries()].sort((a, b) => b[1].n - a[1].n), [masteries])

  if (!attempts) return <main className="page"><h1 className="sr-only">Loading</h1><p className="muted">Loading…</p></main>
  return (
    <main className="page wide">
      <h1>Your progress</h1>
      <p className="lede">Evidence that you can do things on your own. Nothing here is a rating.</p>
      {stages.some(s => s.lessons > 0) && (
        <section className="card pathstages">
          <h2>Your path</h2>
          <p className="small muted">Eight stages, in order. "Lessons finished" counts lessons you completed or marked done. "Shown in exercises" counts skills where your answers, without hints, reached Level one or better. A finished lesson is not proof that you can use the idea.</p>
          <ol className="pathlist">{stages.map(s => (
            <li key={s.id} className={s.current ? 'pathstage current' : 'pathstage'} aria-current={s.current ? 'step' : undefined}>
              <h3>Stage {s.index}: {s.title}{s.current && <span className="badge">You are here</span>}</h3>
              <p className="small">{s.milestone}</p>
              <p className="small muted">Lessons finished: <strong>{s.finished} of {s.lessons}</strong>{s.skipped > 0 && ` (${s.skipped} marked done without doing)`} · Shown in exercises: <strong>{s.shown} of {s.skills}</strong> skills</p>
            </li>))}
          </ol>
        </section>
      )}
      {firsts.length === 0 ?<section className="card"><p>No exercises answered yet. <Link to="/">Start with today's plan</Link>.</p></section> : (
        <>
          <section className="card">
            <h2>Hints and independence</h2>
            <p>{independenceSentence(ind.counted, ind.hintRate, ind.unpromptedAccuracy)} <strong>Success looks like hint use falling while accuracy holds.</strong> Needing more help on harder material is normal.</p>
            <p className="small muted">Unlabeled means the exercise does not tell you which idea to use.</p>
            <details><summary>Week by week</summary><div className="tablewrap"><table className="table small"><thead><tr><th>Week of</th><th>Exercises</th><th>Unlabeled</th><th>With hints</th><th>Right without hints</th></tr></thead>
              <tbody>{weekly.map(([wk, r]) => <tr key={wk}><td>{new Date(wk * 7 * DAY).toLocaleDateString()}</td><td>{r.n}</td><td>{r.cued}</td><td>{pct(r.cued ? r.hints / r.cued : null)}</td><td>{pct(r.unp ? r.ok / r.unp : null)} <span className="muted">({r.ok}/{r.unp})</span></td></tr>)}</tbody></table></div></details>
          </section>
          <section className="card">
            <h2>Does your confidence match your results?</h2>
            <p className="small muted">Before answering unlabeled exercises you can mark how sure you are. If "high" is right far more often than "low", your sense of what you know is trustworthy; if not, that is useful to learn.</p>
            <div className="tablewrap"><table className="table small"><thead><tr><th>You said</th><th>Answers</th><th>Right</th></tr></thead>
              <tbody>{calib.map(c => <tr key={c.c}><td>{c.c}</td><td>{c.n}</td><td>{c.n ? `${Math.round((c.ok / c.n) * 100)}%` : '—'} <span className="muted">({c.ok}/{c.n})</span></td></tr>)}</tbody></table></div>
            {ind.calibrationError !== null && <p className="small muted">Average gap between confidence and outcome: {ind.calibrationError.toFixed(2)} (lower is better; this is a rough measure on a few answers).</p>}
          </section>
          <section className="card">
            <h2>What the evidence says per skill</h2>
            <div className="tablewrap"><table className="table small"><thead><tr><th>Skill</th><th>Counted</th><th>Status</th></tr></thead>
              <tbody>{rows.map(([k, m]) => <tr key={k}><td>{content.skillById.get(k.slice(0, k.lastIndexOf('.')))?.title ?? k} <span className="muted">({k.slice(k.lastIndexOf('.') + 1)})</span></td><td>{m.n}</td><td>{describeMastery(m)}</td></tr>)}</tbody></table></div>
          </section>
          <section className="card">
            <h2>Why mistakes happen (your own diagnoses)</h2>
            {diag.length === 0 ? <p className="muted small">Review a game on <Link to="/games">My games</Link> and say what was behind your biggest drops. A pattern across several games is stronger evidence than one.</p> : (
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
    </main>
  )
}
