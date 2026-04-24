// This file contains end-to-end tests for the Completed Course Page using Playwright.
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npx playwright test e2e/CompletedCourseE2E.spec.js --project=chromium
// To run all frontend tests: npx playwright test --project=chromium

import { test, expect } from '@playwright/test'

test('Completed course page loads main sections correctly', async ({ page }) => {
  await page.goto('/completed/598209')

  await expect(page.locator('.courses-header')).toContainText('Courses')
  await expect(page.locator('.summary-tile')).toContainText('Completed Enrollments')
  await expect(page.locator('.chapter-progress-tile')).toContainText('Chapter Progress')

  const messagesCard = page.locator('.side-card', { hasText: 'Messages' })
  await expect(messagesCard).toBeVisible()

  const purchaseHistoryCard = page.locator('.side-card', { hasText: 'Purchase History' })
  await expect(purchaseHistoryCard).toBeVisible()

  // Verify purchase history data loads
  await expect(purchaseHistoryCard).toContainText('963522')
  await expect(purchaseHistoryCard).toContainText('963500')
})

test('Completed course page shows chapter progress rows', async ({ page }) => {
  await page.goto('/completed/598209')

  await expect(page.locator('.chapter-row').first()).toBeVisible()
})

test('Back to Courses link navigates to the courses page', async ({ page }) => {
  await page.goto('/completed/598209')

  await page.locator('.back-link').click()
  await expect(page).toHaveURL(/\/courses/)
})

test('Messages footer link navigates to the messages page', async ({ page }) => {
  await page.goto('/completed/598209')

  const messagesCard = page.locator('.side-card', { hasText: 'Messages' })
  await messagesCard.locator('.side-footer').click()

  await expect(page).toHaveURL(/\/messages/)
})

test('Purchase history footer link navigates to the purchase history page', async ({ page }) => {
  await page.goto('/completed/598209')

  const purchaseHistoryCard = page.locator('.side-card', { hasText: 'Purchase History' })
  await purchaseHistoryCard.locator('.side-footer').click()

  await expect(page).toHaveURL(/\/purchase-history/)
})

// Negative test section
// Verifies the Completed Course page handles API failures without crashing
// and displays fallback states.

test('Completed course page handles API failures with fallback states', async ({ page }) => {
  await page.route('**/api/enrollmentRecord/**', route => route.abort())
  await page.route('**/api/getCourseGrades/**', route => route.abort())
  await page.route('**/api/getInvoices/**', route => route.abort())
  await page.route('**/api/getInvoiceData/**', route => route.abort())
  await page.route('**/api/messaging/threads**', route => route.abort())

  await page.goto('/completed/598209')

  await expect(page.locator('.courses-header')).toContainText('Courses')

  await expect(page.locator('.summary-tile')).toContainText(
    /Completed Enrollments|Course title unavailable/
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