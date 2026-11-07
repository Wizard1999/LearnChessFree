import { hueOfStage } from '../lib/hue'
import { ArtEmblem } from '../components/art'
import { aboutMinutes, lessonMinutes } from '../lib/lessonTime'
import { courseFacts, plannedCourses, withoutTypedCount, type PlannedCourse } from '../lib/displayText'
import { Link } from 'react-router-dom'
import { useContent, useCoursesStatus } from '../lib/content'
import { useLessonProgress } from '../lib/progress'
import { UpNextMark } from '../components/UpNextMark'

/** Courses promised but possibly not written yet. The list shown is whatever of these has no course in the courses file (plannedCourses). */
const PROMISED: PlannedCourse[] = [
  { id: 'famous-games', title: 'Famous games, annotated', note: 'Each game shows one idea deciding a real position; you predict the key moves first.' },
  { id: 'opening-deep-dives', title: 'Opening deep dives', note: 'One course per system: main line, traps, refutations of bad tries, typical plans.' },
  { id: 'history-and-meta', title: 'History and the opening meta', note: 'How ideas and popular openings changed, and why.' },
  { id: 'playstyles', title: 'Playstyles of great players', note: 'Only what the games measurably show.' },
  { id: 'advanced-club', title: 'Advanced club courses', note: 'Technique topics for stronger players.' },
]

/** Optional paths on top of the core curriculum. A course lesson is an ordinary lesson (it also appears under All lessons). */
export function CoursesView() {
  const content = useContent()
  const courses = useCoursesStatus()
  const progress = useLessonProgress()
  const planned = plannedCourses(PROMISED, content.courses)
  const done = new Set((progress ?? []).filter(p => p.done).map(p => p.lessonId))
  const unfinished = (c: (typeof content.courses)[number]) => c.lessons.filter(id => content.lessonById.has(id) && !done.has(id))
  // The course to continue: one already started, else the first with lessons left. Its first unfinished lesson is the next one.
  const started = content.courses.find(c => unfinished(c).length > 0 && unfinished(c).length < c.lessons.length)
  const upCourse = (started ?? content.courses.find(c => unfinished(c).length > 0))?.id
  return (
    <section aria-label="Courses">
      <p className="lede">Courses are optional paths on top of the core curriculum. They never re-teach a skill: each lesson says which core skills it uses.</p>
      {content.courses.map((c, ci) => {
        const ls = c.lessons.map(id => content.lessonById.get(id)).filter((l): l is NonNullable<typeof l> => !!l)
        const d = ls.filter(l => done.has(l.id)).length
        const nextLesson = c.id === upCourse ? unfinished(c)[0] : undefined
        const inner = (
          <>
            <h2><ArtEmblem seed={c.id} className="cover" />{c.title}</h2>
            <p className="small muted"><progress value={d} max={ls.length || 1} aria-label={`${d} of ${ls.length} lessons finished`} /> {d} of {ls.length} finished or skipped · {c.family} · {courseFacts(c, content.lessonById)}</p>
            <p>{withoutTypedCount(c.summary)}</p>
            {c.uses && c.uses.length > 0 && <p className="small muted">Uses: {c.uses.map(u => content.skillById.get(u)?.title ?? u).join(', ')}</p>}
            <ol className="plain">{ls.map(l => { const row = (<><span aria-hidden="true">{done.has(l.id) ? '✓' : '○'}</span><Link className={done.has(l.id) ? 'button' : 'button primary'} to={`/lesson/${l.id}`}>{done.has(l.id) ? 'Review' : 'Open'}</Link> <span><strong>{l.title}</strong> <span className="muted small">· {aboutMinutes(lessonMinutes(l))}</span></span></>); return l.id === nextLesson ? <UpNextMark as="li" key={l.id} skillId={l.skill} className="row">{row}</UpNextMark> : <li key={l.id} className="row">{row}</li> })}</ol>
          </>
        )
        return c.id === upCourse ? <UpNextMark key={c.id} className="card" data-hue={hueOfStage(ci + 1)}>{inner}</UpNextMark> : <div key={c.id} className="card" data-hue={hueOfStage(ci + 1)}>{inner}</div>
      })}
      {courses.failed && <p role="alert">The course list could not be downloaded. Check your connection, then <button type="button" className="link" onClick={() => void courses.retry()}>try again</button>.</p>}
      {!courses.failed && content.courses.length === 0 && <p className="muted">No courses are written yet.</p>}
      {!courses.failed && planned.length > 0 && <div className="card"><h2>Planned</h2><ul className="plain">{planned.map(p => <li key={p.id}><strong>{p.title}</strong> <span className="muted small">{p.note}</span></li>)}</ul></div>}
    </section>
  )
}
