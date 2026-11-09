import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { db } from '../db'
import { useContent } from '../lib/content'
import { useLessonProgress } from '../lib/progress'
import { safeWrite } from '../lib/saveStatus'
import { GAME_TAGS, gameLessonReflection, recentFinishedLessons, type GameTagId } from '../lib/keepPlaying'

/**
 * After a game: "Which of your recent lessons showed up in this game?" Up to three recent lessons, four quick tags each, saved on this device as a
 * reflection that appears in the Learning record notes. It asks about the learner's own lessons and says nothing about the game itself, so it needs no engine.
 */
export function GameLessonPrompt({ gameId }: { gameId: number }) {
  const { lessonById } = useContent()
  const progress = useLessonProgress()
  const mine = useLiveQuery(() => db.reflections.where('kind').equals('game-lesson').filter(r => r.data.game === String(gameId)).toArray(), [gameId])
  if (!progress || !mine) return null
  const recent = recentFinishedLessons(progress, lessonById, 3)
  if (recent.length === 0) return null
  const chosen = new Map(mine.map(r => [r.lessonId, r.data.tag as GameTagId]))
  const pick = async (lessonId: string, tag: GameTagId) => {
    const lesson = lessonById.get(lessonId); if (!lesson) return
    const old = mine.find(r => r.lessonId === lessonId)
    await safeWrite(async () => { if (old?.id !== undefined) await db.reflections.delete(old.id); await db.reflections.add(gameLessonReflection(tag, lesson, gameId)) })
  }
  return (
    <section className="gamelesson" aria-label="Which lessons showed up">
      <h3>Which of your recent lessons showed up in this game?</h3>
      <p className="small muted">Thinking back is part of the lesson. Saved on this device only.</p>
      <ul className="plain">{recent.map(l => (
        <li key={l.id}>
          <strong>{l.title}</strong>
          <span className="seg" role="group" aria-label={`Did ${l.title} show up?`}>
            {GAME_TAGS.map(t => <button key={t.id} type="button" aria-pressed={chosen.get(l.id) === t.id} onClick={() => void pick(l.id, t.id)}>{t.label}</button>)}
          </span>
        </li>))}
      </ul>
      <p className="small muted">Played this one somewhere else? <Link to="/games#import">Review a game you played elsewhere</Link>.</p>
    </section>
  )
}
