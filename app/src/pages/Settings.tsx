import { useEffect, useState } from 'react'
import { exportAll, importAll, resetAll } from '../db'
import { loadAppearance, saveAppearance, type Appearance } from '../lib/appearance'
import { useStorageStatus } from '../lib/persist'
import { effectiveTrivial, loadNever, loadTrivial, showAgain } from '../lib/trivial'
import { useAttempts } from '../lib/progress'
import { db } from '../db'
import { loadReviewer, reviewFile, saveReviewer, sendReviews, feedbackEndpoint, type Reviewer } from '../lib/feedback'
import { useContent } from '../lib/content'
import { useLiveQuery } from 'dexie-react-hooks'
import { EMPTY_LOOP, LOOP_INFO, LOOP_LEVELS, loadLoop, RETIRE_AFTER, saveLoop, type LoopState } from '../lib/loop'

export function SettingsContent() {
  const [msg, setMsg] = useState<string | null>(null)
  const [loop, setLoop] = useState<LoopState>(EMPTY_LOOP)
  const storage = useStorageStatus()
  const { manifest } = useContent()
  const reviewCount = useLiveQuery(() => db.feedback.count(), [])
  const [reviewer, setReviewer] = useState<Reviewer>({ name: '', role: '' })
  const [hasEndpoint, setHasEndpoint] = useState(false)
  const [sendMsg, setSendMsg] = useState<string | null>(null)
  useEffect(() => { void loadReviewer().then(setReviewer); void feedbackEndpoint().then(u => setHasEndpoint(!!u)) }, [])
  async function downloadReviews() {
    const blob = new Blob([JSON.stringify(await reviewFile(manifest.hash), null, 1)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `chess-school-reviews-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(a.href)
  }
  const attempts = useAttempts()
  const [manual, setManual] = useState<string[]>([])
  const [never, setNever] = useState<string[]>([])
  const refreshTrivial = () => { void loadTrivial().then(setManual); void loadNever().then(setNever) }
  useEffect(refreshTrivial, [])
  const trivial = [...effectiveTrivial(attempts ?? [], manual, never)].sort()
  const [look, setLook] = useState<Appearance>(loadAppearance())
  const choose = <K extends keyof Appearance>(k: K, v: Appearance[K]) => { const n = { ...look, [k]: v }; setLook(n); saveAppearance(n) }
  useEffect(() => { void loadLoop().then(setLoop) }, [])

  async function doExport() {
    const data = await exportAll()
    const blob = new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `chess-school-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    setMsg(`Exported ${data.attempts.length} attempts, ${data.reflections.length} notes, ${data.games.length} games.`)
  }
  async function doImport(file: File | undefined) {
    if (!file) return
    try {
      const obj = JSON.parse(await file.text())
      if (!window.confirm('Importing replaces everything stored on this device. Continue?')) return
      await importAll(obj)
      setMsg('Import complete.')
    } catch (e) { setMsg(`Import failed: ${(e as Error).message}`) }
  }
  async function doReset() {
    if (!window.confirm('Delete all progress, notes and saved games on this device? Export first if you want a copy.')) return
    await resetAll(); setMsg('Everything on this device was deleted.')
  }

  return (
    <>
      <section className="card">
        <h2>Appearance</h2>
        <p className="small muted">Saved on this device only. These change how the app looks, never what it teaches.</p>
        {([
          ['style', 'Look', [['friendly', 'Friendly'], ['collegiate', 'Collegiate']]],
          ['theme', 'Theme', [['system', 'Same as my device'], ['light', 'Light'], ['dark', 'Dark']]],
          ['board', 'Board colours', [['warm', 'Warm'], ['sage', 'Sage'], ['contrast', 'High contrast']]],
          ['text', 'Text size', [['standard', 'Standard'], ['large', 'Large'], ['larger', 'Larger']]],
          ['motion', 'Motion', [['system', 'Same as my device'], ['reduce', 'Reduce motion']]],
        ] as [keyof Appearance, string, [string, string][]][]).map(([key, label, opts]) => (
          <fieldset key={key} className="appearance">
            <legend className="small muted">{label}</legend>
            <div className="options">{opts.map(([v, text]) => (
              <button key={v} type="button" className={look[key] === v ? 'chip on' : 'chip'} aria-pressed={look[key] === v} onClick={() => choose(key, v as never)}>{text}</button>
            ))}</div>
          </fieldset>
        ))}
      </section>
      <section className="card">
        <h2>Your progress saves itself</h2>
        <p>Everything you do is saved on this device as you go. You never need an account to learn here or to keep your progress. Nothing is sent anywhere, except that pressing "Fetch my latest games" on the My games page asks Lichess or Chess.com for your public games and so sends them the username you typed.</p>
        {storage && !storage.works && <p className="warn-text" role="alert">This browser is not storing anything (blocked site data does this). You can still learn, but your progress will be lost when you close the tab. Export a file before you leave.</p>}
        {storage?.works && storage.persisted === true && <p className="small muted">The browser has agreed to keep this data.</p>}
        {storage?.works && storage.persisted !== true && <p className="small muted">The browser may clear this data if the device runs short of space, and a private or incognito window deletes it when closed, so export a file now and then.</p>}
        <p>To use another device, or keep a copy, export a file here and import it there. It is plain JSON you can read without this app. Signing in to sync across devices is planned, not built yet (it needs a server; the roadmap tracks it).</p>
        <div className="row">
          <button type="button" className="primary" onClick={() => void doExport()}>Export everything</button>
          <label className="button">Import a file <input type="file" accept="application/json" hidden onChange={e => void doImport(e.target.files?.[0])} /></label>
          <button type="button" onClick={() => void doReset()}>Delete everything</button>
        </div>
        {msg && <p role="status">{msg}</p>}
      </section>
      <section className="card">
        <h2>Reviews</h2>
        <p className="small muted">You can review any lesson (the link under it) and report a problem with any exercise. Reviews are saved on this device. {hasEndpoint ? 'This copy can send them to the project.' : 'To share them, download the file and send it to the person who gave you this copy.'}</p>
        <div className="row">
          <label className="field"><span className="small muted">Your name (optional)</span><input type="text" value={reviewer.name} onChange={e => { const r = { ...reviewer, name: e.target.value }; setReviewer(r); void saveReviewer(r) }} /></label>
          <label className="field"><span className="small muted">You are</span><select value={reviewer.role} onChange={e => { const r = { ...reviewer, role: e.target.value as Reviewer['role'] }; setReviewer(r); void saveReviewer(r) }}><option value="">Prefer not to say</option><option value="strong-player">A strong player</option><option value="teacher">A teacher or coach</option><option value="learner">A learner</option><option value="other">Other</option></select></label>
        </div>
        <p>{reviewCount ?? 0} review{reviewCount === 1 ? '' : 's'} saved on this device.</p>
        <div className="row"><button type="button" onClick={() => void downloadReviews()} disabled={!reviewCount}>Download my reviews</button>{hasEndpoint && <button type="button" className="primary" disabled={!reviewCount} onClick={() => void sendReviews(manifest.hash).then(m => setSendMsg(m ?? 'Sent. Thank you.'))}>Send my reviews</button>}</div>
        {sendMsg && <p role="status">{sendMsg}</p>}
      </section>
      <section className="card">
        <h2>Skills left out of practice</h2>
        <p className="small muted">Skills you marked "too easy", or answered quickly and correctly five times in a row, are left out of mixed practice. Put any of them back; you can mark it too easy again later.</p>
        {trivial.length === 0 ? <p className="muted small">None.</p> : <ul className="plain small">{trivial.map(k => <li key={k}>{k} <button type="button" className="link" onClick={() => void showAgain(k).then(refreshTrivial)}>Show it again</button></li>)}</ul>}
      </section>
      <section className="card">
        <h2>Thinking prompts</h2>
        <p className="small">After you finish a Thinking Loop lesson, its prompt is offered during mixed practice. It goes away once you solve {RETIRE_AFTER} mixed exercises in a row without opening it (that number is a first guess). You can bring any of them back here.</p>
        <ul className="plain small">{LOOP_LEVELS.map(l => (
          <li key={l}>{LOOP_INFO[l].title}: {loop.retired[l] ? 'retired' : `${loop.streak[l] ?? 0} of ${RETIRE_AFTER} in a row`}
            {loop.retired[l] && <> <button type="button" className="link" onClick={async () => { const n = { retired: { ...loop.retired, [l]: false }, streak: { ...loop.streak, [l]: 0 } }; setLoop(n); await saveLoop(n) }}>Show it again</button></>}</li>
        ))}</ul>
      </section>
      <section className="card">
        <h2>About</h2>
        <ul>
          <li>The program is free software (GPL-3.0-or-later). The chess engine is Stockfish; the board is Chessground.</li>
          <li>Lessons are original text. Positions are checked by software (rules, engine, tablebases).</li>
          <li>Engine strength settings in the practice opponent are limits on the engine, not human ratings.</li>
        </ul>
      </section>
    </>
  )
}

/** The full-page version, kept so /settings still works as a direct link. */
export function Settings() {
  return <main className="page"><h1>Settings and your data</h1><SettingsContent /></main>
}
