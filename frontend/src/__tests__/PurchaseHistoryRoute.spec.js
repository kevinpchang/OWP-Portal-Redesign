import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import PurchaseHistoryPage from '../pages/PurchaseHistory.vue'
import * as api from '@/services/owpAPI'

const pushMock = vi.fn()

let mockRoute = {
  params: { id: '1234' }
}

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  }),
  useRoute: () => mockRoute
}))

vi.mock('@/services/owpAPI', () => ({
  getInvoices: vi.fn(),
  getInvoiceData: vi.fn(),
  downloadReceipt: vi.fn()
}))

describe('PurchaseHistoryPage Route Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute = { params: { id: '1234' } }
  })

  it('loads invoice detail directly from route id', async () => {
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
          entityname: 'Direct Route User',
          cssagent: 'OWP Website',
          billfmtdaddr: 'Direct Route User<br>888 Pine St<br>Sacramento CA 95814',
          billfmtdphn: '916-555-9999',
          pmtfmtdaddr: 'Direct Route User<br>888 Pine St<br>Sacramento CA 95814',
          pmtfmtdphn: '916-555-9999',
          payamt: 88,
          paydate: '03/16/2026',
          paymethodname: 'Visa',
          description: 'Direct load',
          feetypename: 'Enrollment',
          mstfeecomment: '',
          coursetitle: 'Testing 101',
          itmqty: 1,
          itmamt: 88
        }
      ]
    })

    const wrapper = mount(PurchaseHistoryPage)
    await flushPromises()

    expect(api.getInvoiceData).toHaveBeenCalledWith(1234)
    expect(wrapper.text()).toContain('Invoice Details')
    expect(wrapper.text()).toContain('Direct Route User')
    expect(wrapper.text()).toContain('Enrollment: Testing 101')
  })

  it('does not open detail if route id is not found in invoices', async () => {
    mockRoute = { params: { id: '7777' } }

    api.getInvoices.mockResolvedValue({
      response: [
        {
          invoicenum: 1234,
          invoicedate: '03/15/2026',
          balancedue: 0
        }
      ]
    })

    const wrapper = mount(PurchaseHistoryPage)
    await flushPromises()

    expect(api.getInvoiceData).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('#1234')
    expect(wrapper.text()).not.toContain('Invoice Details')
  })
})
