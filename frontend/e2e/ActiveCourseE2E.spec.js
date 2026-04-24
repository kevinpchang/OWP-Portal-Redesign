// This file contains end-to-end tests for the Active Course Page using Playwright.
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npx playwright test e2e/ActiveCourseE2E.spec.js --project=chromium
// To run all frontend tests: npx playwright test --project=chromium

import { test, expect } from '@playwright/test'

// Page structure tests
// Verifies the Active Course page loads its main sections and
// sidebar cards correctly.

test('Active course page loads main sections correctly', async ({ page }) => {
  await page.goto('/courses/598209')

  await expect(page.locator('.courses-header')).toContainText('Courses')
  await expect(page.locator('.summary-tile')).toContainText('Active Enrollments')
  await expect(page.locator('.chapter-progress-tile')).toContainText('Chapter Progress')

  const messagesCard = page.locator('.side-card', { hasText: 'Messages' })
  await expect(messagesCard).toBeVisible()

  const purchaseHistoryCard = page.locator('.side-card', { hasText: 'Purchase History' })
  await expect(purchaseHistoryCard).toBeVisible()

  // ✅ Added: verify purchase history data loads
  await expect(purchaseHistoryCard).toContainText('963522')
  await expect(purchaseHistoryCard).toContainText('963500')
})


// Chapter progress tests
// Verifies the chapter section shows either data rows or the
// empty state message depending on live backend data.

test('Active course page shows chapter rows or empty state', async ({ page }) => {
  await page.goto('/courses/598209')

  await expect(page.getByText('Loading chapter progress…')).not.toBeVisible({ timeout: 10000 })

  const chapterRows = page.locator('.chapter-row')
  const emptyMessage = page.getByText('No chapter data available.')
  const errorMessage = page.getByText('We couldn’t load this chapter data right now.')

  const rowCount = await chapterRows.count()
  const hasEmpty = await emptyMessage.isVisible().catch(() => false)
  const hasError = await errorMessage.isVisible().catch(() => false)

  expect(rowCount > 0 || hasEmpty || hasError).toBe(true)
})


// Navigation tests

test('Back to Courses link navigates to the courses page', async ({ page }) => {
  await page.goto('/courses/598209')

  await page.locator('.back-link').click()
  await expect(page).toHaveURL(/\/courses/)
})


// Messages navigation tests

test('Messages footer link navigates to the messages page', async ({ page }) => {
  await page.goto('/courses/598209')

  const messagesCard = page.locator('.side-card', { hasText: 'Messages' })
  await expect(messagesCard.locator('.side-footer')).toContainText('(View all messages)')
  await messagesCard.locator('.side-footer').click()

  await expect(page).toHaveURL(/\/messages/)
})


// Purchase history navigation tests

test('Purchase history footer link navigates to the purchase history page', async ({ page }) => {
  await page.goto('/courses/598209')

  const purchaseHistoryCard = page.locator('.side-card', { hasText: 'Purchase History' })
  await expect(purchaseHistoryCard.locator('.side-footer')).toContainText('(View all purchases)')
  await purchaseHistoryCard.locator('.side-footer').click()

  await expect(page).toHaveURL(/\/purchase-history/)
})


// Negative test section
// Verifies the Active Course page handles API failures without crashing
// and displays fallback states.

test('Active course page handles API failures with fallback states', async ({ page }) => {
  await page.route('**/api/enrollmentRecord/**', route => route.abort())
  await page.route('**/api/getCourseGrades/**', route => route.abort())
  await page.route('**/api/getInvoices/**', route => route.abort())
  await page.route('**/api/getInvoiceData/**', route => route.abort())
  await page.route('**/api/messaging/threads**', route => route.abort())

  await page.goto('/courses/598209')

  await expect(page.locator('.courses-header')).toContainText('Courses')

  await expect(page.locator('.summary-tile')).toContainText(
    /Active Enrollments|Course title unavailable/
  )

  await expect(page.locator('.chapter-progress-tile')).toContainText(
    /No chapter data available.|We couldn’t load this chapter data right now.|Chapter Progress/
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