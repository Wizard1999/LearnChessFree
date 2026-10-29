import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Chess, type Square } from 'chess.js'
import { ChessBoard } from '../components/ChessBoard'
import { getEngine, resetEngine, scoreText, type EngineLine } from '../engine'
import { destsFor } from '../lib/play'
import { db, type GameRec } from '../db'
import { loadOpenings, nameOf, children as openingChildren, cnt, type OGraph } from '../lib/openingsData'

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const epdOf = (fen: string) => fen.split(' ').slice(0, 4).join(' ')

interface TNode { id: number; parent: number | null; san: string; uci: string; fen: string; ply: number; kids: number[] }
interface Tree { nodes: TNode[] }
const emptyTree = (fen: string): Tree => ({ nodes: [{ id: 0, parent: null, san: '', uci: '', fen, ply: 0, kids: [] }] })

/** Win chance for White in percent from a centipawn score (the logistic curve Lichess publishes; recalled from memory [R]). */
const winPct = (cp: number) => 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1)
const toCp = (l: EngineLine, white: boolean) => { const sign = white ? 1 : -1; return l.kind === 'mate' ? sign * (l.value > 0 ? 2000 : -2000) : sign * l.value }
type Mark = '' | '?!' | '?' | '??'

function sanLine(fen: string, pv: string[], n = 10): { san: string; num: string }[] {
  const c = new Chess(fen)
  const base = (fenFull(fen) - 1) * 2 + (c.turn() === 'b' ? 1 : 0)
  const out: { san: string; num: string }[] = []
  for (const uci of pv.slice(0, n)) {
    const ply = base + out.length
    try { const m = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }); out.push({ san: m.san, num: ply % 2 === 0 ? `${ply / 2 + 1}.` : out.length === 0 ? `${(ply - 1) / 2 + 1}...` : '' }) } catch { break }
  }
  return out
}
const fenFull = (fen: string) => +(fen.split(' ')[5] ?? 1) || 1

/** Anything with a result field is a position or a game; the rest is rejected with a message. */
function parseInput(text: string): { start: string; sans: string[] } | string {
  const t = text.trim()
  if (!t) return 'Nothing to load.'
  if (/^[prnbqkPRNBQK1-8/]+\s+[wb]\s+/.test(t)) { try { return { start: new Chess(t).fen(), sans: [] } } catch { return 'That is not a valid position.' } }
  try {
    const c = new Chess()
    c.loadPgn(t)
    const h = c.getHeaders()
    const start = h.FEN && h.SetUp !== '0' ? h.FEN : START
    return { start, sans: c.history() }
  } catch { return 'That is not a valid FEN or PGN.' }
}

