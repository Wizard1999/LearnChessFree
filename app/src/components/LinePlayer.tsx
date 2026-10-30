import { useMemo, useState } from 'react'
import { ChessBoard, type BoardShape } from './ChessBoard'
import { lineFens, sideToMove } from '../lib/play'
import { useSpokenText } from '../lib/readAloud'

export interface LinePlayerProps {
  fen: string
  line: { move: string; say?: string }[]
  caption?: string
  arrows?: { from: string; to: string }[]
  highlight?: string[]
  orientation?: 'white' | 'black'
  /** Label shown above the controls, e.g. "Engine line (depth 16)". */
  title?: string
  /** Read the caption and each move's sentence aloud when the learner has read-aloud on (lessons only). */
  readAloud?: boolean
}

/** Step through a line one move at a time, with one sentence per move. */
export function LinePlayer({ fen, line, caption, arrows = [], highlight = [], orientation, title, readAloud = false }: LinePlayerProps) {
  const data = useMemo(() => lineFens(fen, line.map(l => l.move)), [fen, line])
  const [i, setI] = useState(0)
  const n = data.played
  const shapes: BoardShape[] = i === 0 ? arrows.map(a => ({ from: a.from, to: a.to })) : []
  const say = i > 0 ? line[i - 1]?.say : undefined
  useSpokenText((i === 0 ? caption : say) ?? '', readAloud)
  return (
    <figure className="lineplayer">
      {title && <figcaption className="muted small">{title}</figcaption>}
      <ChessBoard fen={data.fens[i]} orientation={orientation ?? sideToMove(fen)} shapes={shapes} highlight={i === 0 ? highlight : []} lastMove={data.lastMoves[i]} label={caption} controlMap />
      {caption && i === 0 && <p className="caption">{caption}</p>}
      {say && <p className="caption say">{say}</p>}
      {i > 0 && !say && <p className="caption muted">{data.sans[i - 1]}</p>}
      <div className="row">
        <button type="button" onClick={() => setI(0)} disabled={i === 0} aria-label="Back to start">⏮</button>
        <button type="button" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0} aria-label="Previous move">◀</button>
        <span className="muted small" aria-live="polite">{i} / {n}</span>
        <button type="button" className="primary" onClick={() => setI(Math.min(n, i + 1))} disabled={i >= n} aria-label="Next move">Next move ▶</button>
      </div>
    </figure>
  )
}
