import { useEffect, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import type { Key } from 'chessground/types'
import { ChessBoard, type BoardShape } from './ChessBoard'
import { destsFor } from '../lib/play'
import { judgeGuided, markedMoveText, nextPly, opponentDelay, OTHER_MOVE_TEXT, planGuided } from '../lib/guided'
import { prefersReducedMotion } from '../lib/appearance'
import { useSpokenText } from '../lib/readAloud'
import { kvGet, kvSet } from '../db'
import type { GuidedMove } from '../types'

export interface GuidedGameProps {
  fen?: string
  moves: GuidedMove[]
  title?: string
  end?: string
  /** Called when the learner moves on after the last move (or skips a game they have already played). */
  onDone: () => void
  doneLabel?: string
  /** Remembers on this device that the game was played (kv `guided:played:<key>`), so the same game met again can be skipped. */
  playedKey?: string
}

/**
 * A guided game (docs/first-game-design.md): the learner plays the marked moves of a short real game and the opponent answers by itself.
 * Another legal move is not played: the piece goes back and a gentle line asks for the marked one (nothing is recorded as an attempt).
 * Touch, mouse and the board's keyboard grid all work; the marked move is spelled out in words for everyone, screen readers included.
 */
export function GuidedGame({ fen, moves, title, end, onDone, doneLabel = 'Continue', playedKey }: GuidedGameProps) {
  const plan = useMemo(() => planGuided(fen, moves), [fen, moves])
  const [idx, setIdx] = useState(0)
  const [miss, setMiss] = useState(0) // other legal moves tried at this ply; the re-render sets the board back to `current`, which puts the piece back
  const [already, setAlready] = useState<boolean | null>(playedKey ? null : false)
  const [replay, setReplay] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!playedKey) return
    let live = true
    void kvGet<number | null>(`guided:played:${playedKey}`, null).then(v => { if (live) setAlready(v !== null) }).catch(() => { if (live) setAlready(false) })
    return () => { live = false }
  }, [playedKey])

  const ply = plan.plies[idx]
  const finished = idx >= plan.plies.length
  const current = idx === 0 ? plan.start : plan.plies[idx - 1].after
  const last = idx > 0 ? plan.plies[idx - 1] : null
  const learnerTurn = !!ply && ply.by === 'learner'
  const opponentTurn = !!ply && ply.by === 'opponent'
  const playing = already === false || replay

  // the opponent replies by itself after a short pause, so the learner sees their own move land first
  useEffect(() => {
    if (!playing || !opponentTurn) return
    timer.current = setTimeout(() => { setIdx(i => i + 1) }, opponentDelay(prefersReducedMotion()))
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [playing, opponentTurn, idx])

  useEffect(() => {
    if (finished && playing && playedKey && !plan.error) void kvSet(`guided:played:${playedKey}`, Date.now()).catch(() => undefined)
  }, [finished, playing, playedKey, plan.error])

  const chess = useMemo(() => { try { return new Chess(current) } catch { return null } }, [current])
  const dests = useMemo(() => (chess ? destsFor(chess) : new Map<Key, Key[]>()), [chess])
  const inCheck = chess ? chess.inCheck() : false

  const caption = finished ? (end ?? '') : last?.say ?? ''
  useSpokenText(playing ? caption : '')

  function advance() { setMiss(0); setIdx(i => nextPly(plan, i).index) }
  function onMove(from: Key, to: Key, promotion?: 'q' | 'r' | 'b' | 'n') {
    const v = judgeGuided(plan, idx, from, to, promotion)
    if (v === 'accept') advance()
    else setMiss(n => n + 1)
  }
  function restart() { if (timer.current) clearTimeout(timer.current); setIdx(0); setMiss(0); setReplay(true) }

  if (already === null) return null
  if (!playing) {
    return (
      <section className="card guided">
        {title && <h3>{title}</h3>}
        <p>You have played this game already on this device.</p>
        <div className="row actionbar"><button type="button" onClick={restart}>Play it again</button><button type="button" className="primary" onClick={onDone}>{doneLabel}</button></div>
      </section>
    )
  }

  const shapes: BoardShape[] = learnerTurn && ply ? [{ from: ply.from, to: ply.to, brush: 'green' }] : []
  const learnerMoves = plan.plies.filter(p => p.by === 'learner')
  const myIndex = ply ? plan.plies.slice(0, idx + 1).filter(p => p.by === 'learner').length : learnerMoves.length
  return (
    <section className="card guided" aria-label={title ?? 'A guided game'}>
      {title && <h3>{title}</h3>}
      <ChessBoard
        fen={current} orientation={plan.learner} shapes={shapes} highlight={learnerTurn && ply ? [ply.from, ply.to] : []}
        lastMove={last ? [last.from, last.to] : null} check={inCheck} label={title ?? 'A guided game'}
        movable={learnerTurn && chess ? { color: plan.learner, dests, onMove } : null}
      />
      <div className="guided-status" aria-live="polite">
        {learnerTurn && ply && <p className="guided-turn"><strong>{markedMoveText(ply)}</strong> <span className="muted small">(move {myIndex} of {learnerMoves.length})</span></p>}
        {learnerTurn && miss > 0 && <p key={miss} className="guided-other small">{OTHER_MOVE_TEXT}{ply?.hint ? ` ${ply.hint}` : ''}</p>}
        {opponentTurn && <p className="muted small">{plan.learner === 'white' ? 'Black' : 'White'} is replying…</p>}
      </div>
      {caption && !finished && <p className="caption say">{caption}</p>}
      {plan.error && <p className="warn small">This game stops early: {plan.error}</p>}
      {finished ? (
        <div className="guided-end">
          {end && <p className="caption say"><strong>{end}</strong></p>}
          <div className="row actionbar"><button type="button" onClick={restart}>Play it again</button><button type="button" className="primary" onClick={onDone}>{doneLabel}</button></div>
        </div>
      ) : (
        <div className="row actionbar">
          {learnerTurn && <button type="button" onClick={advance}>Show me</button>}
          {plan.error && <button type="button" className="primary" onClick={onDone}>{doneLabel}</button>}
        </div>
      )}
    </section>
  )
}
