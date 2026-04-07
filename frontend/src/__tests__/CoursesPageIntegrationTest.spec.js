// Runs integration tests for the Courses Page
// To use:
// npm run test:front -- src/__tests__/CoursesPageIntegrationTest.spec.js

import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CoursesPage from '../pages/CoursesPage.vue'
import * as api from '@/services/owpAPI'

// Mock API
vi.mock('@/services/owpAPI', () => ({
  getActiveEnrollment: vi.fn(),
  getCourseGrades: vi.fn(),
  getInvoices: vi.fn(),
  getInvoiceData: vi.fn(),
}))

describe('CoursesPage', () => {

  // Test Active Enrollments rendering
  it('loads and displays active enrollments correctly', async () => {
    api.getActiveEnrollment.mockResolvedValue({
      response: [
        { enrollid: 1, title: 'Course A', statustxt: 'Enrolled', expiredate: '2026-01-01', owpabbr: 'UM' },
        { enrollid: 2, title: 'Course B', statustxt: 'Dropped', expiredate: '2026-01-01', owpabbr: 'WTPO1' },
      ]
    })

    api.getCourseGrades.mockResolvedValue({
      response: [
        { grade: '100' },
        { grade: '100' },
        { grade: '' },
      ]
    })

    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    const activeCourses = wrapper.findAll('.active-card .course-row')

    expect(activeCourses).toHaveLength(1)
    expect(activeCourses[0].text()).toContain('Course A')
    expect(activeCourses[0].text()).toContain('2026-01-01')
  })

  // Test Completed Enrollments rendering
  it('loads and displays completed enrollments correctly', async () => {
    api.getActiveEnrollment.mockResolvedValue({
      response: [
        { enrollid: 1, title: 'Course A', statustxt: 'Complete', grade: 'CR', owpabbr: 'UM' },
        { enrollid: 2, title: 'Course B', statustxt: 'Dropped', grade: '', owpabbr: 'WTPO1' },
      ]
    })

    api.getCourseGrades.mockResolvedValue({ response: [] })
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    const completedCourses = wrapper.findAll('.course-card:not(.active-card) .course-row')

    expect(completedCourses).toHaveLength(2)
    expect(completedCourses[0].text()).toContain('Course A')
    expect(completedCourses[0].text()).toContain('Pass')
    expect(completedCourses[1].text()).toContain('Dropped')
  })

  // Test Recommended Courses empty state
  it('shows empty state for recommended courses', async () => {
    api.getActiveEnrollment.mockResolvedValue({ response: [] })
    api.getCourseGrades.mockResolvedValue({ response: [] })
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    expect(wrapper.text()).toContain('No Recommended Courses')
  })

  // Test Purchase History rendering
  it('loads and displays purchase history correctly', async () => {
    api.getActiveEnrollment.mockResolvedValue({ response: [] })
    api.getCourseGrades.mockResolvedValue({ response: [] })

    api.getInvoices.mockResolvedValue({
      response: [
        { invoicenum: '1' },
        { invoicenum: '2' },
      ]
    })

    api.getInvoiceData.mockImplementation(async (invoicenum) => {
      if (invoicenum === '1') {
        return { response: [{ coursetitle: 'Course A' }] }
      }
      if (invoicenum === '2') {
        return { response: [{ coursetitle: 'Course B' }] }
      }
    })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    const invoices = wrapper.findAll('.side-link')

    expect(invoices).toHaveLength(2)
    expect(invoices[0].text()).toContain('Invoice: 1 - Course A')
    expect(invoices[1].text()).toContain('Invoice: 2 - Course B')
  })

  // Test empty active state
  it('shows empty state when no active enrollments exist', async () => {
    api.getActiveEnrollment.mockResolvedValue({ response: [] })
    api.getCourseGrades.mockResolvedValue({ response: [] })
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    expect(wrapper.text()).toContain('No active enrollments.')
  })

})