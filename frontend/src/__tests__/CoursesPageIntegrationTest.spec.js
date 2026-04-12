// Runs integration tests for the Courses Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/CoursesPageIntegrationTest.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CoursesPage from '../pages/CoursesPage.vue'
import * as api from '@/services/owpAPI'

// Mock API service functions used by the Courses Page
vi.mock('@/services/owpAPI', () => ({
  getActiveEnrollment: vi.fn(),
  getCourseGrades: vi.fn(),
  getInvoices: vi.fn(),
  getInvoiceData: vi.fn(),
}))

describe('CoursesPage', () => {
  // Clears all previous mock calls and values before each test
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Active enrollment integration tests
  // Verifies active courses are filtered and rendered correctly
  // with title and expiration date information.
 
  it('loads and displays active enrollments correctly', async () => {
    api.getActiveEnrollment.mockResolvedValue({
      response: [
        {
          enrollid: 1,
          title: 'Course A',
          statustxt: 'Enrolled',
          expiredate: '2026-01-01',
          owpabbr: 'UM',
        },
        {
          enrollid: 2,
          title: 'Course B',
          statustxt: 'Dropped',
          expiredate: '2026-01-01',
          owpabbr: 'WTPO1',
        },
      ],
    })

    api.getCourseGrades.mockResolvedValue({
      response: [
        { grade: '100' },
        { grade: '100' },
        { grade: '' },
      ],
    })

    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    const activeCourses = wrapper.findAll('.active-card .course-row')

    expect(activeCourses).toHaveLength(1)
    expect(activeCourses[0].text()).toContain('Course A')
    expect(activeCourses[0].text()).toContain('2026-01-01')
    expect(activeCourses[0].text()).toContain('67%')
  })

  // Verifies the active enrollments section shows its empty state
  // when no active course data is returned.
  it('shows empty state when no active enrollments exist', async () => {
    api.getActiveEnrollment.mockResolvedValue({ response: [] })
    api.getCourseGrades.mockResolvedValue({ response: [] })
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    expect(wrapper.text()).toContain('No active enrollments.')
  })

  
  // Completed enrollment integration tests
  // Verifies completed and dropped courses render correctly in
  // the completed enrollments section.
 
  it('loads and displays completed enrollments correctly', async () => {
    api.getActiveEnrollment.mockResolvedValue({
      response: [
        {
          enrollid: 1,
          title: 'Course A',
          statustxt: 'Complete',
          grade: 'CR',
          owpabbr: 'UM',
        },
        {
          enrollid: 2,
          title: 'Course B',
          statustxt: 'Dropped',
          grade: '',
          owpabbr: 'WTPO1',
        },
      ],
    })

    api.getCourseGrades.mockResolvedValue({ response: [] })
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    const completedCourses = wrapper.findAll(
      '.tiles-container .course-card:nth-of-type(2) .course-row'
    )

    expect(completedCourses).toHaveLength(2)
    expect(completedCourses[0].text()).toContain('Course A')
    expect(completedCourses[0].text()).toContain('Pass')
    expect(completedCourses[1].text()).toContain('Course B')
    expect(completedCourses[1].text()).toContain('Dropped')
  })

  // Verifies the completed enrollments section shows its empty
  // state when no completed or dropped courses are returned.

  it('shows empty state when no completed enrollments exist', async () => {
    api.getActiveEnrollment.mockResolvedValue({
      response: [
        {
          enrollid: 1,
          title: 'Course A',
          statustxt: 'Enrolled',
          expiredate: '2026-01-01',
          owpabbr: 'UM',
        },
      ],
    })

    api.getCourseGrades.mockResolvedValue({ response: [] })
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    expect(wrapper.text()).toContain('No completed enrollments.')
  })

  // Recommended course integration tests
  // Verifies the recommended courses section shows its empty
  // state when no recommended courses are available.

  it('shows empty state for recommended courses', async () => {
    api.getActiveEnrollment.mockResolvedValue({ response: [] })
    api.getCourseGrades.mockResolvedValue({ response: [] })
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    expect(wrapper.text()).toContain('No Recommended Courses')
    expect(wrapper.text()).toContain('Browse Course Catalog')
  })

  // Purchase history integration tests
  // Verifies purchase history invoices render with the correct
  // invoice number and resolved course title.
  it('loads and displays purchase history correctly', async () => {
    api.getActiveEnrollment.mockResolvedValue({ response: [] })
    api.getCourseGrades.mockResolvedValue({ response: [] })

    api.getInvoices.mockResolvedValue({
      response: [
        { invoicenum: '1' },
        { invoicenum: '2' },
      ],
    })

    api.getInvoiceData.mockImplementation(async (invoicenum) => {
      if (invoicenum === '1') {
        return { response: [{ coursetitle: 'Course A' }] }
      }

      if (invoicenum === '2') {
        return { response: [{ coursetitle: 'Course B' }] }
      }

      return { response: [] }
    })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    const invoices = wrapper.findAll('.side-card:nth-of-type(2) .side-link')

    expect(invoices).toHaveLength(2)
    expect(invoices[0].text()).toContain('Invoice: 1 - Course A')
    expect(invoices[1].text()).toContain('Invoice: 2 - Course B')
  })

  // Verifies the purchase history section shows its empty state
  // when no invoices are returned.
  it('shows empty state when no purchase history exists', async () => {
    api.getActiveEnrollment.mockResolvedValue({ response: [] })
    api.getCourseGrades.mockResolvedValue({ response: [] })
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    expect(wrapper.text()).toContain('No purchase history available.')
  })

  // Messages integration tests
  // Verifies the messages section shows its default empty state
  // since messages currently load as an empty array.

  it('shows empty state for messages', async () => {
    api.getActiveEnrollment.mockResolvedValue({ response: [] })
    api.getCourseGrades.mockResolvedValue({ response: [] })
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    expect(wrapper.text()).toContain('No messages available.')
  })
})