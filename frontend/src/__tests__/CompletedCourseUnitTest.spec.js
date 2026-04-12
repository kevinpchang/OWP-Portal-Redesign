// Runs unit tests for the Completed Course Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/CompletedCourseUnitTest.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect } from 'vitest'

// Unit test for average percent completed calculation
function calcAveragePctCompleted(sections) {
  const nums = (Array.isArray(sections) ? sections : [])
    .filter(
      (s) =>
        String(s?.attempted) === '1' ||
        (s?.gradedate && s?.gradedate !== '--')
    )
    .map((s) => Number(s?.pct))
    .filter((n) => Number.isFinite(n))

  if (nums.length === 0) return '—'

  const avg = nums.reduce((a, b) => a + b, 0) / nums.length
  return `${Math.round(avg)}%`
}

describe('calcAveragePctCompleted', () => {
  it('returns the rounded average percent for attempted or graded sections', () => {
    const sections = [
      { attempted: '1', pct: '100' },
      { attempted: '0', gradedate: '2026-01-01', pct: '80' },
      { attempted: '0', gradedate: '--', pct: '50' },
    ]

    const result = calcAveragePctCompleted(sections)
    expect(result).toBe('90%')
  })

  it('returns em dash if there are no valid attempted or graded sections', () => {
    const sections = [
      { attempted: '0', gradedate: '--', pct: '100' },
      { attempted: '0', gradedate: '', pct: '80' },
    ]

    const result = calcAveragePctCompleted(sections)
    expect(result).toBe('—')
  })
})

// Unit test for invoice name retrieval
function getInvoiceName(invoicenum) {
  const items = invoicedata.value[invoicenum] ?? []
  const match = items.find((item) => item?.coursetitle != null)
  return match?.coursetitle || 'Course title unavailable'
}

const invoicedata = {
  value: {
    '1': [
      { invoicenum: '1', coursetitle: null },
      { invoicenum: '1', coursetitle: 'Water Treatment Operations II' },
    ],
    '2': [
      { invoicenum: '2', coursetitle: null },
      { invoicenum: '2', coursetitle: null },
    ],
  },
}

describe('getInvoiceName', () => {
  it('returns the correct course title for a given invoice number', () => {
    const courseTitle = getInvoiceName('1')
    expect(courseTitle).toBe('Water Treatment Operations II')
  })

  it('returns fallback text if no course title is found', () => {
    const courseTitle = getInvoiceName('2')
    expect(courseTitle).toBe('Course title unavailable')
  })
})

// Unit test for course image loading
function getCourseImage(owpabbr) {
  return courseImageMap[owpabbr] || null
}

const um3rd = 'um-3rd-cvr.jpg'
const wtpo1st7th = 'wtpo-1-7th-cvr.jpg'
const wtpo2nd7th = 'wtpo-2-7th-cvr.jpg'
const owtp1st8th = 'owtp-1-8th-cvr.jpg'
const owtp2nd8th = 'owtp-2-8th-cvr.jpg'
const owtp3rd8th = 'owtp-3rd-8th-cvr.jpg'
const MBR2nd = 'MBR-2nd-cvr.png'

const courseImageMap = {
  UM: um3rd,
  WTPO1: wtpo1st7th,
  WTPO2: wtpo2nd7th,
  OWTP1: owtp1st8th,
  OWTP2: owtp2nd8th,
  OWTP3: owtp3rd8th,
  MBR: MBR2nd,
}

describe('getCourseImage', () => {
  it('returns the correct image for the corresponding abbreviation', () => {
    expect(getCourseImage('UM')).toBe(um3rd)
    expect(getCourseImage('WTPO1')).toBe(wtpo1st7th)
    expect(getCourseImage('WTPO2')).toBe(wtpo2nd7th)
    expect(getCourseImage('OWTP1')).toBe(owtp1st8th)
    expect(getCourseImage('OWTP2')).toBe(owtp2nd8th)
    expect(getCourseImage('OWTP3')).toBe(owtp3rd8th)
    expect(getCourseImage('MBR')).toBe(MBR2nd)
  })

  it('returns null if no abbreviation matches', () => {
    expect(getCourseImage('UNKNOWN')).toBeNull()
  })
})

