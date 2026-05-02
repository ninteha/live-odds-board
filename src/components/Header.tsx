import { useUiStore } from '../store/uiStore'
import type { OddsFormat } from '../types'

const FORMATS: { key: OddsFormat; label: string }[] = [
  { key: 'decimal', label: 'DEC' },
  { key: 'fractional', label: 'FRAC' },
  { key: 'american', label: 'US' },
]

export function Header() {
  const oddsFormat = useUiStore((s) => s.oddsFormat)
  const setOddsFormat = useUiStore((s) => s.setOddsFormat)
  const selectionCount = useUiStore(
    (s) => Object.keys(s.selections).length,
  )
  const devPanelOpen = useUiStore((s) => s.devPanelOpen)
  const setDevPanelOpen = useUiStore((s) => s.setDevPanelOpen)

  return (
    <header className="h-14 sm:h-16 px-3 sm:px-5 flex items-center gap-2 sm:gap-4 border-b border-[var(--border)] shrink-0 bg-[var(--bg-surface)]">
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="w-7 h-7 rounded-md bg-[var(--accent)] flex items-center justify-center text-[var(--bg-base)] font-bold text-base shadow-[0_0_0_1px_rgba(245,180,0,0.35)]">
          O
        </div>
        <span className="hidden sm:inline font-bold tracking-wider uppercase text-sm whitespace-nowrap">
          Live Odds
        </span>
      </div>
      <span className="text-[12px] text-[var(--text-muted)] hidden md:inline whitespace-nowrap">
        10,000 matches · live updates
      </span>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-3 shrink-0">
        <div className="flex rounded-md border border-[var(--border-strong)] overflow-hidden bg-[var(--bg-cell)]">
          {FORMATS.map((f) => (
            <button
              key={f.key}
              onClick={() => setOddsFormat(f.key)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-semibold tracking-wider transition-colors duration-150 ${
                oddsFormat === f.key
                  ? 'bg-[var(--accent-bg)] text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-cell-hover)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {selectionCount > 0 && (
          <span className="px-2 py-1 rounded-md bg-[var(--accent-bg)] text-[var(--accent)] text-[10px] sm:text-[11px] font-semibold tabular-nums border border-[var(--accent-border)] whitespace-nowrap">
            <span className="sm:hidden">{selectionCount}</span>
            <span className="hidden sm:inline">{selectionCount} selected</span>
          </span>
        )}

        <button
          onClick={() => setDevPanelOpen(!devPanelOpen)}
          className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider rounded-md border transition-colors duration-150 whitespace-nowrap ${
            devPanelOpen
              ? 'border-[var(--accent-border)] bg-[var(--accent-bg)] text-[var(--accent)]'
              : 'border-[var(--border-strong)] text-[var(--text-secondary)] hover:bg-[var(--bg-cell-hover)]'
          }`}
        >
          Dev
        </button>
      </div>
    </header>
  )
}
