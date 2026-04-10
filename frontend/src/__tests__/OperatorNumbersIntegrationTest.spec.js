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


    })

    it('loads and displays state in table', async () => {
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
        const wrapper = mountPage()
        await flushPromises()

        expect(wrapper.find('.state').text()).toContain('California')
    })

    it('loads and displays operator number in table', async () => {
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
        const wrapper = mountPage()
        await flushPromises()

        expect(wrapper.find('.number').text()).toContain('12345')
    })

    it('loads certificates preview from Complete enrollments only', async () => {
        api.getActiveEnrollment.mockResolvedValue({
        response: [
            { enrollid: 1, title: 'Course A', statustxt: 'Enrolled' },
            { enrollid: 2, title: 'Course B', statustxt: 'Complete' },
            { enrollid: 3, title: 'Course C', statustxt: 'Dropped' },
            { enrollid: 4, title: 'Course D', statustxt: 'Complete' },
        ],
        })

        const wrapper = mountPage()
        await flushPromises()

        const transcriptLinks = wrapper.findAll('.quick-links .purchase-history .side-link')

        expect(wrapper.text()).toContain('Course B')
        expect(wrapper.text()).toContain('Course D')
        expect(wrapper.text()).not.toContain('Course A')
        expect(wrapper.text()).not.toContain('Course C')
        expect(transcriptLinks.length).toBeGreaterThanOrEqual(2)
    })

    it('shows certificates empty state when no there is no completed enrollments', async () => {
        api.getActiveEnrollment.mockResolvedValue({
        response: [
            { enrollid: 1, title: 'Course A', statustxt: 'Enrolled' },
        ],
        })

        const wrapper = mountPage()
        await flushPromises()

        expect(wrapper.text()).toContain('No certificates available.')
    })

    it('shows operator numbers empty state when no operator numbers are available', async () => {
        api.getOperatorList.mockResolvedValue({
            response: [],
        })

        const wrapper = mountPage()
        await flushPromises()

        expect(wrapper.find('.table-body').text()).toContain('No operator numbers available.')
    })

    it('shows no new messages when there are no messages', async () => {
        const wrapper = mountPage()
        await flushPromises()

        expect(wrapper.text()).toContain('No messages available.')
    })
})