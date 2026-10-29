// A move tree with variations, comments and NAG marks: parse a PGN into it, write it back out. chess.js validates every move.
import { Chess } from 'chess.js'

export interface TNode { id: number; parent: number | null; san: string; uci: string; fen: string; ply: number; kids: number[]; comment?: string; nag?: number; /** Engine score from a [%eval] comment, centipawns from White's point of view (mate as 2000). */ evalCp?: number }
export interface Tree { nodes: TNode[]; headers?: Record<string, string> }

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
export const emptyTree = (fen: string = START_FEN): Tree => ({ nodes: [{ id: 0, parent: null, san: '', uci: '', fen, ply: 0, kids: [] }] })

/** NAG numbers for the usual marks. */
export const NAG_SYMBOL: Record<number, string> = { 1: '!', 2: '?', 3: '!!', 4: '??', 5: '!?', 6: '?!' }
export const SYMBOL_NAG: Record<string, number> = { '!': 1, '?': 2, '!!': 3, '??': 4, '!?': 5, '?!': 6 }

const TOKEN = /\{[^}]*\}|;[^\n]*|\(|\)|\$\d+|\d+\.(?:\.\.)?|1-0|0-1|1\/2-1\/2|\*|[^\s(){}$]+/g

/** Adds a move under `parent` unless that move already exists there; returns the node id, or null if the move is illegal. */
export function addMove(t: Tree, parent: number, san: string): number | null {
  const c = new Chess(t.nodes[parent].fen)
  let m
  try { m = c.move(san) } catch { return null }
  const same = t.nodes[parent].kids.find(k => t.nodes[k].san === m.san)
  if (same !== undefined) return same
  const id = t.nodes.length
  t.nodes[parent].kids.push(id)
  t.nodes.push({ id, parent, san: m.san, uci: m.from + m.to + (m.promotion ?? ''), fen: c.fen(), ply: t.nodes[parent].ply + 1, kids: [] })
  return id
}

/** Parses one PGN game with variations, comments and NAGs. Returns an error message for text that is neither valid. */
export function parsePgn(text: string): Tree | string {
  const headers: Record<string, string> = {}
  let body = text
  for (const m of text.matchAll(/^\s*\[(\w+)\s+"([^"]*)"\]\s*$/gm)) headers[m[1]] = m[2]
  body = body.replace(/^\s*\[[^\]]*\]\s*$/gm, ' ')
  const start = headers.FEN && headers.SetUp !== '0' ? headers.FEN : START_FEN
  try { new Chess(start) } catch { return 'The FEN in the PGN header is not a valid position.' }
  const t = emptyTree(new Chess(start).fen()); t.headers = headers
  let cur = 0, prevParent = 0
  const stack: { cur: number; prevParent: number }[] = []
  for (const tok of body.match(TOKEN) ?? []) {
    if (tok[0] === '{') {
      const ev = tok.match(/\[%eval\s+(#?)(-?[\d.]+)\]/)
      if (ev) t.nodes[cur].evalCp = ev[1] ? (+ev[2] > 0 ? 2000 : -2000) : Math.round(parseFloat(ev[2]) * 100)
      const c = tok.slice(1, -1).replace(/\[%[^\]]*\]/g, '').trim()
      if (c) t.nodes[cur].comment = t.nodes[cur].comment ? `${t.nodes[cur].comment} ${c}` : c
    } else if (tok[0] === ';') { /* line comment: ignored */ }
    else if (tok === '(') { stack.push({ cur, prevParent }); cur = prevParent }
    else if (tok === ')') { const s = stack.pop(); if (s) { cur = s.cur; prevParent = s.prevParent } }
    else if (tok[0] === '$') t.nodes[cur].nag = +tok.slice(1)
    else if (/^(\d+\.+|1-0|0-1|1\/2-1\/2|\*)$/.test(tok)) { /* move number or result */ }
    else {
      const mark = tok.match(/(!!|\?\?|!\?|\?!|!|\?)$/)
      const san = mark ? tok.slice(0, -mark[0].length) : tok
      const id = addMove(t, cur, san)
      if (id === null) { if (t.nodes.length === 1) return 'That is not a valid FEN or PGN.'; break }
      prevParent = cur; cur = id
      if (mark) t.nodes[id].nag = SYMBOL_NAG[mark[0]]
    }
  }
  return t
}

/** The move number and colour of a node, from the start position's own side to move and move counter. */
export function moveNumber(t: Tree, n: TNode): { number: number; white: boolean } {
  const f = t.nodes[0].fen.split(' ')
  const k = n.ply - 1 + (f[1] === 'b' ? 1 : 0)
  return { number: (parseInt(f[5] ?? '1', 10) || 1) + Math.floor(k / 2), white: k % 2 === 0 }
}

/** Writes the tree as PGN movetext with variations, comments and NAGs. */
export function writePgn(t: Tree): string {
  const out: string[] = []
  const head = { Event: '?', Site: '?', Date: '????.??.??', Round: '?', White: '?', Black: '?', Result: '*', ...(t.headers ?? {}) }
  if (t.nodes[0].fen !== START_FEN) { head.SetUp = '1'; head.FEN = t.nodes[0].fen }
  for (const [k, v] of Object.entries(head)) out.push(`[${k} "${v}"]`)
  const line = (id: number, forceNum: boolean): string => {
    const parts: string[] = []
    let cur: number | undefined = id, force = forceNum
    while (cur !== undefined) {
      const n: TNode = t.nodes[cur]
      const { number, white } = moveNumber(t, n)
      parts.push(white ? `${number}. ${n.san}` : force ? `${number}... ${n.san}` : n.san)
      if (n.nag) parts[parts.length - 1] += ` $${n.nag}`
      if (n.comment) parts.push(`{${n.comment.replace(/[{}]/g, '')}}`)
      force = false
      const par = t.nodes[n.parent ?? 0]
      if (par.kids[0] === cur) for (const a of par.kids.slice(1)) { parts.push('(' + line(a, true) + ')'); force = true }
      if (n.comment) force = true
      cur = n.kids[0]
    }
    return parts.join(' ')
  }
  const rootMain = t.nodes[0].kids
  const first = rootMain.length ? line(rootMain[0], t.nodes[0].fen.split(' ')[1] === 'b') : ''
  const root = t.nodes[0].comment ? `{${t.nodes[0].comment}} ` : ''
  return `${out.join('\n')}\n\n${root}${first} ${head.Result}\n`
}
