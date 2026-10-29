import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
