import { useEffect, useRef } from 'react'
import { Chessground } from 'chessground'
import type { Api } from 'chessground/api'
import type { Config } from 'chessground/config'
import 'chessground/assets/chessground.base.css'
import 'chessground/assets/chessground.brown.css'
import 'chessground/assets/chessground.cburnett.css'

/** Thin React wrapper. Chessground (GPL-3.0-or-later) owns rendering, drag/touch input, arrows and highlights. */
export function Board({ config, onApi }: { config: Config; onApi?: (api: Api) => void }) {
  const el = useRef<HTMLDivElement>(null)
  const api = useRef<Api | null>(null)

  useEffect(() => {
    if (!el.current) return
    api.current = Chessground(el.current, config)
    onApi?.(api.current)
    return () => api.current?.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { api.current?.set(config) }, [config])

  return <div ref={el} style={{ width: 'min(90vw, 480px)', aspectRatio: '1 / 1' }} />
}
