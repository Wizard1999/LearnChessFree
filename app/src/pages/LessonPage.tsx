import { Link, useParams } from 'react-router-dom'
import { useContent } from '../lib/content'
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
      <p className="muted small">About {lesson.minutes ?? 8} minutes · {lesson.review.status === 'human-reviewed' ? 'reviewed by a person' : 'machine-checked; not yet reviewed by a person'}</p>
      <LessonPlayer lesson={lesson} />
    </main>
  )
}
