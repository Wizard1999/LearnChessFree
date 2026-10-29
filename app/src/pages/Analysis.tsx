import { useEffect, useMemo, useState } from 'react'
import { Chess } from 'chess.js'
import { ChessBoard } from '../components/ChessBoard'
import { getEngine, resetEngine, scoreText, type EngineLine } from '../engine'
import { destsFor } from '../lib/play'

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

/** The first moves of a line in SAN, from a position. */
function sanLine(fen: string, pv: string[], n = 8): string {
  const c = new Chess(fen)
  const out: string[] = []
  for (const uci of pv.slice(0, n)) {
    try {
      const m = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] })
      const num = c.history().length
      out.push(m.color === 'w' ? `${Math.ceil(num / 2)}. ${m.san}` : out.length === 0 ? `${Math.ceil(num / 2)}... ${m.san}` : m.san)
    } catch { break }
  }
  return out.join(' ')
}

/** The engine on its own: set up any position, move pieces for both sides, and read what Stockfish thinks. */
export function Analysis() {
  const [start, setStart] = useState(START)
  const [moves, setMoves] = useState<string[]>([]) // SAN played from `start`
  const [flip, setFlip] = useState(false)
  const [fenInput, setFenInput] = useState('')
  const [fenError, setFenError] = useState<string | null>(null)
  const [lines, setLines] = useState<EngineLine[] | null>(null)
  const [thinking, setThinking] = useState(false)
  const [on, setOn] = useState(true)
  const [multipv, setMultipv] = useState(3)
  const [depth, setDepth] = useState(16)
  const [note, setNote] = useState<string | null>(null)

  const chess = useMemo(() => { const c = new Chess(start); for (const m of moves) c.move(m); return c }, [start, moves])
  const fen = chess.fen()
  const whiteToMove = chess.turn() === 'w'
  const over = chess.isGameOver()

  useEffect(() => {
    if (!on || over) { setLines(null); return }
    let dead = false
    setThinking(true)
    const t = setTimeout(() => {
      const timeout = new Promise<null>(r => setTimeout(() => r(null), 20000))
      void Promise.race([getEngine().analyse(fen, { depth, multipv }), timeout]).then(r => {
        if (dead) return
        setThinking(false)
        if (r === null) { resetEngine(); setNote('The engine took too long and was restarted. Try a lower depth.') } else { setLines(r); setNote(null) }
      }).catch(() => { if (!dead) { setThinking(false); setNote('The engine could not run here.') } })
    }, 250)
    return () => { dead = true; clearTimeout(t) }
  }, [fen, on, over, depth, multipv])

  function onMove(from: string, to: string) {
    const c = new Chess(fen)
    try { const m = c.move({ from, to, promotion: 'q' }); setMoves(ms => [...ms, m.san]) } catch { /* illegal: the board only offers legal moves */ }
  }
  function applyFen() {
    try { const c = new Chess(fenInput.trim()); setStart(c.fen()); setMoves([]); setFenError(null); setFenInput('') } catch { setFenError('That is not a valid position.') }
  }
  const best = lines?.[0]?.pv[0]
  const status = chess.isCheckmate() ? `Checkmate: ${whiteToMove ? 'Black' : 'White'} wins.` : chess.isStalemate() ? 'Stalemate: a draw.' : chess.isDraw() ? 'A draw by rule.' : chess.isCheck() ? 'Check.' : ''

  return (
    <main className="page wide">
      <h1>Engine</h1>
      <p className="lede">Set up any position or play moves for both sides, and read what Stockfish 19 thinks. Scores are in pawns from White's point of view, searched to a fixed depth on this device. The engine is evidence about a position, not an explanation: the best move comes without the reason.</p>
      <div className="analysis">
        <div>
          <ChessBoard fen={fen} orientation={flip ? 'black' : 'white'} movable={over ? null : { color: whiteToMove ? 'white' : 'black', dests: destsFor(chess), onMove }} shapes={best && on ? [{ from: best.slice(0, 2), to: best.slice(2, 4), brush: 'blue' }] : []} check={chess.inCheck()} label="Analysis board" />
          <div className="row filters" style={{ marginTop: '0.6rem' }}>
            <button type="button" onClick={() => setMoves(ms => ms.slice(0, -1))} disabled={moves.length === 0}>Undo</button>
            <button type="button" onClick={() => { setStart(START); setMoves([]) }}>Start position</button>
            <button type="button" onClick={() => setFlip(f => !f)}>Flip board</button>
            <button type="button" onClick={() => setOn(o => !o)} aria-pressed={on}>{on ? 'Engine on' : 'Engine off'}</button>
          </div>
        </div>
        <div className="card">
          <h2>{over ? status : `${whiteToMove ? 'White' : 'Black'} to move`} {status && !over ? <span className="muted small">· {status}</span> : null}</h2>
          {on && !over && (
            <>
              <p className="small muted" role="status">{thinking ? 'Thinking…' : lines ? `Depth ${lines[0]?.depth ?? depth}` : ''}{note ? ` ${note}` : ''}</p>
              <ol className="plain enginelines">
                {(lines ?? []).map(l => (
                  <li key={l.rank}><strong className="score">{scoreText(l, whiteToMove)}</strong> <span>{sanLine(fen, l.pv)}</span></li>
                ))}
              </ol>
            </>
          )}
          <div className="row filters">
            <label className="small">Lines <select value={multipv} onChange={e => setMultipv(+e.target.value)}>{[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
            <label className="small">Depth <select value={depth} onChange={e => setDepth(+e.target.value)}>{[10, 14, 16, 18, 20, 22].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
          </div>
          <p className="small muted">Moves: {moves.length ? moves.join(' ') : 'none yet'}</p>
          <label className="field"><span className="small muted">Load a position (FEN)</span>
            <input value={fenInput} onChange={e => setFenInput(e.target.value)} placeholder="Paste a FEN here" aria-label="FEN" onKeyDown={e => { if (e.key === 'Enter') applyFen() }} /></label>
          <div className="row"><button type="button" onClick={applyFen} disabled={!fenInput.trim()}>Load</button><button type="button" className="link" onClick={() => void navigator.clipboard?.writeText(fen)}>Copy this position's FEN</button></div>
          {fenError && <p role="alert" className="small">{fenError}</p>}
        </div>
      </div>
    </main>
  )
}
