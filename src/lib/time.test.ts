import { describe, expect, it } from 'vitest'
import {
  formatDate,
  formatTime,
  instantFromInputValues,
  isValidZone,
  toDateInputValue,
  toTimeInputValue,
  utcOffsetLabel,
  zoneAbbreviation,
} from './time'

const ET = 'America/New_York'
const IST = 'Asia/Kolkata'
const PT = 'America/Los_Angeles'

describe('instantFromInputValues', () => {
  it('interprets wall-clock input in the given zone', () => {
    const instant = instantFromInputValues(ET, '2026-07-09', '19:00')
    // 7pm EDT == 23:00 UTC
    expect(instant).toBe(Date.UTC(2026, 6, 9, 23, 0))
  })

  it('returns null for empty or malformed input', () => {
    expect(instantFromInputValues(ET, '', '19:00')).toBeNull()
    expect(instantFromInputValues(ET, '2026-07-09', '')).toBeNull()
    expect(instantFromInputValues(ET, 'not-a-date', '19:00')).toBeNull()
  })
})

describe('cross-zone conversion', () => {
  it('11pm ET is 8:30am the next day in IST', () => {
    const instant = instantFromInputValues(ET, '2026-07-09', '23:00')!
    expect(formatTime(instant, IST, 12)).toBe('8:30:00 AM')
    expect(formatDate(instant, IST)).toBe('Fri, Jul 10, 2026')
  })

  it('7pm ET is 4pm PT on the same day', () => {
    const instant = instantFromInputValues(ET, '2026-07-09', '19:00')!
    expect(formatTime(instant, PT, 24)).toBe('16:00:00')
    expect(formatDate(instant, PT)).toBe('Thu, Jul 9, 2026')
  })
})

describe('DST handling', () => {
  it('uses the correct ET offset on either side of the spring-forward boundary', () => {
    // US DST began 2026-03-08 02:00 ET
    const before = instantFromInputValues(ET, '2026-03-07', '12:00')!
    const after = instantFromInputValues(ET, '2026-03-08', '12:00')!
    expect(utcOffsetLabel(before, ET)).toBe('UTC-05:00')
    expect(utcOffsetLabel(after, ET)).toBe('UTC-04:00')
    // IST has no DST; the same two instants keep a fixed offset
    expect(utcOffsetLabel(before, IST)).toBe('UTC+05:30')
    expect(utcOffsetLabel(after, IST)).toBe('UTC+05:30')
  })

  it('resolves a nonexistent wall-clock time (spring-forward gap) to a real instant', () => {
    // 02:30 on 2026-03-08 does not exist in ET; luxon shifts it forward
    const instant = instantFromInputValues(ET, '2026-03-08', '02:30')
    expect(instant).not.toBeNull()
    expect(formatTime(instant!, ET, 24)).toBe('03:30:00')
  })
})

describe('formatting helpers', () => {
  const instant = instantFromInputValues(ET, '2026-07-09', '19:05')!

  it('formats 12h and 24h time', () => {
    expect(formatTime(instant, ET, 12)).toBe('7:05:00 PM')
    expect(formatTime(instant, ET, 24)).toBe('19:05:00')
  })

  it('round-trips date/time input values', () => {
    expect(toDateInputValue(instant, ET)).toBe('2026-07-09')
    expect(toTimeInputValue(instant, ET)).toBe('19:05')
  })

  it('names the zone', () => {
    expect(zoneAbbreviation(instant, ET)).toBe('EDT')
  })
})

describe('isValidZone', () => {
  it('accepts IANA zones and rejects junk', () => {
    expect(isValidZone(IST)).toBe(true)
    expect(isValidZone('Not/A_Zone')).toBe(false)
    expect(isValidZone('')).toBe(false)
  })
})
