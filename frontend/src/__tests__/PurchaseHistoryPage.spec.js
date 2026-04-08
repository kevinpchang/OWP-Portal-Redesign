// Runs tests for the Purchase History Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/PurchaseHistoryPage.spec.js
// To run with coverage: npm run test:front -- src/__tests__/PurchaseHistoryPage.spec.js --coverage
// To run all frontend tests: npm run test:front

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import PurchaseHistoryPage from '../pages/PurchaseHistory.vue'
import * as api from '@/services/owpAPI'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  }),
  useRoute: () => ({
    params: {}
  })
}))

vi.mock('@/services/owpAPI', () => ({
  getInvoices: vi.fn(),
  getInvoiceData: vi.fn(),
  downloadReceipt: vi.fn()
}))

describe('PurchaseHistoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads invoice cards from getInvoices', async () => {
    api.getInvoices.mockResolvedValue({
      response: [
        {
          invoicenum: 1234,
          invoicedate: '03/15/2026',
          balancedue: 0
        },
        {
          invoicenum: 5678,
          invoicedate: '03/20/2026',
          balancedue: 0
        }
      ]
    })

    const wrapper = mount(PurchaseHistoryPage)
    await flushPromises()

    const cards = wrapper.findAll('.inv-card')

    expect(cards).toHaveLength(2)
    expect(wrapper.text()).toContain('#1234')
    expect(wrapper.text()).toContain('#5678')
    expect(wrapper.text()).toContain('Paid')
  })

  it('shows an error message when getInvoices fails', async () => {
    api.getInvoices.mockRejectedValue(new Error('Failed to load invoices'))

    const wrapper = mount(PurchaseHistoryPage)
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to load invoices')
  })

  it('loads invoice details when an invoice card is clicked', async () => {
    api.getInvoices.mockResolvedValue({
      response: [
        {
          invoicenum: 1234,
          invoicedate: '03/15/2026',
          balancedue: 0
        }
      ]
    })

    api.getInvoiceData.mockResolvedValue({
      response: [
        {
          invoicedate: '03/15/2026',
          invoiceduedate: '03/25/2026',
          shippedflag: '1',
          balancedue: 0,
          entityname: 'Vincent Lam',
          cssagent: 'OWP Website',
          billfmtdaddr: 'Vincent Lam<br>123 Main St<br>Sacramento CA 95814',
          billfmtdphn: '916-555-1111',
          pmtfmtdaddr: 'Vincent Lam<br>123 Main St<br>Sacramento CA 95814',
          pmtfmtdphn: '916-555-1111',
          payamt: 125.5,
          paydate: '03/16/2026',
          paymethodname: 'Visa',
          description: 'Paid in full',
          feetypename: 'Enrollment',
          mstfeecomment: '',
          coursetitle: 'Math 101',
          itmqty: 1,
          itmamt: 125.5
        }
      ]
    })

    const wrapper = mount(PurchaseHistoryPage)
    await flushPromises()

    await wrapper.find('.inv-card').trigger('click')
    await flushPromises()

    expect(api.getInvoiceData).toHaveBeenCalledWith(1234)
    expect(wrapper.text()).toContain('Invoice Details')
    expect(wrapper.text()).toContain('Vincent Lam')
    expect(wrapper.text()).toContain('OWP Website')
    expect(wrapper.text()).toContain('Enrollment: Math 101')
    expect(wrapper.text()).toContain('Visa')
    expect(wrapper.text()).toContain('Paid in full')
  })

  it('renders refund values correctly for negative payment and quantity', async () => {
    api.getInvoices.mockResolvedValue({
      response: [
        {
          invoicenum: 4321,
          invoicedate: '03/10/2026',
          balancedue: -15
        }
      ]
    })

    api.getInvoiceData.mockResolvedValue({
      response: [
        {
          invoicedate: '03/10/2026',
          invoiceduedate: '03/20/2026',
          shippedflag: '0',
          balancedue: -15,
          entityname: 'Refund User',
          cssagent: 'Manual Entry',
          billfmtdaddr: 'Refund User<br>555 Oak St<br>Sacramento CA 95811',
          billfmtdphn: '916-555-2222',
          pmtfmtdaddr: 'Refund User<br>555 Oak St<br>Sacramento CA 95811',
          pmtfmtdphn: '916-555-2222',
          payamt: -15,
          paydate: '03/11/2026',
          paymethodname: 'Mastercard',
          description: 'Refunded item',
          feetypename: 'Shipping',
          mstfeecomment: 'UPS Ground',
          coursetitle: '',
          itmqty: -1,
          itmamt: -15
        }
      ]
    })

    const wrapper = mount(PurchaseHistoryPage)
    await flushPromises()

    await wrapper.find('.inv-card').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Amount Refunded')
    expect(wrapper.text()).toContain('Shipping: UPS Ground')
    expect(wrapper.text()).toContain('-1')
    expect(wrapper.text()).toContain('($15.00)')
  })

  it('shows fallback item text when no invoice items are returned', async () => {
    api.getInvoices.mockResolvedValue({
      response: [
        {
          invoicenum: 9999,
          invoicedate: '03/01/2026',
          balancedue: 0
        }
      ]
    })

    api.getInvoiceData.mockResolvedValue({
      response: []
    })

    const wrapper = mount(PurchaseHistoryPage)
    await flushPromises()

    await wrapper.find('.inv-card').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('#9999')
    expect(wrapper.text()).not.toContain('Amount Refunded')
  })

  it('goes back to purchase history when Return to Purchase History is clicked', async () => {
    api.getInvoices.mockResolvedValue({
      response: [
        {
          invoicenum: 1234,
          invoicedate: '03/15/2026',
          balancedue: 0
        }
      ]
    })

    api.getInvoiceData.mockResolvedValue({
      response: [
        {
          invoicedate: '03/15/2026',
          invoiceduedate: '03/25/2026',
          shippedflag: '1',
          balancedue: 0,
          entityname: 'Vincent Lam',
          cssagent: 'OWP Website',
          billfmtdaddr: 'Vincent Lam<br>123 Main St<br>Sacramento CA 95814',
          billfmtdphn: '916-555-1111',
          pmtfmtdaddr: 'Vincent Lam<br>123 Main St<br>Sacramento CA 95814',
          pmtfmtdphn: '916-555-1111',
          payamt: 125.5,
          paydate: '03/16/2026',
          paymethodname: 'Visa',
          description: 'Paid in full',
          feetypename: 'Enrollment',
          mstfeecomment: '',
          coursetitle: 'Math 101',
          itmqty: 1,
          itmamt: 125.5
        }
      ]
    })

    const wrapper = mount(PurchaseHistoryPage)
    await flushPromises()

    await wrapper.find('.inv-card').trigger('click')
    await flushPromises()

    const buttons = wrapper.findAll('button')
    const backButton = buttons.find(btn => btn.text().includes('Return to Purchase History'))

    await backButton.trigger('click')
    await flushPromises()

    expect(pushMock).toHaveBeenCalledWith('/purchase-history')
  })
})