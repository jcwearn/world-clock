import { describe, expect, it } from 'vitest'
import {
  defaultLabelFor,
  loadSettings,
  newClock,
  saveSettings,
  STORAGE_KEY,
  type Settings,
  type StorageLike,
} from './settings'

function memoryStorage(initial?: string): StorageLike {
  const store = new Map<string, string>()
  if (initial !== undefined) store.set(STORAGE_KEY, initial)
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => void store.set(key, value),
  }
}

describe('defaultLabelFor', () => {
  it('uses the city part of the zone id with spaces', () => {
    expect(defaultLabelFor('America/New_York')).toBe('New York')
    expect(defaultLabelFor('Asia/Kolkata')).toBe('Kolkata')
    expect(defaultLabelFor('UTC')).toBe('UTC')
  })
})

describe('loadSettings', () => {
  it('defaults to a single clock in the given zone when storage is empty', () => {
    const settings = loadSettings(memoryStorage(), 'Asia/Kolkata')
    expect(settings.clocks).toHaveLength(1)
    expect(settings.clocks[0].timezone).toBe('Asia/Kolkata')
    expect(settings.clocks[0].label).toBe('Kolkata')
    expect(settings.hourFormat).toBe(12)
  })

  it('round-trips through save and load', () => {
    const storage = memoryStorage()
    const settings: Settings = {
      clocks: [
        newClock('America/New_York', 'Eastern'),
        newClock('Asia/Kolkata', 'Wedding venue'),
        newClock('America/Los_Angeles'),
      ],
      hourFormat: 24,
    }
    saveSettings(storage, settings)
    expect(loadSettings(storage)).toEqual(settings)
  })

  it('falls back to defaults on corrupt JSON', () => {
    const settings = loadSettings(memoryStorage('{not json'), 'UTC')
    expect(settings.clocks[0].timezone).toBe('UTC')
  })

  it('falls back to defaults on valid JSON with the wrong shape', () => {
    expect(loadSettings(memoryStorage('42'), 'UTC').clocks).toHaveLength(1)
    expect(
      loadSettings(memoryStorage('{"clocks":"nope"}'), 'UTC').clocks,
    ).toHaveLength(1)
  })

  it('drops clocks with invalid timezones and keeps the rest', () => {
    const stored: Settings = {
      clocks: [
        newClock('America/New_York'),
        { id: 'x', label: 'Broken', timezone: 'Not/A_Zone' },
      ],
      hourFormat: 12,
    }
    const settings = loadSettings(
      memoryStorage(JSON.stringify(stored)),
      'UTC',
    )
    expect(settings.clocks).toHaveLength(1)
    expect(settings.clocks[0].timezone).toBe('America/New_York')
  })

  it('falls back to defaults when no stored clock is valid', () => {
    const stored = { clocks: [{ id: 'x', label: 1, timezone: 'UTC' }], hourFormat: 24 }
    const settings = loadSettings(memoryStorage(JSON.stringify(stored)), 'UTC')
    expect(settings.clocks).toHaveLength(1)
    expect(settings.clocks[0].label).toBe('UTC')
  })

  it('normalizes an unknown hourFormat to 12', () => {
    const stored = { clocks: [newClock('UTC')], hourFormat: 'sundial' }
    const settings = loadSettings(memoryStorage(JSON.stringify(stored)))
    expect(settings.hourFormat).toBe(12)
  })
})
