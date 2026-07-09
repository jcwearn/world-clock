import { DateTime } from 'luxon'

export type HourFormat = 12 | 24

export function localZone(): string {
  return DateTime.local().zoneName
}

export function isValidZone(zone: string): boolean {
  return DateTime.now().setZone(zone).isValid
}

export function formatTime(instant: number, zone: string, hourFormat: HourFormat): string {
  const dt = DateTime.fromMillis(instant, { zone })
  return hourFormat === 12 ? dt.toFormat('h:mm:ss a') : dt.toFormat('HH:mm:ss')
}

export function formatDate(instant: number, zone: string): string {
  return DateTime.fromMillis(instant, { zone }).toFormat('ccc, LLL d, yyyy')
}

export function zoneAbbreviation(instant: number, zone: string): string {
  return DateTime.fromMillis(instant, { zone }).toFormat('ZZZZ')
}

export function utcOffsetLabel(instant: number, zone: string): string {
  return `UTC${DateTime.fromMillis(instant, { zone }).toFormat('ZZ')}`
}

// Values for native <input type="date"> / <input type="time"> fields.
export function toDateInputValue(instant: number, zone: string): string {
  return DateTime.fromMillis(instant, { zone }).toFormat('yyyy-LL-dd')
}

export function toTimeInputValue(instant: number, zone: string): string {
  return DateTime.fromMillis(instant, { zone }).toFormat('HH:mm')
}

// Interpret a wall-clock date + time as a moment in the given zone.
// Returns null for unparseable input (e.g. an empty field).
export function instantFromInputValues(zone: string, date: string, time: string): number | null {
  const dt = DateTime.fromISO(`${date}T${time}`, { zone })
  return dt.isValid ? dt.toMillis() : null
}
