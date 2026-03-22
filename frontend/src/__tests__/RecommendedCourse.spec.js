// Runs unit tests for the Recommended Course Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/RecommendedCourse.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RecommendedCourse from '../pages/RecommendedCourse.vue'
import * as api from '@/services/owpAPI'

// mock recommended course data used by the page
vi.mock('../data/coursesData.js', () => ({
  recommendedCourses: [
    {
      id: 1,
      title: 'Advanced Water Treatment',
      description: 'Learn advanced treatment methods.',
      longDescription: 'This course covers advanced treatment processes and operational concepts.',
      chapters: ['Introduction', 'Filtration', 'Disinfection'],
    },
  ],
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: '1',
    },
  }),
}))

vi.mock('@/services/owpAPI', () => ({
  getInvoices: vi.fn(),
  getInvoiceData: vi.fn(),
}))

describe('RecommendedCourse', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })
  })

  it('loads recommended course data from recommendedCourses', async () => {
    const wrapper = mount(RecommendedCourse)
    await flushPromises()

    expect(wrapper.text()).toContain('Advanced Water Treatment')
    expect(wrapper.text()).toContain('Learn advanced treatment methods.')
    expect(wrapper.text()).toContain('This course covers advanced treatment processes and operational concepts.')
  })

  it('loads course contents from recommendedCourses', async () => {
    const wrapper = mount(RecommendedCourse)
    await flushPromises()

    expect(wrapper.text()).toContain('Introduction')
    expect(wrapper.text()).toContain('Filtration')
    expect(wrapper.text()).toContain('Disinfection')
  })

  it('shows fallback state when no recommended course matches route id', async () => {
    vi.doMock('vue-router', () => ({
      useRoute: () => ({
        params: {
          id: '999',
        },
      }),
    }))

    const { default: RecommendedCourseNoMatch } = await import('../pages/RecommendedCourse.vue')

    const wrapper = mount(RecommendedCourseNoMatch)
    await flushPromises()

    expect(wrapper.text()).toContain('No Recommended Course')
    expect(wrapper.text()).toContain('There is no recommended course available at this time.')
    expect(wrapper.text()).toContain('Browse the course catalog to explore available offerings.')
    expect(wrapper.text()).toContain('No course content available.')
  })

  it('getInvoices and getInvoiceData load purchase history', async () => {
    api.getInvoices.mockResolvedValue({
      response: [{ invoicenum: '1001' }],
    })

    api.getInvoiceData.mockResolvedValue({
      response: [
        { coursetitle: 'Operation of Wastewater Treatment Plants, Vol. 1' },
      ],
    })

    const wrapper = mount(RecommendedCourse)
    await flushPromises()

    expect(wrapper.text()).toContain('Invoice: 1001')
    expect(wrapper.text()).toContain('Operation of Wastewater Treatment Plants, Vol. 1')
  })

  it('messages section shows empty state', async () => {
    const wrapper = mount(RecommendedCourse)
    await flushPromises()

    expect(wrapper.text()).toContain('No messages available.')
  })

  it('shows empty purchase history state when no invoices exist', async () => {
    api.getInvoices.mockResolvedValue({
      response: [],
    })

    const wrapper = mount(RecommendedCourse)
    await flushPromises()

    expect(wrapper.text()).toContain('No purchase history available.')
  })

  it('shows error state when sidebar purchase history fails to load', async () => {
    api.getInvoices.mockRejectedValue(new Error('Failed to load purchase history'))

    const wrapper = mount(RecommendedCourse)
    await flushPromises()

    expect(wrapper.text()).toContain('We couldn’t load your purchase history right now.')
  })
})