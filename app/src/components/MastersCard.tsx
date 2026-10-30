import { useEffect, useState } from 'react'
import { mastersFor, type MasterInfo, type MasterRow } from '../lib/masters'
import { summariseMasters } from '../lib/mastersRows'

/** Moves played from a position in top-level over-the-board games. Shows nothing when this build has no such data,
 *  unless `always` is set (the Openings page), where loading and missing data are stated. `canPlay` says which moves can be played on the host board. */
export function MastersCard({ epd, onPlay, canPlay, always }: { epd: string; onPlay?: (uci: string) => void; canPlay?: (uci: string) => boolean; always?: boolean }) {
  const [m, setM] = useState<{ epd: string; data: { info: MasterInfo; rows: MasterRow[] } | null } | null>(null)
  useEffect(() => {
    let dead = false
    void mastersFor(epd).then(r => { if (!dead) setM({ epd, data: r }) })
    return () => { dead = true }
  }, [epd])
  const ready = m && m.epd === epd ? m : null
  if (!ready) return always ? <section className="card" aria-label="Top-level games"><h2>Top-level games</h2><p className="small muted" role="status">Loading the master-game statistics…</p></section> : null
  const data = ready.data
  if (!data) return always ? <section className="card" aria-label="Top-level games"><h2>Top-level games</h2><p className="small muted">The master-game statistics are not part of this build, so only the online statistics are shown.</p></section> : null
  const s = summariseMasters(data.rows)
  if (s.rows.length === 0) return always ? <section className="card" aria-label="Top-level games"><h2>Top-level games</h2><p className="small muted">No top-level game in the collection ({data.info.games.toLocaleString()} games, ratings {data.info.minElo}+, first {data.info.maxPly / 2} moves) reached this position.</p></section> : null
  return (
    <section className="card" aria-label="Top-level games">
      <h2>Top-level games</h2>
      <p className="small muted">Source: {data.info.games.toLocaleString()} over-the-board games between players rated {data.info.minElo}+ (first {data.info.maxPly / 2} moves). {s.totalGames.toLocaleString()} of them reached this position. Counts are results of games, not evaluations of the moves.</p>
      <table className="mastertable">
        <thead><tr><th>Move</th><th>Games</th><th>White / draw / Black</th><th>Avg rating</th><th>Years</th></tr></thead>
        <tbody>
          {s.rows.map(r => {
            const ok = onPlay && (!canPlay || canPlay(r.uci))
            return (
              <tr key={r.uci}>
                <td>{ok ? <button type="button" className="mvbtn" onClick={() => onPlay!(r.uci)}>{r.san}</button> : <strong title={onPlay ? 'Not in the online opening tree, so it cannot be played here' : undefined}>{r.san}</strong>}</td>
                <td>{r.games.toLocaleString()} <span className="small muted">({r.sharePct}%)</span></td>
                <td><span className="wdl" title={`White ${r.whitePct}%, draw ${r.drawPct}%, Black ${r.blackPct}%`}><span className="wdlw" style={{ width: `${r.whitePct}%` }} /><span className="wdld" style={{ width: `${r.drawPct}%` }} /><span className="wdll" style={{ width: `${r.blackPct}%` }} /></span> <span className="small muted">{r.whitePct}/{r.drawPct}/{r.blackPct}%</span></td>
                <td>{r.avgElo}</td>
                <td className="small muted">{r.years}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {s.hiddenMoves > 0 && <p className="small muted">{s.hiddenMoves} rarer move{s.hiddenMoves === 1 ? '' : 's'} ({s.hiddenGames.toLocaleString()} games) not shown. Small samples say little: a move with a few games proves nothing about its strength.</p>}
    </section>
  )
}
