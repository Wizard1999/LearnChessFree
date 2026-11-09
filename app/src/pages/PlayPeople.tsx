import { Link } from 'react-router-dom'
import { FIRST_GAME_TIPS, PLAY_SITES } from '../lib/playSites'

const LABELS = { V: 'verified on the site', I: 'our advice', S: 'secondary' } as const

/**
 * Where to play real people (D79). Outward links only: they open in a new tab, carry no referral or tracking parameters, and nothing is sent from
 * this app. Every statement about a site carries an evidence label and says where it was read; what was not checked is listed beside it.
 */
export function PlayPeople() {
  return (
    <main className="page wide playpeople">
      <h1>Play real people</h1>
      <p className="lede">Playing lots of games is how lessons become skills, and real opponents show you what the practice bots cannot. Play here as often as you like, and when you feel ready, play people on a trusted site. These sites are not ours: your account is yours, we never see it, and nothing is sent to them from here.</p>
      <p><Link className="button" to="/play">Play the practice opponent here</Link> <Link className="button primary" to="/games#import">Review a game you played elsewhere</Link></p>
      <p className="small muted">Marks: <strong>[V]</strong> read on the site's own page on 9 November 2026, <strong>[I]</strong> our advice or inference. Sites change; check their pages before you rely on a detail. Only sites we could check are listed.</p>
      {PLAY_SITES.map(s => (
        <section key={s.id} className="card" aria-labelledby={`site-${s.id}`}>
          <h2 id={`site-${s.id}`}>{s.name}</h2>
          <p><a className="button" href={s.url} target="_blank" rel="noopener noreferrer">Open {s.name} in a new tab</a></p>
          <h3>What it offers</h3>
          <ul>{s.offers.map(o => <li key={o.text}>{o.text} <span className="muted small" title={LABELS[o.label]}>[{o.label}]</span></li>)}</ul>
          <h3>Safety notes for beginners and young players</h3>
          <ul>{s.safety.map(o => <li key={o.text}>{o.text} <span className="muted small" title={LABELS[o.label]}>[{o.label}]</span></li>)}</ul>
          <p className="small muted">Source: {s.source}. Not checked: {s.notChecked.join(' ')}</p>
        </section>
      ))}
      <section className="card">
        <h2>Tips for your first real games</h2>
        <ul>{FIRST_GAME_TIPS.map(t => <li key={t.text}>{t.text} <span className="muted small" title={LABELS[t.label]}>[{t.label}]</span></li>)}</ul>
        <p className="small muted">Ratings differ between sites and are not the same as the strength labels on our practice opponents. If you are under 13, or under the age these sites require, ask a parent or teacher first.</p>
      </section>
    </main>
  )
}
