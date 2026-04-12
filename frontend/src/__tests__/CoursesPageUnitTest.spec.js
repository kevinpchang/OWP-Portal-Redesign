// Runs unit tests for the Courses Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/CoursesPageUnitTest.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect } from 'vitest'


// Invoice name helper tests
// Verifies invoice numbers map to the correct course title
// and fall back safely when no title is found.

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
  // Verifies the helper returns the first valid course title for a matching invoice number
  it('returns the correct course title for a given invoice number', () => {
    const courseTitle = getInvoiceName('1')
    expect(courseTitle).toBe('Drinking Water Specialist I')
  })

  // Verifies fallback text is returned when no valid course title exists
  it('returns fallback text if no course title is found', () => {
    const courseTitle = getInvoiceName('2')
    expect(courseTitle).toBe('Course title unavailable')
  })
})

// Course image tests
// Verifies each course abbreviation loads the correct image,
// and unknown abbreviations return null.

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

// Active enrollment tests
// Verifies only currently enrolled courses are included in
// the active enrollments list.

function getActiveEnrollments(enrollments) {
  return enrollments.filter((r) => r.statustxt === 'Enrolled')
}

describe('getActiveEnrollments', () => {
  // Verifies only enrollments marked as Enrolled are returned
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

  // Verifies an empty array is returned when there are no active enrollments
  it('returns an empty array if no enrollments are active', () => {
    const enrollments = [
      { enrollid: 1, statustxt: 'Complete' },
      { enrollid: 2, statustxt: 'Dropped' },
    ]

    const activeEnrollments = getActiveEnrollments(enrollments)

    expect(activeEnrollments).toEqual([])
  })
})

// Completed enrollment tests
// Verifies completed and dropped courses are grouped into the
// completed enrollments section.

function getCompletedEnrollments(enrollments) {
  return enrollments.filter(
    (r) => r.statustxt === 'Complete' || r.statustxt === 'Dropped'
  )
}

describe('getCompletedEnrollments', () => {
  // Verifies only Complete and Dropped enrollments are returned
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

  // Verifies an empty array is returned when there are no completed or dropped enrollments
  it('returns an empty array if no enrollments are completed or dropped', () => {
    const enrollments = [
      { enrollid: 1, statustxt: 'Enrolled' },
      { enrollid: 2, statustxt: 'Enrolled' },
    ]

    const completedEnrollments = getCompletedEnrollments(enrollments)

    expect(completedEnrollments).toEqual([])
  })
})


// Active course tests
// Verifies the progress percentage is calculated correctly
// based on how many sections have grades.


function getCourseProgress(sections) {
  const total = sections.length
  const graded = sections.filter(
    (s) => String(s.grade ?? '').trim() !== ''
  ).length

  return total === 0 ? '0%' : `${Math.round((graded / total) * 100)}%`
}

describe('getCourseProgress', () => {
  // Verifies progress is calculated correctly when some sections are graded
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

  // Verifies 0% is returned when no sections are graded
  it('returns 0% if no sections are graded', () => {
    const sections = [
      { grade: '' },
      { grade: null },
      { grade: undefined },
    ]

    const progress = getCourseProgress(sections)
    expect(progress).toBe('0%')
  })

  // Verifies 0% is returned safely when the section list is empty
  it('returns 0% if there are no sections', () => {
    const sections = []

    const progress = getCourseProgress(sections)
    expect(progress).toBe('0%')
  })
})

// Completed course tests
// Verifies completed courses display Pass or Fail correctly 
// and dropped courses are handled separately.

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
  // Verifies a completed course with grade CR is marked as Pass
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

  // Verifies a completed course with a non-CR grade is marked as Fail
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

  // Verifies dropped courses return a dropped state instead of Pass/Fail
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