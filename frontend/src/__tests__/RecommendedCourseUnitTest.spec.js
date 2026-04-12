// Runs unit tests for the Recommended Course Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/RecommendedCourseUnitTest.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect } from 'vitest'

// Invoice name helper tests
// Verifies invoice numbers map to the correct course title and
// safely fall back when no course title exists.

function getInvoiceName(invoicenum) {
  const items = invoicedata.value[invoicenum] ?? []
  const match = items.find((item) => item?.coursetitle != null)
  return match?.coursetitle || 'Course title unavailable'
}

const invoicedata = {
  value: {
    '1': [
      { invoicenum: '1', coursetitle: null },
      { invoicenum: '1', coursetitle: 'Course A' },
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
    expect(courseTitle).toBe('Course A')
  })

  // Verifies fallback text is returned when no valid course title is found
  it('returns fallback text if no course title is found', () => {
    const courseTitle = getInvoiceName('2')
    expect(courseTitle).toBe('Course title unavailable')
  })
})

// Recommended course state helper tests
// Verifies the selected recommended course data is returned
// correctly, and fallback values are used when data is missing.

function getRecommendedCourseState(courseId, recommendedCourses) {
  const course = recommendedCourses.find((c) => c.id === courseId)

  if (!course) {
    return {
      courseTitle: 'No Recommended Course',
      courseDescription: 'There is no recommended course available at this time.',
      courseLongDescription: 'Browse the course catalog to explore available offerings.',
      chapters: ['No course content available.'],
    }
  }

  return {
    courseTitle: course.title || 'Course title unavailable',
    courseDescription: course.description || 'Description unavailable.',
    courseLongDescription: course.longDescription || 'No course description available.',
    chapters:
      Array.isArray(course.chapters) && course.chapters.length > 0
        ? course.chapters
        : ['No course content available.'],
  }
}

describe('getRecommendedCourseState', () => {
  // Verifies the helper returns the selected recommended course data when a matching id exists
  it('returns the selected recommended course data when a matching id exists', () => {
    const recommendedCourses = [
      {
        id: 1,
        title: 'Recommended Course One',
        description: 'Short description',
        longDescription: 'Long description here',
        chapters: ['Chapter 1', 'Chapter 2'],
      },
    ]

    const result = getRecommendedCourseState(1, recommendedCourses)

    expect(result).toEqual({
      courseTitle: 'Recommended Course One',
      courseDescription: 'Short description',
      courseLongDescription: 'Long description here',
      chapters: ['Chapter 1', 'Chapter 2'],
    })
  })

  // Verifies the helper returns the empty fallback state when no matching course exists
  it('returns fallback empty state when no matching course exists', () => {
    const recommendedCourses = [
      {
        id: 1,
        title: 'Recommended Course One',
        description: 'Short description',
        longDescription: 'Long description here',
        chapters: ['Chapter 1'],
      },
    ]

    const result = getRecommendedCourseState(99, recommendedCourses)

    expect(result).toEqual({
      courseTitle: 'No Recommended Course',
      courseDescription: 'There is no recommended course available at this time.',
      courseLongDescription: 'Browse the course catalog to explore available offerings.',
      chapters: ['No course content available.'],
    })
  })

  // Verifies fallback chapter content is used when a course has no chapters
  it('uses fallback chapter content when a course has no chapters', () => {
    const recommendedCourses = [
      {
        id: 2,
        title: 'Recommended Course Two',
        description: 'Another description',
        longDescription: 'Another long description',
        chapters: [],
      },
    ]

    const result = getRecommendedCourseState(2, recommendedCourses)

    expect(result).toEqual({
      courseTitle: 'Recommended Course Two',
      courseDescription: 'Another description',
      courseLongDescription: 'Another long description',
      chapters: ['No course content available.'],
    })
  })

  // Verifies fallback text is used when description fields are missing
  it('uses fallback text for missing description fields', () => {
    const recommendedCourses = [
      {
        id: 3,
        title: 'Recommended Course Three',
        description: '',
        longDescription: '',
        chapters: ['Intro'],
      },
    ]

    const result = getRecommendedCourseState(3, recommendedCourses)

    expect(result).toEqual({
      courseTitle: 'Recommended Course Three',
      courseDescription: 'Description unavailable.',
      courseLongDescription: 'No course description available.',
      chapters: ['Intro'],
    })
  })

  // Verifies fallback text is used when the course title is missing
  it('uses fallback title text when the course title is missing', () => {
    const recommendedCourses = [
      {
        id: 4,
        title: '',
        description: 'Short description',
        longDescription: 'Long description here',
        chapters: ['Chapter 1'],
      },
    ]

    const result = getRecommendedCourseState(4, recommendedCourses)

    expect(result).toEqual({
      courseTitle: 'Course title unavailable',
      courseDescription: 'Short description',
      courseLongDescription: 'Long description here',
      chapters: ['Chapter 1'],
    })
  })
})