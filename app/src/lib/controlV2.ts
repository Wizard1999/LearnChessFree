// Square control, second version. For every square it works out, from the rules alone:
//   - the attackers of each colour INCLUDING x-rays (a bishop behind its own pawn, a rook behind a rook, a queen behind a bishop) and
//     ignoring pieces that are pinned to their king (they may only move along the pin line);
//   - the exchange result (static exchange evaluation: cheapest attacker first, x-rays released as pieces leave, either side may stop,
//     a king captures only when nothing can recapture), which is what makes the VALUE of the pieces matter;
//   - the most valuable piece each colour could put on the square without losing material in the exchange ("safe value"). A square
//     guarded by a pawn and attacked by a queen is strongly the pawn side's: it can hold a queen there, the queen's side can hold only a pawn;
//   - which of the controlling colour's defenders are themselves loose (attacked and losing the exchange): control that can be knocked away.
// What it does NOT see (and the overlay says so): sacrifices and zwischenzugs, overloaded defenders, checks and mates, threats elsewhere.
import { Chess } from 'chess.js'

export type Colour = 'w' | 'b'
type PT = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
const VALUE: Record<PT, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 }
const NAME: Record<PT, string> = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' }
const LETTER: Record<PT, string> = { p: '', n: 'N', b: 'B', r: 'R', q: 'Q', k: 'K' }
const ORTH: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]]
const DIAG: [number, number][] = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
const KNIGHT: [number, number][] = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]]

interface P { type: PT; color: Colour }
type Grid = (P | null)[][] // grid[rank 0..7 (rank 1 = 0)][file 0..7]
export interface Attacker { type: PT; from: string; xray: boolean; pinned?: boolean }
export interface SquareControlV2 {
  square: string
  piece: string | null
  white: Attacker[]; black: Attacker[]
  /** Highest value (pawns) of a white or black piece that could stand here without losing material in the exchange; 0 when none. */
  safe: { w: number; b: number }
  /** White's safe value minus Black's, in pawns, capped at 9: positive means the square is White's. */
  score: number
  /** For an occupied square: what the side to capture it first nets in the exchange (pawns), per colour. */
  captureNet: { w: number | null; b: number | null }
  /** Defenders of the square's stronger side that are attacked and would lose the exchange, so the control is fragile. */
  loose: Attacker[]
  net: number
}

const sq = (r: number, f: number) => 'abcdefgh'[f] + (r + 1)
const inb = (r: number, f: number) => r >= 0 && r < 8 && f >= 0 && f < 8

function parse(fen: string): { grid: Grid; king: Record<Colour, [number, number] | null> } {
  const chess = new Chess(fen)
  const grid: Grid = Array.from({ length: 8 }, () => Array<P | null>(8).fill(null))
  const king: Record<Colour, [number, number] | null> = { w: null, b: null }
  const rows = chess.board() // rows[0] is rank 8
  for (let i = 0; i < 8; i++) for (let f = 0; f < 8; f++) {
    const p = rows[i][f]; if (!p) continue
    const r = 7 - i
    grid[r][f] = { type: p.type as PT, color: p.color }
    if (p.type === 'k') king[p.color] = [r, f]
  }
  return { grid, king }
}

/** Is the piece on (r,f) pinned to its own king? Returns the allowed line (squares it may still move to) or null. */
function pinLine(grid: Grid, king: [number, number] | null, r: number, f: number): Set<string> | null {
  const me = grid[r][f]; if (!me || !king || me.type === 'k') return null
  const dr = Math.sign(r - king[0]), df = Math.sign(f - king[1])
  const aligned = (r - king[0] === 0 || f - king[1] === 0 || Math.abs(r - king[0]) === Math.abs(f - king[1]))
  if (!aligned || (dr === 0 && df === 0)) return null
  // between the king and the piece must be empty
  let rr = king[0] + dr, ff = king[1] + df
  while (rr !== r || ff !== f) { if (grid[rr][ff]) return null; rr += dr; ff += df }
  const line = new Set<string>([sq(r, f)])
  rr = r + dr; ff = f + df
  while (inb(rr, ff)) {
    line.add(sq(rr, ff))
    const q = grid[rr][ff]
    if (q) {
      const diag = dr !== 0 && df !== 0
      const pinner = q.color !== me.color && (q.type === 'q' || (diag ? q.type === 'b' : q.type === 'r'))
      return pinner ? line : null
    }
    rr += dr; ff += df
  }
  return null
}

