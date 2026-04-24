// Runs unit tests for the Courses Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/CoursesPageUnitTest.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect, vi } from 'vitest'

// Unit test for getActiveEnrollments function filtering enrollments only with statustxt "Enrolled"
function getActiveEnrollments(enrollments) {
  return enrollments.filter(e => e.statustxt === 'Enrolled')
}

describe('getActiveEnrollments', () => {
  it('filters only enrollments with statustxt "Enrolled"', () => {
    const enrollments = [
      { enrollid: 1, statustxt: 'Enrolled' },
      { enrollid: 2, statustxt: 'Dropped' },
      { enrollid: 3, statustxt: 'Enrolled' },
    ]
    
    const activeEnrollments = getActiveEnrollments(enrollments)

    expect(activeEnrollments).toHaveLength(2)
    expect(activeEnrollments).toEqual([
      { enrollid: 1, statustxt: 'Enrolled' },
      { enrollid: 3, statustxt: 'Enrolled' },
    ])
  })

  it('returns an empty array if no enrollments have statustxt "Enrolled"', () => {
    const enrollments = [
      { enrollid: 1, statustxt: 'Dropped' },
      { enrollid: 2, statustxt: 'Dropped' },
    ]
    
    const activeEnrollments = getActiveEnrollments(enrollments)

    expect(activeEnrollments).toHaveLength(0)
    expect(activeEnrollments).toEqual([])
  })
})

// Unit test for couurse image loading
function getCourseImage(owpabbr) {
  return courseImageMap[owpabbr] || null;
}


const um3rd = 'um-3rd-cvr.jpg'
const wtpo1st7th = 'wtpo-1-7th-cvr.jpg'
const wtpo2nd7th = 'wtpo-2-7th-cvr.jpg'
const owtp1st8th = 'owtp-1-8th-cvr.jpg'
const owtp2nd8th = 'owtp-2-8th-cvr.jpg'
const owtp3rd8th = 'owtp-3rd-8th-cvr.jpg'
const MBR2nd = 'MBR-2nd-cvr.png'

const courseImageMap = {
  'UM': um3rd,
  'WTPO1': wtpo1st7th,
  'WTPO2': wtpo2nd7th,
  'OWTP1': owtp1st8th,
  'OWTP2': owtp2nd8th,
  'OWTP3': owtp3rd8th,
  'MBR': MBR2nd,
}

describe('getCourseImage', () => {
  it('returns the correct image to the corresponding abbreviation', () => {
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

// Unit test for calculating course progress percentage

function getCourseCompletion(enrollid) {
  const sections = grades.value[enrollid] ?? []
  const completed = sections?.filter((section) => section.grade != null).length
  return Math.round((completed / sections.length) * 100)
}

const grades = {
      value: {
        '1': [
          { grade: '100' },
          { grade: '100' },
          { grade: '100' },
          { grade: null },
          { grade: null }
        ],
        '2': [
          { grade: null },
          { grade: null },
          { grade: null }
        ]
      }
    }

describe('getCourseCompletion', () => {
  it('returns 60% if 3 out of 5 sections are completed', () => {
    const enrollid = '1'

    const completion = getCourseCompletion(enrollid)

    expect(completion).toBe(60) // 3 out of 5 sections completed, so 60%
  })

  it('returns 0% if no sections are completed', () => {
    const enrollid = '2'

    const completion = getCourseCompletion(enrollid)

    expect(completion).toBe(0) // No sections completed, so 0%
  })
})

// Unit test for invoice name retrieval
function getInvoiceName(invoicenum) {
  const item = invoicedata.value[invoicenum] ?? []
  const data = item?.find((item) => item.coursetitle != null)
  return data?.coursetitle || 'Invalid Invoice Number, Refresh Page'
}

const invoicedata = {
      value: {
        '1': [
          { invoicenum: '1', coursetitle: null },
          { invoicenum: '1', coursetitle: 'Course A' },
          { invoicenum: '1', coursetitle: null }        
        ],
        '2': [
          { invoicenum: '2', coursetitle: null },
          { invoicenum: '2', coursetitle: null },
          { invoicenum: '2', coursetitle: null }        
        ]
      }
    }

describe('getInvoiceName', () => {
  it('returns the correct course title for a given invoice number', () => {
    const invoicenum = '1'

    const courseTitle = getInvoiceName(invoicenum)
    expect(courseTitle).toBe('Course A')
  })

  it('returns an error message if no course title is found for the given invoice number', () => {
    const invoicenum = '2'

    const courseTitle = getInvoiceName(invoicenum)
    expect(courseTitle).toBe('Invalid Invoice Number, Refresh Page')
  })
})