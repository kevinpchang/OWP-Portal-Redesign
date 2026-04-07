// Runs integration tests for the Recommended Course Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/RecommendedCourseIntegrationTest.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RecommendedCourse from '../pages/RecommendedCourse.vue'
import * as api from '@/services/owpAPI'

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '1' },
  }),
}))

vi.mock('@/services/owpAPI', () => ({
  getInvoices: vi.fn(),
  getInvoiceData: vi.fn(),
}))

vi.mock('../data/coursesData.js', () => ({
  recommendedCourses: [
    {
      id: 1,
      title: 'Recommended Course One',
      description: 'Short description',
      longDescription: 'Long description for the recommended course.',
      chapters: ['Chapter 1', 'Chapter 2'],
    },
    {
      id: 2,
      title: 'Recommended Course Two',
      description: 'Second description',
      longDescription: 'Second long description.',
      chapters: [],
    },
  ],
}))

describe('RecommendedCourse', () => {
  it('loads and displays recommended course information correctly', async () => {
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(RecommendedCourse)
    await flushPromises()

    expect(wrapper.find('.course-title').text()).toContain('Recommended Course One')
    expect(wrapper.text()).toContain('Short description')
    expect(wrapper.text()).toContain('Long description for the recommended course.')
  })

  it('loads and displays course contents correctly', async () => {
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(RecommendedCourse)
    await flushPromises()

    const rows = wrapper.findAll('.chapter-row')

    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain('Chapter 1')
    expect(rows[1].text()).toContain('Chapter 2')
  })

  it('displays purchase history correctly', async () => {
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

    const wrapper = mount(RecommendedCourse)
    await flushPromises()

    const invoiceLinks = wrapper.findAll('.side-link')

    expect(invoiceLinks.some((item) => item.text().includes('Invoice: 1 - Course A'))).toBe(true)
    expect(invoiceLinks.some((item) => item.text().includes('Invoice: 2 - Course B'))).toBe(true)
  })

  it('shows fallback state when the recommended course id does not exist', async () => {
    vi.doMock('vue-router', () => ({
      useRoute: () => ({
        params: { id: '999' },
      }),
    }))

    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const { default: RecommendedCourseMissing } = await import('../pages/RecommendedCourse.vue')
    const wrapper = mount(RecommendedCourseMissing)
    await flushPromises()

    expect(wrapper.text()).toContain('No Recommended Course')
    expect(wrapper.text()).toContain('There is no recommended course available at this time.')
    expect(wrapper.text()).toContain('Browse the course catalog to explore available offerings.')
    expect(wrapper.text()).toContain('No course content available.')
  })

  it('shows fallback chapter content when a recommended course has no chapters', async () => {
    vi.doMock('vue-router', () => ({
      useRoute: () => ({
        params: { id: '2' },
      }),
    }))

    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const { default: RecommendedCourseNoChapters } = await import('../pages/RecommendedCourse.vue')
    const wrapper = mount(RecommendedCourseNoChapters)
    await flushPromises()

    expect(wrapper.text()).toContain('Recommended Course Two')
    expect(wrapper.text()).toContain('No course content available.')
  })
})