import { useEffect, useState } from 'react'
import { mastersFor, type MasterInfo, type MasterRow } from '../lib/masters'

/** Moves played from a position in top-level over-the-board games (both players rated 2500 or more). Shows nothing when this build has no such data. */
export function MastersCard({ epd, onPlay }: { epd: string; onPlay?: (uci: string) => void }) {
  const [m, setM] = useState<{ info: MasterInfo; rows: MasterRow[] } | null>(null)
  useEffect(() => {
    let dead = false
    void mastersFor(epd).then(r => { if (!dead) setM(r) })
    return () => { dead = true }
  }, [epd])
  if (!m || m.rows.length === 0) return null
  return (
    <section className="card" aria-label="Top-level games">
      <h2>Top-level games</h2>
      <p className="small muted">From {m.info.games.toLocaleString()} over-the-board games between players rated {m.info.minElo}+ (first {m.info.maxPly / 2} moves). Counts are games, not evaluations.</p>
      <table className="mastertable">
        <thead><tr><th>Move</th><th>Games</th><th>White / draw / Black</th><th>Avg rating</th></tr></thead>
        <tbody>
          {m.rows.slice(0, 8).map(r => {
            const tot = r.white + r.draw + r.black || 1
            const pct = (x: number) => Math.round((100 * x) / tot)
            return (
              <tr key={r.uci}>
                <td>{onPlay ? <button type="button" className="mvbtn" onClick={() => onPlay(r.uci)}>{r.san}</button> : <strong>{r.san}</strong>}</td>
                <td>{r.games.toLocaleString()}</td>
                <td><span className="wdl" title={`White ${pct(r.white)}%, draw ${pct(r.draw)}%, Black ${pct(r.black)}%`}><span className="wdlw" style={{ width: `${pct(r.white)}%` }} /><span className="wdld" style={{ width: `${pct(r.draw)}%` }} /><span className="wdll" style={{ width: `${pct(r.black)}%` }} /></span> <span className="small muted">{pct(r.white)}/{pct(r.draw)}/{pct(r.black)}%</span></td>
                <td>{r.avgElo}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