// Unit test for course completion percentage
function getCourseCompletion(sections) {
  const completedCount = sections.filter((s) => {
    const hasGradeDate = s?.gradedate && s?.gradedate !== '--'
    const hasGrade =
      s?.grade !== null && s?.grade !== undefined && s?.grade !== ''
    const attempted = String(s?.attempted) === '1'
    return hasGradeDate || hasGrade || attempted
  }).length

  return sections.length === 0
    ? 100
    : Math.round((completedCount / sections.length) * 100)
}

describe('getCourseCompletion', () => {
  it('returns 60 if 3 out of 5 sections are completed', () => {
    const sections = [
      { attempted: '1' },
      { gradedate: '2026-01-01' },
      { grade: '100' },
      { attempted: '0', gradedate: '--', grade: '' },
      { attempted: '0', gradedate: '--', grade: null },
    ]

    const completion = getCourseCompletion(sections)
    expect(completion).toBe(60)
  })

  it('returns 100 if there are no sections', () => {
    const sections = []

    const completion = getCourseCompletion(sections)
    expect(completion).toBe(100)
  })
})

// Unit test for CEU formatting
function getFormattedCeus(record) {
  const rawCeu = Number(record.ceus ?? record.ceu)
  return Number.isFinite(rawCeu)
    ? rawCeu.toFixed(1)
    : '—'
}

describe('getFormattedCeus', () => {
  it('returns CEUs formatted to one decimal place', () => {
    expect(getFormattedCeus({ ceus: '4' })).toBe('4.0')
    expect(getFormattedCeus({ ceu: '3.25' })).toBe('3.3')
  })

  it('returns em dash when CEUs are invalid', () => {
    expect(getFormattedCeus({ ceus: null })).toBe('—')
    expect(getFormattedCeus({ ceu: 'abc' })).toBe('—')
  })
})

// Unit test for chapter mapping and sorting
function getMappedChapters(sections) {
  return sections
    .slice()
    .sort((a, b) => Number(a?.ordinal ?? 0) - Number(b?.ordinal ?? 0))
    .map((s) => {
      const pctStr =
        s?.pct !== null && s?.pct !== undefined && s?.pct !== ''
          ? `${s.pct}%`
          : ''

      const fracStr = s?.gradefraction ?? ''

      let gradeDisplay = ''
      if (pctStr && fracStr) gradeDisplay = `${pctStr} (${fracStr})`
      else gradeDisplay = pctStr || fracStr || ''

      return {
        id: s?.examid ?? `${s?.ordinal ?? ''}-${s?.examname ?? ''}`,
        title: s?.examname || 'Untitled chapter',
        date: s?.gradedate && s?.gradedate !== '--' ? s.gradedate : '—',
        grade: gradeDisplay || '—',
      }
    })
}

describe('getMappedChapters', () => {
  it('sorts chapters by ordinal and maps display values correctly', () => {
    const sections = [
      {
        examid: '2',
        ordinal: 2,
        examname: 'Chapter Two',
        gradedate: '--',
        pct: '90',
        gradefraction: '9/10',
      },
      {
        examid: '1',
        ordinal: 1,
        examname: 'Chapter One',
        gradedate: '2026-01-05',
        pct: '100',
        gradefraction: '10/10',
      },
    ]

    const chapters = getMappedChapters(sections)

    expect(chapters[0]).toEqual({
      id: '1',
      title: 'Chapter One',
      date: '2026-01-05',
      grade: '100% (10/10)',
    })

    expect(chapters[1]).toEqual({
      id: '2',
      title: 'Chapter Two',
      date: '—',
      grade: '90% (9/10)',
    })
  })

  it('uses fallback values when chapter data is missing', () => {
    const sections = [
      {
        ordinal: 1,
        examname: '',
        gradedate: '--',
        pct: '',
        gradefraction: '',
      },
    ]

    const chapters = getMappedChapters(sections)

    expect(chapters[0]).toEqual({
      id: '1-',
      title: 'Untitled chapter',
      date: '—',
      grade: '—',
    })
  })
})

// Unit test for final grade fallback
function getFinalCourseGrade(courseGrade, gradeAverage) {
  if (courseGrade === '—' && gradeAverage !== '—') {
    return gradeAverage
  }
  return courseGrade
}

describe('getFinalCourseGrade', () => {
  it('uses gradeAverage when courseGrade is em dash', () => {
    expect(getFinalCourseGrade('—', '92%')).toBe('92%')
  })

  it('keeps the original courseGrade when it exists', () => {
    expect(getFinalCourseGrade('CR', '92%')).toBe('CR')
  })
})