interface Chain { color: Colour; pieces: Attacker[] } // pieces[0] is direct; later ones are x-rays, available once the one before has gone

/** Attackers of (r,f) for one colour, as independent items: pawns, knights and the king are direct; each slider ray is a chain (battery). */
function attackChains(grid: Grid, king: Record<Colour, [number, number] | null>, r: number, f: number, c: Colour, ignoreOccupantOf?: [number, number]): Chain[] {
  const chains: Chain[] = []
  const at = (rr: number, ff: number) => (ignoreOccupantOf && rr === ignoreOccupantOf[0] && ff === ignoreOccupantOf[1] ? null : grid[rr][ff])
  const allowed = (rr: number, ff: number) => {
    const line = pinLine(grid, king[c], rr, ff)
    return !line || line.has(sq(r, f))
  }
  for (const [dr, df] of KNIGHT) {
    const rr = r + dr, ff = f + df
    if (!inb(rr, ff)) continue
    const p = at(rr, ff)
    if (p && p.color === c && p.type === 'n' && allowed(rr, ff)) chains.push({ color: c, pieces: [{ type: 'n', from: sq(rr, ff), xray: false }] })
  }
  for (const dr of [-1, 0, 1]) for (const df of [-1, 0, 1]) {
    if (!dr && !df) continue
    const rr = r + dr, ff = f + df
    if (!inb(rr, ff)) continue
    const p = at(rr, ff)
    if (p && p.color === c && p.type === 'k') chains.push({ color: c, pieces: [{ type: 'k', from: sq(rr, ff), xray: false }] })
  }
  const scan = (dirs: [number, number][], slider: PT) => {
    for (const [dr, df] of dirs) {
      const pieces: Attacker[] = []
      let rr = r + dr, ff = f + df, dist = 1
      while (inb(rr, ff)) {
        const p = at(rr, ff)
        if (p) {
          const mine = p.color === c
          const asPawn = mine && p.type === 'p' && dist === 1 && df !== 0 && dr === (c === 'w' ? -1 : 1) // a pawn one step behind along its capture diagonal
          const slides = mine && (p.type === 'q' || p.type === slider)
          if ((slides || asPawn) && allowed(rr, ff)) pieces.push({ type: p.type, from: sq(rr, ff), xray: pieces.length > 0 })
          else if (!(slides || asPawn)) break // an enemy piece or a piece that cannot move along the line ends the battery
          else break // a pinned member: stop the chain
          // own pawns and bishops/rooks/queens that attack along the line can be passed through (they clear the line when they capture)
        }
        rr += dr; ff += df; dist++
      }
      if (pieces.length) chains.push({ color: c, pieces })
    }
  }
  scan(ORTH, 'r'); scan(DIAG, 'b')
  return chains
}

/** Net material, in pawns, for the colour that captures first on the square, if the victim there is worth `victim`. Either side may stop. */
function exchange(chains: Chain[], victim: number, first: Colour): number {
  const idx = new Map<Chain, number>(chains.map(c => [c, 0]))
  const gains: number[] = []
  let side: Colour = first
  let target = victim
  const remaining = (col: Colour) => chains.some(c => c.color === col && (idx.get(c) ?? 0) < c.pieces.length)
  for (let d = 0; d < 32; d++) {
    // the cheapest available attacker of `side`
    let best: Chain | null = null
    for (const ch of chains) {
      if (ch.color !== side) continue
      const i = idx.get(ch) ?? 0
      if (i >= ch.pieces.length) continue
      const p = ch.pieces[i]
      if (p.type === 'k' && remaining(side === 'w' ? 'b' : 'w')) continue // the king cannot take if the other side can still recapture
      if (!best || VALUE[p.type] < VALUE[best.pieces[idx.get(best)!].type]) best = ch
    }
    if (!best) break
    const mover = best.pieces[idx.get(best)!]
    gains[d] = d === 0 ? target : target - gains[d - 1]
    target = VALUE[mover.type]
    idx.set(best, (idx.get(best) ?? 0) + 1)
    side = side === 'w' ? 'b' : 'w'
  }
  // minimax from the end: each side captures only if it pays
  for (let d = gains.length - 1; d > 0; d--) gains[d - 1] = -Math.max(-gains[d - 1], gains[d])
  return gains.length ? gains[0] : 0
}

