import { useEffect, useMemo, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type GameRec } from '../db'
import { ChessBoard } from '../components/ChessBoard'
import { getEngine } from '../engine'
import { fetchChessCom, fetchLichess, parseGame, plyList, splitPgn, type Ply } from '../lib/pgn'
import { CONCEPT_LABEL, CONCEPT_SKILL, momentFor, type Moment } from '../lib/opportunities'
import { useContent } from '../lib/content'
import { Link } from 'react-router-dom'
import type { ConceptName } from '../chess/detectors'

interface Mark { ply: number; unsure: string; expected: string }
interface MoveEval { before: number; after: number; best?: string; loss: number } // centipawns from the mover's point of view
interface Analysis { depth: string; evals: MoveEval[]; whiteEvals: number[]; at: number; bests?: string[]; tags?: Record<number, { missed: ConceptName[]; allowed: ConceptName[] }> } // bests[k]: engine's preferred move (UCI) in the position before ply k+1; bests[n]: in the final position

const clamp = (v: number) => Math.max(-1000, Math.min(1000, v))
const toCp = (kind: 'cp' | 'mate', value: number) => (kind === 'mate' ? (value > 0 ? 1000 - value : -1000 - value) : clamp(value))
const DIAG = ['I did not see their threat', 'I saw it but miscalculated', 'I misjudged the position', 'Time pressure', 'I did not know the opening / plan', 'Something else']

export function Games() {
  const games = useLiveQuery(() => db.games.orderBy('ts').reverse().toArray(), [])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [paste, setPaste] = useState('')
  const [user, setUser] = useState('')
  const [site, setSite] = useState<'lichess' | 'chesscom'>('lichess')
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function saveMany(pgns: string[], source: string, handle?: string) {
    let n = 0
    for (const p of pgns) {
      const g = parseGame(p); if (!g || g.plies === 0) continue
      const h = handle?.toLowerCase()
      const me = h && g.white.toLowerCase() === h ? 'white' : h && g.black.toLowerCase() === h ? 'black' : undefined
      await db.games.add({ source, white: g.white, black: g.black, result: g.result, date: g.date, pgn: g.pgn, ts: Date.now() - n, me }); n++
    }
    setStatus(n ? `Imported ${n} game${n === 1 ? '' : 's'}.` : 'No readable games found.')
  }
  async function fetchUser() {
    if (!user.trim()) return
    setBusy(true); setStatus(null)
    try { await saveMany(site === 'lichess' ? await fetchLichess(user.trim()) : await fetchChessCom(user.trim()), site, user.trim()) }
    catch (e) { setStatus(`${(e as Error).message} (Public games only; nothing is sent from your device except the username.)`) }
    finally { setBusy(false) }
  }
  const selected = games?.find(g => g.id === selectedId) ?? null

  return (
    <main className="page wide">
      <h1>My games</h1>
      {!selected && (
        <>
          <p className="lede">Bring in games you played anywhere. The review flow asks <strong>you</strong> to mark your own critical moments first; the engine comes second, so you can see what you noticed and what you missed.</p>
          <section className="card">
            <h2>Import</h2>
            <label className="field"><span className="small muted">Paste PGN (one game or many)</span><textarea rows={4} value={paste} onChange={e => setPaste(e.target.value)} placeholder='[Event "..."] 1. e4 e5 ...' /></label>
            <div className="row"><button type="button" onClick={async () => { await saveMany(splitPgn(paste), 'pasted'); setPaste('') }} disabled={!paste.trim()}>Import pasted games</button></div>
            <hr />
            <div className="row">
              <select value={site} onChange={e => setSite(e.target.value as 'lichess' | 'chesscom')} style={{ width: 'auto' }}><option value="lichess">Lichess</option><option value="chesscom">Chess.com</option></select>
              <input type="text" value={user} onChange={e => setUser(e.target.value)} placeholder="username" style={{ maxWidth: 220 }} aria-label="Username" />
              <button type="button" onClick={() => void fetchUser()} disabled={busy || !user.trim()}>{busy ? 'Fetching…' : 'Fetch my latest games'}</button>
            </div>
            {status && <p role="status">{status}</p>}
          </section>
          <section className="card">
            <h2>Saved games</h2>
            {!games || games.length === 0 ? <p className="muted">None yet. Games you play against the practice opponent are saved here automatically.</p> : (
              <table className="table"><thead><tr><th>Date</th><th>White</th><th>Black</th><th>Result</th><th>From</th><th /></tr></thead>
                <tbody>{games.map(g => <tr key={g.id}><td>{g.date ?? new Date(g.ts).toLocaleDateString()}</td><td>{g.white}</td><td>{g.black}</td><td>{g.result}</td><td>{g.source}</td>
                  <td><button type="button" onClick={() => setSelectedId(g.id!)}>Review</button></td></tr>)}</tbody></table>
            )}
          </section>
          <PatternSummary games={games ?? []} />
        </>
      )}
      {selected && <Review game={selected} onBack={() => setSelectedId(null)} />}
    </main>
  )
}

