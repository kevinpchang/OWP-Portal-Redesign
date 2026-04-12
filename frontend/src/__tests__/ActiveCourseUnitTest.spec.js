// Runs unit tests for the Active Course Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/ActiveCourseUnitTest.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect } from 'vitest'

// Average percent completed helper tests
// Verifies the average percentage is calculated correctly for
// attempted or graded sections, and safely falls back when no
// valid data exists.

function calcAveragePctCompleted(sections) {
  const nums = (Array.isArray(sections) ? sections : [])
    .filter(
      (s) =>
        String(s?.attempted) === '1' ||
        (s?.gradedate && s.gradedate !== '--')
    )
    .map((s) => Number(s?.pct))
    .filter((n) => Number.isFinite(n))

  if (nums.length === 0) return '—'

  const avg = nums.reduce((a, b) => a + b, 0) / nums.length
  return `${Math.round(avg)}%`
}

describe('calcAveragePctCompleted', () => {
  // Verifies the helper returns the rounded average percent for valid attempted or graded sections
  it('returns the rounded average percent for attempted or graded sections', () => {
    const sections = [
      { attempted: '1', pct: '100' },
      { attempted: '0', gradedate: '2026-01-01', pct: '80' },
      { attempted: '0', gradedate: '--', pct: '50' },
    ]

    const result = calcAveragePctCompleted(sections)
    expect(result).toBe('90%')
  })

  // Verifies the helper returns an em dash when no valid attempted or graded sections exist
  it('returns em dash if there are no valid attempted or graded sections', () => {
    const sections = [
      { attempted: '0', gradedate: '--', pct: '100' },
      { attempted: '0', gradedate: '', pct: '80' },
    ]

    const result = calcAveragePctCompleted(sections)
    expect(result).toBe('—')
  })

  // Verifies the helper safely returns an em dash when the input is not an array
  it('returns em dash if the input is not an array', () => {
    const result = calcAveragePctCompleted(null)
    expect(result).toBe('—')
  })
})

// Invoice name helper tests
// Verifies invoice numbers map to the correct course title and
// safely fall back when no title exists.

function getInvoiceName(invoicenum) {
  const items = invoicedata.value[invoicenum] ?? []
  const match = items.find((item) => item?.coursetitle != null)
  return match?.coursetitle || 'Course title unavailable'
}

const invoicedata = {
  value: {
    '1': [
      { invoicenum: '1', coursetitle: null },
      { invoicenum: '1', coursetitle: 'Water Treatment Operations I' },
    ],
    '2': [
      { invoicenum: '2', coursetitle: null },
      { invoicenum: '2', coursetitle: null },
    ],
  },
}

describe('getInvoiceName', () => {
  // Verifies the helper returns the correct course title for a matching invoice number
  it('returns the correct course title for a given invoice number', () => {
    const courseTitle = getInvoiceName('1')
    expect(courseTitle).toBe('Water Treatment Operations I')
  })

  // Verifies fallback text is returned when no valid course title is found
  it('returns fallback text if no course title is found', () => {
    const courseTitle = getInvoiceName('2')
    expect(courseTitle).toBe('Course title unavailable')
  })
})

// Course image helper tests
// Verifies each course abbreviation maps to the correct image,
// and unknown abbreviations return null.

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
  // Verifies valid course abbreviations map to the correct image file
  it('returns the correct image for the corresponding abbreviation', () => {
    expect(getCourseImage('UM')).toBe(um3rd)
    expect(getCourseImage('WTPO1')).toBe(wtpo1st7th)
    expect(getCourseImage('WTPO2')).toBe(wtpo2nd7th)
    expect(getCourseImage('OWTP1')).toBe(owtp1st8th)
    expect(getCourseImage('OWTP2')).toBe(owtp2nd8th)
    expect(getCourseImage('OWTP3')).toBe(owtp3rd8th)
    expect(getCourseImage('MBR')).toBe(MBR2nd)
  })

  // Verifies unknown abbreviations safely return null
  it('returns null if no abbreviation matches', () => {
    expect(getCourseImage('UNKNOWN')).toBeNull()
  })
})

// Course completion helper tests
// Verifies overall course completion percentage is calculated
// correctly from attempted, graded, or dated sections.

function getCourseCompletion(sections) {
  const completedCount = sections.filter((s) => {
    const hasGradeDate = s?.gradedate && s.gradedate !== '--'
    const hasGrade =
      s?.grade !== null && s?.grade !== undefined && s?.grade !== ''
    const attempted = String(s?.attempted) === '1'
    return hasGradeDate || hasGrade || attempted
  }).length

  return sections.length === 0
    ? 0
    : Math.round((completedCount / sections.length) * 100)
}

describe('getCourseCompletion', () => {
  // Verifies the helper returns the correct completion percentage when some sections are complete
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

  // Verifies the helper returns 0 when no sections are completed
  it('returns 0 if there are no completed sections', () => {
    const sections = [
      { attempted: '0', gradedate: '--', grade: '' },
      { attempted: '0', gradedate: '--', grade: null },
    ]

    const completion = getCourseCompletion(sections)
    expect(completion).toBe(0)
  })

  // Verifies the helper returns 0 when the section list is empty
  it('returns 0 if there are no sections', () => {
    const sections = []

    const completion = getCourseCompletion(sections)
    expect(completion).toBe(0)
  })
})


// Chapter mapping helper tests
// Verifies chapter data is sorted by ordinal and mapped into
// the correct display format for title, date, and grade.

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
        title: s?.examname || 'Untitled chapter',
        date: s?.gradedate && s.gradedate !== '--' ? s.gradedate : '',
        grade: gradeDisplay,
      }
    })
}

describe('getMappedChapters', () => {
  // Verifies chapters are sorted by ordinal and display values are mapped correctly
  it('sorts chapters by ordinal and maps display values correctly', () => {
    const sections = [
      {
        ordinal: 2,
        examname: 'Chapter Two',
        gradedate: '--',
        pct: '90',
        gradefraction: '9/10',
      },
      {
        ordinal: 1,
        examname: 'Chapter One',
        gradedate: '2026-01-05',
        pct: '100',
        gradefraction: '10/10',
      },
    ]

    const chapters = getMappedChapters(sections)

    expect(chapters[0]).toEqual({
      title: 'Chapter One',
      date: '2026-01-05',
      grade: '100% (10/10)',
    })

    expect(chapters[1]).toEqual({
      title: 'Chapter Two',
      date: '',
      grade: '90% (9/10)',
    })
  })

  // Verifies fallback values are used when chapter fields are missing
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
      title: 'Untitled chapter',
      date: '',
      grade: '',
    })
  })
})