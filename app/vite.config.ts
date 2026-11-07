import react from '@vitejs/plugin-react'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { defaultClientConditions, defineConfig, type Plugin } from 'vite'

/**
 * public/content keeps unhashed copies of the content files because the tools and tests read them (items.json, lessons.json, ...); the app
 * reads only the hash-named copies that manifest.json names (docs/performance.md). Leave the unhashed copies out of the build: they would
 * only add about 18 MB of files nobody downloads.
 */
const dropUnhashedContent = (): Plugin => {
  let outDir = 'dist'
  return {
    name: 'drop-unhashed-content',
    apply: 'build',
    configResolved(c) { outDir = join(c.root, c.build.outDir) },
    closeBundle() { for (const n of ['items', 'skills', 'verified', 'courses', 'lessons']) rmSync(join(outDir, 'content', `${n}.json`), { force: true }) },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dropUnhashedContent()],
  // Maia: use onnxruntime-web's build that loads its wasm from the app's own public/maia/ort (copied by scripts/copy-maia.mjs) instead of
  // bundling a second 15 MB copy into dist/assets.
  resolve: { conditions: ['onnxruntime-web-use-extern-wasm', ...defaultClientConditions] },
  worker: { format: 'es' },
  /*
    Relative paths by default: the build can be hosted from any folder, opened
    from a USB stick, or served by the desktop exe from its own root.

    VITE_BASE overrides it for a deployment that is proxied under a path on
    another domain — andrewvalentine.net/learnchessfree sets
    VITE_BASE=/learnchessfree/, so the HTML asks for /learnchessfree/assets/…
    and the proxy strips the prefix before serving from this deployment's
    root. Relative paths cannot do that job: the proxied URL has no trailing
    slash, so './assets/…' would resolve against the site root.
  */
  base: process.env.VITE_BASE ?? './',
})