function Review({ game, onBack }: { game: GameRec; onBack: () => void }) {
  const plies = useMemo<Ply[]>(() => { try { return plyList(game.pgn) } catch { return [] } }, [game.pgn])
  const [i, setI] = useState(0)
  const [marks, setMarks] = useState<Mark[]>([])
  const [unsure, setUnsure] = useState('')
  const [expected, setExpected] = useState('')
  const [analysis, setAnalysis] = useState<Analysis | null>((game.analysis as Analysis | undefined) ?? null)
  const [progress, setProgress] = useState<number | null>(null)
  const [diag, setDiag] = useState<Record<number, string>>({})
  const cancel = useRef(false)
  const myColor = useMemo<'white' | 'black'>(() => game.me ?? (/^you$/i.test(game.black) ? 'black' : 'white'), [game.black, game.me])
  const [side, setSide] = useState<'white' | 'black'>(myColor)
  useEffect(() => () => { cancel.current = true }, [])

  const fen = i === 0 ? plies[0]?.fenBefore ?? 'start' : plies[i - 1].fenAfter
  const last = i > 0 ? ([plies[i - 1].uci.slice(0, 2), plies[i - 1].uci.slice(2, 4)] as [string, string]) : null

  async function runAnalysis() {
    cancel.current = false
    const eng = getEngine()
    const whiteEvals: number[] = []
    const bests: string[] = []
    const fens = [plies[0].fenBefore, ...plies.map(p => p.fenAfter)]
    for (let k = 0; k < fens.length; k++) {
      if (cancel.current) return
      setProgress(k / fens.length)
      const lines = await eng.analyse(fens[k], { movetime: 140 })
      const turnWhite = fens[k].split(' ')[1] === 'w'
      const s = lines[0] ? toCp(lines[0].kind, lines[0].value) : 0
      whiteEvals.push(turnWhite ? s : -s)
      bests.push(lines[0]?.pv[0] ?? '')
    }
    const evals: MoveEval[] = plies.map((pl, k) => {
      const mover = pl.color === 'w' ? 1 : -1
      const before = whiteEvals[k] * mover
      const after = whiteEvals[k + 1] * mover
      return { before, after, loss: Math.max(0, before - after) }
    })
    // Name the patterns behind every drop of a pawn or more once, here, so the cross-game summary never has to re-run the detectors.
    const tags: NonNullable<Analysis['tags']> = {}
    plies.forEach((pl, k) => {
      if (evals[k].loss < 100) return
      const m = momentFor({ ply: k + 1, san: pl.san, played: pl.uci, loss: evals[k].loss, fenBefore: pl.fenBefore, fenAfter: pl.fenAfter, bestBefore: bests[k], bestReply: bests[k + 1] })
      tags[k] = { missed: m.missed?.concepts ?? [], allowed: m.allowed?.concepts ?? [] }
    })
    const a: Analysis = { depth: '140 ms per position (Stockfish 19 Lite)', evals, whiteEvals, bests, tags, at: Date.now() }
    setAnalysis(a); setProgress(null)
    await db.games.update(game.id!, { analysis: a })
  }

  const worst = useMemo(() => analysis ? plies.map((p, k) => ({ k, p, e: analysis.evals[k] })).filter(x => (side === 'white' ? x.p.color === 'w' : x.p.color === 'b') && x.e.loss >= 100).sort((a, b) => b.e.loss - a.e.loss).slice(0, 5) : [], [analysis, plies, side])

  const moments = useMemo<Record<number, Moment>>(() => {
    const out: Record<number, Moment> = {}
    if (!analysis?.bests) return out
    for (const w of worst) {
      out[w.k] = momentFor({ ply: w.k + 1, san: w.p.san, played: w.p.uci, loss: w.e.loss, fenBefore: w.p.fenBefore, fenAfter: w.p.fenAfter, bestBefore: analysis.bests[w.k], bestReply: analysis.bests[w.k + 1] })
    }
    return out
  }, [worst, analysis])

  async function addMark() {
    if (i === 0) return
    const m = { ply: i, unsure, expected }
    setMarks(ms => [...ms.filter(x => x.ply !== i), m]); setUnsure(''); setExpected('')
    await db.reflections.add({ kind: 'unsure-moment', data: { game: String(game.id), ply: String(i), unsure, expected }, ts: Date.now() })
  }
  async function saveDiag(ply: number, v: string) {
    setDiag(d => ({ ...d, [ply]: v }))
    await db.reflections.add({ kind: 'diagnosis', data: { game: String(game.id), ply: String(ply), cause: v }, ts: Date.now() })
  }

  if (plies.length === 0) return <section className="card"><p>This game could not be read.</p><button type="button" onClick={onBack}>Back</button></section>
  const moveLabel = (k: number) => `${Math.floor(k / 2) + 1}${plies[k].color === 'w' ? '.' : '...'} ${plies[k].san}`

  return (
    <>
      <p><button type="button" onClick={onBack}>← All games</button></p>
      <h2>{game.white} vs {game.black} <span className="muted small">· {game.result} · {game.date ?? ''}</span></h2>
      <div className="reviewgrid">
        <div>
          <ChessBoard fen={fen} orientation={side} lastMove={last} label="Game position" />
          <div className="row">
            <button type="button" onClick={() => setI(0)} aria-label="Start">⏮</button>
            <button type="button" onClick={() => setI(x => Math.max(0, x - 1))} aria-label="Previous move">◀</button>
            <span className="muted small">{i} / {plies.length}</span>
            <button type="button" className="primary" onClick={() => setI(x => Math.min(plies.length, x + 1))} aria-label="Next move">▶</button>
            <button type="button" onClick={() => setSide(s => (s === 'white' ? 'black' : 'white'))}>Flip</button>
          </div>
          <p className="moves small">{plies.map((_p, k) => <button type="button" key={k} className={k + 1 === i ? 'mv on' : 'mv'} onClick={() => setI(k + 1)}>{moveLabel(k)}</button>)}</p>
        </div>
        <div>
          <section className="card">
            <h3>Step 1: your own critical moments</h3>
            <p className="small muted">Step to a move where you felt unsure, or where the game turned. Write what you noticed and what you expected. This takes a minute and is the most useful part.</p>
            <label className="field"><span className="small muted">At move {i > 0 ? moveLabel(i - 1) : '—'}: what made you unsure?</span><textarea rows={2} value={unsure} onChange={e => setUnsure(e.target.value)} /></label>
            <label className="field"><span className="small muted">What did you expect your opponent to do?</span><textarea rows={2} value={expected} onChange={e => setExpected(e.target.value)} /></label>
            <div className="row"><button type="button" onClick={() => void addMark()} disabled={i === 0 || (!unsure.trim() && !expected.trim())}>Mark this moment</button></div>
            {marks.length > 0 && <ul className="plain small">{marks.map(m => <li key={m.ply}><button type="button" className="link" onClick={() => setI(m.ply)}>{moveLabel(m.ply - 1)}</button>: {m.unsure || '(no note)'} {m.expected && <span className="muted"> · expected: {m.expected}</span>}</li>)}</ul>}
          </section>
          <section className="card">
            <h3>Step 2: the engine's view</h3>
            {!analysis && progress === null && <><p className="small muted">{marks.length === 0 ? 'You have not marked any moment yet. You can still run it, but you will learn more if you mark first.' : 'Now compare what you noticed with what the engine finds.'}</p>
              <div className="row"><button type="button" className="primary" onClick={() => void runAnalysis()}>Analyse with the engine</button></div></>}
            {progress !== null && <p aria-live="polite">Analysing… {Math.round(progress * 100)}%</p>}
            {analysis && (
              <>
                <EvalGraph evals={analysis.whiteEvals} at={i} onPick={setI} />
                <p className="small muted">Evaluation from White's point of view, capped at ±10 pawns. {analysis.depth}. Engine numbers are evidence about the position, not an explanation of why.</p>
                <h4>Biggest drops for {side === 'white' ? 'White' : 'Black'}</h4>
                {worst.length === 0 ? <p className="muted small">No move lost 1 pawn or more at this setting.</p> : (
                  <ul className="plain">{worst.map(w => (
                    <li key={w.k}><button type="button" className="link" onClick={() => setI(w.k + 1)}><strong>{moveLabel(w.k)}</strong></button> lost about {(w.e.loss / 100).toFixed(1)} pawns
                      {marks.some(m => m.ply === w.k + 1) ? <span className="muted small"> · you had marked this moment ✔</span> : <span className="muted small"> · you had not marked this one</span>}
                      <MomentFacts m={moments[w.k]} />
                      <div className="small">What was behind it? {DIAG.map(d => <button type="button" key={d} className={diag[w.k] === d ? 'chip on' : 'chip'} onClick={() => void saveDiag(w.k + 1, d)}>{d}</button>)}</div>
                      <div className="small muted">A guess about the cause is a hypothesis. A pattern across several games is stronger evidence.</div></li>))}</ul>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </>
  )
}

/** Counts, across games you have analysed, which named patterns sat behind your biggest drops. A count is a lead to check, not a diagnosis. */
function PatternSummary({ games }: { games: GameRec[] }) {
  const rows = useMemo(() => {
    const missed = new Map<ConceptName, number>(), allowed = new Map<ConceptName, number>()
    let nGames = 0, nDrops = 0
    for (const g of games) {
      const a = g.analysis as Analysis | undefined
      if (!a?.tags || !g.me) continue
      let plies: Ply[]; try { plies = plyList(g.pgn) } catch { continue }
      nGames++
      plies.forEach((p, k) => {
        if ((g.me === 'white') !== (p.color === 'w') || a.evals[k].loss < 100) return
        nDrops++
        const t = a.tags![k]
        new Set(t?.missed ?? []).forEach(c => missed.set(c, (missed.get(c) ?? 0) + 1))
        new Set(t?.allowed ?? []).forEach(c => allowed.set(c, (allowed.get(c) ?? 0) + 1))
      })
    }
    return { missed: [...missed].sort((x, y) => y[1] - x[1]), allowed: [...allowed].sort((x, y) => y[1] - x[1]), nGames, nDrops }
  }, [games])
  if (rows.nGames === 0) return null
  const fmt = (xs: [ConceptName, number][]) => xs.length ? xs.map(([c, n]) => `${CONCEPT_LABEL[c]} ×${n}`).join(', ') : 'none found'
  return (
    <section className="card">
      <h2>Patterns behind your biggest drops</h2>
      <p className="small muted">From {rows.nGames} analysed game{rows.nGames === 1 ? '' : 's'} where we know which side you played, {rows.nDrops} move{rows.nDrops === 1 ? '' : 's'} lost a pawn or more.</p>
      <p><strong>Tactics the engine preferred instead:</strong> {fmt(rows.missed)}.</p>
      <p><strong>Tactics your move allowed:</strong> {fmt(rows.allowed)}.</p>
      <p className="small muted">This is a small sample. Treat a count as a lead to test with a plan on the My plan page, not as a verdict on your play.</p>
    </section>
  )
}

function Concepts({ list }: { list: ConceptName[] }) {
  const content = useContent()
  return <>{list.map((c, n) => {
    const skill = CONCEPT_SKILL[c]
    const has = skill && content.skillById.has(skill)
    return <span key={c}>{n > 0 && ', '}{has ? <Link to={`/practice?skill=${skill}&go=1&n=6`}>{CONCEPT_LABEL[c]}</Link> : CONCEPT_LABEL[c]}</span>
  })}</>
}

/** What the structural detectors tagged on the engine's preferred move and on the opponent's best reply. Tags are leads, not explanations. */
function MomentFacts({ m }: { m?: Moment }) {
  if (!m) return null
  const lines: React.ReactNode[] = []
  if (m.missed && m.missed.concepts.length) lines.push(<li key="m">Engine's preferred move <strong>{m.missed.san}</strong>, detector tags: <Concepts list={m.missed.concepts} />.</li>)
  if (m.allowed && m.allowed.concepts.length) lines.push(<li key="a">Engine's best reply to your move, <strong>{m.allowed.san}</strong>, detector tags: <Concepts list={m.allowed.concepts} />.</li>)
  if (lines.length === 0) return <div className="small muted">The detectors tagged no tactical pattern on the engine's preferred move or on the best reply. The loss may be positional, deeper than they look, or a pattern they do not cover.</div>
  return <ul className="plain small">{lines}</ul>
}

function EvalGraph({ evals, at, onPick }: { evals: number[]; at: number; onPick: (i: number) => void }) {
  const W = 360, H = 90, n = evals.length
  const x = (k: number) => (n <= 1 ? 0 : (k / (n - 1)) * W)
  const y = (v: number) => H / 2 - (Math.max(-1000, Math.min(1000, v)) / 1000) * (H / 2 - 4)
  const pts = evals.map((v, k) => `${x(k).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Evaluation over the game" style={{ width: '100%', maxWidth: 420, cursor: 'pointer' }}
      onClick={e => { const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect(); onPick(Math.round(((e.clientX - r.left) / r.width) * (n - 1))) }}>
      <rect x="0" y="0" width={W} height={H} fill="none" stroke="currentColor" opacity="0.2" />
      <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="currentColor" opacity="0.3" />
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.6" />
      <line x1={x(at)} y1="0" x2={x(at)} y2={H} stroke="#e0a030" strokeWidth="1.5" />
    </svg>
  )
}
