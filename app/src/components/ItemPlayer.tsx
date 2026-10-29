import { useEffect, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import type { Key } from 'chessground/types'
import { ChessBoard, type BoardShape } from './ChessBoard'
import { LinePlayer } from './LinePlayer'
import { PlayOut } from './PlayOut'
import { LoopPanel } from './LoopPanel'
import { getEngine, resetEngine } from '../engine'
import { addTrivial } from '../lib/trivial'
import { addFeedback } from '../lib/feedback'
import { ITEM_KINDS } from './ReviewPanel'
import { isAlsoSound } from '../lib/altmove'
import { db, type AttemptSource } from '../db'
import { useContent } from '../lib/content'
import { afterMixedItem, EMPTY_LOOP, loadLoop, offeredLevels, saveLoop, type LoopLevel, type LoopState } from '../lib/loop'
import { useLessonProgress } from '../lib/progress'
import { destsFor, flipTurn, hidePieces, isUci, sideToMove, tryMove, uciFor } from '../lib/play'
import type { Item } from '../types'

export interface ItemResult { correct: boolean; hints: number; wrongs: number; timeMs: number }
interface Props {
  item: Item
  source: AttemptSource
  onDone?: (r: ItemResult) => void
  promptOverride?: string
  nextLabel?: string
  /** Silent practice: no hints, no engine line before you answer. */
  silent?: boolean
  /** Loop lessons print this level's thinking prompts beside the board. */
  loopShown?: LoopLevel
  /** Lessons can ask for a confidence rating on items below cue 3 (self-calibration lessons). */
  askConfidence?: boolean
}

const norm = (s?: string) => (s ?? '').trim().toLowerCase()

export function ItemPlayer({ item, source, onDone, promptOverride, nextLabel = 'Next', silent = false, loopShown, askConfidence = false }: Props) {
  const { verified } = useContent()
  const askFen = item.task === 'threat_detection' ? flipTurn(item.fen) : item.fen
  const orientation = item.orientation && item.orientation !== 'auto' ? item.orientation : sideToMove(askFen)
  const start = useRef(Date.now())
  const recorded = useRef(false)

  const [phase, setPhase] = useState<'answer' | 'done'>('answer')
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [wrongs, setWrongs] = useState(0)
  const [hintsShown, setHintsShown] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [conf, setConf] = useState<'low' | 'medium' | 'high' | undefined>(undefined)
  const [boardKey, setBoardKey] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const [shownFen, setShownFen] = useState(askFen)

  // Whole-line entry (mode.variation): the learner plays every ply of the line, both sides.
  const lineMode = (item.answer.line?.length ?? 0) > 1 && (item.answer.plies ?? 0) > 1 && item.task === 'find_move'
  const [lineIdx, setLineIdx] = useState(0)
  const [lineFen, setLineFen] = useState(askFen)
  const curFen = lineMode ? lineFen : askFen
  const curChess = useMemo(() => new Chess(curFen), [curFen])

  // Memory drill: study the position, then some pieces vanish.
  const studySecs = item.display?.study_seconds ?? 0
  const [studying, setStudying] = useState(studySecs > 0)
  const [studyLeft, setStudyLeft] = useState(studySecs)
  const hidden = item.display?.hide ?? []

  // Thinking-loop prompts: printed in the loop lessons, offered on request in mixed practice and faded on evidence.
  const lessonProgress = useLessonProgress()
  const [loopState, setLoopState] = useState<LoopState>(EMPTY_LOOP)
  const [loopOpened, setLoopOpened] = useState(false)
  const [checking, setChecking] = useState(false)
  const [altNote, setAltNote] = useState<{ san: string; why: string } | null>(null)
  const [trivialMarked, setTrivialMarked] = useState(false)
  const [reporting, setReporting] = useState(false)
  const [reportKind, setReportKind] = useState('')
  const [reportText, setReportText] = useState('')
  const [reported, setReported] = useState(false)
  const bestLine = useRef<Promise<import('../engine').EngineLine | undefined> | null>(null)
  useEffect(() => { void loadLoop().then(setLoopState) }, [])
  const mixed = source === 'practice' || source === 'daily' || source === 'review'
  const offered = useMemo<LoopLevel[]>(() => {
    if (loopShown || silent || !mixed || item.cue < 3 || item.task === 'play_out') return []
    return offeredLevels(loopState, new Set((lessonProgress ?? []).filter(p => p.done).map(p => p.lessonId)))
  }, [loopShown, silent, mixed, item.cue, item.task, loopState, lessonProgress])
  const loopLevels: LoopLevel[] = loopShown ? [loopShown] : offered

  useEffect(() => {
    // New item: reset everything.
    start.current = Date.now(); recorded.current = false
    setPhase('answer'); setCorrect(null); setWrongs(0); setHintsShown(0); setMessage(null); setSelected(new Set()); setConf(undefined); setBoardKey(k => k + 1); setChosen(null); setShownFen(askFen)
    setLineIdx(0); setLineFen(askFen); setLoopOpened(false); setChecking(false); setAltNote(null); bestLine.current = null; setStudying(studySecs > 0); setStudyLeft(studySecs)
  }, [item.id, askFen, studySecs])
  useEffect(() => {
    if (!studying) return
    if (studyLeft <= 0) { setStudying(false); start.current = Date.now(); return }
    const t = setTimeout(() => setStudyLeft(n => n - 1), 1000)
    return () => clearTimeout(t)
  }, [studying, studyLeft])

  const hints = item.hints ?? []
  const proposed = useMemo(() => {
    // A move named in a claim is the move a predict/classify task is about; draw it as an arrow.
    for (const c of item.claims) {
      const m = (c.params as { move?: string }).move
      if (m && isUci(m)) return m
    }
    return null
  }, [item.claims])

  async function record(ok: boolean, first: boolean, alt = false) {
    if (recorded.current) return
    recorded.current = true
    try {
      await db.attempts.add({
        itemId: item.id, skillKey: item.skill, cue: item.cue, family: item.family, correct: ok, firstAttempt: first,
        hints: hintsShown, timeMs: Date.now() - start.current, confidence: conf, source, ts: Date.now(),
        unprompted: item.cue >= 3 && hintsShown === 0 && !loopOpened && !loopShown, silent,
        scan: loopOpened ? offered : loopShown ? [loopShown] : undefined,
        alt: alt || undefined,
      })
      if (!loopShown && offered.length > 0) {
        const next = afterMixedItem(loopState, offered, ok && first && hintsShown === 0, loopOpened)
        setLoopState(next); await saveLoop(next)
      }
    } catch { /* storage unavailable: the lesson still works */ }
  }

  const result = useRef<ItemResult>({ correct: false, hints: 0, wrongs: 0, timeMs: 0 })
  function finish(ok: boolean, shown?: string, alt = false) {
    void record(ok, wrongs === 0, alt)
    setCorrect(ok); setPhase('done')
    if (shown) setShownFen(shown)
    result.current = { correct: ok && wrongs === 0, hints: hintsShown, wrongs, timeMs: Date.now() - start.current }
  }
  const wrong = (msg: string) => {
    if (wrongs === 0) void record(false, true)
    setWrongs(w => w + 1); setMessage(msg); setBoardKey(k => k + 1)
  }

  // threat_detection with threat_move 'none' means the position has no threat: the right answer is the "There is no threat" button.
  const noThreat = item.task === 'threat_detection' && (item.answer.threat_move === 'none' || (item.answer.moves ?? []).length === 0 && !item.answer.threat_move)
  const accepted = item.task === 'threat_detection' ? (noThreat ? [] : item.answer.moves ?? (item.answer.threat_move ? [item.answer.threat_move] : [])) : item.answer.moves ?? []

  function onMove(from: Key, to: Key) { handleUci(uciFor(curChess, from, to, accepted)) }
  const [typed, setTyped] = useState('')
  function submitTyped() {
    const txt = typed.trim()
    if (!txt) return
    try {
      const c = new Chess(curFen)
      const mv = c.move(txt, { strict: false })
      setTyped(''); handleUci(mv.from + mv.to + (mv.promotion ?? ''))
    } catch { setMessage(`"${txt}" is not a legal move in this position. Use notation such as Nf3, exd5, O-O, or e2e4.`) }
  }
  /** A move outside the accepted set is compared with the engine's best line before it is called wrong (unlabelled find-the-move items only). */
  async function soundAlternative(uci: string): Promise<{ san: string; why: string } | null> {
    try {
      const eng = getEngine()
      if (!bestLine.current) bestLine.current = eng.analyse(askFen, { depth: 14 }).then(l => l[0])
      // An engine that never answers must not leave the learner waiting: after 15 seconds, restart it and judge the move by the stored answer.
      let timer: ReturnType<typeof setTimeout> | undefined
      const stuck = new Promise<never>((_, rej) => { timer = setTimeout(() => rej(new Error('engine timeout')), 15000) })
      const [best, alt] = await Promise.race([Promise.all([bestLine.current, eng.analyse(askFen, { depth: 14, searchmoves: [uci] }).then(l => l[0])]), stuck]).finally(() => clearTimeout(timer))
      const v = isAlsoSound(best, alt)
      const san = tryMove(askFen, uci)?.san
      return v.fine && san ? { san, why: v.why } : null
    } catch { resetEngine(); bestLine.current = null; return null }
  }
  function handleUci(uci: string) {
    if (lineMode) {
      const want = lineIdx === 0 ? accepted : [item.answer.line![lineIdx]]
      if (want.includes(uci)) {
        const r = tryMove(lineFen, uci)
        if (!r) return
        if (lineIdx + 1 >= (item.answer.plies ?? 0)) finish(true, r.fen)
        else { setLineFen(r.fen); setLineIdx(lineIdx + 1); setMessage(null); setBoardKey(k => k + 1) }
      } else wrong(lineIdx === 0 ? (item.feedback_by_move?.[uci] ?? 'That is not the first move of the best line. Look again, or use a hint.') : 'That is not the best reply here. Think about what the opponent would really play.')
      return
    }
    if (accepted.includes(uci)) {
      const r = tryMove(askFen, uci)
      finish(true, r?.fen)
    } else if (item.task === 'find_move' && item.cue >= 3 && !checking) {
      setChecking(true); setMessage('Checking your move with the engine…')
      void soundAlternative(uci).then(alt => {
        setChecking(false)
        if (alt) { setAltNote(alt); finish(true, tryMove(askFen, uci)?.fen, true) }
        else wrong(item.feedback_by_move?.[uci] ?? 'That is not the move this position is asking for. Look again, or use a hint.')
      })
    } else {
      wrong(item.feedback_by_move?.[uci] ?? 'That is not the move this position is asking for. Look again, or use a hint.')
    }
  }
  function checkSquares() {
    const want = new Set(item.answer.squares ?? [])
    const missing = [...want].filter(s => !selected.has(s)).length
    const extra = [...selected].filter(s => !want.has(s)).length
    if (missing === 0 && extra === 0) finish(true)
    else wrong(`Not quite: ${missing} correct square${missing === 1 ? ' is' : 's are'} still missing and ${extra} selected square${extra === 1 ? ' does' : 's do'} not belong.`)
  }
  function choose(opt: string) {
    setChosen(opt)
    const want = norm(item.answer.outcome ?? item.answer.class ?? (noThreat ? 'none' : undefined))
    if (norm(opt) === want) finish(true)
    else { if (wrongs === 0) void record(false, true); setWrongs(w => w + 1); finish(false) }
  }

  const options = item.options ?? item.answer.options ?? (item.task === 'predict_outcome' ? ['yes', 'no'] : [])
  const movable = phase === 'answer' && !studying && !checking && (item.task === 'find_move' || item.task === 'threat_detection')
    ? { color: lineMode ? sideToMove(curFen) : orientation, dests: destsFor(curChess), onMove } : null
  const picker = phase === 'answer' && !studying && item.task === 'select_squares'
    ? { selected, onToggle: (sq: string) => setSelected(prev => { const n = new Set(prev); if (n.has(sq)) n.delete(sq); else n.add(sq); return n }) } : null
  const marks: Record<string, 'right' | 'miss' | 'bad'> | undefined = phase === 'done' && item.task === 'select_squares'
    ? (() => { const want = new Set(item.answer.squares ?? []); const m: Record<string, 'right' | 'miss' | 'bad'> = {}; for (const s of want) m[s] = selected.has(s) ? 'right' : 'miss'; for (const s of selected) if (!want.has(s)) m[s] = 'bad'; return m })()
    : undefined
  const shapes: BoardShape[] = []
  if (item.task === 'predict_outcome' && proposed) shapes.push({ from: proposed.slice(0, 2), to: proposed.slice(2, 4), brush: 'blue' })
  if (item.answer.from) shapes.push({ from: item.answer.from, brush: 'yellow' })
  if (phase === 'done' && item.task === 'find_move' && accepted[0] && correct === false) shapes.push({ from: accepted[0].slice(0, 2), to: accepted[0].slice(2, 4) })

  if (item.task === 'play_out') return <PlayOut item={item} source={source} onDone={onDone} nextLabel={nextLabel} />

  const v = verified[item.id]
  const prompt = promptOverride ?? item.prompt
  const reveal = item.reveal_pv && item.reveal_pv.length > 0 ? item.reveal_pv.slice(0, 8).map(m => ({ move: m })) : null
  const answerSan = (() => {
    if (item.task !== 'find_move' && item.task !== 'threat_detection') return null
    const sans = accepted.map(a => tryMove(askFen, a)?.san).filter(Boolean)
    return sans.length ? sans.join(' or ') : null
  })()

  return (
    <section className="item" aria-label="Exercise">
      <p className="prompt">{prompt}</p>
      {studying && (
        <div className="row"><strong>Study the position: {studyLeft}s</strong>
          <button type="button" onClick={() => { setStudying(false); start.current = Date.now() }}>I have it, hide the pieces</button></div>
      )}
      {lineMode && phase === 'answer' && !studying && <p className="muted small">Move {lineIdx + 1} of {item.answer.plies}: play {sideToMove(curFen) === 'white' ? 'White' : 'Black'}'s move.</p>}
      <LoopPanel levels={phase === 'answer' ? loopLevels : []} shown={!!loopShown} open={loopOpened} onOpen={() => setLoopOpened(true)} />
      <ChessBoard
        key={boardKey}
        controlMap={phase === 'done'}
        fen={phase === 'done' ? shownFen : studying || hidden.length === 0 ? curFen : hidePieces(curFen, hidden)}
        orientation={orientation}
        movable={movable}
        picker={picker}
        shapes={shapes}
        marks={marks}
        label={prompt}
      />

      {phase === 'answer' && !studying && (item.cue >= 3 || askConfidence) && (
        <div className="confidence" role="group" aria-label="Confidence before answering">
          <span className="muted small">Optional: how sure are you?</span>
          {(['low', 'medium', 'high'] as const).map(c => (
            <button key={c} type="button" className={conf === c ? 'chip on' : 'chip'} onClick={() => setConf(conf === c ? undefined : c)}>{c}</button>
          ))}
        </div>
      )}

      {phase === 'answer' && !studying && !checking && (item.task === 'find_move' || item.task === 'threat_detection') && (
        <form className="row typed" onSubmit={e => { e.preventDefault(); submitTyped() }}>
          <label className="small muted" htmlFor={`mv-${item.id}`}>Or type the move:</label>
          <input id={`mv-${item.id}`} type="text" value={typed} onChange={e => setTyped(e.target.value)} placeholder="e.g. Nf3 or e2e4" autoComplete="off" autoCapitalize="off" spellCheck={false} style={{ maxWidth: 160 }} />
          <button type="submit" disabled={!typed.trim()}>Play it</button>
        </form>
      )}
      {phase === 'answer' && !studying && options.length > 0 && (
        <div className="options" role="group" aria-label="Answer choices">
          {options.map(o => <button key={o} type="button" className={chosen === o ? 'chip on' : 'chip'} onClick={() => choose(o)}>{o}</button>)}
        </div>
      )}
      {phase === 'answer' && !studying && item.task === 'select_squares' && (
        <div className="row"><button type="button" className="primary" onClick={checkSquares} disabled={selected.size === 0 && (item.answer.squares?.length ?? 0) > 0}>Check my squares</button><span className="muted small">{selected.size} selected. Click a square again to unselect it.</span></div>
      )}
      {item.task === 'threat_detection' && phase === 'answer' && !studying && (
        <div className="row"><button type="button" onClick={() => choose('none')}>There is no threat</button><span className="muted small">Move a piece for the OPPONENT to show what they threaten.</span></div>
      )}

      {phase === 'answer' && message && <p className="msg warn" role="status">{message}</p>}

      {phase === 'answer' && !studying && (
        <div className="row">
          {!silent && hints.length > 0 && hintsShown < hints.length && (
            <button type="button" onClick={() => setHintsShown(h => h + 1)}>Hint ({hintsShown}/{hints.length})</button>
          )}
          <button type="button" onClick={() => { setBoardKey(k => k + 1); setMessage(null) }}>Reset the board</button>
          <button type="button" onClick={() => finish(false)}>Show me the answer</button>
        </div>
      )}
      {hintsShown > 0 && phase === 'answer' && (
        <ol className="hints">{hints.slice(0, hintsShown).map((h, i) => <li key={i}>{h}</li>)}</ol>
      )}

      {phase === 'done' && (
        <div className={correct ? 'result ok' : 'result no'} role="status">
          <p><strong>{correct ? (wrongs === 0 ? 'Correct.' : 'Right, after a second look.') : 'Not this time.'}</strong>
            {altNote && <> <strong>{altNote.san}</strong> is also sound: {altNote.why} (engine, depth 14, so evidence rather than proof). The exercise was looking for <strong>{answerSan}</strong>.</>}
            {!altNote && answerSan && <> The move is <strong>{answerSan}</strong>.</>}
            {item.task === 'select_squares' && <> The squares are: {(item.answer.squares ?? []).join(', ') || 'none'}.</>}
            {options.length > 0 && <> The answer is <strong>{item.answer.outcome ?? item.answer.class ?? 'none'}</strong>.</>}</p>
          {item.explain && <p>{item.explain}</p>}
          <div className="small">
            {reported ? <span role="status">Thank you: your report is saved on this device (send it from Settings → Reviews).</span> : !reporting ? <button type="button" className="link" onClick={() => setReporting(true)}>Report a problem with this exercise</button> : (
              <div className="reportbox">
                <select aria-label="What is wrong" value={reportKind} onChange={e => setReportKind(e.target.value)}><option value="">What is wrong?</option>{ITEM_KINDS.map(k => <option key={k} value={k}>{k}</option>)}</select>
                <textarea aria-label="Details" rows={2} value={reportText} onChange={e => setReportText(e.target.value)} placeholder="What did you see? What should it say?" />
                <button type="button" disabled={!reportKind} onClick={() => { void addFeedback({ targetType: 'item', targetId: item.id, checks: {}, kind: reportKind, text: reportText }, 'item-report').then(() => setReported(true)) }}>Save report</button>
              </div>)}
          </div>
          {item.claims.filter(c => c.statement).length > 0 && (
            <ul className="checks small">{item.claims.filter(c => c.statement).slice(0, 5).map(c => <li key={c.id}><span aria-hidden="true">✓</span> {c.statement}</li>)}</ul>
          )}
          {item.cue >= 3 && correct && <p className="small"><button type="button" className="link" disabled={trivialMarked} onClick={() => { void addTrivial(item.skill); setTrivialMarked(true) }}>{trivialMarked ? 'Noted: you will see less of this' : 'Too easy for me: show me less of this'}</button></p>}
          {reveal && (
            <details><summary>Show the line the engine found</summary>
              <LinePlayer fen={askFen} line={reveal} orientation={orientation} title={`Engine line${v?.depth ? ` (depth ${v.depth})` : ''}: evidence, not an explanation`} />
            </details>
          )}
          <p className="muted small badges">
            <span title="Every claim in this exercise was checked by software">{v ? `Checked by ${v.engine ?? 'rules'}${v.depth ? ` at depth ${v.depth}` : ''}` : 'Checked by rules'}</span>
          </p>
          {onDone && <button type="button" className="primary" onClick={() => onDone(result.current)}>{nextLabel}</button>}
        </div>
      )}
    </section>
  )
}
