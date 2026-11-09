import { hueOfStrand } from '../lib/hue'
import { aboutMinutes, lessonMinutes } from '../lib/lessonTime'
import { paceText } from '../lib/measuredTime'
import { usePaceMedians } from '../lib/useStepTimes'
import { Link, useParams } from 'react-router-dom'
import { LessonLoading, useContent, useLesson } from '../lib/content'
import { db } from '../db'
import { LessonPlayer } from '../components/LessonPlayer'
import { connectionsFor } from '../lib/connections'
import type { LessonMeta } from '../types'
import { ReviewPanel } from '../components/ReviewPanel'
import { usePhone } from '../lib/usePhone'
import { Button, LinkButton } from '../components/Button'
import { RelevantSkills } from '../components/RelevantSkills'

function LessonBody({ meta }: { meta: LessonMeta }) {
  const { lesson, failed, retry } = useLesson(meta)
  const pace = paceText(lesson?.steps, usePaceMedians())
  return lesson ? <>{pace && <p className="muted small" data-testid="pace">{pace[0].toUpperCase() + pace.slice(1)}. Measured on this device from your own steps.</p>}<LessonPlayer lesson={lesson} /></> : <LessonLoading failed={failed} retry={retry} title={meta.title} />
}

export function LessonPage() {
  const phone = usePhone() // phones: the lesson tools fold so the board comes sooner (docs/mobile-design.md)
  const { id } = useParams()
  const { lessonById, skillById, lessons } = useContent()
  const lesson = id ? lessonById.get(id) : undefined
  if (!lesson) return <main className="page"><h1>Lesson not found</h1><p><Link to="/course">Back to the curriculum</Link></p></main>
  const sk = skillById.get(lesson.skill)
  const options = (
    <div className="lessontools toolbar">
      <Button variant="quiet" icon="last" tip="Count this lesson as done without doing it" onClick={() => void db.lessonProgress.put({ lessonId: lesson.id, step: lesson.stepCount, done: true, ts: Date.now(), skipped: true })}>Skip this lesson</Button>
      <Button variant="quiet" icon="check" tip="Record this lesson as finished" onClick={() => void db.lessonProgress.put({ lessonId: lesson.id, step: lesson.stepCount, done: true, ts: Date.now() })}>Mark finished</Button>
      <Button variant="quiet" icon="reset" className="btn-danger" tip="Erase your progress in this lesson and begin again" onClick={() => void db.lessonProgress.delete(lesson.id).then(() => location.reload())}>Start this lesson over</Button>
      <LinkButton to="/course?view=lessons" icon="menu">Curriculum list</LinkButton>
    </div>
  )
  return (
    <main className="page stage" data-hue={hueOfStrand(sk?.strand)}>
      <p className="small muted"><Link to="/course">Curriculum</Link> › {sk?.title ?? lesson.skill} › {lesson.depth}</p>
      <h1>{lesson.title}</h1>
      <p className="muted small">Planned: {aboutMinutes(lessonMinutes(lesson))}</p>
      {phone
        ? <details className="lessonmore small"><summary>Lesson options</summary>{options}</details>
        : options}
      <LessonBody key={lesson.id} meta={lesson} />
      <ReviewPanel key={`rev-${lesson.id}`} lessonId={lesson.id} />
      {lesson.course && <RelevantSkills lesson={lesson} />}
      {lesson.samePosition && lesson.samePosition.length > 0 && <p className="small muted" data-testid="same-position">This position also appears in the core lesson{lesson.samePosition.length > 1 ? 's' : ''} {lesson.samePosition.map((id, i) => <span key={id}>{i > 0 && ' · '}<Link to={`/lesson/${id}`}>{lessonById.get(id)?.title ?? id}</Link></span>)}.</p>}
      {(() => { const c = connectionsFor(lesson, lessons, skillById); const row = (label: string, ls: typeof lessons) => ls.length > 0 && <p className="small" key={label}><strong>{label}:</strong> {ls.map((l, i) => <span key={l.id}>{i > 0 && ' · '}<Link to={`/lesson/${l.id}`}>{l.title}</Link></span>)}</p>
        return (c.buildsOn.length + c.leadsTo.length + c.usedIn.length + c.uses.length > 0) && <section className="card connected" aria-label="Connected lessons"><h2>Connected lessons</h2><p className="small muted">Each idea is taught once; these lessons link to it or from it.</p>{row('Builds on', c.buildsOn)}{row('Uses', c.uses)}{row('Leads to', c.leadsTo)}{row('Seen in a course', c.usedIn)}</section> })()}
    </main>
  )
}
