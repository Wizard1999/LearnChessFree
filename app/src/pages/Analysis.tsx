import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Chess, type Square } from 'chess.js'
import type { Api } from 'chessground/api'
import type { Key } from 'chessground/types'
import { ChessBoard } from '../components/ChessBoard'
import { getEngine, resetEngine, scoreText, type EngineLine } from '../engine'
import { destsFor, flipTurn } from '../lib/play'
import { db, type GameRec } from '../db'
import { loadOpenings, nameOf, children as openingChildren, cnt, type OGraph } from '../lib/openingsData'
import { addMove, emptyTree, moveNumber, NAG_SYMBOL, parsePgn, START_FEN, SYMBOL_NAG, writePgn, type Tree } from '../lib/pgnTree'
import { pieceCount, probeTablebase, TB_TEXT, type TbResult } from '../lib/tablebase'

const epdOf = (fen: string) => fen.split(' ').slice(0, 4).join(' ')
const cloneTree = (t: Tree): Tree => ({ ...t, nodes: t.nodes.map(n => ({ ...n, kids: [...n.kids] })) })

/** Win chance for White in percent from a centipawn score (the logistic curve Lichess publishes; recalled from memory [R]). */
const winPct = (cp: number) => 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1)
const toCp = (l: EngineLine, white: boolean) => { const sign = white ? 1 : -1; return l.kind === 'mate' ? sign * (l.value > 0 ? 2000 : -2000) : sign * l.value }
type Mark = '' | '?!' | '?' | '??'

const PALETTE = [
  { id: 'wk', role: 'king', color: 'white', sym: '♔' }, { id: 'wq', role: 'queen', color: 'white', sym: '♕' }, { id: 'wr', role: 'rook', color: 'white', sym: '♖' },
  { id: 'wb', role: 'bishop', color: 'white', sym: '♗' }, { id: 'wn', role: 'knight', color: 'white', sym: '♘' }, { id: 'wp', role: 'pawn', color: 'white', sym: '♙' },
  { id: 'bk', role: 'king', color: 'black', sym: '♚' }, { id: 'bq', role: 'queen', color: 'black', sym: '♛' }, { id: 'br', role: 'rook', color: 'black', sym: '♜' },
  { id: 'bb', role: 'bishop', color: 'black', sym: '♝' }, { id: 'bn', role: 'knight', color: 'black', sym: '♞' }, { id: 'bp', role: 'pawn', color: 'black', sym: '♟' },
] as const

function sanLine(fen: string, pv: string[], n = 10): { san: string; num: string }[] {
  const c = new Chess(fen)
  const f = fen.split(' ')
  const base = ((parseInt(f[5] ?? '1', 10) || 1) - 1) * 2 + (c.turn() === 'b' ? 1 : 0)
  const out: { san: string; num: string }[] = []
  for (const uci of pv.slice(0, n)) {
    const ply = base + out.length
    try { const m = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }); out.push({ san: m.san, num: ply % 2 === 0 ? `${ply / 2 + 1}.` : out.length === 0 ? `${(ply - 1) / 2 + 1}...` : '' }) } catch { break }
  }
  return out
}

/** A FEN, or a PGN with variations, comments and marks; anything else is rejected with a message. */
function parseInput(text: string): Tree | string {
  const t = text.trim()
  if (!t) return 'Nothing to load.'
  if (/^[prnbqkPRNBQK1-8/]+\s+[wb]\s+/.test(t)) { try { return emptyTree(new Chess(t).fen()) } catch { return 'That is not a valid position.' } }
  return parsePgn(t)
}

/** The engine on its own, plus a game explorer: move tree with variations and comments, evaluation bar and graph, whole-game analysis,
 * threat arrows, a board editor, tablebase lookups, and PGN and FEN in and out. */
