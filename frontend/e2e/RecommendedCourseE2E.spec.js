// This file contains end-to-end tests for the Recommended Course Page using Playwright.
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npx playwright test e2e/RecommendedCourseE2E.spec.js --project=chromium
// To run all frontend tests: npx playwright test --project=chromium

import { test, expect } from '@playwright/test'

test('Recommended course page loads main sections correctly', async ({ page }) => {
  await page.goto('/recommended/1')

  await expect(page.locator('.courses-header')).toContainText('Courses')
  await expect(page.locator('.summary-tile')).toContainText('Recommended Course')
  await expect(page.locator('.chapter-progress-tile')).toContainText('Course Contents')
  await expect(page.locator('.side-card')).toContainText('Messages')
  await expect(page.locator('.side-card')).toContainText('Purchase History')
})

test('Recommended course page shows course content rows', async ({ page }) => {
  await page.goto('/recommended/1')

  await expect(page.locator('.chapter-row').first()).toBeVisible()
})

test('Back to Courses link navigates to the courses page', async ({ page }) => {
  await page.goto('/recommended/1')

  await page.locator('.back-link').click()
  await expect(page).toHaveURL(/\/courses/)
})

test('Messages footer link navigates to the messages page', async ({ page }) => {
  await page.goto('/recommended/1')

  await page.locator('a.side-footer[href="/messages"]').click()
  await expect(page).toHaveURL(/\/messages/)
})

test('Purchase history footer link navigates to the purchase history page', async ({ page }) => {
  await page.goto('/recommended/1')

  await page.locator('a.side-footer[href="/purchase-history"]').click()
  await expect(page).toHaveURL(/\/purchase-history/)
})