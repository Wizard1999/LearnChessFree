import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChessBoard } from '../components/ChessBoard'
import { OpeningTree } from '../components/OpeningTree'
import { children, cnt, ensureChunk, loadOpenings, nameOf, nodeFen, type OGraph } from '../lib/openingsData'
import { kvGet, kvSet } from '../db'
import { Chess } from 'chess.js'
import { splitPgn } from '../lib/pgn'

interface RepEntry { note: string; side: 'white' | 'black'; path: string; san: string[]; added: number }
const FEW = 30 // below this many games in a band, shares and results are noise (docs/openings-data.md)
const pct = (x: number) => (x >= 0.1 ? `${Math.round(x * 100)}%` : x >= 0.001 ? `${(x * 100).toFixed(1)}%` : '<0.1%')

function trailTo(g: OGraph, id: string, via: string | null): string[] {
  const out = [id]
  let cur = id
  let first = via
  for (let guard = 0; guard < 40 && cur !== g.rootId; guard++) {
    const parents = g.inn.get(cur) ?? []
    if (parents.length === 0) break
    const pick = (first && parents.find(e => e.f === first)) || parents.reduce((a, b) => (b.n.reduce((s, x) => s + x, 0) > a.n.reduce((s, x) => s + x, 0) ? b : a))
    first = null
    out.unshift(pick.f); cur = pick.f
  }
  return out
}
const numbered = (sans: string[]) => sans.map((s, i) => (i % 2 === 0 ? `${i / 2 + 1}. ${s}` : s)).join(' ')

