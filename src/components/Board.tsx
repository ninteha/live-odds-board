import { useEffect, useRef } from 'react'
import { List, useListRef } from 'react-window'
import { useMatchStore } from '../store/matchStore'
import { useUiStore } from '../store/uiStore'
import { useViewportRowHeight } from '../hooks/useViewportRowHeight'
import { Row } from './Row'

export function Board() {
  const total = useMatchStore((s) => s.ids.length)
  const setScrollOffset = useUiStore((s) => s.setScrollOffset)
  const listRef = useListRef(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rowHeight = useViewportRowHeight()

  useEffect(() => {
    let scrollEl: HTMLElement | null = null
    let lastWrite = 0
    let restored = false
    let raf = 0

    const onScroll = () => {
      if (!scrollEl) return
      const now = Date.now()
      if (now - lastWrite < 200) return
      lastWrite = now
      setScrollOffset(scrollEl.scrollTop)
    }

    const tryAttach = () => {
      const el =
        listRef.current?.element ??
        (containerRef.current?.querySelector(
          '[role="list"]',
        ) as HTMLElement | null)
      if (!el) {
        raf = requestAnimationFrame(tryAttach)
        return
      }
      scrollEl = el
      if (!restored) {
        const offset = useUiStore.getState().scrollOffset
        if (offset > 0) el.scrollTop = offset
        restored = true
      }
      el.addEventListener('scroll', onScroll, { passive: true })
    }

    raf = requestAnimationFrame(tryAttach)

    return () => {
      cancelAnimationFrame(raf)
      if (scrollEl) scrollEl.removeEventListener('scroll', onScroll)
    }
  }, [listRef, setScrollOffset])

  return (
    <div ref={containerRef} className="h-full w-full">
      <List
        listRef={listRef}
        rowCount={total}
        rowHeight={rowHeight}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rowComponent={Row as any}
        rowProps={{}}
        overscanCount={6}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  )
}
