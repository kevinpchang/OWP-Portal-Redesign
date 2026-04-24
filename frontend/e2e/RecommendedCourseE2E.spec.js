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

  const messagesCard = page.locator('.side-card', { hasText: 'Messages' })
  await expect(messagesCard).toBeVisible()

  const purchaseHistoryCard = page.locator('.side-card', { hasText: 'Purchase History' })
  await expect(purchaseHistoryCard).toBeVisible()

  // Verify purchase history data loads
  await expect(purchaseHistoryCard).toContainText('963522')
  await expect(purchaseHistoryCard).toContainText('963500')
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

// Negative test section
// Verifies the Recommended Course page handles API failures without crashing
// and displays fallback states.

test('Recommended course page handles API failures with fallback states', async ({ page }) => {
  await page.route('**/api/getInvoices/**', route => route.abort())
  await page.route('**/api/getInvoiceData/**', route => route.abort())
  await page.route('**/api/messaging/threads**', route => route.abort())

  await page.goto('/recommended/1')

  await expect(page.locator('.courses-header')).toContainText('Courses')

  await expect(page.locator('.summary-tile')).toContainText(
    /Recommended Course|Course title unavailable/
  )

  await expect(page.locator('.chapter-progress-tile')).toContainText(
    /Course Contents|No chapter data available.|We couldn’t load this chapter data right now./
  )

  const messagesCard = page.locator('.side-card', { hasText: 'Messages' })
  await expect(messagesCard).toContainText(
    /No messages available.|We couldn’t load your messages right now./
  )

  const purchaseHistoryCard = page.locator('.side-card', { hasText: 'Purchase History' })
  await expect(purchaseHistoryCard).toContainText(
    /No purchase history available.|We couldn’t load your purchase history right now./
  )
})