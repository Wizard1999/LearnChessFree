import { lessonMinutes } from '../lib/lessonTime'
import { Link } from 'react-router-dom'
import { useContent } from '../lib/content'
import { useLessonProgress } from '../lib/progress'

const PLANNED = [
  ['Famous games, annotated', 'Each game shows one idea deciding a real position; you predict the key moves first.'],
  ['Opening deep dives', 'One course per system: main line, traps, refutations of bad tries, typical plans.'],
  ['History and the opening meta', 'How ideas and popular openings changed, and why.'],
  ['Playstyles of great players', 'Only what the games measurably show.'],
  ['Advanced club courses', 'Technique topics for stronger players.'],
]

/** Optional paths on top of the core curriculum. A course lesson is an ordinary lesson (it also appears under All lessons). */
export function CoursesView() {
  const content = useContent()
  const progress = useLessonProgress()
  const done = new Set((progress ?? []).filter(p => p.done).map(p => p.lessonId))
  return (
    <section aria-label="Courses">
      <p className="lede">Courses are optional paths on top of the core curriculum. They never re-teach a skill: each lesson says which core skills it uses.</p>
      {content.courses.map(c => {
        const ls = c.lessons.map(id => content.lessonById.get(id)).filter((l): l is NonNullable<typeof l> => !!l)
        const d = ls.filter(l => done.has(l.id)).length
        return (
          <div key={c.id} className="card">
            <h2>{c.title}</h2>
            <p className="small muted"><progress value={d} max={ls.length || 1} aria-label={`${d} of ${ls.length} lessons finished`} /> {d} of {ls.length} finished or skipped · {c.family}</p>
            <p>{c.summary}</p>
            {c.uses && c.uses.length > 0 && <p className="small muted">Uses: {c.uses.map(u => content.skillById.get(u)?.title ?? u).join(', ')}</p>}
            <ol className="plain">{ls.map(l => <li key={l.id} className="row"><span aria-hidden="true">{done.has(l.id) ? '✓' : '○'}</span><Link className={done.has(l.id) ? 'button' : 'button primary'} to={`/lesson/${l.id}`}>{done.has(l.id) ? 'Review' : 'Open'}</Link> <span><strong>{l.title}</strong> <span className="muted small">· {lessonMinutes(l)} min</span></span></li>)}</ol>
          </div>
        )
      })}
      {content.courses.length === 0 && <p className="muted">No courses are written yet.</p>}
      <div className="card"><h2>Planned</h2><ul className="plain">{PLANNED.map(([t, d]) => <li key={t}><strong>{t}</strong> <span className="muted small">{d}</span></li>)}</ul></div>
    </section>
  )
}
