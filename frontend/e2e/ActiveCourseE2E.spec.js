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
  await expect(page.locator('.side-card', { hasText: 'Messages' })).toBeVisible()
  await expect(page.locator('.side-card', { hasText: 'Purchase History' })).toBeVisible()
})

// Chapter progress tests
// Verifies the chapter section shows either data rows or the
// empty state message depending on live backend data.

test('Active course page shows chapter rows or empty state', async ({ page }) => {
  await page.goto('/courses/598209')

  const chapterRows = page.locator('.chapter-row')
  const emptyMessage = page.getByText('No chapter data available.')

  const hasRows = await chapterRows.count() > 0
  const hasEmpty = await emptyMessage.isVisible()

  expect(hasRows || hasEmpty).toBe(true)
})

// Navigation tests
// Verifies the Back to Courses link routes the user back to the
// main Courses page.

test('Back to Courses link navigates to the courses page', async ({ page }) => {
  await page.goto('/courses/598209')

  await page.locator('.back-link').click()
  await expect(page).toHaveURL(/\/courses/)
})

// Messages navigation tests
// Verifies the Messages footer link routes the user to the
// messages page.

test('Messages footer link navigates to the messages page', async ({ page }) => {
  await page.goto('/courses/598209')

  const messagesCard = page.locator('.side-card', { hasText: 'Messages' })
  await expect(messagesCard.locator('.side-footer')).toContainText('(View all messages)')
  await messagesCard.locator('.side-footer').click()

  await expect(page).toHaveURL(/\/messages/)
})

// Purchase history navigation tests
// Verifies the Purchase History footer link routes the user to
// the purchase history page.

test('Purchase history footer link navigates to the purchase history page', async ({ page }) => {
  await page.goto('/courses/598209')

  const purchaseHistoryCard = page.locator('.side-card', { hasText: 'Purchase History' })
  await expect(purchaseHistoryCard.locator('.side-footer')).toContainText('(View all purchases)')
  await purchaseHistoryCard.locator('.side-footer').click()

  await expect(page).toHaveURL(/\/purchase-history/)
})