const flat = (chains: Chain[]) => chains.flatMap(c => c.pieces)

export function controlMapV2(fen: string): Map<string, SquareControlV2> {
  const { grid, king } = parse(fen)
  const out = new Map<string, SquareControlV2>()
  for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
    const occ = grid[r][f]
    const cw = attackChains(grid, king, r, f, 'w'), cb = attackChains(grid, king, r, f, 'b')
    const chains = [...cw, ...cb]
    // the most valuable piece each colour could stand on the square with: the other colour captures first and each side may stop
    const safeValue = (col: Colour) => {
      let best = 0
      for (const t of ['p', 'n', 'b', 'r', 'q'] as PT[]) {
        const net = exchange(chains.filter(c => c.pieces.length), VALUE[t], col === 'w' ? 'b' : 'w')
        // the standing piece itself is not one of its own side's attackers of the square, so the chains are as computed
        if (net <= 0) best = Math.max(best, VALUE[t])
      }
      return best
    }
    const safe = { w: safeValue('w'), b: safeValue('b') }
    const score = Math.max(-9, Math.min(9, safe.w - safe.b))
    const captureNet = {
      w: occ && occ.color === 'b' ? exchange(chains, VALUE[occ.type], 'w') : null,
      b: occ && occ.color === 'w' ? exchange(chains, VALUE[occ.type], 'b') : null,
    }
    // the stronger side's defenders that are themselves loose
    const strong: Colour | null = score > 0 ? 'w' : score < 0 ? 'b' : null
    const loose: Attacker[] = []
    if (strong) {
      for (const a of flat(strong === 'w' ? cw : cb)) {
        if (a.xray || a.type === 'k') continue
        const ar = +a.from[1] - 1, af = 'abcdefgh'.indexOf(a.from[0])
        const enemy: Colour = strong === 'w' ? 'b' : 'w'
        const hit = [...attackChains(grid, king, ar, af, enemy), ...attackChains(grid, king, ar, af, strong)]
        if (exchange(hit, VALUE[a.type], enemy) > 0) loose.push(a)
      }
    }
    out.set(sq(r, f), {
      square: sq(r, f), piece: occ ? `${occ.color === 'w' ? 'White' : 'Black'} ${NAME[occ.type]}` : null,
      white: flat(cw), black: flat(cb), safe, score, captureNet, loose, net: flat(cw).length - flat(cb).length,
    })
  }
  return out
}

const list = (a: Attacker[]) => (a.length ? a.map(x => `${LETTER[x.type] || 'P'}${x.from}${x.xray ? ' (x-ray)' : ''}`).join(', ') : 'none')
const val = (n: number) => (n <= 0 ? 'nothing' : n >= 100 ? 'only a king' : `a ${n === 1 ? 'pawn' : n === 3 ? 'knight or bishop' : n === 5 ? 'rook' : 'queen'}`)

/** A readable account of one square for the overlay. */
export function describeV2(c: SquareControlV2): string {
  const head = c.piece ? `${c.square}: ${c.piece}.` : `${c.square} is empty.`
  const counts = `White attackers: ${list(c.white)}. Black attackers: ${list(c.black)}.`
  const safe = `The most valuable piece that could stand here without losing material: White ${val(c.safe.w)}, Black ${val(c.safe.b)}.`
  const cap = c.captureNet.w !== null ? ` White taking first nets ${c.captureNet.w >= 0 ? '+' : ''}${c.captureNet.w} in the exchange.` : c.captureNet.b !== null ? ` Black taking first nets ${c.captureNet.b >= 0 ? '+' : ''}${c.captureNet.b} in the exchange.` : ''
  const fragile = c.loose.length ? ` Fragile: ${list(c.loose)} defend${c.loose.length === 1 ? 's' : ''} it but ${c.loose.length === 1 ? 'is' : 'are'} attacked and would lose the exchange.` : ''
  return `${head} ${counts} ${safe}${cap}${fragile} Not seen: sacrifices, overloaded defenders, checks, threats elsewhere.`
}
