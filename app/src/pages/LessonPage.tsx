import { Link, useParams } from 'react-router-dom'
import { useContent } from '../lib/content'
import { db } from '../db'
import { LessonPlayer } from '../components/LessonPlayer'
import { connectionsFor } from '../lib/connections'
import { ReviewPanel } from '../components/ReviewPanel'

export function LessonPage() {
  const { id } = useParams()
  const { lessonById, skillById, lessons } = useContent()
  const lesson = id ? lessonById.get(id) : undefined
  if (!lesson) return <main className="page"><h1>Lesson not found</h1><p><Link to="/course">Back to the curriculum</Link></p></main>
  const sk = skillById.get(lesson.skill)
  return (
    <main className="page">
      <p className="small muted"><Link to="/course">Curriculum</Link> › {sk?.title ?? lesson.skill} › {lesson.depth}</p>
      <h1>{lesson.title}</h1>
      <p className="muted small">About {lesson.minutes ?? 8} minutes</p>
      <p className="small"><button type="button" className="link" onClick={() => void db.lessonProgress.put({ lessonId: lesson.id, step: lesson.steps.length, done: true, ts: Date.now(), skipped: true })}>Skip this lesson</button> · <button type="button" className="link" onClick={() => void db.lessonProgress.put({ lessonId: lesson.id, step: lesson.steps.length, done: true, ts: Date.now() })}>Mark finished</button> · <button type="button" className="link" onClick={() => void db.lessonProgress.delete(lesson.id).then(() => location.reload())}>Reset</button> · <Link to="/course">All lessons</Link></p>
      <LessonPlayer key={lesson.id} lesson={lesson} />
      <ReviewPanel key={`rev-${lesson.id}`} lessonId={lesson.id} />
      {(() => { const c = connectionsFor(lesson, lessons, skillById); const row = (label: string, ls: typeof lessons) => ls.length > 0 && <p className="small" key={label}><strong>{label}:</strong> {ls.map((l, i) => <span key={l.id}>{i > 0 && ' · '}<Link to={`/lesson/${l.id}`}>{l.title}</Link></span>)}</p>
        return (c.buildsOn.length + c.leadsTo.length + c.usedIn.length + c.uses.length > 0) && <section className="card connected" aria-label="Connected lessons"><h2>Connected lessons</h2><p className="small muted">Each idea is taught once; these lessons link to it or from it.</p>{row('Builds on', c.buildsOn)}{row('Uses', c.uses)}{row('Leads to', c.leadsTo)}{row('Seen in a course', c.usedIn)}</section> })()}
    </main>
  )
}
