import { useState } from 'react'
import { LOOP_INFO, type LoopLevel } from '../lib/loop'

/**
 * The Thinking Loop prompts for the levels given. `shown` panels are printed beside the board (loop lessons);
 * otherwise the learner has to ask for them, and the item records that they did.
 */
export function LoopPanel({ levels, shown, open, onOpen }: { levels: LoopLevel[]; shown: boolean; open: boolean; onOpen: () => void }) {
  const [candidates, setCandidates] = useState('')
  if (levels.length === 0) return null
  const visible = shown || open
  if (!visible) return (
    <div className="row loop">
      <button type="button" onClick={onOpen}>Show my {levels.length === 1 ? LOOP_INFO[levels[0]].title.toLowerCase() : 'thinking prompts'}</button>
      <span className="muted small">Optional. Opening it is noted, so you can see how much you lean on it.</span>
    </div>
  )
  return (
    <aside className="card loop" aria-label="Thinking prompts">
      {levels.map(l => (
        <div key={l}>
          <h4>{LOOP_INFO[l].title}</h4>
          <ol>{LOOP_INFO[l].lines.map(t => <li key={t}>{t}</li>)}</ol>
          {LOOP_INFO[l].candidateBox && <label className="field"><span className="small muted">Your candidate list (stays on this page; nothing is saved)</span><textarea rows={2} value={candidates} onChange={e => setCandidates(e.target.value)} /></label>}
        </div>
      ))}
    </aside>
  )
}