/** The engine on its own, plus a game explorer: a move tree with variations, an evaluation bar and graph, whole-game analysis, and import and export. */
export function Analysis() {
  const [params] = useSearchParams()
  const [tree, setTree] = useState<Tree>(() => emptyTree(START))
  const [cur, setCur] = useState(0)
  const [flip, setFlip] = useState(false)
  const [on, setOn] = useState(true)
  const [multipv, setMultipv] = useState(3)
  const [maxDepth, setMaxDepth] = useState(18)
  const [arrows, setArrows] = useState(true)
  const [lines, setLines] = useState<EngineLine[] | null>(null)
  const [liveDepth, setLiveDepth] = useState(0)
  const [thinking, setThinking] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [evals, setEvals] = useState<Record<string, number>>({}) // epd -> centipawns, White's point of view
  const [batch, setBatch] = useState<{ done: number; total: number } | null>(null)
  const cancelBatch = useRef(false)
  const [promo, setPromo] = useState<{ from: string; to: string } | null>(null)
  const [text, setText] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [saved, setSaved] = useState<GameRec[]>([])
  const [graph, setGraph] = useState<OGraph | null>(null)
  const [epdToNode, setEpdToNode] = useState<Map<string, string>>(new Map())

  const node = tree.nodes[cur]
  const fen = node.fen
  const chess = useMemo(() => new Chess(fen), [fen])
  const whiteToMove = chess.turn() === 'w'
  const over = chess.isGameOver()
  const mainline = useMemo(() => { const out = [0]; let n = tree.nodes[0]; while (n.kids.length) { n = tree.nodes[n.kids[0]]; out.push(n.id) } return out }, [tree])

  // ---- moves and navigation
  const play = useCallback((from: string, to: string, promotion?: string) => {
    const c = new Chess(tree.nodes[cur].fen)
    let m
    try { m = c.move({ from, to, promotion }) } catch { return }
    const same = tree.nodes[cur].kids.find(k => tree.nodes[k].san === m.san)
    if (same !== undefined) { setCur(same); return }
    setTree(t => {
      const id = t.nodes.length
      const nodes = t.nodes.map(n => (n.id === cur ? { ...n, kids: [...n.kids, id] } : n))
      nodes.push({ id, parent: cur, san: m.san, uci: from + to + (m.promotion ?? ''), fen: c.fen(), ply: t.nodes[cur].ply + 1, kids: [] })
      return { nodes }
    })
    setCur(tree.nodes.length)
  }, [tree, cur])
  const playUci = (uci: string) => play(uci.slice(0, 2), uci.slice(2, 4), uci[4])
  function onBoardMove(from: string, to: string) {
    const piece = chess.get(from as Square)
    if (piece?.type === 'p' && (to[1] === '8' || to[1] === '1')) setPromo({ from, to })
    else play(from, to)
  }
  /** Plays the first `k+1` moves of an engine line from the current position, as a new branch if needed. */
  function playLine(pv: string[], k: number) {
    let at = cur, nodes = tree.nodes.slice(), c = new Chess(fen)
    for (const uci of pv.slice(0, k + 1)) {
      let m
      try { m = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }) } catch { break }
      const same = nodes[at].kids.find(x => nodes[x].san === m.san)
      if (same !== undefined) { at = same; continue }
      const id = nodes.length
      nodes = nodes.map(n => (n.id === at ? { ...n, kids: [...n.kids, id] } : n))
      nodes.push({ id, parent: at, san: m.san, uci: uci.slice(0, 4) + (m.promotion ?? ''), fen: c.fen(), ply: nodes[at].ply + 1, kids: [] })
      at = id
    }
    setTree({ nodes }); setCur(at)
  }
  const go = useCallback((d: 'start' | 'back' | 'fwd' | 'end') => {
    setCur(c => {
      const n = tree.nodes[c]
      if (d === 'start') return 0
      if (d === 'back') return n.parent ?? c
      if (d === 'fwd') return n.kids[0] ?? c
      let e = c; while (tree.nodes[e].kids.length) e = tree.nodes[e].kids[0]; return e
    })
  }, [tree])
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return
      if (e.key === 'ArrowLeft') { go('back'); e.preventDefault() }
      else if (e.key === 'ArrowRight') { go('fwd'); e.preventDefault() }
      else if (e.key === 'ArrowUp' || e.key === 'Home') { go('start'); e.preventDefault() }
      else if (e.key === 'ArrowDown' || e.key === 'End') { go('end'); e.preventDefault() }
      else if (e.key === 'f') setFlip(f => !f)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [go])
  function deleteFromHere() {
    if (cur === 0) return
    const drop = new Set<number>(); const walk = (id: number) => { drop.add(id); tree.nodes[id].kids.forEach(walk) }; walk(cur)
    const parent = tree.nodes[cur].parent ?? 0
    // keep ids dense: rebuild
    const keep = tree.nodes.filter(n => !drop.has(n.id))
    const remap = new Map(keep.map((n, i) => [n.id, i]))
    const nodes = keep.map(n => ({ ...n, id: remap.get(n.id)!, parent: n.parent === null ? null : remap.get(n.parent)!, kids: n.kids.filter(k => !drop.has(k)).map(k => remap.get(k)!) }))
    setTree({ nodes }); setCur(remap.get(parent)!)
  }

  // ---- live engine: deepen step by step so something appears at once
  useEffect(() => {
    if (!on || over || batch) { setLines(null); setLiveDepth(0); return }
    let dead = false
    setThinking(true); setNote(null)
    const steps = [...new Set([Math.min(8, maxDepth), Math.min(12, maxDepth), Math.min(16, maxDepth), maxDepth])]
    const run = async () => {
      await new Promise(r => setTimeout(r, 200))
      for (const d of steps) {
        if (dead) return
        const timeout = new Promise<null>(r => setTimeout(() => r(null), 25000))
        let r: EngineLine[] | null = null
        try { r = await Promise.race([getEngine().analyse(fen, { depth: d, multipv }), timeout]) } catch { if (!dead) { setThinking(false); setNote('The engine could not run here.') } return }
        if (dead) return
        if (r === null) { resetEngine(); setThinking(false); setNote('The engine took too long and was restarted. Lower the depth.'); return }
        setLines(r); setLiveDepth(r[0]?.depth ?? d)
        if (r[0]) setEvals(e => ({ ...e, [epdOf(fen)]: toCp(r![0], whiteToMove) }))
      }
      if (!dead) setThinking(false)
    }
    void run()
    return () => { dead = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen, on, over, maxDepth, multipv, batch])

  // terminal positions have no engine line
  useEffect(() => {
    if (!over) return
    const cp = chess.isCheckmate() ? (whiteToMove ? -2000 : 2000) : 0
    setEvals(e => ({ ...e, [epdOf(fen)]: cp }))
  }, [over, fen, chess, whiteToMove])

  // ---- whole-game analysis of the main line
  async function analyseGame() {
    cancelBatch.current = false
    const ids = mainline
    setBatch({ done: 0, total: ids.length })
    for (let i = 0; i < ids.length; i++) {
      if (cancelBatch.current) break
      const f = tree.nodes[ids[i]].fen
      const key = epdOf(f)
      const c = new Chess(f)
      if (c.isGameOver()) { setEvals(e => ({ ...e, [key]: c.isCheckmate() ? (c.turn() === 'w' ? -2000 : 2000) : 0 })) }
      else if (evals[key] === undefined) {
        const timeout = new Promise<null>(r => setTimeout(() => r(null), 25000))
        const r = await Promise.race([getEngine().analyse(f, { depth: 12, multipv: 1 }), timeout]).catch(() => null)
        if (r === null) { resetEngine(); setMsg('The engine stopped answering during the analysis; try again with fewer moves.'); break }
        if (r[0]) setEvals(e => ({ ...e, [key]: toCp(r[0], c.turn() === 'w') }))
      }
      setBatch({ done: i + 1, total: ids.length })
    }
    setBatch(null)
  }

  // ---- classification and accuracy of the main line
  const marks = useMemo(() => {
    const m = new Map<number, Mark>(); const loss: Record<'w' | 'b', number[]> = { w: [], b: [] }
    for (let i = 1; i < mainline.length; i++) {
      const a = evals[epdOf(tree.nodes[mainline[i - 1]].fen)], b = evals[epdOf(tree.nodes[mainline[i]].fen)]
      if (a === undefined || b === undefined) continue
      const mover = new Chess(tree.nodes[mainline[i - 1]].fen).turn()
      const pa = mover === 'w' ? winPct(a) : 100 - winPct(a), pb = mover === 'w' ? winPct(b) : 100 - winPct(b)
      const d = Math.max(0, pa - pb)
      loss[mover].push(d)
      m.set(mainline[i], d >= 30 ? '??' : d >= 20 ? '?' : d >= 10 ? '?!' : '')
    }
    const acc = (xs: number[]) => (xs.length ? xs.reduce((s, d) => s + Math.max(0, Math.min(100, 103.1668 * Math.exp(-0.04354 * d) - 3.1669)), 0) / xs.length : null)
    return { m, white: acc(loss.w), black: acc(loss.b) }
  }, [evals, mainline, tree])

  // ---- opening names from the bundled explorer data
  useEffect(() => {
    let dead = false
    loadOpenings().then(g => {
      if (dead) return
      const mp = new Map<string, string>(); for (const [id, n] of g.nodes) mp.set(n.e, id)
      setGraph(g); setEpdToNode(mp)
    }).catch(() => { /* the opening data is optional */ })
    return () => { dead = true }
  }, [])
  const openingId = epdToNode.get(epdOf(fen))
  const openingName = graph && openingId ? nameOf(graph, openingId) : null
  const bookMoves = graph && openingId ? openingChildren(graph, openingId, null).slice(0, 6) : []

  // ---- saved games and import
  useEffect(() => { void db.games.orderBy('ts').reverse().toArray().then(setSaved).catch(() => undefined) }, [])
  function load(start: string, sans: string[]) {
    const t = emptyTree(start); const c = new Chess(start); let at = 0
    for (const s of sans) {
      let m; try { m = c.move(s) } catch { break }
      const id = t.nodes.length
      t.nodes[at].kids.push(id)
      t.nodes.push({ id, parent: at, san: m.san, uci: m.from + m.to + (m.promotion ?? ''), fen: c.fen(), ply: id, kids: [] })
      at = id
    }
    setTree(t); setCur(0); setEvals({}); setMsg(null)
  }
  function importText(t: string) {
    const r = parseInput(t)
    if (typeof r === 'string') { setMsg(r); return }
    load(r.start, r.sans); setText('')
  }
  useEffect(() => {
    const fenParam = params.get('fen'), gameParam = params.get('game')
    if (fenParam) { const r = parseInput(fenParam); if (typeof r !== 'string') load(r.start, r.sans) }
    else if (gameParam) void db.games.get(+gameParam).then(g => { if (g) importText(g.pgn) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const pgnOut = useMemo(() => {
    const c = new Chess(tree.nodes[0].fen)
    for (const id of mainline.slice(1)) { try { c.move(tree.nodes[id].san) } catch { break } }
    return c.pgn()
  }, [tree, mainline])
  const copy = (s: string, label: string) => { void navigator.clipboard?.writeText(s).then(() => setMsg(`${label} copied.`), () => setMsg('Copy was blocked; select the text instead.')) }
  function download() {
    const url = URL.createObjectURL(new Blob([pgnOut], { type: 'application/x-chess-pgn' }))
    const a = document.createElement('a'); a.href = url; a.download = 'analysis.pgn'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  // ---- rendering helpers
  const topCp = evals[epdOf(fen)]
  const bar = topCp === undefined ? 50 : winPct(topCp)
  const barLabel = lines?.[0] ? scoreText(lines[0], whiteToMove) : topCp !== undefined ? (Math.abs(topCp) >= 2000 ? (topCp > 0 ? '1-0' : '0-1') : `${topCp > 0 ? '+' : ''}${(topCp / 100).toFixed(1)}`) : ''
  const shapes = !arrows || !on || over || !lines ? [] : lines.slice(0, multipv).map((l, i) => ({ from: l.pv[0].slice(0, 2), to: l.pv[0].slice(2, 4), brush: (i === 0 ? 'green' : i === 1 ? 'blue' : 'yellow') as 'green' | 'blue' | 'yellow' }))
  const status = chess.isCheckmate() ? `Checkmate: ${whiteToMove ? 'Black' : 'White'} wins.` : chess.isStalemate() ? 'Stalemate: a draw.' : chess.isDraw() ? 'A draw by rule.' : chess.isCheck() ? 'Check.' : ''
  const lastMove = node.uci ? ([node.uci.slice(0, 2), node.uci.slice(2, 4)] as [string, string]) : null

  function renderLine(startId: number): ReactNode[] {
    const out: ReactNode[] = []
    let id = startId; let first = true
    for (let guard = 0; guard < 600; guard++) {
      const n = tree.nodes[id]
      const white = n.ply % 2 === 1
      const label = white ? `${Math.ceil(n.ply / 2)}.` : first ? `${Math.ceil(n.ply / 2)}...` : ''
      const mk = marks.m.get(id) ?? ''
      out.push(<span key={id} className="mv">{label && <span className="mvnum">{label}</span>}<button type="button" className={`mvbtn${id === cur ? ' on' : ''}${mk ? ' m' + mk.length : ''}`} onClick={() => setCur(id)} aria-current={id === cur ? 'true' : undefined}>{n.san}{mk}</button></span>)
      first = false
      if (!n.kids.length) break
      const [main, ...alts] = n.kids
      for (const a of alts) out.push(<span key={`v${a}`} className="variation">({renderLine(a)})</span>)
      id = main
      first = alts.length > 0
    }
    return out
  }
  const rootKids = tree.nodes[0].kids
  const moveList = rootKids.length ? (() => { const [main, ...alts] = rootKids; return [...renderLine(main), ...alts.map(a => <span key={`rv${a}`} className="variation">({renderLine(a)})</span>)] })() : []

  const evalPoints = mainline.map((id, i) => ({ id, i, cp: evals[epdOf(tree.nodes[id].fen)] }))
  const haveGraph = evalPoints.filter(p => p.cp !== undefined).length >= 2

  return (
    <main className="page wide">
      <h1>Analysis</h1>
      <p className="lede">Set up a position, load a game, or move the pieces for both sides, and read what Stockfish 19 thinks. Scores are in pawns from White's point of view, from a search to a fixed depth on this device. The engine gives evidence about a position, not the reason behind it.</p>
      <div className="analysis">
        <div>
          <div className="boardrow">
            <div className="evalbar" role="img" aria-label={`Evaluation ${barLabel || 'not yet known'}`} title={barLabel}>
              <div className="evalfill" style={{ height: `${flip ? 100 - bar : bar}%`, [flip ? 'top' : 'bottom']: 0 }} />
              <span className="evaltext">{barLabel}</span>
            </div>
            <ChessBoard fen={fen} orientation={flip ? 'black' : 'white'} movable={over ? null : { color: whiteToMove ? 'white' : 'black', dests: destsFor(chess), onMove: onBoardMove }} shapes={shapes} lastMove={lastMove} check={chess.inCheck()} label="Analysis board" controlMap />
          </div>
          {promo && <div className="row" role="group" aria-label="Promote to"><span className="small">Promote to:</span>{(['q', 'r', 'b', 'n'] as const).map(p => <button key={p} type="button" onClick={() => { play(promo.from, promo.to, p); setPromo(null) }}>{({ q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight' })[p]}</button>)}<button type="button" className="link" onClick={() => setPromo(null)}>Cancel</button></div>}
          <div className="row filters analysisbar">
            <button type="button" onClick={() => go('start')} aria-label="Go to start" disabled={cur === 0}>⏮</button>
            <button type="button" onClick={() => go('back')} aria-label="Previous move" disabled={cur === 0}>◀</button>
            <button type="button" onClick={() => go('fwd')} aria-label="Next move" disabled={!node.kids.length}>▶</button>
            <button type="button" onClick={() => go('end')} aria-label="Go to end" disabled={!node.kids.length}>⏭</button>
            <button type="button" onClick={() => setFlip(f => !f)}>Flip</button>
            <button type="button" onClick={deleteFromHere} disabled={cur === 0} title="Delete this move and everything after it">Delete from here</button>
          </div>
          <p className="small muted">Arrow keys move through the game, F flips the board. The control map button under the board shows who controls each square.</p>
        </div>

        <div className="stack">
          <section className="card" aria-label="Engine">
            <div className="sectionhead"><h2>{over ? status : `${whiteToMove ? 'White' : 'Black'} to move`}</h2>
              <button type="button" onClick={() => setOn(o => !o)} aria-pressed={on}>{on ? 'Engine on' : 'Engine off'}</button></div>
            {status && !over && <p className="small muted">{status}</p>}
            {on && !over && (
              <>
                <p className="small muted" role="status">{batch ? 'Analysing the whole game…' : thinking ? `Thinking… depth ${liveDepth}` : lines ? `Depth ${liveDepth}` : ''}{note ? ` ${note}` : ''}</p>
                <ol className="plain enginelines">
                  {(lines ?? []).map(l => {
                    const mv = sanLine(fen, l.pv)
                    return <li key={l.rank}><strong className="score">{scoreText(l, whiteToMove)}</strong><span>{mv.map((m, k) => <span key={k}>{m.num && <span className="mvnum">{m.num}</span>}<button type="button" className="mvbtn" onClick={() => playLine(l.pv, k)} title="Play this line up to here">{m.san}</button></span>)}</span></li>
                  })}
                </ol>
              </>
            )}
            <div className="row filters">
              <label className="small">Lines <select value={multipv} onChange={e => setMultipv(+e.target.value)}>{[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
              <label className="small">Depth <select value={maxDepth} onChange={e => setMaxDepth(+e.target.value)}>{[10, 14, 16, 18, 20, 22, 24].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
              <label className="small"><input type="checkbox" checked={arrows} onChange={e => setArrows(e.target.checked)} /> Arrows</label>
            </div>
          </section>

          {graph && openingName?.name && (
            <section className="card" aria-label="Opening">
              <h2>{openingName.eco ? `${openingName.eco} · ` : ''}{openingName.name}</h2>
              {bookMoves.length > 0 && <p className="small muted">Common next moves in the bundled opening data (games played):{' '}
                {bookMoves.map(e => <span key={e.u} className="mv"><button type="button" className="mvbtn" onClick={() => playUci(e.u)}>{e.m}</button><span className="muted"> {cnt(e.n, null).toLocaleString()}</span></span>)}</p>}
            </section>
          )}

          <section className="card" aria-label="Moves">
            <div className="sectionhead"><h2>Moves</h2>
              {batch ? <button type="button" onClick={() => { cancelBatch.current = true }}>Stop ({batch.done}/{batch.total})</button>
                : <button type="button" onClick={() => void analyseGame()} disabled={mainline.length < 2} title="Evaluate every position of the main line at depth 12">Analyse whole game</button>}</div>
            {moveList.length === 0 ? <p className="muted small">No moves yet. Play on the board, or load a game below.</p> : <div className="movelist">{moveList}</div>}
            {(marks.white !== null || marks.black !== null) && (
              <p className="small">Accuracy (a rough estimate from win-chance loss; ?! is a loss of 10 to 20 points of win chance, ? 20 to 30, ?? 30 or more): White {marks.white !== null ? `${marks.white.toFixed(0)}%` : 'n/a'}, Black {marks.black !== null ? `${marks.black.toFixed(0)}%` : 'n/a'}.</p>
            )}
            {haveGraph && (
              <svg className="evalgraph" viewBox={`0 0 ${Math.max(1, mainline.length - 1) * 10} 100`} preserveAspectRatio="none" role="img" aria-label="Evaluation graph of the main line">
                <rect x="0" y="0" width="100%" height="100%" className="graphbg" />
                <line x1="0" x2={Math.max(1, mainline.length - 1) * 10} y1="50" y2="50" className="graphmid" />
                <polyline className="graphline" fill="none" points={evalPoints.filter(p => p.cp !== undefined).map(p => `${p.i * 10},${100 - winPct(p.cp!)}`).join(' ')} />
                {evalPoints.map(p => <rect key={p.id} x={p.i * 10 - 5} y="0" width="10" height="100" className={p.id === cur ? 'graphcur' : 'graphhit'} onClick={() => setCur(p.id)} />)}
              </svg>
            )}
          </section>

          <section className="card" aria-label="Load and save">
            <h2>Load or save</h2>
            <textarea rows={3} value={text} onChange={e => setText(e.target.value)} placeholder="Paste a PGN or a FEN" aria-label="PGN or FEN" />
            <div className="row filters">
              <button type="button" onClick={() => importText(text)} disabled={!text.trim()}>Load</button>
              <button type="button" onClick={() => { load(START, []) }}>New board</button>
              <button type="button" onClick={() => copy(fen, 'FEN')}>Copy FEN</button>
              <button type="button" onClick={() => copy(pgnOut, 'PGN')} disabled={mainline.length < 2}>Copy PGN</button>
              <button type="button" onClick={download} disabled={mainline.length < 2}>Download PGN</button>
            </div>
            {saved.length > 0 && (
              <label className="field"><span className="small muted">Open one of your saved games</span>
                <select defaultValue="" onChange={e => { const g = saved.find(x => x.id === +e.target.value); if (g) importText(g.pgn) }} aria-label="Saved games">
                  <option value="" disabled>Choose a game…</option>
                  {saved.map(g => <option key={g.id} value={g.id}>{g.white} vs {g.black} · {g.result} · {g.date ?? ''}</option>)}
                </select></label>
            )}
            {msg && <p role="status" className="small">{msg}</p>}
          </section>
        </div>
      </div>
    </main>
  )
}
