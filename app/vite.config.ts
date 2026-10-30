import react from '@vitejs/plugin-react'
import { defaultClientConditions, defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
