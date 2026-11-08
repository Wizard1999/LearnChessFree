import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { db, kvGet, kvSet } from '../db'
import { useContent } from '../lib/content'
import { useLessonProgress } from '../lib/progress'
import { GENTLE_PLAY_PATH, INVITE_DISMISS_KEY, INVITE_PAUSE_MS, showInvite } from '../lib/firstGame'

/** Whether the invitation shows now (undefined while loading). Today uses it to hide its own quieter "Play now" while the card is up. */
export function useFirstGameInvite(): boolean | undefined {
  const { lessons } = useContent()
  const progress = useLessonProgress()
  const dismissedUntil = useLiveQuery(() => kvGet<number | null>(INVITE_DISMISS_KEY, null), [])
  const played = useLiveQuery(() => db.games.filter(g => g.source === 'practice').count().catch(() => 0), [])
  if (!progress || dismissedUntil === undefined || played === undefined) return undefined
  return showInvite({ lessons, progress, hasPlayed: played > 0, dismissedUntil, now: Date.now() })
}

/**
 * A quiet, optional invitation shown once the learner has finished L-FND-CHECK-1 or any lesson of the rules stage (lib/firstGame.ts). "Not yet"
 * hides it for a week. It is never a gate: no lesson, review or map position waits for it. It disappears for good after the learner has
 * finished a game against the practice opponent. The game it opens: Stockfish Beginner, the learner as White, hint button on (GENTLE_PLAY_PATH).
 */
export function FirstGameInvite() {
  const show = useFirstGameInvite()
  if (!show) return null
  return (
    <section className="card invite" aria-label="Play your first game">
      <h2 className="invite-title">Play your first game</h2>
      <p>You know enough to play a whole game. Want to try one now? It is optional.</p>
      <div className="row">
        <Link className="button primary" to={GENTLE_PLAY_PATH}>Play your first game</Link>
        <button type="button" onClick={() => void kvSet(INVITE_DISMISS_KEY, Date.now() + INVITE_PAUSE_MS)}>Not yet</button>
      </div>
      <p className="small muted">Against the gentlest computer setting (Stockfish Beginner), with a hint button. Nothing here depends on it.</p>
    </section>
  )
}
