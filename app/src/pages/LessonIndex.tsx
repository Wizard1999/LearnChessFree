import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../db'
import { useContent } from '../lib/content'
import { lessonSort, useLessonProgress } from '../lib/progress'
import { STRAND_NAMES } from '../lib/missions'

type Filter = 'all' | 'todo' | 'done'

const mins = (l: { minutes?: number }) => l.minutes ?? 8
const fmt = (m: number) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60 ? `${m % 60} min` : ''}`.trim())

/** Every lesson on one page: find it, open it, or mark it finished, skipped or unstarted. Nothing is locked. */
export function LessonIndex() {
  const content = useContent()
  const progress = useLessonProgress()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const byId = useMemo(() => new Map((progress ?? []).map(p => [p.lessonId, p])), [progress])
  const groups = useMemo(() => {
    const sorted = [...content.lessons].sort((a, b) => lessonSort(a, b, content.skillById))
    const m = new Map<string, typeof sorted>()
    for (const l of sorted) {
      const sk = content.skillById.get(l.skill)
      const text = `${l.title} ${sk?.title ?? ''} ${l.skill}`.toLowerCase()
      const done = byId.get(l.id)?.done
      if (q && !text.includes(q.toLowerCase())) continue
      if (filter === 'done' && !done) continue
      if (filter === 'todo' && done) continue
      const strand = sk?.strand ?? '?'
      m.set(strand, [...(m.get(strand) ?? []), l])
    }
    return [...m.entries()].sort((a, b) => Number(a[0].slice(1)) - Number(b[0].slice(1)))
  }, [content, byId, q, filter])
  const doneCount = content.lessons.filter(l => byId.get(l.id)?.done).length
  const totalMin = content.lessons.reduce((t, l) => t + mins(l), 0)
  const doneMin = content.lessons.filter(l => byId.get(l.id)?.done).reduce((t, l) => t + mins(l), 0)
  const mark = (id: string, steps: number, skipped: boolean) => db.lessonProgress.put({ lessonId: id, step: steps, done: true, ts: Date.now(), skipped })
  const reset = (id: string) => db.lessonProgress.delete(id)

  return (
    <section aria-label="Lesson index">
      <div className="card overallbar">
        <div className="sectionhead"><strong>Whole curriculum</strong><span className="muted small">{fmt(totalMin)} of lessons in all · {fmt(Math.max(0, totalMin - doneMin))} left</span></div>
        <p className="small muted"><progress value={doneCount} max={content.lessons.length || 1} aria-label={`${doneCount} of ${content.lessons.length} lessons finished`} /> {doneCount} of {content.lessons.length} lessons finished or skipped ({Math.round((100 * doneCount) / (content.lessons.length || 1))}%)</p>
        <p className="small muted">S1, S2 and so on are the sections (strands) of the curriculum, in teaching order.</p>
      </div>
      <p className="lede">{content.lessons.length} lessons, {doneCount} finished or skipped. Open any of them at any time. Marking a lesson finished or skipped only changes this list and the curriculum map; it does not count as evidence that you know the skill.</p>
      <div className="row filters">
        <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search lessons" aria-label="Search lessons" />
        {(['all', 'todo', 'done'] as Filter[]).map(f => <button key={f} type="button" className={filter === f ? 'chip on' : 'chip'} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f === 'all' ? 'All' : f === 'todo' ? 'To do' : 'Finished or skipped'}</button>)}
      </div>
      {groups.length === 0 && <p className="muted">No lessons match.</p>}
      {groups.map(([strand, ls]) => (
        <div key={strand} className="card">
          {(() => { const all = content.lessons.filter(l => content.skillById.get(l.skill)?.strand === strand); const t = all.reduce((x, l) => x + mins(l), 0); return (
            <div className="sectionhead"><h2>{strand} · {STRAND_NAMES[strand] ?? strand}</h2><span className="muted small" title="Total length of every lesson in this section">{all.length} lessons · {fmt(t)}</span></div>) })()}
          {(() => { const all = content.lessons.filter(l => content.skillById.get(l.skill)?.strand === strand); const d = all.filter(l => byId.get(l.id)?.done).length; return (
            <p className="small muted"><progress value={d} max={all.length || 1} aria-label={`${d} of ${all.length} lessons finished`} /> {d} of {all.length} finished or skipped</p>) })()}
          <ul className="plain lessonindex">
            {ls.map(l => {
              const p = byId.get(l.id)
              const status = p?.done ? (p.skipped ? 'Skipped' : 'Finished') : p && p.step > 0 ? `In progress (step ${p.step + 1} of ${l.steps.length})` : 'Not started'
              return (
                <li key={l.id} className={`row lessonrow ${p?.done ? (p.skipped ? 'skipped' : 'finished') : p && p.step > 0 ? 'inprogress' : 'todo'}`}>
                  <span className="statusmark" aria-hidden="true">{p?.done ? (p.skipped ? '»' : '✓') : p && p.step > 0 ? '◐' : '○'}</span>
                  <Link className={p?.done ? 'button' : p && p.step > 0 ? 'button primary' : 'button'} to={`/lesson/${l.id}`} aria-label={`Open lesson: ${l.title}`}>{p?.done ? 'Review' : p && p.step > 0 ? 'Continue' : 'Open'}</Link>
                  <span><strong>{l.title}</strong> <span className="muted small">· {content.skillById.get(l.skill)?.title ?? l.skill} · {l.minutes ?? 8} min · {status}</span></span>
                  <span className="actions">
                    {!p?.done && <><button type="button" className="link" onClick={() => void mark(l.id, l.steps.length, false)}>Mark finished</button> <button type="button" className="link" onClick={() => void mark(l.id, l.steps.length, true)}>Skip</button></>}
                    {(p?.done || (p && p.step > 0)) && <button type="button" className="link" onClick={() => void reset(l.id)}>Reset</button>}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </section>
  )
}
