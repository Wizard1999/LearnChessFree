import { Link } from 'react-router-dom'
import { GENTLE_PLAY_PATH, anyLessonDone } from '../lib/firstGame'
import type { LessonProgress } from '../db'
import type { LessonMeta } from '../types'

/** The Continue strip above the curriculum (D61): the next lesson, plus at most two chips, a review and a game. It takes over what the Today page did. */
export function ContinueStrip({ lesson, progress, reviewReady }: { lesson?: LessonMeta; progress: LessonProgress[]; reviewReady: boolean }) {
  const started = !!lesson && progress.some(p => p.lessonId === lesson.id && !p.done && p.step > 0)
  const play = anyLessonDone(progress)
  if (!lesson && !reviewReady && !play) return null
  return (
    <section className="continuestrip" aria-label="Continue">
      {lesson
        ? <Link className="button primary" to={`/lesson/${lesson.id}`}>{started ? 'Continue' : 'Next'}: {lesson.title}</Link>
        : <span className="muted">Every lesson open to you now is finished.</span>}
      {reviewReady && <Link className="chip" to="/course?win=challenge">Review</Link>}
      {play && <Link className="chip" to={GENTLE_PLAY_PATH}>Play</Link>}
    </section>
  )
}
