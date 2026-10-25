// Static exchange evaluation and a bounded "does it win by force?" check.
//
// DEFINITIONS (used by every "works" flag in the detectors):
//
// seeGain(c, target, byColor)
//   The most counted material `byColor` can win by starting a capture sequence on the piece standing on `target`,
//   when both sides always recapture with their least valuable attacker and either side may stop at any time.
//   Floor of 0 ("do not capture"). The FIRST capture must be legal (pins, check and king safety are honoured, even
//   when it is not byColor's turn: the question is asked "as if it were"). Later recaptures use attack geometry with
//   x-rays; pins on later recapturers are ignored. The extra value of a capture-promotion is ignored.
//
// forcedGain(c, targets)
//   A TWO-PLY check, not a search. `c` is the position right after a side (the "winner") moved, so the defender is to
//   move. For every legal defender reply R, take the best capture X (legal for the winner) of a piece standing on one of
//   the tracked squares: the `targets` (a target that the reply moved is followed to its new square) and the square the
//   reply itself lands on (so a piece interposed by the reply, or a capture made by the reply that can be answered by a
//   recapture, is credited), valued as
//        captured value  -  what the defender wins back by recapturing on that square (seeGain),
//   or a checkmating move (a large sentinel). The result is   min over R of ( best X  -  material the reply R captured ).
//   A positive result means: whatever the defender replies, the winner can then win at least that much counted
//   material on those pieces, ignoring every other threat and any counter-play that is not an immediate capture.
//   Pieces that were already capturable before the reply, and are not targets, are deliberately NOT credited.
//   If the defender has no legal reply: checkmate (sentinel) or stalemate (0).

import type { Chess } from 'chess.js'
import type { Color, Move, PieceSymbol, Square } from './board.ts'
import { ORDER_VALUE, PIECE_VALUE, cloneChess, landingPiece, legalCapturerSquares, opposite } from './board.ts'

/** Returned instead of a material count when a checkmating move is available. */
export const MATE_SCORE = 1000

export function seeGain(c: Chess, target: Square, byColor: Color): number {
  const victim = c.get(target)
  if (!victim || victim.color === byColor || victim.type === 'k') return 0
  const work = cloneChess(c)
  const first = legalCapturerSquares(c, target, byColor, work)
    .map(s => ({ s, type: (work.get(s) as { type: PieceSymbol }).type }))
    .sort((a, b) => ORDER_VALUE[a.type] - ORDER_VALUE[b.type])
  if (first.length === 0) return 0
  const gain: number[] = [PIECE_VALUE[victim.type]]
  let moverType: PieceSymbol = first[0].type
  let fromSq: Square = first[0].s
  let side = byColor
  let d = 0
  for (;;) {
    d++
    gain[d] = PIECE_VALUE[moverType] - gain[d - 1]
    if (moverType === 'k') break // a king capture can never be answered legally
    work.remove(fromSq)
    side = opposite(side)
    const cands = work
      .attackers(target, side)
      .map(s => ({ s, type: (work.get(s) as { type: PieceSymbol }).type }))
      .sort((a, b) => ORDER_VALUE[a.type] - ORDER_VALUE[b.type])
    let pick: { s: Square; type: PieceSymbol } | null = null
    for (const cand of cands) {
      if (cand.type === 'k' && work.attackers(target, opposite(side)).length > 0) continue
      pick = cand
      break
    }
    if (!pick) break
    fromSq = pick.s
    moverType = pick.type
  }
  while (--d > 0) gain[d - 1] = -Math.max(-gain[d - 1], gain[d])
  return Math.max(0, gain[0])
}

/**
 * Net counted material of capturing the piece on `target` with the piece on `from` (a legal capture for `c.turn()` is
 * assumed): captured value minus what the opponent can win back on `target` (seeGain after the capture).
 */
export function captureNet(c: Chess, from: Square, target: Square): number {
  const mover = c.get(from)
  const victim = c.get(target)
  if (!mover || !victim) return 0
  const work = cloneChess(c)
  work.remove(from)
  work.put(landingPiece(mover, target), target)
  return PIECE_VALUE[victim.type] - seeGain(work, target, opposite(mover.color))
}

export interface ForcedGain {
  /** Guaranteed counted material for the winner over the next two plies against the best defence found (can be <= 0). */
  minNet: number
  /** SAN of the defender reply that gives the minimum (the best defence found), or null if there was no reply. */
  bestDefence: string | null
  mate: boolean
  stalemate: boolean
}

/** Best net value of a capture the side to move in `pos` can make on one of `tracked` squares or on `alsoSquare`. */
function bestCaptureOn(pos: Chess, tracked: Square[], alsoSquare: Square | null): number {
  const mover = pos.turn()
  let best = 0
  const squares = alsoSquare && !tracked.includes(alsoSquare) ? [...tracked, alsoSquare] : tracked
  for (const t of squares) {
    const victim = pos.get(t)
    if (!victim || victim.color === mover || victim.type === 'k') continue
    const work = cloneChess(pos)
    for (const from of legalCapturerSquares(pos, t, mover, work)) {
      const g = captureNet(pos, from, t)
      if (g > best) best = g
    }
  }
  return best
}

/** True if the side to move in `pos` has a checkmating move. */
function hasMateInOne(pos: Chess): boolean {
  return pos.moves().some(san => san.endsWith('#'))
}

/**
 * See the header comment. `c` must have the DEFENDER to move (i.e. the winner has just moved).
 * `stopBelow`: stop scanning replies as soon as one gives a net below this value (the exact minimum is then unknown
 * but certainly below `stopBelow`); omit for the exact two-ply minimum.
 */
