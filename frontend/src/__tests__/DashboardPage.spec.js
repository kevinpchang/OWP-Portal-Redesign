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
  getActiveEnrollment: vi.fn()
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

  // Tests if getActiveEnrollment actually returns an array of enrollments
  // Then tests if the enrollment list is actually filtered to 'Enrolled' and contains distinct objects
  it('getActiveEnrollment loads active enrollments', async () => {
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
        expiredate: '2026-12-31'
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

    expect(titles).toHaveLength(2) // Ensures that filtered 'Enrolled' list is only two ojects large
    expect(titles[0].text()).toContain('Drinking Water Specialist I')
    expect(titles[1].text()).toContain('Drinking Water Specialist II')
  })
})
