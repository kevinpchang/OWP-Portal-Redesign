// This file contains end-to-end tests for the Operator Numbers Page using Playwright.
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npx playwright test e2e/OperatorNumbersE2E.spec.js --project=chromium
// To run all frontend tests: npx playwright test --project=chromium

import { test, expect } from '@playwright/test'

test('Operator Numbers page loads main sections correctly', async ({ page }) => {
  await page.goto('/operatornumbers')

  await expect(page.locator('.title')).toContainText('Operator Numbers')
  
  await expect(page.locator('.quick-links .messages .header')).toContainText('Messages')
  await expect(page.locator('.quick-links .purchase-history .header')).toContainText('Certificates')
  
})

test('Clicking View all messages navigates to the Messages page', async ({ page }) => {
  await page.goto('/operatornumbers')
  //await expect(page.locator('.quick-links .messages .header')).toContainText('Messages')
  await page.locator('.messages .view-all .text').click()
  await expect(page).toHaveURL(/\/Messages|\/messages/)
})

test('Clicking View all certificates navigates to the Certificates page', async ({ page }) => {
  await page.goto('/operatornumbers')
  //await expect(page.locator('.quick-links .purchase-history .header')).toContainText('Certificates')
  await page.locator('.purchase-history .view-all .text').click()
  await expect(page).toHaveURL(/\/Certificates|\/certificates/)
})

test('Clicking Add Operator Number opens the add number popup', async ({ page }) => {
  await page.goto('/operatornumbers')
  await page.locator('.add-button').click()

  await expect(page.locator('.popup')).toBeVisible()
  await expect(page.locator('.popup .popup-title')).toContainText('Add Operator Number')
})

test('Clicking Edit opens the edit number popup', async ({ page }) => {
  await page.goto('/operatornumbers')
  await page.locator('.edit-button').click()

  await expect(page.locator('.popup')).toBeVisible()
  await expect(page.locator('.popup .popup-title')).toContainText('Edit Operator Number')
})

test('Clicking Remove opens the remove number popup', async ({ page }) => {
  await page.goto('/operatornumbers')
  await page.locator('.remove-button').click()

  await expect(page.locator('.popup')).toBeVisible()
  await expect(page.locator('.popup .popup-title')).toContainText('Remove Operator Number')
})