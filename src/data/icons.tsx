import {
  FaFutbol,
  FaBasketball,
  FaTableTennisPaddleBall,
  FaHockeyPuck,
  FaBaseballBatBall,
} from 'react-icons/fa6'
import type { Sport } from '../types'

interface SportMeta {
  Icon: typeof FaFutbol
  tone: string
}

const META: Record<Sport, SportMeta> = {
  football: { Icon: FaFutbol, tone: 'text-emerald-400' },
  basketball: { Icon: FaBasketball, tone: 'text-orange-400' },
  tennis: { Icon: FaTableTennisPaddleBall, tone: 'text-lime-300' },
  hockey: { Icon: FaHockeyPuck, tone: 'text-sky-300' },
  baseball: { Icon: FaBaseballBatBall, tone: 'text-amber-200' },
}

interface Props {
  sport: Sport
  className?: string
}

export function SportIcon({ sport, className }: Props) {
  const { Icon, tone } = META[sport]
  return (
    <div
      className={
        className ??
        'w-7 h-7 rounded-md bg-[var(--bg-cell)] border border-[var(--border)] flex items-center justify-center shrink-0'
      }
      aria-label={sport}
    >
      <Icon className={`w-3.5 h-3.5 ${tone}`} />
    </div>
  )
}
