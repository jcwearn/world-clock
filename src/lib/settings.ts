import { isValidZone, localZone, type HourFormat } from '@/lib/time'

export interface ClockConfig {
  id: string
  label: string
  timezone: string
}

export interface Settings {
  clocks: ClockConfig[]
  hourFormat: HourFormat
}

export const STORAGE_KEY = 'world-clock:v1'

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export function defaultLabelFor(timezone: string): string {
  const city = timezone.split('/').pop() ?? timezone
  return city.replaceAll('_', ' ')
}

export function newClock(timezone: string, label?: string): ClockConfig {
  return {
    id: crypto.randomUUID(),
    label: label ?? defaultLabelFor(timezone),
    timezone,
  }
}

export function defaultSettings(zone: string = localZone()): Settings {
  return { clocks: [newClock(zone)], hourFormat: 12 }
}

function parseClock(value: unknown): ClockConfig | null {
  if (typeof value !== 'object' || value === null) return null
  const { id, label, timezone } = value as Record<string, unknown>
  if (typeof id !== 'string' || typeof label !== 'string') return null
  if (typeof timezone !== 'string' || !isValidZone(timezone)) return null
  return { id, label, timezone }
}

export function loadSettings(storage: StorageLike, zone?: string): Settings {
  const raw = storage.getItem(STORAGE_KEY)
  if (raw === null) return defaultSettings(zone)
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return defaultSettings(zone)
    const { clocks, hourFormat } = parsed as Record<string, unknown>
    if (!Array.isArray(clocks)) return defaultSettings(zone)
    const valid = clocks
      .map(parseClock)
      .filter((clock): clock is ClockConfig => clock !== null)
    if (valid.length === 0) return defaultSettings(zone)
    return { clocks: valid, hourFormat: hourFormat === 24 ? 24 : 12 }
  } catch {
    return defaultSettings(zone)
  }
}

export function saveSettings(storage: StorageLike, settings: Settings): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(settings))
}
