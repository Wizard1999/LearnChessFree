// Copies the single-thread "lite" Stockfish build (GPL-3.0, npm: stockfish@19.0.1) into public/engine
// so it is served as a static asset. Single-thread needs no special COOP/COEP headers, so it runs on any static host.
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'node_modules', 'stockfish', 'bin')
const dst = join(root, 'public', 'engine')
mkdirSync(dst, { recursive: true })
for (const f of ['stockfish-19-lite-single.js', 'stockfish-19-lite-single.wasm']) {
  copyFileSync(join(src, f), join(dst, f))
}
copyFileSync(join(root, 'node_modules', 'stockfish', 'Copying.txt'), join(dst, 'STOCKFISH-COPYING.txt'))
console.log('engine copied to public/engine')
