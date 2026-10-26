import { useMemo } from 'react'
import { useMissionData } from '../lib/useMissions'
import { masteryMap } from '../lib/progress'
import type { Mission } from '../lib/missions'

interface Badge { id: string; title: string; detail: string }

/** Badges are marks of evidence, not rewards for activity: each one states exactly what was shown. */
export function badgesFor(missions: Mission[], correctRun: number): Badge[] {
  const out: Badge[] = []
  for (const m of missions) {
    const live = m.nodes.filter(n => !n.noExercises)
    if (live.length === 0) continue
    if (live.every(n => n.level >= 2)) out.push({ id: `${m.strand}:found`, title: `Foundations: ${m.name}`, detail: `All ${live.length} skills with exercises are at Level two or above.` })
    if (live.every(n => n.level === 4 && !n.due)) out.push({ id: `${m.strand}:done`, title: `Mission complete: ${m.name}`, detail: `All ${live.length} skills with exercises are Mastered and none is due for a refresher.` })
  }
  if (correctRun >= 20) out.push({ id: 'run20', title: '20 in a row', detail: 'Twenty unlabelled first attempts in a row, right and without hints.' })
  return out
}

export function Achievements() {
  const { content, attempts, missions, overall } = useMissionData()
  const run = useMemo(() => {
    let best = 0, cur = 0
    for (const a of [...(attempts ?? [])].sort((x, y) => x.ts - y.ts)) { if (!a.firstAttempt || a.cue < 3) continue; if (a.correct && a.hints === 0) { cur++; best = Math.max(best, cur) } else cur = 0 }
    return best
  }, [attempts])
  const badges = useMemo(() => badgesFor(missions, run), [missions, run])
  const live = overall.nodes.filter(n => !n.noExercises)
  const complete = live.length > 0 && live.every(n => n.level === 4 && !n.due)
  const nMastered = live.filter(n => n.level === 4).length

  function certificate(title: string, nodes: typeof live) {
    const m = attempts ? masteryMap(attempts, Date.now(), content.cuedOnly) : new Map()
    const rows = nodes.filter(n => n.level === 4).map(n => {
      const e = ([...m.entries()] as [string, { n: number; ok: number }][]).filter(([k]) => k.startsWith(n.id + '.'))
      return `<tr><td>${n.title}</td><td>${e.reduce((s, [, v]) => s + v.ok, 0)} of ${e.reduce((s, [, v]) => s + v.n, 0)} first attempts right</td></tr>`
    }).join('')
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<!doctype html><meta charset="utf-8"><title>Certificate</title><style>body{font:16px Georgia,serif;max-width:720px;margin:40px auto;padding:0 20px}h1{text-align:center}td{padding:4px 12px;border-bottom:1px solid #ccc}</style><h1>Certificate of completion</h1><p style="text-align:center">${title}</p><p style="text-align:center">Dated ${new Date().toLocaleDateString()}. Every skill below was shown by answering unlabelled exercises, and none was due for a refresher on this date.</p><table>${rows}</table><p><button onclick="print()">Print</button></p>`)
    w.document.close()
  }

  return (
    <section className="card">
      <h2>Badges and certificate</h2>
      <p className="small muted">Badges record what you have shown, not how much you have clicked. There are no points.</p>
      {badges.length === 0 ? <p className="muted">None yet. The first ones are Foundations (every skill in a mission at Level two) and Mission complete.</p> : (
        <ul className="plain">{badges.map(b => <li key={b.id}><strong>✓ {b.title}</strong> <span className="muted small">{b.detail}</span></li>)}</ul>
      )}
      <div className="row">
        <button type="button" disabled={nMastered === 0} onClick={() => certificate('Skills mastered so far', live)}>Certificate of what I have mastered ({nMastered} skills)</button>
        {complete && <button type="button" className="primary" onClick={() => certificate('The complete curriculum', live)}>Certificate: complete curriculum</button>}
      </div>
    </section>
  )
}
