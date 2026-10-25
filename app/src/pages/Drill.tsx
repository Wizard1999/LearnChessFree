import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Chess } from 'chess.js'
import type { Key } from 'chessground/types'
import { ChessBoard } from '../components/ChessBoard'
import { kvGet, kvSet } from '../db'
import { buildCards, dueCards, grade, numbered, type DrillCard, type DrillState, type RepLine } from '../lib/drill'
import { destsFor, tryMove, uciFor } from '../lib/play'
import { shuffled } from '../lib/select'

export function Drill() {
  const [rep, setRep] = useState<Record<string, RepLine> | null>(null)
  const [state, setState] = useState<Record<string, DrillState>>({})
  const [queue, setQueue] = useState<DrillCard[] | null>(null)
  const [i, setI] = useState(0)
  const [answer, setAnswer] = useState<{ san: string; ok: boolean; fen: string } | null>(null)
  const [score, setScore] = useState({ ok: 0, n: 0 })

  useEffect(() => { void (async () => { setRep(await kvGet<Record<string, RepLine>>('repertoire', {})); setState(await kvGet<Record<string, DrillState>>('drill', {})) })() }, [])
  const cards = useMemo(() => (rep ? buildCards(rep) : []), [rep])
  useEffect(() => { if (rep && queue === null) setQueue(shuffled(dueCards(cards, state), `drill:${new Date().toDateString()}`).slice(0, 12)) }, [rep, cards, state, queue])

  if (!rep || !queue) return <main className="page"><h1>Repertoire drill</h1><p className="muted">Loading…</p></main>
  if (cards.length === 0) return <main className="page"><h1>Repertoire drill</h1><p>You have not saved any lines yet. Build some in <Link to="/openings">Openings</Link> with "Add this line", then come back to practise them.</p></main>

  const card = queue[i]
  const chess = card ? new Chess(card.fen) : null

  async function onMove(from: Key, to: Key) {
    if (!card || !chess || answer) return
    const played = tryMove(card.fen, uciFor(chess, from, to))
    if (!played) return
    const san = played.san
    const ok = san === card.expected
    setAnswer({ san, ok, fen: played.fen }); setScore(s => ({ ok: s.ok + (ok ? 1 : 0), n: s.n + 1 }))
    const next = { ...state, [card.key]: grade(state[card.key], ok) }
    setState(next); await kvSet('drill', next)
  }

  return (
    <main className="page">
      <h1>Repertoire drill</h1>
      {!card ? (
        <section className="card">
          <h2>{queue.length === 0 ? 'Nothing is due' : 'Set finished'}</h2>
          <p>{queue.length === 0 ? `All ${cards.length} positions in your repertoire are scheduled for later.` : `${score.ok} of ${score.n} right on the first try.`} Positions you miss come back tomorrow; positions you get right come back after longer gaps.</p>
          <div className="row"><Link className="button" to="/openings">Back to Openings</Link></div>
        </section>
      ) : (
        <>
          <p className="muted small">Position {i + 1} of {queue.length}. You are {card.side === 'white' ? 'White' : 'Black'}. Your line so far: {card.before.length ? numbered(card.before) : 'the start of the game'}.</p>
          <ChessBoard key={`${card.key}-${answer ? 'a' : 'q'}`} fen={answer && answer.ok ? answer.fen : card.fen} orientation={card.side} label="Repertoire position"
            shapes={answer && !answer.ok ? (() => { try { const m = new Chess(card.fen).move(card.expected); return [{ from: m.from, to: m.to, brush: 'green' as const }] } catch { return [] } })() : []}
            movable={answer || !chess ? null : { color: card.side, dests: destsFor(chess), onMove: (f, t) => void onMove(f, t) }} />
          {!answer && <p>What do you play?</p>}
          {answer && (
            <section className={answer.ok ? 'result ok' : 'result no'} role="status">
              <p><strong>{answer.ok ? 'Yes.' : `Not the move in your repertoire (you played ${answer.san}).`}</strong> Your line plays <strong>{card.expected}</strong> here.</p>
              {card.note && <p className="small">Why you chose this line: {card.note}</p>}
              {!answer.ok && <p className="small muted">Another move can be fine; this drill only checks that you can recall your own line. If you now prefer the move you played, change the line in Openings.</p>}
              <div className="row"><button type="button" className="primary" onClick={() => { setAnswer(null); setI(x => x + 1) }}>Next</button></div>
            </section>
          )}
        </>
      )}
    </main>
  )
}
