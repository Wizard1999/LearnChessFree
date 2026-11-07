// What the screen after a game against the practice opponent says. Three pure pieces:
//  - findStrength: ONE thing the learner did well, found by a detector over the move list. If no detector fires nothing is said (no invented praise).
//  - pickCritical: ONE critical moment, the biggest evaluation drop of the learner's moves (from lib/gameAnalysis.ts), explained in one plain
//    line from the existing pattern detectors (lib/opportunities.ts). If the pattern is not one the app can name, it says so.
//  - followUpLesson: the lesson to offer next, through the skill graph (pattern -> skill -> the skill's introduction), else the next lesson on the path.
import { detectConcepts } from '../chess/detectors'
import type { ConceptName } from '../chess/detectors'
import type { GameContext } from '../db'
import type { LessonMeta } from '../types'
import type { Analysis } from './gameAnalysis'
import { CONCEPT_LABEL, CONCEPT_SKILL, momentFor } from './opportunities'
import { primaryLesson, roleOf } from './lessonRoles'
import type { Ply } from './pgn'

export type Side = 'white' | 'black'
const colorLetter = (c: Side) => (c === 'white' ? 'w' : 'b')
const PIECE_NAME: Record<string, string> = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' }
const VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }

/** The number of the full move a ply belongs to, from its position (works for games that start from a FEN too). */
export function moveNumberOf(ply: Ply): number {
  const n = Number(ply.fenBefore.split(' ')[5])
  return Number.isFinite(n) && n > 0 ? n : 1
}

export type StrengthKind = 'looseCapture' | 'safeguard' | 'castled' | 'knightOut' | 'check'
export interface Strength { kind: StrengthKind; /** 0-based index into the move list. */ k: number; text: string }

/** A move of the learner that captured a piece (not a pawn) that was hanging: nothing could take it back, or it was worth more than the capturer. */
export function looseCapture(ply: Ply): { type: string; piece: string; reason: 'undefended' | 'cheaper' } | null {
  try {
    const h = detectConcepts(ply.fenBefore, ply.uci).hanging.capturedHanging
    if (!h || h.piece.type === 'p') return null
    return { type: h.piece.type, piece: PIECE_NAME[h.piece.type], reason: h.reason === 'undefended' ? 'undefended' : 'cheaper' }
  } catch { return null }
}

/** A move after which none of the learner's pieces (pawns and the king aside) was left loose, played when one was: the learner saw a piece in danger and dealt with it. */
export function safeguard(ply: Ply): { piece: string } | null {
  try {
    const mine = ply.color
    const before = detectConcepts(ply.fenBefore).hanging.details.filter(d => d.piece.color === mine && d.piece.type !== 'p')
    if (before.length === 0) return null
    const after = detectConcepts(ply.fenBefore, ply.uci).hanging.details.filter(d => d.piece.color === mine && d.piece.type !== 'p')
    if (after.length > 0) return null
    const top = [...before].sort((a, b) => VALUE[b.piece.type] - VALUE[a.piece.type])[0]
    return { piece: PIECE_NAME[top.piece.type] }
  } catch { return null }
}

