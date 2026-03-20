// Runs unit tests for the Courses Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/CoursesPage.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CoursesPage from '../pages/CoursesPage.vue'
import * as api from '@/services/owpAPI'

vi.mock('vue-router', () => ({
  useRoute: () => ({ name: 'CoursesPage' }),
}))

vi.mock('@/services/owpAPI', () => ({
  getActiveEnrollment: vi.fn(),
  getCourseGrades: vi.fn(),
  getInvoices: vi.fn(),
  getInvoiceData: vi.fn(),
}))

describe('CoursesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })
    api.getCourseGrades.mockResolvedValue({ response: [] })
  })

  it('getActiveEnrollment loads active and completed enrollments', async () => {
    api.getActiveEnrollment.mockResolvedValue({
      response: [
        {
          enrollid: 1,
          title: 'Drinking Water Specialist I',
          statustxt: 'Enrolled',
          expiredate: '2026-12-31',
          extendeligible: '1',
          owpabbr: 'OWTP1',
        },
        {
          enrollid: 2,
          title: 'Drinking Water Specialist II',
          statustxt: 'Complete',
          grade: 'CR',
          owpabbr: 'OWTP2',
        },
        {
          enrollid: 3,
          title: 'Drinking Water Specialist III',
          statustxt: 'Dropped',
          grade: '',
          owpabbr: 'OWTP3',
        },
      ],
    })

    api.getCourseGrades.mockImplementation((enrollid) => {
      if (enrollid === 1) {
        return Promise.resolve({
          response: [{ grade: 'A' }, { grade: '' }],
        })
      }

      return Promise.resolve({ response: [] })
    })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    const allCourseTitles = wrapper.findAll('.course-title').map((node) => node.text())

    expect(allCourseTitles).toContain('Drinking Water Specialist I')
    expect(allCourseTitles).toContain('Drinking Water Specialist II')
    expect(allCourseTitles).toContain('Drinking Water Specialist III')
  })

  it('getCourseGrades loads active enrollment progress', async () => {
    api.getActiveEnrollment.mockResolvedValue({
      response: [
        {
          enrollid: 1,
          title: 'Water Distribution Basics',
          statustxt: 'Enrolled',
          expiredate: '2026-12-31',
          extendeligible: '1',
          owpabbr: 'OWTP1',
        },
      ],
    })

    api.getCourseGrades.mockResolvedValue({
      response: [
        { grade: 'A' },
        { grade: 'B' },
        { grade: '' },
        { grade: '' },
      ],
    })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    expect(wrapper.text()).toContain('Water Distribution Basics')
    expect(wrapper.text()).toContain('50%')
    expect(wrapper.text()).toContain('Expires: 2026-12-31')
  })

  it('completed enrollments show pass and dropped statuses', async () => {
    api.getActiveEnrollment.mockResolvedValue({
      response: [
        {
          enrollid: 10,
          title: 'Treatment Plant Operations I',
          statustxt: 'Complete',
          grade: 'CR',
          owpabbr: 'OWTP1',
        },
        {
          enrollid: 11,
          title: 'Treatment Plant Operations II',
          statustxt: 'Dropped',
          grade: '',
          owpabbr: 'OWTP2',
        },
      ],
    })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    expect(wrapper.text()).toContain('Treatment Plant Operations I')
    expect(wrapper.text()).toContain('Pass')
    expect(wrapper.text()).toContain('Treatment Plant Operations II')
    expect(wrapper.text()).toContain('Dropped')
  })

  it('recommended section shows empty state', async () => {
    api.getActiveEnrollment.mockResolvedValue({
      response: [],
    })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    expect(wrapper.text()).toContain('No Recommended Courses')
    expect(wrapper.text()).toContain('Browse Course Catalog')
    expect(wrapper.find('.catalog-link').exists()).toBe(true)
  })

  it('getInvoices and getInvoiceData load purchase history', async () => {
    api.getActiveEnrollment.mockResolvedValue({
      response: [],
    })

    api.getInvoices.mockResolvedValue({
      response: [{ invoicenum: '1001' }],
    })

    api.getInvoiceData.mockResolvedValue({
      response: [
        { coursetitle: 'Operation of Wastewater Treatment Plants, Vol. 1' },
      ],
    })

    const wrapper = mount(CoursesPage)
    await flushPromises()

    expect(wrapper.text()).toContain('Invoice: 1001')
    expect(wrapper.text()).toContain('Operation of Wastewater Treatment Plants, Vol. 1')
  })

  it('shows error state when enrollment data fails to load', async () => {
    api.getActiveEnrollment.mockRejectedValue(new Error('Failed to load enrollments'))

    const wrapper = mount(CoursesPage)
    await flushPromises()

    expect(wrapper.text()).toContain('We couldn’t load your course information right now.')
    expect(wrapper.text()).toContain('We couldn’t load your completed course information right now.')
  })
})