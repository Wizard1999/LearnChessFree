// Stockfish 19 (lite, single thread, GPL-3.0) in a Web Worker, behind a serial request queue.
// Engine output is EVIDENCE under recorded limits and a sparring partner; it is never the source of an explanation.
export interface EngineLine { rank: number; depth: number; kind: 'cp' | 'mate'; value: number; pv: string[] }
export interface GoLimit { depth?: number; movetime?: number; nodes?: number }
export interface Strength { elo?: number; skill?: number } // elo uses UCI_LimitStrength (1320-3190); skill 0-20 is the finer low-end control

export class Engine {
  private worker: Worker
  private listeners = new Set<(line: string) => void>()
  private chain: Promise<unknown> = Promise.resolve()
  private ready: Promise<void>
  private appliedStrength = ''

  constructor(url = `${import.meta.env.BASE_URL}engine/stockfish-19-lite-single.js`) {
    this.worker = new Worker(url)
    this.worker.onmessage = (e: MessageEvent<string>) => this.listeners.forEach(l => l(String(e.data)))
    this.ready = this.init()
  }

  private send(cmd: string) { this.worker.postMessage(cmd) }

  private waitFor(token: string): Promise<string[]> {
    return new Promise(resolve => {
      const lines: string[] = []
      const l = (line: string) => {
        lines.push(line)
        if (line.startsWith(token)) { this.listeners.delete(l); resolve(lines) }
      }
      this.listeners.add(l)
    })
  }

  private async init() {
    this.send('uci'); await this.waitFor('uciok')
    this.send('setoption name Hash value 32')
    this.send('isready'); await this.waitFor('readyok')
  }

  /** Serialise all engine work so concurrent callers never interleave UCI commands. */
  private enqueue<T>(job: () => Promise<T>): Promise<T> {
    const run = this.chain.then(() => this.ready).then(job)
    this.chain = run.catch(() => undefined)
    return run
  }

  private async setStrength(s: Strength | undefined) {
    const key = JSON.stringify(s ?? {})
    if (key === this.appliedStrength) return
    this.appliedStrength = key
    if (s?.elo) {
      this.send('setoption name UCI_LimitStrength value true')
      this.send(`setoption name UCI_Elo value ${Math.max(1320, Math.min(3190, Math.round(s.elo)))}`)
      this.send('setoption name Skill Level value 20')
    } else if (s?.skill !== undefined) {
      this.send('setoption name UCI_LimitStrength value false')
      this.send(`setoption name Skill Level value ${Math.max(0, Math.min(20, Math.round(s.skill)))}`)
    } else {
      this.send('setoption name UCI_LimitStrength value false')
      this.send('setoption name Skill Level value 20')
    }
  }

  /** Principal variations from the side to move's point of view. */
  analyse(fen: string, opts: { depth?: number; movetime?: number; multipv?: number; searchmoves?: string[] } = {}): Promise<EngineLine[]> {
    return this.enqueue(async () => {
      await this.setStrength(undefined)
      this.send('ucinewgame')
      this.send(`setoption name MultiPV value ${opts.multipv ?? 1}`)
      this.send('isready'); await this.waitFor('readyok')
      this.send(`position fen ${fen}`)
      const sm = opts.searchmoves?.length ? ` searchmoves ${opts.searchmoves.join(' ')}` : ''
      this.send(opts.movetime ? `go movetime ${opts.movetime}${sm}` : `go depth ${opts.depth ?? 14}${sm}`)
      const lines = await this.waitFor('bestmove')
      const best = new Map<number, EngineLine>()
      for (const l of lines) {
        const m = l.match(/info depth (\d+) .*?(?:multipv (\d+) )?score (cp|mate) (-?\d+).*? pv (.*)/)
        if (m) {
          const rank = m[2] ? +m[2] : 1
          best.set(rank, { rank, depth: +m[1], kind: m[3] as 'cp' | 'mate', value: +m[4], pv: m[5].split(' ') })
        }
      }
      return [...best.values()].sort((a, b) => a.rank - b.rank)
    })
  }

  /** A move for the engine opponent at a given strength; limit defaults to a quick search. */
  bestMove(fen: string, strength?: Strength, limit: GoLimit = { movetime: 400 }): Promise<string | null> {
    return this.enqueue(async () => {
      await this.setStrength(strength)
      this.send('ucinewgame')
      this.send('setoption name MultiPV value 1')
      this.send('isready'); await this.waitFor('readyok')
      this.send(`position fen ${fen}`)
      this.send(limit.depth ? `go depth ${limit.depth}` : limit.nodes ? `go nodes ${limit.nodes}` : `go movetime ${limit.movetime ?? 400}`)
      const lines = await this.waitFor('bestmove')
      const last = lines[lines.length - 1].split(' ')
      return last[1] && last[1] !== '(none)' ? last[1] : null
    })
  }

  terminate() { this.worker.terminate() }
}

let shared: Engine | null = null
/** One shared engine per page. Created lazily so pages that never need it never download the WASM. */
export function getEngine(): Engine {
  if (!shared) shared = new Engine()
  return shared
}

/** Score as pawns from White's point of view (mate shown as +/-M). */
export function scoreText(line: EngineLine, whiteToMove: boolean): string {
  const sign = whiteToMove ? 1 : -1
  if (line.kind === 'mate') return `${line.value * sign > 0 ? '+' : '-'}M${Math.abs(line.value)}`
  const v = (line.value * sign) / 100
  return `${v > 0 ? '+' : ''}${v.toFixed(2)}`
}

/** Strength presets for the practice opponent. Below ~1320 the UCI_Elo floor is not enough, so Skill Level + a shallow search is used. */
export const BOTS: { id: string; label: string; strength: Strength; limit: GoLimit; note: string }[] = [
  { id: 'b1', label: 'Beginner', strength: { skill: 0 }, limit: { depth: 1 }, note: 'Plays quickly and often misses things.' },
  { id: 'b2', label: 'Casual', strength: { skill: 4 }, limit: { depth: 3 }, note: 'Sees one-move threats, misses deeper ones.' },
  { id: 'b3', label: 'Club', strength: { elo: 1500 }, limit: { movetime: 300 }, note: 'Roughly club level (UCI_Elo 1500; not a calibrated human rating).' },
  { id: 'b4', label: 'Strong', strength: { elo: 2000 }, limit: { movetime: 500 }, note: 'Strong club player (UCI_Elo 2000; not a calibrated human rating).' },
  { id: 'b5', label: 'Perfect (endgames)', strength: {}, limit: { depth: 16 }, note: 'Full strength: use it to test whether a won or drawn ending really holds.' },
]
