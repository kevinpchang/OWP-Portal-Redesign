// Runs integration tests for the Completed Course Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/CompletedCourseIntegrationTest.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CompletedCourse from '../pages/CompletedCourse.vue'
import * as api from '@/services/owpAPI'

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '456' },
  }),
}))

vi.mock('@/services/owpAPI', () => ({
  getEnrollmentRecord: vi.fn(),
  getCourseGrades: vi.fn(),
  getInvoices: vi.fn(),
  getInvoiceData: vi.fn(),
}))

describe('CompletedCourse', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ threads: [] }),
    })
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  function mountPage() {
    return mount(CompletedCourse, {
      global: {
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
          },
        },
      },
    })
  }

  it('loads and displays completed course summary information correctly', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Water Treatment Operations II',
        completedate: '2026-02-01',
        grade: 'CR',
        ceus: '4',
        contacthour: '40',
        owpabbr: 'WTPO2',
        editionid: '999',
      },
    })

    api.getCourseGrades.mockResolvedValue({
      response: [
        {
          examid: '1',
          ordinal: 1,
          examname: 'Chapter 1',
          attempted: '1',
          pct: '100',
          gradefraction: '10/10',
          gradedate: '2026-01-10',
          grade: '100',
        },
        {
          examid: '2',
          ordinal: 2,
          examname: 'Chapter 2',
          attempted: '1',
          pct: '90',
          gradefraction: '9/10',
          gradedate: '2026-01-11',
          grade: '90',
        },
      ],
    })

    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mountPage()
    await flushPromises()
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 1000))

    expect(wrapper.find('.course-title').text()).toContain('Water Treatment Operations II')
    expect(wrapper.text()).toContain('Status Date: 2026-02-01')
    expect(wrapper.text()).toContain('Final Grade: CR')
    expect(wrapper.text()).toContain('4.0')
    expect(wrapper.text()).toContain('40')
  })

  it('falls back to gradeAverage when record grade is missing', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Water Treatment Operations II',
        completedate: '2026-02-01',
        grade: '',
        ceus: '4',
        contacthour: '40',
        owpabbr: 'WTPO2',
        editionid: '999',
      },
    })

    api.getCourseGrades.mockResolvedValue({
      response: [
        {
          examid: '1',
          ordinal: 1,
          examname: 'Chapter 1',
          attempted: '1',
          pct: '100',
          gradefraction: '10/10',
          gradedate: '2026-01-10',
          grade: '100',
        },
        {
          examid: '2',
          ordinal: 2,
          examname: 'Chapter 2',
          attempted: '1',
          pct: '80',
          gradefraction: '8/10',
          gradedate: '2026-01-11',
          grade: '80',
        },
      ],
    })

    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mountPage()
    await flushPromises()
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 1000))

    expect(wrapper.text()).toContain('Final Grade: 90%')
  })

  it('loads and displays chapter progress correctly', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Water Treatment Operations II',
        completedate: '2026-02-01',
        grade: 'CR',
        ceus: '4',
        contacthour: '40',
        owpabbr: 'WTPO2',
        editionid: '999',
      },
    })

    api.getCourseGrades.mockResolvedValue({
      response: [
        {
          examid: '2',
          ordinal: 2,
          examname: 'Chapter 2',
          attempted: '1',
          pct: '90',
          gradefraction: '9/10',
          gradedate: '--',
          grade: '90',
        },
        {
          examid: '1',
          ordinal: 1,
          examname: 'Chapter 1',
          attempted: '1',
          pct: '100',
          gradefraction: '10/10',
          gradedate: '2026-01-10',
          grade: '100',
        },
      ],
    })

    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mountPage()
    await flushPromises()
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 1000))

    const rows = wrapper.findAll('.chapter-row')

    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain('Chapter 1')
    expect(rows[0].text()).toContain('2026-01-10')
    expect(rows[0].text()).toContain('100% (10/10)')

    expect(rows[1].text()).toContain('Chapter 2')
    expect(rows[1].text()).toContain('—')
    expect(rows[1].text()).toContain('90% (9/10)')
  })

  it('displays purchase history correctly', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Water Treatment Operations II',
        completedate: '2026-02-01',
        grade: 'CR',
        ceus: '4',
        contacthour: '40',
        owpabbr: 'WTPO2',
        editionid: '999',
      },
    })

    api.getCourseGrades
      .mockResolvedValueOnce({ response: [] })
      .mockResolvedValueOnce({ response: [] })

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

    const wrapper = mountPage()
    await flushPromises()
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 1000))

    const invoiceLinks = wrapper.findAll('.side-link')

    expect(invoiceLinks.some((item) => item.text().includes('Invoice: 1 - Course A'))).toBe(true)
    expect(invoiceLinks.some((item) => item.text().includes('Invoice: 2 - Course B'))).toBe(true)
  })

  it('shows empty chapter state when no chapter data exists', async () => {
    vi.useFakeTimers()

    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Water Treatment Operations II',
        completedate: '2026-02-01',
        grade: 'CR',
        ceus: '4',
        contacthour: '40',
        owpabbr: 'WTPO2',
        editionid: '999',
      },
    })

    api.getCourseGrades
      .mockResolvedValueOnce({ response: [] })
      .mockResolvedValueOnce({ response: [] })

    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mountPage()

    await flushPromises()
    await flushPromises()

    vi.advanceTimersByTime(1200)
    await flushPromises()

    expect(wrapper.text()).toContain('No chapter data available.')
    expect(wrapper.find('.donut-inner').text()).toContain('100%')

    wrapper.unmount()
    vi.useRealTimers()
  })

  it('shows error state when enrollment record fails to load', async () => {
    api.getEnrollmentRecord.mockRejectedValue(new Error('Failed to load completed course data'))
    api.getCourseGrades.mockResolvedValue({ response: [] })
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mountPage()
    await flushPromises()
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 1000))

    expect(wrapper.text()).toContain('Failed to load completed course data')
  })
})