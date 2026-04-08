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
  await expect(page.locator('.side-card')).toContainText('Messages')
  await expect(page.locator('.side-card')).toContainText('Purchase History')
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