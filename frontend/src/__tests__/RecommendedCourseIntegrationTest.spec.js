// Runs integration tests for the Recommended Course Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/RecommendedCourseIntegrationTest.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RecommendedCourse from '../pages/RecommendedCourse.vue'
import * as api from '@/services/owpAPI'

// Shared mock route id so individual tests can change it safely
let mockRouteId = '1'

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: mockRouteId },
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
  // Resets mocks and default route id before each test
  beforeEach(() => {
    vi.clearAllMocks()
    mockRouteId = '1'
  })

  // Recommended course summary tests
  // Verifies the selected recommended course title and
  // descriptions render correctly.

  it('loads and displays recommended course information correctly', async () => {
    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(RecommendedCourse)
    await flushPromises()

    expect(wrapper.find('.course-title').text()).toContain('Recommended Course One')
    expect(wrapper.text()).toContain('Short description')
    expect(wrapper.text()).toContain('Long description for the recommended course.')
  })

  // Recommended course content tests
  // Verifies chapter rows render correctly when chapter content
  // exists for the selected recommended course.

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

  // Purchase history tests
  // Verifies invoice data is loaded and displayed correctly in
  // the sidebar.
 
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
      return { response: [] }
    })

    const wrapper = mount(RecommendedCourse)
    await flushPromises()

    const invoiceLinks = wrapper.findAll('.side-link')

    expect(invoiceLinks.some((item) => item.text().includes('Invoice: 1 - Course A'))).toBe(true)
    expect(invoiceLinks.some((item) => item.text().includes('Invoice: 2 - Course B'))).toBe(true)
  })

  // Missing course fallback tests
  // Verifies fallback content is shown when the recommended
  // course id does not match any course.
  
  it('shows fallback state when the recommended course id does not exist', async () => {
    mockRouteId = '999'

    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(RecommendedCourse)
    await flushPromises()

    expect(wrapper.text()).toContain('No Recommended Course')
    expect(wrapper.text()).toContain('There is no recommended course available at this time.')
    expect(wrapper.text()).toContain('Browse the course catalog to explore available offerings.')
    expect(wrapper.text()).toContain('No course content available.')
  })

  // Empty chapter fallback tests
  // Verifies fallback chapter content is shown when the
  // selected recommended course has no chapters.
  
  it('shows fallback chapter content when a recommended course has no chapters', async () => {
    mockRouteId = '2'

    api.getInvoices.mockResolvedValue({ response: [] })
    api.getInvoiceData.mockResolvedValue({ response: [] })

    const wrapper = mount(RecommendedCourse)
    await flushPromises()

    expect(wrapper.text()).toContain('Recommended Course Two')
    expect(wrapper.text()).toContain('No course content available.')
  })
})