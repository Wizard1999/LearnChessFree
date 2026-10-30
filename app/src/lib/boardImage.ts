/** Export the current position as a plain PNG (board and pieces only; no coordinates, no credit line). */
export interface PlacedPiece { file: number; rank: number; key: string } // file 0..7 = a..h, rank 0..7 = 1..8; key like "white king"

const ROLE: Record<string, string> = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' }
const GLYPH: Record<string, string> = { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙', k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
const CLASSES = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king']

/** The pieces on a board from the placement field of a FEN. */
export function piecesOf(fen: string): PlacedPiece[] {
  const out: PlacedPiece[] = []
  fen.split(' ')[0].split('/').forEach((row, i) => {
    let file = 0
    for (const ch of row) {
      if (/[1-8]/.test(ch)) file += +ch
      else { out.push({ file, rank: 7 - i, key: `${ch === ch.toUpperCase() ? 'white' : 'black'} ${ROLE[ch.toLowerCase()]}` }); file++ }
    }
  })
  return out
}

/** Pixel position of a square's top-left corner for the chosen orientation. */
export function squareOrigin(file: number, rank: number, size: number, flipped: boolean): { x: number; y: number } {
  return flipped ? { x: (7 - file) * size, y: rank * size } : { x: file * size, y: (7 - rank) * size }
}

const loadImage = (src: string) => new Promise<HTMLImageElement | null>(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src })

/** Renders the position to a PNG blob. Piece pictures are read from the pieces already shown on the page's board (the app's own set); a Unicode glyph is the fallback. */
export async function boardToPng(fen: string, flipped: boolean, root: ParentNode = document, px = 800): Promise<Blob | null> {
  const size = px / 8
  const canvas = document.createElement('canvas'); canvas.width = px; canvas.height = px
  const ctx = canvas.getContext('2d'); if (!ctx) return null
  for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
    const { x, y } = squareOrigin(f, r, size, flipped)
    ctx.fillStyle = (f + r) % 2 === 0 ? '#b58863' : '#f0d9b5'; ctx.fillRect(x, y, size, size)
  }
  const urls = new Map<string, string>()
  root.querySelectorAll('cg-board piece').forEach(el => {
    const color = el.classList.contains('white') ? 'white' : el.classList.contains('black') ? 'black' : ''
    const role = CLASSES.find(c => el.classList.contains(c))
    const m = /url\("?([^")]+)"?\)/.exec(getComputedStyle(el).backgroundImage)
    if (color && role && m && !urls.has(`${color} ${role}`)) urls.set(`${color} ${role}`, m[1])
  })
  const images = new Map<string, HTMLImageElement | null>()
  for (const [k, u] of urls) images.set(k, await loadImage(u))
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `${size * 0.85}px serif`
  for (const p of piecesOf(fen)) {
    const { x, y } = squareOrigin(p.file, p.rank, size, flipped)
    const im = images.get(p.key)
    if (im) ctx.drawImage(im, x, y, size, size)
    else {
      const [color, role] = p.key.split(' ')
      const letter = Object.keys(ROLE).find(k => ROLE[k] === role)!
      ctx.fillStyle = '#000'; ctx.fillText(GLYPH[color === 'white' ? letter.toUpperCase() : letter], x + size / 2, y + size / 2)
    }
  }
  return new Promise(res => canvas.toBlob(b => res(b), 'image/png'))
}