export function Openings() {
  const [g, setG] = useState<OGraph | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [band, setBand] = useState<number | null>(null)
  const [minShare, setMinShare] = useState(0.02)
  const [trail, setTrail] = useState<string[]>([])
  const [userOpen, setUserOpen] = useState<Set<string>>(new Set())
  const [, bump] = useState(0)
  const [rep, setRep] = useState<Record<string, RepEntry>>({})
  const [note, setNote] = useState('')
  const [flip, setFlip] = useState(false)
  const [pgnText, setPgnText] = useState('')
  const [pgnSide, setPgnSide] = useState<'white' | 'black'>('white')
  const [pgnMsg, setPgnMsg] = useState<string | null>(null)

  useEffect(() => {
    loadOpenings().then(gr => { setG(gr); setTrail([gr.rootId]); setUserOpen(new Set([gr.rootId])) }).catch(e => setErr(String(e.message ?? e)))
    void kvGet<Record<string, RepEntry>>('repertoire', {}).then(setRep)
  }, [])

  const expanded = useMemo(() => new Set([...userOpen, ...trail]), [userOpen, trail])
  const repSet = useMemo(() => new Set(Object.keys(rep)), [rep])
  const cur = g && trail.length ? g.nodes.get(trail[trail.length - 1]) : undefined
  const curId = trail[trail.length - 1]

  const select = useCallback(async (id: string, via: string | null) => {
    if (!g) return
    await ensureChunk(g, id)
    setTrail(trailTo(g, id, via)); bump(x => x + 1)
  }, [g])
  const toggle = useCallback(async (id: string) => {
    if (!g) return
    await ensureChunk(g, id)
    setUserOpen(prev => { const n = new Set(prev); if (n.has(id) && !trail.includes(id)) n.delete(id); else n.add(id); return n }); bump(x => x + 1)
  }, [g, trail])

  const sans = useMemo(() => {
    if (!g) return []
    const out: string[] = []
    for (let i = 1; i < trail.length; i++) { const e = (g.out.get(trail[i - 1]) ?? []).find(x => x.t === trail[i]); if (e) out.push(e.m) }
    return out
  }, [g, trail, g?.version])

  if (err) return <main className="page"><h1>Openings</h1><p className="warn">The opening data is not available yet: {err}</p><p className="muted">It is built by <code>tools/openings</code>; see <code>docs/openings-data.md</code>.</p></main>
  if (!g || !cur) return <main className="page"><h1>Openings</h1><p className="muted">Loading the opening tree…</p></main>

  const bandLabel = band === null ? 'all ratings' : g.manifest.bands[band]?.label
  const inEdge = trail.length > 1 ? (g.inn.get(curId) ?? []).find(e => e.f === trail[trail.length - 2]) : undefined
  const kids = children(g, curId, band)
  const curN = cnt(cur.n, band)
  const named = nameOf(g, curId)
  const others = (g.inn.get(curId) ?? []).filter(e => e.f !== trail[trail.length - 2]).sort((a, b) => cnt(b.n, band) - cnt(a.n, band)).slice(0, 5)
  const inN = inEdge ? cnt(inEdge.n, band) : 0
  const wdl = inEdge && inN >= FEW ? (() => { const w = cnt(inEdge.w, band) / inN, d = cnt(inEdge.d, band) / inN; return { w, d, l: 1 - w - d } })() : null
  const repEntry = rep[curId]
  const fen = nodeFen(cur)

  async function saveRep(next: Record<string, RepEntry>) { setRep(next); await kvSet('repertoire', next) }
  async function addRep() { await saveRep({ ...rep, [curId]: { note, side: sans.length % 2 === 1 ? 'white' : 'black', path: numbered(sans), san: sans, added: Date.now() } }); setNote('') }
  async function importPgn() {
    const next = { ...rep }
    let added = 0, bad = 0
    for (const raw of splitPgn(pgnText)) {
      try {
        const c = new Chess(); c.loadPgn(raw)
        const san = c.history()
        if (san.length === 0) { bad++; continue }
        const comment = c.getComments().map(x => x.comment).filter(Boolean).join(' ').slice(0, 200)
        next[`pgn:${Date.now()}:${added}`] = { note: comment, side: pgnSide, path: numbered(san), san, added: Date.now() }; added++
      } catch { bad++ }
    }
    if (added) { await saveRep(next); setPgnText('') }
    setPgnMsg(`${added} line${added === 1 ? '' : 's'} added${bad ? `, ${bad} could not be read (only the main line of each game is used; variations are skipped)` : ''}.`)
  }
  function exportRep() {
    const games = Object.values(rep).map((r, i) => `[Event "Repertoire line ${i + 1}"]\n[Result "*"]\n\n${r.san.length ? numbered(r.san) : ''} ${r.note ? `{ ${r.note.replace(/[{}]/g, '')} }` : ''} *\n`).join('\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([games], { type: 'application/x-chess-pgn' })); a.download = 'my-repertoire.pgn'; a.click(); URL.revokeObjectURL(a.href)
  }
  const wdlBar = (w: number, d: number, l: number) => (
    <span className="wdl" aria-label={`White wins ${Math.round(w * 100)}%, draws ${Math.round(d * 100)}%, Black wins ${Math.round(l * 100)}%`}>
      <span style={{ width: `${w * 100}%` }} className="w" /><span style={{ width: `${d * 100}%` }} className="d" /><span style={{ width: `${l * 100}%` }} className="l" />
    </span>
  )

  return (
    <main className="page wide">
      <h1>Openings</h1>
      <p className="lede">Every opening is a route to positions, and different move orders often reach the same one. The tree shows what players actually play at each rating. Branch thickness is how often a move is chosen from that position; ⇄ marks a position reached by more than one move order.</p>
      {g.manifest.dev && <p className="msg warn" role="status">Development sample ({g.manifest.source.name}). The full dataset is still being built.</p>}
      <div className="card controls">
        <div className="row" role="group" aria-label="Rating band">
          <span className="small muted">Players at:</span>
          <button type="button" className={band === null ? 'chip on' : 'chip'} onClick={() => setBand(null)}>All</button>
          {g.manifest.bands.map((b, i) => <button key={b.id} type="button" className={band === i ? 'chip on' : 'chip'} onClick={() => setBand(i)}>{b.label}</button>)}
        </div>
        <div className="row">
          <label className="small muted">Hide moves played less than <select value={minShare} onChange={e => setMinShare(Number(e.target.value))} style={{ width: 'auto' }}>{[0, 0.005, 0.01, 0.02, 0.05].map(v => <option key={v} value={v}>{v === 0 ? 'show every move' : `${v * 100}%`}</option>)}</select> of the time</label>
          <button type="button" onClick={() => { setTrail([g.rootId]); setUserOpen(new Set([g.rootId])) }}>Reset tree</button>
        </div>
        <p className="small muted">Data: {g.manifest.source.name}, {g.manifest.source.month}; {g.manifest.source.games_used.toLocaleString()} games used. {g.manifest.bandRule}. These are online games of many strengths, not master games; they show what is popular, not what is best.</p>
      </div>
      <div className="opngrid">
        <OpeningTree g={g} band={band} expanded={expanded} trail={trail} minShare={minShare} repertoire={repSet} onSelect={(id, via) => void select(id, via)} onToggle={id => void toggle(id)} />
        <aside>
          <section className="card">
            <ChessBoard fen={fen} orientation={flip ? 'black' : 'white'} lastMove={(() => { const e = inEdge; return e ? [e.u.slice(0, 2), e.u.slice(2, 4)] as [string, string] : null })()} label="Opening position" />
            <div className="row">
              <button type="button" onClick={() => setTrail(t => (t.length > 1 ? t.slice(0, -1) : t))} disabled={trail.length <= 1}>◀ Back</button>
              <button type="button" onClick={() => setFlip(f => !f)}>Flip</button>
              <Link className="button" to={`/play?fen=${encodeURIComponent(fen)}`}>Play from here</Link>
            </div>
            <p className="moves small">{sans.length ? numbered(sans) : 'Starting position'}</p>
            <p><strong>{named.name ?? 'No named opening here'}</strong> {named.eco && <span className="muted small">· {named.eco}</span>}</p>
            <p className="small muted">{curN.toLocaleString()} games reached this position at {bandLabel}.</p>
            {inEdge && !wdl && <p className="small muted">Only {inN.toLocaleString()} game{inN === 1 ? '' : 's'} at {bandLabel} reached this position by this move, too few to say how it scores.</p>}
            {wdl && <p className="small">Results after this move at {bandLabel}: {wdlBar(wdl.w, wdl.d, wdl.l)} <span className="muted">White {Math.round(wdl.w * 100)}% · draw {Math.round(wdl.d * 100)}% · Black {Math.round(wdl.l * 100)}%</span></p>}
          </section>
          <section className="card">
            <h2>What gets played next</h2>
            {kids.length === 0 ? <p className="muted small">No continuations are stored below this point (too rare, or past the depth of the data).</p> : (
              <table className="table small"><thead><tr><th>Move</th><th>Played</th><th>Results</th></tr></thead>
                <tbody>{kids.slice(0, 10).map(e => { const n = cnt(e.n, band) || 0; const w = n ? cnt(e.w, band) / n : 0; const d = n ? cnt(e.d, band) / n : 0; const nm = g.nodes.get(e.t)?.name
                  return <tr key={e.u}><td><button type="button" className="link" onClick={() => void select(e.t, curId)}><strong>{e.m}</strong></button>{nm && <div className="muted small">{nm}</div>}</td>
                    <td>{n < FEW ? <span className="muted">{n.toLocaleString()} game{n === 1 ? '' : 's'}</span> : <>{pct(curN ? n / curN : 0)} <span className="muted">({n.toLocaleString()})</span></>}</td><td>{n < FEW ? <span className="muted small">too few</span> : wdlBar(w, d, 1 - w - d)}</td></tr> })}</tbody></table>
            )}
            {kids.length > 10 && <p className="muted small">{kids.length - 10} more moves are stored; widen the filter to see them in the tree.</p>}
          </section>
          {others.length > 0 && (
            <section className="card">
              <h2>⇄ Other ways to get here</h2>
              <ul className="plain small">{others.map(e => <li key={e.f + e.u}><button type="button" className="link" onClick={() => void select(curId, e.f)}>{g.nodes.get(e.f)?.path ? numbered(g.nodes.get(e.f)!.path.split(' ')) : 'start'} {e.m}</button> <span className="muted">({cnt(e.n, band).toLocaleString()} games)</span></li>)}</ul>
              <p className="muted small">Different move orders can lead to the same position; knowing this keeps you from being surprised, and from learning the same thing twice.</p>
            </section>
          )}
          <section className="card">
            <h2>My repertoire</h2>
            {repEntry ? (
              <>
                <p className="small">This position is in your repertoire{repEntry.note ? `: ${repEntry.note}` : ''}.</p>
                <div className="row"><button type="button" onClick={async () => { const n = { ...rep }; delete n[curId]; await saveRep(n) }}>Remove</button></div>
              </>
            ) : (
              <>
                <label className="field"><span className="small muted">Why do you want to play this? (one line, optional)</span><input type="text" value={note} onChange={e => setNote(e.target.value)} /></label>
                <div className="row" role="group" aria-label="Annotation symbols">{['!', '!?', '?!', '?', '=', '⩲', '⩱', '±', '∓', '∞', 'N'].map(sym => <button key={sym} type="button" className="chip" onClick={() => setNote(n => `${n}${sym}`)} title={`Add ${sym}`}>{sym}</button>)}</div>
                <div className="row"><button type="button" onClick={() => void addRep()} disabled={trail.length <= 1}>Add this line</button></div>
              </>
            )}
            <p className="small muted">{Object.keys(rep).length} line{Object.keys(rep).length === 1 ? '' : 's'} saved on this device.</p>
            {Object.keys(rep).length > 0 && <div className="row"><Link className="button primary" to="/drill">Drill my repertoire</Link><button type="button" onClick={exportRep}>Export as PGN</button></div>}
            <details>
              <summary className="small">Import lines from a PGN</summary>
              <label className="field"><span className="small muted">Paste one or more games. The main line of each becomes a repertoire line.</span><textarea rows={3} value={pgnText} onChange={e => setPgnText(e.target.value)} /></label>
              <div className="row"><select value={pgnSide} onChange={e => setPgnSide(e.target.value as 'white' | 'black')} style={{ width: 'auto' }} aria-label="Side these lines are for"><option value="white">Lines for White</option><option value="black">Lines for Black</option></select>
                <button type="button" onClick={() => void importPgn()} disabled={!pgnText.trim()}>Add to my repertoire</button></div>
              {pgnMsg && <p className="small" role="status">{pgnMsg}</p>}
            </details>
            <p className="small muted">Build a repertoire from the openings you actually meet. Memorise only lines where one slip loses quickly; learn the plans for the rest. See <Link to="/course">the opening nodes</Link>.</p>
          </section>
        </aside>
      </div>
    </main>
  )
}
