import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Chess } from 'chess.js'
import { PlayGame, type GameEnd } from '../components/PlayOut'
import { BOTS } from '../engine'
import { db } from '../db'
import { PostGame } from '../components/PostGame'
import { colorFromParams, helpFromParams, opponentFromParams } from '../lib/firstGame'
import { gameContext, resultOf } from '../lib/postGame'
import { loadOpponent, saveOpponent, MAIA_LEVELS, MAIA_RUNTIME_BYTES, mb, type OpponentChoice } from '../lib/maia'

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export function PlayPage() {
  const [params] = useSearchParams()
  const startParam = params.get('fen')
  const [opp, setOppState] = useState<OpponentChoice>(() => opponentFromParams(params, loadOpponent(), BOTS.map(b => b.id)))
  const botId = opp.botId
  const setOpp = (patch: Partial<OpponentChoice>) => setOppState(o => { const n = { ...o, ...patch }; saveOpponent(n); return n })
  const maia = opp.kind === 'maia'
  const [color, setColor] = useState<'white' | 'black'>(() => colorFromParams(params) ?? (startParam && startParam.split(' ')[1] === 'b' ? 'black' : 'white'))
  const fromInvite = params.get('from') === 'invite'
  const [help, setHelp] = useState(() => helpFromParams(params))
  const lessonId = params.get('lesson') ?? undefined
  const [fen, setFen] = useState(() => { try { if (startParam) { new Chess(startParam); return startParam } } catch { /* ignore */ } return START })
  const [fenInput, setFenInput] = useState('')
  const [fenError, setFenError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [saved, setSaved] = useState<{ id: number | null; e: GameEnd; color: 'white' | 'black' } | null>(null)
  const [round, setRound] = useState(0)

  function applyFen() {
    try { new Chess(fenInput.trim()); setFen(fenInput.trim()); setFenError(null) } catch { setFenError('That is not a valid position.') }
  }
  async function ended(e: GameEnd) {
    const result = resultOf(e.outcome, color)
    const level = maia ? `Maia ${opp.maiaRating}` : BOTS.find(b => b.id === botId)?.label ?? botId
    // A game with no moves (stopped at once) is not worth keeping.
    if (e.moves.length === 0) { setSaved({ id: null, e, color }); return }
    const id = await db.games.add({
      source: 'practice', white: color === 'white' ? 'You' : `Bot (${level})`, black: color === 'white' ? `Bot (${level})` : 'You', result,
      date: new Date().toISOString().slice(0, 10), pgn: e.pgn, ts: Date.now(), me: color,
      context: gameContext({ startFen: fen, opponent: maia ? 'maia' : 'stockfish', level, color, outcome: e.outcome, lessonId }),
    })
    setSaved({ id: id as number, e, color })
  }
  const again = () => { setSaved(null); setRunning(true); setRound(r => r + 1) }

  return (
    <main className="page">
      <h1>Play the practice opponent</h1>
      {fromInvite && !running && <p className="small invitenote" role="note">A gentle game: Stockfish on its Beginner setting, you play White, and a hint button is on. Change anything below if you like.</p>}
      <p className="lede">A game against the computer. Strength labels describe how the engine is limited; they are <strong>not human ratings</strong>, and beating a bot does not prove you would beat people. Finished games are saved so you can review them before looking at engine analysis.</p>
      {!running ? (
        <section className="card">
          <div className="grid2">
            <label className="field"><span className="small muted">Opponent</span>
              <select value={opp.kind} onChange={e => setOpp({ kind: e.target.value === 'maia' ? 'maia' : 'stockfish' })}>
                <option value="stockfish">Stockfish (levels)</option><option value="maia">Maia: plays like a human of about N</option></select></label>
            {maia ? (
              <div className="field">
              <label className="field"><span className="small muted">Maia plays like a human rated about</span>
                <select value={opp.maiaRating} onChange={e => setOpp({ maiaRating: Number(e.target.value) })}>{MAIA_LEVELS.map(l => <option key={l.rating} value={l.rating}>{l.label}</option>)}</select>
                </label>
                <label className="small muted"><input type="checkbox" checked={opp.maiaBest} onChange={e => setOpp({ maiaBest: e.target.checked })} /> Always play its single most likely move (more predictable, less varied)</label>
              </div>
            ) : (
              <label className="field"><span className="small muted">Stockfish level</span>
                <select value={botId} onChange={e => setOpp({ botId: e.target.value })}>{BOTS.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}</select>
                <span className="small muted">{BOTS.find(b => b.id === botId)?.note}</span></label>
            )}
            <label className="field"><span className="small muted">You play</span>
              <select value={color} onChange={e => setColor(e.target.value as 'white' | 'black')}><option value="white">White</option><option value="black">Black</option></select></label>
          </div>
          {maia && (
            <p className="small muted maia-note">Maia is a free, open-source network from the University of Toronto's CSSLab (Maia Chess), trained on millions of human games to play the move a person of this rating would play. Unlike a weakened engine it makes <em>human-style</em> mistakes, such as missing a quiet threat or hanging a piece under time pressure, so it is better practice for real games. It downloads about {mb(MAIA_LEVELS[0].bytes + MAIA_RUNTIME_BYTES)} the first time you play it (only the strength you pick), then works offline. It needs no account, runs on your device, and nothing leaves it. If it cannot load, the game continues against Stockfish. The rating is approximate: it describes the human games the network learned from, not a measured strength.</p>
          )}
          <details><summary>Start from a position instead</summary>
            <label className="field"><span className="small muted">FEN</span><input type="text" value={fenInput} onChange={e => setFenInput(e.target.value)} placeholder="Paste a FEN, e.g. an ending you want to practice" /></label>
            <div className="row"><button type="button" onClick={applyFen}>Use this position</button><button type="button" onClick={() => { setFen(START); setFenInput('') }}>Standard start</button></div>
            {fenError && <p className="warn">{fenError}</p>}
            <p className="muted small">Current start: <code>{fen === START ? 'standard' : fen}</code></p>
          </details>
          <label className="small muted"><input type="checkbox" checked={help} onChange={e => setHelp(e.target.checked)} /> Show a hint button during the game (each hint is counted)</label>
          <div className="row actionbar"><button type="button" className="primary" onClick={again}>Start game</button></div>
        </section>
      ) : (
        <>
          <PlayGame key={round} startFen={fen} humanColor={color} botId={botId} opponent={opp} allowHint={help} onEnd={e => void ended(e)} />
          {saved !== null && (saved.id !== null
            ? <PostGame key={saved.id} gameId={saved.id} pgn={saved.e.pgn} color={saved.color} reason={saved.e.reason} onAgain={again} onSettings={() => { setSaved(null); setRunning(false) }} />
            : <section className="card"><p>No moves were played, so nothing was saved.</p><div className="row"><button type="button" className="primary" onClick={again}>Play again</button><button type="button" onClick={() => { setSaved(null); setRunning(false) }}>Change settings</button></div></section>)}
        </>
      )}
    </main>
  )
}
