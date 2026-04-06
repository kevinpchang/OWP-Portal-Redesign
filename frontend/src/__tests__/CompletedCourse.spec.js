// Runs unit tests for the Completed Course Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/CompletedCourse.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CompletedCourse from '../pages/CompletedCourse.vue'
import * as api from '@/services/owpAPI'

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: '1',
    },
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
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })
    api.getCourseGrades.mockResolvedValue({ response: [] })
  })

  it('getEnrollmentRecord loads completed course header data', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Operation of Wastewater Treatment Plants, Vol. 1',
        completedate: '2026-03-01',
        grade: 'CR',
        ceus: 3.0,
        contacthours: 45,
        owpabbr: 'OWTP1',
      },
    })

    const wrapper = mount(CompletedCourse)
    await flushPromises()

    expect(wrapper.text()).toContain('Operation of Wastewater Treatment Plants, Vol. 1')
    expect(wrapper.text()).toContain('Completed: 2026-03-01')
    expect(wrapper.text()).toContain('Final Grade: CR')
    expect(wrapper.text()).toContain('3.0')
    expect(wrapper.text()).toContain('45')
  })

  it('getCourseGrades loads chapter progress and chapter rows', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Water Distribution Basics',
        completedate: '2026-02-15',
        grade: 'A',
        ceus: 1.5,
        contacthours: 15,
        owpabbr: 'OWTP1',
      },
    })

    api.getCourseGrades.mockResolvedValue({
      response: [
        {
          examid: 1,
          ordinal: 2,
          examname: 'Chapter 2',
          gradedate: '2026-02-11',
          pct: 80,
          gradefraction: '8/10',
          attempted: '1',
          grade: 'A',
        },
        {
          examid: 2,
          ordinal: 1,
          examname: 'Chapter 1',
          gradedate: '2026-02-10',
          pct: 100,
          gradefraction: '10/10',
          attempted: '1',
          grade: 'A',
        },
      ],
    })

    const wrapper = mount(CompletedCourse)
    await flushPromises()

    expect(wrapper.text()).toContain('Water Distribution Basics')
    expect(wrapper.text()).toContain('Chapter 1')
    expect(wrapper.text()).toContain('Chapter 2')
    expect(wrapper.text()).toContain('2026-02-10')
    expect(wrapper.text()).toContain('100% (10/10)')
    expect(wrapper.text()).toContain('2026-02-11')
    expect(wrapper.text()).toContain('80% (8/10)')
  })

  it('shows calculated average when final grade is missing', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Treatment Plant Operations II',
        completedate: '2026-01-20',
        grade: '',
        ceus: 2.0,
        contacthours: 30,
        owpabbr: 'WTPO2',
      },
    })

    api.getCourseGrades.mockResolvedValue({
      response: [
        {
          examid: 1,
          ordinal: 1,
          examname: 'Chapter 1',
          gradedate: '2026-01-10',
          pct: 100,
          attempted: '1',
          grade: 'A',
        },
        {
          examid: 2,
          ordinal: 2,
          examname: 'Chapter 2',
          gradedate: '2026-01-12',
          pct: 50,
          attempted: '1',
          grade: 'C',
        },
      ],
    })

    const wrapper = mount(CompletedCourse)
    await flushPromises()

    expect(wrapper.text()).toContain('Treatment Plant Operations II')
    expect(wrapper.text()).toContain('Final Grade: 75%')
    expect(wrapper.text()).toContain('75%')
  })

  it('getInvoices and getInvoiceData load purchase history', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Membrane Bioreactors',
        completedate: '2026-02-01',
        grade: 'CR',
        ceus: 1.0,
        contacthours: 10,
        owpabbr: 'MBR',
      },
    })

    api.getInvoices.mockResolvedValue({
      response: [{ invoicenum: '1001' }],
    })

    api.getInvoiceData.mockResolvedValue({
      response: [
        { coursetitle: 'Membrane Bioreactors' },
      ],
    })

    const wrapper = mount(CompletedCourse)
    await flushPromises()

    expect(wrapper.text()).toContain('Invoice: 1001')
    expect(wrapper.text()).toContain('Membrane Bioreactors')
  })

  it('shows empty state when no chapter data is available', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Utility Management',
        completedate: '2026-02-01',
        grade: 'CR',
        ceus: 1.0,
        contacthours: 10,
        owpabbr: 'UM',
      },
    })

    api.getCourseGrades.mockResolvedValue({
      response: [],
    })

    const wrapper = mount(CompletedCourse)
    await flushPromises()

    expect(wrapper.text()).toContain('No chapter data available.')
  })

  it('shows error state when completed course data fails to load', async () => {
    api.getEnrollmentRecord.mockRejectedValue(new Error('Failed to load completed course data'))

    const wrapper = mount(CompletedCourse)
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to load completed course data')
    expect(wrapper.text()).toContain('We couldn’t load this chapter data right now.')
  })
})