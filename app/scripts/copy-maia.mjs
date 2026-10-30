// Copies the ONNX Runtime Web WebAssembly file and its small JS loader (MIT, npm: onnxruntime-web) into public/maia/ort so Maia runs from the app's own
// files with no CDN. CPU only, single thread: no SharedArrayBuffer, so no special COOP/COEP headers are needed on any host.
// The Maia model files (GPL-3.0) are committed in public/maia; see LICENSES.md.
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'node_modules', 'onnxruntime-web')
const dst = join(root, 'public', 'maia', 'ort')
mkdirSync(dst, { recursive: true })
for (const f of ['ort-wasm-simd-threaded.wasm', 'ort-wasm-simd-threaded.mjs']) copyFileSync(join(src, 'dist', f), join(dst, f))
console.log('onnxruntime wasm and loader copied to public/maia/ort')
