import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import CertificatesPage from '@/pages/CertificatesPage.vue'

// ─────────────────────────────────────────────
// Integration Tests — CertificatesPage
// Mocks the API and tests dynamic component rendering
// Run: npm run test:front -- src/__tests__/CertificatesPageIntegrationTest.spec.js --coverage
// ─────────────────────────────────────────────

// ── Mock the OWP API service ──
vi.mock('@/services/owpAPI.js', () => ({
  getAccountDetails: vi.fn(),
  getActiveEnrollment: vi.fn(),
  getEnrollmentRecord: vi.fn(),
}))

// ── Mock SVG asset imports ──
vi.mock('@/assets/icons/owp-2color/certificate-icon.svg', () => ({ default: 'certificate.svg' }))
vi.mock('@/assets/icons/owp-2color/transcipt-icon.svg',   () => ({ default: 'transcript.svg' }))
vi.mock('@/assets/icons/owp-2color/history-icon.svg',     () => ({ default: 'history.svg' }))
vi.mock('@/assets/icons/owp-2color/mail-icon.svg',        () => ({ default: 'mail.svg' }))

import {
  getAccountDetails,
  getActiveEnrollment,
  getEnrollmentRecord,
} from '@/services/owpAPI.js'

// ── Router needed for <router-link> ──
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/messages', component: { template: '<div />' } },
    { path: '/purchase-history', component: { template: '<div />' } },
  ],
})

// ── Mock data ──
const mockAccount = {
  response: { fullname: 'John Doe' },
}

const mockEnrollments = {
  response: [
    { enrollid: 101, title: 'Advanced Water Treatment',      statustxt: 'Complete', grade: 'CR', completedate: '01/15/2025' },
    { enrollid: 102, title: 'Water Distribution Systems',    statustxt: 'Complete', grade: 'CR', completedate: '03/20/2025' },
    { enrollid: 103, title: 'Incomplete Course',             statustxt: 'Active',   grade: '',   completedate: '' },
  ],
}

const mockEnrollmentRecord = {
  response: [{ ceus: 1.5, contacthours: 15 }],
}

// ── Mount helper ──
async function mountPage() {
  const wrapper = mount(CertificatesPage, {
    global: { plugins: [router] },
  })
  await flushPromises()
  return wrapper
}

// ─────────────────────────────────────────────
describe('CertificatesPage — Integration Tests', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    getAccountDetails.mockResolvedValue(mockAccount)
    getActiveEnrollment.mockResolvedValue(mockEnrollments)
    getEnrollmentRecord.mockResolvedValue(mockEnrollmentRecord)
  })

  // ── Rendering ──────────────────────────────

  it('renders the page header correctly', async () => {
    const wrapper = await mountPage()
    expect(wrapper.find('h1.courses-header').text()).toBe('Certificates')
  })

  it('renders the page description', async () => {
    const wrapper = await mountPage()
    expect(wrapper.find('.page-description').text()).toContain('View and download')
  })

  it('renders the search input', async () => {
    const wrapper = await mountPage()
    expect(wrapper.find('input.search-input').exists()).toBe(true)
  })

  it('renders the sidebar with Messages, Transcripts, and Purchase History cards', async () => {
    const wrapper = await mountPage()
    const sideTitles = wrapper.findAll('.side-title').map(el => el.text())
    expect(sideTitles).toContain('Messages')
    expect(sideTitles).toContain('Transcripts')
    expect(sideTitles).toContain('Purchase History')
  })

  // ── Account loading ────────────────────────

  it('displays the logged-in account name after loading', async () => {
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('John Doe')
  })

  it('shows loading state for account before API resolves', async () => {
    getAccountDetails.mockImplementation(() => new Promise(() => {})) // never resolves
    const wrapper = mount(CertificatesPage, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Loading account')
  })

  it('shows error message if account API fails', async () => {
    getAccountDetails.mockRejectedValue(new Error('Network error'))
    const wrapper = await mountPage()
    expect(wrapper.find('[style*="color: #9F3323"]').exists()).toBe(true)
  })

  // ── Certificate loading ────────────────────

  it('shows loading state while certificates are fetching', async () => {
    getActiveEnrollment.mockImplementation(() => new Promise(() => {}))
    const wrapper = mount(CertificatesPage, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Loading certificates')
  })

  it('renders only completed CR-graded certificates', async () => {
    const wrapper = await mountPage()
    const items = wrapper.findAll('.certificate-item')
    // Only 2 of 3 mock enrollments are Complete + CR
    expect(items).toHaveLength(2)
  })

  it('renders certificate titles correctly', async () => {
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('Advanced Water Treatment')
    expect(wrapper.text()).toContain('Water Distribution Systems')
  })

  it('does NOT render incomplete/non-CR courses as certificates', async () => {
    const wrapper = await mountPage()
    expect(wrapper.text()).not.toContain('Incomplete Course')
  })

  it('shows empty state message when no completed certificates exist', async () => {
    getActiveEnrollment.mockResolvedValue({ response: [] })
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('No earned certificates found')
  })

  it('shows error message if certificates API fails', async () => {
    getActiveEnrollment.mockRejectedValue(new Error('Server error'))
    const wrapper = await mountPage()
    expect(wrapper.find('.error-message').exists()).toBe(true)
  })

  // ── Search filtering ───────────────────────

  it('filters certificates as user types in search box', async () => {
    const wrapper = await mountPage()
    const input = wrapper.find('input.search-input')
    await input.setValue('advanced')
    await flushPromises()
    const items = wrapper.findAll('.certificate-item')
    expect(items).toHaveLength(1)
    expect(wrapper.text()).toContain('Advanced Water Treatment')
  })

  it('shows no-match message when search returns no results', async () => {
    const wrapper = await mountPage()
    await wrapper.find('input.search-input').setValue('xyznotfound')
    await flushPromises()
    expect(wrapper.text()).toContain('No certificates match')
  })

  it('shows all certificates when search is cleared', async () => {
    const wrapper = await mountPage()
    const input = wrapper.find('input.search-input')
    await input.setValue('advanced')
    await input.setValue('')
    await flushPromises()
    expect(wrapper.findAll('.certificate-item')).toHaveLength(2)
  })

  // ── Download button ────────────────────────

  it('renders a Download Certificate button for each certificate', async () => {
    const wrapper = await mountPage()
    const buttons = wrapper.findAll('.download-btn')
    expect(buttons).toHaveLength(2)
  })

  it('download button is enabled by default', async () => {
    const wrapper = await mountPage()
    const btn = wrapper.find('.download-btn')
    expect(btn.attributes('disabled')).toBeUndefined()
  })

  // ── CEU / Contact Hours ────────────────────

  it('renders CEU and contact hours chips from enrollment record', async () => {
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('CEUs')
    expect(wrapper.text()).toContain('Contact Hours')
  })

  // ── Router links ───────────────────────────

  it('renders a router-link to /messages', async () => {
    const wrapper = await mountPage()
    const links = wrapper.findAll('a')
    const hrefs = links.map(l => l.attributes('href'))
    expect(hrefs).toContain('/messages')
  })

  it('renders a router-link to /purchase-history', async () => {
    const wrapper = await mountPage()
    const links = wrapper.findAll('a')
    const hrefs = links.map(l => l.attributes('href'))
    expect(hrefs).toContain('/purchase-history')
  })
})
