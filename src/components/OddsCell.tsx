import { FaCaretUp, FaCaretDown } from 'react-icons/fa6'
import { useUiStore } from '../store/uiStore'
import { formatOdds } from '../utils/formatOdds'
import { useFlash } from '../hooks/useFlash'
import type { Match, MarketStatus } from '../types'

interface Props {
  match: Match
  marketId: string
  status: MarketStatus
  outcomeKey: string
  outcomeLabel: string
  value: number
}

export function OddsCell({
  match,
  marketId,
  status,
  outcomeKey,
  outcomeLabel,
  value,
}: Props) {
  const oddsFormat = useUiStore((s) => s.oddsFormat)
  const selectionKey = `${match.id}:${marketId}:${outcomeKey}`
  const isSelected = useUiStore((s) => Boolean(s.selections[selectionKey]))
  const toggle = useUiStore((s) => s.toggleSelection)
  const flash = useFlash(value)

  const disabled = status !== 'open'

  const handleClick = () => {
    if (disabled) return
    toggle(match, marketId, outcomeKey, value)
  }

  let stateCls =
    'bg-[var(--bg-cell)] hover:bg-[var(--bg-cell-hover)] hover:border-[var(--border-strong)] text-[var(--odds-default)] border-[var(--border)]'
  if (isSelected) {
    stateCls =
      'bg-[var(--accent-bg)] border-[var(--accent-border)] text-[var(--accent)] shadow-[0_0_0_1px_var(--accent-border)]'
  } else if (flash === 'up') {
    stateCls =
      'bg-[var(--bg-up)] text-[var(--odds-up)] border-[rgba(74,222,128,0.5)]'
  } else if (flash === 'down') {
    stateCls =
      'bg-[var(--bg-down)] text-[var(--odds-down)] border-[rgba(248,113,113,0.5)]'
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      aria-label={`${outcomeLabel} ${formatOdds(value, oddsFormat)}`}
      className={[
        'relative flex flex-col items-center justify-center rounded-md',
        'flex-1 min-w-0 sm:flex-initial sm:min-w-[68px]',
        'h-11 px-2.5 text-[13.5px] font-semibold tabular-nums leading-none',
        'border transition-colors duration-200',
        stateCls,
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-1">
        {outcomeLabel}
      </span>
      {/* Reserved-slot icon prevents layout shift: always rendered, only visible when flashing. */}
      <span className="flex items-center gap-0.5">
        <span className="w-2.5 h-2.5 inline-flex items-center justify-center shrink-0">
          {flash === 'up' && (
            <FaCaretUp className="w-2.5 h-2.5 text-[var(--odds-up)]" />
          )}
          {flash === 'down' && (
            <FaCaretDown className="w-2.5 h-2.5 text-[var(--odds-down)]" />
          )}
        </span>
        {formatOdds(value, oddsFormat)}
      </span>
    </button>
  )
}
