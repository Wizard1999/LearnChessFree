// Maia inference worker: loads one ONNX model on demand and runs forward passes on the CPU (WebAssembly, single thread).
// The runtime (onnxruntime-web, MIT) is imported dynamically so it never reaches the main bundle; its wasm file is served from
// the app's own files. Messages in: load {id,baseUrl,file}, run {id,planes}. Messages out: ready/result/error with the same id.
type InMsg = { type: 'load'; id: number; baseUrl: string; file: string } | { type: 'run'; id: number; planes: Float32Array }
type Ort = typeof import('onnxruntime-web/wasm')
interface Scope { postMessage(m: unknown, t?: Transferable[]): void; onmessage: ((e: MessageEvent<InMsg>) => void) | null }
const ctx = self as unknown as Scope

let ort: Ort | null = null
let session: Awaited<ReturnType<Ort['InferenceSession']['create']>> | null = null
let loadedFile = ''

async function load(baseUrl: string, file: string) {
  if (!ort) {
    ort = await import('onnxruntime-web/wasm')
    ort.env.wasm.numThreads = 1
    ort.env.wasm.proxy = false
    ort.env.wasm.wasmPaths = new URL(`${baseUrl}ort/`, self.location.href).href // absolute, so the dev server does not rewrite the loader import
  }
  if (session && loadedFile === file) return
  const res = await fetch(`${baseUrl}${file}`)
  if (!res.ok) throw new Error(`model download failed (${res.status})`)
  const bytes = new Uint8Array(await res.arrayBuffer())
  session = await ort.InferenceSession.create(bytes, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' })
  loadedFile = file
}

ctx.onmessage = async e => {
  const m = e.data
  try {
    if (m.type === 'load') {
      await load(m.baseUrl, m.file)
      ctx.postMessage({ type: 'ready', id: m.id })
    } else if (ort && session) {
      const out = await session.run({ [session.inputNames[0]]: new ort.Tensor('float32', m.planes, [1, 112, 8, 8]) })
      const policy = new Float32Array(out[session.outputNames[0]].data as Float32Array)
      const wdl = session.outputNames[1] ? Array.from(out[session.outputNames[1]].data as Float32Array) : []
      ctx.postMessage({ type: 'result', id: m.id, policy, wdl }, [policy.buffer])
    } else throw new Error('model not loaded')
  } catch (err) {
    ctx.postMessage({ type: 'error', id: m.id, message: err instanceof Error ? err.message : String(err) })
  }
}
