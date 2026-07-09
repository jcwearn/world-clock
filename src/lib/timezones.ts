import { defaultLabelFor } from '@/lib/settings'
import { isValidZone, utcOffsetLabel } from '@/lib/time'

// CLDR-canonical ids some engines (notably WebKit on iOS/macOS) return from
// Intl.supportedValuesOf for zones IANA has since renamed; map to the modern
// primary name so the picker is consistent across browsers.
const LEGACY_ZONE_IDS: Record<string, string> = {
  'Africa/Asmera': 'Africa/Asmara',
  'America/Godthab': 'America/Nuuk',
  'Asia/Calcutta': 'Asia/Kolkata',
  'Asia/Katmandu': 'Asia/Kathmandu',
  'Asia/Rangoon': 'Asia/Yangon',
  'Asia/Saigon': 'Asia/Ho_Chi_Minh',
  'Europe/Kiev': 'Europe/Kyiv',
  'Pacific/Ponape': 'Pacific/Pohnpei',
  'Pacific/Truk': 'Pacific/Chuuk',
}

export function canonicalZoneId(zone: string): string {
  const modern = LEGACY_ZONE_IDS[zone]
  return modern !== undefined && isValidZone(modern) ? modern : zone
}

export interface TimezoneOption {
  id: string
  label: string
  region: string
  offset: string
  // Haystack for the picker's text filter; includes the legacy id (e.g.
  // "Calcutta") so searches for either name match.
  search: string
}

export function timezoneOptions(): TimezoneOption[] {
  const now = Date.now()
  const byId = new Map<string, TimezoneOption>()
  for (const raw of Intl.supportedValuesOf('timeZone')) {
    const id = canonicalZoneId(raw)
    if (byId.has(id)) continue
    const label = defaultLabelFor(id)
    byId.set(id, {
      id,
      label,
      region: id.includes('/') ? id.slice(0, id.indexOf('/')) : '',
      offset: utcOffsetLabel(now, id),
      search: raw === id ? `${label} ${id}` : `${label} ${id} ${raw}`,
    })
  }
  return [...byId.values()].sort((a, b) => a.label.localeCompare(b.label))
}
