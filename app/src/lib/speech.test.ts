import { describe, expect, it } from 'vitest'
import { chunkForSpeech, expandNotation, speakable, stripMarkers } from './speech'

describe('expandNotation', () => {
  it('piece moves', () => {
    expect(expandNotation('Nf3')).toBe('knight f 3')
    expect(expandNotation('Bb5')).toBe('bishop b 5')
    expect(expandNotation('Kg1')).toBe('king g 1')
  })
  it('captures', () => {
    expect(expandNotation('Nxe5')).toBe('knight takes e 5')
    expect(expandNotation('Qxd8')).toBe('queen takes d 8')
    expect(expandNotation('exd5')).toBe('e takes d 5')
  })
  it('pawn moves and bare squares', () => {
    expect(expandNotation('e4')).toBe('e 4')
    expect(expandNotation('Play e4 now')).toBe('Play e 4 now')
    expect(expandNotation('1.e4 e5')).toBe('1.e 4 e 5')
  })
  it('promotions', () => {
    expect(expandNotation('e8=Q')).toBe('e 8 promotes to queen')
    expect(expandNotation('exd8=N+')).toBe('e takes d 8 promotes to knight check')
  })
  it('castling', () => {
    expect(expandNotation('O-O')).toBe('castles kingside')
    expect(expandNotation('O-O-O')).toBe('castles queenside')
    expect(expandNotation('0-0')).toBe('castles kingside')
    expect(expandNotation('O-O+')).toBe('castles kingside check')
  })
  it('check and mate', () => {
    expect(expandNotation('Qh5+')).toBe('queen h 5 check')
    expect(expandNotation('Qxf7#')).toBe('queen takes f 7 checkmate')
  })
  it('disambiguation', () => {
    expect(expandNotation('Nbd2')).toBe('knight b d 2')
    expect(expandNotation('R1e2')).toBe('rook 1 e 2')
    expect(expandNotation('Raxe1')).toBe('rook a takes e 1')
    expect(expandNotation('Qh4xe1')).toBe('queen h 4 takes e 1')
  })
  it('leaves ordinary words and numbers alone', () => {
    expect(expandNotation('Be careful, Bed and Kingside +3 and x marks')).toBe('Be careful, Bed and Kingside +3 and x marks')
    expect(expandNotation('Use the b-pawn')).toBe('Use the b-pawn')
  })
  it('moves inside sentences and brackets', () => {
    expect(expandNotation('After Nf3, Black plays (Nc6).')).toBe('After knight f 3, Black plays (knight c 6).')
  })
})

describe('speakable', () => {
  it('strips markers and expands notation', () => {
    expect(speakable('The **knight** goes to *f3*: Nf3 and then O-O.')).toBe('The knight goes to f 3: knight f 3 and then castles kingside.')
  })
  it('turns line breaks into pauses', () => {
    expect(speakable('First line\nSecond line')).toBe('First line. Second line')
  })
})

describe('stripMarkers', () => {
  it('removes bold, italic and code markers', () => {
    expect(stripMarkers('**a** *b* `c`')).toBe('a b c')
  })
})

describe('chunkForSpeech', () => {
  it('keeps short text whole and splits long text on sentences', () => {
    expect(chunkForSpeech('One. Two.')).toEqual(['One. Two.'])
    const long = Array.from({ length: 12 }, (_, i) => `Sentence number ${i} is here.`).join(' ')
    const parts = chunkForSpeech(long, 100)
    expect(parts.length).toBeGreaterThan(2)
    expect(parts.every(p => p.length <= 100)).toBe(true)
    expect(parts.join(' ')).toBe(long)
  })
  it('returns nothing for empty text', () => { expect(chunkForSpeech('  ')).toEqual([]) })
})
