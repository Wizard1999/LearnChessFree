import { useEffect, useState } from 'react'
import { db, kvGet, kvSet } from '../db'
import { dateKey } from '../lib/daily'

/** The optional one-line aim for today (it moved here from the Today page into the Full report, D62). Same storage keys as before, so earlier aims still show. */
export function AimCard() {
  const day = dateKey()
  const [intention, setIntention] = useState<string | null | undefined>(undefined) // undefined = loading, '' = not set yet, null = skipped
  const [draft, setDraft] = useState('')
  useEffect(() => { void kvGet<string | null>(`daily:${day}:intention`, '').then(setIntention) }, [day])
  async function save(text: string | null) {
    setIntention(text); await kvSet(`daily:${day}:intention`, text)
    if (text) await db.reflections.add({ kind: 'intention', data: { text }, ts: Date.now() })
  }
  return (
    <details className="card aimcard" open={!!intention}>
      <summary>Set your own aim for today <span className="muted small">· optional</span></summary>
      {intention === undefined ? <p className="muted">Loading…</p> : intention === null ? (
        <p className="muted">You skipped this today. <button type="button" className="link" onClick={() => void save('')}>Set one now</button></p>
      ) : intention !== '' ? (
        <p>{intention} <button type="button" className="link" onClick={() => { setDraft(intention); void save('') }}>Change</button></p>
      ) : (
        <>
          <p className="small muted">What would you like to work on today, and why? One line. Deciding for yourself, even badly, is a skill you are building here. "No idea" is a fine answer.</p>
          <div className="row"><input type="text" value={draft} onChange={e => setDraft(e.target.value)} placeholder="e.g. Stop hanging pieces. I lost two games to it this week." aria-label="Your aim for today" />
            <button type="button" className="primary" disabled={!draft.trim()} onClick={() => { void save(draft.trim()); setDraft('') }}>Save</button>
            <button type="button" onClick={() => void save(null)}>Skip</button></div>
        </>
      )}
    </details>
  )
}
