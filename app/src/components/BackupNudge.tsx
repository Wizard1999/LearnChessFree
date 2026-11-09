import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { shouldNudgeBackup } from '../lib/backup'
import { backupTimes, noteBackupNudge } from '../lib/backupIO'

/** A one-line reminder to back up: after the first finished lesson, then at most once a week while there is new progress. */
export function BackupNudge() {
  const facts = useLiveQuery(async () => {
    const progress = await db.lessonProgress.toArray()
    const lastAttempt = await db.attempts.orderBy('ts').last()
    return { finished: progress.filter(p => p.done && !p.skipped).length, latest: Math.max(lastAttempt?.ts ?? 0, ...progress.map(p => p.ts), 0) }
  }, [])
  const [times, setTimes] = useState<{ lastBackupTs?: number; lastNudgeTs?: number } | null>(null)
  const [hidden, setHidden] = useState(false)
  useEffect(() => { void backupTimes().then(setTimes).catch(() => setTimes({})) }, [])
  if (hidden || !facts || !times) return null
  if (!shouldNudgeBackup({ now: Date.now(), finished: facts.finished, latestProgressTs: facts.latest, ...times })) return null
  const acted = () => { void noteBackupNudge(); setHidden(true) }
  return (
    <p className="small backupnudge">
      <Link to="/settings" onClick={acted}>Back up your progress</Link> <span className="muted">(a file you keep; it is saved only on this device now).</span>{' '}
      <button type="button" className="btn btn-quiet" onClick={acted}>Not now</button>
    </p>
  )
}
