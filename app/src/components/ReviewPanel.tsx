import { useEffect, useState } from 'react'
import { addFeedback, loadReviewer, saveReviewer, type Reviewer } from '../lib/feedback'
import { useContent } from '../lib/content'

const LESSON_CHECKS: [string, string][] = [
  ['sense', 'The lesson made sense from start to finish.'],
  ['boards', 'Every board matched what the text said about it.'],
  ['answers', 'Every exercise had the right answer, and the explanation was correct.'],
  ['unique', 'Nothing felt repeated from another lesson.'],
]
export const ITEM_KINDS = ['The answer is wrong', 'The board does not match the question', 'The explanation is wrong or unclear', 'Too easy or too hard here', 'A typo or wording problem', 'Something else']

/** A review form for one lesson (the checklist) or one exercise (what is wrong). Saved on this device; sent only when the reviewer chooses. */
export function ReviewPanel({ lessonId }: { lessonId: string }) {
  const { manifest } = useContent()
  const [open, setOpen] = useState(false)
  const [checks, setChecks] = useState<Record<string, string>>({})
  const [level, setLevel] = useState('')
  const [step, setStep] = useState('')
  const [text, setText] = useState('')
  const [rev, setRev] = useState<Reviewer>({ name: '', role: '' })
  const [saved, setSaved] = useState(false)
  useEffect(() => { void loadReviewer().then(setRev) }, [])
  async function save() {
    await saveReviewer(rev)
    await addFeedback({ targetType: 'lesson', targetId: lessonId, checks: { ...checks, ...(level ? { difficulty: level } : {}) }, step: step ? Number(step) : undefined, text }, manifest.hash)
    setSaved(true); setChecks({}); setLevel(''); setStep(''); setText('')
  }
  if (!open) return <p className="small"><button type="button" className="link" onClick={() => { setOpen(true); setSaved(false) }}>Review this lesson (check it for mistakes)</button></p>
  return (
    <section className="card review" aria-label="Review this lesson">
      <h2>Review this lesson</h2>
      <p className="small muted">Your answers are saved on this device. Send them from Settings → Reviews. Be as specific as you can: a step number and what you saw helps most.</p>
      {LESSON_CHECKS.map(([k, label]) => (
        <fieldset key={k} className="appearance"><legend className="small">{label}</legend>
          <div className="options">{['yes', 'no', 'unsure'].map(v => <button key={v} type="button" className={checks[k] === v ? 'chip on' : 'chip'} aria-pressed={checks[k] === v} onClick={() => setChecks(c => ({ ...c, [k]: v }))}>{v}</button>)}</div></fieldset>
      ))}
      <fieldset className="appearance"><legend className="small">The difficulty for the person this is aimed at:</legend>
        <div className="options">{['too easy', 'about right', 'too hard'].map(v => <button key={v} type="button" className={level === v ? 'chip on' : 'chip'} aria-pressed={level === v} onClick={() => setLevel(v)}>{v}</button>)}</div></fieldset>
      <label className="field"><span className="small muted">Which step (a number), if it is about one place</span><input type="number" min={1} value={step} onChange={e => setStep(e.target.value)} style={{ maxWidth: 120 }} /></label>
      <label className="field"><span className="small muted">What is wrong, or what would make it better</span><textarea rows={4} value={text} onChange={e => setText(e.target.value)} /></label>
      <div className="row">
        <label className="field"><span className="small muted">Your name (optional)</span><input type="text" value={rev.name} onChange={e => setRev({ ...rev, name: e.target.value })} /></label>
        <label className="field"><span className="small muted">You are</span>
          <select value={rev.role} onChange={e => setRev({ ...rev, role: e.target.value as Reviewer['role'] })}><option value="">Prefer not to say</option><option value="strong-player">A strong player</option><option value="teacher">A teacher or coach</option><option value="learner">A learner</option><option value="other">Other</option></select></label>
      </div>
      <div className="row"><button type="button" className="primary" disabled={!text.trim() && Object.keys(checks).length === 0 && !level} onClick={() => void save()}>Save my review</button><button type="button" onClick={() => setOpen(false)}>Close</button></div>
      {saved && <p role="status" className="ok-text">Saved on this device. Thank you.</p>}
    </section>
  )
}
