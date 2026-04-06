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