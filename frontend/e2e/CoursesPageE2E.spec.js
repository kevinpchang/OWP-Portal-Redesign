// This file contains end-to-end tests for the Courses Page using Playwright.
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npx playwright test e2e/CoursesPageE2E.spec.js --project=chromium
// To run all frontend tests: npx playwright test --project=chromium

import { test, expect } from '@playwright/test'

test('Courses page loads main sections correctly', async ({ page }) => {
  await page.goto('/courses')

  await expect(page.locator('.page-title')).toContainText('Courses')
  await expect(page.locator('.active-card')).toContainText('Active Enrollments')
  await expect(page.getByRole('heading', { name: 'Completed Enrollments' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Recommended Courses' })).toBeVisible()
  await expect(page.locator('.side-card', { hasText: 'Messages' })).toBeVisible()
  await expect(page.locator('.side-card', { hasText: 'Purchase History' })).toBeVisible()
})

test('Courses page shows recommended empty state correctly', async ({ page }) => {
  await page.goto('/courses')

  await expect(page.locator('.recommended-empty')).toContainText('No Recommended Courses')
  await expect(page.locator('.recommended-empty')).toContainText('You have no recommended courses available at this time.')
  await expect(page.locator('.catalog-link')).toContainText('Browse Course Catalog')
})

test('Clicking an active enrollment card navigates to the correct course page', async ({ page }) => {
  await page.goto('/courses')

  const activeCourseLink = page.locator('.active-card .course-row-link').first()
  await expect(activeCourseLink).toBeVisible()
  await activeCourseLink.click()

  await expect(page).toHaveURL(/\/courses\/\d+/)
})

test('Messages footer link navigates to the messages page', async ({ page }) => {
  await page.goto('/courses')

  const messagesCard = page.locator('.side-card', { hasText: 'Messages' })
  await expect(messagesCard.locator('.side-footer')).toContainText('(View all messages)')
  await messagesCard.locator('.side-footer').click()

  await expect(page).toHaveURL(/\/messages/)
})

test('Purchase history footer link navigates to the purchase history page', async ({ page }) => {
  await page.goto('/courses')

  const purchaseHistoryCard = page.locator('.side-card', { hasText: 'Purchase History' })
  await expect(purchaseHistoryCard.locator('.side-footer')).toContainText('(View all purchases)')
  await purchaseHistoryCard.locator('.side-footer').click()

  await expect(page).toHaveURL(/\/purchase-history/)
})