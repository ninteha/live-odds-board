import { useEffect, useRef, useState } from 'react'

export type FlashDir = 'up' | 'down' | null

/**
 * Returns 'up' | 'down' for `durationMs` after `value` changes,
 * then null. Resets timer if a new change arrives mid-flash.
 */
export function useFlash(value: number, durationMs = 1000): FlashDir {
  const [dir, setDir] = useState<FlashDir>(null)
  const prev = useRef(value)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (value === prev.current) return
    const next: FlashDir = value > prev.current ? 'up' : 'down'
    prev.current = value
    setDir(next)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setDir(null), durationMs)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [value, durationMs])

  return dir
}
