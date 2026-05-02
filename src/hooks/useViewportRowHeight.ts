import { useEffect, useState } from 'react'

function compute(): number {
  if (typeof window === 'undefined') return 80
  const w = window.innerWidth
  // xs: match block (~63) + 3 stacked market groups (~180) + bottom padding
  if (w < 640) return 248
  return 80 // sm+ — inline layout
}

export function useViewportRowHeight(): number {
  const [h, setH] = useState(compute)

  useEffect(() => {
    let scheduled = false
    const onResize = () => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(() => {
        scheduled = false
        setH(compute())
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return h
}
