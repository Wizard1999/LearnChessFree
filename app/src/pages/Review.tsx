import { Link } from 'react-router-dom'

/** One doorway for looking back at games: your saved games, the analysis board and the openings explorer (D63, one item under More). */
export function ReviewPage() {
  return (
    <main className="page">
      <h1>Review</h1>
      <p className="lede">Look at games, yours or anyone's, and at openings. Nothing here is graded.</p>
      <div className="grid2">
        <section className="card"><h2>Games review</h2><p>Your saved games, with the moments that cost you and what was behind them.</p><div className="row"><Link className="button primary" to="/games">Open games review</Link></div></section>
        <section className="card"><h2>Analysis</h2><p>A board with a move tree, comments and an engine, for any game or position.</p><div className="row"><Link className="button primary" to="/analysis">Open analysis</Link></div></section>
        <section className="card"><h2>Openings</h2><p>Explore the opening tree and save lines to drill.</p><div className="row"><Link className="button primary" to="/openings">Open the openings explorer</Link></div></section>
      </div>
    </main>
  )
}
