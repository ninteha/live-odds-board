export function formatKickoff(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * Match minute for an in-play match: minutes elapsed since kickoff,
 * clamped to 1–90 so it makes sense for football-style displays.
 */
export function liveMinute(startsAt: number): number {
  const elapsedMs = Date.now() - startsAt
  if (elapsedMs <= 0) return 1
  return Math.min(90, Math.max(1, Math.floor(elapsedMs / 60_000) + 1))
}
