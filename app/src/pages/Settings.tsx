import { useEffect, useState } from 'react'
import { exportAll, importAll, resetAll } from '../db'
import { loadAppearance, saveAppearance, type Appearance } from '../lib/appearance'
import { EMPTY_LOOP, LOOP_INFO, LOOP_LEVELS, loadLoop, RETIRE_AFTER, saveLoop, type LoopState } from '../lib/loop'

export function Settings() {
  const [msg, setMsg] = useState<string | null>(null)
  const [loop, setLoop] = useState<LoopState>(EMPTY_LOOP)
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
    <main className="page">
      <h1>Settings and your data</h1>
      <section className="card">
        <h2>Your data stays with you</h2>
        <p>Progress, notes and games are stored only in this browser. There is no account. Nothing is sent anywhere, except that pressing "Fetch my latest games" on the My games page asks Lichess or Chess.com for your public games and so sends them the username you typed. Export a file regularly: it is plain JSON you can read without this app, and importing it restores everything.</p>
        <div className="row">
          <button type="button" className="primary" onClick={() => void doExport()}>Export everything</button>
          <label className="button">Import a file <input type="file" accept="application/json" hidden onChange={e => void doImport(e.target.files?.[0])} /></label>
          <button type="button" onClick={() => void doReset()}>Delete everything</button>
        </div>
        {msg && <p role="status">{msg}</p>}
      </section>
      <section className="card">
        <h2>Appearance</h2>
        <p className="small muted">Saved on this device only. These change how the app looks, never what it teaches.</p>
        {([
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
          <li>Lessons are original text. Positions are checked by software (rules, engine, tablebases). A strong human reviewer has not yet checked the explanations unless an item says so.</li>
          <li>Engine strength settings in the practice opponent are limits on the engine, not human ratings.</li>
        </ul>
      </section>
    </main>
  )
}
