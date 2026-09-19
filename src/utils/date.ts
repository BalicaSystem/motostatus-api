export const BRAZIL_TIME_ZONE = 'America/Fortaleza'

export function getTodayInTimeZone(timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

export function getTodayInBrazil(): string {
  return getTodayInTimeZone(BRAZIL_TIME_ZONE)
}