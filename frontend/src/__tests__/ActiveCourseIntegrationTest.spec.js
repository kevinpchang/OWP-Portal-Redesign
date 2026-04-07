// Runs integration tests for the Active Course Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/ActiveCourseIntegrationTest.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ActiveCourse from '../pages/ActiveCourse.vue'
import * as api from '@/services/owpAPI'

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '123' },
  }),
}))

vi.mock('@/services/owpAPI', () => ({
  getEnrollmentRecord: vi.fn(),
  getCourseGrades: vi.fn(),
  getInvoices: vi.fn(),
  getInvoiceData: vi.fn(),
}))

describe('ActiveCourse', () => {
  it('loads and displays course summary information correctly', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Water Treatment Operations I',
        expiredate: '2026-12-31',
        completedate: '2026-01-01',
        ceus: '4.5',
        contacthour: '45',
        extendeligible: '1',
        owpabbr: 'WTPO1',
        editionid: '999',
      },
    })

    api.getCourseGrades.mockResolvedValue({
      response: [
        { ordinal: 1, examname: 'Chapter 1', attempted: '1', pct: '100', gradefraction: '10/10', gradedate: '2026-01-10', grade: '100' },
        { ordinal: 2, examname: 'Chapter 2', attempted: '1', pct: '80', gradefraction: '8/10', gradedate: '2026-01-11', grade: '80' },
      ],
    })

    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(ActiveCourse)
    await flushPromises()

    expect(wrapper.find('.course-title').text()).toContain('Water Treatment Operations I')
    expect(wrapper.text()).toContain('Expires: 2026-12-31')
    expect(wrapper.text()).toContain('Completed: 2026-01-01')
    expect(wrapper.text()).toContain('4.5')
    expect(wrapper.text()).toContain('45')
    expect(wrapper.find('.extend-button').exists()).toBe(true)
  })

  it('loads and displays chapter progress correctly', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Water Treatment Operations I',
        expiredate: '2026-12-31',
        completedate: '2026-01-01',
        ceus: '4.5',
        contacthour: '45',
        extendeligible: '0',
        owpabbr: 'WTPO1',
        editionid: '999',
      },
    })

    api.getCourseGrades.mockResolvedValue({
      response: [
        { ordinal: 2, examname: 'Chapter 2', attempted: '0', pct: '90', gradefraction: '9/10', gradedate: '--', grade: '' },
        { ordinal: 1, examname: 'Chapter 1', attempted: '1', pct: '100', gradefraction: '10/10', gradedate: '2026-01-10', grade: '100' },
      ],
    })

    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(ActiveCourse)
    await flushPromises()

    const rows = wrapper.findAll('.chapter-row')

    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain('Chapter 1')
    expect(rows[0].text()).toContain('2026-01-10')
    expect(rows[0].text()).toContain('100% (10/10)')

    expect(rows[1].text()).toContain('Chapter 2')
    expect(rows[1].text()).toContain('Start online exam')
    expect(rows[1].text()).toContain('90% (9/10)')
  })

  it('displays purchase history correctly', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Water Treatment Operations I',
        expiredate: '2026-12-31',
        completedate: '2026-01-01',
        ceus: '4.5',
        contacthour: '45',
        extendeligible: '0',
        owpabbr: 'WTPO1',
        editionid: '999',
      },
    })

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
    })

    const wrapper = mount(ActiveCourse)
    await flushPromises()

    const invoiceLinks = wrapper.findAll('.side-link')

    expect(invoiceLinks.some((item) => item.text().includes('Invoice: 1 - Course A'))).toBe(true)
    expect(invoiceLinks.some((item) => item.text().includes('Invoice: 2 - Course B'))).toBe(true)
  })

  it('shows empty chapter state when no chapter data exists', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Water Treatment Operations I',
        expiredate: '2026-12-31',
        completedate: '2026-01-01',
        ceus: '4.5',
        contacthour: '45',
        extendeligible: '0',
        owpabbr: 'WTPO1',
        editionid: '999',
      },
    })

    api.getCourseGrades.mockResolvedValue({ response: [] })
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(ActiveCourse)
    await flushPromises()

    expect(wrapper.text()).toContain('No chapter data available.')
  })

  it('shows error state when enrollment record fails to load', async () => {
    api.getEnrollmentRecord.mockRejectedValue(new Error('Failed to load active course data'))
    api.getCourseGrades.mockResolvedValue({ response: [] })
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(ActiveCourse)
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to load active course data')
  })
})