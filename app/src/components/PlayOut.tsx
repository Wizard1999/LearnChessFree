import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import type { Key } from 'chessground/types'
import { ChessBoard } from './ChessBoard'
import { BOTS, getEngine } from '../engine'
import { db, type AttemptSource } from '../db'
import { destsFor, uciFor } from '../lib/play'
import { fallbackBotId, getMaia, MAIA_LEVELS, MAIA_RUNTIME_BYTES, mb, type OpponentChoice } from '../lib/maia'
import type { Item } from '../types'
import type { ItemResult } from './ItemPlayer'

export interface GameEnd { outcome: 'win' | 'loss' | 'draw' | 'limit' | 'resigned'; reason: string; moves: string[]; pgn: string }

interface PlayGameProps {
  startFen: string
  humanColor: 'white' | 'black'
  botId: string
  /** Optional: play a Maia (human-like) opponent instead of the Stockfish level in botId. Graded tasks never pass this. */
  opponent?: OpponentChoice
  maxMoves?: number
  /** Allow the learner to ask what the engine would play (counts as a hint). */
  allowHint?: boolean
  onEnd?: (e: GameEnd, hintsUsed: number) => void
  onMove?: (fenBefore: string, uci: string) => void
  endLabel?: string
}

/** A game against the practice opponent from any position. Strength presets are in engine.ts (BOTS). */
export function PlayGame({ startFen, humanColor, botId, opponent, maxMoves, allowHint = true, onEnd, onMove }: PlayGameProps) {
  const useMaia = opponent?.kind === 'maia'
  const maiaRating = opponent?.maiaRating ?? 1500
  const [maiaFailed, setMaiaFailed] = useState<string | null>(null)
  const [maiaLoading, setMaiaLoading] = useState(false)
  const maiaReady = useRef(false)
  const bot = BOTS.find(b => b.id === (useMaia && maiaFailed ? fallbackBotId(maiaRating) : botId)) ?? BOTS[2]
  const botName = useMaia && !maiaFailed ? `Maia (about ${maiaRating})` : bot.label
  const chess = useRef(new Chess(startFen))
  const [fen, setFen] = useState(startFen)
  const [sans, setSans] = useState<string[]>([])
  const [thinking, setThinking] = useState(false)
  const [end, setEnd] = useState<GameEnd | null>(null)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [hintMove, setHintMove] = useState<string | null>(null)
  const [last, setLast] = useState<[string, string] | null>(null)
  const ended = useRef(false)

  const humanTurn = chess.current.turn() === (humanColor === 'white' ? 'w' : 'b')

  const finish = useCallback((e: GameEnd) => {
    if (ended.current) return
    ended.current = true
    setEnd(e); onEnd?.(e, hintsUsed)
  }, [onEnd, hintsUsed])

  const checkEnd = useCallback((): boolean => {
    const c = chess.current
    const humanWhite = humanColor === 'white'
    const hist = c.history()
    const pgn = c.pgn()
    if (c.isCheckmate()) {
      const humanMated = c.turn() === (humanWhite ? 'w' : 'b')
      finish({ outcome: humanMated ? 'loss' : 'win', reason: humanMated ? 'You were checkmated.' : 'Checkmate. You won.', moves: hist, pgn })
      return true
    }
    if (c.isStalemate()) { finish({ outcome: 'draw', reason: 'Stalemate.', moves: hist, pgn }); return true }
    if (c.isInsufficientMaterial()) { finish({ outcome: 'draw', reason: 'Draw: not enough material to checkmate.', moves: hist, pgn }); return true }
    if (c.isThreefoldRepetition()) { finish({ outcome: 'draw', reason: 'Draw by repetition.', moves: hist, pgn }); return true }
    if (c.isDrawByFiftyMoves()) { finish({ outcome: 'draw', reason: 'Draw by the fifty-move rule.', moves: hist, pgn }); return true }
    if (maxMoves && Math.ceil(hist.length / 2) >= maxMoves && c.turn() === (humanWhite ? 'w' : 'b')) {
      finish({ outcome: 'limit', reason: `Move limit reached (${maxMoves} moves).`, moves: hist, pgn }); return true
    }
    return false
  }, [finish, humanColor, maxMoves])

  const engineReply = useCallback(async () => {
    setThinking(true)
    try {
      let uci: string | null = null
      if (useMaia && !maiaFailed) {
        try {
          if (!MAIA_LEVELS.some(l => l.rating === maiaRating)) throw new Error('unknown strength')
          if (!maiaReady.current) setMaiaLoading(true)
          const played = chess.current.history({ verbose: true }).map(m => m.from + m.to + (m.promotion ?? ''))
          uci = await getMaia(maiaRating).move(chess.current.fen(), { moves: played, startFen, best: opponent?.maiaBest })
          maiaReady.current = true
        } catch (e) {
          // Offline the first time, no WebAssembly, or a worker that would not start: say so and carry on with Stockfish.
          console.warn('Maia could not load:', e)
          setMaiaFailed('the network files did not load')
          const fb = BOTS.find(b => b.id === fallbackBotId(maiaRating)) ?? BOTS[2]
          uci = await getEngine().bestMove(chess.current.fen(), fb.strength, fb.limit)
        } finally { setMaiaLoading(false) }
      } else uci = await getEngine().bestMove(chess.current.fen(), bot.strength, bot.limit)
      if (!uci) { checkEnd(); return }
      const mv = chess.current.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] })
      setFen(chess.current.fen()); setSans(chess.current.history()); setLast([mv.from, mv.to])
      checkEnd()
    } finally { setThinking(false) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bot, checkEnd, useMaia, maiaFailed, maiaRating, opponent?.maiaBest, startFen])

  useEffect(() => {
    // The engine moves first when the learner plays the second colour.
    if (!humanTurn && !ended.current && sans.length === 0 && !checkEnd()) void engineReply()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onHumanMove(from: Key, to: Key, promotion?: string) {
    if (!humanTurn || thinking || ended.current) return
    const before = chess.current.fen()
    const uci = uciFor(chess.current, from, to, undefined, promotion)
    try {
      const mv = chess.current.move({ from, to, promotion: uci[4] })
      onMove?.(before, uci)
      setFen(chess.current.fen()); setSans(chess.current.history()); setLast([mv.from, mv.to]); setHintMove(null)
      if (!checkEnd()) void engineReply()
    } catch { setFen(chess.current.fen()) }
  }

  async function hint() {
    setHintsUsed(h => h + 1)
    const lines = await getEngine().analyse(chess.current.fen(), { depth: 12 })
    setHintMove(lines[0]?.pv[0] ?? null)
  }

  const movable = !end && humanTurn && !thinking ? { color: humanColor, dests: destsFor(chess.current), onMove: onHumanMove } : null
  const moveText = useMemo(() => {
    const out: string[] = []
    const startNum = Number(startFen.split(' ')[5] ?? 1)
    const blackFirst = startFen.split(' ')[1] === 'b'
    sans.forEach((s, i) => {
      const idx = i + (blackFirst ? 1 : 0)
      if (idx % 2 === 0) out.push(`${startNum + Math.floor(idx / 2)}. ${s}`)
      else out.push(i === 0 && blackFirst ? `${startNum}... ${s}` : s)
    })
    return out.join(' ')
  }, [sans, startFen])

  return (
    <div className="playgame">
      <ChessBoard fen={fen} orientation={humanColor} movable={movable} lastMove={last} check={chess.current.isCheck()}
        shapes={hintMove ? [{ from: hintMove.slice(0, 2), to: hintMove.slice(2, 4), brush: 'yellow' }] : []} label="Game board" controlMap onControlUse={() => setHintsUsed(h => h + 1)} />
      <p className="muted small" aria-live="polite">
        {end ? end.reason : thinking ? (maiaLoading ? `Maia is loading the first time (about ${mb(MAIA_LEVELS[0].bytes + MAIA_RUNTIME_BYTES)}), then it moves…` : `${botName} is thinking…`) : humanTurn ? 'Your move.' : 'Waiting…'} · Opponent: {botName}. {useMaia && !maiaFailed ? 'Plays like a human of about this rating, so it makes human-style mistakes.' : bot.note}
      </p>
      {useMaia && maiaFailed && <p className="warn small" role="status">Maia could not load here ({maiaFailed}). This usually means you are offline for the first time, or this browser lacks WebAssembly. The game goes on against the Stockfish level closest to Maia {maiaRating} ({bot.label}); nothing is lost.</p>}
      {moveText && <p className="moves small">{moveText}</p>}
      <div className="row">
        {!end && allowHint && humanTurn && !thinking && <button type="button" onClick={hint}>Ask the engine for a move ({hintsUsed} used)</button>}
        {!end && <button type="button" onClick={() => finish({ outcome: 'resigned', reason: 'You stopped this game.', moves: chess.current.history(), pgn: chess.current.pgn() })}>Stop</button>}
      </div>
    </div>
  )
}

/** The item flavour: a play_out task with a goal (win / draw / hold). */
export function PlayOut({ item, source, onDone, nextLabel = 'Next' }: { item: Item; source: AttemptSource; onDone?: (r: ItemResult) => void; nextLabel?: string }) {
  const goal = item.answer.goal ?? 'hold'
  const color = item.fen.split(' ')[1] === 'w' ? 'white' : 'black'
  const [res, setRes] = useState<{ ok: boolean; reason: string } | null>(null)
  const start = useRef(Date.now())
  const result = useRef<ItemResult>({ correct: false, hints: 0, wrongs: 0, timeMs: 0 })

  async function ended(e: GameEnd, hints: number) {
    const ok = goal === 'win' ? e.outcome === 'win' : e.outcome === 'draw' || e.outcome === 'limit' || e.outcome === 'win'
    setRes({ ok, reason: e.reason })
    result.current = { correct: ok && hints === 0, hints, wrongs: ok ? 0 : 1, timeMs: Date.now() - start.current }
    try {
      await db.attempts.add({ itemId: item.id, skillKey: item.skill, cue: item.cue, family: item.family, correct: ok, firstAttempt: true, hints, timeMs: Date.now() - start.current, source, ts: Date.now(), unprompted: hints === 0 })
    } catch { /* ignore */ }
  }
  const goalText = goal === 'win' ? `Win this position (checkmate within ${item.answer.max_moves ?? 40} moves).` : `Hold the draw for ${item.answer.max_moves ?? 40} moves, or reach a drawn position.`
  return (
    <section className="item">
      <p className="prompt">{item.prompt}</p>
      <p className="muted small">Goal: {goalText} You play {color}. The opponent plays at full strength.</p>
      <PlayGame startFen={item.fen} humanColor={color} botId="b5" maxMoves={item.answer.max_moves ?? 40} onEnd={ended} />
      {res && (
        <div className={res.ok ? 'result ok' : 'result no'} role="status">
          <p><strong>{res.ok ? 'Goal reached.' : 'Goal not reached.'}</strong> {res.reason}</p>
          {item.explain && <p>{item.explain}</p>}
          {onDone && <button type="button" className="primary" onClick={() => onDone(result.current)}>{nextLabel}</button>}
        </div>
      )}
    </section>
  )
}
