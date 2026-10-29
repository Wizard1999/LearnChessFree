// Endgame tablebase lookup for positions with at most seven pieces, through the public Lichess tablebase service.
// This is the one place the Analysis page calls the network, only when the learner turns it on, and only the position is sent.
export interface TbMove { uci: string; san: string; category: string; dtz: number | null; dtm: number | null }
export interface TbResult { category: string; dtz: number | null; dtm: number | null; moves: TbMove[] }

export const pieceCount = (fen: string) => (fen.split(' ')[0].match(/[a-zA-Z]/g) ?? []).length

export async function probeTablebase(fen: string): Promise<TbResult> {
  const r = await fetch(`https://tablebase.lichess.ovh/standard?fen=${encodeURIComponent(fen)}`)
  if (!r.ok) throw new Error(`tablebase ${r.status}`)
  return r.json() as Promise<TbResult>
}

/** From the side to move's point of view. */
export const TB_TEXT: Record<string, string> = {
  win: 'Win', loss: 'Loss', draw: 'Draw', 'maybe-win': 'Win, unless the 50-move rule intervenes', 'maybe-loss': 'Loss, unless the 50-move rule saves it',
  'cursed-win': 'Win only by passing the 50-move rule (drawn in practice)', 'blessed-loss': 'Loss that the 50-move rule turns into a draw', unknown: 'Unknown',
}
