// This file contains end-to-end tests for the Courses Page using Playwright.
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npx playwright test e2e/CoursesPageE2E.spec.js --project=chromium
// To run all frontend tests: npx playwright test --project=chromium

import { test, expect } from '@playwright/test'

// Page structure tests
// Verifies the Courses page loads its main sections and sidebar
// cards correctly, including loaded card content.

test('Courses page loads main sections correctly', async ({ page }) => {
  await page.goto('/courses')

  await expect(page.locator('.page-title')).toContainText('Courses')
  await expect(page.locator('.active-card')).toContainText('Active Enrollments')
  await expect(page.getByRole('heading', { name: 'Completed Enrollments' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Recommended Courses' })).toBeVisible()

  const messagesCard = page.locator('.side-card', { hasText: 'Messages' })
  await expect(messagesCard).toBeVisible()

  const purchaseHistoryCard = page.locator('.side-card', { hasText: 'Purchase History' })
  await expect(purchaseHistoryCard).toBeVisible()

 // Verify purchase history data loads
  await expect(purchaseHistoryCard.getByText('Loading purchase history…')).not.toBeVisible({
  timeout: 15000,
})

await expect(purchaseHistoryCard).toContainText('963522', { timeout: 15000 })
await expect(purchaseHistoryCard).toContainText('963500', { timeout: 15000 })
})


// Recommended courses tests

test('Courses page shows recommended empty state correctly', async ({ page }) => {
  await page.goto('/courses')

  await expect(page.getByText('Loading recommended courses…')).not.toBeVisible({
    timeout: 15000,
  })

  await expect(page.locator('.recommended-empty')).toContainText('No Recommended Courses')
  await expect(page.locator('.recommended-empty')).toContainText(
    'You have no recommended courses available at this time.'
  )
  await expect(page.locator('.catalog-link')).toContainText('Browse Course Catalog')
})


// Active enrollment navigation tests

test('Clicking an active enrollment card navigates to the correct course page', async ({ page }) => {
  await page.goto('/courses')

  const activeCourseLink = page.locator('.active-card .course-row-link').first()
  await expect(activeCourseLink).toBeVisible()
  await activeCourseLink.click()

  await expect(page).toHaveURL(/\/courses\/\d+/)
})


// Messages navigation tests

test('Messages footer link navigates to the messages page', async ({ page }) => {
  await page.goto('/courses')

  const messagesCard = page.locator('.side-card', { hasText: 'Messages' })
  await expect(messagesCard.locator('.side-footer')).toContainText('(View all messages)')
  await messagesCard.locator('.side-footer').click()

  await expect(page).toHaveURL(/\/messages/)
})


// Purchase history navigation tests

test('Purchase history footer link navigates to the purchase history page', async ({ page }) => {
  await page.goto('/courses')

  const purchaseHistoryCard = page.locator('.side-card', { hasText: 'Purchase History' })
  await expect(purchaseHistoryCard.locator('.side-footer')).toContainText('(View all purchases)')
  await purchaseHistoryCard.locator('.side-footer').click()

  await expect(page).toHaveURL(/\/purchase-history/)
})


// Messages fallback test (mocked to avoid hanging)

test('Courses page shows a valid messages fallback state', async ({ page }) => {
  await page.route('**/api/messaging/threads**', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ threads: [] }),
    })
  )

  await page.goto('/courses')

  const messagesCard = page.locator('.side-card', { hasText: 'Messages' })

  await expect(messagesCard).toContainText('No messages available.', {
    timeout: 15000,
  })
})


// Negative test section
// Verifies the Courses page handles API failures without crashing
// and displays fallback states

test('Courses page handles API failures with fallback states', async ({ page }) => {
  await page.route('**/api/activeEnrollment/**', route => route.abort())
  await page.route('**/api/getInvoices/**', route => route.abort())
  await page.route('**/api/getCourseGrades/**', route => route.abort())
  await page.route('**/api/getInvoiceData/**', route => route.abort())
  await page.route('**/api/messaging/threads**', route => route.abort())

  await page.goto('/courses')

  await expect(page.locator('.page-title')).toContainText('Courses')

  await expect(page.locator('.active-card')).toContainText(
    /No active enrollments.|We couldn’t load your course information right now./
  )

  await expect(page.getByRole('heading', { name: 'Completed Enrollments' })).toBeVisible()
  await expect(
    page.locator('.course-card').filter({ hasText: 'Completed Enrollments' })
  ).toContainText(/No completed enrollments.|We couldn’t load your completed course information right now./)

  const messagesCard = page.locator('.side-card', { hasText: 'Messages' })
  await expect(messagesCard).toContainText(
    /No messages available.|We couldn’t load your messages right now./
  )

  const purchaseHistoryCard = page.locator('.side-card', { hasText: 'Purchase History' })
  await expect(purchaseHistoryCard).toContainText(
    /No purchase history available.|We couldn’t load your purchase history right now./
  )
})