export function Analysis() {
  const [params] = useSearchParams()
  const [tree, setTree] = useState<Tree>(() => emptyTree())
  const [cur, setCur] = useState(0)
  const [flip, setFlip] = useState(false)
  const [on, setOn] = useState(true)
  const [multipv, setMultipv] = useState(3)
  const [maxDepth, setMaxDepth] = useState(18)
  const [arrows, setArrows] = useState(true)
  const [threat, setThreat] = useState(false)
  const [threatLine, setThreatLine] = useState<EngineLine | null>(null)
  const [tbOn, setTbOn] = useState(false)
  const [tb, setTb] = useState<TbResult | null>(null)
  const [tbErr, setTbErr] = useState<string | null>(null)
  const [lines, setLines] = useState<EngineLine[] | null>(null)
  const [liveDepth, setLiveDepth] = useState(0)
  const [thinking, setThinking] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [evals, setEvals] = useState<Record<string, number>>({}) // epd -> centipawns, White's point of view
  const [bests, setBests] = useState<Record<string, string>>({}) // epd -> the engine's preferred move (uci) in that position
  const [batch, setBatch] = useState<{ done: number; total: number } | null>(null)
  const cancelBatch = useRef(false)
  const [retry, setRetry] = useState<{ id: number; verdict: string | null } | null>(null)
  const [promo, setPromo] = useState<{ from: string; to: string } | null>(null)
  const [text, setText] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [saved, setSaved] = useState<GameRec[]>([])
  const [graph, setGraph] = useState<OGraph | null>(null)
  const [epdToNode, setEpdToNode] = useState<Map<string, string>>(new Map())
  const [editing, setEditing] = useState<{ turn: 'w' | 'b'; castle: string } | null>(null)
  const [tool, setTool] = useState<string | null>(null)
  const editApi = useRef<Api | null>(null)
  const editPlacement = useRef('')

  const node = tree.nodes[cur]
  const fen = node.fen
  const chess = useMemo(() => new Chess(fen), [fen])
  const whiteToMove = chess.turn() === 'w'
  const over = chess.isGameOver()
  const mainline = useMemo(() => { const out = [0]; let n = tree.nodes[0]; while (n.kids.length) { n = tree.nodes[n.kids[0]]; out.push(n.id) } return out }, [tree])

  // ---- moves and navigation
  const playSan = useCallback((san: string, from = cur) => {
    const nt = cloneTree(tree)
    const id = addMove(nt, from, san)
    if (id === null) return
    setTree(nt); setCur(id)
  }, [tree, cur])
  const play = useCallback((from: string, to: string, promotion?: string) => {
    try { playSan(new Chess(fen).move({ from, to, promotion }).san) } catch { /* illegal: the board only offers legal moves */ }
  }, [fen, playSan])
  const playUci = (uci: string) => play(uci.slice(0, 2), uci.slice(2, 4), uci[4])
  function onBoardMove(from: string, to: string) {
    if (retry) { void tryRetry(from, to); return }
    const piece = chess.get(from as Square)
    if (piece?.type === 'p' && (to[1] === '8' || to[1] === '1')) setPromo({ from, to })
    else play(from, to)
  }
  /** Plays the first `k+1` moves of an engine line from the current position, as a new branch if needed. */
  function playLine(pv: string[], k: number) {
    const nt = cloneTree(tree); let at = cur; const c = new Chess(fen)
    for (const uci of pv.slice(0, k + 1)) {
      let m; try { m = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }) } catch { break }
      const id = addMove(nt, at, m.san); if (id === null) break; at = id
    }
    setTree(nt); setCur(at)
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
      if (editing || (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT'))) return
      if (e.key === 'ArrowLeft') { go('back'); e.preventDefault() }
      else if (e.key === 'ArrowRight') { go('fwd'); e.preventDefault() }
      else if (e.key === 'ArrowUp' || e.key === 'Home') { go('start'); e.preventDefault() }
      else if (e.key === 'ArrowDown' || e.key === 'End') { go('end'); e.preventDefault() }
      else if (e.key === 'f') setFlip(f => !f)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [go, editing])
  function deleteFromHere() {
    if (cur === 0) return
    const drop = new Set<number>(); const walk = (id: number) => { drop.add(id); tree.nodes[id].kids.forEach(walk) }; walk(cur)
    const parent = tree.nodes[cur].parent ?? 0
    const keep = tree.nodes.filter(n => !drop.has(n.id))
    const remap = new Map(keep.map((n, i) => [n.id, i]))
    const nodes = keep.map(n => ({ ...n, id: remap.get(n.id)!, parent: n.parent === null ? null : remap.get(n.parent)!, kids: n.kids.filter(k => !drop.has(k)).map(k => remap.get(k)!) }))
    setTree({ ...tree, nodes }); setCur(remap.get(parent)!)
  }
  /** Makes this variation the main line at its branch point. */
  function promoteVariation() {
    const p = node.parent; if (p === null) return
    const nt = cloneTree(tree); nt.nodes[p].kids = [cur, ...nt.nodes[p].kids.filter(k => k !== cur)]; setTree(nt)
  }
  function annotate(patch: { comment?: string; nag?: number | undefined }) {
    const nt = cloneTree(tree); const n = nt.nodes[cur]
    if ('comment' in patch) n.comment = patch.comment || undefined
    if ('nag' in patch) n.nag = patch.nag
    setTree(nt)
  }

  // ---- live engine: deepen step by step so something appears at once
  useEffect(() => {
    if (!on || over || batch || editing) { setLines(null); setLiveDepth(0); setThreatLine(null); return }
    let dead = false
    setThinking(true); setNote(null); setThreatLine(null)
    const steps = [...new Set([Math.min(8, maxDepth), Math.min(12, maxDepth), Math.min(16, maxDepth), maxDepth])]
    const run = async () => {
      await new Promise(r => setTimeout(r, 200))
      for (const d of steps) {
        if (dead) return
        const timeout = new Promise<null>(r => setTimeout(() => r(null), 30000))
        let r: EngineLine[] | null = null
        try { r = await Promise.race([getEngine().analyse(fen, { depth: d, multipv }), timeout]) } catch { if (!dead) { setThinking(false); setNote('The engine could not run here.') } return }
        if (dead) return
        if (r === null) { resetEngine(); setThinking(false); setNote('The engine took too long and was restarted. Lower the depth.'); return }
        setLines(r); setLiveDepth(r[0]?.depth ?? d)
        if (r[0]) { setEvals(e => ({ ...e, [epdOf(fen)]: toCp(r![0], whiteToMove) })); setBests(b => ({ ...b, [epdOf(fen)]: r![0].pv[0] })) }
      }
      if (threat && !chess.inCheck()) {
        // the opponent's best move if it were their turn: a "null move" search
        const r = await getEngine().analyse(flipTurn(fen), { depth: Math.min(14, maxDepth), multipv: 1 }).catch(() => null)
        if (!dead && r && r[0]) setThreatLine(r[0])
      }
      if (!dead) setThinking(false)
    }
    void run()
    return () => { dead = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen, on, over, maxDepth, multipv, batch, threat, editing])

  useEffect(() => {
    if (!over) return
    const cp = chess.isCheckmate() ? (whiteToMove ? -2000 : 2000) : 0
    setEvals(e => ({ ...e, [epdOf(fen)]: cp }))
  }, [over, fen, chess, whiteToMove])

  // ---- tablebase (optional, online; only the position is sent)
  useEffect(() => {
    setTb(null); setTbErr(null)
    if (!tbOn || pieceCount(fen) > 7 || editing) return
    let dead = false
    probeTablebase(fen).then(r => { if (!dead) setTb(r) }).catch(() => { if (!dead) setTbErr('The tablebase service could not be reached.') })
    return () => { dead = true }
  }, [tbOn, fen, editing])

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
        if (r[0]) { setEvals(e => ({ ...e, [key]: toCp(r[0], c.turn() === 'w') })); setBests(b => ({ ...b, [key]: r[0].pv[0] })) }
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
    const mistakes = mainline.filter(id => m.get(id) === '?' || m.get(id) === '??')
    return { m, white: acc(loss.w), black: acc(loss.b), mistakes }
  }, [evals, mainline, tree])
  /** What the engine preferred instead of the move played at this node, when it was analysed and differs from it. */
  const better = (() => {
    if (cur === 0 || node.parent === null) return null
    const pf = tree.nodes[node.parent].fen
    const u = bests[epdOf(pf)]
    if (!u || u === node.uci) return null
    try { return { uci: u, san: new Chess(pf).move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }).san } } catch { return null }
  })()
  /** Learn from your mistakes: go to the position before a mistake and ask for a better move than the one played. */
  function startRetry(id: number) {
    const n = tree.nodes[id]; if (n.parent === null) return
    setCur(n.parent); setRetry({ id, verdict: null })
  }
  async function tryRetry(from: string, to: string) {
    if (!retry) return
    const n = tree.nodes[retry.id]; const pf = tree.nodes[n.parent ?? 0].fen
    const c = new Chess(pf); let m
    try { m = c.move({ from, to, promotion: 'q' }) } catch { return }
    const uci = m.from + m.to + (m.promotion ?? '')
    if (uci === n.uci) { setRetry({ ...retry, verdict: 'That is the move that was played. Look for something better.' }); return }
    const best = bests[epdOf(pf)]
    if (uci === best) { setRetry({ ...retry, verdict: `Yes: ${m.san} is the engine's first choice.` }); return }
    setRetry({ ...retry, verdict: `Checking ${m.san} with the engine…` })
    const r = await getEngine().analyse(c.fen(), { depth: 12, multipv: 1 }).catch(() => null)
    const before = evals[epdOf(pf)]
    if (!r || !r[0] || before === undefined) { setRetry({ ...retry, verdict: 'The engine could not check that move.' }); return }
    const mover = new Chess(pf).turn(); const after = toCp(r[0], c.turn() === 'w')
    const pa = mover === 'w' ? winPct(before) : 100 - winPct(before), pb = mover === 'w' ? winPct(after) : 100 - winPct(after)
    const loss = pa - pb
    setRetry({ ...retry, verdict: loss < 10 ? `${m.san} also works: it keeps the position about as good (the engine at depth 12).` : `Not quite: ${m.san} gives up about ${loss.toFixed(0)} points of win chance. Try again, or show the answer.` })
  }
  function nextMistake(dir: 1 | -1) {
    const ms = marks.mistakes; if (!ms.length) return
    const idx = mainline.indexOf(cur)
    const cand = dir === 1 ? ms.find(id => mainline.indexOf(id) > idx) ?? ms[0] : [...ms].reverse().find(id => mainline.indexOf(id) < idx) ?? ms[ms.length - 1]
    setCur(cand)
  }

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
  function loadTree(t: Tree) { setTree(t); setCur(0); setEvals({}); setMsg(null); setText('') }
  function importText(t: string) { const r = parseInput(t); if (typeof r === 'string') setMsg(r); else loadTree(r) }
  useEffect(() => {
    const fenParam = params.get('fen'), gameParam = params.get('game')
    if (fenParam) { const r = parseInput(fenParam); if (typeof r !== 'string') loadTree(r) }
    else if (gameParam) void db.games.get(+gameParam).then(g => { if (g) importText(g.pgn) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const pgnOut = useMemo(() => writePgn(tree), [tree])
  const copy = (s: string, label: string) => { void navigator.clipboard?.writeText(s).then(() => setMsg(`${label} copied.`), () => setMsg('Copy was blocked; select the text instead.')) }
  const shareLink = () => `${window.location.href.split('#')[0]}#/analysis?fen=${encodeURIComponent(fen)}`
  function download() {
    const url = URL.createObjectURL(new Blob([pgnOut], { type: 'application/x-chess-pgn' }))
    const a = document.createElement('a'); a.href = url; a.download = 'analysis.pgn'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  // ---- board editor
  function openEditor() {
    const f = fen.split(' ')
    editPlacement.current = f[0]
    setEditing({ turn: (f[1] as 'w' | 'b') ?? 'w', castle: f[2] === '-' ? '' : f[2] })
  }
  function editSquare(key: string) {
    const a = editApi.current
    if (!a || !tool) return
    if (tool === 'erase') a.setPieces(new Map([[key as Key, undefined]]))
    else { const p = PALETTE.find(x => x.id === tool)!; a.setPieces(new Map([[key as Key, { role: p.role, color: p.color }]])) }
    editPlacement.current = a.getFen()
  }
  function applyEditor() {
    if (!editing) return
    const castle = ['K', 'Q', 'k', 'q'].filter(c => editing.castle.includes(c)).join('') || '-'
    try { loadTree(emptyTree(new Chess(`${editPlacement.current} ${editing.turn} ${castle} - 0 1`).fen())); setEditing(null) }
    catch { setMsg('That position is not legal: each side needs exactly one king, and the side not to move cannot be in check.') }
  }

  // ---- rendering helpers
  const topCp = evals[epdOf(fen)]
  const bar = topCp === undefined ? 50 : winPct(topCp)
  const barLabel = lines?.[0] ? scoreText(lines[0], whiteToMove) : topCp !== undefined ? (Math.abs(topCp) >= 2000 ? (topCp > 0 ? '1-0' : '0-1') : `${topCp > 0 ? '+' : ''}${(topCp / 100).toFixed(1)}`) : ''
  const shapes = [
    ...(!arrows || !on || over || !lines ? [] : lines.slice(0, multipv).map((l, i) => {
      // thickness follows how much win chance the move gives up against the best line (as on Lichess): best is thick, weak moves thin
      const own = (x: EngineLine) => winPct(x.kind === 'mate' ? (x.value > 0 ? 2000 : -2000) : x.value)
      const loss = Math.max(0, own(lines[0]) - own(l))
      return { from: l.pv[0].slice(0, 2), to: l.pv[0].slice(2, 4), brush: (i === 0 ? 'green' : i === 1 ? 'blue' : 'yellow') as 'green' | 'blue' | 'yellow', width: Math.max(3, 13 - loss * 0.7) }
    })),
    ...(threat && threatLine ? [{ from: threatLine.pv[0].slice(0, 2), to: threatLine.pv[0].slice(2, 4), brush: 'red' as const, width: 8 }] : []),
  ]
  const status = chess.isCheckmate() ? `Checkmate: ${whiteToMove ? 'Black' : 'White'} wins.` : chess.isStalemate() ? 'Stalemate: a draw.' : chess.isDraw() ? 'A draw by rule.' : chess.isCheck() ? 'Check.' : ''
  const lastMove = node.uci ? ([node.uci.slice(0, 2), node.uci.slice(2, 4)] as [string, string]) : null
  const top = lines?.[0]
  const wdl = top?.wdl ? (whiteToMove ? top.wdl : ([top.wdl[2], top.wdl[1], top.wdl[0]] as [number, number, number])) : null

  function renderLine(startId: number): ReactNode[] {
    const out: ReactNode[] = []
    let id: number | undefined = startId; let first = true
    for (let guard = 0; id !== undefined && guard < 800; guard++) {
      const n = tree.nodes[id]
      const { number, white } = moveNumber(tree, n)
      const label = white ? `${number}.` : first ? `${number}...` : ''
      const mk = marks.m.get(id) ?? ''
      const manual = n.nag ? NAG_SYMBOL[n.nag] ?? '' : ''
      const shown = manual || mk
      const cid: number = id
      out.push(<span key={id} className="mv">{label && <span className="mvnum">{label}</span>}<button type="button" className={`mvbtn${id === cur ? ' on' : ''}${shown ? ' m' + shown.length : ''}${shown && shown[0] === '!' ? ' good' : ''}`} onClick={() => setCur(cid)} aria-current={id === cur ? 'true' : undefined}>{n.san}{shown}</button>{n.comment && <span className="mvcomment">{n.comment}</span>}</span>)
      first = !!n.comment
      const par = tree.nodes[n.parent ?? 0]
      if (par.kids[0] === id) for (const a of par.kids.slice(1)) { out.push(<span key={`v${a}`} className="variation">({renderLine(a)})</span>); first = true }
      id = n.kids[0]
    }
    return out
  }
  const moveList = tree.nodes[0].kids.length ? renderLine(tree.nodes[0].kids[0]) : []

  const evalPoints = mainline.map((id, i) => ({ id, i, cp: evals[epdOf(tree.nodes[id].fen)] }))
  const haveGraph = evalPoints.filter(p => p.cp !== undefined).length >= 2
  const editFen = editing ? `${editPlacement.current} ${editing.turn} - - 0 1` : fen

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
            {editing ? (
              <ChessBoard key="editor" fen={editFen} orientation={flip ? 'black' : 'white'} edit={{ onChange: pl => { editPlacement.current = pl }, onSquare: editSquare }} apiRef={editApi} label="Board editor" />
            ) : (
              <ChessBoard fen={fen} orientation={flip ? 'black' : 'white'} movable={over ? null : { color: whiteToMove ? 'white' : 'black', dests: destsFor(chess), onMove: onBoardMove }} shapes={shapes} lastMove={lastMove} check={chess.inCheck()} label="Analysis board" controlMap />
            )}
          </div>
          {editing ? (
            <div className="card" role="group" aria-label="Board editor">
              <p className="small muted">Pick a piece, then click squares to place it. Drag a piece to move it, or drag it off the board to remove it.</p>
              <div className="palette" role="group" aria-label="Piece palette">
                {PALETTE.map(p => <button key={p.id} type="button" className={tool === p.id ? 'chip on' : 'chip'} onClick={() => setTool(tool === p.id ? null : p.id)} aria-label={`${p.color} ${p.role}`}>{p.sym}</button>)}
                <button type="button" className={tool === 'erase' ? 'chip on' : 'chip'} onClick={() => setTool(tool === 'erase' ? null : 'erase')}>Erase</button>
                <button type="button" onClick={() => { editApi.current?.set({ fen: '8/8/8/8/8/8/8/8 w - - 0 1' }); editPlacement.current = '8/8/8/8/8/8/8/8' }}>Clear</button>
                <button type="button" onClick={() => { editApi.current?.set({ fen: START_FEN }); editPlacement.current = START_FEN.split(' ')[0] }}>Start position</button>
              </div>
              <div className="row filters">
                <label className="small">Side to move <select value={editing.turn} onChange={e => setEditing({ ...editing, turn: e.target.value as 'w' | 'b' })}><option value="w">White</option><option value="b">Black</option></select></label>
                {['K', 'Q', 'k', 'q'].map(c => <label key={c} className="small"><input type="checkbox" checked={editing.castle.includes(c)} onChange={e => setEditing({ ...editing, castle: e.target.checked ? editing.castle + c : editing.castle.replace(c, '') })} /> {({ K: 'White O-O', Q: 'White O-O-O', k: 'Black O-O', q: 'Black O-O-O' })[c]}</label>)}
              </div>
              <div className="row"><button type="button" className="primary" onClick={applyEditor}>Analyse this position</button><button type="button" onClick={() => setEditing(null)}>Cancel</button></div>
            </div>
          ) : (
            <>
              {promo && <div className="row" role="group" aria-label="Promote to"><span className="small">Promote to:</span>{(['q', 'r', 'b', 'n'] as const).map(p => <button key={p} type="button" onClick={() => { play(promo.from, promo.to, p); setPromo(null) }}>{({ q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight' })[p]}</button>)}<button type="button" className="link" onClick={() => setPromo(null)}>Cancel</button></div>}
              <div className="row filters analysisbar">
                <button type="button" onClick={() => go('start')} aria-label="Go to start" disabled={cur === 0}>⏮</button>
                <button type="button" onClick={() => go('back')} aria-label="Previous move" disabled={cur === 0}>◀</button>
                <button type="button" onClick={() => go('fwd')} aria-label="Next move" disabled={!node.kids.length}>▶</button>
                <button type="button" onClick={() => go('end')} aria-label="Go to end" disabled={!node.kids.length}>⏭</button>
                <button type="button" onClick={() => setFlip(f => !f)}>Flip</button>
                <button type="button" onClick={openEditor}>Edit board</button>
                <button type="button" onClick={deleteFromHere} disabled={cur === 0} title="Delete this move and everything after it">Delete from here</button>
                <button type="button" onClick={promoteVariation} disabled={node.parent === null || tree.nodes[node.parent].kids[0] === cur} title="Make this line the main line">Make main line</button>
              </div>
              <p className="small muted">Arrow keys move through the game, F flips the board. The control map button under the board shows who controls each square. <Link to={`/play?fen=${encodeURIComponent(fen)}`}>Play on from here against the computer</Link>.</p>
            </>
          )}
        </div>

        <div className="stack">
          <section className="card" aria-label="Engine">
            <div className="sectionhead"><h2>{over ? status : `${whiteToMove ? 'White' : 'Black'} to move`}</h2>
              <button type="button" onClick={() => setOn(o => !o)} aria-pressed={on}>{on ? 'Engine on' : 'Engine off'}</button></div>
            {status && !over && <p className="small muted">{status}</p>}
            {on && !over && !editing && (
              <>
                <p className="small muted" role="status">{batch ? 'Analysing the whole game…' : thinking ? `Thinking… depth ${liveDepth}` : lines ? `Depth ${liveDepth}` : ''}{top?.nodes ? ` · ${(top.nodes / 1000).toFixed(0)}k nodes` : ''}{top?.nps ? ` · ${(top.nps / 1000).toFixed(0)}k nodes/s` : ''}{note ? ` ${note}` : ''}</p>
                {wdl && <p className="small" aria-label="Win, draw, loss chances"><span className="wdl"><span style={{ width: `${wdl[0] / 10}%` }} className="wdlw" /><span style={{ width: `${wdl[1] / 10}%` }} className="wdld" /><span style={{ width: `${wdl[2] / 10}%` }} className="wdll" /></span> White {(wdl[0] / 10).toFixed(0)}% · draw {(wdl[1] / 10).toFixed(0)}% · Black {(wdl[2] / 10).toFixed(0)}%</p>}
                <ol className="plain enginelines">
                  {(lines ?? []).map(l => {
                    const mv = sanLine(fen, l.pv)
                    return <li key={l.rank}><strong className="score">{scoreText(l, whiteToMove)}</strong><span>{mv.map((m, k) => <span key={k}>{m.num && <span className="mvnum">{m.num}</span>}<button type="button" className="mvbtn" onClick={() => playLine(l.pv, k)} title="Play this line up to here">{m.san}</button></span>)}</span></li>
                  })}
                </ol>
                {threat && (chess.inCheck() ? <p className="small muted">Threat arrows are off while the side to move is in check.</p> : threatLine && <p className="small"><span className="threatkey">Threat</span> if it were {whiteToMove ? 'Black' : 'White'}'s move, the engine would play {sanLine(flipTurn(fen), threatLine.pv, 1)[0]?.san} ({scoreText(threatLine, true)} for them).</p>)}
              </>
            )}
            <div className="row filters">
              <label className="small">Lines <select value={multipv} onChange={e => setMultipv(+e.target.value)}>{[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
              <label className="small">Depth <select value={maxDepth} onChange={e => setMaxDepth(+e.target.value)}>{[10, 14, 16, 18, 20, 22, 24, 26, 30].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
              <label className="small"><input type="checkbox" checked={arrows} onChange={e => setArrows(e.target.checked)} /> Arrows</label>
              <label className="small"><input type="checkbox" checked={threat} onChange={e => setThreat(e.target.checked)} /> Show threats</label>
              <label className="small" title="Sends only the position to the public Lichess tablebase service, for endgames with seven pieces or fewer"><input type="checkbox" checked={tbOn} onChange={e => setTbOn(e.target.checked)} /> Tablebase (online)</label>
            </div>
          </section>

          {tbOn && (
            <section className="card" aria-label="Tablebase">
              <h2>Endgame tablebase</h2>
              {pieceCount(fen) > 7 ? <p className="small muted">The tablebase covers positions with seven pieces or fewer; this one has {pieceCount(fen)}.</p> : tbErr ? <p className="small" role="alert">{tbErr}</p> : !tb ? <p className="small muted">Looking up…</p> : (
                <>
                  <p><strong>{TB_TEXT[tb.category] ?? tb.category}</strong> for {whiteToMove ? 'White' : 'Black'}{tb.dtm !== null ? `, mate in ${Math.abs(tb.dtm)}` : ''}{tb.dtz !== null ? ` (distance to a zeroing move: ${Math.abs(tb.dtz)})` : ''}.</p>
                  <p className="small">{tb.moves.slice(0, 8).map(m => <span key={m.uci} className="mv"><button type="button" className="mvbtn" onClick={() => playUci(m.uci)}>{m.san}</button><span className="muted small"> {m.category === 'loss' ? 'wins' : m.category === 'win' ? 'loses' : m.category === 'draw' ? 'draws' : m.category}</span></span>)}</p>
                </>
              )}
            </section>
          )}

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
              <>
                <p className="small">Accuracy (a rough estimate from win-chance loss; ?! is a loss of 10 to 20 points of win chance, ? 20 to 30, ?? 30 or more): White {marks.white !== null ? `${marks.white.toFixed(0)}%` : 'n/a'}, Black {marks.black !== null ? `${marks.black.toFixed(0)}%` : 'n/a'}. {marks.mistakes.length} mistake{marks.mistakes.length === 1 ? '' : 's'} or worse.</p>
                {marks.mistakes.length > 0 && <div className="row"><button type="button" onClick={() => nextMistake(-1)}>◀ Previous mistake</button><button type="button" onClick={() => nextMistake(1)}>Next mistake ▶</button><button type="button" className="primary" onClick={() => startRetry(marks.mistakes[0])}>Learn from your mistakes</button></div>}
                {retry && (() => { const n = tree.nodes[retry.id]; const pf = tree.nodes[n.parent ?? 0].fen; const bu = bests[epdOf(pf)]; const bsan = bu ? (() => { try { return new Chess(pf).move({ from: bu.slice(0, 2), to: bu.slice(2, 4), promotion: bu[4] }).san } catch { return null } })() : null; const nextId = marks.mistakes[marks.mistakes.indexOf(retry.id) + 1]
                  return <div className="card" role="status"><p><strong>Your turn.</strong> In the game, {new Chess(pf).turn() === 'w' ? 'White' : 'Black'} played {n.san}, which lost ground. Find a better move on the board.</p>{retry.verdict && <p>{retry.verdict}</p>}<div className="row">{bsan && <button type="button" onClick={() => setRetry({ ...retry, verdict: `The engine preferred ${bsan}.` })}>Show the answer</button>}{nextId !== undefined && <button type="button" onClick={() => startRetry(nextId)}>Next mistake</button>}<button type="button" onClick={() => setRetry(null)}>Stop</button></div></div> })()}
              </>
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

          {cur !== 0 && (
            <section className="card" aria-label="Annotate">
              <h2>Annotate {node.san}</h2>
              <div className="row filters" role="group" aria-label="Move mark">
                {(['!', '?', '!!', '??', '!?', '?!'] as const).map(s => <button key={s} type="button" className={node.nag === SYMBOL_NAG[s] ? 'chip on' : 'chip'} aria-pressed={node.nag === SYMBOL_NAG[s]} onClick={() => annotate({ nag: node.nag === SYMBOL_NAG[s] ? undefined : SYMBOL_NAG[s] })}>{s}</button>)}
              </div>
              <textarea rows={2} value={node.comment ?? ''} onChange={e => annotate({ comment: e.target.value })} placeholder="Your comment on this move" aria-label="Comment on this move" />
              {better && (marks.m.get(cur) ?? '') !== '' && <p className="small">The engine preferred <strong>{better.san}</strong>. <button type="button" className="link" onClick={() => { if (node.parent !== null) playSan(better.san, node.parent) }}>Play it as a variation</button></p>}
              <p className="small muted">Marks and comments travel with the PGN you copy or download.</p>
            </section>
          )}

          <section className="card" aria-label="Load and save">
            <h2>Load or save</h2>
            <textarea rows={3} value={text} onChange={e => setText(e.target.value)} placeholder="Paste a PGN (variations and comments are kept) or a FEN" aria-label="PGN or FEN" />
            <div className="row filters">
              <button type="button" onClick={() => importText(text)} disabled={!text.trim()}>Load</button>
              <button type="button" onClick={() => loadTree(emptyTree())}>New board</button>
              <button type="button" onClick={() => copy(fen, 'FEN')}>Copy FEN</button>
              <button type="button" onClick={() => copy(pgnOut, 'PGN')} disabled={mainline.length < 2}>Copy PGN</button>
              <button type="button" onClick={download} disabled={mainline.length < 2}>Download PGN</button>
              <button type="button" onClick={() => copy(shareLink(), 'Link')}>Copy link to this position</button>
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
