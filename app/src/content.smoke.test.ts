/// <reference types="node" />
// Structural smoke test over the SHIPPED content (public/content/items.json): every item must be answerable in the player.
// This does not re-verify chess (tools/validate.py does that); it catches contract drift between content authors and the app,
// for example answer choices stored where the player does not look, moves that are not legal, or hidden squares that do not exist.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { Chess } from 'chess.js'
import { flipTurn } from './lib/play'
import type { Item } from './types'

const file = join(__dirname, '..', 'public', 'content', 'items.json')
const items: Item[] = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : []
const legal = (fen: string, uci: string) => { try { new Chess(fen).move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }); return true } catch { return false } }
const SQ = /^[a-h][1-8]$/

describe('shipped items are answerable', () => {
  it('has items to check', () => { expect(items.length).toBeGreaterThan(0) })

  it('every item has a legal starting position and a known task', () => {
    const bad: string[] = []
    for (const it of items) {
      try { new Chess(it.fen) } catch { bad.push(`${it.id}: bad fen`); continue }
      if (!['find_move', 'select_squares', 'predict_outcome', 'classify_position', 'threat_detection', 'play_out'].includes(it.task)) bad.push(`${it.id}: task ${it.task}`)
      if (!it.prompt?.trim()) bad.push(`${it.id}: empty prompt`)
      if (!/^[A-Z]{2,5}(\.[A-Za-z0-9-]+)+\.D[0-5]$/.test(it.skill)) bad.push(`${it.id}: skill ${it.skill}`)
    }
    expect(bad.slice(0, 20)).toEqual([])
  })

  it('find_move and threat_detection answers are legal moves', () => {
    const bad: string[] = []
    for (const it of items.filter(i => i.task === 'find_move' || i.task === 'threat_detection')) {
      const fen = it.task === 'threat_detection' ? flipTurn(it.fen) : it.fen
      const moves = it.answer.moves ?? (it.answer.threat_move && it.answer.threat_move !== 'none' ? [it.answer.threat_move] : [])
      if (moves.length === 0 && !(it.task === 'threat_detection')) bad.push(`${it.id}: no accepted moves`)
      if (it.task === 'threat_detection' && moves.length === 0 && it.answer.threat_move !== 'none' && it.answer.outcome !== 'none') bad.push(`${it.id}: threat item with neither a threat move nor 'none'`)
      for (const m of moves) if (!legal(fen, m)) bad.push(`${it.id}: ${m} is not legal`)
    }
    expect(bad.slice(0, 20)).toEqual([])
  })

  it('whole-line items have a legal line of the stated length starting with an accepted move', () => {
    const bad: string[] = []
    for (const it of items.filter(i => i.answer.line)) {
      const line = it.answer.line!
      if ((it.answer.plies ?? 0) > line.length) bad.push(`${it.id}: plies > line length`)
      if (!it.answer.moves?.includes(line[0])) bad.push(`${it.id}: first move of the line is not an accepted move`)
      const c = new Chess(it.fen)
      for (const m of line) { try { c.move({ from: m.slice(0, 2), to: m.slice(2, 4), promotion: m[4] }) } catch { bad.push(`${it.id}: ${m} illegal in line`); break } }
    }
    expect(bad.slice(0, 20)).toEqual([])
  })

  it('select_squares answers are squares, and "from" names a piece of the side to move', () => {
    const bad: string[] = []
    for (const it of items.filter(i => i.task === 'select_squares')) {
      if (!Array.isArray(it.answer.squares)) { bad.push(`${it.id}: no squares array`); continue }
      for (const s of it.answer.squares) if (!SQ.test(s)) bad.push(`${it.id}: bad square ${s}`)
      if (it.answer.from) { if (!SQ.test(it.answer.from) || !new Chess(it.fen).get(it.answer.from as 'a1')) bad.push(`${it.id}: nothing on ${it.answer.from}`) }
    }
    expect(bad.slice(0, 20)).toEqual([])
  })

  it('predict_outcome and classify_position have visible choices that include the answer', () => {
    const bad: string[] = []
    for (const it of items.filter(i => i.task === 'predict_outcome' || i.task === 'classify_position')) {
      const options = it.options ?? it.answer.options ?? (it.task === 'predict_outcome' ? ['yes', 'no'] : [])
      const want = (it.answer.outcome ?? it.answer.class ?? '').trim().toLowerCase()
      if (options.length < 2) bad.push(`${it.id}: fewer than two choices`)
      else if (!options.some(o => o.trim().toLowerCase() === want)) bad.push(`${it.id}: answer "${want}" is not among the choices`)
    }
    expect(bad.slice(0, 20)).toEqual([])
  })

  it('memory drills hide real squares and play_out items have a goal', () => {
    const bad: string[] = []
    for (const it of items) {
      for (const s of it.display?.hide ?? []) if (!SQ.test(s)) bad.push(`${it.id}: hide ${s}`)
      if (it.display?.study_seconds !== undefined && !(it.display.study_seconds > 0 && it.display.study_seconds <= 60)) bad.push(`${it.id}: study_seconds`)
      if (it.task === 'play_out' && !it.answer.goal) bad.push(`${it.id}: no goal`)
    }
    expect(bad.slice(0, 20)).toEqual([])
  })

  it('ids are unique and cues are 1 to 4', () => {
    const seen = new Set<string>(); const bad: string[] = []
    for (const it of items) { if (seen.has(it.id)) bad.push(`dup ${it.id}`); seen.add(it.id); if (![1, 2, 3, 4].includes(it.cue)) bad.push(`${it.id}: cue ${it.cue}`) }
    expect(bad.slice(0, 20)).toEqual([])
  })
})
