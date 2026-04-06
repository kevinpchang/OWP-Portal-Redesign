// Runs unit tests for the Dashboard Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/DashboardPage.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DashboardPage from '../pages/DashboardPage.vue'
import * as api from '@/services/owpAPI'

vi.mock('vue-router', () => ({
  useRoute: () => ({ name: 'DashboardPage' }),
}))


vi.mock('@/services/owpAPI', () => ({
  getAccountDetails: vi.fn(),
  getActiveEnrollment: vi.fn(),
  getCourseGrades: vi.fn(),
  getInvoices: vi.fn(),
  getInvoiceData: vi.fn(),
}))

// Dashboard Page test
// These test give mock API responses then tests if components are correctly pulling the correct information.
// This test DOES NOT ensure if actual API fetches are working.
describe('DashboardPage', () => {
  // Tests welcome-message loading
  it('getAccountDetails loads firstname', async () => {
    api.getAccountDetails.mockResolvedValue({ response: { firstname: 'Silicon' } })
    const wrapper = mount(DashboardPage)
    await flushPromises()
    expect(wrapper.find('.welcome-message').text()).toContain('Hello, Silicon')
  })

  // Testing for loading Active Enrollment objects
  it('getActiveEnrollment loads and filters objects only active enrollments. Objects also load all dynamic components', async () => {
    api.getActiveEnrollment.mockResolvedValue({ response: [
      {
        enrollid: 1,
        title: 'Drinking Water Specialist I',
        statustxt: 'Enrolled',
        expiredate: '2026-12-31'
      },
      {
        enrollid: 2,
        title: 'Drinking Water Specialist II',
        statustxt: 'Enrolled',
        expiredate: '2026-01-01'
      },
      {
        enrollid: 3,
        title: 'Drinking Water Specialist III',
        statustxt: 'Dropped',
        expiredate: '2026-12-31'
      },
    ] })
    const wrapper = mount(DashboardPage)
    await flushPromises()
    const titles = wrapper.findAll('.active-enrollments .body .object .right .title .text')
    const objects = wrapper.findAll('.active-enrollments .body .object') // Widen findAll to card objects

    expect(titles).toHaveLength(2) // Ensures that filtered 'Enrolled' list is only two ojects large

    expect(titles[0].text()).toContain('Drinking Water Specialist I') // Loads title text component
    expect(titles[1].text()).toContain('Drinking Water Specialist II')

    expect(objects[0].text()).toContain('2026-12-31') // Checks if objects contain the expiredate
    expect(objects[1].text()).toContain('2026-01-01')
  })

  // Testing for course progress percentage
  it('getActiveEnrollment and getCourseGrades correctly compute course progress', async () => {
    const getActiveEnrollmentResponse = [
      {
        "enrollid": "1",
        "title": "Drinking Water Specialist I",
        "statustxt": "Enrolled",
        "expiredate": "2026-12-31"
      },
      {
        "enrollid": "2",
        "title": "Drinking Water Specialist II",
        "statustxt": "Enrolled",
        "expiredate": "2026-01-01"
      }
    ]

    const getCourseGradesResponse1 = [
      {
        "grade": "100" 
      },
      {
        "grade": "100" 
      },
      {
        "grade": "100" 
      },
      {
        "grade": null
      },
      {
        "grade": null 
      }
    ]
    const getCourseGradesResponse2 = [
      {
        "grade": "100" 
      },
      {
        "grade": null 
      },
      {
        "grade": null 
      },
      {
        "grade": null
      },
      {
        "grade": null 
      }
    ]

    // Load responses separately
    api.getActiveEnrollment.mockResolvedValue({ response: getActiveEnrollmentResponse })
    // Mocks enrollid parameter for getCourseGrades()
    api.getCourseGrades.mockImplementation( async (enrollid) => {
      if (enrollid === '1')  {
        return { response: getCourseGradesResponse1 }
      }
      if (enrollid === '2')  {
        return { response: getCourseGradesResponse2 }
      }
    })

    const wrapper = mount(DashboardPage)
    await flushPromises()
    const objects = wrapper.findAll('.active-enrollments .body .object .progress .percent .text')

    // getCourseCompletion function in Dashboard should return 60% and 20% given mock values
    // This also simultaneously checks for the correct width size for the progress bar as it uses this same value
    expect(objects[0].text()).toContain('60%')
    expect(objects[1].text()).toContain('20%')
  })

  // Testing for loading invoice objects
  it('getActiveEnrollment loads expiredate', async () => {
    const getInvoicesResponse = [
      {
        "invoicenum": "1",
      },
      {
        "invoicenum": "2",
      }
    ]
    
    // Mocking actual invoice data response. The response typically has filled and null course titles
    const getInvoiceDataResponse1 = [
      {
        "invoicenum": "1",
        "coursetitle": null
      },
      {
        "invoicenum": "1",
        "coursetitle": "Drinking Water Specialist"
      }
    ]

    const getInvoiceDataResponse2 = [
      {
        "invoicenum": "2",
        "coursetitle": null
      },
      {
        "invoicenum": "2",
        "coursetitle": null
      },
      {
        "invoicenum": "2",
        "coursetitle": "Drinking Water Specialist II"
      },
    ]

    // Load responses separately
    api.getInvoices.mockResolvedValue({ response: getInvoicesResponse })
    // Mocks enrollid parameter for getInvoiceData()
    api.getInvoiceData.mockImplementation( async (invoicenum) => {
      if (invoicenum === '1')  {
        return { response: getInvoiceDataResponse1 }
      }
      if (invoicenum === '2')  {
        return { response: getInvoiceDataResponse2 }
      }
    })

    const wrapper = mount(DashboardPage)
    await flushPromises()
    const objects = wrapper.findAll('.purchase-history .body .object') // Widen findAll to card objects

    expect(objects).toHaveLength(2)
    expect(objects[0].text()).toContain('Invoice: 1 - Drinking Water Specialist') // Checks if objects the invoicenum and coursetitle
    expect(objects[1].text()).toContain('Invoice: 2 - Drinking Water Specialist II')
  })
})
