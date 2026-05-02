import { describe, it, expect } from 'vitest'
import { generateMatches } from '../src/data/generateMatches'
import { SPORTS } from '../src/data/teams'

describe('generateMatches', () => {
  it('produces requested count', () => {
    expect(generateMatches(10).length).toBe(10)
  })

  it('produces unique IDs', () => {
    const ids = new Set(generateMatches(100).map((m) => m.id))
    expect(ids.size).toBe(100)
  })

  it('home and away differ', () => {
    for (const m of generateMatches(200)) {
      expect(m.home).not.toBe(m.away)
    }
  })

  it('uses all sports', () => {
    const sports = new Set(generateMatches(500).map((m) => m.sport))
    for (const s of SPORTS) expect(sports.has(s)).toBe(true)
  })

  it('every match has 3 markets: 1X2, DC, OU', () => {
    for (const m of generateMatches(50)) {
      const types = m.markets.map((mk) => mk.type).sort()
      expect(types).toEqual(['1X2', 'DC', 'OU'])
    }
  })
})
