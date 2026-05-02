import { memo } from 'react'
import type { RowComponentProps } from 'react-window'
import { useMatchStore } from '../store/matchStore'
import { useUiStore } from '../store/uiStore'
import { MarketGroup } from './MarketGroup'
import { SportIcon } from '../data/icons'
import { formatKickoff, liveMinute } from '../utils/formatTime'

function RowImpl({ index, style }: RowComponentProps<Record<string, never>>) {
  const id = useMatchStore((s) => s.ids[index])
  const match = useMatchStore((s) => s.matches[id])

  // Render-counter probe for the dev panel.
  useUiStore.getState().bumpRenderCount()

  if (!match) return null

  const zebra =
    index % 2 === 0
      ? 'bg-[var(--bg-surface)]'
      : 'bg-[var(--bg-surface-alt)]'

  const minute = match.isLive ? liveMinute(match.startsAt) : null

  return (
    <div
      style={style}
      className={`${zebra} flex flex-col sm:flex-row items-stretch border-b border-[var(--border)] hover:bg-[var(--bg-cell)] transition-colors`}
    >
      <div className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 w-full sm:w-[280px] md:w-[300px] lg:w-[320px] shrink-0">
        <SportIcon sport={match.sport} />

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 leading-tight pb-1 border-b border-[var(--border)]">
            <span className="truncate font-semibold text-[13px] sm:text-[13.5px] text-[var(--text-primary)]">
              {match.home}
            </span>
            <span className="shrink-0 tabular-nums font-bold text-[14px] sm:text-[15px] text-[var(--text-primary)]">
              {match.score.home}
            </span>
          </div>
          <div className="flex items-baseline gap-2 leading-tight pt-1">
            <span className="truncate font-semibold text-[13px] sm:text-[13.5px] text-[var(--text-primary)]">
              {match.away}
            </span>
            <span className="shrink-0 tabular-nums font-bold text-[14px] sm:text-[15px] text-[var(--text-primary)]">
              {match.score.away}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 text-[11px] leading-none flex-wrap">
            {match.isLive && (
              <>
                <span className="text-[var(--live-red)] font-semibold flex items-center tracking-wider">
                  <span className="live-dot" />
                  LIVE
                  <span className="ml-1.5 tabular-nums text-[var(--text-secondary)] font-medium">
                    {minute}'
                  </span>
                </span>
                <span className="text-[var(--text-muted)]">•</span>
              </>
            )}
            <span className="tabular-nums text-[var(--text-muted)] uppercase tracking-wider">
              {formatKickoff(match.startsAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="border-l border-[var(--border)] my-3 hidden sm:block" />

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 sm:items-center px-3 sm:px-4 pb-3 sm:pb-0 sm:flex-1 min-w-0 sm:overflow-hidden">
        {match.markets.map((m) => (
          <div key={m.id} className="shrink-0">
            <MarketGroup match={match} market={m} />
          </div>
        ))}
      </div>
    </div>
  )
}

export const Row = memo(RowImpl)
