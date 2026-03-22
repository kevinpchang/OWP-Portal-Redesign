// Runs unit tests for the Header Component
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/Header.spec.js
// To run all frontend tests: npm run test:front

import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DashboardPage from '../page_components/HeaderComponent.vue'
import * as api from '@/services/owpAPI'

vi.mock('vue-router', () => ({
  useRoute: () => ({ name: 'HeaderComponent' }),
}))


vi.mock('@/services/owpAPI', () => ({
  getAccountDetails: vi.fn()
}))

// Header Component test
// These test give mock API responses then tests if components are correctly pulling the correct information.
// This test DOES NOT ensure if actual API fetches are working.
describe('HeaderComponent', () => {
  // Tests welcome-message loading
  it('getAccountDetails loads dynamic components on page and in dialog menus', async () => {
    api.getAccountDetails.mockResolvedValue({ response: { 
        "firstname": "Silicon",
        "fullname": "Silicon Scribes",
        "prfdemailval": "siliconscribes@gmail.com"
    } })
    
    const wrapper = mount(DashboardPage)
    await flushPromises()

    const accountbutton = wrapper.find('.account_button') // Find the account button
    const accountbuttontext = wrapper.find('.account_button .text')
    await accountbutton.trigger('focus') // Trigger focus on the account button to reveal the dialog

    // Find the text components after the focus trigger
    const name = wrapper.find('.account-button-dialog .top .info .right .name .text')
    const email = wrapper.find('.account-button-dialog .top .info .right .email .text')
    
    // The focus will reveal contact info and logout buttons
    const contactinfobutton = wrapper.findAll('.account-button-dialog .bottom .object') // Find buttons in the dialog
    await contactinfobutton[1].trigger('click') // Trigger a click for the contact info button
    const fullname = wrapper.find('.contact-info-dialog .dialog .header .text')

    expect(accountbuttontext.text()).toContain('Silicon')
    expect(name.text()).toContain('Silicon')
    expect(email.text()).toContain('siliconscribes@gmail.com')
    expect(fullname.text()).toContain('Silicon Scribes')
  })
})
