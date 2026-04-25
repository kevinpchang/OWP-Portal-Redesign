// This file contains end-to-end tests for the Dashboard Page using Playwright.
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npx playwright test e2e/DashboardPageE2E.spec.js --project=chromium
// To run all frontend tests: npx playwright test --project=chromium

import { test, expect } from '@playwright/test'

test('Dashboard loads dynamic elements correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.welcome-message')).toContainText('Hello, Silicon')
    await expect(page.locator('.active-enrollments .body .object')).toHaveCount(1)
    await expect(page.locator('.active-enrollments .body')).toContainText('Drinking Water Specialist: Small Water System Operation and Maintenance')
    await expect(page.locator('.active-enrollments .body')).toContainText('Jan 01, 2050')
    await expect(page.locator('.active-enrollments .body .object .percent .text')).toContainText('88%')
    await expect(page.locator('.purchase-history .body')).toContainText('963522')
    await expect(page.locator('.purchase-history .body')).toContainText('963500')
})

test('Clicking on an Active Enrollment card navigates to the correct course page', async ({ page }) => {
    await page.goto('/')
    await page.click('.active-enrollments .body .object')
    await expect(page).toHaveURL(/\/courses\/598209/)
})

test('Clicking on a Purchase History card navigates to the correct invoice page', async ({ page }) => {
    await page.goto('/')
    await page.locator('.purchase-history .body .object', {hasText: '963522',}).click()
    await expect(page).toHaveURL(/\/purchase-history\/963522/)
})

test('Ensure that page correctly handles bad API responses, loads data from session instead', async ({ page }) => {
    let sawAlert = false

    await page.goto('/')
    await expect(page.locator('.welcome-message')).toContainText('Hello, Silicon')
    await expect(page.locator('.active-enrollments .body .object')).toHaveCount(1)
    await expect(page.locator('.active-enrollments .body')).toContainText('Drinking Water Specialist: Small Water System Operation and Maintenance')
    await expect(page.locator('.active-enrollments .body')).toContainText('Jan 01, 2050')
    await expect(page.locator('.active-enrollments .body .object .percent .text')).toContainText('88%')
    await expect(page.locator('.purchase-history .body')).toContainText('963522')
    await expect(page.locator('.purchase-history .body')).toContainText('963500')

    await page.route('**/api/accountDetails/**', route => route.abort())
    await page.route('**/api/activeEnrollment/**', route => route.abort())
    await page.route('**/api/getInvoices/**', route => route.abort())
    await page.route('**/api/getCourseGrades/**', route => route.abort())
    await page.route('**/api/getInvoiceData/**', route => route.abort())

    const dialogHandled = new Promise((resolve, reject) => {
        page.once('dialog', async dialog => {
            try {
                expect(dialog.type()).toBe('alert')
                expect(dialog.message()).toContain('Some data could not be refreshed')

                await dialog.accept()
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    })

    await page.reload()
    await dialogHandled

    await expect(page.locator('.welcome-message')).toContainText('Hello, Silicon')
    await expect(page.locator('.active-enrollments .body .object')).toHaveCount(1)
    await expect(page.locator('.active-enrollments .body')).toContainText('Drinking Water Specialist: Small Water System Operation and Maintenance')
    await expect(page.locator('.active-enrollments .body')).toContainText('Jan 01, 2050')
    await expect(page.locator('.active-enrollments .body .object .percent .text')).toContainText('88%')
    await expect(page.locator('.purchase-history .body')).toContainText('963522')
    await expect(page.locator('.purchase-history .body')).toContainText('963500')
})