export const isCastle = (ply: Ply) => /^O-O(-O)?[+#]?$/.test(ply.san)
const HOME_KNIGHT: Record<'w' | 'b', string[]> = { w: ['b1', 'g1'], b: ['b8', 'g8'] }
/** A knight moved off its starting square within the learner's first eight moves. */
export const knightDeveloped = (ply: Ply, myMoveIndex: number) => ply.san.startsWith('N') && myMoveIndex < 8 && HOME_KNIGHT[ply.color].includes(ply.uci.slice(0, 2))
export const gaveCheck = (ply: Ply) => /[+#]$/.test(ply.san)

/** The learner's strongest finding, or null when none of the detectors found anything. Priority: loose capture, safeguard, castling, knight development, check. */
export function findStrength(plies: readonly Ply[], color: Side): Strength | null {
  const mine = plies.map((p, k) => ({ p, k })).filter(x => x.p.color === colorLetter(color))
  const num = (x: { p: Ply }) => moveNumberOf(x.p)

  let best: { k: number; piece: string; reason: 'undefended' | 'cheaper'; v: number; n: number } | null = null
  for (const x of mine) {
    const c = looseCapture(x.p)
    if (c && (!best || VALUE[c.type] > best.v)) best = { k: x.k, piece: c.piece, reason: c.reason, v: VALUE[c.type], n: num(x) }
  }
  if (best) return { kind: 'looseCapture', k: best.k, text: `On move ${best.n} you captured a ${best.piece} ${best.reason === 'undefended' ? 'that nothing was protecting' : 'that was worth more than the piece you took it with'}.` }

  for (const x of mine) {
    const s = safeguard(x.p)
    if (s) return { kind: 'safeguard', k: x.k, text: `On move ${num(x)} your ${s.piece} was in danger of being taken, and you moved so that none of your pieces was left loose.` }
  }
  const castle = mine.find(x => isCastle(x.p))
  if (castle) return { kind: 'castled', k: castle.k, text: `You castled on move ${num(castle)}, which brings your king to safety.` }
  const knight = mine.find((x, i) => knightDeveloped(x.p, i))
  if (knight) return { kind: 'knightOut', k: knight.k, text: `You developed a knight early, on move ${num(knight)}.` }
  const check = mine.find(x => gaveCheck(x.p))
  if (check) return { kind: 'check', k: check.k, text: `On move ${num(check)} you gave check, which makes your opponent answer you.` }
  return null
}

export interface Critical {
  /** 0-based index into the move list. */
  k: number
  san: string
  moveNumber: number
  /** Centipawns lost, from the learner's point of view. */
  loss: number
  /** One plain line. */
  explanation: string
  concept: ConceptName | null
  /** The skill the pattern is practised under, when the course has one. */
  skill: string | null
}

/** A drop of at least this many centipawns (one pawn) is worth a look; smaller ones are noise at this engine setting. */
export const CRITICAL_MIN_LOSS = 100

const ALLOWED_TEXT: Partial<Record<ConceptName, string>> = {
  fork: 'let your opponent make a fork, one move that attacks two things at once',
  pin: 'let your opponent pin one of your pieces',
  skewer: 'let your opponent skewer two of your pieces',
  discoveredAttack: 'let your opponent uncover an attack',
  doubleCheck: 'let your opponent give a double check',
  hangingPiece: 'left a piece that your opponent could simply take',
  trappedPiece: 'let one of your pieces get trapped',
  backRank: 'let your opponent checkmate you along your back rank',
}
const MISSED_TEXT: Partial<Record<ConceptName, string>> = {
  fork: 'a fork, one move that attacks two things at once', pin: 'a pin', skewer: 'a skewer', discoveredAttack: 'a discovered attack', doubleCheck: 'a double check',
  hangingPiece: 'taking a piece that nothing was protecting', trappedPiece: 'trapping a piece', backRank: 'a back-rank checkmate',
}

export function explainDrop(opts: { loss: number; allowed: { san: string; concepts: ConceptName[] } | null; missed: { san: string; concepts: ConceptName[] } | null }): { text: string; concept: ConceptName | null } {
  const a = opts.allowed?.concepts.find(c => ALLOWED_TEXT[c])
  if (a && opts.allowed) return { text: `This move ${ALLOWED_TEXT[a]}: your opponent could answer with ${opts.allowed.san}.`, concept: a }
  const m = opts.missed?.concepts.find(c => MISSED_TEXT[c])
  if (m && opts.missed) return { text: `There was a stronger move, ${opts.missed.san}, which was ${MISSED_TEXT[m]}.`, concept: m }
  const pawns = (opts.loss / 100).toFixed(1)
  return { text: `The engine counts this move as losing about ${pawns} pawns${opts.missed ? ` and prefers ${opts.missed.san}` : ''}. The reason is not a pattern this app can name yet, so look at it on the board.`, concept: null }
}

/** The learner's biggest drop of a pawn or more, explained; null when none of their moves lost that much (or there is no analysis). */
export function pickCritical(plies: readonly Ply[], analysis: Pick<Analysis, 'evals' | 'bests'> | null, color: Side): Critical | null {
  if (!analysis) return null
  let top = -1
  plies.forEach((p, k) => {
    if (p.color !== colorLetter(color)) return
    const loss = analysis.evals[k]?.loss ?? 0
    if (loss >= CRITICAL_MIN_LOSS && (top < 0 || loss > analysis.evals[top].loss)) top = k
  })
  if (top < 0) return null
  const p = plies[top], loss = analysis.evals[top].loss
  const m = momentFor({ ply: top + 1, san: p.san, played: p.uci, loss, fenBefore: p.fenBefore, fenAfter: p.fenAfter, bestBefore: analysis.bests?.[top], bestReply: analysis.bests?.[top + 1] })
  const e = explainDrop({ loss, allowed: m.allowed, missed: m.missed })
  return { k: top, san: p.san, moveNumber: moveNumberOf(p), loss, explanation: e.text, concept: e.concept, skill: e.concept ? CONCEPT_SKILL[e.concept] ?? null : null }
}

/** The pattern's name as the app words it elsewhere (for a button or a label). */
export const conceptName = (c: ConceptName) => CONCEPT_LABEL[c]

/**
 * The lesson to offer after a game: the introduction of the skill behind the critical moment (the first unfinished teaching lesson of that skill),
 * else the next unfinished teaching lesson on the recommended path. Null when everything is finished.
 */
export function followUpLesson(lessons: readonly LessonMeta[], skill: string | null, isDone: (id: string) => boolean): { lesson: LessonMeta; reason: 'skill' | 'path' } | null {
  if (skill) { const l = primaryLesson([...lessons], skill, isDone); if (l) return { lesson: l, reason: 'skill' } }
  const next = [...lessons].filter(l => { const r = roleOf(l); return (r === 'intro' || r === 'continuation') && !isDone(l.id) }).sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999) || a.id.localeCompare(b.id))[0]
  return next ? { lesson: next, reason: 'path' } : null
}

/** The PGN result string for a finished game from the learner's side. */
export function resultOf(outcome: 'win' | 'loss' | 'draw' | 'limit' | 'resigned', color: Side): string {
  return outcome === 'win' ? (color === 'white' ? '1-0' : '0-1') : outcome === 'loss' ? (color === 'white' ? '0-1' : '1-0') : outcome === 'draw' ? '1/2-1/2' : '*'
}

/** The context stored with a game against the practice opponent. A game the learner stopped, or ended by the move limit, is not "completed". */
export function gameContext(o: { startFen: string; opponent: 'stockfish' | 'maia'; level: string; color: Side; outcome: 'win' | 'loss' | 'draw' | 'limit' | 'resigned'; lessonId?: string }): GameContext {
  return { startFen: o.startFen, opponent: o.opponent, level: o.level, color: o.color, completed: o.outcome === 'win' || o.outcome === 'loss' || o.outcome === 'draw', ...(o.lessonId ? { lessonId: o.lessonId } : {}) }
}
