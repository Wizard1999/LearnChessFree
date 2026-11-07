import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo } from 'react'
import { db } from '../db'
import { typeMedians } from './measuredTime'

const NONE: ReadonlyMap<string, number> = new Map()

/** Median time per step type on this device, for the types with enough samples (empty until then, or when storage is unavailable). */
export function usePaceMedians(): ReadonlyMap<string, number> {
  const rows = useLiveQuery(() => db.stepTimes.orderBy('ts').reverse().limit(2000).toArray().catch(() => []), [])
  return useMemo(() => (rows ? typeMedians(rows) : NONE), [rows])
}
