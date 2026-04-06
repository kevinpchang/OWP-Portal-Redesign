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
