import { useEffect, useRef } from 'react'
import { Chessground } from 'chessground'
import type { Api } from 'chessground/api'
import type { Config } from 'chessground/config'
import type { Key } from 'chessground/types'
import type { DrawShape } from 'chessground/draw'
import 'chessground/assets/chessground.base.css'
import 'chessground/assets/chessground.brown.css'
import 'chessground/assets/chessground.cburnett.css'

export interface BoardShape { from: string; to?: string; brush?: 'green' | 'red' | 'blue' | 'yellow' }
export interface EditMode {
  /** Called with the FEN piece-placement field whenever the learner moves, drops or deletes a piece (drag off the board to delete). */
  onChange: (placement: string) => void
  /** Called when a square is clicked (used with a piece palette). */
  onSquare?: (key: string) => void
}
export interface Props {
  fen: string
  orientation?: 'white' | 'black'
  /** Makes the board interactive for one side. `dests` maps from-squares to legal to-squares. */
  movable?: { color: 'white' | 'black'; dests: Map<Key, Key[]>; onMove: (from: Key, to: Key) => void } | null
  /** Click-to-toggle squares (select_squares tasks). */
  picker?: { selected: ReadonlySet<string>; onToggle: (sq: string) => void } | null
  shapes?: BoardShape[]
  highlight?: string[]
  lastMove?: [string, string] | null
  check?: boolean
  label?: string
  /** Free-edit mode for the contrast lab. */
  edit?: EditMode | null
  /** Gives the parent the underlying Chessground API (e.g. to place a piece from a palette). */
  apiRef?: { current: Api | null }
}

/** Thin React wrapper around Chessground (GPL-3.0-or-later): rendering, drag/touch input, arrows, highlights. */
export function ChessBoard({ fen, orientation = 'white', movable = null, picker = null, shapes = [], highlight = [], lastMove = null, check = false, label, edit = null, apiRef }: Props) {
  const el = useRef<HTMLDivElement>(null)
  const api = useRef<Api | null>(null)
  const cb = useRef({ movable, picker, edit })
  cb.current = { movable, picker, edit }
  const lastPlacement = useRef(fen.split(' ')[0])

  const report = () => {
    const a = api.current
    if (!a || !cb.current.edit) return
    const placement = a.getFen()
    if (placement !== lastPlacement.current) { lastPlacement.current = placement; cb.current.edit.onChange(placement) }
  }
  const config = (): Config => {
    const hl = new Map<Key, string>()
    for (const s of highlight) hl.set(s as Key, 'hl')
    if (picker) for (const s of picker.selected) hl.set(s as Key, 'sel')
    return {
      fen,
      // chessground does not read the side to move from the FEN: without this, every Black move is treated as a queued premove.
      turnColor: fen.split(' ')[1] === 'b' ? 'black' : 'white',
      orientation,
      check,
      lastMove: lastMove ? (lastMove as Key[]) : undefined,
      coordinates: true,
      viewOnly: !movable && !picker && !edit,
      animation: { enabled: true, duration: 180 },
      highlight: { lastMove: true, check: true, custom: hl },
      draggable: { enabled: !!movable || !!edit, deleteOnDropOff: !!edit },
      selectable: { enabled: !!movable || !!picker || !!edit },
      movable: edit
        ? { free: true, color: 'both', showDests: false, events: { after: () => report() } }
        : movable
        ? { free: false, color: movable.color, dests: movable.dests, showDests: true, events: { after: (o, d) => cb.current.movable?.onMove(o, d) } }
        : { free: false, color: undefined, dests: new Map() },
      events: { select: k => { cb.current.picker?.onToggle(k); cb.current.edit?.onSquare?.(k) }, change: () => { if (cb.current.edit) report() } },
      drawable: { enabled: false, visible: true },
    }
  }
  const autoShapes = (): DrawShape[] => shapes.map(s => ({ orig: s.from as Key, dest: s.to as Key | undefined, brush: s.brush ?? 'green' }))

  useEffect(() => {
    if (!el.current) return
    api.current = Chessground(el.current, config())
    if (apiRef) apiRef.current = api.current
    api.current.setAutoShapes(autoShapes())
    return () => api.current?.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { api.current?.set(config()); api.current?.setAutoShapes(autoShapes()) })

  return <div className="board-wrap" role="img" aria-label={label ?? 'Chess board'}><div ref={el} className="board" /></div>
}
