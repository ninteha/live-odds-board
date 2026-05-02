export type Sport = 'football' | 'basketball' | 'tennis' | 'hockey' | 'baseball'

export type MarketStatus = 'open' | 'suspended' | 'closed'

export type Market =
  | {
      id: string
      type: '1X2'
      status: MarketStatus
      outcomes: { '1': number; X: number; '2': number }
    }
  | {
      id: string
      type: 'DC'
      status: MarketStatus
      outcomes: { '1X': number; '12': number; X2: number }
    }
  | {
      id: string
      type: 'OU'
      status: MarketStatus
      line: number
      outcomes: { over: number; under: number }
    }

export interface Match {
  id: string
  sport: Sport
  home: string
  away: string
  startsAt: number
  isLive: boolean
  score: { home: number; away: number }
  markets: Market[]
  lastUpdate: number
}

export type SelectionKey = string

export interface Selection {
  key: SelectionKey
  priceAtSelect: number
  matchId: string
  marketId: string
  outcomeKey: string
  selectedAt: number
}

export type OddsFormat = 'decimal' | 'fractional' | 'american'
