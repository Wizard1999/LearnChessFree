import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { db, kvGet, kvSet } from '../db'
import { useContent } from '../lib/content'
import { useLessonProgress } from '../lib/progress'
import { GENTLE_PLAY_PATH, INVITE_DISMISS_KEY, INVITE_PAUSE_MS, showInvite } from '../lib/firstGame'

/**
 * A quiet, optional invitation shown once the lessons that teach the basic rules are finished. "Not yet" hides it for a week. It is never a gate:
 * no lesson, review or map position waits for it. It disappears for good after the learner has finished a game against the practice opponent.
 */
export function FirstGameInvite() {
  const { lessons } = useContent()
  const progress = useLessonProgress()
  const dismissedUntil = useLiveQuery(() => kvGet<number | null>(INVITE_DISMISS_KEY, null), [])
  const played = useLiveQuery(() => db.games.filter(g => g.source === 'practice').count().catch(() => 0), [])
  if (!progress || dismissedUntil === undefined || played === undefined) return null
  if (!showInvite({ lessons, progress, hasPlayed: played > 0, dismissedUntil, now: Date.now() })) return null
  return (
    <section className="card invite" aria-label="An invitation to play a game">
      <p><strong>You know enough to play a game.</strong> Want to try? It is optional.</p>
      <div className="row">
        <Link className="button primary" to={GENTLE_PLAY_PATH}>Play a gentle game</Link>
        <button type="button" onClick={() => void kvSet(INVITE_DISMISS_KEY, Date.now() + INVITE_PAUSE_MS)}>Not yet</button>
      </div>
      <p className="small muted">A gentle game is against the Beginner setting, with a hint button. Nothing here depends on it.</p>
    </section>
  )
}
