// Runs integration tests for the My Account Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/MyAccountPageIntegrationTest.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MyAccountPage from '../pages/MyAccountPage.vue'
import * as api from '@/services/owpAPI'

vi.mock('vue-router', () => ({
  useRoute: () => ({ name: 'MyAccountPage' }),
}))

vi.mock('lucide-vue-next', () => ({
  Hash: {
    name: 'Hash',
    template: '<svg></svg>',
  },
  SquareUserRound: {
    name: 'SquareUserRound',
    template: '<svg></svg>',
  },
}))

vi.mock('@/assets/icons/owp-2color/user-icon.svg', () => ({
  default: 'user-icon.svg',
}))
vi.mock('@/assets/icons/owp-2color/contact-card-icon.svg', () => ({
  default: 'contact-card-icon.svg',
}))
vi.mock('@/assets/icons/owp-2color/transcipt-icon.svg', () => ({
  default: 'transcript-icon.svg',
}))
vi.mock('@/assets/icons/owp-2color/history-icon.svg', () => ({
  default: 'history-icon.svg',
}))

vi.mock('@/services/myAccountAPI', () => ({
  getAccountDetails: vi.fn(),
  getActiveEnrollment: vi.fn(),
  getCourseGrades: vi.fn(),
  getOperatorList: vi.fn(),
}))

vi.mock('@/services/owpAPI', () => ({
  getAccountDetails: vi.fn(),
  getActiveEnrollment: vi.fn(),
  getCourseGrades: vi.fn(),
  getOperatorList: vi.fn(),
  getInvoices: vi.fn(),
  getInvoiceData: vi.fn(),
  updateContactInfo: vi.fn(),
  loadFromSession: vi.fn(), // FIX: added because MyAccountPage now uses cache fallback
}))

