// This file contains end-to-end tests for the Recommended Course Page using Playwright.
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npx playwright test e2e/RecommendedCourseE2E.spec.js --project=chromium
// To run all frontend tests: npx playwright test --project=chromium

import { test, expect } from '@playwright/test'

// Page structure tests
// Verifies the Recommended Course page loads its main sections
// and sidebar cards correctly.

test('Recommended course page loads main sections correctly', async ({ page }) => {
  await page.goto('/recommended/1')

  await expect(page.locator('.courses-header')).toContainText('Courses')
  await expect(page.locator('.summary-tile')).toContainText('Recommended Course')
  await expect(page.locator('.chapter-progress-tile')).toContainText('Course Contents')
  await expect(page.locator('.side-card', { hasText: 'Messages' })).toBeVisible()
  await expect(page.locator('.side-card', { hasText: 'Purchase History' })).toBeVisible()
})

// Course content tests
// Verifies at least one course content row is visible when
// chapter data exists.

test('Recommended course page shows course content rows', async ({ page }) => {
  await page.goto('/recommended/1')

  await expect(page.locator('.chapter-row').first()).toBeVisible()
})

// Navigation tests
// Verifies the Back to Courses link routes the user back to the
// main Courses page.

test('Back to Courses link navigates to the courses page', async ({ page }) => {
  await page.goto('/recommended/1')

  await page.locator('.back-link').click()
  await expect(page).toHaveURL(/\/courses/)
})

// Messages navigation tests
// Verifies the Messages footer link routes the user to the
// messages page.

test('Messages footer link navigates to the messages page', async ({ page }) => {
  await page.goto('/recommended/1')

  const messagesCard = page.locator('.side-card', { hasText: 'Messages' })
  await messagesCard.locator('.side-footer').click()

  await expect(page).toHaveURL(/\/messages/)
})

// Purchase history navigation tests
// Verifies the Purchase History footer link routes the user to
// the purchase history page.

test('Purchase history footer link navigates to the purchase history page', async ({ page }) => {
  await page.goto('/recommended/1')

  const purchaseHistoryCard = page.locator('.side-card', { hasText: 'Purchase History' })
  await purchaseHistoryCard.locator('.side-footer').click()

  await expect(page).toHaveURL(/\/purchase-history/)
})