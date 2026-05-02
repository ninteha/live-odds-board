import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  Match,
  OddsFormat,
  Selection,
  SelectionKey,
} from '../types'

interface UiState {
  selections: Record<SelectionKey, Selection>
  oddsFormat: OddsFormat
  scrollOffset: number

  devPanelOpen: boolean
  intensity: number
  wsAlive: boolean
  renderCount: number

  toggleSelection: (
    match: Match,
    marketId: string,
    outcomeKey: string,
    currentPrice: number,
  ) => void
  clearSelections: () => void
  setOddsFormat: (f: OddsFormat) => void
  setScrollOffset: (n: number) => void
  setDevPanelOpen: (b: boolean) => void
  setIntensity: (n: number) => void
  setWsAlive: (b: boolean) => void
  bumpRenderCount: () => void
  resetRenderCount: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      selections: {},
      oddsFormat: 'decimal',
      scrollOffset: 0,

      devPanelOpen: false,
      intensity: 100,
      wsAlive: true,
      renderCount: 0,

      toggleSelection: (match, marketId, outcomeKey, currentPrice) => {
        const key = `${match.id}:${marketId}:${outcomeKey}`
        const existing = get().selections[key]
        if (existing) {
          const next = { ...get().selections }
          delete next[key]
          set({ selections: next })
          return
        }
        set((s) => ({
          selections: {
            ...s.selections,
            [key]: {
              key,
              priceAtSelect: currentPrice,
              matchId: match.id,
              marketId,
              outcomeKey,
              selectedAt: Date.now(),
            },
          },
        }))
      },
      clearSelections: () => set({ selections: {} }),
      setOddsFormat: (oddsFormat) => set({ oddsFormat }),
      setScrollOffset: (scrollOffset) => set({ scrollOffset }),
      setDevPanelOpen: (devPanelOpen) => set({ devPanelOpen }),
      setIntensity: (intensity) => set({ intensity }),
      setWsAlive: (wsAlive) => set({ wsAlive }),
      bumpRenderCount: () =>
        set((s) => ({ renderCount: s.renderCount + 1 })),
      resetRenderCount: () => set({ renderCount: 0 }),
    }),
    {
      name: 'odds-board:ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        selections: s.selections,
        oddsFormat: s.oddsFormat,
        scrollOffset: s.scrollOffset,
      }),
    },
  ),
)