function mountPage() {
  return mount(MyAccountPage, {
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

describe('MyAccountPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    api.getAccountDetails.mockResolvedValue({
      response: {
        firstname: 'Silicon',
        fullname: 'Silicon Scribes',
        hmemail: 'siliconscribes@gmail.com',
        prfdemailval: 'siliconscribes@gmail.com',
        hmstreet1: '3356 street way',
        hmcity: 'Sacramento',
        hmstate: 'CA',
        hmzip: '12345',
        hmfmtdphn: '(916)-555-1234',
        hmmobilefmtdphn: '(279)-555-8888',
        hmfaxcity: '916',
        hmfaxlocal: '5559999',
        hmphncity: '916',
        hmphnlocal: '5551234',
        hmphnext: '77',
      },
    })

    api.getActiveEnrollment.mockResolvedValue({
      response: [],
    })

    api.getCourseGrades.mockResolvedValue({
      response: [],
    })

    api.getOperatorList.mockResolvedValue({
      response: [],
    })

    api.getInvoices.mockResolvedValue({
      response: [],
    })

    api.getInvoiceData.mockResolvedValue({
      response: [],
    })

    api.updateContactInfo.mockResolvedValue({
      response: { success: true },
    })

    api.loadFromSession.mockReturnValue(null) // FIX: default no-cache fallback
    vi.stubGlobal('alert', vi.fn()) // FIX: avoid test noise from alert in onMounted/save paths
  })

  it('loads and displays firstname in the profile card', async () => {
    const wrapper = mountPage()
    await flushPromises()

    expect(wrapper.find('.user-name').text()).toContain('Silicon')
  })

  it('loads email and address in contact info', async () => {
    const wrapper = mountPage()
    await flushPromises()

    const text = wrapper.text()

    expect(text).toContain('siliconscribes@gmail.com')
    expect(text).toContain('3356 street way')
    expect(text).toContain('Sacramento, CA 12345')
  })

  it('loads operator numbers', async () => {
    api.getOperatorList.mockResolvedValue({
      response: [
        { oprlicid: 1, stateid: 'CA', operatornumber: '12345' },
        { oprlicid: 2, stateid: 'NV', operatornumber: '67890' },
      ],
    })

    const wrapper = mountPage()
    await flushPromises()

    expect(wrapper.text()).toContain('CA-12345')
    expect(wrapper.text()).toContain('NV-67890')
  })

  it('loads transcript preview from CR grade enrollments only', async () => {
    // FIX: matches current component logic, which filters by grade === "CR "
    api.getActiveEnrollment.mockResolvedValue({
      response: [
        { enrollid: 1, title: 'Course A', grade: 'IP' },
        { enrollid: 2, title: 'Course B', grade: 'CR ' },
        { enrollid: 3, title: 'Course C', grade: 'CR ' },
        { enrollid: 4, title: 'Course D', grade: 'F' },
      ],
    })

    const wrapper = mountPage()
    await flushPromises()

    const transcriptLinks = wrapper.findAll('.side-links .side-link')

    expect(wrapper.text()).toContain('Course B')
    expect(wrapper.text()).toContain('Course C')
    expect(wrapper.text()).not.toContain('Course A')
    expect(wrapper.text()).not.toContain('Course D')
    expect(transcriptLinks.length).toBeGreaterThanOrEqual(2)
  })

  it('loads purchase history preview with invoice titles', async () => {
    api.getInvoices.mockResolvedValue({
      response: [
        { invoicenum: '1001' },
        { invoicenum: '1002' },
      ],
    })

    api.getInvoiceData.mockImplementation(async (invoicenum) => {
      if (invoicenum === '1001') {
        return {
          response: [
            { coursetitle: null },
            { coursetitle: 'Water Distribution Basics' },
          ],
        }
      }

      if (invoicenum === '1002') {
        return {
          response: [
            { coursetitle: null },
            { coursetitle: 'Wastewater Collection I' },
          ],
        }
      }

      return { response: [] }
    })

    const wrapper = mountPage()
    await flushPromises()

    expect(wrapper.text()).toContain('Invoice: 1001 - Water Distribution Basics')
    expect(wrapper.text()).toContain('Invoice: 1002 - Wastewater Collection I')
  })

  it('opens contact dialog and pre-fills contact fields', async () => {
    const wrapper = mountPage()
    await flushPromises()

    const editButtons = wrapper.findAll('button.btn.xsmall')
    await editButtons[0].trigger('click')
    await flushPromises()

    expect(wrapper.find('.contact-info-dialog').exists()).toBe(true)

    const inputs = wrapper.findAll('input')
    const phoneInput = inputs.find((node) => node.attributes('placeholder') === '(XXX)-XXX-XXXX')
    const streetInput = inputs.find((node) => node.attributes('placeholder') === 'Street address')
    const cityInput = inputs.find((node) => node.attributes('placeholder') === 'City')

    expect(phoneInput.element.value).toBe('(916)-555-1234')
    expect(streetInput.element.value).toBe('3356 street way')
    expect(cityInput.element.value).toBe('Sacramento')
  })

  it('formats phone input as the user types', async () => {
    const wrapper = mountPage()
    await flushPromises()

    const editButtons = wrapper.findAll('button.btn.xsmall')
    await editButtons[0].trigger('click')
    await flushPromises()

    const phoneInput = wrapper
      .findAll('input')
      .find((node) => node.attributes('placeholder') === '(XXX)-XXX-XXXX')

    await phoneInput.setValue('9165551234')
    await phoneInput.trigger('input')
    await flushPromises()

    expect(phoneInput.element.value).toBe('(916)-555-1234')
  })

  it('saveContactInfo sends parsed phone data to updateContactInfo', async () => {
    const wrapper = mountPage()
    await flushPromises()

    const editButtons = wrapper.findAll('button.btn.xsmall')
    await editButtons[0].trigger('click')
    await flushPromises()

    const phoneInput = wrapper
      .findAll('input')
      .find((node) => node.attributes('placeholder') === '(XXX)-XXX-XXXX')

    const streetInput = wrapper
      .findAll('input')
      .find((node) => node.attributes('placeholder') === 'Street address')

    await phoneInput.setValue('9165556789')
    await phoneInput.trigger('input')
    await streetInput.setValue('999 New Street')
    await flushPromises()

    const saveButton = wrapper.find('.bottom .save')
    await saveButton.trigger('click')
    await flushPromises()

    expect(api.updateContactInfo).toHaveBeenCalledWith(
      458860,
      expect.objectContaining({
        street_1: '999 New Street',
        phone_country_code: '1',
        phone_area_code: '916',
        phone_local: '5556789',
      })
    )
  })

  it('shows loading fallback when operator list is empty', async () => {
    api.getOperatorList.mockResolvedValue({
      response: [],
    })

    const wrapper = mountPage()
    await flushPromises()

    expect(wrapper.text()).toContain('Loading...')
  })

  it('shows transcript empty state when no transcript items are available', async () => {
    api.getActiveEnrollment.mockResolvedValue({
      response: [
        { enrollid: 1, title: 'Course A', grade: 'IP' },
      ],
    })

    const wrapper = mountPage()
    await flushPromises()

    expect(wrapper.text()).toContain('No transcripts available.')
  })

  it('shows purchase history empty state when there are no invoices', async () => {
    api.getInvoices.mockResolvedValue({
      response: [],
    })

    const wrapper = mountPage()
    await flushPromises()

    expect(wrapper.text()).toContain('No purchase history available.')
  })

  it('falls back to cached account data when account request fails', async () => {
    // FIX: replaces old error-state test
    api.getAccountDetails.mockRejectedValue(new Error('Failed to load account'))

    api.loadFromSession.mockImplementation((key) => {
      if (key === 'getAccountDetails') {
        return {
          firstname: 'Cached Silicon',
          hmemail: 'cached@gmail.com',
          hmstreet1: '100 Cached St',
          hmcity: 'Sacramento',
          hmstate: 'CA',
          hmzip: '99999',
          hmfmtdphn: '(916)-000-1111',
          hmmobilefmtdphn: '(279)-000-2222',
        }
      }
      return null
    })

    const wrapper = mountPage()
    await flushPromises()

    expect(api.loadFromSession).toHaveBeenCalledWith('getAccountDetails')
    expect(wrapper.text()).toContain('Cached Silicon')
    expect(wrapper.text()).toContain('cached@gmail.com')
    expect(wrapper.text()).toContain('100 Cached St')
    expect(wrapper.text()).not.toContain('Failed to load account')
  })

  it('falls back to cached operator list when operator request fails', async () => {
    // FIX: adds coverage for another cache path in loadAccount()
    api.getOperatorList.mockRejectedValue(new Error('Operator API failed'))

    api.loadFromSession.mockImplementation((key) => {
      if (key === 'getOperatorList') {
        return [
          { oprlicid: 1, stateid: 'CA', operatornumber: '54321' },
          { oprlicid: 2, stateid: 'AZ', operatornumber: '77777' },
        ]
      }
      return null
    })

    const wrapper = mountPage()
    await flushPromises()

    expect(api.loadFromSession).toHaveBeenCalledWith('getOperatorList')
    expect(wrapper.text()).toContain('CA-54321')
    expect(wrapper.text()).toContain('AZ-77777')
  })

  it('falls back to cached invoices and invoice data when purchase history requests fail', async () => {
    // FIX: adds coverage for cache behavior inside loadPurchaseHistoryPreview()
    api.getInvoices.mockRejectedValue(new Error('Invoices API failed'))
    api.getInvoiceData.mockRejectedValue(new Error('Invoice data API failed'))

    api.loadFromSession.mockImplementation((key) => {
      if (key === 'getInvoices') {
        return [{ invoicenum: '2001' }]
      }

      if (key === 'getInvoiceData-2001') {
        return [{ coursetitle: 'Cached Water Course' }]
      }

      return null
    })

    const wrapper = mountPage()
    await flushPromises()

    expect(api.loadFromSession).toHaveBeenCalledWith('getInvoices')
    expect(wrapper.text()).toContain('Invoice: 2001 - Cached Water Course')
  })

  it('uses loading placeholders when account request fails and no cache exists', async () => {
    // FIX: verifies new behavior when API fails and session cache is empty
    api.getAccountDetails.mockRejectedValue(new Error('Failed to load account'))
    api.loadFromSession.mockReturnValue(null)

    const wrapper = mountPage()
    await flushPromises()

    expect(api.loadFromSession).toHaveBeenCalledWith('getAccountDetails')
    expect(wrapper.find('.user-name').text()).toContain('Loading...')
    expect(wrapper.text()).not.toContain('Failed to load account')
  })
})