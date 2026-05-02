import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Coalescer } from '../src/ws/coalescer'
import type { MatchPatch } from '../src/store/matchStore'

describe('Coalescer', () => {
  let raf: ((cb: FrameRequestCallback) => number) | undefined
  beforeEach(() => {
    raf = globalThis.requestAnimationFrame
    let queued: FrameRequestCallback | null = null
    globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      queued = cb
      return 1 as unknown as number
    }) as typeof requestAnimationFrame
    ;(globalThis as Record<string, unknown>).__flushRAF = () => {
      const cb = queued
      queued = null
      if (cb) cb(performance.now())
    }
  })
  afterEach(() => {
    if (raf) globalThis.requestAnimationFrame = raf
  })

  it('flushes once per frame regardless of message count', () => {
    const flush = vi.fn()
    const c = new Coalescer(flush)
    const patches: MatchPatch[] = Array.from({ length: 50 }, (_, i) => ({
      matchId: `m${i}`,
      marketId: `m${i}:1X2`,
      outcomeKey: '1',
      newPrice: 2.0,
    }))
    for (const p of patches) c.push(p)
    expect(flush).not.toHaveBeenCalled()
    ;(globalThis as Record<string, () => void>).__flushRAF()
    expect(flush).toHaveBeenCalledTimes(1)
    expect(flush.mock.calls[0][0].length).toBe(50)
  })

  it('coalesces multiple writes to the same outcome to last-wins', () => {
    const flush = vi.fn()
    const c = new Coalescer(flush)
    c.push({
      matchId: 'm1',
      marketId: 'm1:1X2',
      outcomeKey: '1',
      newPrice: 2.0,
    })
    c.push({
      matchId: 'm1',
      marketId: 'm1:1X2',
      outcomeKey: '1',
      newPrice: 2.5,
    })
    ;(globalThis as Record<string, () => void>).__flushRAF()
    expect(flush.mock.calls[0][0]).toHaveLength(1)
    expect(flush.mock.calls[0][0][0].newPrice).toBe(2.5)
  })

  it('reschedules after a flush', () => {
    const flush = vi.fn()
    const c = new Coalescer(flush)
    c.push({ matchId: 'm1', marketId: 'm1:1X2', outcomeKey: '1', newPrice: 2.0 })
    ;(globalThis as Record<string, () => void>).__flushRAF()
    c.push({ matchId: 'm2', marketId: 'm2:1X2', outcomeKey: '1', newPrice: 1.5 })
    ;(globalThis as Record<string, () => void>).__flushRAF()
    expect(flush).toHaveBeenCalledTimes(2)
  })
})
