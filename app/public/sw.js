// Offline support: after the first visit the whole school (lessons, exercises, openings data, engine) works without a network.
// Strategy: network-first for the page, the content manifest and the openings index (so updates arrive); the other content files are
// requested as ?v=<manifest hash>, so each URL never changes and is cache-first (the lessons and exercise bank are about 10 MB, so a
// return visit starts from the cache at once, and a new build has new URLs, so builds never mix); cache-first for everything else
// same-origin (hashed JS/CSS, the engine, openings chunks). Bump CACHE when a cache-first file changes without changing its name.
const CACHE = 'chess-school-v4'
self.addEventListener('install', e => { self.skipWaiting() })
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k)
    await self.clients.claim()
  })())
})
self.addEventListener('fetch', e => {
  const req = e.request
  const url = new URL(req.url)
  if (req.method !== 'GET' || url.origin !== self.location.origin) return
  const networkFirst = req.mode === 'navigate' || /\/content\/manifest\.json$/.test(url.pathname) || /\/openings(-dev)?\/(core|manifest)\.json$/.test(url.pathname)
  const versioned = /\/content\/[^/]+\.json$/.test(url.pathname) && url.searchParams.has('v')
  e.respondWith((async () => {
    const cache = await caches.open(CACHE)
    if (versioned) {
      const hit = await cache.match(req)
      if (hit) return hit
      try {
        const r = await fetch(req)
        if (r.ok) {
          await cache.put(req, r.clone())
          for (const k of await cache.keys()) { const u = new URL(k.url); if (u.pathname === url.pathname && u.search !== url.search) await cache.delete(k) } // drop older builds of this file
        }
        return r
      } catch { return Response.error() }
    }
    if (networkFirst) {
      try { const r = await fetch(req); if (r.ok) cache.put(req, r.clone()); return r }
      catch { return (await cache.match(req)) || (await cache.match('./')) || Response.error() }
    }
    const hit = await cache.match(req)
    if (hit) return hit
    try {
      const r = await fetch(req)
      if (r.ok) {
        await cache.put(req, r.clone())
        // Maia models (about 3.5 MB each) are fetched on first use only; keep the three most recent so the cache stays bounded.
        if (/\/maia\/maia\d+\.onnx$/.test(url.pathname)) {
          const models = (await cache.keys()).filter(k => /\/maia\/maia\d+\.onnx$/.test(new URL(k.url).pathname))
          for (const k of models.slice(0, Math.max(0, models.length - 3))) await cache.delete(k)
        }
      }
      return r
    } catch { return Response.error() }
  })())
})
