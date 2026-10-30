import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { announce, isPromotionMove, moveCursor, piecesFromFen, positionStatus, PROMOTION_PIECES, screenPos, squareLabel, squaresInOrder } from '../lib/boardKeys'
import type { CursorKey } from '../lib/boardKeys'
import { ALL_SQUARES } from '../lib/control'
import { controlMapV2 as controlMap, describeV2 as describeControl } from '../lib/controlV2'
import { Chessground } from 'chessground'
import type { Api } from 'chessground/api'
import type { Config } from 'chessground/config'
import type { Key } from 'chessground/types'
import type { DrawShape } from 'chessground/draw'
import 'chessground/assets/chessground.base.css'
import 'chessground/assets/chessground.brown.css'
import { prefersReducedMotion } from '../lib/appearance'
import { getEngine, resetEngine } from '../engine'
import { askAboutSquare, formatVerdict, SQUARE_ASK_CAUTION } from '../lib/squareAsk'
import 'chessground/assets/chessground.cburnett.css'

export interface BoardShape { from: string; to?: string; brush?: 'green' | 'red' | 'blue' | 'yellow'; /** Arrow thickness, 2 (thin) to 14 (thick); default 10. */ width?: number }
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
  movable?: { color: 'white' | 'black'; dests: Map<Key, Key[]>; onMove: (from: Key, to: Key, promotion?: 'q' | 'r' | 'b' | 'n') => void } | null
  /** Click-to-toggle squares (select_squares tasks). */
  picker?: { selected: ReadonlySet<string>; onToggle: (sq: string) => void } | null
  shapes?: BoardShape[]
  highlight?: string[]
  /** Squares tinted by outcome after an answer: 'right' (correct and chosen), 'miss' (correct but not chosen), 'bad' (chosen but wrong). */
  marks?: Record<string, 'right' | 'miss' | 'bad'>
  lastMove?: [string, string] | null
  check?: boolean
  label?: string
  /** Free-edit mode for the contrast lab. */
  edit?: EditMode | null
  /** Gives the parent the underlying Chessground API (e.g. to place a piece from a palette). */
  apiRef?: { current: Api | null }
  /** Offers the control-map toggle (who attacks and defends every square). Off by default so a test never shows it. */
  controlMap?: boolean
  /** Called the first time the control map is switched on: in a test or a game that use counts as a hint. */
  onControlUse?: () => void
}

