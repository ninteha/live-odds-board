import { useMatchStore, type MatchPatch } from '../store/matchStore'
import { useUiStore } from '../store/uiStore'
import { Coalescer } from './coalescer'

const round2 = (n: number) => Math.round(n * 100) / 100

export function startMockWs() {
  const coalescer = new Coalescer((batch) => {
    useMatchStore.getState().applyBatch(batch)
  })

  let timer: ReturnType<typeof setInterval> | null = null

  function reschedule(intensity: number) {
    if (timer) clearInterval(timer)
    const ms = Math.max(10, Math.floor(1000 / intensity))
    timer = setInterval(() => {
      if (!useUiStore.getState().wsAlive) return
      const ids = useMatchStore.getState().ids
      const matches = useMatchStore.getState().matches
      const k = Math.max(1, Math.floor(intensity / 20))
      for (let i = 0; i < k; i++) {
        const id = ids[Math.floor(Math.random() * ids.length)]
        const match = matches[id]
        const market =
          match.markets[Math.floor(Math.random() * match.markets.length)]
        const outcomes = market.outcomes as Record<string, number>
        const keys = Object.keys(outcomes)
        const outcomeKey = keys[Math.floor(Math.random() * keys.length)]
        const current = outcomes[outcomeKey]
        const delta = (Math.random() * 0.3 - 0.15) * current
        const newPrice = Math.max(1.01, round2(current + delta))
        const patch: MatchPatch = {
          matchId: id,
          marketId: market.id,
          outcomeKey,
          newPrice,
        }
        coalescer.push(patch)
      }
    }, ms)
  }

  let lastIntensity = useUiStore.getState().intensity
  reschedule(lastIntensity)
  const unsub = useUiStore.subscribe((s) => {
    if (s.intensity !== lastIntensity) {
      lastIntensity = s.intensity
      reschedule(lastIntensity)
    }
  })

  return () => {
    if (timer) clearInterval(timer)
    unsub()
  }
}
