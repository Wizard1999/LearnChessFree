import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../lib/content'

export function Library() {
  const { manifest, items, lessons, skills, verified } = useContent()
  const byTask = useMemo(() => { const m = new Map<string, number>(); for (const i of items) m.set(i.task, (m.get(i.task) ?? 0) + 1); return [...m.entries()].sort((a, b) => b[1] - a[1]) }, [items])
  const byKind = useMemo(() => { const m = new Map<string, number>(); for (const i of items) { const k = (i.tags ?? []).find(t => t.startsWith('kind.')) ?? 'kind.authored'; m.set(k, (m.get(k) ?? 0) + 1) } return [...m.entries()].sort((a, b) => b[1] - a[1]) }, [items])
  const engines = useMemo(() => { const m = new Map<string, number>(); for (const v of Object.values(verified)) { const k = `${v.engine ?? 'rules only'}${v.depth ? ` @ depth ${v.depth}` : ''}`; m.set(k, (m.get(k) ?? 0) + 1) } return [...m.entries()] }, [verified])
  return (
    <main className="page">
      <h1>Library and how we know it is right</h1>
      <section className="card">
        <h2>What is in this build</h2>
        <p>{manifest.lessons} lessons, {manifest.items} exercises, {manifest.skills} skill nodes. Built {new Date(manifest.built).toLocaleString()} (content hash {manifest.hash}).</p>
        <p className="small muted">Exercises by type: {byTask.map(([k, v]) => `${k} ${v}`).join(' · ')}. By source: {byKind.map(([k, v]) => `${k.replace('kind.', '')} ${v}`).join(' · ')}.</p>
        <p className="small muted">Review status: {Object.entries(manifest.by_review).map(([k, v]) => `${k} ${v}`).join(' · ')}. "human-reviewed" stays at zero until a strong player signs items off.</p>
      </section>
      <section className="card">
        <h2>How every answer is checked</h2>
        <ul>
          <li><strong>Rules:</strong> legal moves, checkmate, stalemate, castling and the like are computed, not typed by hand.</li>
          <li><strong>Engine and tablebases:</strong> claims such as "this wins a queen" or "this is a draw" are checked by Stockfish or by exact endgame tablebases ({engines.map(([k, v]) => `${k}: ${v} exercises`).join('; ') || 'none yet'}). Engine results are evidence under recorded limits, not proofs.</li>
          <li><strong>Pattern tags in game review</strong> (fork, pin, trapped piece and so on) come from structural detectors, not from a language model. Only detectors whose claims Stockfish confirmed at least 90% of the time on real games are shown, and a tag is a lead, not an explanation. Measured precision and the detectors we hide are in docs/detectors.md.</li>
          <li><strong>Only checked material ships.</strong> An exercise whose checks fail, or that was edited after being checked, is left out of the build.</li>
          <li><strong>Explanations</strong> state only what a check establishes. They have not been reviewed by a strong human player unless an item says so; treat them as a careful draft.</li>
        </ul>
      </section>
      <section className="card">
        <h2>Where the ideas come from</h2>
        <p>Lessons are original. Ideas and their conditions were studied from public-domain books we hold full texts of (Capablanca, Nimzowitsch, Emanuel Lasker, Edward Lasker, Znosko-Borovsky), other works known to us only by description (marked as such in the project notes), free Lichess data (CC0) for positions and statistics, and our own constructions. Nothing is copied from protected books.</p>
        <p className="small muted">Puzzle-derived exercises use positions from the Lichess puzzle database (CC0). Their difficulty figures are on Lichess's puzzle scale and are <em>not</em> playing ratings.</p>
      </section>
      <section className="card">
        <h2>Lessons</h2>
        <ul className="plain">{[...lessons].sort((a, b) => a.id.localeCompare(b.id)).map(l => <li key={l.id}><Link to={`/lesson/${l.id}`}>{l.title}</Link> <span className="muted small">· {l.skill} {l.depth}</span></li>)}</ul>
        {lessons.length === 0 && <p className="muted">No lessons built yet.</p>}
        <p className="muted small">{skills.length} skill nodes are on the <Link to="/course">Course map</Link>.</p>
      </section>
    </main>
  )
}
