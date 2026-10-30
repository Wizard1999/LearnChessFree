// Maia opponent: a free, open network (CSSLab, GPL-3.0) trained on human games of one rating band. It plays a move a person of that
// strength might play, mistakes included, which is better sparring than a weakened engine. Runs on the CPU in a Web Worker, loads
// only when first chosen, works offline afterwards (the service worker caches the files), sends nothing anywhere.
// Evidence: this is a model of human move choice, not a calibrated rating; labels say "about".
import { Chess } from 'chess.js'
import { chooseMove, encodePlanes, historyFens, legalPolicy, type MaiaMove } from './maiaCore'

export interface MaiaLevel { rating: number; file: string; bytes: number; label: string }
export const MAIA_LEVELS: readonly MaiaLevel[] = [
  { rating: 1100, file: 'maia1100.onnx', bytes: 3483872, label: 'about 1100 (newer club player)' },
  { rating: 1300, file: 'maia1300.onnx', bytes: 3483872, label: 'about 1300' },
  { rating: 1500, file: 'maia1500.onnx', bytes: 3483872, label: 'about 1500 (typical club player)' },
  { rating: 1700, file: 'maia1700.onnx', bytes: 3483872, label: 'about 1700' },
  { rating: 1900, file: 'maia1900.onnx', bytes: 3483872, label: 'about 1900 (strong club player)' },
]
export const MAIA_RUNTIME_BYTES = 14848852
export const mb = (bytes: number) => `${(bytes / 1048576).toFixed(bytes > 9.5 * 1048576 ? 0 : 1)} MB`

export type OpponentKind = 'stockfish' | 'maia'
export interface OpponentChoice { kind: OpponentKind; botId: string; maiaRating: number; maiaBest: boolean }
export const DEFAULT_OPPONENT: OpponentChoice = { kind: 'stockfish', botId: 'b3', maiaRating: 1500, maiaBest: false }
const KEY = 'chess-school-opponent-v1'
export function loadOpponent(): OpponentChoice {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Partial<OpponentChoice> | null
    if (!raw) return DEFAULT_OPPONENT
    return {
      kind: raw.kind === 'maia' ? 'maia' : 'stockfish',
      botId: typeof raw.botId === 'string' ? raw.botId : DEFAULT_OPPONENT.botId,
      maiaRating: MAIA_LEVELS.some(l => l.rating === raw.maiaRating) ? (raw.maiaRating as number) : DEFAULT_OPPONENT.maiaRating,
      maiaBest: raw.maiaBest === true,
    }
  } catch { return DEFAULT_OPPONENT }
}
export function saveOpponent(o: OpponentChoice) { try { localStorage.setItem(KEY, JSON.stringify(o)) } catch { /* private mode */ } }

/** The nearest Stockfish setting to a Maia rating, used when Maia cannot load. */
export function fallbackBotId(rating: number): string { return rating <= 1200 ? 'b2' : 'b3' }

type Reply = { policy: Float32Array; wdl: number[] } | null
interface Pending { resolve: (v: Reply) => void; reject: (e: Error) => void }

export class MaiaEngine {
  private worker: Worker | null = null
  private seq = 0
  private pending = new Map<number, Pending>()
  private loaded = ''
  private chain: Promise<unknown> = Promise.resolve()
  readonly rating: number
  private baseUrl: string
  // Absolute, because the base may be './' (the app can be hosted from any folder) and the worker script lives in assets/.
  constructor(rating: number, baseUrl = new URL(`${import.meta.env.BASE_URL}maia/`, document.baseURI).href) { this.rating = rating; this.baseUrl = baseUrl }

  private start(): Worker {
    if (this.worker) return this.worker
    const w = new Worker(new URL('./maiaWorker.ts', import.meta.url), { type: 'module' })
    w.onmessage = (e: MessageEvent<{ type: string; id: number; message?: string; policy?: Float32Array; wdl?: number[] }>) => {
      const p = this.pending.get(e.data.id)
      if (!p) return
      this.pending.delete(e.data.id)
      if (e.data.type === 'error') p.reject(new Error(e.data.message ?? 'Maia failed'))
      else p.resolve(e.data.type === 'result' ? { policy: e.data.policy!, wdl: e.data.wdl ?? [] } : null)
    }
    w.onerror = ev => this.failAll(new Error(ev.message || 'The Maia worker could not start'))
    this.worker = w
    return w
  }
  private failAll(err: Error) {
    for (const p of this.pending.values()) p.reject(err)
    this.pending.clear(); this.worker?.terminate(); this.worker = null; this.loaded = ''
  }
  private call(msg: Record<string, unknown>, timeoutMs: number): Promise<Reply> {
    const id = ++this.seq
    return new Promise<Reply>((resolve, reject) => {
      const timer = setTimeout(() => this.failAll(new Error('Maia took too long to answer')), timeoutMs)
      this.pending.set(id, { resolve: v => { clearTimeout(timer); resolve(v) }, reject: e => { clearTimeout(timer); reject(e) } })
      try { this.start().postMessage({ ...msg, id }) } catch (e) { this.failAll(e instanceof Error ? e : new Error('Maia could not start')) }
    })
  }

  /** Download (first time only) and open the model for this rating. Rejects with a plain-words error. */
  async load(): Promise<void> {
    const level = MAIA_LEVELS.find(l => l.rating === this.rating)
    if (!level) throw new Error(`No Maia model for ${this.rating}`)
    if (this.loaded === level.file) return
    await this.call({ type: 'load', baseUrl: this.baseUrl, file: level.file }, 120000)
    this.loaded = level.file
  }

  /** Legal moves with probabilities for a position; `moves` (UCI since startFen) supplies the history planes. */
  evaluate(fen: string, moves: string[] = [], startFen?: string, temperature = 1): Promise<MaiaMove[]> {
    const run = this.chain.then(async () => {
      await this.load()
      let fens = startFen ? historyFens(startFen, moves) : [fen]
      if (fens[0].split(' ').slice(0, 4).join(' ') !== fen.split(' ').slice(0, 4).join(' ')) fens = [fen]
      const out = await this.call({ type: 'run', planes: encodePlanes(fens) }, 30000)
      if (!out) throw new Error('Maia returned nothing')
      return legalPolicy(fen, out.policy, temperature)
    })
    this.chain = run.catch(() => undefined)
    return run
  }

  /** A move in UCI for the position, sampled like a person of this rating (or the single most likely move with best). */
  async move(fen: string, opts: { moves?: string[]; startFen?: string; best?: boolean } = {}): Promise<string | null> {
    if (new Chess(fen).isGameOver()) return null
    const rows = await this.evaluate(fen, opts.moves, opts.startFen)
    return chooseMove(rows, { best: opts.best })?.uci ?? null
  }

  terminate() { this.failAll(new Error('stopped')) }
}

let shared: MaiaEngine | null = null
/** One Maia engine at a time; asking for another rating replaces it (its worker and model are dropped). */
export function getMaia(rating: number): MaiaEngine {
  if (!shared || shared.rating !== rating) { shared?.terminate(); shared = new MaiaEngine(rating) }
  return shared
}
