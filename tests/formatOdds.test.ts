import { describe, it, expect } from 'vitest'
import { formatOdds } from '../src/utils/formatOdds'

describe('formatOdds', () => {
  it('decimal: passthrough rounded to 2dp', () => {
    expect(formatOdds(1.85, 'decimal')).toBe('1.85')
    expect(formatOdds(2.5, 'decimal')).toBe('2.50')
  })

  it('fractional: 1.85 -> 17/20', () => {
    expect(formatOdds(1.85, 'fractional')).toBe('17/20')
  })

  it('fractional: 3.0 -> 2/1', () => {
    expect(formatOdds(3.0, 'fractional')).toBe('2/1')
  })

  it('american: 2.0 -> +100', () => {
    expect(formatOdds(2.0, 'american')).toBe('+100')
  })

  it('american: 1.5 -> -200', () => {
    expect(formatOdds(1.5, 'american')).toBe('-200')
  })

  it('american: 3.0 -> +200', () => {
    expect(formatOdds(3.0, 'american')).toBe('+200')
  })
})
