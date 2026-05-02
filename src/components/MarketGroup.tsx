import { OddsCell } from './OddsCell'
import type { Market, Match } from '../types'

const LABELS: Record<string, Record<string, string>> = {
  '1X2': { '1': '1', X: 'X', '2': '2' },
  DC: { '1X': '1X', '12': '12', X2: 'X2' },
  OU: { over: 'O', under: 'U' },
}

const HEADERS: Record<string, string> = {
  '1X2': '1X2',
  DC: 'DC',
  OU: 'O/U 2.5',
}

export function MarketGroup({
  match,
  market,
}: {
  match: Match
  market: Market
}) {
  const labels = LABELS[market.type]
  const entries = Object.entries(
    market.outcomes as Record<string, number>,
  ) as [string, number][]

  return (
    <div className="flex flex-col gap-1">
      <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-1">
        {HEADERS[market.type]}
      </div>
      <div className="flex gap-1">
        {entries.map(([key, value]) => (
          <OddsCell
            key={key}
            match={match}
            marketId={market.id}
            status={market.status}
            outcomeKey={key}
            outcomeLabel={labels[key] ?? key}
            value={value}
          />
        ))}
      </div>
    </div>
  )
}
