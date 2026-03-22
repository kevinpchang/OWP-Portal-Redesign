// Runs unit tests for the Active Course Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/ActiveCourse.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ActiveCourse from '../pages/ActiveCourse.vue'
import * as api from '@/services/owpAPI.js'

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '123' },
  }),
}))

vi.mock('@/services/owpAPI.js', () => ({
  getEnrollmentRecord: vi.fn(),
  getCourseGrades: vi.fn(),
  getInvoices: vi.fn(),
  getInvoiceData: vi.fn(),
}))

describe('ActiveCourse', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()

    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })
    api.getCourseGrades.mockResolvedValue({ response: [] })
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('loads and displays active course summary data', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Water Distribution Basics',
        expiredate: '2026-12-31',
        completedate: '—',
        ceus: '3.0',
        contacthour: '30',
        extendeligible: '1',
        owpabbr: 'OWTP1',
        editionid: '999',
      },
    })

    api.getCourseGrades.mockResolvedValue({
      response: [
        {
          ordinal: 2,
          examname: 'Chapter 2',
          gradedate: '--',
          pct: '',
          gradefraction: '',
          attempted: '0',
          grade: '',
        },
        {
          ordinal: 1,
          examname: 'Chapter 1',
          gradedate: '2026-03-01',
          pct: '90',
          gradefraction: '9/10',
          attempted: '1',
          grade: 'A',
        },
      ],
    })

    const wrapper = mount(ActiveCourse, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    await flushPromises()
    vi.runAllTimers()
    await flushPromises()

    expect(wrapper.text()).toContain('Water Distribution Basics')
    expect(wrapper.text()).toContain('Expires: 2026-12-31')
    expect(wrapper.text()).toContain('Completed: —')
    expect(wrapper.text()).toContain('3.0')
    expect(wrapper.text()).toContain('30')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('90%')
    expect(wrapper.find('.extend-button').exists()).toBe(true)
  })

  it('loads chapter progress and formats chapter rows correctly', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Treatment Plant Operations I',
        expiredate: '2026-12-31',
        completedate: '—',
        ceus: '4.0',
        contacthours: '40',
        extendeligible: '0',
        owpabbr: 'OWTP1',
      },
    })

    api.getCourseGrades.mockResolvedValue({
      response: [
        {
          ordinal: 2,
          examname: 'Disinfection',
          gradedate: '--',
          pct: '',
          gradefraction: '',
          attempted: '0',
          grade: '',
        },
        {
          ordinal: 1,
          examname: 'Introduction',
          gradedate: '2026-02-10',
          pct: '85',
          gradefraction: '17/20',
          attempted: '1',
          grade: 'B',
        },
      ],
    })

    const wrapper = mount(ActiveCourse, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    await flushPromises()
    vi.runAllTimers()
    await flushPromises()

    const chapterTitles = wrapper.findAll('.chapter-title').map((node) => node.text())
    expect(chapterTitles).toEqual(['Introduction', 'Disinfection'])

    expect(wrapper.text()).toContain('85% (17/20)')
    expect(wrapper.text()).toContain('2026-02-10')
    expect(wrapper.text()).toContain('Start online exam')
  })

  it('falls back to editionId when enrollId grades return empty', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Membrane Bioreactor',
        expiredate: '2026-11-30',
        completedate: '—',
        ceus: '2.5',
        contacthour: '25',
        extendeligible: '0',
        owpabbr: 'MBR',
        editionid: '777',
      },
    })

    api.getCourseGrades
      .mockResolvedValueOnce({ response: [] })
      .mockResolvedValueOnce({
        response: [
          {
            ordinal: 1,
            examname: 'Module 1',
            gradedate: '2026-01-20',
            pct: '100',
            gradefraction: '10/10',
            attempted: '1',
            grade: 'A',
          },
        ],
      })

    const wrapper = mount(ActiveCourse, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    await flushPromises()
    vi.runAllTimers()
    await flushPromises()

    expect(api.getCourseGrades).toHaveBeenCalledTimes(2)
    expect(api.getCourseGrades).toHaveBeenNthCalledWith(1, '123')
    expect(api.getCourseGrades).toHaveBeenNthCalledWith(2, '777')
    expect(wrapper.text()).toContain('Module 1')
    expect(wrapper.text()).toContain('100%')
  })

  it('shows empty chapter state when no chapter data is available', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Utility Management',
        expiredate: '2026-10-01',
        completedate: '—',
        ceus: '1.0',
        contacthour: '10',
        extendeligible: '0',
        owpabbr: 'UM',
      },
    })

    api.getCourseGrades.mockResolvedValue({
      response: [],
    })

    const wrapper = mount(ActiveCourse, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    await flushPromises()
    vi.runAllTimers()
    await flushPromises()

    expect(wrapper.text()).toContain('No chapter data available.')
    expect(wrapper.text()).toContain('0%')
  })

  it('loads purchase history and displays invoice course names', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Water Treatment Plant Operation II',
        expiredate: '2026-09-15',
        completedate: '—',
        ceus: '2.0',
        contacthour: '20',
        extendeligible: '0',
        owpabbr: 'WTPO2',
      },
    })

    api.getCourseGrades.mockResolvedValue({
      response: [],
    })

    api.getInvoices.mockResolvedValue({
      response: [{ invoicenum: '1001' }],
    })

    api.getInvoiceData.mockResolvedValue({
      response: [
        { coursetitle: 'Operation of Wastewater Treatment Plants, Vol. 2' },
      ],
    })

    const wrapper = mount(ActiveCourse, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    await flushPromises()
    vi.runAllTimers()
    await flushPromises()

    expect(wrapper.text()).toContain('Invoice: 1001')
    expect(wrapper.text()).toContain('Operation of Wastewater Treatment Plants, Vol. 2')
  })

  it('shows empty states for messages and purchase history when no data exists', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Water Treatment Plant Operation I',
        expiredate: '2026-08-01',
        completedate: '—',
        ceus: '2.0',
        contacthour: '20',
        extendeligible: '0',
        owpabbr: 'WTPO1',
      },
    })

    api.getCourseGrades.mockResolvedValue({
      response: [],
    })

    api.getInvoices.mockResolvedValue({
      response: [],
    })

    const wrapper = mount(ActiveCourse, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    await flushPromises()
    vi.runAllTimers()
    await flushPromises()

    expect(wrapper.text()).toContain('No messages available.')
    expect(wrapper.text()).toContain('No purchase history available.')
  })

  it('shows error state when enrollment record fails to load', async () => {
    api.getEnrollmentRecord.mockRejectedValue(
      new Error('Failed to load active course data')
    )

    const wrapper = mount(ActiveCourse, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    await flushPromises()
    vi.runAllTimers()
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to load active course data')
    expect(wrapper.text()).toContain('We couldn’t load this chapter data right now.')
  })

  it('shows error state when purchase history fails to load', async () => {
    api.getEnrollmentRecord.mockResolvedValue({
      response: {
        title: 'Water Distribution Basics',
        expiredate: '2026-12-31',
        completedate: '—',
        ceus: '3.0',
        contacthour: '30',
        extendeligible: '1',
        owpabbr: 'OWTP1',
      },
    })

    api.getCourseGrades.mockResolvedValue({
      response: [],
    })

    api.getInvoices.mockRejectedValue(new Error('Sidebar failed'))

    const wrapper = mount(ActiveCourse, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    await flushPromises()
    vi.runAllTimers()
    await flushPromises()

    expect(wrapper.text()).toContain('We couldn’t load your purchase history right now.')
  })
})