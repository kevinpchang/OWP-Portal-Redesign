// Runs unit tests for the My Account Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/MyAccountPageUnitTest.spec.js
// To run with coverage: npm run test:front -- src/__tests__/MyAccountPageUnitTest.spec.js --coverage
// To run all frontend tests: npm run test:front

import { describe, it, expect } from 'vitest'

// Unit test for addressLine2 formatting
function safeTrim(value) {
  return String(value ?? '').trim()
}

function addressLine2(a) {
  const city = safeTrim(a?.hmcity)
  const state = safeTrim(a?.hmstate)
  const zip = safeTrim(a?.hmzip)

  const cityState = [city, state].filter(Boolean).join(', ')
  return [cityState, zip].filter(Boolean).join(' ').trim()
}

describe('addressLine2', () => {
  it('formats city, state, and zip correctly', () => {
    const account = {
      hmcity: 'Sacramento',
      hmstate: 'CA',
      hmzip: '95819',
    }

    expect(addressLine2(account)).toBe('Sacramento, CA 95819')
  })

  it('omits blank/null values safely', () => {
    const account = {
      hmcity: 'Sacramento',
      hmstate: null,
      hmzip: '95819',
    }

    expect(addressLine2(account)).toBe('Sacramento 95819')
  })

  it('returns empty string when all values are missing', () => {
    expect(addressLine2({})).toBe('')
  })
})

// Unit test for digitsOnly
function digitsOnly(value) {
  return String(value ?? '').replace(/\D/g, '')
}

describe('digitsOnly', () => {
  it('removes all non-digit characters', () => {
    expect(digitsOnly('(916)-555-1234')).toBe('9165551234')
  })

  it('returns empty string for nullish input', () => {
    expect(digitsOnly(null)).toBe('')
    expect(digitsOnly(undefined)).toBe('')
  })
})

// Unit test for phone display formatting
function formatPhoneDisplay(input) {
  const d = digitsOnly(input).slice(0, 10)
  const a = d.slice(0, 3)
  const b = d.slice(3, 6)
  const c = d.slice(6, 10)

  if (!d) return ''
  if (d.length < 4) return `(${a}`
  if (d.length < 7) return `(${a})-${b}`
  return `(${a})-${b}-${c}`
}

describe('formatPhoneDisplay', () => {
  it('formats a full 10-digit phone number', () => {
    expect(formatPhoneDisplay('9165551234')).toBe('(916)-555-1234')
  })

  it('formats partial phone input', () => {
    expect(formatPhoneDisplay('91655')).toBe('(916)-55')
  })

  it('returns empty string for empty input', () => {
    expect(formatPhoneDisplay('')).toBe('')
  })
})

// Unit test for splitting phone display into parts
function splitPhoneFromDisplay(display) {
  const d = digitsOnly(display)

  return {
    area: d.length >= 3 ? d.slice(0, 3) : null,
    local: d.length >= 10 ? d.slice(3, 10) : null,
  }
}

describe('splitPhoneFromDisplay', () => {
  it('extracts area code and local number from a formatted phone number', () => {
    expect(splitPhoneFromDisplay('(916)-555-1234')).toEqual({
      area: '916',
      local: '5551234',
    })
  })

  it('returns only area when input is incomplete', () => {
    expect(splitPhoneFromDisplay('(916)-55')).toEqual({
      area: '916',
      local: null,
    })
  })

  it('returns null values when no digits exist', () => {
    expect(splitPhoneFromDisplay('abc')).toEqual({
      area: null,
      local: null,
    })
  })
})

// Unit test for transcript preview filtering
function getTranscriptItems(enrollments) {
  const transcriptRows = enrollments.filter(
    (r) => r.statustxt === 'Complete' || r.statustxt === 'Dropped'
  )

  return transcriptRows.slice(0, 2).map((r) => ({
    key: r.enrollid,
    title: r.title || 'Course title unavailable',
    routeTo: '/Certificates',
  }))
}

describe('getTranscriptItems', () => {
  it('returns only Complete and Dropped enrollments, max 2', () => {
    const enrollments = [
      { enrollid: 1, title: 'Course A', statustxt: 'Enrolled' },
      { enrollid: 2, title: 'Course B', statustxt: 'Complete' },
      { enrollid: 3, title: 'Course C', statustxt: 'Dropped' },
      { enrollid: 4, title: 'Course D', statustxt: 'Complete' },
    ]

    expect(getTranscriptItems(enrollments)).toEqual([
      { key: 2, title: 'Course B', routeTo: '/Certificates' },
      { key: 3, title: 'Course C', routeTo: '/Certificates' },
    ])
  })

  it('uses fallback title when title is missing', () => {
    const enrollments = [
      { enrollid: 7, title: null, statustxt: 'Complete' },
    ]

    expect(getTranscriptItems(enrollments)).toEqual([
      {
        key: 7,
        title: 'Course title unavailable',
        routeTo: '/Certificates',
      },
    ])
  })
})

// Unit test for invoice name retrieval
function getInvoiceName(invoicedata, invoicenum) {
  const items = invoicedata[invoicenum] ?? []
  const match = items.find((item) => item?.coursetitle != null)
  return match?.coursetitle || 'Course title unavailable'
}

describe('getInvoiceName', () => {
  it('returns the first non-null course title for an invoice', () => {
    const invoicedata = {
      '1001': [
        { coursetitle: null },
        { coursetitle: 'Water Distribution Basics' },
      ],
    }

    expect(getInvoiceName(invoicedata, '1001')).toBe('Water Distribution Basics')
  })

  it('returns fallback text when invoice has no course title', () => {
    const invoicedata = {
      '1002': [
        { coursetitle: null },
        { coursetitle: null },
      ],
    }

    expect(getInvoiceName(invoicedata, '1002')).toBe('Course title unavailable')
  })
})