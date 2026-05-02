import type { Match, Market } from '../types'
import { SPORTS, TEAMS_BY_SPORT } from './teams'

const rand = (lo: number, hi: number) => Math.random() * (hi - lo) + lo
const randInt = (lo: number, hi: number) => Math.floor(rand(lo, hi))
const round2 = (n: number) => Math.round(n * 100) / 100

function makeMarkets(matchId: string): Market[] {
  return [
    {
      id: `${matchId}:1X2`,
      type: '1X2',
      status: 'open',
      outcomes: {
        '1': round2(rand(1.3, 5.5)),
        X: round2(rand(2.4, 5.0)),
        '2': round2(rand(1.3, 5.5)),
      },
    },
    {
      id: `${matchId}:DC`,
      type: 'DC',
      status: 'open',
      outcomes: {
        '1X': round2(rand(1.1, 1.9)),
        '12': round2(rand(1.1, 1.6)),
        X2: round2(rand(1.1, 1.9)),
      },
    },
    {
      id: `${matchId}:OU`,
      type: 'OU',
      status: 'open',
      line: 2.5,
      outcomes: {
        over: round2(rand(1.6, 2.4)),
        under: round2(rand(1.6, 2.4)),
      },
    },
  ]
}

export function generateMatches(n = 10000): Match[] {
  const out: Match[] = []
  const now = Date.now()
  for (let i = 0; i < n; i++) {
    const sport = SPORTS[i % SPORTS.length]
    const pool = TEAMS_BY_SPORT[sport]
    const home = pool[randInt(0, pool.length)]
    let away = pool[randInt(0, pool.length)]
    while (away === home) away = pool[randInt(0, pool.length)]
    const id = `m${i}`
    out.push({
      id,
      sport,
      home,
      away,
      // For live matches, "start time" is in the recent past (1 min – 90 min ago).
      startsAt: now - randInt(60_000, 90 * 60_000),
      isLive: true,
      score: { home: randInt(0, 5), away: randInt(0, 5) },
      markets: makeMarkets(id),
      lastUpdate: now,
    })
  }
  return out
}
