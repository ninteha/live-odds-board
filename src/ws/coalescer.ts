import type { MatchPatch } from '../store/matchStore'

/**
 * Collects WS patches and flushes once per animation frame.
 * Last write wins per (matchId, marketId, outcomeKey) within a frame.
 */
export class Coalescer {
  private pending = new Map<string, MatchPatch>()
  private scheduled = false
  private readonly flush: (batch: MatchPatch[]) => void

  constructor(flush: (batch: MatchPatch[]) => void) {
    this.flush = flush
  }

  push(p: MatchPatch) {
    const key = `${p.matchId}:${p.marketId}:${p.outcomeKey}`
    this.pending.set(key, p)
    if (!this.scheduled) {
      this.scheduled = true
      const tick = () => this.tick()
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(tick)
      } else {
        setTimeout(tick, 16)
      }
    }
  }

  private tick() {
    const batch = Array.from(this.pending.values())
    this.pending.clear()
    this.scheduled = false
    if (batch.length) this.flush(batch)
  }
}