/** Thin React wrapper around Chessground (GPL-3.0-or-later): rendering, drag/touch input, arrows, highlights. */
export function ChessBoard({ fen, orientation = 'white', movable = null, picker = null, shapes = [], highlight = [], marks, lastMove = null, check = false, label, edit = null, apiRef , controlMap: controlMapOn = false, onControlUse }: Props) {
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
    if (marks) for (const [s, k] of Object.entries(marks)) hl.set(s as Key, `mark-${k}`)
    return {
      fen,
      // chessground does not read the side to move from the FEN: without this, every Black move is treated as a queued premove.
      turnColor: fen.split(' ')[1] === 'b' ? 'black' : 'white',
      orientation,
      check,
      lastMove: lastMove ? (lastMove as Key[]) : undefined,
      coordinates: true,
      viewOnly: !movable && !picker && !edit,
      animation: { enabled: !prefersReducedMotion(), duration: 180 },
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
  const autoShapes = (): DrawShape[] => shapes.map(s => ({ orig: s.from as Key, dest: s.to as Key | undefined, brush: s.brush ?? 'green', modifiers: s.width ? { lineWidth: s.width } : undefined }))

  useEffect(() => {
    if (!el.current) return
    api.current = Chessground(el.current, config())
    if (apiRef) apiRef.current = api.current
    api.current.setAutoShapes(autoShapes())
    return () => api.current?.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { api.current?.set(config()); api.current?.setAutoShapes(autoShapes()) })

  const [showControl, setShowControl] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const [barH, setBarH] = useState(0)
  // the explanation under the board can be any number of lines: the board keeps exactly that much room below it, so nothing underneath is ever covered
  useLayoutEffect(() => {
    const el = barRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => setBarH(el.offsetHeight))
    ro.observe(el); setBarH(el.offsetHeight)
    return () => ro.disconnect()
  }, [controlMapOn])
  // ---- keyboard and screen-reader layer: one tab stop (the grid), a square cursor moved by arrow keys (aria-activedescendant), Enter/Space to select and place ----
  const uid = useId()
  const gridRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const interactive = !!movable || !!picker || !!edit
  const pieces = useMemo(() => piecesFromFen(fen), [fen])
  const order = useMemo(() => squaresInOrder(orientation), [orientation])
  const [cursor, setCursor] = useState<string | null>(null)
  const [kbSel, setKbSel] = useState<string | null>(null)
  const [promo, setPromo] = useState<{ from: string; to: string } | null>(null)
  const [focused, setFocused] = useState(false)
  const [live, setLive] = useState({ t: '', n: 0 })
  const say = (t: string) => setLive(l => ({ t, n: l.n + 1 }))
  const pending = useRef<string | null>(null) // what the keyboard just announced; the position effect adds check or the result after it
  const everMovable = useRef(false)
  if (movable) everMovable.current = true
  const prevFen = useRef(fen)
  useEffect(() => {
    if (prevFen.current === fen) return
    prevFen.current = fen
    setKbSel(null); setPromo(null)
    const st = positionStatus(fen)
    let t = pending.current
    pending.current = null
    if (!t && everMovable.current && lastMove) {
      const p = pieces.get(lastMove[1])
      if (p && (!movable || movable.color !== (p.color === 'w' ? 'white' : 'black'))) t = `${p.color === 'w' ? 'White' : 'Black'} ${announce.moved(lastMove[1], p).replace(/^Moved /, 'moved ')}`
    }
    const full = [t, st.text].filter(Boolean).join(' ')
    if (full) say(full)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen])

  const cellId = (sq: string) => `${uid}-sq-${sq}`
  const startSquare = () => {
    if (movable) { const first = order.find(sq => (movable.dests.get(sq as Key)?.length ?? 0) > 0); if (first) return first }
    return orientation === 'white' ? 'e2' : 'e7'
  }
  const finishMove = (from: string, to: string, promotion?: 'q' | 'r' | 'b' | 'n') => {
    const m = cb.current.movable
    if (!m) return
    pending.current = announce.moved(to, pieces.get(from), promotion)
    say(pending.current)
    api.current?.cancelMove()
    setKbSel(null); setPromo(null); setCursor(to)
    m.onMove(from as Key, to as Key, promotion)
    gridRef.current?.focus()
  }
  const activate = (sq: string) => {
    const c = cb.current
    if (c.edit) { c.edit.onSquare?.(sq); return }
    if (c.picker) { say(c.picker.selected.has(sq) ? `Unmarked ${sq}.` : `Marked ${sq}.`); c.picker.onToggle(sq); return }
    const m = c.movable
    if (!m) return
    const mine = pieces.get(sq)?.color === (m.color === 'white' ? 'w' : 'b')
    if (kbSel && m.dests.get(kbSel as Key)?.includes(sq as Key)) {
      if (isPromotionMove(pieces, kbSel, sq)) { setPromo({ from: kbSel, to: sq }); say(announce.promotionAsk()); return }
      finishMove(kbSel, sq); return
    }
    if (kbSel === sq) { api.current?.cancelMove(); setKbSel(null); say(announce.deselected()); return }
    if (mine) {
      const n = m.dests.get(sq as Key)?.length ?? 0
      if (!n) { say(announce.noMoves(sq)); return }
      api.current?.cancelMove(); api.current?.selectSquare(sq as Key)
      setKbSel(sq); say(`${announce.selected(sq, pieces.get(sq))} ${n} legal ${n === 1 ? 'move' : 'moves'}: ${(m.dests.get(sq as Key) ?? []).join(', ')}.`)
      return
    }
    say(kbSel ? announce.illegal() : `No piece of yours on ${sq}. Select one of your pieces first.`)
  }
  const onGridKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!interactive || e.altKey || e.ctrlKey || e.metaKey) return
    const k = e.key
    if (k === 'ArrowUp' || k === 'ArrowDown' || k === 'ArrowLeft' || k === 'ArrowRight' || k === 'Home' || k === 'End') {
      e.preventDefault(); e.stopPropagation()
      setCursor(c => moveCursor(c ?? startSquare(), k as CursorKey, orientation))
    } else if (k === 'Enter' || k === ' ') {
      e.preventDefault(); e.stopPropagation()
      const sq = cursor ?? startSquare(); if (!cursor) setCursor(sq)
      activate(sq)
    } else if (k === 'Escape' && (kbSel || promo)) {
      e.preventDefault(); e.stopPropagation()
      api.current?.cancelMove(); setKbSel(null); setPromo(null); say(announce.deselected())
    }
  }
  useEffect(() => { if (promo) menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus() }, [promo])
  const onMenuKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const btns = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])
    const i = btns.indexOf(document.activeElement as HTMLButtonElement)
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setPromo(null); say(announce.deselected()); gridRef.current?.focus() }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); btns[(i + 1) % btns.length]?.focus() }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); btns[(i + btns.length - 1) % btns.length]?.focus() }
  }
  const cursorPos = cursor ? screenPos(cursor, orientation) : null
  const selPos = kbSel ? screenPos(kbSel, orientation) : null

  const [picked, setPicked] = useState<string | null>(null)
  const [hoverSq, setHoverSq] = useState<string | null>(null)
  const [inspect, setInspect] = useState(false)
  const usedOnce = useRef(false)
  // 'Ask the engine about this square': optional, one click, never offered where it would give an answer (a test or a game passes onControlUse)
  const canAsk = controlMapOn && !onControlUse
  const [ask, setAsk] = useState<{ state: 'busy' | 'done' | 'error'; lines: string[] } | null>(null)
  const askRun = useRef(0)
  useEffect(() => { askRun.current++; setAsk(null); return () => { askRun.current++ } }, [picked, fen, showControl])
  const askEngine = (sq: string) => {
    const run = ++askRun.current
    const cancelled = () => askRun.current !== run
    setAsk({ state: 'busy', lines: [] })
    const timeout = new Promise<null>(r => setTimeout(() => r(null), 20000))
    Promise.race([askAboutSquare(fen, sq, (f, o) => getEngine().analyse(f, o), cancelled), timeout]).then(a => {
      if (cancelled()) return
      if (a === null) { resetEngine(); setAsk({ state: 'error', lines: ['The engine took too long and was restarted. Try again.'] }); return }
      setAsk({ state: 'done', lines: formatVerdict(a) })
    }).catch(() => { if (!cancelled()) setAsk({ state: 'error', lines: ['The engine could not run here.'] }) })
  }
  const map = useMemo(() => (showControl && controlMapOn ? controlMap(fen) : null), [showControl, controlMapOn, fen])
  const cells = useMemo(() => {
    const files = orientation === 'white' ? 'abcdefgh' : 'hgfedcba'
    const ranks = orientation === 'white' ? '87654321' : '12345678'
    return ranks.split('').flatMap(r => files.split('').map(f => `${f}${r}`))
  }, [orientation])
  return (
    <div className={controlMapOn ? 'board-wrap hascontrol' : 'board-wrap'} style={controlMapOn ? { marginBottom: barH + 14 } : undefined} role="group" aria-label={label ?? 'Chess board'}>
      <div ref={el} className="board" onMouseMove={map && !inspect ? (e => {
        // the map never blocks the pieces: the square under the pointer is read from where it is, so pieces stay movable while the map shows
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
        const fi = Math.min(7, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * 8))), ri = Math.min(7, Math.max(0, Math.floor(((e.clientY - r.top) / r.height) * 8)))
        const sqn = cells[ri * 8 + fi]
        setHoverSq(h => (h === sqn ? h : sqn))
      }) : undefined} onMouseLeave={() => setHoverSq(null)} />
      <div
        ref={gridRef} className={interactive ? 'kbdgrid' : 'kbdgrid static'} role="grid" aria-label={`${label ?? 'Chess board'}, squares`} aria-describedby={`${uid}-help`}
        tabIndex={interactive ? 0 : undefined} aria-activedescendant={interactive && focused && cursor ? cellId(cursor) : undefined}
        onKeyDown={onGridKey} onFocus={() => { setFocused(true); setCursor(c => c ?? startSquare()) }} onBlur={() => setFocused(false)}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map(r => (
          <div key={r} role="row" className="kbdrow">
            {order.slice(r * 8, r * 8 + 8).map(sq => (
              <div key={sq} id={cellId(sq)} role="gridcell" className="kbdcell" aria-selected={kbSel === sq} aria-label={squareLabel(sq, pieces.get(sq))} />
            ))}
          </div>
        ))}
        {interactive && focused && cursorPos && <span className="kbdcursor" aria-hidden="true" style={{ left: `${cursorPos.col * 12.5}%`, top: `${cursorPos.row * 12.5}%` }} />}
        {interactive && selPos && <span className="kbdselected" aria-hidden="true" style={{ left: `${selPos.col * 12.5}%`, top: `${selPos.row * 12.5}%` }} />}
      </div>
      <span id={`${uid}-help`} className="sr-only">{interactive ? 'Use the arrow keys to move over the squares. Press Enter or Space to select a piece, then Enter or Space on a square to move it there. Escape cancels.' : 'Board position, read-only.'}</span>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{live.t}{live.n % 2 ? '' : '\u00a0'}</div>
      {promo && (
        <div className="promomenu" role="menu" aria-label="Promote the pawn to" ref={menuRef} onKeyDown={onMenuKey}>
          {PROMOTION_PIECES.map(p => <button key={p.code} type="button" role="menuitem" onClick={() => finishMove(promo.from, promo.to, p.code)}>{p.name}</button>)}
        </div>
      )}
      {map && (
        <div className={inspect ? 'controlmap inspecting' : 'controlmap'} aria-label="Square control map">
          {cells.filter(sq => ALL_SQUARES.includes(sq)).map(sq => {
            const c = map.get(sq)!
            const strength = Math.min(1, Math.abs(c.score) / 6)
            const bg = c.score === 0 ? 'transparent' : c.score > 0 ? `rgba(31, 90, 190, ${0.12 + 0.5 * strength})` : `rgba(214, 100, 20, ${0.12 + 0.5 * strength})`
            return (
              <button key={sq} type="button" className={picked === sq ? 'ctl sel' : 'ctl'} style={{ background: bg }} aria-label={describeControl(c)} onClick={() => setPicked(p => (p === sq ? null : sq))}>
                <span className="ctlnum">{c.white.length || c.black.length ? `${c.white.length}${c.white.some(a => a.xray) ? '+' : ''}-${c.black.length}${c.black.some(a => a.xray) ? '+' : ''}${c.loose.length ? '!' : ''}` : ''}</span>
              </button>
            )
          })}
        </div>
      )}
      {controlMapOn && (
        <div className="controlbar" ref={barRef}>
          <button type="button" className="controltoggle" aria-pressed={showControl} onClick={() => { if (!showControl && !usedOnce.current) { usedOnce.current = true; onControlUse?.() } setShowControl(v => !v); setPicked(null); setHoverSq(null) }}>{showControl ? 'Hide control map' : 'Show control map'}</button>
          {map && <button type="button" className="controltoggle" aria-pressed={inspect} onClick={() => { setInspect(v => !v); setPicked(null) }} title="For touch screens: tap squares to read them. Turn off to move pieces.">{inspect ? 'Moving is off: tap squares' : 'Tap squares to inspect'}</button>}
          {map && (picked ?? hoverSq) && <span className="controldetail" role="status">{describeControl(map.get((picked ?? hoverSq)!)!)}</span>}
          {map && canAsk && picked && (
            <div className="squareask">
              <button type="button" className="controltoggle" disabled={ask?.state === 'busy'} onClick={() => askEngine(picked)}>{ask?.state === 'busy' ? 'Asking the engine...' : 'Ask the engine about this square'}</button>
              {ask && ask.state !== 'busy' && (
                <div className="squareask-answer" role="status">
                  {ask.lines.map((l, i) => <p key={i}>{l}</p>)}
                  {ask.state === 'done' && <p className="muted">{SQUARE_ASK_CAUTION}</p>}
                </div>
              )}
            </div>
          )}
          {map && !picked && !hoverSq && <span className="controldetail muted" role="note">Blue: White holds the square more strongly. Orange: Black. Strength counts the value of the pieces and the exchange, not just how many attack. Numbers: White attackers - Black attackers (+ means an x-ray piece behind another, ! means a defender is loose). Point at a square to read it (touch screens: use the inspect button).</span>}
        </div>
      )}
    </div>
  )
}
