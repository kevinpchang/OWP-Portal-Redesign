// Runs integration tests for the Operator Numbers Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/OperatorNumbersIntegrationTest.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import OperatorNumbers from '../pages/OperatorNumbers.vue'
import * as api from '@/services/owpAPI'

vi.mock('vue-router', () => ({
  useRoute: () => ({ name: 'operatornumbers' }),
}))

vi.mock('@/services/owpAPI', () => ({
  getActiveEnrollment: vi.fn(),
  getOperatorList: vi.fn(),
}))

function mountPage() {
  return mount(OperatorNumbers, {
    global: {
      stubs: {
        'router-link': {
          template: '<a><slot /></a>',
        },
        transition: false,
      },
    },
  })
}

describe('OperatorNumbers', () => {
  beforeEach(() => {
    vi.clearAllMocks()

   api.getOperatorList.mockResolvedValue({
    response: [{
        oprlicid: "84910",
        personid: "458860",
        oprlicstatus: "A",
        operatornumber: "12345",
        secondaryidnumber: null,
        effectdate: null,
        expiredate: null,
        countryid: "1",
        country: "United States of America",
        stateid: "CA",
        state: "California",
        liccatid: "1",
        liccattxt: "Operator",
        nearexpire: "0",
        expired: "0",
        expiredflag: "0",
        archivedflag: "0",
        archiveddate: null,
        insdate: "Feb 19, 2026",
        renewaleligibledate: null
    }],
    })

  })

  it('loads and displays state in table', async () => {
    const wrapper = mountPage()
    await flushPromises()

    expect(wrapper.find('.state').text()).toContain('California')
  })

  it('loads and displays operator number in table', async () => {
    const wrapper = mountPage()
    await flushPromises()

    expect(wrapper.find('.number').text()).toContain('12345')
  })

})