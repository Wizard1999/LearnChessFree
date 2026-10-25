import { Chess } from 'chess.js'

export interface ParsedGame {
  white: string; black: string; result: string; date?: string; event?: string; opening?: string
  whiteElo?: string; blackElo?: string; pgn: string; plies: number
}

/** Split a PGN file with many games into single-game strings. */
export function splitPgn(text: string): string[] {
  const t = text.replace(/\r/g, '').trim()
  if (!t) return []
  const parts = t.split(/\n\s*\n(?=\[Event )/g)
  return parts.map(p => p.trim()).filter(Boolean)
}

export function parseGame(pgn: string): ParsedGame | null {
  try {
    const c = new Chess()
    c.loadPgn(pgn)
    const h = c.header()
    return {
      white: h.White ?? '?', black: h.Black ?? '?', result: h.Result ?? '*', date: h.Date ?? undefined, event: h.Event ?? undefined, opening: (h as Record<string, string | null>).Opening ?? undefined,
      whiteElo: h.WhiteElo ?? undefined, blackElo: h.BlackElo ?? undefined, pgn: c.pgn(), plies: c.history().length,
    }
  } catch { return null }
}

export interface Ply { san: string; uci: string; fenBefore: string; fenAfter: string; color: 'w' | 'b' }
export function plyList(pgn: string): Ply[] {
  const c = new Chess(); c.loadPgn(pgn)
  const moves = c.history({ verbose: true })
  return moves.map(m => ({ san: m.san, uci: m.from + m.to + (m.promotion ?? ''), fenBefore: m.before, fenAfter: m.after, color: m.color }))
}

/** Public, unauthenticated game exports. Both services allow cross-origin reads; errors are reported, not hidden. */
export async function fetchLichess(user: string, max = 25): Promise<string[]> {
  const r = await fetch(`https://lichess.org/api/games/user/${encodeURIComponent(user)}?max=${max}&opening=true&moves=true&tags=true`, { headers: { Accept: 'application/x-chess-pgn' } })
  if (!r.ok) throw new Error(r.status === 404 ? 'No Lichess user with that name.' : `Lichess answered ${r.status}.`)
  return splitPgn(await r.text())
}
export async function fetchChessCom(user: string, max = 25): Promise<string[]> {
  const base = `https://api.chess.com/pub/player/${encodeURIComponent(user.toLowerCase())}/games`
  const a = await fetch(`${base}/archives`)
  if (!a.ok) throw new Error(a.status === 404 ? 'No Chess.com user with that name.' : `Chess.com answered ${a.status}.`)
  const archives: string[] = (await a.json()).archives ?? []
  const out: string[] = []
  for (let i = archives.length - 1; i >= 0 && out.length < max; i--) {
    const m = await fetch(archives[i])
    if (!m.ok) continue
    const games: { pgn?: string }[] = (await m.json()).games ?? []
    for (const g of games.reverse()) { if (g.pgn) out.push(g.pgn); if (out.length >= max) break }
  }
  return out
}
