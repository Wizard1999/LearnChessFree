// Offline support: after the first visit the whole school (lessons, exercises, openings data, engine) works without a network.
// Strategy: network-first for the page and the openings index (so updates arrive); stale-while-revalidate for the content files (the
// lessons and exercise bank are about 10 MB, so a return visit starts from the cache at once and the next visit gets the update);
// cache-first for everything else same-origin (hashed JS/CSS, the engine, openings chunks). Bump CACHE when a cache-first file changes
// without changing its name.
const CACHE = 'chess-school-v3'
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
  const networkFirst = req.mode === 'navigate' || /\/openings(-dev)?\/(core|manifest)\.json$/.test(url.pathname)
  const revalidate = /\/content\/[^/]+\.json$/.test(url.pathname)
  e.respondWith((async () => {
    const cache = await caches.open(CACHE)
    if (revalidate) {
      const hit = await cache.match(req)
      const fresh = fetch(req).then(r => { if (r.ok) cache.put(req, r.clone()); return r }).catch(() => undefined)
      if (hit) { e.waitUntil(fresh); return hit }
      return (await fresh) || Response.error()
    }
    if (networkFirst) {
      try { const r = await fetch(req); if (r.ok) cache.put(req, r.clone()); return r }
      catch { return (await cache.match(req)) || (await cache.match('./')) || Response.error() }
    }
    const hit = await cache.match(req)
    if (hit) return hit
    try { const r = await fetch(req); if (r.ok) cache.put(req, r.clone()); return r } catch { return Response.error() }
  })())
})
