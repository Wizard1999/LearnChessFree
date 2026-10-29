import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/source-sans-3/index.css'
import '@fontsource-variable/source-serif-4/index.css'
import '@fontsource/ibm-plex-mono/400.css'
import './theme.css'
import './index.css'
import App from './App.tsx'
import { applyAppearance, loadAppearance } from './lib/appearance'
import { watchPersistence } from './lib/persist'

applyAppearance(loadAppearance())
watchPersistence()

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  /*
    The scope is the base without its trailing slash, because a host may
    serve the app at the unslashed path itself — andrewvalentine.net
    /learnchessfree does, since Next.js strips trailing slashes. A worker
    registered at /learnchessfree/sw.js defaults to the scope
    '/learnchessfree/', which does not match the page '/learnchessfree':
    scopes match as plain string prefixes, so the worker would activate and
    then control nothing, and the app would silently never work offline.
    Widening the scope past the script's own directory needs the host to
    send 'Service-Worker-Allowed' for it; if it does not, registration
    fails and we fall back to the default scope rather than losing the
    worker altogether.
  */
  const base = import.meta.env.BASE_URL
  const scope = base.startsWith('/') ? base.replace(/\/$/, '') || '/' : base
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${base}sw.js`, { scope })
      .catch(() => navigator.serviceWorker.register(`${base}sw.js`).catch(() => undefined))
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
