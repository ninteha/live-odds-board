import type { OddsFormat } from '../types'

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

function toFractional(decimal: number): string {
  const numerator = Math.round((decimal - 1) * 100)
  const denominator = 100
  const d = gcd(Math.max(1, numerator), denominator)
  return `${numerator / d}/${denominator / d}`
}

function toAmerican(decimal: number): string {
  if (decimal >= 2) {
    return `+${Math.round((decimal - 1) * 100)}`
  }
  return `${Math.round(-100 / (decimal - 1))}`
}

export function formatOdds(decimal: number, fmt: OddsFormat): string {
  switch (fmt) {
    case 'decimal':
      return decimal.toFixed(2)
    case 'fractional':
      return toFractional(decimal)
    case 'american':
      return toAmerican(decimal)
  }
}
