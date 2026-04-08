// This file contains end-to-end tests for the My Account Page using Playwright.
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npx playwright test e2e/MyAccountPageE2E.spec.js --project=chromium
// To run all frontend tests: npx playwright test --project=chromium
// NEEDS TO BE FIXED!!!

import { test, expect } from '@playwright/test'

test('My Account page loads main sections correctly', async ({ page }) => {
  await page.goto('/my-account')

  await expect(page.locator('h1.page-title')).toHaveText('My Account')
  await expect(page.locator('.profile-card')).toBeVisible()
  await expect(page.locator('.contact-card')).toContainText('Contact Info')
  await expect(page.locator('.operator-card')).toContainText('Operator Numbers')
  await expect(page.locator('.side.card')).toContainText('Transcripts')
  await expect(page.locator('.side.card')).toContainText('Purchase History')
})

test('Clicking View all transcripts navigates to the Certificates page', async ({ page }) => {
  await page.goto('/my-account')
  await page.locator('a.certificate-button').click()
  await expect(page).toHaveURL(/\/Certificates|\/certificates/)
})

test('Clicking View all purchases navigates to the purchase history page', async ({ page }) => {
  await page.goto('/my-account')
  await page.locator('a.purchase-history-button').click()
  await expect(page).toHaveURL(/\/purchase-history/)
})

test('Clicking Contact Info Edit opens the contact dialog', async ({ page }) => {
  await page.goto('/my-account')
  await page.locator('.contact-card button.btn.xsmall').click()

  await expect(page.locator('.contact-info-dialog')).toBeVisible()
  await expect(page.locator('.contact-info-dialog .header')).toContainText('User')
})

test('Clicking Cancel closes the contact dialog', async ({ page }) => {
  await page.goto('/my-account')
  await page.locator('.contact-card button.btn.xsmall').click()

  await expect(page.locator('.contact-info-dialog')).toBeVisible()
  await page.locator('.contact-info-dialog .cancel').click()
  await expect(page.locator('.contact-info-dialog')).not.toBeVisible()
})

test('Operator Numbers Edit navigates to the operator numbers page', async ({ page }) => {
  await page.goto('/my-account')
  await page.locator('.btn-link-OPnumbers-button').click()
  await expect(page).toHaveURL(/\/operatornumbers/)
})