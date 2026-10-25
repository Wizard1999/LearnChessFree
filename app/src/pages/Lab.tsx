import { useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import type { Api } from 'chessground/api'
import type { Key, Piece } from 'chessground/types'
import { ChessBoard } from '../components/ChessBoard'
import { LinePlayer } from '../components/LinePlayer'
import { db } from '../db'
import { getEngine } from '../engine'
import { useContent } from '../lib/content'
import { describeChanges, judgeMove, type Judgement } from '../lib/verify'
import { isUci, sideToMove, tryMove } from '../lib/play'
import type { Item } from '../types'

type Pred = 'works' | 'fails' | 'illegal'
const PALETTE: { id: string; label: string; role: Piece['role']; color: Piece['color'] }[] = [
  ...(['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'] as const).flatMap(role => (['white', 'black'] as const).map(color => ({ id: `${color}-${role}`, label: `${color === 'white' ? 'White' : 'Black'} ${role}`, role, color }))),
]
const SYMBOL: Record<string, string> = { 'white-pawn': '♙', 'white-knight': '♘', 'white-bishop': '♗', 'white-rook': '♖', 'white-queen': '♕', 'white-king': '♔', 'black-pawn': '♟', 'black-knight': '♞', 'black-bishop': '♝', 'black-rook': '♜', 'black-queen': '♛', 'black-king': '♚' }

function moveOf(item: Item): string | null {
  for (const c of item.claims) {
    if (c.type !== 'material_after_move' && c.type !== 'mate_in') continue
    if ((c.params as { null_move_first?: boolean }).null_move_first) return null
    const m = (c.params as { move?: string }).move
    if (m && isUci(m)) return m
  }
  return null
}

export function Lab() {
  const content = useContent()
  const scenarios = useMemo(() => content.items.filter(i => i.task !== 'play_out' && moveOf(i) && i.claims.some(c => c.type === 'material_after_move' && (c.params as { min?: number }).min !== undefined)), [content.items])
  const [sid, setSid] = useState<string>('')
  const item = scenarios.find(s => s.id === sid) ?? scenarios[0]
  const [placement, setPlacement] = useState<string | null>(null)
  const [pred, setPred] = useState<Pred | null>(null)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ j: Judgement; fen: string; right: boolean; changes: string[] } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tool, setTool] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0)
  const apiRef = useRef<Api | null>(null)

  if (!item) return <main className="page"><h1>Contrast lab</h1><p className="muted">No suitable positions are available yet. The lab needs exercises whose idea is a single move that wins material.</p></main>
  const move = moveOf(item)!
  const baseFen = item.fen
  const stm = sideToMove(baseFen)
  const curPlacement = placement ?? baseFen.split(' ')[0]
  const curFen = `${curPlacement} ${baseFen.split(' ')[1]} - - 0 1`
  const claim = item.claims.find(c => c.type === 'material_after_move')
  const sanBase = tryMove(baseFen, move)?.san ?? move

  function onSquare(key: string) {
    const a = apiRef.current
    if (!a || !tool) return
    if (tool === 'erase') a.setPieces(new Map([[key as Key, undefined]]))
    else { const p = PALETTE.find(x => x.id === tool)!; a.setPieces(new Map([[key as Key, { role: p.role, color: p.color }]])) }
    setPlacement(a.getFen()); setResult(null)
  }
  async function check() {
    if (!pred) return
    setError(null); setBusy(true); setResult(null)
    try {
      try { new Chess(curFen) } catch { setError('That is not a legal position (for example: each side needs exactly one king, and the side that just moved cannot leave its own king attacked).'); return }
      const j = await judgeMove(getEngine(), curFen, move)
      const works = j.legal && !j.deadDraw && (j.mate || j.delta >= (claim?.params as { min?: number }).min! - 1)
      const actual: Pred = !j.legal ? 'illegal' : works ? 'works' : 'fails'
      const right = pred === actual
      const changes = describeChanges(baseFen, curFen)
      setResult({ j, fen: curFen, right, changes })
      await db.reflections.add({ kind: 'lab', data: { item: item.id, prediction: pred, actual, right: String(right), changes: changes.join('; ') }, ts: Date.now() })
    } finally { setBusy(false) }
  }
  const reset = () => { setPlacement(null); setPred(null); setResult(null); setError(null); setResetKey(k => k + 1) }

  return (
    <main className="page wide">
      <h1>Contrast lab</h1>
      <p className="lede">Take a position where an idea works, change <strong>one thing</strong>, and predict whether the idea still works. Then the engine checks. This is how you find out what an idea actually depends on, rather than memorising when it applies.</p>
      <div className="labgrid">
        <div>
          <ChessBoard key={`${item.id}-${resetKey}`} fen={placement ? curFen : baseFen} orientation={stm} shapes={[{ from: move.slice(0, 2), to: move.slice(2, 4), brush: 'blue' }]}
            edit={{ onChange: pl => { setPlacement(pl); setResult(null) }, onSquare }} apiRef={apiRef} label="Editable position" />
          <p className="muted small">Drag a piece to move it, drag it off the board to remove it, or pick a piece below and click a square to add one.</p>
          <div className="palette" role="group" aria-label="Piece palette">
            {PALETTE.map(p => <button key={p.id} type="button" className={tool === p.id ? 'chip on' : 'chip'} onClick={() => setTool(tool === p.id ? null : p.id)} title={p.label} aria-label={p.label}>{SYMBOL[p.id]}</button>)}
            <button type="button" className={tool === 'erase' ? 'chip on' : 'chip'} onClick={() => setTool(tool === 'erase' ? null : 'erase')}>Erase</button>
            <button type="button" onClick={reset}>Reset position</button>
          </div>
        </div>
        <div>
          <section className="card">
            <label className="field"><span className="small muted">Starting idea</span>
              <select value={item.id} onChange={e => { setSid(e.target.value); reset() }}>{scenarios.slice(0, 80).map(s => <option key={s.id} value={s.id}>{s.id} · {tryMove(s.fen, moveOf(s)!)?.san} · {s.prompt.slice(0, 50)}</option>)}</select></label>
            <p>In the starting position, <strong>{sanBase}</strong> works{claim?.statement ? `: ${claim.statement}` : ' (checked by the engine).'} The arrow shows the move. You are {stm}.</p>
            <h3>Predict</h3>
            <p className="small muted">After your change, will <strong>{sanBase}</strong> still win material (or mate)?</p>
            <div className="options" role="group" aria-label="Prediction">
              {([['works', 'Yes, it still works'], ['fails', 'No, it fails now'], ['illegal', 'It is not even legal']] as [Pred, string][]).map(([v, l]) => <button key={v} type="button" className={pred === v ? 'chip on' : 'chip'} onClick={() => setPred(v)}>{l}</button>)}
            </div>
            <div className="row"><button type="button" className="primary" onClick={() => void check()} disabled={!pred || busy}>{busy ? 'Checking…' : 'Check with the engine'}</button></div>
            {error && <p className="msg warn">{error}</p>}
          </section>
          {result && (
            <section className={result.right ? 'result ok' : 'result no'} role="status">
              <p><strong>{result.right ? 'Your prediction was right.' : 'Your prediction was off.'}</strong>{' '}
                {!result.j.legal ? 'The move is not legal in the position you made.'
                  : result.j.mate ? `Yes: it now leads to checkmate (engine line, depth ${result.j.depth}).`
                  : result.j.deadDraw && result.j.delta > 0 ? `It wins material but the ending is a dead draw.`
                  : `Along the engine's best defence the move changes the material balance by ${result.j.delta > 0 ? '+' : ''}${result.j.delta} for the side moving.`}</p>
              <p className="small">{result.changes.length ? <>What you changed: {result.changes.join('; ')}.</> : 'You did not change anything.'}</p>
              {result.j.line.length > 1 && <details open><summary>Show the line</summary><LinePlayer fen={result.fen} line={result.j.line.map(m => ({ move: m }))} orientation={stm} title={`Engine line (depth ${result.j.depth}): evidence, not an explanation`} /></details>}
              <p className="small muted">The engine searches to a fixed depth, so a close call can change at greater depth. If this surprised you, try a smaller change and see exactly which feature the idea depends on.</p>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
