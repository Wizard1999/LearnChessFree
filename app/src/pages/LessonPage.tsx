import { Link, useParams } from 'react-router-dom'
import { useContent } from '../lib/content'
import { db } from '../db'
import { LessonPlayer } from '../components/LessonPlayer'

export function LessonPage() {
  const { id } = useParams()
  const { lessonById, skillById } = useContent()
  const lesson = id ? lessonById.get(id) : undefined
  if (!lesson) return <main className="page"><h1>Lesson not found</h1><p><Link to="/course">Back to the course</Link></p></main>
  const sk = skillById.get(lesson.skill)
  return (
    <main className="page">
      <p className="small muted"><Link to="/course">Course</Link> › {sk?.title ?? lesson.skill} › {lesson.depth}</p>
      <h1>{lesson.title}</h1>
      <p className="muted small">About {lesson.minutes ?? 8} minutes</p>
      <p className="small"><button type="button" className="link" onClick={() => void db.lessonProgress.put({ lessonId: lesson.id, step: lesson.steps.length, done: true, ts: Date.now(), skipped: true })}>Skip this lesson</button> · <button type="button" className="link" onClick={() => void db.lessonProgress.put({ lessonId: lesson.id, step: lesson.steps.length, done: true, ts: Date.now() })}>Mark finished</button> · <button type="button" className="link" onClick={() => void db.lessonProgress.delete(lesson.id).then(() => location.reload())}>Reset</button> · <Link to="/course">All lessons</Link></p>
      <LessonPlayer key={lesson.id} lesson={lesson} />
    </main>
  )
}
