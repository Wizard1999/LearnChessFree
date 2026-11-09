import { useEffect, useMemo, useState } from 'react'
import { ArtScene } from './art'
import { Link } from 'react-router-dom'
import { db } from '../db'
import { getEngine } from '../engine'
import { useContent } from '../lib/content'
import { analysePlies, type Analysis } from '../lib/gameAnalysis'
import { plyList, type Ply } from '../lib/pgn'
import { useLessonProgress } from '../lib/progress'
import { findStrength, followUpLesson, pickCritical, type Side } from '../lib/postGame'
import { safeWrite } from '../lib/saveStatus'

type Status = 'running' | 'done' | 'unavailable'

/**
 * The short screen after a game against the practice opponent: one thing done well (only if a detector found it), one key moment (the biggest
 * drop, filled in when the engine has finished looking, so the screen never waits), a lesson to look at next, and a way to play again.
 */
export function PostGame({ gameId, pgn, color, reason, onAgain, onSettings }: { gameId: number; pgn: string; color: Side; reason: string; onAgain: () => void; onSettings: () => void }) {
  const { lessons } = useContent()
  const progress = useLessonProgress()
  const plies = useMemo<Ply[]>(() => { try { return plyList(pgn) } catch { return [] } }, [pgn])
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [status, setStatus] = useState<Status>(plies.length >= 2 ? 'running' : 'done')

  useEffect(() => {
    if (plies.length < 2) return
    let live = true
    setAnalysis(null); setStatus('running')
    analysePlies(plies, getEngine(), { cancelled: () => !live })
      .then(a => { if (!live) return; setAnalysis(a); setStatus('done'); if (a) void safeWrite(() => db.games.update(gameId, { analysis: a })) })
      .catch(() => { if (live) setStatus('unavailable') })
    return () => { live = false }
  }, [plies, gameId])

  const strength = useMemo(() => findStrength(plies, color), [plies, color])
  const critical = useMemo(() => pickCritical(plies, analysis, color), [plies, analysis, color])
  const doneIds = useMemo(() => new Set((progress ?? []).filter(p => p.done).map(p => p.lessonId)), [progress])
  const follow = useMemo(() => (progress ? followUpLesson(lessons, critical?.skill ?? null, id => doneIds.has(id)) : null), [lessons, progress, critical, doneIds])
  const moveLabel = critical ? `${critical.moveNumber}${plies[critical.k]?.color === 'b' ? '...' : '.'} ${critical.san}` : ''

  return (
    <section className="card postgame" aria-label="After the game">
      <ArtScene kind="postgame" />
      <h2>The game is over</h2>
      <p>{reason} It is saved in <Link to="/games">My games</Link>.</p>
      <p><Link className="button primary" to={`/analysis?game=${gameId}`}>Review this game</Link></p>
      {strength && <p><strong>Something you did well.</strong> {strength.text}</p>}
      {plies.length >= 2 && (
        <div className="postmoment" aria-live="polite">
          <h3>One moment worth a look</h3>
          {critical ? (
            <>
              <p><strong>{moveLabel}.</strong> {critical.explanation}</p>
              <p><Link className="button" to={`/analysis?game=${gameId}&ply=${critical.k + 1}`}>See it on the board</Link></p>
            </>
          ) : status === 'running' ? <p className="muted">The engine is looking through the game for the key moment…</p>
            : status === 'unavailable' ? <p className="muted">The engine could not start here, so there is no key moment this time. You can analyse the game later from My games.</p>
            : <p className="muted">By the engine's count, none of your moves lost a pawn or more. That is a good sign for this game.</p>}
          {critical && <p className="small muted">The engine's number is evidence about the position, not an explanation of why. Looking at it on the board is where the learning is.</p>}
        </div>
      )}
      {follow && (
        <p>{follow.reason === 'skill' ? 'A lesson on this pattern:' : 'A good next lesson:'} <Link to={`/lesson/${follow.lesson.id}`}>{follow.lesson.title}</Link></p>
      )}
      <div className="row">
        <button type="button" className="primary" onClick={onAgain}>Play again</button>
        <button type="button" onClick={onSettings}>Change settings</button>
      </div>
    </section>
  )
}
