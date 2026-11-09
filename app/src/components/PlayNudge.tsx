import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { db } from '../db'
import { useContent } from '../lib/content'
import { useLessonProgress } from '../lib/progress'
import { recentFinishedLessons, tryThisGame } from '../lib/keepPlaying'

/** True once the learner has finished any game (undefined while loading), so the nudge never appears before the first-game invitation has done its job. */
export function useHasPlayed(): boolean | undefined {
  return useLiveQuery(() => db.games.count().then(n => n > 0).catch(() => false), [])
}

/**
 * "Play a game today": the playing culture (D79) in one quiet line, on Today and in the Curriculum card. It names one thing from the most recent
 * lesson to look for. No streak, no counter, no pressure: it is a standing invitation, and it disappears into one short line when not needed.
 */
export function PlayNudge({ compact = false }: { compact?: boolean }) {
  const { lessonById } = useContent()
  const progress = useLessonProgress()
  const played = useHasPlayed()
  if (!played || !progress) return null
  const recent = recentFinishedLessons(progress, lessonById, 1)[0]
  const line = tryThisGame(recent)
  return (
    <section className={compact ? 'playnudge compact' : 'card playnudge'} aria-label="Play a game today">
      <p className="playnudge-head"><strong>Play a game today.</strong> Games are where lessons stick.</p>
      <p className="small"><strong>What to try this game:</strong> {line}</p>
      <p className="small playnudge-links"><Link to="/play">Play the practice opponent</Link> · <Link to="/people">Play real people</Link> · <Link to="/games#import">Review a game you played elsewhere</Link></p>
    </section>
  )
}
