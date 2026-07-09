import { defaultLabelFor } from '@/lib/settings'
import { utcOffsetLabel } from '@/lib/time'

export interface TimezoneOption {
  id: string
  label: string
  region: string
  offset: string
}

export function timezoneOptions(): TimezoneOption[] {
  const now = Date.now()
  return Intl.supportedValuesOf('timeZone')
    .map((id) => ({
      id,
      label: defaultLabelFor(id),
      region: id.includes('/') ? id.slice(0, id.indexOf('/')) : '',
      offset: utcOffsetLabel(now, id),
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}