export function forcedGain(c: Chess, targets: Square[], stopBelow?: number): ForcedGain {
  const work = cloneChess(c)
  const replies = work.moves({ verbose: true })
  if (replies.length === 0) {
    if (c.inCheck()) return { minNet: MATE_SCORE, bestDefence: null, mate: true, stalemate: false }
    return { minNet: 0, bestDefence: null, mate: false, stalemate: true }
  }
  let min = Infinity
  let bestDef: string | null = null
  for (const r of replies as Move[]) {
    const vR = (r.captured ? PIECE_VALUE[r.captured] : 0) + (r.promotion ? PIECE_VALUE[r.promotion] - 1 : 0)
    work.move({ from: r.from, to: r.to, promotion: r.promotion })
    // targets are followed if the reply moves them; the square the reply lands on is tracked too (an interposed or
    // capturing piece that can itself be taken is a consequence of that reply)
    const tracked = [...new Set([...targets.map(t => (t === r.from ? r.to : t)), r.to])]
    let best = bestCaptureOn(work, tracked, null)
    if (best < 1 && hasMateInOne(work)) best = MATE_SCORE
    work.undo()
    const net = best - vR
    if (net < min) {
      min = net
      bestDef = r.san
      if (stopBelow !== undefined && min < stopBelow) break
    }
  }
  return { minNet: min, bestDefence: bestDef, mate: false, stalemate: false }
}

/**
 * Like forcedGain but also works when it is the WINNER's turn in `c` (then: the best capture available right now,
 * with no reply to consider). Used for pins and skewers found in a plain position.
 */
export function exploitable(c: Chess, winner: Color, targets: Square[], stopBelow?: number): ForcedGain {
  if (c.turn() === opposite(winner)) return forcedGain(c, targets, stopBelow)
  let best = bestCaptureOn(c, targets, null)
  if (best < 1 && hasMateInOne(c)) best = MATE_SCORE
  return { minNet: best, bestDefence: null, mate: best >= MATE_SCORE, stalemate: false }
}

// ---------------------------------------------------------------------------------------------------------------------
// Second, independent check used to CONFIRM every "works" claim
// ---------------------------------------------------------------------------------------------------------------------
//
// securedGain(pos, winner): a small material search, different code from forcedGain. The side to move in `pos` chooses among ALL
// legal moves; the reply is then limited to captures, promotions and checks (the first quiescence ply); after that only captures
// are followed (quiescence, up to 4 more plies; a side in check searches every evasion). Counted material 1/3/3/5/9, alpha-beta.
// Returns winner's material balance after that search minus winner's balance in `pos` (MATE_SCORE if the search ends in
// checkmate for the winner). It sees counter-threats and longer recapture sequences that the two-ply forcedGain does not. A
// tactic is reported as `works` only if forcedGain >= 1 AND securedGain >= 1.

const SEARCH_VALUE: Readonly<Record<PieceSymbol, number>> = PIECE_VALUE

function stmBalance(c: Chess): number {
  let s = 0
  for (const row of c.board()) for (const p of row) if (p) s += (p.color === c.turn() ? 1 : -1) * SEARCH_VALUE[p.type]
  return s
}

const captureFirst = (a: Move, b: Move): number =>
  SEARCH_VALUE[b.captured ?? 'p'] - SEARCH_VALUE[b.piece] - (SEARCH_VALUE[a.captured ?? 'p'] - SEARCH_VALUE[a.piece])

function quiesce(c: Chess, alpha: number, beta: number, depth: number, withChecks = false): number {
  const inCheck = c.inCheck()
  if (!inCheck) {
    const stand = stmBalance(c)
    if (stand >= beta) return beta
    if (stand > alpha) alpha = stand
    if (depth === 0) return stand
  } else if (depth === 0) return stmBalance(c)
  let moves = c.moves({ verbose: true })
  if (moves.length === 0) return inCheck ? -1000 : 0
  if (!inCheck) moves = moves.filter(m => m.captured || m.promotion || (withChecks && (m.san.endsWith('+') || m.san.endsWith('#'))))
  moves.sort(captureFirst)
  for (const m of moves) {
    c.move(m)
    const s = -quiesce(c, -beta, -alpha, depth - 1)
    c.undo()
    if (s >= beta) return beta
    if (s > alpha) alpha = s
  }
  return alpha
}

function negamax(c: Chess, depth: number, alpha: number, beta: number): number {
  if (depth === 0) return quiesce(c, alpha, beta, 4, true)
  const moves = c.moves({ verbose: true })
  if (moves.length === 0) return c.inCheck() ? -1000 - depth : 0
  moves.sort(captureFirst)
  for (const m of moves) {
    c.move(m)
    const s = -negamax(c, depth - 1, -beta, -alpha)
    c.undo()
    if (s >= beta) return beta
    if (s > alpha) alpha = s
  }
  return alpha
}

export function securedGain(pos: Chess, winner: Color): number {
  const c = cloneChess(pos)
  const sign = c.turn() === winner ? 1 : -1
  const base = sign * stmBalance(c)
  const after = sign * negamax(c, 1, -2000, 2000)
  if (after >= 900) return MATE_SCORE
  return after - base
}

/** forcedGain/exploitable said "works"; does the independent search agree? */
export function confirmed(pos: Chess, winner: Color): boolean {
  return securedGain(pos, winner) >= 1
}
