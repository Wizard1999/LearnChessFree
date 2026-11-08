import { useEffect, useMemo, useRef, useState } from 'react'
import type { Key } from 'chessground/types'
import { ChessBoard, type StarMark } from './ChessBoard'
import { applyReach, doneText, isDone, liveStars, parOf, reachDests, reachRounds, showDelay, solveReach, starRating, startState, type ReachMove, type ReachState } from '../lib/reach'
import { prefersReducedMotion } from '../lib/appearance'
import { useSpokenText } from '../lib/readAloud'
import type { ReachStepSpec } from '../types'

export interface ReachStepProps {
  step: ReachStepSpec
  /** Called when the learner moves on after the last round. */
  onDone: () => void
  doneLabel?: string
}

/**
 * Grab the stars (docs/reach-step.md): the learner moves a piece and collects a star each time it lands on one; the other side never moves.
 * A move counter and the best number of moves; when every star is collected, a result line and a 1-3 star rating that never blocks going on.
 * Retry starts the round again; Show me plays the shortest way to collect what is left. Touch, mouse and the board's keyboard grid all work,
 * and every star is named in a visible list ("Star on h8") and on its square for screen readers.
 */
export function ReachStep({ step, onDone, doneLabel = 'Continue' }: ReachStepProps) {
  const rounds = useMemo(() => reachRounds(step), [step])
  const [ri, setRi] = useState(0)
  const round = rounds[ri]
  const [st, setSt] = useState<ReachState>(() => startState(rounds[0]))
  const [shown, setShown] = useState(false)
  const [showing, setShowing] = useState(false)
  const [justGot, setJustGot] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const par = useMemo(() => (round && !round.error ? parOf(round) : null), [round])

  const stop = () => { for (const t of timers.current) clearTimeout(t); timers.current = []; setShowing(false) }
  useEffect(() => () => { for (const t of timers.current) clearTimeout(t) }, [])
  useSpokenText(round?.say ?? '')

  const done = !!round && !round.error && isDone(round, st)
  const left = round ? round.stars.length - st.got.length : 0
  const dests = useMemo(() => (done || showing || !round || round.error ? new Map<Key, Key[]>() : (reachDests(st.fen) as Map<Key, Key[]>)), [st.fen, done, showing, round])

  function after(r: { state: ReachState; collected: string | null }, byShow = false) {
    setSt(r.state)
    setJustGot(r.collected)
    if (r.collected) {
      const n = round.stars.length - r.state.got.length
      const end = byShow ? `Shown in ${r.state.moves} move${r.state.moves === 1 ? '' : 's'}.` : doneText(r.state.moves, par)
      setNote(n ? `Star on ${r.collected} collected. ${n} ${n === 1 ? 'star' : 'stars'} left.` : `Star on ${r.collected} collected. ${end}`)
    } else setNote('')
  }
  function onMove(from: Key, to: Key, promotion?: 'q' | 'r' | 'b' | 'n') {
    const r = applyReach(round, st, { from, to, promotion })
    if (r) after(r)
  }
  function retry() { stop(); setSt(startState(round)); setShown(false); setJustGot(null); setNote('') }
  function showMe() {
    stop()
    let from = st
    let path = solveReach(round, st)
    if (path === null && st.moves > 0) { from = startState(round); path = solveReach(round, from) }   // stuck (a pawn cannot go back): show it from the start
    if (!path) { setNote('No way to collect these stars was found.'); return }
    setShown(true); setShowing(true); setSt(from); setJustGot(null); setNote('Watch: the shortest way to collect the stars.')
    const gap = showDelay(prefersReducedMotion())
    let cur = from
    path.forEach((mv: ReachMove, k) => {
      timers.current.push(setTimeout(() => {
        const r = applyReach(round, cur, mv)
        if (!r) return
        cur = r.state
        after(r, true)
        if (k === path!.length - 1) setShowing(false)
      }, gap * (k + 1)))
    })
  }
  function nextRound() { stop(); const n = ri + 1; setRi(n); setSt(startState(rounds[n])); setShown(false); setJustGot(null); setNote('') }

  if (!round) return null
  const title = step.title ?? 'Grab the stars'
  if (round.error) {
    return (
      <section className="card reach" aria-label={title}>
        <h3>{title}</h3>
        <p className="warn small">This exercise cannot be played: {round.error}</p>
        <div className="row actionbar"><button type="button" className="primary" onClick={onDone}>{doneLabel}</button></div>
      </section>
    )
  }

  const live = liveStars(round, st.got)
  const marks: StarMark[] = round.stars.filter(s => !st.got.includes(s)).map(s => ({ sq: s, n: round.order === 'in-order' ? round.stars.indexOf(s) + 1 : undefined, dim: !live.includes(s) }))
  if (justGot && !prefersReducedMotion()) marks.push({ sq: justGot, gone: true })
  const rating = done && !shown ? starRating(st.moves, par) : null
  const last = ri === rounds.length - 1
  return (
    <section className="card reach" aria-label={title}>
      <h3>{title}{rounds.length > 1 && <span className="muted small"> (round {ri + 1} of {rounds.length})</span>}</h3>
      <ChessBoard
        key={ri} fen={st.fen} orientation={round.color} stars={marks} noGameStatus lastMove={st.last ?? null} label={title}
        movable={!done && !showing ? { color: round.color, dests, onMove } : null}
      />
      <div className="reach-status">
        <span><strong>Moves: {st.moves}</strong>{par !== null && <span className="muted"> · best: {par}</span>}</span>
        {round.order === 'in-order' && !done && <span className="muted small">Collect them in order: {round.stars.join(', ')}.</span>}
      </div>
      <ul className="reach-stars" aria-label="Stars">
        {round.stars.map(s => <li key={s} className={st.got.includes(s) ? 'got' : ''}><span className="mark" aria-hidden="true">★</span>Star on {s}{st.got.includes(s) ? ' (collected)' : ''}</li>)}
      </ul>
      <p className="sr-only" role="status" aria-live="polite">{note}</p>
      {round.say && <p className="caption say">{round.say}</p>}
      {done ? (
        <div className="reach-end">
          <p className="reach-result">
            <strong>{shown ? `Shown in ${st.moves} move${st.moves === 1 ? '' : 's'}${par !== null ? ` (best ${par})` : ''}.` : doneText(st.moves, par)}</strong>
            {rating !== null && <span className="reach-rating" role="img" aria-label={`${rating} of 3 stars`}>{'★'.repeat(rating)}{'☆'.repeat(3 - rating)}</span>}
          </p>
          {shown && <p className="muted small">Try it yourself with Retry, or go on.</p>}
          <div className="row actionbar">
            <button type="button" onClick={retry}>Retry</button>
            {last ? <button type="button" className="primary" onClick={onDone}>{doneLabel}</button> : <button type="button" className="primary" onClick={nextRound}>Next round</button>}
          </div>
        </div>
      ) : (
        <div className="row actionbar">
          <p className="muted small" aria-hidden="true">{left} {left === 1 ? 'star' : 'stars'} left</p>
          {st.moves > 0 && !showing && <button type="button" onClick={retry}>Retry</button>}
          <button type="button" onClick={showMe} disabled={showing}>Show me</button>
        </div>
      )}
    </section>
  )
}
