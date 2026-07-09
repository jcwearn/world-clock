import { describe, expect, it } from 'vitest'
import { canonicalZoneId, timezoneOptions } from './timezones'

describe('canonicalZoneId', () => {
  it('maps CLDR legacy ids to modern IANA names', () => {
    // WebKit's Intl.supportedValuesOf returns these legacy ids on iOS/macOS
    expect(canonicalZoneId('Asia/Calcutta')).toBe('Asia/Kolkata')
    expect(canonicalZoneId('Europe/Kiev')).toBe('Europe/Kyiv')
    expect(canonicalZoneId('Asia/Saigon')).toBe('Asia/Ho_Chi_Minh')
  })

  it('leaves modern ids untouched', () => {
    expect(canonicalZoneId('America/New_York')).toBe('America/New_York')
    expect(canonicalZoneId('Asia/Kolkata')).toBe('Asia/Kolkata')
  })
})

describe('timezoneOptions', () => {
  const options = timezoneOptions()
  const ids = options.map((option) => option.id)

  it('always offers the modern id regardless of what the engine lists', () => {
    expect(ids).toContain('Asia/Kolkata')
    expect(ids).not.toContain('Asia/Calcutta')
  })

  it('contains no duplicate ids', () => {
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps both names searchable for renamed zones', () => {
    const kolkata = options.find((option) => option.id === 'Asia/Kolkata')
    expect(kolkata).toBeDefined()
    expect(kolkata!.search).toContain('Kolkata')
    // When the engine reported the legacy id, the old name stays searchable
    if (kolkata!.search.includes('Calcutta')) {
      expect(kolkata!.label).toBe('Kolkata')
    }
  })
})
