import { useEffect, useState } from 'react'
import { useUiStore } from '../store/uiStore'

export function DevPanel() {
  const open = useUiStore((s) => s.devPanelOpen)
  const setOpen = useUiStore((s) => s.setDevPanelOpen)
  const intensity = useUiStore((s) => s.intensity)
  const setIntensity = useUiStore((s) => s.setIntensity)
  const wsAlive = useUiStore((s) => s.wsAlive)
  const setWsAlive = useUiStore((s) => s.setWsAlive)
  const clearSelections = useUiStore((s) => s.clearSelections)

  const [rendersPerSec, setRendersPerSec] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      const c = useUiStore.getState().renderCount
      setRendersPerSec(c)
      useUiStore.getState().resetRenderCount()
    }, 1000)
    return () => clearInterval(id)
  }, [])

  if (!open) return null

  return (
    <div className="fixed bottom-4 right-4 w-80 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-2xl p-4 text-[12px]">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold uppercase tracking-wider text-[var(--text-primary)]">
          Dev Panel
        </span>
        <button
          onClick={() => setOpen(false)}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-base leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <label className="block mb-3">
        <span className="text-[var(--text-muted)] block mb-1 text-[11px] uppercase tracking-wider">
          Intensity:{' '}
          <span className="text-[var(--text-primary)] font-bold tabular-nums">
            {intensity}
          </span>{' '}
          upd/s
        </span>
        <input
          type="range"
          min={1}
          max={1000}
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full accent-[var(--accent)]"
        />
      </label>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded bg-[var(--bg-cell)] p-2">
          <div className="text-[10px] uppercase text-[var(--text-muted)] tracking-wider">
            Renders/sec
          </div>
          <div className="text-xl font-bold tabular-nums">
            {rendersPerSec}
          </div>
        </div>
        <div className="rounded bg-[var(--bg-cell)] p-2">
          <div className="text-[10px] uppercase text-[var(--text-muted)] tracking-wider">
            WS
          </div>
          <div
            className={`text-xl font-bold ${
              wsAlive
                ? 'text-[var(--odds-up)]'
                : 'text-[var(--odds-down)]'
            }`}
          >
            {wsAlive ? 'LIVE' : 'KILLED'}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setWsAlive(!wsAlive)}
          className="flex-1 px-3 py-1.5 rounded border border-[var(--border-strong)] hover:bg-[var(--bg-cell-hover)] text-[11px] font-semibold tracking-wider uppercase"
        >
          {wsAlive ? 'Kill WS' : 'Resume'}
        </button>
        <button
          onClick={clearSelections}
          className="flex-1 px-3 py-1.5 rounded border border-[var(--border-strong)] hover:bg-[var(--bg-cell-hover)] text-[11px] font-semibold tracking-wider uppercase"
        >
          Clear sel.
        </button>
      </div>
    </div>
  )
}
