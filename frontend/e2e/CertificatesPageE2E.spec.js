// This file contains end-to-end tests for the Certificates Page using Playwright.
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npx playwright test e2e/CertificatesPageE2E.spec.js --project=chromium
// To run all frontend tests: npx playwright test --project=chromium

import { test, expect } from '@playwright/test'

test('Certificates page loads and displays the page header', async ({ page }) => {
  await page.goto('/certificates')
  await expect(page.locator('h1.page-title')).toContainText('Certificates')
})

test('Certificates page loads dynamic certificate data correctly', async ({ page }) => {
  await page.goto('/certificates')
  // Wait for certificates to load
  await expect(page.locator('.loading-message')).not.toBeVisible({ timeout: 10000 })
  // Verify at least one certificate item is rendered
  await expect(page.locator('.certificate-item').first()).toBeVisible()
  // Verify certificate title is rendered
  await expect(page.locator('.cert-title').first()).not.toBeEmpty()
  // Verify meta chips are rendered (grade, CEUs, contact hours)
  await expect(page.locator('.meta-chip').first()).toBeVisible()
  // Verify download button is rendered and enabled
  await expect(page.locator('.download-btn').first()).toBeVisible()
  await expect(page.locator('.download-btn').first()).toBeEnabled()
})

test('Search input filters the certificate list in real time', async ({ page }) => {
  await page.goto('/certificates')
  await expect(page.locator('.loading-message')).not.toBeVisible({ timeout: 10000 })
  const totalBefore = await page.locator('.certificate-item').count()
  await page.locator('input.search-input').fill('water')
  await page.waitForTimeout(300)
  const totalAfter = await page.locator('.certificate-item').count()
  expect(totalAfter).toBeLessThanOrEqual(totalBefore)
})

test('Search input shows empty state message when no results match', async ({ page }) => {
  await page.goto('/certificates')
  await expect(page.locator('.loading-message')).not.toBeVisible({ timeout: 10000 })
  await page.locator('input.search-input').fill('xyznotfoundanywhere')
  await page.waitForTimeout(300)
  await expect(page.locator('.empty-message')).toBeVisible()
})

test('Clearing search input restores the full certificate list', async ({ page }) => {
  await page.goto('/certificates')
  await expect(page.locator('.loading-message')).not.toBeVisible({ timeout: 10000 })
  const countBefore = await page.locator('.certificate-item').count()
  await page.locator('input.search-input').fill('xyznotfoundanywhere')
  await page.waitForTimeout(300)
  await page.locator('input.search-input').fill('')
  await page.waitForTimeout(300)
  const countAfter = await page.locator('.certificate-item').count()
  expect(countAfter).toBe(countBefore)
})

test('Clicking View all messages navigates to /messages', async ({ page }) => {
  await page.goto('/certificates')
  await page.locator('a.side-footer[href="/messages"]').click()
  await expect(page).toHaveURL(/\/messages/)
})

test('Clicking View all purchases navigates to /purchase-history', async ({ page }) => {
  await page.goto('/certificates')
  await page.locator('a.side-footer', { hasText: '(View all purchases)' }).click()
  await expect(page).toHaveURL(/\/purchase-history/)
})

test('Ensure that page correctly handles bad API responses', async ({ page }) => {
  await page.goto('/certificates')
  // Verify page loads normally first
  await expect(page.locator('h1.page-title')).toContainText('Certificates')
  // Block all OWP API calls
  await page.route('**/api/accountDetails/**', route => route.abort())
  await page.route('**/api/activeEnrollment/**', route => route.abort())
  await page.route('**/api/enrollmentRecord/**', route => route.abort())
  // Reload with APIs blocked
  await page.reload()
  // Page should still render without crashing — header must still be visible
  await expect(page.locator('h1.page-title')).toContainText('Certificates')
  // Search input should still be usable
  await expect(page.locator('input.search-input')).toBeVisible()
  // Sidebar cards should still be visible
  await expect(page.locator('.side-card').first()).toBeVisible()
})
