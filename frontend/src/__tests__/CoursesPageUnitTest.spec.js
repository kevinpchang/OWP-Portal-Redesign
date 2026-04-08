// Runs unit tests for the Courses Page
// To use: 
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/CoursesPageUnitTest.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect } from 'vitest'

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
      { invoicenum: '1', coursetitle: 'Drinking Water Specialist I' },
      { invoicenum: '1', coursetitle: null },
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
    expect(courseTitle).toBe('Drinking Water Specialist I')
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
const owtp3rd8th = 'owtp-3-8th-cvr.jpg'
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

// Unit test for filtering active enrollments
function getActiveEnrollments(enrollments) {
  return enrollments.filter((r) => r.statustxt === 'Enrolled')
}

describe('getActiveEnrollments', () => {
  it('filters only enrollments with statustxt "Enrolled"', () => {
    const enrollments = [
      { enrollid: 1, statustxt: 'Enrolled' },
      { enrollid: 2, statustxt: 'Complete' },
      { enrollid: 3, statustxt: 'Dropped' },
      { enrollid: 4, statustxt: 'Enrolled' },
    ]

    const activeEnrollments = getActiveEnrollments(enrollments)

    expect(activeEnrollments).toHaveLength(2)
    expect(activeEnrollments).toEqual([
      { enrollid: 1, statustxt: 'Enrolled' },
      { enrollid: 4, statustxt: 'Enrolled' },
    ])
  })

  it('returns an empty array if no enrollments are active', () => {
    const enrollments = [
      { enrollid: 1, statustxt: 'Complete' },
      { enrollid: 2, statustxt: 'Dropped' },
    ]

    const activeEnrollments = getActiveEnrollments(enrollments)

    expect(activeEnrollments).toEqual([])
  })
})

// Unit test for filtering completed enrollments
function getCompletedEnrollments(enrollments) {
  return enrollments.filter(
    (r) => r.statustxt === 'Complete' || r.statustxt === 'Dropped'
  )
}

describe('getCompletedEnrollments', () => {
  it('filters only enrollments with statustxt "Complete" or "Dropped"', () => {
    const enrollments = [
      { enrollid: 1, statustxt: 'Enrolled' },
      { enrollid: 2, statustxt: 'Complete' },
      { enrollid: 3, statustxt: 'Dropped' },
    ]

    const completedEnrollments = getCompletedEnrollments(enrollments)

    expect(completedEnrollments).toHaveLength(2)
    expect(completedEnrollments).toEqual([
      { enrollid: 2, statustxt: 'Complete' },
      { enrollid: 3, statustxt: 'Dropped' },
    ])
  })
})

// Unit test for calculating active course progress percentage
function getCourseProgress(sections) {
  const total = sections.length
  const graded = sections.filter(
    (s) => String(s.grade ?? '').trim() !== ''
  ).length

  return total === 0 ? '0%' : `${Math.round((graded / total) * 100)}%`
}

describe('getCourseProgress', () => {
  it('returns 60% if 3 out of 5 sections are graded', () => {
    const sections = [
      { grade: '100' },
      { grade: '90' },
      { grade: '80' },
      { grade: '' },
      { grade: null },
    ]

    const progress = getCourseProgress(sections)
    expect(progress).toBe('60%')
  })

  it('returns 0% if no sections are graded', () => {
    const sections = [
      { grade: '' },
      { grade: null },
      { grade: undefined },
    ]

    const progress = getCourseProgress(sections)
    expect(progress).toBe('0%')
  })

  it('returns 0% if there are no sections', () => {
    const sections = []

    const progress = getCourseProgress(sections)
    expect(progress).toBe('0%')
  })
})

// Unit test for completed course pass/fail 
function getCompletedCourseStatus(course) {
  if (course.statustxt === 'Dropped') {
    return {
      status: '',
      dropped: true,
    }
  }

  const grade = (course.grade || '').trim()

  return {
    status: grade === 'CR' ? 'Pass' : 'Fail',
    dropped: false,
  }
}

describe('getCompletedCourseStatus', () => {
  it('returns Pass when grade is CR', () => {
    const result = getCompletedCourseStatus({
      statustxt: 'Complete',
      grade: 'CR',
    })

    expect(result).toEqual({
      status: 'Pass',
      dropped: false,
    })
  })

  it('returns Fail when grade is not CR', () => {
    const result = getCompletedCourseStatus({
      statustxt: 'Complete',
      grade: 'NC',
    })

    expect(result).toEqual({
      status: 'Fail',
      dropped: false,
    })
  })

  it('returns dropped state when statustxt is Dropped', () => {
    const result = getCompletedCourseStatus({
      statustxt: 'Dropped',
      grade: '',
    })

    expect(result).toEqual({
      status: '',
      dropped: true,
    })
  })
})