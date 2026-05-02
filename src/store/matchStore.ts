import { create } from 'zustand'
import type { Match, MarketStatus } from '../types'
import { generateMatches } from '../data/generateMatches'

export interface MatchPatch {
  matchId: string
  marketId: string
  outcomeKey: string
  newPrice: number
}

interface MatchState {
  matches: Record<string, Match>
  ids: string[]
  applyBatch: (patches: MatchPatch[]) => void
  setMarketStatus: (
    matchId: string,
    marketId: string,
    status: MarketStatus,
  ) => void
}

const initial = generateMatches(10000)
const matchesById: Record<string, Match> = {}
for (const m of initial) matchesById[m.id] = m

export const useMatchStore = create<MatchState>((set) => ({
  matches: matchesById,
  ids: initial.map((m) => m.id),
  applyBatch: (patches) =>
    set((state) => {
      if (patches.length === 0) return state
      const seen: Record<string, Match> = {}
      for (const p of patches) {
        const base = seen[p.matchId] ?? state.matches[p.matchId]
        if (!base) continue
        const markets = base.markets.map((m) => {
          if (m.id !== p.marketId) return m
          const outcomes = {
            ...(m.outcomes as Record<string, number>),
            [p.outcomeKey]: p.newPrice,
          }
          return { ...m, outcomes } as typeof m
        })
        seen[p.matchId] = { ...base, markets, lastUpdate: Date.now() }
      }
      const next = { ...state.matches }
      for (const id in seen) next[id] = seen[id]
      return { matches: next }
    }),
  setMarketStatus: (matchId, marketId, status) =>
    set((state) => {
      const base = state.matches[matchId]
      if (!base) return state
      const markets = base.markets.map((m) =>
        m.id === marketId ? ({ ...m, status } as typeof m) : m,
      )
      return {
        matches: { ...state.matches, [matchId]: { ...base, markets } },
      }
    }),
}))
